-- ============================================================================
-- Sistema de Afiliados — Protocolo Solar (V1)
-- ============================================================================
-- Regras:
-- 1. Preços originais permanecem intocados (R$ 19,90 / R$ 49,90 / R$ 99,90).
-- 2. Comissão padrão de 20% (customizável por afiliado no Admin, 1% a 80%).
-- 3. Atribuição via ?ref=CODIGO (cookie/localStorage 30 dias + vínculo no perfil
--    e no pedido credit_orders.affiliate_id), com proteção contra auto-indicação.
-- 4. Cálculo automático e idempotente (UNIQUE order_id) dentro do RPC
--    process_mercadopago_payment — funciona com Pix, Cartão e Webhook sem
--    depender de redeploy imediato de Edge Function.
-- 5. Painel do afiliado (/afiliado) com dados LGPD-safe e gestão no Admin.
-- ============================================================================

-- 1. Tabela de Afiliados
CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT,
    pix_key TEXT,
    commission_rate NUMERIC(5,2) NOT NULL DEFAULT 20.00
        CHECK (commission_rate > 0 AND commission_rate <= 80),
    active BOOLEAN NOT NULL DEFAULT true,
    clicks_count INTEGER NOT NULL DEFAULT 0 CHECK (clicks_count >= 0),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT affiliates_code_format CHECK (length(code) >= 3 AND length(code) <= 32 AND code ~ '^[A-Z0-9_-]+$')
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_affiliates_code_upper
    ON public.affiliates (upper(code));
CREATE INDEX IF NOT EXISTS idx_affiliates_email_lower
    ON public.affiliates (lower(email)) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id
    ON public.affiliates (user_id) WHERE user_id IS NOT NULL;

-- 2. Tabela de Comissões por Pedido Pago
CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    order_id UUID NOT NULL UNIQUE REFERENCES public.credit_orders(id) ON DELETE CASCADE,
    buyer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    pricing_config_id TEXT,
    sale_amount_brl NUMERIC(10,2) NOT NULL CHECK (sale_amount_brl >= 0),
    commission_rate NUMERIC(5,2) NOT NULL CHECK (commission_rate > 0 AND commission_rate <= 80),
    commission_amount_brl NUMERIC(10,2) NOT NULL CHECK (commission_amount_brl >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    paid_at TIMESTAMPTZ,
    payout_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_affiliate_created
    ON public.affiliate_commissions (affiliate_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_status
    ON public.affiliate_commissions (status);

-- 3. Colunas de atribuição nas tabelas existentes (100% aditivas)
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS referred_by_affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE SET NULL;
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS referred_at TIMESTAMPTZ;

ALTER TABLE public.credit_orders
    ADD COLUMN IF NOT EXISTS affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_referred_by_affiliate
    ON public.profiles (referred_by_affiliate_id) WHERE referred_by_affiliate_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_credit_orders_affiliate_id
    ON public.credit_orders (affiliate_id) WHERE affiliate_id IS NOT NULL;

-- 4. Endurece trigger de profiles para impedir alteração direta de credits OU referred_by_affiliate_id via API
CREATE OR REPLACE FUNCTION public.prevent_direct_credits_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    IF current_user IN ('authenticated', 'anon') THEN
        IF NEW.credits IS DISTINCT FROM OLD.credits THEN
            RAISE EXCEPTION 'Direct updates to credits column are not allowed via API.';
        END IF;
        IF NEW.referred_by_affiliate_id IS DISTINCT FROM OLD.referred_by_affiliate_id THEN
            RAISE EXCEPTION 'Direct updates to referred_by_affiliate_id are not allowed via API.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- 5. RLS & Permissões de Tabela
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.affiliates FROM anon;
REVOKE ALL ON public.affiliate_commissions FROM anon;

DROP POLICY IF EXISTS "Admins manage affiliates" ON public.affiliates;
CREATE POLICY "Admins manage affiliates" ON public.affiliates
    FOR ALL
    USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Affiliates view own record" ON public.affiliates;
CREATE POLICY "Affiliates view own record" ON public.affiliates
    FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage affiliate commissions" ON public.affiliate_commissions;
CREATE POLICY "Admins manage affiliate commissions" ON public.affiliate_commissions
    FOR ALL
    USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Affiliates view own commissions" ON public.affiliate_commissions;
CREATE POLICY "Affiliates view own commissions" ON public.affiliate_commissions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.affiliates a
            WHERE a.id = affiliate_commissions.affiliate_id
              AND a.user_id = auth.uid()
        )
    );

