
-- ============ ROLES ENUM + TABLE ============
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ PRICING CONFIG ============
CREATE TABLE IF NOT EXISTS public.pricing_config (
  key TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  credits INTEGER NOT NULL,
  price_brl NUMERIC(10,2),
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_pricing_updated_at ON public.pricing_config;
CREATE TRIGGER trg_pricing_updated_at BEFORE UPDATE ON public.pricing_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.pricing_config (key, category, label, description, credits, price_brl, sort_order) VALUES
  ('package_1cr', 'package', 'Descoberta', 'Veja a casa mais importante para o seu objetivo', 1, 29.90, 1),
  ('package_2cr', 'package', 'Expansão', 'Desbloqueie 3 casas e descubra rotas alternativas', 2, 49.90, 2),
  ('package_3cr', 'package', 'Mapa Completo', 'Acesso total a todas as 12 casas do seu mapa estelar', 3, 79.90, 3),
  ('cost_city', 'cost', 'Consulta por Cidade', 'Simula deslocamento e descobre em qual casa a cidade cai', 1, NULL, 1),
  ('cost_house_1', 'cost', '+1 Casa', 'Desbloqueia 1 casa adicional', 1, NULL, 2),
  ('cost_house_3', 'cost', '+3 Casas', 'Desbloqueia 3 casas adicionais', 2, NULL, 3),
  ('cost_full_map', 'cost', 'Mapa Completo', 'Todas as 12 casas reveladas', 3, NULL, 4)
ON CONFLICT (key) DO NOTHING;

DROP POLICY IF EXISTS "Anyone reads pricing" ON public.pricing_config;
DROP POLICY IF EXISTS "Admins update pricing" ON public.pricing_config;
DROP POLICY IF EXISTS "Admins insert pricing" ON public.pricing_config;
CREATE POLICY "Anyone reads pricing" ON public.pricing_config FOR SELECT USING (true);
CREATE POLICY "Admins update pricing" ON public.pricing_config FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert pricing" ON public.pricing_config FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ ADMIN POLICIES FOR EXISTING TABLES ============
DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins update any profile" ON public.profiles;
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update any profile" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins view all consultations" ON public.consultations;
CREATE POLICY "Admins view all consultations" ON public.consultations FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins view all transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Admins insert any transaction" ON public.credit_transactions;
CREATE POLICY "Admins view all transactions" ON public.credit_transactions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert any transaction" ON public.credit_transactions FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ AUTO-CREATE PROFILE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, avatar_url, credits)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    1
  ) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 1, 'welcome_bonus', 'Crédito de boas-vindas');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ BACKFILL existing users ============
INSERT INTO public.profiles (user_id, email, display_name, avatar_url, credits)
SELECT u.id, u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  u.raw_user_meta_data->>'avatar_url',
  1
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.id IS NULL;

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'user'::public.app_role
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id AND r.role = 'user'
WHERE r.id IS NULL;
