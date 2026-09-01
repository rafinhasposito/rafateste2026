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

export const chargeConsultation = async (args: ChargeArgs): Promise<ChargeResult> => {
  const cost = args.amount ?? 1;

  if (args.isAdmin) {
    await supabase.from("credit_transactions").insert({
      user_id: args.userId,
      amount: 0,
      type: args.type ?? "consulta_admin",
      description: args.description,
    });
    return { ok: true, newBalance: args.currentCredits };
  }

  if (args.currentCredits < cost) {
    return { ok: false, reason: "no_credits" };
  }

  const { data: success, error } = await supabase.rpc("charge_credits", {
    p_amount: cost,
    p_type: args.type ?? "consulta",
    p_description: args.description,
  });

  if (error || !success) {
    return { ok: false, reason: "db_error" };
  }

  const newBalance = args.currentCredits - cost;
  return { ok: true, newBalance };
};
