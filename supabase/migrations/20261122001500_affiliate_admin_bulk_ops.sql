-- ============================================================================
-- Gestão em Escala de Afiliados (Admin Bulk Ops & Safe Cleanup) — Protocolo Solar
-- ============================================================================
-- Adiciona:
-- 1. Permissão de DELETE/UPDATE para Admin e RPC segura admin_delete_affiliate_v1
--    (exclui definitivamente se 0 vendas; arquiva/pausa se já possui histórico contábil).
-- 2. RPC em lote admin_bulk_affiliates_action_v1 para ativar, pausar, alterar %,
--    liquidar Pix ou excluir inativos (0 vendas) para 1 ou 100+ afiliados de uma vez.
-- ============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliate_commissions TO authenticated;

-- 1. RPC Admin: Excluir afiliado (ou arquivar se já tiver vendas registradas)
CREATE OR REPLACE FUNCTION public.admin_delete_affiliate_v1(
    p_affiliate_id UUID,
    p_force_archive_if_sales BOOLEAN DEFAULT true
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_aff RECORD;
    v_sales_count INTEGER := 0;
BEGIN
    IF v_admin_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = v_admin_id AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Acesso negado: requer privilégios de administrador.';
    END IF;

    SELECT * INTO v_aff
    FROM public.affiliates
    WHERE id = p_affiliate_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Afiliado não encontrado.';
    END IF;

    SELECT COUNT(*)::INTEGER INTO v_sales_count
    FROM public.affiliate_commissions
    WHERE affiliate_id = p_affiliate_id;

    IF v_sales_count > 0 THEN
        IF p_force_archive_if_sales THEN
            UPDATE public.affiliates
            SET active = false,
                notes = CASE
                    WHEN COALESCE(notes, '') ILIKE '%[ARQUIVADO]%' THEN notes
                    ELSE trim( '[ARQUIVADO] ' || COALESCE(notes, '') )
                END,
                updated_at = now()
            WHERE id = p_affiliate_id;

            RETURN jsonb_build_object(
                'ok', true,
                'action', 'archived',
                'sales_count', v_sales_count,
                'message', 'Parceiro possui histórico de vendas e foi pausado/arquivado para preservar o financeiro.'
            );
        ELSE
            RAISE EXCEPTION 'Este parceiro já possui % venda(s) registrada(s) e não pode ser apagado do histórico financeiro.', v_sales_count;
        END IF;
    END IF;

    -- Limpa referências sem vendas antes de excluir definitivamente
    UPDATE public.profiles
    SET referred_by_affiliate_id = NULL
    WHERE referred_by_affiliate_id = p_affiliate_id;

    UPDATE public.credit_orders
    SET affiliate_id = NULL
    WHERE affiliate_id = p_affiliate_id;

    DELETE FROM public.affiliates
    WHERE id = p_affiliate_id;

    RETURN jsonb_build_object(
        'ok', true,
        'action', 'deleted',
        'sales_count', 0
    );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_delete_affiliate_v1(UUID, BOOLEAN) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_affiliate_v1(UUID, BOOLEAN) TO authenticated;

-- 2. RPC Admin: Ações em lote (activate, pause, set_rate, payout, delete_zero_sales)
CREATE OR REPLACE FUNCTION public.admin_bulk_affiliates_action_v1(
    p_affiliate_ids UUID[],
    p_action TEXT,
    p_commission_rate NUMERIC DEFAULT NULL,
    p_note TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_affected INTEGER := 0;
    v_archived INTEGER := 0;
    v_paid_total NUMERIC(10,2) := 0;
BEGIN
    IF v_admin_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = v_admin_id AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Acesso negado: requer privilégios de administrador.';
    END IF;

    IF p_affiliate_ids IS NULL OR array_length(p_affiliate_ids, 1) IS NULL THEN
        RETURN jsonb_build_object('ok', true, 'affected', 0);
    END IF;

    IF p_action = 'activate' THEN
        UPDATE public.affiliates
        SET active = true,
            updated_at = now()
        WHERE id = ANY(p_affiliate_ids);
        GET DIAGNOSTICS v_affected = ROW_COUNT;

    ELSIF p_action = 'pause' THEN
        UPDATE public.affiliates
        SET active = false,
            updated_at = now()
        WHERE id = ANY(p_affiliate_ids);
        GET DIAGNOSTICS v_affected = ROW_COUNT;

    ELSIF p_action = 'set_rate' THEN
        IF p_commission_rate IS NULL OR p_commission_rate <= 0 OR p_commission_rate > 80 THEN
            RAISE EXCEPTION 'A comissão deve ficar entre 1%% e 80%%.';
        END IF;
        UPDATE public.affiliates
        SET commission_rate = p_commission_rate,
            updated_at = now()
        WHERE id = ANY(p_affiliate_ids);
        GET DIAGNOSTICS v_affected = ROW_COUNT;

    ELSIF p_action = 'payout' THEN
        WITH updated AS (
            UPDATE public.affiliate_commissions
            SET status = 'paid',
                paid_at = now(),
                payout_note = COALESCE(NULLIF(trim(COALESCE(p_note, '')), ''), 'Repasse Pix em lote')
            WHERE affiliate_id = ANY(p_affiliate_ids)
              AND status = 'pending'
            RETURNING commission_amount_brl
        )
        SELECT COUNT(*)::INTEGER, COALESCE(SUM(commission_amount_brl), 0)::NUMERIC(10,2)
        INTO v_affected, v_paid_total
        FROM updated;

    ELSIF p_action = 'delete_unused' THEN
        -- Arquiva quem já tem vendas
        UPDATE public.affiliates a
        SET active = false,
            notes = CASE
                WHEN COALESCE(a.notes, '') ILIKE '%[ARQUIVADO]%' THEN a.notes
                ELSE trim('[ARQUIVADO] ' || COALESCE(a.notes, ''))
            END,
            updated_at = now()
        WHERE a.id = ANY(p_affiliate_ids)
          AND EXISTS (SELECT 1 FROM public.affiliate_commissions c WHERE c.affiliate_id = a.id);
        GET DIAGNOSTICS v_archived = ROW_COUNT;

        -- Limpa vínculos sem venda e exclui quem tem 0 vendas
        UPDATE public.profiles
        SET referred_by_affiliate_id = NULL
        WHERE referred_by_affiliate_id = ANY(p_affiliate_ids)
          AND NOT EXISTS (
              SELECT 1 FROM public.affiliate_commissions c
              WHERE c.affiliate_id = profiles.referred_by_affiliate_id
          );

        UPDATE public.credit_orders
        SET affiliate_id = NULL
        WHERE affiliate_id = ANY(p_affiliate_ids)
          AND NOT EXISTS (
              SELECT 1 FROM public.affiliate_commissions c
              WHERE c.affiliate_id = credit_orders.affiliate_id
          );

        DELETE FROM public.affiliates a
        WHERE a.id = ANY(p_affiliate_ids)
          AND NOT EXISTS (SELECT 1 FROM public.affiliate_commissions c WHERE c.affiliate_id = a.id);
        GET DIAGNOSTICS v_affected = ROW_COUNT;

    ELSE
        RAISE EXCEPTION 'Ação em lote inválida: %', p_action;
    END IF;

    RETURN jsonb_build_object(
        'ok', true,
        'action', p_action,
        'affected', v_affected,
        'archived', v_archived,
        'paid_total_brl', v_paid_total
    );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_bulk_affiliates_action_v1(UUID[], TEXT, NUMERIC, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_bulk_affiliates_action_v1(UUID[], TEXT, NUMERIC, TEXT) TO authenticated;
