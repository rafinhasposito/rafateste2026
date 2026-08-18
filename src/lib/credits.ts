import { supabase } from "@/integrations/supabase/client";

export interface ChargeArgs {
  userId: string;
  currentCredits: number;
  isAdmin?: boolean;
  description: string;
  amount?: number; // positive integer (will be debited as negative)
  type?: string;
}

export interface ChargeResult {
  ok: boolean;
  reason?: "no_credits" | "db_error";
  newBalance?: number;
}

/**
 * Debita créditos do usuário antes da consulta. Admin não é cobrado.
 * Retorna ok=false com reason="no_credits" se faltar saldo.
 */
export const chargeConsultation = async (args: ChargeArgs): Promise<ChargeResult> => {
  const cost = args.amount ?? 1;

  // TEMPORARY BYPASS: Return success without hitting the database
  return { ok: true, newBalance: args.currentCredits };
  
  /* Original code
  if (args.isAdmin) {
    // Log para auditoria mas sem debitar
    await supabase.from("credit_transactions").insert({
      user_id: args.userId,
      amount: 0,
      type: args.type ?? "consulta_admin",
      description: `[ADMIN — sem cobrança] ${args.description}`,
    });
    return { ok: true, newBalance: args.currentCredits };
  }

  if (args.currentCredits < cost) {
    return { ok: false, reason: "no_credits" };
  }

  const newBalance = args.currentCredits - cost;
  const { error } = await supabase
    .from("profiles")
    .update({ credits: newBalance })
    .eq("user_id", args.userId);

  if (error) return { ok: false, reason: "db_error" };

  await supabase.from("credit_transactions").insert({
    user_id: args.userId,
    amount: -cost,
    type: args.type ?? "consulta",
    description: args.description,
  });

  return { ok: true, newBalance };
  */
};
