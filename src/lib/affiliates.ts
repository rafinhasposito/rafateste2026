import { supabase } from "@/integrations/supabase/client";

export const AFFILIATE_REF_STORAGE_KEY = "ps_affiliate_ref_v1";
export const AFFILIATE_CLICK_SESSION_KEY = "ps_affiliate_click_tracked_v1";
export const AFFILIATE_WINDOW_DAYS = 30;
export const DEFAULT_COMMISSION_RATE = 20;
export const RESERVED_AFFILIATE_CODES = new Set([
  "ADMIN",
  "SUPORTE",
  "OFICIAL",
  "SOLAR",
  "PROTOCOLO",
  "API",
  "AUTH",
  "CREDITS",
  "AFILIADO",
]);

export interface StoredAffiliateRef {
  code: string;
  capturedAt: number;
  expiresAt: number;
}

export interface AffiliateProfile {
  id: string;
  code: string;
  name: string;
  email: string | null;
  pix_key: string | null;
  commission_rate: number;
  active: boolean;
  clicks_count: number;
  created_at: string;
}

export interface AffiliateStats {
  clicks_count: number;
  referred_users_count: number;
  total_sales_count: number;
  pending_sales_count: number;
  paid_sales_count: number;
  pending_brl: number;
  paid_brl: number;
  total_brl: number;
  total_volume_brl: number;
}

export interface AffiliateCommissionRow {
  id: string;
  order_id: string;
  pricing_config_id: string | null;
  package_label: string;
  buyer_label: string;
  sale_amount_brl: number;
  commission_rate: number;
  commission_amount_brl: number;
  status: "pending" | "paid" | "cancelled";
  paid_at: string | null;
  payout_note: string | null;
  created_at: string;
}

export interface AffiliateDashboardResponse {
  is_affiliate: boolean;
  affiliate?: AffiliateProfile;
  stats?: AffiliateStats;
  commissions?: AffiliateCommissionRow[];
}

export interface AdminAffiliateRow extends AffiliateProfile {
  user_id: string | null;
  notes: string | null;
  referred_users_count: number;
  sales_count: number;
  pending_brl: number;
  paid_brl: number;
  total_brl: number;
  volume_brl: number;
}

export interface AdminAffiliateCommissionRow {
  id: string;
  affiliate_id: string;
  affiliate_name: string;
  affiliate_code: string;
  affiliate_pix_key: string | null;
  order_id: string;
  pricing_config_id: string | null;
  package_label: string;
  buyer_name: string;
  buyer_email: string | null;
  sale_amount_brl: number;
  commission_rate: number;
  commission_amount_brl: number;
  status: "pending" | "paid" | "cancelled";
  paid_at: string | null;
  payout_note: string | null;
  created_at: string;
}

export interface AdminAffiliatesOverview {
  dbReady: boolean;
  affiliates: AdminAffiliateRow[];
  commissions: AdminAffiliateCommissionRow[];
}

export const normalizeAffiliateCode = (raw: string | null | undefined): string => {
  if (!raw) return "";
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 32);
};

export const isValidAffiliateCode = (code: string): boolean => {
  const clean = normalizeAffiliateCode(code);
  return clean.length >= 3 && clean.length <= 32 && /^[A-Z0-9_-]+$/.test(clean);
};

export const suggestAffiliateCodeFromName = (
  nameOrEmail: string | null | undefined
): string => {
  if (!nameOrEmail) return "";
  const base = nameOrEmail.includes("@")
    ? nameOrEmail.split("@")[0]
    : nameOrEmail.trim().split(/\s+/)[0] || "";
  const clean = normalizeAffiliateCode(base);
  if (clean.length < 3) return "";
  if (RESERVED_AFFILIATE_CODES.has(clean)) return `${clean}2026`;
  return clean;
};

export const calculateCommissionBrl = (
  saleAmountBrl: number,
  commissionRatePct = DEFAULT_COMMISSION_RATE
): number => {
  if (!Number.isFinite(saleAmountBrl) || saleAmountBrl <= 0) return 0;
  if (!Number.isFinite(commissionRatePct) || commissionRatePct <= 0) return 0;
  return Math.round(saleAmountBrl * (commissionRatePct / 100) * 100) / 100;
};

