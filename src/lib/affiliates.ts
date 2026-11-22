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

export const generatePartnerNumber = (): string => {
  const arr = new Uint32Array(1);
  if (typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(arr);
  } else {
    arr[0] = Math.floor(Math.random() * 900000);
  }
  const num = 100000 + (arr[0] % 900000);
  return String(num);
};

export const formatPartnerIdLabel = (code: string | null | undefined): string => {
  const clean = normalizeAffiliateCode(code);
  if (!clean) return "";
  return /^\d+$/.test(clean) ? `#${clean}` : clean;
};

export const suggestAffiliateCodeFromName = (
  fullName: string | null | undefined
): string => {
  if (!fullName || fullName.includes("@")) return "";
  const firstWord = fullName.trim().split(/\s+/)[0] || "";
  const clean = normalizeAffiliateCode(firstWord);
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
  const clean = normalizeAffiliateCode(code).toLowerCase();
  const base =
    origin ||
    (typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://protocolosolar.com.br");
  return `${base.replace(/\/$/, "")}/i/${encodeURIComponent(clean)}`;
};

export const formatAffiliateShortPath = (code: string): string => {
  const clean = normalizeAffiliateCode(code).toLowerCase();
  return clean ? `protocolosolar.com.br/i/${clean}` : "protocolosolar.com.br/i/seunome";
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

export const extractRefFromPathname = (pathname: string): string | null => {
  if (!pathname) return null;
  const match = pathname.match(/^\/(?:i|r)\/([^/?#]+)/i);
  if (!match?.[1]) return null;
  try {
    const decoded = decodeURIComponent(match[1]);
    const clean = normalizeAffiliateCode(decoded);
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

export const captureAffiliateRefCode = async (rawCode: string | null | undefined): Promise<string | null> => {
  const code = normalizeAffiliateCode(rawCode);
  if (!isValidAffiliateCode(code)) return null;

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

export const captureAffiliateRefFromUrl = async (): Promise<string | null> => {
  if (typeof window === "undefined") return null;
  const code =
    extractRefFromPathname(window.location.pathname) ||
    extractRefFromSearch(window.location.search);
  if (!code) return null;
  return captureAffiliateRefCode(code);
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

export type AffiliateTierTag =
  | "PADRAO"
  | "VIP"
  | "INFLUENCER"
  | "MIDIA-KIT"
  | "CLIENTE"
  | "ARQUIVADO";

export const AFFILIATE_TIER_PRESETS: Array<{
  tag: AffiliateTierTag;
  label: string;
  defaultRate: number;
  badgeClass: string;
}> = [
  {
    tag: "PADRAO",
    label: "Parceiro 20%",
    defaultRate: 20,
    badgeClass: "bg-white/[0.05] text-[#CBD5E1] border-white/15",
  },
  {
    tag: "CLIENTE",
    label: "Cliente Indicador",
    defaultRate: 20,
    badgeClass: "bg-sky-500/10 text-sky-300 border-sky-400/30",
  },
  {
    tag: "INFLUENCER",
    label: "Influencer 25%",
    defaultRate: 25,
    badgeClass: "bg-purple-500/12 text-purple-200 border-purple-400/35",
  },
  {
    tag: "VIP",
    label: "VIP / Embaixador 30%",
    defaultRate: 30,
    badgeClass: "bg-[#C9A227]/18 text-[#F5DE98] border-[#C9A227]/45",
  },
  {
    tag: "MIDIA-KIT",
    label: "Mídia Kit",
    defaultRate: 20,
    badgeClass: "bg-amber-500/12 text-amber-200 border-amber-400/35",
  },
  {
    tag: "ARQUIVADO",
    label: "Arquivado",
    defaultRate: 20,
    badgeClass: "bg-red-500/10 text-red-300 border-red-400/25",
  },
];

export const extractAffiliateTag = (notes: string | null | undefined): AffiliateTierTag => {
  const raw = String(notes || "").toUpperCase();
  if (raw.includes("[ARQUIVADO]")) return "ARQUIVADO";
  if (raw.includes("[VIP]")) return "VIP";
  if (raw.includes("[INFLUENCER]")) return "INFLUENCER";
  if (raw.includes("[MIDIA-KIT]")) return "MIDIA-KIT";
  if (raw.includes("[CLIENTE]")) return "CLIENTE";
  return "PADRAO";
};

export const stripAffiliateTagFromNotes = (notes: string | null | undefined): string => {
  return String(notes || "")
    .replace(/\[(PADRAO|VIP|INFLUENCER|MIDIA-KIT|CLIENTE|ARQUIVADO)\]\s*/gi, "")
    .trim();
};

export const applyAffiliateTagToNotes = (
  notes: string | null | undefined,
  tag: AffiliateTierTag
): string => {
  const clean = stripAffiliateTagFromNotes(notes);
  if (tag === "PADRAO") return clean;
  return clean ? `[${tag}] ${clean}` : `[${tag}]`;
};

export const computeAffiliateAgeDays = (
  createdAtIso: string | null | undefined,
  nowMs = Date.now()
): number => {
  if (!createdAtIso) return 0;
  const parsed = Date.parse(createdAtIso);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.floor((nowMs - parsed) / (24 * 60 * 60 * 1000)));
};

export const computeAffiliateConversionPct = (
  clicksCount: number,
  salesCount: number
): number => {
  const clicks = Number(clicksCount) || 0;
  const sales = Number(salesCount) || 0;
  if (clicks <= 0 || sales <= 0) return 0;
  return Math.min(100, Math.round((sales / clicks) * 1000) / 10);
};

export const isAffiliateInactiveZeroSales = (
  aff: Pick<AdminAffiliateRow, "sales_count" | "created_at" | "clicks_count">,
  minDays: number,
  onlyZeroClicks = false,
  nowMs = Date.now()
): boolean => {
  const sales = Number(aff.sales_count || 0);
  if (sales > 0) return false;
  if (onlyZeroClicks && Number(aff.clicks_count || 0) > 0) return false;
  const ageDays = computeAffiliateAgeDays(aff.created_at, nowMs);
  return ageDays >= minDays;
};

const escapeCsvCell = (value: string | number | null | undefined): string => {
  const str = String(value ?? "").replace(/\r?\n/g, " ").trim();
  if (str.includes(";") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const buildAffiliatesPixCsv = (
  affiliates: AdminAffiliateRow[],
  minPayoutBrl = 0
): string => {
  const eligible = affiliates.filter(
    (a) => Number(a.pending_brl || 0) > 0 && Number(a.pending_brl || 0) >= minPayoutBrl
  );
  const header = [
    "Cadastro",
    "Nome",
    "Email",
    "Chave_Pix",
    "Valor_A_Pagar_BRL",
    "Comissao_Pct",
    "Vendas_Total",
    "Status",
    "Link_Indicacao",
  ].join(";");

  const rows = eligible.map((a) =>
    [
      formatPartnerIdLabel(a.code),
      a.name,
      a.email || "",
      a.pix_key || "SEM_PIX",
      Number(a.pending_brl || 0).toFixed(2).replace(".", ","),
      `${a.commission_rate}%`,
      a.sales_count || 0,
      a.active ? "Ativo" : "Pausado",
      buildAffiliateLink(a.code),
    ]
      .map(escapeCsvCell)
      .join(";")
  );

  return "\uFEFF" + [header, ...rows].join("\n");
};

export const buildAffiliatesFullCsv = (
  affiliates: AdminAffiliateRow[],
  lastSaleByAffId: Record<string, string> = {}
): string => {
  const header = [
    "Cadastro",
    "Nome",
    "Email",
    "Tier",
    "Status",
    "Comissao_Pct",
    "Chave_Pix",
    "Cliques",
    "Cadastros",
    "Vendas",
    "Conversao_Pct",
    "Volume_Vendas_BRL",
    "A_Pagar_BRL",
    "Ja_Pago_BRL",
    "Criado_Em",
    "Ultima_Venda",
    "Link_Indicacao",
    "Observacoes",
  ].join(";");

  const rows = affiliates.map((a) => {
    const conv = computeAffiliateConversionPct(a.clicks_count, a.sales_count);
    const lastSale = lastSaleByAffId[a.id]
      ? new Date(lastSaleByAffId[a.id]).toLocaleDateString("pt-BR")
      : "";
    return [
      formatPartnerIdLabel(a.code),
      a.name,
      a.email || "",
      extractAffiliateTag(a.notes),
      a.active ? "Ativo" : "Pausado",
      `${a.commission_rate}%`,
      a.pix_key || "",
      a.clicks_count || 0,
      a.referred_users_count || 0,
      a.sales_count || 0,
      `${conv}%`,
      Number(a.volume_brl || 0).toFixed(2).replace(".", ","),
      Number(a.pending_brl || 0).toFixed(2).replace(".", ","),
      Number(a.paid_brl || 0).toFixed(2).replace(".", ","),
      a.created_at ? new Date(a.created_at).toLocaleDateString("pt-BR") : "",
      lastSale,
      buildAffiliateLink(a.code),
      stripAffiliateTagFromNotes(a.notes),
    ]
      .map(escapeCsvCell)
      .join(";");
  });

  return "\uFEFF" + [header, ...rows].join("\n");
};

export const adminDeleteAffiliate = async (
  aff: Pick<AdminAffiliateRow, "id" | "sales_count" | "notes">
): Promise<{ action: "deleted" | "archived" }> => {
  const { data, error } = await (supabase as any).rpc("admin_delete_affiliate_v1", {
    p_affiliate_id: aff.id,
    p_force_archive_if_sales: true,
  });

  if (!error && data) {
    return { action: data.action === "archived" ? "archived" : "deleted" };
  }

  if (error && !isMissingRpcError(error)) {
    throw new Error(error.message || "Erro ao remover afiliado.");
  }

  // Fallback imediato caso a migration 20261122001500 ainda não tenha sido rodada no Supabase
  if (Number(aff.sales_count || 0) > 0) {
    await adminUpdateAffiliate({
      affiliate_id: aff.id,
      active: false,
      notes: applyAffiliateTagToNotes(aff.notes, "ARQUIVADO"),
    });
    return { action: "archived" };
  }

  const { error: delErr } = await (supabase as any)
    .from("affiliates")
    .delete()
    .eq("id", aff.id);

  if (delErr) {
    // Se houver vínculo de profile impedindo delete direto sem a RPC, arquiva e pausa com segurança
    await adminUpdateAffiliate({
      affiliate_id: aff.id,
      active: false,
      notes: applyAffiliateTagToNotes(aff.notes, "ARQUIVADO"),
    });
    return { action: "archived" };
  }

  return { action: "deleted" };
};

export const adminBulkAffiliatesAction = async (input: {
  affiliates: AdminAffiliateRow[];
  action: "activate" | "pause" | "set_rate" | "payout" | "delete_unused" | "set_tag";
  commission_rate?: number;
  tag?: AffiliateTierTag;
  note?: string;
}): Promise<{
  affected: number;
  archived: number;
  paid_total_brl: number;
}> => {
  const targetList = input.affiliates;
  if (!targetList.length) {
    return { affected: 0, archived: 0, paid_total_brl: 0 };
  }

  const ids = targetList.map((a) => a.id);

  if (input.action === "set_tag" && input.tag) {
    const tag = input.tag;
    const preset = AFFILIATE_TIER_PRESETS.find((p) => p.tag === tag);
    await Promise.all(
      targetList.map((a) =>
        adminUpdateAffiliate({
          affiliate_id: a.id,
          notes: applyAffiliateTagToNotes(a.notes, tag),
          commission_rate:
             input.commission_rate && input.commission_rate > 0
              ? input.commission_rate
              : preset?.defaultRate,
        })
      )
    );
    return { affected: targetList.length, archived: 0, paid_total_brl: 0 };
  }

  const { data, error } = await (supabase as any).rpc("admin_bulk_affiliates_action_v1", {
    p_affiliate_ids: ids,
    p_action: input.action,
    p_commission_rate: input.commission_rate ?? null,
    p_note: input.note ?? null,
  });

  if (!error && data) {
    return {
      affected: Number(data.affected || 0),
      archived: Number(data.archived || 0),
      paid_total_brl: Number(data.paid_total_brl || 0),
    };
  }

  if (error && !isMissingRpcError(error)) {
    throw new Error(error.message || "Erro ao executar ação em lote.");
  }

  // Fallback imediato usando as RPCs individuais já existentes no banco
  if (input.action === "activate" || input.action === "pause") {
    const nextActive = input.action === "activate";
    await Promise.all(
      targetList.map((a) => adminUpdateAffiliate({ affiliate_id: a.id, active: nextActive }))
    );
    return { affected: targetList.length, archived: 0, paid_total_brl: 0 };
  }

  if (input.action === "set_rate") {
    const rate = Number(input.commission_rate) || DEFAULT_COMMISSION_RATE;
    await Promise.all(
      targetList.map((a) =>
        adminUpdateAffiliate({ affiliate_id: a.id, commission_rate: rate })
      )
    );
    return { affected: targetList.length, archived: 0, paid_total_brl: 0 };
  }

  if (input.action === "payout") {
    const withPending = targetList.filter((a) => Number(a.pending_brl || 0) > 0);
    const results = await Promise.all(
      withPending.map((a) =>
        adminMarkAffiliatePayout(a.id, input.note || `Pix enviado para ${a.pix_key || a.name}`)
      )
    );
    const totalBrl = results.reduce((sum, r) => sum + Number(r.paid_total_brl || 0), 0);
    return { affected: withPending.length, archived: 0, paid_total_brl: totalBrl };
  }

  if (input.action === "delete_unused") {
    let deleted = 0;
    let archived = 0;
    for (const aff of targetList) {
      const res = await adminDeleteAffiliate(aff);
      if (res.action === "deleted") deleted += 1;
      else archived += 1;
    }
    return { affected: deleted, archived, paid_total_brl: 0 };
  }

  return { affected: 0, archived: 0, paid_total_brl: 0 };
};
