ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS birth_date date,
  ADD COLUMN IF NOT EXISTS birth_time time,
  ADD COLUMN IF NOT EXISTS birth_city text,
  ADD COLUMN IF NOT EXISTS birth_country text,
  ADD COLUMN IF NOT EXISTS birth_lat numeric,
  ADD COLUMN IF NOT EXISTS birth_lon numeric;