export const formatBrl = (value: number): string => {
  const safe = Number.isFinite(Number(value)) ? Number(value) : 0;
  return safe.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const buildAffiliateLink = (code: string, origin?: string): string => {
  const clean = normalizeAffiliateCode(code);
  const base =
    origin ||
    (typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://protocolosolar.com.br");
  return `${base.replace(/\/$/, "")}/?ref=${encodeURIComponent(clean)}`;
};

export const buildAffiliateWhatsAppShareUrl = (
  code: string,
  origin?: string
): string => {
  const link = buildAffiliateLink(code, origin);
  const text = `Descubra qual cidade do mundo ativa o seu melhor ano no seu aniversário com o Protocolo Solar: ${link}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

export const extractRefFromSearch = (search: string): string | null => {
  if (!search) return null;
  try {
    const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
    const raw = params.get("ref") || params.get("afiliado") || params.get("partner");
    if (!raw) return null;
    const clean = normalizeAffiliateCode(raw);
    return isValidAffiliateCode(clean) ? clean : null;
  } catch {
    return null;
  }
};

export const saveStoredAffiliateRef = (
  code: string,
  nowMs = Date.now()
): StoredAffiliateRef | null => {
  const clean = normalizeAffiliateCode(code);
  if (!isValidAffiliateCode(clean)) return null;
  const payload: StoredAffiliateRef = {
    code: clean,
    capturedAt: nowMs,
    expiresAt: nowMs + AFFILIATE_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  };
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(AFFILIATE_REF_STORAGE_KEY, JSON.stringify(payload));
    }
  } catch {
    // Ignore storage errors (private mode / quota)
  }
  return payload;
};

export const getStoredAffiliateRef = (nowMs = Date.now()): string | null => {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(AFFILIATE_REF_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredAffiliateRef>;
    if (!parsed?.code || typeof parsed.expiresAt !== "number") {
      localStorage.removeItem(AFFILIATE_REF_STORAGE_KEY);
      return null;
    }
    if (nowMs > parsed.expiresAt) {
      localStorage.removeItem(AFFILIATE_REF_STORAGE_KEY);
      return null;
    }
    const clean = normalizeAffiliateCode(parsed.code);
    return isValidAffiliateCode(clean) ? clean : null;
  } catch {
    return null;
  }
};

export const captureAffiliateRefFromUrl = async (): Promise<string | null> => {
  if (typeof window === "undefined") return null;
  const code = extractRefFromSearch(window.location.search);
  if (!code) return null;

  saveStoredAffiliateRef(code);

  // Evita inflar cliques no mesmo navegador durante a mesma sessão
  try {
    const trackedKey = `${AFFILIATE_CLICK_SESSION_KEY}:${code}`;
    if (sessionStorage.getItem(trackedKey)) {
      return code;
    }
    sessionStorage.setItem(trackedKey, "1");
  } catch {
    // Ignore sessionStorage restrictions
  }

  try {
    await (supabase as any).rpc("track_affiliate_click_v1", { p_code: code });
  } catch {
    // Silently ignore if migration isn't applied yet
  }
  return code;
};

export const syncAffiliateRefForUser = async (): Promise<void> => {
  const code = getStoredAffiliateRef();
  if (!code) return;
  try {
    await (supabase as any).rpc("attach_referral_to_profile_v1", {
      p_code: code,
    });
  } catch {
    // Silently ignore if migration isn't applied yet
  }
};

const isMissingRpcError = (error: any): boolean => {
  const msg = String(error?.message || "").toLowerCase();
  const code = String(error?.code || "");
  return (
    code === "42883" ||
    code === "PGRST202" ||
    code === "42P01" ||
    msg.includes("could not find the function") ||
    msg.includes("does not exist")
  );
};

export const getMyAffiliateDashboard = async (): Promise<{
  dbReady: boolean;
  data: AffiliateDashboardResponse | null;
  error?: string;
}> => {
  const { data, error } = await (supabase as any).rpc("get_my_affiliate_dashboard_v1");
  if (error) {
    if (isMissingRpcError(error)) {
      return { dbReady: false, data: null };
    }
    return { dbReady: true, data: null, error: error.message };
  }
  return {
    dbReady: true,
    data: (data || { is_affiliate: false }) as AffiliateDashboardResponse,
  };
};

export const updateMyAffiliatePix = async (pixKey: string): Promise<void> => {
  const { error } = await (supabase as any).rpc("update_my_affiliate_pix_v1", {
    p_pix_key: pixKey.trim(),
  });
  if (error) {
    throw new Error(error.message || "Não foi possível salvar sua chave Pix.");
  }
};

export const joinAffiliateProgram = async (input: {
  name: string;
  code: string;
  pix_key?: string;
  channel?: string;
}): Promise<AffiliateProfile> => {
  const cleanCode = normalizeAffiliateCode(input.code);
  if (!isValidAffiliateCode(cleanCode)) {
    throw new Error("Escolha um código entre 3 e 32 caracteres (letras, números ou hífen).");
  }
  if (RESERVED_AFFILIATE_CODES.has(cleanCode)) {
    throw new Error("Este código é reservado. Escolha outro (ex: seu nome ou @).");
  }
  const { data, error } = await (supabase as any).rpc("join_affiliate_program_v1", {
    p_name: input.name.trim(),
    p_code: cleanCode,
    p_pix_key: input.pix_key?.trim() || null,
    p_channel: input.channel?.trim() || null,
  });
  if (error) {
    if (isMissingRpcError(error)) {
      throw new Error(
        "Auto-cadastro ainda pendente no banco. Rode a migration 20261121192500_affiliate_self_signup.sql no Supabase."
      );
    }
    throw new Error(error.message || "Não foi possível ativar seu cadastro de afiliado.");
  }
  return data as AffiliateProfile;
};

export const adminGetAffiliatesOverview = async (): Promise<AdminAffiliatesOverview> => {
  const { data, error } = await (supabase as any).rpc("admin_list_affiliates_overview_v1");
  if (error) {
    if (isMissingRpcError(error)) {
      return { dbReady: false, affiliates: [], commissions: [] };
    }
    throw new Error(error.message || "Erro ao carregar afiliados.");
  }
  return {
    dbReady: true,
    affiliates: Array.isArray(data?.affiliates) ? data.affiliates : [],
    commissions: Array.isArray(data?.commissions) ? data.commissions : [],
  };
};

export const adminCreateAffiliate = async (input: {
  name: string;
  code: string;
  email?: string;
  commission_rate?: number;
  pix_key?: string;
  notes?: string;
}): Promise<AffiliateProfile> => {
  const cleanCode = normalizeAffiliateCode(input.code);
  if (!isValidAffiliateCode(cleanCode)) {
    throw new Error("Código inválido (use de 3 a 32 letras, números ou hífen).");
  }
  const { data, error } = await (supabase as any).rpc("admin_create_affiliate_v1", {
    p_name: input.name.trim(),
    p_code: cleanCode,
    p_email: input.email?.trim() || null,
    p_commission_rate: input.commission_rate ?? DEFAULT_COMMISSION_RATE,
    p_pix_key: input.pix_key?.trim() || null,
    p_notes: input.notes?.trim() || null,
  });
  if (error) {
    throw new Error(error.message || "Erro ao cadastrar afiliado.");
  }
  return data as AffiliateProfile;
};

export const adminUpdateAffiliate = async (input: {
  affiliate_id: string;
  commission_rate?: number;
  active?: boolean;
  pix_key?: string;
  email?: string;
  notes?: string;
}): Promise<AffiliateProfile> => {
  const { data, error } = await (supabase as any).rpc("admin_update_affiliate_v1", {
    p_affiliate_id: input.affiliate_id,
    p_commission_rate: input.commission_rate ?? null,
    p_active: typeof input.active === "boolean" ? input.active : null,
    p_pix_key: input.pix_key !== undefined ? input.pix_key : null,
    p_email: input.email !== undefined ? input.email : null,
    p_notes: input.notes !== undefined ? input.notes : null,
  });
  if (error) {
    throw new Error(error.message || "Erro ao atualizar afiliado.");
  }
  return data as AffiliateProfile;
};

export const adminMarkCommissionPaid = async (
  commissionId: string,
  note?: string
): Promise<void> => {
  const { error } = await (supabase as any).rpc("admin_mark_commission_paid_v1", {
    p_commission_id: commissionId,
    p_note: note?.trim() || null,
  });
  if (error) {
    throw new Error(error.message || "Erro ao marcar comissão como paga.");
  }
};

export const adminMarkAffiliatePayout = async (
  affiliateId: string,
  note?: string
): Promise<{ paid_count: number; paid_total_brl: number }> => {
  const { data, error } = await (supabase as any).rpc("admin_mark_affiliate_payout_v1", {
    p_affiliate_id: affiliateId,
    p_note: note?.trim() || null,
  });
  if (error) {
    throw new Error(error.message || "Erro ao liquidar comissões pendentes.");
  }
  return {
    paid_count: Number(data?.paid_count || 0),
    paid_total_brl: Number(data?.paid_total_brl || 0),
  };
};
