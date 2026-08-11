import { supabase } from "@/integrations/supabase/client";
import { TEST_MODE, newLocalConsultationId, saveLocalConsultation } from "@/lib/testMode";

export interface SaveConsultationArgs {
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
}

/**
 * Insert a consultation row after a successful API lookup. Returns the row id,
 * or null on failure (non-blocking — caller may still render results).
 */
export const saveConsultation = async (args: SaveConsultationArgs): Promise<string | null> => {
  const { data, error } = await supabase
    .from("consultations")
    .insert({
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
      houses_unlocked: 1,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[saveConsultation] failed:", error);
    return null;
  }
  return data?.id ?? null;
};
