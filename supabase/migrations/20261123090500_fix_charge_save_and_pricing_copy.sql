-- ============================================================================
-- 1. Corrige charge_and_save_consultation_v1:
--    - Nunca grava description = NULL em credit_transactions para consultas por Casa/Intenção
--    - Já popula houses_unlocked = 1 e unlocked_houses = ARRAY[p_goal] na inserção
-- 2. Alinha rótulos/descrições de pricing_config (mantendo 100% dos preços e créditos)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.charge_and_save_consultation_v1(
    p_consultation_id uuid,
    p_name text,
    p_birthdate text,
    p_birthtime text,
    p_birth_place text,
    p_year text,
    p_mode text,
    p_goal integer,
    p_origin text,
    p_result jsonb,
    p_intent text DEFAULT NULL::text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
    v_user_id uuid;
    v_cost integer;
    v_profile record;
    v_existing_user uuid;
    v_inserted_id uuid;
    v_tx_description text;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Fast-path idempotente
    SELECT user_id INTO v_existing_user
    FROM public.consultations
    WHERE id = p_consultation_id;

    IF FOUND THEN
        IF v_existing_user != v_user_id THEN
            RAISE EXCEPTION 'Consultation ID collision with another user.';
        END IF;
        RETURN p_consultation_id;
    END IF;

    SELECT credits INTO v_cost
    FROM public.pricing_config
    WHERE key = 'cost_city' LIMIT 1;

    IF v_cost IS NULL OR v_cost <= 0 THEN
        RAISE EXCEPTION 'Pricing config unavailable or invalid.';
    END IF;

    SELECT * INTO v_profile
    FROM public.profiles
    WHERE user_id = v_user_id
    FOR UPDATE;

    IF v_profile IS NULL THEN
        RAISE EXCEPTION 'Profile not found';
    END IF;

    IF v_profile.credits < v_cost THEN
        RAISE EXCEPTION 'Insufficient credits.';
    END IF;

    INSERT INTO public.consultations (
        id,
        user_id,
        name,
        birthdate,
        birthtime,
        birth_place,
        year,
        mode,
        goal,
        origin,
        intent,
        houses_unlocked,
        unlocked_houses,
        result
    ) VALUES (
        p_consultation_id,
        v_user_id,
        p_name,
        p_birthdate,
        p_birthtime,
        p_birth_place,
        p_year,
        p_mode,
        p_goal,
        p_origin,
        p_intent,
        1,
        CASE WHEN p_goal IS NOT NULL THEN ARRAY[p_goal] ELSE '{}'::integer[] END,
        p_result
    )
    ON CONFLICT (id) DO NOTHING
    RETURNING id INTO v_inserted_id;

    IF v_inserted_id IS NULL THEN
        SELECT user_id INTO v_existing_user
        FROM public.consultations
        WHERE id = p_consultation_id;

        IF v_existing_user != v_user_id THEN
            RAISE EXCEPTION 'Consultation ID collision with another user.';
        END IF;

        RETURN p_consultation_id;
    END IF;

    UPDATE public.profiles
    SET credits = credits - v_cost,
        updated_at = now()
    WHERE user_id = v_user_id;

    v_tx_description := CASE
        WHEN NULLIF(trim(COALESCE(p_origin, '')), '') IS NOT NULL THEN
            'Consulta por Cidade — ' || trim(p_origin) || ' em ' || COALESCE(p_year, '')
        WHEN NULLIF(trim(COALESCE(p_intent, '')), '') IS NOT NULL THEN
            'Consulta por Intenção (Casa ' || COALESCE(p_goal::text, '?') || ') em ' || COALESCE(p_year, '')
        ELSE
            'Consulta por Casa (Casa ' || COALESCE(p_goal::text, '?') || ') em ' || COALESCE(p_year, '')
    END;

    INSERT INTO public.credit_transactions (
        user_id,
        amount,
        type,
        description,
        consultation_id
    ) VALUES (
        v_user_id,
        -v_cost,
        'consulta',
        v_tx_description,
        p_consultation_id
    );

    RETURN p_consultation_id;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.charge_and_save_consultation_v1(uuid, text, text, text, text, text, text, integer, text, jsonb, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.charge_and_save_consultation_v1(uuid, text, text, text, text, text, text, integer, text, jsonb, text) TO authenticated;

-- Atualiza textos dos pacotes em pricing_config (mantém 100% dos preços R$ 19,90 / 49,90 / 99,90 e créditos 1 / 3 / 7)
UPDATE public.pricing_config
SET label = '1 Casa ou Cidade',
    description = 'Desbloqueia 1 Casa ou Cidade escolhida já com todas as 8 áreas da vida liberadas',
    updated_at = now()
WHERE key = 'package_1cr';

UPDATE public.pricing_config
SET label = 'Pacote 3 Casas / Cidades',
    description = 'Libera até 3 Casas ou 3 Cidades completas à sua escolha (todas com as 8 áreas da vida abertas)',
    updated_at = now()
WHERE key = 'package_2cr';

UPDATE public.pricing_config
SET label = 'Mapa Completo (12 Casas)',
    description = 'Desbloqueia TODAS as 12 Casas do seu aniversário de uma vez (com todas as 8 áreas da vida abertas)',
    updated_at = now()
WHERE key = 'package_3cr';
