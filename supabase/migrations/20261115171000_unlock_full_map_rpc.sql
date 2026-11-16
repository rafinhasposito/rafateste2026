-- Atomic Full Map Unlock RPC + Legacy Full Map awareness in single-house RPC

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

    v_already_full :=
        GREATEST(COALESCE(v_consultation.houses_unlocked, 0), 0) >= 12
        OR COALESCE((v_consultation.result->>'full_map_unlocked')::boolean, false);

    IF v_already_full THEN
        RETURN jsonb_build_object(
            'success', true,
            'charged', 0,
            'unlocked_houses', v_all_twelve
        );
    END IF;

    -- Count truly unlocked houses across columns & result JSON
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

    IF v_already_unlocked_count >= 12 THEN
        v_new_result := COALESCE(v_consultation.result, '{}'::jsonb) || jsonb_build_object(
            'full_map_unlocked', true,
            'unlocked_houses_list', to_jsonb(v_all_twelve)
        );
        UPDATE public.consultations
        SET houses_unlocked = 12,
            unlocked_houses = v_all_twelve,
            result = v_new_result
        WHERE id = p_consultation_id;

        RETURN jsonb_build_object(
            'success', true,
            'charged', 0,
            'unlocked_houses', v_all_twelve
        );
    END IF;

    IF v_is_admin THEN
        v_total_cost := 0;
    ELSE
        SELECT credits INTO v_full_cost
        FROM public.pricing_config
        WHERE key = 'cost_full_map' LIMIT 1;

        IF v_full_cost IS NULL OR v_full_cost <= 0 THEN
            RAISE EXCEPTION 'Pricing config for full map is unavailable or invalid.';
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
            'Desbloqueio do Mapa Completo (12 Casas)'
        );
    END IF;

    v_new_result := COALESCE(v_consultation.result, '{}'::jsonb) || jsonb_build_object(
        'full_map_unlocked', true,
        'unlocked_houses_list', to_jsonb(v_all_twelve)
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

-- Also harden unlock_consultation_houses so it respects legacy result.full_map_unlocked flags
CREATE OR REPLACE FUNCTION public.unlock_consultation_houses(
    p_consultation_id UUID,
    p_target_house INTEGER
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_is_admin BOOLEAN;
    v_consultation RECORD;
    v_profile RECORD;
    v_already_unlocked INTEGER[];
    v_house INTEGER := p_target_house;
    v_total_cost INTEGER;
    v_legacy_unlocked BOOLEAN;
    v_final_unlocked INTEGER[];
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

    IF NOT FOUND THEN RAISE EXCEPTION 'Consultation not found'; END IF;

    IF v_consultation.user_id != v_user_id THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    IF v_house IS NULL OR v_house < 1 OR v_house > 12 THEN
        RAISE EXCEPTION 'Invalid target house: %', COALESCE(v_house::text, 'NULL');
    END IF;

    v_already_unlocked := COALESCE(v_consultation.unlocked_houses, '{}');

    v_legacy_unlocked := false;
    IF COALESCE((v_consultation.result->>'full_map_unlocked')::boolean, false) THEN
        v_legacy_unlocked := true;
    ELSIF v_consultation.result ? 'unlocked_houses_list'
          AND (v_consultation.result->'unlocked_houses_list') @> to_jsonb(v_house) THEN
        v_legacy_unlocked := true;
    ELSIF GREATEST(v_consultation.houses_unlocked, 0) >= 12 THEN
        v_legacy_unlocked := true;
    ELSIF v_consultation.goal IS NOT NULL AND v_house = v_consultation.goal THEN
        v_legacy_unlocked := true;
    ELSIF v_consultation.goal IS NOT NULL AND GREATEST(v_consultation.houses_unlocked, 0) <= 1 THEN
        v_legacy_unlocked := false;
    ELSIF v_house <= GREATEST(v_consultation.houses_unlocked, 0) THEN
        v_legacy_unlocked := true;
    END IF;

    IF v_legacy_unlocked OR (v_house = ANY(v_already_unlocked)) THEN
        RETURN jsonb_build_object('success', true, 'charged', 0, 'unlocked_houses', v_already_unlocked);
    END IF;

    IF v_is_admin THEN
        v_total_cost := 0;
    ELSE
        SELECT credits INTO v_total_cost
        FROM public.pricing_config
        WHERE key = 'cost_house_1' LIMIT 1;

        IF v_total_cost IS NULL OR v_total_cost <= 0 THEN
            RAISE EXCEPTION 'Pricing config for +1 house is unavailable or invalid.';
        END IF;
    END IF;

    IF v_total_cost > 0 THEN
        SELECT * INTO v_profile FROM public.profiles WHERE user_id = v_user_id FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'Profile not found'; END IF;
        IF v_profile.credits < v_total_cost THEN RAISE EXCEPTION 'Insufficient credits'; END IF;

        UPDATE public.profiles SET credits = credits - v_total_cost WHERE user_id = v_user_id;

        INSERT INTO public.credit_transactions (
            user_id, consultation_id, amount, type, description
        ) VALUES (
            v_user_id, p_consultation_id, -v_total_cost, 'usage',
            'Desbloqueio da Casa ' || v_house::text
        );
    END IF;

    v_final_unlocked := array_append(v_already_unlocked, v_house);

    UPDATE public.consultations
    SET unlocked_houses = v_final_unlocked
    WHERE id = p_consultation_id;

    RETURN jsonb_build_object('success', true, 'charged', v_total_cost, 'unlocked_houses', v_final_unlocked);
END;
$$;

REVOKE ALL ON FUNCTION public.unlock_consultation_houses(UUID, INTEGER) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.unlock_consultation_houses(UUID, INTEGER) TO authenticated;
