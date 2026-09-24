-- Consolidation for gvqdlsflrbctfiorimcl

-- 1. Function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2. profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER NOT NULL DEFAULT 0,
  birth_date DATE,
  birth_time TIME,
  birth_city TEXT,
  birth_country TEXT,
  birth_lat NUMERIC,
  birth_lon NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. consultations table
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  target_year INTEGER NOT NULL,
  birthdate TEXT NOT NULL,
  birthtime TEXT NOT NULL,
  birth_place TEXT NOT NULL,
  target_place TEXT,
  celestial_data JSONB NOT NULL,
  is_unlocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own consultations" ON public.consultations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own consultations" ON public.consultations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own consultations" ON public.consultations FOR UPDATE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_consultations_updated_at ON public.consultations;
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. credit_transactions table
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- 5. pricing_config table
CREATE TABLE IF NOT EXISTS public.pricing_config (
  key TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  credits INTEGER NOT NULL,
  price_brl NUMERIC,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads pricing" ON public.pricing_config FOR SELECT USING (true);

INSERT INTO public.pricing_config (key, category, label, description, credits, price_brl, sort_order) VALUES
  ('package_1cr', 'package', 'Descoberta', 'Veja a casa mais importante para o seu objetivo', 1, 29.90, 1),
  ('package_2cr', 'package', 'Expansão', 'Desbloqueie 3 casas e descubra rotas alternativas', 2, 49.90, 2),
  ('package_3cr', 'package', 'Mapa Completo', 'Acesso total a todas as 12 casas do seu mapa estelar', 3, 79.90, 3),
  ('cost_city', 'cost', 'Consulta por Cidade', 'Simula deslocamento e descobre em qual casa a cidade cai', 1, NULL, 1),
  ('cost_house_1', 'cost', '+1 Casa', 'Desbloqueia 1 casa adicional', 1, NULL, 2),
  ('cost_house_3', 'cost', '+3 Casas', 'Desbloqueia 3 casas adicionais', 2, NULL, 3),
  ('cost_full_map', 'cost', 'Mapa Completo', 'Todas as 12 casas reveladas', 3, NULL, 4)
ON CONFLICT (key) DO NOTHING;

-- 6. credit_orders table
CREATE TABLE IF NOT EXISTS public.credit_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pricing_config_id TEXT NOT NULL REFERENCES public.pricing_config(key) ON DELETE RESTRICT,
    amount NUMERIC NOT NULL,
    credits_amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'BRL',
    status TEXT NOT NULL DEFAULT 'pending',
    mercadopago_preference_id TEXT,
    mercadopago_payment_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.credit_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" ON public.credit_orders FOR SELECT USING (auth.uid() = user_id);

-- 7. process_mercadopago_payment RPC
CREATE OR REPLACE FUNCTION process_mercadopago_payment(
    p_order_id UUID,
    p_payment_id TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_order RECORD;
BEGIN
    SELECT * INTO v_order FROM public.credit_orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Order not found'; END IF;
    IF v_order.status = 'approved' THEN RETURN FALSE; END IF;

    UPDATE public.credit_orders
    SET status = 'approved', mercadopago_payment_id = p_payment_id, paid_at = timezone('utc'::text, now()), updated_at = timezone('utc'::text, now())
    WHERE id = p_order_id;

    UPDATE public.profiles SET credits = credits + v_order.credits_amount WHERE user_id = v_order.user_id;

    INSERT INTO public.credit_transactions (user_id, amount, type, description)
    VALUES (v_order.user_id, v_order.credits_amount, 'compra_mercadopago', 'Compra de pacote: ' || v_order.pricing_config_id);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. handle_new_user Trigger
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
    1
  ) ON CONFLICT (user_id) DO NOTHING;

  IF NEW.email = 'divulgacaoareavip@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
      ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 1, 'welcome_bonus', 'Crédito de boas-vindas');
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Backfill existing users
INSERT INTO public.profiles (user_id, email, full_name, display_name, avatar_url, credits)
SELECT 
  u.id, 
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  u.raw_user_meta_data->>'avatar_url',
  1
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Grant permissions to Admin for Dashboard functionality
DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins update any profile" ON public.profiles;
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins update any profile" ON public.profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins view all consultations" ON public.consultations;
CREATE POLICY "Admins view all consultations" ON public.consultations FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins view all transactions" ON public.credit_transactions;
CREATE POLICY "Admins view all transactions" ON public.credit_transactions FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

