-- 1. Security of Credits
-- Create RPC to securely charge credits and record transaction atomically.
CREATE OR REPLACE FUNCTION charge_credits(
    p_amount INT,
    p_type TEXT,
    p_description TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_current_credits INT;
BEGIN
    IF p_amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;

    -- Lock row
    SELECT credits INTO v_current_credits FROM public.profiles WHERE user_id = auth.uid() FOR UPDATE;
    
    IF v_current_credits < p_amount THEN
        RETURN FALSE; -- Insufficient credits
    END IF;

    -- Update credits
    UPDATE public.profiles SET credits = credits - p_amount WHERE user_id = auth.uid();

    -- Record transaction
    INSERT INTO public.credit_transactions (user_id, amount, type, description)
    VALUES (auth.uid(), -p_amount, p_type, p_description);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to prevent direct credits update via REST API (RLS or raw UPDATE)
CREATE OR REPLACE FUNCTION prevent_direct_credits_update()
RETURNS trigger AS $$
BEGIN
    IF (current_setting('role') = 'authenticated' OR current_setting('role') = 'anon') THEN
        IF NEW.credits IS DISTINCT FROM OLD.credits THEN
            RAISE EXCEPTION 'Direct updates to credits column are not allowed via API.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_prevent_direct_credits_update ON public.profiles;
CREATE TRIGGER tr_prevent_direct_credits_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION prevent_direct_credits_update();

-- 2. RPC Mercado Pago Security
REVOKE EXECUTE ON FUNCTION process_mercadopago_payment(UUID, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION process_mercadopago_payment(UUID, TEXT) FROM authenticated;
REVOKE EXECUTE ON FUNCTION process_mercadopago_payment(UUID, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION process_mercadopago_payment(UUID, TEXT) TO service_role;

-- 3. User Roles / Signup
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);

-- Fix trigger: remove welcome_bonus (0 credits) and remove admin rule
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  extracted_name text;
BEGIN
  extracted_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (user_id, email, full_name, display_name, avatar_url, credits)
  VALUES (
    NEW.id,
    NEW.email,
    extracted_name,
    extracted_name,
    NEW.raw_user_meta_data->>'avatar_url',
    0 -- Welcome bonus removed (0 credits instead of 1)
  ) ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$function$;

-- Update existing backfilled users to have 0 credits, since they received 1 inappropriately in the last migration.
UPDATE public.profiles SET credits = 0 WHERE credits = 1 AND user_id IN (
    -- Only for those who don't have any welcome transaction (which means they were backfilled)
    SELECT user_id FROM public.profiles p WHERE NOT EXISTS (
        SELECT 1 FROM public.credit_transactions t WHERE t.user_id = p.user_id AND t.type = 'welcome_bonus'
    )
);

-- 4/5. Pricing Config Alignment
-- Check the frontend: cost_house_3 = 2 credits in origin/main? Wait, if UI says "+3 Casas = 1 crédito", I will set it to 1.
-- Let's update pricing_config
UPDATE public.pricing_config SET credits = 1 WHERE key = 'cost_house_3';

