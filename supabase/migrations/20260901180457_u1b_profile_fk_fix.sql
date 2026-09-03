CREATE OR REPLACE FUNCTION public.unlock_consultation_houses(p_consultation_id uuid, p_target_house integer)
RETURNS jsonb AS $$
DECLARE
    v_user_id uuid;
    v_consultation RECORD;
    v_profile RECORD;
    v_is_admin boolean;
    v_total_cost integer;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

    -- Fetch consultation
    SELECT * INTO v_consultation FROM public.consultations WHERE id = p_consultation_id AND user_id = v_user_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Consultation not found or not owned by user'; END IF;

    -- Validate target house
    IF p_target_house < 1 OR p_target_house > 12 THEN
        RAISE EXCEPTION 'Invalid target house. Must be between 1 and 12.';
    END IF;

    -- If already unlocked, return early (idempotent)
    IF v_consultation.unlocked_houses @> ARRAY[p_target_house] THEN
        RETURN jsonb_build_object('status', 'success', 'message', 'House already unlocked');
    END IF;

    -- Admin check
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = v_user_id AND role = 'admin'
    ) INTO v_is_admin;

    v_total_cost := 1;
    IF v_is_admin THEN
        v_total_cost := 0;
    END IF;

    -- Charge credits
    IF v_total_cost > 0 THEN
        SELECT * INTO v_profile FROM public.profiles WHERE user_id = v_user_id FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'Profile not found'; END IF;
        IF v_profile.credits < v_total_cost THEN RAISE EXCEPTION 'Insufficient credits'; END IF;

        UPDATE public.profiles SET credits = credits - v_total_cost WHERE user_id = v_user_id;

        INSERT INTO public.credit_transactions (user_id, amount, type, description)
        VALUES (v_user_id, -v_total_cost, 'usage', 'Desbloqueio de Casa Específica na Consulta ' || p_consultation_id);
    END IF;

    -- Unlock the house
    UPDATE public.consultations
    SET unlocked_houses = array_append(unlocked_houses, p_target_house)
    WHERE id = p_consultation_id;

    RETURN jsonb_build_object('status', 'success', 'message', 'House unlocked successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
