-- ============================================================================
-- Endurecimento Antifraude para Cupons de Resgate (Mídia Kit & Convidados VIP)
-- ============================================================================
-- 1. Constraint física: uses_count nunca pode ultrapassar max_uses no Postgres.
-- 2. Tabela redeem_code_attempts: registra tentativas e bloqueia força bruta
--    (máximo de 5 tentativas inválidas a cada 15 minutos por usuário).
-- 3. Lock por usuário (profiles FOR UPDATE) + lock por cupom (redeem_codes FOR UPDATE)
--    para impedir race conditions e ataques paralelos.
-- 4. Gerador CSPRNG no banco via gen_random_uuid() caso p_code não seja informado.

ALTER TABLE public.redeem_codes
    DROP CONSTRAINT IF EXISTS redeem_codes_uses_within_max;

ALTER TABLE public.redeem_codes
    ADD CONSTRAINT redeem_codes_uses_within_max CHECK (uses_count <= max_uses);

CREATE TABLE IF NOT EXISTS public.redeem_code_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    attempted_code TEXT NOT NULL,
    success BOOLEAN NOT NULL DEFAULT false,
    failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_redeem_attempts_user_time
    ON public.redeem_code_attempts (user_id, created_at DESC);

ALTER TABLE public.redeem_code_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins view redeem attempts" ON public.redeem_code_attempts;
CREATE POLICY "Admins view redeem attempts" ON public.redeem_code_attempts
    FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Defesa em profundidade: anônimos nunca acessam tabelas de cupom/tentativa
REVOKE ALL ON public.redeem_codes FROM anon;
REVOKE ALL ON public.redeem_code_usages FROM anon;
REVOKE ALL ON public.redeem_code_attempts FROM anon;

-- Gerador criptográfico no servidor (8 caracteres sem letras ambíguas = ~1,1 trilhão de combinações)
CREATE OR REPLACE FUNCTION public.generate_secure_coupon_code(
    p_prefix TEXT DEFAULT 'SOLAR'
) RETURNS TEXT
LANGUAGE plpgsql VOLATILE
SET search_path = public, pg_temp
AS $$
DECLARE
    v_alphabet CONSTANT TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    v_prefix TEXT;
    v_bytes BYTEA;
    v_code TEXT := '';
    v_idx INTEGER;
    i INTEGER;
BEGIN
    v_prefix := upper(regexp_replace(COALESCE(p_prefix, 'SOLAR'), '[^A-Za-z0-9]', '', 'g'));
    IF length(v_prefix) = 0 THEN
        v_prefix := 'SOLAR';
    END IF;

    v_bytes := decode(replace(gen_random_uuid()::text, '-', ''), 'hex');
    FOR i IN 0..7 LOOP
        v_idx := (get_byte(v_bytes, i) & 31) + 1;
        v_code := v_code || substr(v_alphabet, v_idx, 1);
    END LOOP;

    RETURN v_prefix || '-' || substr(v_code, 1, 4) || '-' || substr(v_code, 5, 4);
END;
$$;

REVOKE ALL ON FUNCTION public.generate_secure_coupon_code(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generate_secure_coupon_code(TEXT) TO authenticated;

-- Admin: cria cupom com código informado ou gerado via CSPRNG no servidor
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
    IF length(v_clean_code) = 0 THEN
        v_clean_code := public.generate_secure_coupon_code('SOLAR');
    ELSIF length(v_clean_code) < 4 THEN
        RAISE EXCEPTION 'Código inválido (mínimo 4 caracteres).';
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

    IF EXISTS (SELECT 1 FROM public.redeem_codes WHERE upper(code) = v_clean_code) THEN
        RAISE EXCEPTION 'Já existe um cupom com este código.';
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

-- Resgate com trava contra força bruta + serialização + uso único atômico
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
    v_recent_failures INTEGER := 0;
    v_label TEXT;
    v_new_balance INTEGER;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Faça login para resgatar seu código.';
    END IF;

    -- Serializa tentativas por usuário (bloqueia rajadas paralelas)
    PERFORM 1 FROM public.profiles WHERE user_id = v_user_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Perfil não encontrado. Tente sair e entrar novamente.');
    END IF;

    -- Rate limit: bloqueia após 5 erros nos últimos 15 minutos
    SELECT count(*) INTO v_recent_failures
    FROM public.redeem_code_attempts
    WHERE user_id = v_user_id
      AND success = false
      AND created_at > now() - interval '15 minutes';

    IF v_recent_failures >= 5 THEN
        RETURN jsonb_build_object(
            'success', false,
            'rate_limited', true,
            'error', 'Muitas tentativas inválidas. Aguarde 15 minutos antes de tentar outro código.'
        );
    END IF;

    v_clean_code := upper(trim(COALESCE(p_code, '')));
    IF length(v_clean_code) < 3 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Digite um código de cupom válido.');
    END IF;

    SELECT * INTO v_coupon
    FROM public.redeem_codes
    WHERE upper(code) = v_clean_code
    FOR UPDATE;

    IF NOT FOUND THEN
        INSERT INTO public.redeem_code_attempts (user_id, attempted_code, success, failure_reason)
        VALUES (v_user_id, left(v_clean_code, 64), false, 'not_found');
        RETURN jsonb_build_object('success', false, 'error', 'Cupom não encontrado. Verifique o código digitado.');
    END IF;

    IF NOT v_coupon.active THEN
        INSERT INTO public.redeem_code_attempts (user_id, attempted_code, success, failure_reason)
        VALUES (v_user_id, left(v_clean_code, 64), false, 'inactive');
        RETURN jsonb_build_object('success', false, 'error', 'Este cupom foi desativado.');
    END IF;

    IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < now() THEN
        INSERT INTO public.redeem_code_attempts (user_id, attempted_code, success, failure_reason)
        VALUES (v_user_id, left(v_clean_code, 64), false, 'expired');
        RETURN jsonb_build_object('success', false, 'error', 'Este cupom expirou.');
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.redeem_code_usages
        WHERE code_id = v_coupon.id AND user_id = v_user_id
    ) INTO v_already_used;

    IF v_already_used THEN
        INSERT INTO public.redeem_code_attempts (user_id, attempted_code, success, failure_reason)
        VALUES (v_user_id, left(v_clean_code, 64), false, 'already_used_by_user');
        RETURN jsonb_build_object('success', false, 'error', 'Você já resgatou este cupom em sua conta.');
    END IF;

    IF v_coupon.uses_count >= v_coupon.max_uses THEN
        INSERT INTO public.redeem_code_attempts (user_id, attempted_code, success, failure_reason)
        VALUES (v_user_id, left(v_clean_code, 64), false, 'exhausted');
        RETURN jsonb_build_object('success', false, 'error', 'Este cupom já foi resgatado e não aceita novos usos.');
    END IF;

    UPDATE public.redeem_codes
    SET uses_count = uses_count + 1,
        updated_at = now()
    WHERE id = v_coupon.id
      AND uses_count < max_uses;

    IF NOT FOUND THEN
        INSERT INTO public.redeem_code_attempts (user_id, attempted_code, success, failure_reason)
        VALUES (v_user_id, left(v_clean_code, 64), false, 'race_exhausted');
        RETURN jsonb_build_object('success', false, 'error', 'Este cupom já atingiu o limite máximo de resgates.');
    END IF;

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

    INSERT INTO public.redeem_code_attempts (user_id, attempted_code, success)
    VALUES (v_user_id, left(v_clean_code, 64), true);

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

NOTIFY pgrst, 'reload schema';
