-- U1 RPC RESTORE LOCAL ONLY
-- Restores all the security, pricing, and tracing rules dropped during the incident,
-- while retaining the critical FK fix (profiles WHERE user_id = auth.uid).

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
    -- Auth check
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Real Admin Model
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = v_user_id AND role = 'admin'
    ) INTO v_is_admin;

    -- Lock consultation FOR UPDATE
    SELECT * INTO v_consultation
    FROM public.consultations
    WHERE id = p_consultation_id
    FOR UPDATE;

    IF NOT FOUND THEN RAISE EXCEPTION 'Consultation not found'; END IF;
    
    -- Strict Ownership (Admin does NOT bypass ownership)
    IF v_consultation.user_id != v_user_id THEN 
        RAISE EXCEPTION 'Not authorized'; 
    END IF;

    -- V1 Single House Validation
    IF v_house IS NULL OR v_house < 1 OR v_house > 12 THEN
        RAISE EXCEPTION 'Invalid target house: %', COALESCE(v_house::text, 'NULL');
    END IF;

    v_already_unlocked := COALESCE(v_consultation.unlocked_houses, '{}');

    -- Exact Legacy Rule Evaluation
    v_legacy_unlocked := false;
    IF GREATEST(v_consultation.houses_unlocked, 0) >= 12 THEN
        v_legacy_unlocked := true;
    ELSIF v_consultation.goal IS NOT NULL AND v_house = v_consultation.goal THEN
        v_legacy_unlocked := true;
    ELSIF v_consultation.goal IS NOT NULL AND GREATEST(v_consultation.houses_unlocked, 0) <= 1 THEN
        v_legacy_unlocked := false;
    ELSIF v_house <= GREATEST(v_consultation.houses_unlocked, 0) THEN
        v_legacy_unlocked := true;
    END IF;

    -- Idempotency Check
    IF v_legacy_unlocked OR (v_house = ANY(v_already_unlocked)) THEN
        RETURN jsonb_build_object('success', true, 'charged', 0, 'unlocked_houses', v_already_unlocked);
    END IF;

    -- Pricing Fail-Closed (No Fallback)
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

    -- Profile Lock and Ledger
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
    -- Admin (v_total_cost = 0) skips credit deduction and ledger transaction in V1.

    -- Update Arrays without modifying legacy integer
    v_final_unlocked := array_append(v_already_unlocked, v_house);
    
    UPDATE public.consultations 
    SET unlocked_houses = v_final_unlocked 
    WHERE id = p_consultation_id;

    RETURN jsonb_build_object('success', true, 'charged', v_total_cost, 'unlocked_houses', v_final_unlocked);
END;
$$;

-- Security Definer Hardening
REVOKE ALL ON FUNCTION public.unlock_consultation_houses(UUID, INTEGER) FROM public;
GRANT EXECUTE ON FUNCTION public.unlock_consultation_houses(UUID, INTEGER) TO authenticated;
