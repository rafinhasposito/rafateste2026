import { supabase } from "@/integrations/supabase/client";

export type CouponRewardType = "1_casa" | "expansao" | "full_map";

export interface RedeemCouponRow {
  id: string;
  code: string;
  reward_type: CouponRewardType;
  credits_amount: number;
  recipient_name: string | null;
  note: string | null;
  max_uses: number;
  uses_count: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
}

export const COUPON_REWARD_META: Record<
  CouponRewardType,
  {
    label: string;
    shortLabel: string;
    badge: string;
    credits: number;
    valueBrl: string;
    description: string;
  }
> = {
  "1_casa": {
    label: "1 Casa Avulsa",
    shortLabel: "1 Casa (1 Crédito)",
    badge: "PRESENTE • 1 CASA SOLAR",
    credits: 1,
    valueBrl: "R$ 19,90",
    description: "Libera 1 Casa ou Cidade escolhida com o 1º Foco Principal incluso.",
  },
  expansao: {
    label: "Passe Expansão (1 Casa + Todos os Focos)",
    shortLabel: "Passe Expansão (Casa + Focos)",
    badge: "PRESENTE VIP • PASSE EXPANSÃO",
    credits: 3,
    valueBrl: "R$ 49,90",
    description: "Desbloqueia 1 Casa escolhida com TODOS os 8 Focos liberados em qualquer consulta.",
  },
  full_map: {
    label: "Passe Mapa Completo (12 Casas + Todos os Focos)",
    shortLabel: "Mapa Completo (12 Casas + Focos)",
    badge: "PRESENTE EXCLUSIVO • MAPA COMPLETO 360º",
    credits: 7,
    valueBrl: "R$ 99,90",
    description: "Acesso total: desbloqueia TODAS as 12 Casas + TODOS os Focos na consulta escolhida.",
  },
};

const LOCAL_COUPONS_KEY = "ps_admin_coupons_v1";
const LOCAL_REDEEMED_KEY = "ps_redeemed_coupons_by_user_v1";

const readLocalCoupons = (): RedeemCouponRow[] => {
  try {
    const raw = localStorage.getItem(LOCAL_COUPONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeLocalCoupons = (rows: RedeemCouponRow[]) => {
  try {
    localStorage.setItem(LOCAL_COUPONS_KEY, JSON.stringify(rows));
  } catch {
    // ignore storage errors
  }
};

export const generateCouponCode = (prefix = "SOLAR"): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 símbolos sem I/O/0/1 (sem viés de módulo em 256)
  const bytes = new Uint8Array(8);
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.getRandomValues === "function") {
    cryptoObj.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] & 31];
  }
  const cleanPrefix = prefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, "") || "SOLAR";
  return `${cleanPrefix}-${code.slice(0, 4)}-${code.slice(4, 8)}`;
};

export const listCoupons = async (): Promise<{
  rows: RedeemCouponRow[];
  dbReady: boolean;
}> => {
  const { data, error } = await (supabase as any)
    .from("redeem_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error && Array.isArray(data)) {
    return { rows: data as RedeemCouponRow[], dbReady: true };
  }

  return { rows: readLocalCoupons(), dbReady: false };
};

export const createCoupon = async (input: {
  code: string;
  reward_type: CouponRewardType;
  recipient_name?: string;
  note?: string;
  max_uses?: number;
  expires_at?: string | null;
}): Promise<{ row: RedeemCouponRow; dbReady: boolean }> => {
  const cleanCode = input.code.trim().toUpperCase().replace(/\s+/g, "-");
  if (cleanCode.length < 3) {
    throw new Error("O código deve ter pelo menos 3 caracteres.");
  }

  const meta = COUPON_REWARD_META[input.reward_type];
  if (!meta) {
    throw new Error("Tipo de benefício inválido.");
  }

  const { data, error } = await (supabase as any).rpc("admin_create_redeem_code_v1", {
    p_code: cleanCode,
    p_reward_type: input.reward_type,
    p_recipient_name: input.recipient_name?.trim() || null,
    p_note: input.note?.trim() || null,
    p_max_uses: Math.max(1, input.max_uses ?? 1),
    p_expires_at: input.expires_at || null,
  });

  if (!error && data) {
    return { row: data as RedeemCouponRow, dbReady: true };
  }

  const msg = String(error?.message || "");
  const isMissingRpcOrTable =
    msg.includes("Could not find the function") ||
    msg.includes("does not exist") ||
    msg.includes("relation") ||
    error?.code === "PGRST202" ||
    error?.code === "42883" ||
    error?.code === "42P01";

  if (!isMissingRpcOrTable && error) {
    if (msg.includes("duplicate key") || msg.includes("unique")) {
      throw new Error("Já existe um cupom com este código.");
    }
    throw new Error(msg);
  }

  // Fallback local enquanto a migration não foi rodada no Supabase remoto
  const current = readLocalCoupons();
  if (current.some((c) => c.code.toUpperCase() === cleanCode)) {
    throw new Error("Já existe um cupom com este código.");
  }

  const newRow: RedeemCouponRow = {
    id: crypto.randomUUID(),
    code: cleanCode,
    reward_type: input.reward_type,
    credits_amount: meta.credits,
    recipient_name: input.recipient_name?.trim() || null,
    note: input.note?.trim() || null,
    max_uses: Math.max(1, input.max_uses ?? 1),
    uses_count: 0,
    active: true,
    expires_at: input.expires_at || null,
    created_at: new Date().toISOString(),
  };

  writeLocalCoupons([newRow, ...current]);
  return { row: newRow, dbReady: false };
};

