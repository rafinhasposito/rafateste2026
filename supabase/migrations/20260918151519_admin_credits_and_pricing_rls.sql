-- 1. POLICY DE PREÇOS (Estritamente UPDATE)
CREATE POLICY "Admins podem alterar preços" 
  ON public.pricing_config 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- 2. FUNÇÃO SEGURA (Atomic Stored Procedure)
CREATE OR REPLACE FUNCTION public.admin_adjust_credits(
  p_target_user_id uuid, 
  p_amount integer, 
  p_reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Bloqueio contra transações vazias/nulas
  IF p_amount = 0 THEN 
    RAISE EXCEPTION 'Amount não pode ser zero'; 
  END IF;

  -- Verificação rigorosa de cargo Admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: Requer privilégios de administrador';
  END IF;

  -- Atualização atômica do saldo do Perfil
  UPDATE public.profiles 
  SET 
    credits = credits + p_amount,
    updated_at = timezone('utc'::text, now())
  WHERE user_id = p_target_user_id;

  -- Inserção na trilha de auditoria
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (p_target_user_id, p_amount, 'admin_adjustment', p_reason);
END;
$$;

-- 3. PERMISSÕES EXPLÍCITAS
REVOKE EXECUTE ON FUNCTION public.admin_adjust_credits(uuid, integer, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_adjust_credits(uuid, integer, text) TO authenticated;