-- 6. RPC Público: rastreia clique no link ?ref=CODIGO (anon + authenticated)
CREATE OR REPLACE FUNCTION public.track_affiliate_click_v1(
    p_code TEXT
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_clean_code TEXT;
    v_aff RECORD;
BEGIN
    v_clean_code := upper(regexp_replace(trim(COALESCE(p_code, '')), '[^A-Za-z0-9_-]', '', 'g'));
    IF length(v_clean_code) < 3 THEN
        RETURN jsonb_build_object('valid', false);
    END IF;

    UPDATE public.affiliates
    SET clicks_count = clicks_count + 1,
        updated_at = now()
    WHERE upper(code) = v_clean_code
      AND active = true
    RETURNING id, code, name INTO v_aff;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false);
    END IF;

    RETURN jsonb_build_object(
        'valid', true,
        'code', v_aff.code,
        'affiliate_name', v_aff.name
    );
END;
$$;

REVOKE ALL ON FUNCTION public.track_affiliate_click_v1(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_affiliate_click_v1(TEXT) TO anon, authenticated;

-- 7. RPC Autenticado: vincula indicação ao perfil do comprador (first-touch, anti-autoindicação)
CREATE OR REPLACE FUNCTION public.attach_referral_to_profile_v1(
    p_code TEXT
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_clean_code TEXT;
    v_aff RECORD;
    v_profile RECORD;
BEGIN
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('attached', false, 'reason', 'not_authenticated');
    END IF;

    v_clean_code := upper(regexp_replace(trim(COALESCE(p_code, '')), '[^A-Za-z0-9_-]', '', 'g'));
    IF length(v_clean_code) < 3 THEN
        RETURN jsonb_build_object('attached', false, 'reason', 'invalid_code');
    END IF;

    SELECT id, user_id, email, code, active
    INTO v_aff
    FROM public.affiliates
    WHERE upper(code) = v_clean_code
      AND active = true;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('attached', false, 'reason', 'affiliate_not_found');
    END IF;

    SELECT user_id, email, referred_by_affiliate_id
    INTO v_profile
    FROM public.profiles
    WHERE user_id = v_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('attached', false, 'reason', 'profile_not_found');
    END IF;

    -- Já possui afiliado vinculado (first-touch preservado)
    IF v_profile.referred_by_affiliate_id IS NOT NULL THEN
        RETURN jsonb_build_object('attached', false, 'reason', 'already_attributed');
    END IF;

    -- Proteção contra auto-indicação (mesmo user_id ou mesmo e-mail)
    IF v_aff.user_id = v_user_id OR (
        v_aff.email IS NOT NULL AND v_profile.email IS NOT NULL AND lower(v_aff.email) = lower(v_profile.email)
    ) THEN
        RETURN jsonb_build_object('attached', false, 'reason', 'self_referral_blocked');
    END IF;

    UPDATE public.profiles
    SET referred_by_affiliate_id = v_aff.id,
        referred_at = now()
    WHERE user_id = v_user_id;

    RETURN jsonb_build_object('attached', true, 'reason', 'ok', 'code', v_aff.code);
END;
$$;

REVOKE ALL ON FUNCTION public.attach_referral_to_profile_v1(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.attach_referral_to_profile_v1(TEXT) TO authenticated;

-- 8. RPC Autenticado: Dashboard completo do Afiliado (/afiliado) com LGPD
CREATE OR REPLACE FUNCTION public.get_my_affiliate_dashboard_v1()
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_jwt_email TEXT;
    v_aff RECORD;
    v_referred_users INTEGER := 0;
    v_total_sales INTEGER := 0;
    v_pending_sales INTEGER := 0;
    v_paid_sales INTEGER := 0;
    v_pending_brl NUMERIC(10,2) := 0;
    v_paid_brl NUMERIC(10,2) := 0;
    v_total_brl NUMERIC(10,2) := 0;
    v_volume_brl NUMERIC(10,2) := 0;
    v_commissions JSONB := '[]'::jsonb;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não autenticado.';
    END IF;

    SELECT * INTO v_aff
    FROM public.affiliates
    WHERE user_id = v_user_id
    LIMIT 1;

    -- Auto-vínculo seguro por e-mail verificado do JWT caso o Admin tenha cadastrado o e-mail antes
    IF NOT FOUND THEN
        v_jwt_email := lower(trim(COALESCE(auth.jwt() ->> 'email', '')));
        IF length(v_jwt_email) > 3 THEN
            UPDATE public.affiliates
            SET user_id = v_user_id,
                updated_at = now()
            WHERE user_id IS NULL
              AND email IS NOT NULL
              AND lower(trim(email)) = v_jwt_email
            RETURNING * INTO v_aff;
        END IF;
    END IF;

    IF v_aff.id IS NULL THEN
        RETURN jsonb_build_object('is_affiliate', false);
    END IF;

    SELECT COUNT(*)::INTEGER INTO v_referred_users
    FROM public.profiles
    WHERE referred_by_affiliate_id = v_aff.id;

    SELECT
        COUNT(*) FILTER (WHERE status <> 'cancelled')::INTEGER,
        COUNT(*) FILTER (WHERE status = 'pending')::INTEGER,
        COUNT(*) FILTER (WHERE status = 'paid')::INTEGER,
        COALESCE(SUM(commission_amount_brl) FILTER (WHERE status = 'pending'), 0)::NUMERIC(10,2),
        COALESCE(SUM(commission_amount_brl) FILTER (WHERE status = 'paid'), 0)::NUMERIC(10,2),
        COALESCE(SUM(commission_amount_brl) FILTER (WHERE status <> 'cancelled'), 0)::NUMERIC(10,2),
        COALESCE(SUM(sale_amount_brl) FILTER (WHERE status <> 'cancelled'), 0)::NUMERIC(10,2)
    INTO
        v_total_sales,
        v_pending_sales,
        v_paid_sales,
        v_pending_brl,
        v_paid_brl,
        v_total_brl,
        v_volume_brl
    FROM public.affiliate_commissions
    WHERE affiliate_id = v_aff.id;

    SELECT COALESCE(jsonb_agg(row_data ORDER BY created_at DESC), '[]'::jsonb)
    INTO v_commissions
    FROM (
        SELECT
            c.created_at,
            jsonb_build_object(
                'id', c.id,
                'order_id', c.order_id,
                'pricing_config_id', c.pricing_config_id,
                'package_label', COALESCE(pc.label,
                    CASE c.pricing_config_id
                        WHEN 'package_1cr' THEN '1 Casa Avulsa'
                        WHEN 'package_2cr' THEN 'Pacote Expansão'
                        WHEN 'package_3cr' THEN 'Mapa Completo'
                        ELSE 'Pacote Solar'
                    END
                ),
                'buyer_label', CASE
                    WHEN NULLIF(trim(COALESCE(p.display_name, p.full_name, '')), '') IS NOT NULL THEN
                        split_part(trim(COALESCE(p.display_name, p.full_name)), ' ', 1) || ' ***'
                    ELSE 'Cliente Solar'
                END,
                'sale_amount_brl', c.sale_amount_brl,
                'commission_rate', c.commission_rate,
                'commission_amount_brl', c.commission_amount_brl,
                'status', c.status,
                'paid_at', c.paid_at,
                'payout_note', c.payout_note,
                'created_at', c.created_at
            ) AS row_data
        FROM public.affiliate_commissions c
        LEFT JOIN public.profiles p ON p.user_id = c.buyer_user_id
        LEFT JOIN public.pricing_config pc ON pc.key = c.pricing_config_id
        WHERE c.affiliate_id = v_aff.id
        ORDER BY c.created_at DESC
        LIMIT 100
    ) sub;

    RETURN jsonb_build_object(
        'is_affiliate', true,
        'affiliate', jsonb_build_object(
            'id', v_aff.id,
            'code', v_aff.code,
            'name', v_aff.name,
            'email', v_aff.email,
            'pix_key', v_aff.pix_key,
            'commission_rate', v_aff.commission_rate,
            'active', v_aff.active,
            'clicks_count', v_aff.clicks_count,
            'created_at', v_aff.created_at
        ),
        'stats', jsonb_build_object(
            'clicks_count', v_aff.clicks_count,
            'referred_users_count', v_referred_users,
            'total_sales_count', v_total_sales,
            'pending_sales_count', v_pending_sales,
            'paid_sales_count', v_paid_sales,
            'pending_brl', v_pending_brl,
            'paid_brl', v_paid_brl,
            'total_brl', v_total_brl,
            'total_volume_brl', v_volume_brl
        ),
        'commissions', v_commissions
    );
END;
$$;

REVOKE ALL ON FUNCTION public.get_my_affiliate_dashboard_v1() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_affiliate_dashboard_v1() TO authenticated;

-- 9. RPC Autenticado: Afiliado atualiza somente sua própria chave Pix
CREATE OR REPLACE FUNCTION public.update_my_affiliate_pix_v1(
    p_pix_key TEXT
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_clean_pix TEXT;
    v_updated_id UUID;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não autenticado.';
    END IF;

    v_clean_pix := NULLIF(trim(COALESCE(p_pix_key, '')), '');

    UPDATE public.affiliates
    SET pix_key = v_clean_pix,
        updated_at = now()
    WHERE user_id = v_user_id
    RETURNING id INTO v_updated_id;

    IF v_updated_id IS NULL THEN
        RAISE EXCEPTION 'Cadastro de afiliado não encontrado para esta conta.';
    END IF;

    RETURN jsonb_build_object('ok', true, 'pix_key', v_clean_pix);
END;
$$;

REVOKE ALL ON FUNCTION public.update_my_affiliate_pix_v1(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_my_affiliate_pix_v1(TEXT) TO authenticated;

-- 10. RPC Admin: Criar Afiliado (20% padrão, auto-vincula user_id se e-mail já existir)
CREATE OR REPLACE FUNCTION public.admin_create_affiliate_v1(
    p_name TEXT,
    p_code TEXT,
    p_email TEXT DEFAULT NULL,
    p_commission_rate NUMERIC DEFAULT 20.00,
    p_pix_key TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_clean_name TEXT;
    v_clean_code TEXT;
    v_clean_email TEXT;
    v_rate NUMERIC(5,2);
    v_linked_user_id UUID := NULL;
    v_inserted RECORD;
BEGIN
    IF v_admin_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = v_admin_id AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Acesso negado: requer privilégios de administrador.';
    END IF;

    v_clean_name := trim(COALESCE(p_name, ''));
    IF length(v_clean_name) < 2 THEN
        RAISE EXCEPTION 'Informe o nome do afiliado.';
    END IF;

    v_clean_code := upper(regexp_replace(trim(COALESCE(p_code, '')), '[^A-Za-z0-9_-]', '', 'g'));
    IF length(v_clean_code) < 3 OR length(v_clean_code) > 32 THEN
        RAISE EXCEPTION 'O código do afiliado deve ter entre 3 e 32 caracteres (letras, números, - ou _).';
    END IF;

    IF EXISTS (SELECT 1 FROM public.affiliates WHERE upper(code) = v_clean_code) THEN
        RAISE EXCEPTION 'Já existe um afiliado usando o código %.', v_clean_code;
    END IF;

    v_rate := COALESCE(p_commission_rate, 20.00);
    IF v_rate <= 0 OR v_rate > 80 THEN
        RAISE EXCEPTION 'A comissão deve ficar entre 1%% e 80%%.';
    END IF;

    v_clean_email := NULLIF(lower(trim(COALESCE(p_email, ''))), '');
    IF v_clean_email IS NOT NULL THEN
        SELECT p.user_id INTO v_linked_user_id
        FROM public.profiles p
        WHERE lower(trim(COALESCE(p.email, ''))) = v_clean_email
          AND NOT EXISTS (SELECT 1 FROM public.affiliates a WHERE a.user_id = p.user_id)
        LIMIT 1;
    END IF;

    INSERT INTO public.affiliates (
        user_id,
        code,
        name,
        email,
        pix_key,
        commission_rate,
        active,
        notes,
        created_by
    ) VALUES (
        v_linked_user_id,
        v_clean_code,
        v_clean_name,
        v_clean_email,
        NULLIF(trim(COALESCE(p_pix_key, '')), ''),
        v_rate,
        true,
        NULLIF(trim(COALESCE(p_notes, '')), ''),
        v_admin_id
    )
    RETURNING * INTO v_inserted;

    RETURN to_jsonb(v_inserted);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_create_affiliate_v1(TEXT, TEXT, TEXT, NUMERIC, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_create_affiliate_v1(TEXT, TEXT, TEXT, NUMERIC, TEXT, TEXT) TO authenticated;

-- 11. RPC Admin: Atualizar Afiliado (taxa %, status ativo, pix, e-mail, notas)
CREATE OR REPLACE FUNCTION public.admin_update_affiliate_v1(
    p_affiliate_id UUID,
    p_commission_rate NUMERIC DEFAULT NULL,
    p_active BOOLEAN DEFAULT NULL,
    p_pix_key TEXT DEFAULT NULL,
    p_email TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_clean_email TEXT;
    v_linked_user_id UUID;
    v_updated RECORD;
BEGIN
    IF v_admin_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = v_admin_id AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Acesso negado: requer privilégios de administrador.';
    END IF;

    IF p_commission_rate IS NOT NULL AND (p_commission_rate <= 0 OR p_commission_rate > 80) THEN
        RAISE EXCEPTION 'A comissão deve ficar entre 1%% e 80%%.';
    END IF;

    IF p_email IS NOT NULL THEN
        v_clean_email := NULLIF(lower(trim(p_email)), '');
        IF v_clean_email IS NOT NULL THEN
            SELECT p.user_id INTO v_linked_user_id
            FROM public.profiles p
            WHERE lower(trim(COALESCE(p.email, ''))) = v_clean_email
              AND NOT EXISTS (
                  SELECT 1 FROM public.affiliates a
                  WHERE a.user_id = p.user_id AND a.id <> p_affiliate_id
              )
            LIMIT 1;
        END IF;
    END IF;

    UPDATE public.affiliates
    SET commission_rate = COALESCE(p_commission_rate, commission_rate),
        active = COALESCE(p_active, active),
        pix_key = CASE WHEN p_pix_key IS NOT NULL THEN NULLIF(trim(p_pix_key), '') ELSE pix_key END,
        email = CASE WHEN p_email IS NOT NULL THEN v_clean_email ELSE email END,
        user_id = CASE
            WHEN p_email IS NOT NULL AND v_linked_user_id IS NOT NULL THEN v_linked_user_id
            ELSE user_id
        END,
        notes = CASE WHEN p_notes IS NOT NULL THEN NULLIF(trim(p_notes), '') ELSE notes END,
        updated_at = now()
    WHERE id = p_affiliate_id
    RETURNING * INTO v_updated;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Afiliado não encontrado.';
    END IF;

    RETURN to_jsonb(v_updated);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_affiliate_v1(UUID, NUMERIC, BOOLEAN, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_affiliate_v1(UUID, NUMERIC, BOOLEAN, TEXT, TEXT, TEXT) TO authenticated;

-- 12. RPC Admin: Marcar 1 comissão como Paga
CREATE OR REPLACE FUNCTION public.admin_mark_commission_paid_v1(
    p_commission_id UUID,
    p_note TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_updated RECORD;
BEGIN
    IF v_admin_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = v_admin_id AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Acesso negado: requer privilégios de administrador.';
    END IF;

    UPDATE public.affiliate_commissions
    SET status = 'paid',
        paid_at = now(),
        payout_note = COALESCE(NULLIF(trim(COALESCE(p_note, '')), ''), payout_note)
    WHERE id = p_commission_id
      AND status = 'pending'
    RETURNING * INTO v_updated;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Comissão pendente não encontrada.';
    END IF;

    RETURN to_jsonb(v_updated);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_mark_commission_paid_v1(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_mark_commission_paid_v1(UUID, TEXT) TO authenticated;

-- 13. RPC Admin: Liquidar todas as comissões pendentes de um afiliado (repasse Pix em lote)
CREATE OR REPLACE FUNCTION public.admin_mark_affiliate_payout_v1(
    p_affiliate_id UUID,
    p_note TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_paid_count INTEGER := 0;
    v_paid_total NUMERIC(10,2) := 0;
BEGIN
    IF v_admin_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = v_admin_id AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Acesso negado: requer privilégios de administrador.';
    END IF;

    WITH updated AS (
        UPDATE public.affiliate_commissions
        SET status = 'paid',
            paid_at = now(),
            payout_note = COALESCE(NULLIF(trim(COALESCE(p_note, '')), ''), 'Repasse Pix liquidado')
        WHERE affiliate_id = p_affiliate_id
          AND status = 'pending'
        RETURNING commission_amount_brl
    )
    SELECT COUNT(*)::INTEGER, COALESCE(SUM(commission_amount_brl), 0)::NUMERIC(10,2)
    INTO v_paid_count, v_paid_total
    FROM updated;

    RETURN jsonb_build_object(
        'ok', true,
        'paid_count', v_paid_count,
        'paid_total_brl', v_paid_total
    );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_mark_affiliate_payout_v1(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_mark_affiliate_payout_v1(UUID, TEXT) TO authenticated;

-- 14. RPC Admin: Visão completa de todos os afiliados + comissões recentes (sem N+1)
CREATE OR REPLACE FUNCTION public.admin_list_affiliates_overview_v1()
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_affiliates JSONB := '[]'::jsonb;
    v_commissions JSONB := '[]'::jsonb;
BEGIN
    IF v_admin_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = v_admin_id AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Acesso negado: requer privilégios de administrador.';
    END IF;

    SELECT COALESCE(jsonb_agg(row_data ORDER BY created_at DESC), '[]'::jsonb)
    INTO v_affiliates
    FROM (
        SELECT
            a.created_at,
            jsonb_build_object(
                'id', a.id,
                'user_id', a.user_id,
                'code', a.code,
                'name', a.name,
                'email', a.email,
                'pix_key', a.pix_key,
                'commission_rate', a.commission_rate,
                'active', a.active,
                'clicks_count', a.clicks_count,
                'notes', a.notes,
                'created_at', a.created_at,
                'referred_users_count', COALESCE(ref_stats.cnt, 0),
                'sales_count', COALESCE(comm_stats.sales_count, 0),
                'pending_brl', COALESCE(comm_stats.pending_brl, 0),
                'paid_brl', COALESCE(comm_stats.paid_brl, 0),
                'total_brl', COALESCE(comm_stats.total_brl, 0),
                'volume_brl', COALESCE(comm_stats.volume_brl, 0)
            ) AS row_data
        FROM public.affiliates a
        LEFT JOIN (
            SELECT referred_by_affiliate_id, COUNT(*)::INTEGER AS cnt
            FROM public.profiles
            WHERE referred_by_affiliate_id IS NOT NULL
            GROUP BY referred_by_affiliate_id
        ) ref_stats ON ref_stats.referred_by_affiliate_id = a.id
        LEFT JOIN (
            SELECT
                affiliate_id,
                COUNT(*) FILTER (WHERE status <> 'cancelled')::INTEGER AS sales_count,
                COALESCE(SUM(commission_amount_brl) FILTER (WHERE status = 'pending'), 0)::NUMERIC(10,2) AS pending_brl,
                COALESCE(SUM(commission_amount_brl) FILTER (WHERE status = 'paid'), 0)::NUMERIC(10,2) AS paid_brl,
                COALESCE(SUM(commission_amount_brl) FILTER (WHERE status <> 'cancelled'), 0)::NUMERIC(10,2) AS total_brl,
                COALESCE(SUM(sale_amount_brl) FILTER (WHERE status <> 'cancelled'), 0)::NUMERIC(10,2) AS volume_brl
            FROM public.affiliate_commissions
            GROUP BY affiliate_id
        ) comm_stats ON comm_stats.affiliate_id = a.id
    ) sub;

    SELECT COALESCE(jsonb_agg(row_data ORDER BY created_at DESC), '[]'::jsonb)
    INTO v_commissions
    FROM (
        SELECT
            c.created_at,
            jsonb_build_object(
                'id', c.id,
                'affiliate_id', c.affiliate_id,
                'affiliate_name', a.name,
                'affiliate_code', a.code,
                'affiliate_pix_key', a.pix_key,
                'order_id', c.order_id,
                'pricing_config_id', c.pricing_config_id,
                'package_label', COALESCE(pc.label,
                    CASE c.pricing_config_id
                        WHEN 'package_1cr' THEN '1 Casa Avulsa'
                        WHEN 'package_2cr' THEN 'Pacote Expansão'
                        WHEN 'package_3cr' THEN 'Mapa Completo'
                        ELSE 'Pacote Solar'
                    END
                ),
                'buyer_name', COALESCE(p.display_name, p.full_name, 'Cliente'),
                'buyer_email', p.email,
                'sale_amount_brl', c.sale_amount_brl,
                'commission_rate', c.commission_rate,
                'commission_amount_brl', c.commission_amount_brl,
                'status', c.status,
                'paid_at', c.paid_at,
                'payout_note', c.payout_note,
                'created_at', c.created_at
            ) AS row_data
        FROM public.affiliate_commissions c
        JOIN public.affiliates a ON a.id = c.affiliate_id
        LEFT JOIN public.profiles p ON p.user_id = c.buyer_user_id
        LEFT JOIN public.pricing_config pc ON pc.key = c.pricing_config_id
        ORDER BY c.created_at DESC
        LIMIT 200
    ) sub;

    RETURN jsonb_build_object(
        'affiliates', v_affiliates,
        'commissions', v_commissions
    );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_affiliates_overview_v1() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_affiliates_overview_v1() TO authenticated;

-- 15. Atualiza process_mercadopago_payment preservando 100% da lógica de créditos
--     e registrando comissão do afiliado atomicamente (idempotente via UNIQUE order_id)
CREATE OR REPLACE FUNCTION public.process_mercadopago_payment(
    p_order_id UUID,
    p_payment_id TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_order RECORD;
    v_buyer_profile RECORD;
    v_affiliate_id UUID;
    v_affiliate RECORD;
    v_commission_amount NUMERIC(10,2);
BEGIN
    SELECT * INTO v_order FROM public.credit_orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Order not found'; END IF;
    IF v_order.status = 'approved' THEN RETURN FALSE; END IF;

    UPDATE public.credit_orders
    SET status = 'approved',
        mercadopago_payment_id = p_payment_id,
        paid_at = timezone('utc'::text, now()),
        updated_at = timezone('utc'::text, now())
    WHERE id = p_order_id;

    UPDATE public.profiles
    SET credits = credits + v_order.credits_amount
    WHERE user_id = v_order.user_id;

    INSERT INTO public.credit_transactions (user_id, amount, type, description)
    VALUES (
        v_order.user_id,
        v_order.credits_amount,
        'compra_mercadopago',
        'Compra de pacote: ' || v_order.pricing_config_id
    );

    -- Atribuição de comissão de afiliado (sem alterar valor pago nem bloquear aprovação do cliente)
    SELECT email, referred_by_affiliate_id
    INTO v_buyer_profile
    FROM public.profiles
    WHERE user_id = v_order.user_id;

    v_affiliate_id := COALESCE(v_order.affiliate_id, v_buyer_profile.referred_by_affiliate_id);

    IF v_affiliate_id IS NOT NULL AND COALESCE(v_order.amount, 0) > 0 THEN
        SELECT id, user_id, email, commission_rate, active
        INTO v_affiliate
        FROM public.affiliates
        WHERE id = v_affiliate_id;

        IF FOUND
           AND v_affiliate.active = true
           AND v_affiliate.user_id IS DISTINCT FROM v_order.user_id
           AND (
               v_affiliate.email IS NULL
               OR v_buyer_profile.email IS NULL
               OR lower(trim(v_affiliate.email)) <> lower(trim(v_buyer_profile.email))
           )
        THEN
            IF v_order.affiliate_id IS NULL THEN
                UPDATE public.credit_orders
                SET affiliate_id = v_affiliate.id
                WHERE id = p_order_id;
            END IF;

            v_commission_amount := round((v_order.amount * v_affiliate.commission_rate / 100.0)::numeric, 2);

            INSERT INTO public.affiliate_commissions (
                affiliate_id,
                order_id,
                buyer_user_id,
                pricing_config_id,
                sale_amount_brl,
                commission_rate,
                commission_amount_brl,
                status
            ) VALUES (
                v_affiliate.id,
                p_order_id,
                v_order.user_id,
                v_order.pricing_config_id,
                round(v_order.amount::numeric, 2),
                v_affiliate.commission_rate,
                v_commission_amount,
                'pending'
            )
            ON CONFLICT (order_id) DO NOTHING;
        END IF;
    END IF;

    RETURN TRUE;
END;
$$;

-- Preserva bloqueio estrito: somente service_role (Edge Functions/Webhook) pode aprovar pagamentos
REVOKE EXECUTE ON FUNCTION public.process_mercadopago_payment(UUID, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.process_mercadopago_payment(UUID, TEXT) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.process_mercadopago_payment(UUID, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.process_mercadopago_payment(UUID, TEXT) TO service_role;
