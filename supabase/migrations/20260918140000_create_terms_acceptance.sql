CREATE TABLE public.terms_acceptance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  terms_version varchar(50) NOT NULL,
  privacy_version varchar(50) NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text,
  terms_hash varchar(64) NOT NULL,
  privacy_hash varchar(64) NOT NULL
);

ALTER TABLE public.terms_acceptance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user reads own acceptance" 
  ON public.terms_acceptance 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Nenhuma policy de INSERT, UPDATE ou DELETE para authenticated.
-- O INSERT é feito exclusivamente pela Edge Function via Service Role (bypassa RLS).
