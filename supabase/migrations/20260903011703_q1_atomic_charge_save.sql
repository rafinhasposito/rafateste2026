CREATE OR REPLACE FUNCTION charge_and_save_consultation_v1(
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
    p_intent text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
    v_user_id uuid;
    v_cost integer;
    v_profile record;
    v_existing_user uuid;
    v_inserted_id uuid;
BEGIN
    -- 1. Obter auth.uid()
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 2. Fast-path: Verificar se a consulta ja existe
    SELECT user_id INTO v_existing_user
    FROM public.consultations
    WHERE id = p_consultation_id;

    IF FOUND THEN
        IF v_existing_user != v_user_id THEN
            RAISE EXCEPTION 'Consultation ID collision with another user.';
        END IF;
        -- Consulta ja existe para este usuario (retry seguro). Retorna sem cobrar.
        RETURN p_consultation_id;
    END IF;

    -- 3. Obter preco
    SELECT credits INTO v_cost
    FROM public.pricing_config
    WHERE key = 'cost_city' LIMIT 1;
    
    IF v_cost IS NULL OR v_cost <= 0 THEN
        RAISE EXCEPTION 'Pricing config unavailable or invalid.';
    END IF;

    -- 4. FOR UPDATE lock no profile (serializa concorrencia por usuario)
    SELECT * INTO v_profile
    FROM public.profiles
    WHERE user_id = v_user_id
    FOR UPDATE;

    IF v_profile IS NULL THEN
        RAISE EXCEPTION 'Profile not found';
    END IF;

    -- 5. Validar saldo
    IF v_profile.credits < v_cost THEN
        RAISE EXCEPTION 'Insufficient credits.';
    END IF;

    -- 6. Inserir consultation com tratamento on conflict
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
        p_result
    ) 
    ON CONFLICT (id) DO NOTHING
    RETURNING id INTO v_inserted_id;

    -- 7. Checar se a insercao foi bem sucedida ou evitada por concorrencia
    IF v_inserted_id IS NULL THEN
        -- Nao inseriu porque o ID ja existia (ocorrido entre o fast-path e o INSERT).
        -- Revalidar dono.
        SELECT user_id INTO v_existing_user
        FROM public.consultations
        WHERE id = p_consultation_id;

        IF v_existing_user != v_user_id THEN
            RAISE EXCEPTION 'Consultation ID collision with another user.';
        END IF;

        -- Se chegou aqui, e' retry exato de concorrencia. Retorna sucesso graciosamente.
        RETURN p_consultation_id;
    END IF;

    -- 8. Debitar profile (somente se a consulta foi de fato inserida nesta chamada)
    UPDATE public.profiles
    SET credits = credits - v_cost,
        updated_at = now()
    WHERE user_id = v_user_id;

    -- 9. Inserir credit_transaction
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
        'Consulta por Cidade — ' || p_origin || ' em ' || p_year,
        p_consultation_id
    );

    RETURN p_consultation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.charge_and_save_consultation_v1 FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.charge_and_save_consultation_v1 TO authenticated;
