-- ============================================================================
-- Auto-cadastro de Afiliados (Self-Serve) — Protocolo Solar
-- ============================================================================
-- Permite que qualquer usuário autenticado ative seu link ?ref=CODIGO em 1 clique
-- diretamente em /afiliado, com taxa travada em 20% no servidor, proteção contra
-- re-cadastro após pausa pelo Admin e bloqueio de códigos reservados.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.join_affiliate_program_v1(
    p_name TEXT,
    p_code TEXT,
    p_pix_key TEXT DEFAULT NULL,
    p_channel TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_email TEXT;
    v_clean_name TEXT;
    v_clean_code TEXT;
    v_clean_pix TEXT;
    v_clean_channel TEXT;
    v_existing RECORD;
    v_inserted RECORD;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Faça login para ativar seu cadastro de afiliado.';
    END IF;

    -- Bloqueia re-cadastro se a conta já possui registro (inclusive se foi pausada pelo Admin)
    SELECT * INTO v_existing
    FROM public.affiliates
    WHERE user_id = v_user_id
    LIMIT 1;

    IF FOUND THEN
        RETURN to_jsonb(v_existing);
    END IF;

    v_email := NULLIF(lower(trim(COALESCE(auth.jwt() ->> 'email', ''))), '');

    -- Se o Admin já tinha pré-cadastrado este e-mail, apenas vincula a conta
    IF v_email IS NOT NULL THEN
        UPDATE public.affiliates
        SET user_id = v_user_id,
            pix_key = COALESCE(NULLIF(trim(COALESCE(p_pix_key, '')), ''), pix_key),
            updated_at = now()
        WHERE user_id IS NULL
          AND email IS NOT NULL
          AND lower(trim(email)) = v_email
        RETURNING * INTO v_existing;

        IF FOUND THEN
            RETURN to_jsonb(v_existing);
        END IF;
    END IF;

    v_clean_name := trim(COALESCE(p_name, ''));
    IF length(v_clean_name) < 2 THEN
        RAISE EXCEPTION 'Informe seu nome completo (mínimo 2 caracteres).';
    END IF;

    v_clean_code := upper(regexp_replace(trim(COALESCE(p_code, '')), '[^A-Za-z0-9_-]', '', 'g'));
    IF length(v_clean_code) < 3 OR length(v_clean_code) > 32 THEN
        RAISE EXCEPTION 'Escolha um código entre 3 e 32 caracteres (letras, números ou hífen).';
    END IF;

    IF v_clean_code IN ('ADMIN', 'SUPORTE', 'OFICIAL', 'SOLAR', 'PROTOCOLO', 'API', 'AUTH', 'CREDITS', 'AFILIADO') THEN
        RAISE EXCEPTION 'Este código é reservado. Escolha outro (ex: seu nome ou @).';
    END IF;

    IF EXISTS (SELECT 1 FROM public.affiliates WHERE upper(code) = v_clean_code) THEN
        RAISE EXCEPTION 'O código % já está em uso. Tente outra variação (ex: %2026).', v_clean_code, v_clean_code;
    END IF;

    v_clean_pix := NULLIF(trim(COALESCE(p_pix_key, '')), '');
    v_clean_channel := NULLIF(trim(COALESCE(p_channel, '')), '');

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
        v_user_id,
        v_clean_code,
        v_clean_name,
        v_email,
        v_clean_pix,
        20.00,
        true,
        CASE
            WHEN v_clean_channel IS NOT NULL THEN 'Auto-cadastro · Canal: ' || v_clean_channel
            ELSE 'Auto-cadastro pelo site'
        END,
        v_user_id
    )
    RETURNING * INTO v_inserted;

    RETURN to_jsonb(v_inserted);
END;
$$;

REVOKE ALL ON FUNCTION public.join_affiliate_program_v1(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.join_affiliate_program_v1(TEXT, TEXT, TEXT, TEXT) TO authenticated;
