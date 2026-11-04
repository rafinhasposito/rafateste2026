import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface SaveConsultationArgs {
  id?: string;
  userId: string;
  name: string;
  birthdate: string;
  birthtime: string;
  birth_place: string;
  year: string;
  mode: string; // "passado" | "presente" | "futuro"
  goal?: number | null;
  intent?: string | null;
  origin?: string | null;
  result: any; // full API payload (contains .results for future unlocks)
  houses_unlocked?: number;
  unlocked_houses?: number[];
}

/**
 * Insert a consultation row after a successful API lookup. Returns the row id,
 * or null on failure (non-blocking — caller may still render results).
 */
export const saveConsultation = async (args: SaveConsultationArgs): Promise<string | null> => {
  const { data, error } = await supabase
    .from("consultations")
    .insert({
      id: args.id, // optional: if not provided, DB generates one (if allowed by schema, but typically we want it)
      user_id: args.userId,
      name: args.name,
      birthdate: args.birthdate,
      birthtime: args.birthtime,
      birth_place: args.birth_place,
      year: args.year,
      mode: args.mode,
      goal: args.goal ?? null,
      intent: args.intent ?? null,
      origin: args.origin ?? null,
      result: args.result,
      houses_unlocked: args.houses_unlocked ?? 1,
      ...(args.unlocked_houses ? { unlocked_houses: args.unlocked_houses } : {}),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[saveConsultation] failed:", error);
    toast.error("DB Error: " + error.message);
    return null;
  }
  return data?.id ?? null;
};

export const chargeAndSaveConsultationV1 = async (args: SaveConsultationArgs): Promise<string | null> => {
  if (!args.id) {
    console.error("[chargeAndSaveConsultationV1] missing id");
    return null;
  }
  const { data, error } = await supabase.rpc("charge_and_save_consultation_v1", {
    p_consultation_id: args.id,
    p_name: args.name,
    p_birthdate: args.birthdate,
    p_birthtime: args.birthtime,
    p_birth_place: args.birth_place,
    p_year: args.year,
    p_mode: args.mode,
    p_goal: args.goal ?? null,
    p_origin: args.origin ?? null,
    p_intent: args.intent ?? null,
    p_result: args.result,
  });

  if (error) {
    console.error("[chargeAndSaveConsultationV1] failed:", error);
    return null;
  }
  return data as string | null;
};
