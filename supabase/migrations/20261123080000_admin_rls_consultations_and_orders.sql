-- ============================================================================
-- Admin RLS + endurecimento de user_roles — Protocolo Solar
-- 1. Admin passa a enxergar todas as consultas, pedidos e aceites de termos
-- 2. user_roles deixa de ser legível por qualquer logado (cada um vê só o próprio papel)
-- ============================================================================

DROP POLICY IF EXISTS "Admins view all consultations" ON public.consultations;
CREATE POLICY "Admins view all consultations"
ON public.consultations
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins view all credit orders" ON public.credit_orders;
CREATE POLICY "Admins view all credit orders"
ON public.credit_orders
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins view all terms acceptance" ON public.terms_acceptance;
CREATE POLICY "Admins view all terms acceptance"
ON public.terms_acceptance
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- user_roles: cada usuário lê apenas o próprio papel (sem recursão; as policies
-- de admin acima continuam funcionando porque filtram user_id = auth.uid()).
DROP POLICY IF EXISTS "Permitir leitura geral" ON public.user_roles;
DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
CREATE POLICY "Users read own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);
