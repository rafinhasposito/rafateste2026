-- ============================================================================
-- Passes (Expansão & Mapa Completo) + Cupons de Resgate (Mídia Kit)
-- ============================================================================
-- Regras de negócio:
-- 1. 1 Crédito (R$ 19,90 - package_1cr): libera 1 Casa (com 1º Foco incluso).
-- 2. Passe Expansão (R$ 49,90 - package_2cr / 3 créditos): libera 1 Casa escolhida + TODOS os 8 Focos.
-- 3. Passe Mapa Completo (R$ 99,90 - package_3cr / 7 créditos): libera TODAS as 12 Casas + TODOS os 8 Focos.
-- 4. Cupons de Resgate (redeem_codes): criados no Admin para 1_casa (1 cr), expansao (3 cr) ou full_map (7 cr).

-- 1. Atualiza preços e descrições oficiais em pricing_config
UPDATE public.pricing_config
SET label = '1 Casa Avulsa',
    description = 'Desbloqueia 1 Casa ou Cidade escolhida com o 1º Foco Principal incluso',
    credits = 1,
    price_brl = 19.90
WHERE key = 'package_1cr';

UPDATE public.pricing_config
SET label = 'Pacote Expansão',
    description = 'Passe para qualquer consulta: desbloqueia 1 Casa escolhida com TODOS os 8 Focos liberados',
    credits = 3,
    price_brl = 49.90
WHERE key = 'package_2cr';

UPDATE public.pricing_config
SET label = 'Mapa Completo',
    description = 'Super Promoção: desbloqueia TODAS as 12 Casas + TODOS os Focos na consulta que você escolher',
    credits = 7,
    price_brl = 99.90
WHERE key = 'package_3cr';

-- 2. Tabela de Cupons de Resgate / Mídia Kit
CREATE TABLE IF NOT EXISTS public.redeem_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    reward_type TEXT NOT NULL CHECK (reward_type IN ('1_casa', 'expansao', 'full_map')),
    credits_amount INTEGER NOT NULL CHECK (credits_amount > 0),
    recipient_name TEXT,
    note TEXT,
    max_uses INTEGER NOT NULL DEFAULT 1 CHECK (max_uses >= 1),
    uses_count INTEGER NOT NULL DEFAULT 0 CHECK (uses_count >= 0),
    active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_redeem_codes_code ON public.redeem_codes (upper(code));

CREATE TABLE IF NOT EXISTS public.redeem_code_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_id UUID NOT NULL REFERENCES public.redeem_codes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    credits_granted INTEGER NOT NULL,
    reward_type TEXT NOT NULL,
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (code_id, user_id)
);

ALTER TABLE public.redeem_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redeem_code_usages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage redeem_codes" ON public.redeem_codes;
CREATE POLICY "Admins manage redeem_codes" ON public.redeem_codes
    FOR ALL
    USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins view all redeem usages" ON public.redeem_code_usages;
CREATE POLICY "Admins view all redeem usages" ON public.redeem_code_usages
    FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users view own redeem usages" ON public.redeem_code_usages;
CREATE POLICY "Users view own redeem usages" ON public.redeem_code_usages
    FOR SELECT
    USING (auth.uid() = user_id);

