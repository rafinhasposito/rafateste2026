-- CORRECTIVE MIGRATION FOR SCHEMA AND SECURITY

-- 1. SECURITY OF CREDITS
CREATE OR REPLACE FUNCTION charge_credits(
    p_amount INT,
    p_type TEXT,
    p_description TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_current_credits INT;
BEGIN
    IF p_amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;
    SELECT credits INTO v_current_credits FROM public.profiles WHERE user_id = auth.uid() FOR UPDATE;
    IF v_current_credits < p_amount THEN RETURN FALSE; END IF;
    UPDATE public.profiles SET credits = credits - p_amount WHERE user_id = auth.uid();
    INSERT INTO public.credit_transactions (user_id, amount, type, description)
    VALUES (auth.uid(), -p_amount, p_type, p_description);
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- 2. MERCADO PAGO RPC SECURITY
REVOKE EXECUTE ON FUNCTION process_mercadopago_payment(UUID, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION process_mercadopago_payment(UUID, TEXT) FROM authenticated;
REVOKE EXECUTE ON FUNCTION process_mercadopago_payment(UUID, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION process_mercadopago_payment(UUID, TEXT) TO service_role;

-- 3. USER ROLES / SIGNUP
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  extracted_name text;
BEGIN
  extracted_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  INSERT INTO public.profiles (user_id, email, full_name, display_name, avatar_url, credits)
  VALUES (NEW.id, NEW.email, extracted_name, extracted_name, NEW.raw_user_meta_data->>'avatar_url', 0)
  ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 4. FIX WELCOME BONUS BACKFILL (REVERT 1 CREDIT GIVEN IN PREVIOUS MIGRATION)
UPDATE public.profiles SET credits = 0 WHERE credits = 1 AND user_id IN (
    SELECT user_id FROM public.profiles p WHERE NOT EXISTS (
        SELECT 1 FROM public.credit_transactions t WHERE t.user_id = p.user_id AND t.type = 'welcome_bonus'
    )
);

-- 5. FIX PRICING CONFIG
UPDATE public.pricing_config SET credits = 1 WHERE key = 'cost_house_3';

-- 6. FIX SCHEMA COMPATIBILITY FOR CONSULTATIONS
DROP TABLE IF EXISTS public.consultations CASCADE;
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birthdate TEXT NOT NULL,
  birthtime TEXT NOT NULL,
  birth_place TEXT NOT NULL,
  year TEXT NOT NULL,
  mode TEXT NOT NULL,
  goal INTEGER,
  intent TEXT,
  origin TEXT,
  result JSONB NOT NULL,
  houses_unlocked INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own consultations" ON public.consultations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own consultations" ON public.consultations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own consultations" ON public.consultations FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