export const toggleCouponActive = async (id: string, active: boolean): Promise<void> => {
  const { error } = await (supabase as any)
    .from("redeem_codes")
    .update({ active, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    const updated = readLocalCoupons().map((c) => (c.id === id ? { ...c, active } : c));
    writeLocalCoupons(updated);
  }
};

export const deleteCoupon = async (id: string): Promise<void> => {
  const { error } = await (supabase as any).from("redeem_codes").delete().eq("id", id);
  const filtered = readLocalCoupons().filter((c) => c.id !== id);
  writeLocalCoupons(filtered);
  if (error && !String(error.message || "").includes("does not exist")) {
    // ignore if local-only
  }
};

export const redeemCouponCode = async (args: {
  code: string;
  userId: string;
}): Promise<{
  reward_type: CouponRewardType;
  credits_added: number;
  label: string;
}> => {
  const cleanCode = args.code.trim().toUpperCase();
  if (!cleanCode) {
    throw new Error("Digite um código de cupom válido.");
  }

  // 1. Tenta resgatar via RPC segura no Supabase (redeem_code_v1)
  const { data, error } = await (supabase as any).rpc("redeem_code_v1", {
    p_code: cleanCode,
  });

  if (!error && data) {
    if (data.success === false) {
      throw new Error(String(data.error || "Não foi possível resgatar este cupom."));
    }
    return {
      reward_type: (data.reward_type || "1_casa") as CouponRewardType,
      credits_added: Number(data.credits_added || 1),
      label: String(data.label || COUPON_REWARD_META[(data.reward_type || "1_casa") as CouponRewardType].label),
    };
  }

  const msg = String(error?.message || "");
  const isMissingRpc =
    msg.includes("Could not find the function") ||
    msg.includes("does not exist") ||
    error?.code === "PGRST202" ||
    error?.code === "42883";

  if (!isMissingRpc && error) {
    throw new Error(msg.replace(/^.*RAISE EXCEPTION\s*/i, ""));
  }

  // 2. Fallback para cupons criados localmente no mesmo navegador / Admin
  const localCoupons = readLocalCoupons();
  const found = localCoupons.find((c) => c.code.toUpperCase() === cleanCode);
  if (!found) {
    throw new Error("Cupom não encontrado. Verifique se digitou o código corretamente.");
  }
  if (!found.active) {
    throw new Error("Este cupom foi desativado.");
  }
  if (found.expires_at && new Date(found.expires_at).getTime() < Date.now()) {
    throw new Error("Este cupom expirou.");
  }
  if (found.uses_count >= found.max_uses) {
    throw new Error("Este cupom já atingiu o limite de resgates.");
  }

  const redeemedRaw = localStorage.getItem(LOCAL_REDEEMED_KEY);
  const redeemedMap: Record<string, string[]> = redeemedRaw ? JSON.parse(redeemedRaw) : {};
  const userRedeemed = redeemedMap[args.userId] || [];
  if (userRedeemed.includes(found.id)) {
    throw new Error("Você já resgatou este cupom em sua conta.");
  }

  const meta = COUPON_REWARD_META[found.reward_type];

  const { error: adjError } = await supabase.rpc("admin_adjust_credits", {
    p_target_user_id: args.userId,
    p_amount: meta.credits,
    p_reason: `Resgate de Cupom (${found.code}): ${meta.label}`,
  });

  if (adjError) {
    throw new Error(
      "Para liberar o resgate público de cupons para todos os usuários, execute a migration SQL de cupons no Supabase."
    );
  }

  const nextCoupons = localCoupons.map((c) =>
    c.id === found.id ? { ...c, uses_count: c.uses_count + 1 } : c
  );
  writeLocalCoupons(nextCoupons);
  redeemedMap[args.userId] = [...userRedeemed, found.id];
  localStorage.setItem(LOCAL_REDEEMED_KEY, JSON.stringify(redeemedMap));

  return {
    reward_type: found.reward_type,
    credits_added: meta.credits,
    label: meta.label,
  };
};