-- 3. RPC para Admin criar cupom com segurança
CREATE OR REPLACE FUNCTION public.admin_create_redeem_code_v1(
    p_code TEXT,
    p_reward_type TEXT,
    p_recipient_name TEXT DEFAULT NULL,
    p_note TEXT DEFAULT NULL,
    p_max_uses INTEGER DEFAULT 1,
    p_expires_at TIMESTAMPTZ DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_clean_code TEXT;
    v_credits INTEGER;
    v_inserted RECORD;
BEGIN
    IF v_user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = v_user_id AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Acesso negado: requer privilégios de administrador.';
    END IF;

    v_clean_code := upper(regexp_replace(trim(COALESCE(p_code, '')), '\s+', '-', 'g'));
    IF length(v_clean_code) < 3 THEN
        RAISE EXCEPTION 'Código inválido (mínimo 3 caracteres).';
    END IF;

    v_credits := CASE p_reward_type
        WHEN '1_casa' THEN 1
        WHEN 'expansao' THEN 3
        WHEN 'full_map' THEN 7
        ELSE NULL
    END;

    IF v_credits IS NULL THEN
        RAISE EXCEPTION 'Tipo de benefício inválido. Use 1_casa, expansao ou full_map.';
    END IF;

    INSERT INTO public.redeem_codes (
        code, reward_type, credits_amount, recipient_name, note, max_uses, expires_at, created_by
    ) VALUES (
        v_clean_code,
        p_reward_type,
        v_credits,
        NULLIF(trim(COALESCE(p_recipient_name, '')), ''),
        NULLIF(trim(COALESCE(p_note, '')), ''),
        GREATEST(COALESCE(p_max_uses, 1), 1),
        p_expires_at,
        v_user_id
    )
    RETURNING * INTO v_inserted;

    RETURN to_jsonb(v_inserted);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_create_redeem_code_v1(TEXT, TEXT, TEXT, TEXT, INTEGER, TIMESTAMPTZ) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_create_redeem_code_v1(TEXT, TEXT, TEXT, TEXT, INTEGER, TIMESTAMPTZ) TO authenticated;

-- 4. RPC para usuário resgatar cupom do Mídia Kit
CREATE OR REPLACE FUNCTION public.redeem_code_v1(
    p_code TEXT
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_clean_code TEXT;
    v_coupon RECORD;
    v_already_used BOOLEAN;
    v_label TEXT;
    v_new_balance INTEGER;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Faça login para resgatar seu código.';
    END IF;

    v_clean_code := upper(trim(COALESCE(p_code, '')));
    IF v_clean_code = '' THEN
        RAISE EXCEPTION 'Digite um código válido.';
    END IF;

    SELECT * INTO v_coupon
    FROM public.redeem_codes
    WHERE upper(code) = v_clean_code
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cupom não encontrado. Verifique o código digitado.';
    END IF;

    IF NOT v_coupon.active THEN
        RAISE EXCEPTION 'Este cupom foi desativado.';
    END IF;

    IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < now() THEN
        RAISE EXCEPTION 'Este cupom expirou.';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.redeem_code_usages
        WHERE code_id = v_coupon.id AND user_id = v_user_id
    ) INTO v_already_used;

    IF v_already_used THEN
        RAISE EXCEPTION 'Você já resgatou este cupom em sua conta.';
    END IF;

    IF v_coupon.uses_count >= v_coupon.max_uses THEN
        RAISE EXCEPTION 'Este cupom já atingiu o limite máximo de resgates.';
    END IF;

    UPDATE public.redeem_codes
    SET uses_count = uses_count + 1,
        updated_at = now()
    WHERE id = v_coupon.id;

    INSERT INTO public.redeem_code_usages (code_id, user_id, credits_granted, reward_type)
    VALUES (v_coupon.id, v_user_id, v_coupon.credits_amount, v_coupon.reward_type);

    UPDATE public.profiles
    SET credits = credits + v_coupon.credits_amount,
        updated_at = now()
    WHERE user_id = v_user_id
    RETURNING credits INTO v_new_balance;

    v_label := CASE v_coupon.reward_type
        WHEN 'full_map' THEN 'Passe Mapa Completo (12 Casas + Todos os Focos)'
        WHEN 'expansao' THEN 'Passe Expansão (1 Casa + Todos os Focos)'
        ELSE '1 Casa Avulsa (1 Crédito)'
    END;

    INSERT INTO public.credit_transactions (user_id, amount, type, description)
    VALUES (
        v_user_id,
        v_coupon.credits_amount,
        'cupom_resgate',
        'Resgate de Cupom (' || v_coupon.code || '): ' || v_label
    );

    RETURN jsonb_build_object(
        'success', true,
        'code', v_coupon.code,
        'reward_type', v_coupon.reward_type,
        'credits_added', v_coupon.credits_amount,
        'new_balance', v_new_balance,
        'label', v_label
    );
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_code_v1(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_code_v1(TEXT) TO authenticated;

-- 5. Atualiza unlock_full_map_v1 para liberar TODAS as 12 Casas + TODOS os 8 Focos
CREATE OR REPLACE FUNCTION public.unlock_full_map_v1(
    p_consultation_id UUID
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_is_admin BOOLEAN;
    v_consultation RECORD;
    v_profile RECORD;
    v_full_cost INTEGER;
    v_house_cost INTEGER;
    v_already_unlocked_count INTEGER := 0;
    v_total_cost INTEGER;
    v_all_twelve INTEGER[] := ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    v_all_focuses JSONB := '["dinheiro","trabalho","identidade","rotina","networking","amor","espiritual","saude"]'::jsonb;
    v_focuses_map JSONB := '{}'::jsonb;
    v_house INTEGER;
    v_is_house_unlocked BOOLEAN;
    v_already_full BOOLEAN;
    v_new_result JSONB;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = v_user_id AND role = 'admin'
    ) INTO v_is_admin;

    SELECT * INTO v_consultation
    FROM public.consultations
    WHERE id = p_consultation_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Consultation not found';
    END IF;

    IF v_consultation.user_id != v_user_id THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    FOR v_house IN 1..12 LOOP
        v_focuses_map := v_focuses_map || jsonb_build_object(v_house::text, v_all_focuses);
    END LOOP;

    v_already_full :=
        (GREATEST(COALESCE(v_consultation.houses_unlocked, 0), 0) >= 12
         OR COALESCE((v_consultation.result->>'full_map_unlocked')::boolean, false))
        AND COALESCE((v_consultation.result->>'all_focuses_unlocked')::boolean, false);

    IF v_already_full THEN
        RETURN jsonb_build_object(
            'success', true,
            'charged', 0,
            'unlocked_houses', v_all_twelve
        );
    END IF;

    FOR v_house IN 1..12 LOOP
        v_is_house_unlocked := false;
        IF v_house = ANY(COALESCE(v_consultation.unlocked_houses, '{}')) THEN
            v_is_house_unlocked := true;
        ELSIF v_consultation.result ? 'unlocked_houses_list'
              AND (v_consultation.result->'unlocked_houses_list') @> to_jsonb(v_house) THEN
            v_is_house_unlocked := true;
        ELSIF v_consultation.goal IS NOT NULL AND v_house = v_consultation.goal THEN
            v_is_house_unlocked := true;
        ELSIF v_consultation.goal IS NULL AND v_house <= GREATEST(COALESCE(v_consultation.houses_unlocked, 0), 0) THEN
            v_is_house_unlocked := true;
        END IF;

        IF v_is_house_unlocked THEN
            v_already_unlocked_count := v_already_unlocked_count + 1;
        END IF;
    END LOOP;

    IF v_is_admin OR v_already_unlocked_count >= 12 THEN
        v_total_cost := 0;
    ELSE
        SELECT credits INTO v_full_cost
        FROM public.pricing_config
        WHERE key = 'cost_full_map' LIMIT 1;

        IF v_full_cost IS NULL OR v_full_cost <= 0 THEN
            v_full_cost := 7;
        END IF;

        SELECT credits INTO v_house_cost
        FROM public.pricing_config
        WHERE key = 'cost_house_1' LIMIT 1;

        v_total_cost := GREATEST(1, v_full_cost - (v_already_unlocked_count * COALESCE(v_house_cost, 1)));
    END IF;

    IF v_total_cost > 0 THEN
        SELECT * INTO v_profile
        FROM public.profiles
        WHERE user_id = v_user_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Profile not found';
        END IF;

        IF v_profile.credits < v_total_cost THEN
            RAISE EXCEPTION 'Insufficient credits';
        END IF;

        UPDATE public.profiles
        SET credits = credits - v_total_cost
        WHERE user_id = v_user_id;

        INSERT INTO public.credit_transactions (
            user_id, consultation_id, amount, type, description
        ) VALUES (
            v_user_id, p_consultation_id, -v_total_cost, 'cost_full_map',
            'Desbloqueio do Mapa Completo (12 Casas + Todos os Focos)'
        );
    END IF;

    v_new_result := COALESCE(v_consultation.result, '{}'::jsonb) || jsonb_build_object(
        'full_map_unlocked', true,
        'all_focuses_unlocked', true,
        'unlocked_houses_list', to_jsonb(v_all_twelve),
        'unlocked_focuses', v_focuses_map
    );

    UPDATE public.consultations
    SET houses_unlocked = 12,
        unlocked_houses = v_all_twelve,
        result = v_new_result
    WHERE id = p_consultation_id;

    RETURN jsonb_build_object(
        'success', true,
        'charged', v_total_cost,
        'unlocked_houses', v_all_twelve
    );
END;
$$;

REVOKE ALL ON FUNCTION public.unlock_full_map_v1(UUID) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.unlock_full_map_v1(UUID) TO authenticated;

NOTIFY pgrst, 'reload schema';
