-- Protocolo Solar - Security Advisors Hardening
-- Resolves all Supabase Database Linter & Security Advisor WARN items

-- 1. FIX: function_search_path_mutable
ALTER FUNCTION public.prevent_legacy_unlock_charge() SET search_path = public, pg_temp;
ALTER FUNCTION public.prevent_direct_entitlement_update() SET search_path = public, pg_temp;
ALTER FUNCTION public.prevent_direct_credits_update() SET search_path = public, pg_temp;
ALTER FUNCTION public.charge_credits(integer, text, text) SET search_path = public, pg_temp;
ALTER FUNCTION public.process_mercadopago_payment(uuid, text) SET search_path = public, pg_temp;
ALTER FUNCTION public.admin_adjust_credits(uuid, integer, text) SET search_path = public, pg_temp;

-- 2. FIX: anon_security_definer_function_executable & authenticated_security_definer_function_executable
REVOKE EXECUTE ON FUNCTION public.charge_credits(integer, text, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.charge_credits(integer, text, text) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.charge_and_save_consultation_v1(uuid, text, text, text, text, text, text, integer, text, jsonb, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.charge_and_save_consultation_v1(uuid, text, text, text, text, text, text, integer, text, jsonb, text) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.unlock_consultation_houses(uuid, integer) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.unlock_consultation_houses(uuid, integer) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_adjust_credits(uuid, integer, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.admin_adjust_credits(uuid, integer, text) TO authenticated;

-- Trigger functions devem ser inacessíveis via API pública
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

-- Remove gatilho de evento legado e sua função com CASCADE
DROP EVENT TRIGGER IF EXISTS ensure_rls CASCADE;
DROP FUNCTION IF EXISTS public.rls_auto_enable() CASCADE;

-- 3. FIX: pg_graphql_anon_table_exposed & pg_graphql_authenticated_table_exposed
-- O Protocolo Solar usa 100% PostgREST REST API (supabase-js). A extensão GraphQL não é utilizada.
DROP EXTENSION IF EXISTS pg_graphql CASCADE;

-- 4. Defesa em profundidade: revoga SELECT anônimo em tabelas que só pertencem a usuários logados
REVOKE SELECT ON public.consultations FROM anon;
REVOKE SELECT ON public.credit_orders FROM anon;
REVOKE SELECT ON public.credit_transactions FROM anon;
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.terms_acceptance FROM anon;
REVOKE SELECT ON public.user_roles FROM anon;

