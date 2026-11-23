import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Calendar,
  Compass,
  Download,
  Filter,
  Globe2,
  Home,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";

type PeriodKey = "today" | "7d" | "30d" | "all";
type ModeFilter = "all" | "futuro" | "presente" | "passado";
type PathFilter = "all" | "cidade" | "casa" | "intencao";
type ScopeFilter = "all" | "full" | "single";
type GeoTab = "consulted" | "birth";

interface RawConsultation {
  id: string;
  user_id: string;
  name: string;
  mode: string;
  origin: string | null;
  intent: string | null;
  goal: number | null;
  year: string;
  birth_place: string;
  houses_unlocked: number;
  unlocked_houses: number[] | null;
  created_at: string;
}

interface EnrichedConsultation extends RawConsultation {
  userName: string;
  userEmail: string;
  normalizedMode: "futuro" | "presente" | "passado";
  pathType: "cidade" | "casa" | "intencao";
  unlockedCount: number;
  isFullMap: boolean;
}

const HOUSE_META: Record<number, { short: string; color: string }> = {
  1: { short: "Protagonismo & Início", color: "#F59E0B" },
  2: { short: "Dinheiro & Segurança", color: "#10B981" },
  3: { short: "Comunicação & Estudos", color: "#38BDF8" },
  4: { short: "Lar & Família", color: "#60A5FA" },
  5: { short: "Amor, Prazer & Criação", color: "#F43F5E" },
  6: { short: "Rotina & Saúde", color: "#34D399" },
  7: { short: "Parcerias & Relações", color: "#EC4899" },
  8: { short: "Transições & Investimentos", color: "#A855F7" },
  9: { short: "Expansão & Viagens", color: "#F97316" },
  10: { short: "Carreira & Sucesso", color: "#F5B041" },
  11: { short: "Networking & Amigos", color: "#22D3EE" },
  12: { short: "Retiro & Espiritualidade", color: "#818CF8" },
};

const PERIOD_LABELS: Record<PeriodKey, string> = {
  today: "Hoje",
  "7d": "7 Dias",
  "30d": "30 Dias",
  all: "Tudo",
};

const normalizeCityLabel = (raw: string | null | undefined): string => {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  // Mantém Cidade, Estado/País enxuto (primeiras 2 partes)
  const parts = trimmed
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 2) return `${parts[0]}, ${parts[1]}`;
  return parts[0] || trimmed;
};

const ConsultationsAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<EnrichedConsultation[]>([]);

  const [period, setPeriod] = useState<PeriodKey>("all");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
  const [pathFilter, setPathFilter] = useState<PathFilter>("all");
  const [houseFilter, setHouseFilter] = useState<string>("all");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [geoTab, setGeoTab] = useState<GeoTab>("consulted");
  const [visibleLimit, setVisibleLimit] = useState(50);

  const loadConsultations = useCallback(async () => {
    setLoading(true);
    try {
      const [consultsRes, profilesRes] = await Promise.all([
        supabase
          .from("consultations")
          .select(
            "id, user_id, name, mode, origin, intent, goal, year, birth_place, houses_unlocked, unlocked_houses, created_at"
          )
          .order("created_at", { ascending: false })
          .limit(1500),
        supabase
          .from("profiles")
          .select("user_id, email, full_name, display_name"),
      ]);

      const profMap = new Map<string, { name: string; email: string }>();
      (profilesRes.data ?? []).forEach((p: any) => {
        profMap.set(p.user_id, {
          email: p.email || "—",
          name:
            p.full_name?.trim() ||
            p.display_name?.trim() ||
            (p.email ? p.email.split("@")[0] : "Cliente"),
        });
      });

      const enriched: EnrichedConsultation[] = (
        (consultsRes.data as RawConsultation[]) ?? []
      ).map((c) => {
        const prof = profMap.get(c.user_id);
        const rawMode = (c.mode || "futuro").toLowerCase().trim();
        const normalizedMode: "futuro" | "presente" | "passado" =
          rawMode === "passado"
            ? "passado"
            : rawMode === "presente"
            ? "presente"
            : "futuro";

        const pathType: "cidade" | "casa" | "intencao" = c.origin
          ? "cidade"
          : c.intent
          ? "intencao"
          : "casa";

        const unlockedCount = Math.max(
          Number(c.houses_unlocked || 0),
          Array.isArray(c.unlocked_houses) ? c.unlocked_houses.length : 0,
          1
        );

        return {
          ...c,
          userName: prof?.name || c.name || "Cliente",
          userEmail: prof?.email || "—",
          normalizedMode,
          pathType,
          unlockedCount,
          isFullMap: unlockedCount >= 12,
        };
      });

      setRows(enriched);
    } catch (err: any) {
      toast.error(`Erro ao carregar consultas: ${err?.message || "Erro"}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConsultations();
  }, [loadConsultations]);

  const periodCutoffIso = useMemo(() => {
    const now = new Date();
    if (period === "today") {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    }
    if (period === "7d") {
      return new Date(Date.now() - 7 * 86400_000).toISOString();
    }
    if (period === "30d") {
      return new Date(Date.now() - 30 * 86400_000).toISOString();
    }
    return "";
  }, [period]);

  // Base filtrada pelo período (alimenta os rankings e KPIs de inteligência)
  const periodRows = useMemo(() => {
    if (!periodCutoffIso) return rows;
    return rows.filter((r) => r.created_at >= periodCutoffIso);
  }, [rows, periodCutoffIso]);

  // Base final com todos os filtros combinados (alimenta a tabela e exportação)
  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return periodRows.filter((r) => {
      if (modeFilter !== "all" && r.normalizedMode !== modeFilter) return false;
      if (pathFilter !== "all" && r.pathType !== pathFilter) return false;
      if (houseFilter !== "all" && String(r.goal || "") !== houseFilter) return false;
      if (scopeFilter === "full" && !r.isFullMap) return false;
      if (scopeFilter === "single" && r.isFullMap) return false;

      if (q) {
        const hay = [
          r.userName,
          r.name,
          r.userEmail,
          r.origin || "",
          r.birth_place || "",
          r.intent || "",
          r.year || "",
          r.goal ? `casa ${r.goal}` : "",
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [periodRows, modeFilter, pathFilter, houseFilter, scopeFilter, searchQuery]);

  // Análises estatísticas da base no período selecionado
  const analytics = useMemo(() => {
    const base = periodRows;
    const total = base.length;
    const safeTotal = Math.max(total, 1);

    const uniqueUsers = new Set(base.map((r) => r.user_id)).size;
    const avgPerUser = uniqueUsers > 0 ? (total / uniqueUsers).toFixed(1) : "0.0";

    const byMode = { futuro: 0, presente: 0, passado: 0 };
    const byPath = { cidade: 0, casa: 0, intencao: 0 };
    const byScope = { full: 0, partial: 0, single: 0 };
    const houseCounts = new Map<number, number>();
    const consultedCities = new Map<string, number>();
    const birthCities = new Map<string, number>();

    for (let h = 1; h <= 12; h++) houseCounts.set(h, 0);

    base.forEach((r) => {
      byMode[r.normalizedMode]++;
      byPath[r.pathType]++;

      if (r.isFullMap) byScope.full++;
      else if (r.unlockedCount > 1) byScope.partial++;
      else byScope.single++;

      if (r.goal && r.goal >= 1 && r.goal <= 12) {
        houseCounts.set(r.goal, (houseCounts.get(r.goal) || 0) + 1);
      }

      if (r.origin) {
        const clean = normalizeCityLabel(r.origin);
        if (clean) consultedCities.set(clean, (consultedCities.get(clean) || 0) + 1);
      }

      if (r.birth_place) {
        const cleanBirth = normalizeCityLabel(r.birth_place);
        if (cleanBirth) {
          birthCities.set(cleanBirth, (birthCities.get(cleanBirth) || 0) + 1);
        }
      }
    });

    const topModeEntry = (
      [
        { key: "futuro" as const, label: "Futuro", count: byMode.futuro },
        { key: "presente" as const, label: "Presente", count: byMode.presente },
        { key: "passado" as const, label: "Passado", count: byMode.passado },
      ]
    ).sort((a, b) => b.count - a.count)[0];

    const topPathEntry = (
      [
        { key: "cidade" as const, label: "Por Cidade", count: byPath.cidade },
        { key: "casa" as const, label: "Por Casa", count: byPath.casa },
        { key: "intencao" as const, label: "Por Intenção", count: byPath.intencao },
      ]
    ).sort((a, b) => b.count - a.count)[0];

    const houseRanking = Array.from(houseCounts.entries())
      .map(([house, count]) => ({
        house,
        count,
        pct: Math.round((count / safeTotal) * 100),
        short: HOUSE_META[house]?.short || `Casa ${house}`,
        color: HOUSE_META[house]?.color || "#F5B041",
      }))
      .sort((a, b) => b.count - a.count || a.house - b.house);

    const maxHouseCount = Math.max(houseRanking[0]?.count || 1, 1);
    const topHouse = houseRanking[0];

    const topConsultedCities = [...consultedCities.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([city, count]) => ({ city, count }));

    const topBirthCities = [...birthCities.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([city, count]) => ({ city, count }));

    return {
      total,
      safeTotal,
      uniqueUsers,
      avgPerUser,
      byMode,
      byPath,
      byScope,
      topModeEntry,
      topPathEntry,
      houseRanking,
      maxHouseCount,
      topHouse,
      topConsultedCities,
      topBirthCities,
    };
  }, [periodRows]);

  const hasActiveFilters =
    modeFilter !== "all" ||
    pathFilter !== "all" ||
    houseFilter !== "all" ||
    scopeFilter !== "all" ||
    searchQuery.trim() !== "";

  const clearAllFilters = () => {
    setModeFilter("all");
    setPathFilter("all");
    setHouseFilter("all");
    setScopeFilter("all");
    setSearchQuery("");
  };

  const handleExportCsv = () => {
    const headers = [
      "Data_Hora",
      "Cliente",
      "Email",
      "Tempo",
      "Caminho",
      "Casa",
      "Tema_Casa",
      "Ano_Alvo",
      "Cidade_Consultada",
      "Intencao",
      "Cidade_Nascimento",
      "Casas_Desbloqueadas",
    ];
    const lines = [
      headers.join(";"),
      ...filteredRows.map((r) =>
        [
          new Date(r.created_at).toLocaleString("pt-BR"),
          `"${(r.userName || "").replace(/"/g, '""')}"`,
          `"${(r.userEmail || "").replace(/"/g, '""')}"`,
          r.normalizedMode,
          r.pathType,
          r.goal ?? "",
          `"${r.goal ? HOUSE_META[r.goal]?.short || "" : ""}"`,
          r.year,
          `"${(r.origin || "").replace(/"/g, '""')}"`,
          `"${(r.intent || "").replace(/"/g, '""')}"`,
          `"${(r.birth_place || "").replace(/"/g, '""')}"`,
          r.unlockedCount,
        ].join(";")
      ),
    ];
    const blob = new Blob(["\uFEFF" + lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `protocolo-solar-consultas-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filteredRows.length} consultas exportadas em CSV!`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 rounded-[28px] bg-white/[0.03] border border-white/10" />
        ))}
        <div className="md:col-span-4 h-72 rounded-[28px] bg-white/[0.03] border border-white/10" />
      </div>
    );
  }

  const pct = (val: number) => Math.round((val / analytics.safeTotal) * 100);

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-ps-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Consultas & Inteligência de Uso
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 font-mono text-[11px] font-bold">
              {analytics.total} no período
            </span>
          </div>
          <p className="text-white/50 text-xs sm:text-sm mt-1">
            Descubra exatamente qual tempo (Futuro, Presente, Passado), caminho (Cidade, Casa, Intenção) e Casa o público mais procura.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center p-1 rounded-2xl bg-[#0A0B10]/90 border border-white/10">
            {(["today", "7d", "30d", "all"] as PeriodKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPeriod(key)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                  period === key
                    ? "bg-gradient-to-r from-[#10B981] to-[#059669] text-black shadow-[0_0_16px_rgba(16,185,129,0.35)]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {PERIOD_LABELS[key]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={loadConsultations}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-white/80 text-xs font-semibold transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#F5B041]/15 hover:bg-[#F5B041]/25 border border-[#F5B041]/40 text-[#FFF3D1] text-xs font-bold transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-[#F5B041]" />
            <span>Exportar CSV ({filteredRows.length})</span>
          </button>
        </div>
      </div>

      {/* ── LINHA 1: 4 CARDS DE INTELIGÊNCIA ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 — Destaque Total */}
        <div
          className="rounded-[26px] p-5 border border-emerald-400/35 relative overflow-hidden shadow-[0_18px_42px_rgba(16,185,129,0.18)]"
          style={{
            background: "linear-gradient(135deg, #064E3B 0%, #047857 55%, #065F46 100%)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/85 text-xs font-semibold">
              Consultas ({PERIOD_LABELS[period]})
            </span>
            <Compass className="w-4 h-4 text-emerald-200" />
          </div>
          <div className="font-ps-display text-4xl font-bold text-white mb-3">
            {analytics.total}
          </div>
          <div className="flex items-center justify-between text-[11px] text-emerald-100/85">
            <span>{analytics.uniqueUsers} pessoas únicas</span>
            <span className="font-mono font-bold bg-black/25 px-2 py-0.5 rounded-lg">
              {analytics.avgPerUser} / pessoa
            </span>
          </div>
        </div>

        {/* Card 2 — Tempo Mais Usado */}
        <div className="rounded-[26px] p-5 bg-[#0A0B10]/90 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/65 text-xs font-medium">Tempo Mais Usado</span>
            <Calendar className="w-4 h-4 text-[#F5B041]" />
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-ps-display text-3xl font-bold text-white">
              {analytics.topModeEntry.label}
            </span>
            <span className="font-mono text-xs font-bold text-[#F5B041]">
              {pct(analytics.topModeEntry.count)}%
            </span>
          </div>
          <p className="text-[11px] text-white/50 truncate">
            Futuro <strong className="text-white">{analytics.byMode.futuro}</strong> · Presente{" "}
            <strong className="text-white">{analytics.byMode.presente}</strong> · Passado{" "}
            <strong className="text-white">{analytics.byMode.passado}</strong>
          </p>
        </div>

        {/* Card 3 — Caminho Preferido */}
        <div className="rounded-[26px] p-5 bg-[#0A0B10]/90 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/65 text-xs font-medium">Caminho Preferido</span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-ps-display text-3xl font-bold text-white">
              {analytics.topPathEntry.label}
            </span>
            <span className="font-mono text-xs font-bold text-emerald-300">
              {pct(analytics.topPathEntry.count)}%
            </span>
          </div>
          <p className="text-[11px] text-white/50 truncate">
            Cidade <strong className="text-white">{analytics.byPath.cidade}</strong> · Casa{" "}
            <strong className="text-white">{analytics.byPath.casa}</strong> · Intenção{" "}
            <strong className="text-white">{analytics.byPath.intencao}</strong>
          </p>
        </div>

        {/* Card 4 — Casa #1 Mais Buscada */}
        <div className="rounded-[26px] p-5 bg-[#0A0B10]/90 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/65 text-xs font-medium">Casa #1 em Demanda</span>
            <Sparkles className="w-4 h-4 text-[#F5B041]" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-ps-display text-3xl font-bold text-white">
              {analytics.topHouse && analytics.topHouse.count > 0
                ? `Casa ${analytics.topHouse.house}`
                : "—"}
            </span>
            {analytics.topHouse && analytics.topHouse.count > 0 && (
              <span
                className="font-mono text-xs font-bold"
                style={{ color: analytics.topHouse.color }}
              >
                {analytics.topHouse.count}x ({analytics.topHouse.pct}%)
              </span>
            )}
          </div>
          <p className="text-[11px] text-white/55 truncate">
            {analytics.topHouse && analytics.topHouse.count > 0
              ? analytics.topHouse.short
              : "Sem consultas no período"}
          </p>
        </div>
      </div>

      {/* ── LINHA 2: 3 BLOCOS BENTO DE INTELIGÊNCIA (Ranking 12 Casas + Quebra Tempo/Caminho + Top Cidades) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Ranking das 12 Casas (Cols 1-5) */}
        <div className="lg:col-span-5 rounded-[28px] p-6 bg-[#0A0B10]/90 border border-white/10 backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-ps-display text-base sm:text-lg font-bold text-white">
                Ranking das 12 Casas Mais Buscadas
              </h3>
              <p className="text-white/45 text-[11px]">
                Clique em qualquer Casa para filtrar a lista abaixo
              </p>
            </div>
            {houseFilter !== "all" && (
              <button
                type="button"
                onClick={() => setHouseFilter("all")}
                className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                Limpar Casa
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {analytics.houseRanking.map((item) => {
              const isSelected = houseFilter === String(item.house);
              const barWidth =
                item.count > 0
                  ? Math.max(8, Math.round((item.count / analytics.maxHouseCount) * 100))
                  : 0;
              return (
                <button
                  key={item.house}
                  type="button"
                  onClick={() =>
                    setHouseFilter(isSelected ? "all" : String(item.house))
                  }
                  className={`w-full text-left p-2.5 rounded-2xl border transition-all ${
                    isSelected
                      ? "bg-white/[0.08] border-white/30"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                    <span className="font-medium text-white truncate">
                      <strong style={{ color: item.color }}>Casa {item.house}</strong>{" "}
                      <span className="text-white/55">· {item.short}</span>
                    </span>
                    <span className="font-mono text-[11px] font-bold text-white shrink-0">
                      {item.count}{" "}
                      <span className="text-white/40 font-normal">({item.pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quebra Estratégica: Tempo, Caminho e Escopo (Cols 6-9) */}
        <div className="lg:col-span-4 rounded-[28px] p-6 bg-[#0A0B10]/90 border border-white/10 backdrop-blur-2xl flex flex-col justify-between gap-5">
          <div>
            <h3 className="font-ps-display text-base sm:text-lg font-bold text-white mb-1">
              Comportamento de Uso
            </h3>
            <p className="text-white/45 text-[11px] mb-5">
              Toque em qualquer segmento para filtrar a auditoria
            </p>

            {/* Tempo */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-mono text-white/50 mb-2">
                <span>Por Tempo</span>
                <span>100%</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-white/5 mb-2.5 gap-0.5">
                <div
                  style={{ width: `${pct(analytics.byMode.futuro)}%` }}
                  className="bg-[#F5B041] transition-all duration-500"
                />
                <div
                  style={{ width: `${pct(analytics.byMode.presente)}%` }}
                  className="bg-emerald-400 transition-all duration-500"
                />
                <div
                  style={{ width: `${pct(analytics.byMode.passado)}%` }}
                  className="bg-slate-400 transition-all duration-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "futuro", label: "Futuro", count: analytics.byMode.futuro, color: "#F5B041" },
                    { id: "presente", label: "Presente", count: analytics.byMode.presente, color: "#34D399" },
                    { id: "passado", label: "Passado", count: analytics.byMode.passado, color: "#94A3B8" },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() =>
                      setModeFilter(modeFilter === m.id ? "all" : m.id)
                    }
                    className={`p-2 rounded-xl border text-left transition-all ${
                      modeFilter === m.id
                        ? "bg-white/10 border-white/35"
                        : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-[10px] text-white/60">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: m.color }}
                      />
                      {m.label}
                    </span>
                    <span className="font-mono text-xs font-bold text-white block mt-0.5">
                      {m.count} ({pct(m.count)}%)
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Caminho */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-mono text-white/50 mb-2">
                <span>Por Caminho de Busca</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "cidade", label: "Cidade", count: analytics.byPath.cidade, icon: MapPin, color: "#22D3EE" },
                    { id: "casa", label: "Casa", count: analytics.byPath.casa, icon: Home, color: "#F5B041" },
                    { id: "intencao", label: "Intenção", count: analytics.byPath.intencao, icon: Target, color: "#A855F7" },
                  ] as const
                ).map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        setPathFilter(pathFilter === p.id ? "all" : p.id)
                      }
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        pathFilter === p.id
                          ? "bg-white/10 border-white/35"
                          : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span className="flex items-center gap-1 text-[10px] text-white/60">
                        <Icon className="w-3 h-3" style={{ color: p.color }} />
                        {p.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-white block mt-0.5">
                        {p.count} ({pct(p.count)}%)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Escopo: Mapa Completo vs 1 Casa */}
          <div className="pt-4 border-t border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/45 block mb-2.5">
              Escopo Desbloqueado
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setScopeFilter(scopeFilter === "full" ? "all" : "full")
                }
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  scopeFilter === "full"
                    ? "bg-[#F5B041]/20 border-[#F5B041]/60"
                    : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
                }`}
              >
                <span className="text-[10px] text-[#F5B041] font-bold block">
                  Mapa Completo (12)
                </span>
                <span className="font-mono text-sm font-bold text-white">
                  {analytics.byScope.full} ({pct(analytics.byScope.full)}%)
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setScopeFilter(scopeFilter === "single" ? "all" : "single")
                }
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  scopeFilter === "single"
                    ? "bg-emerald-500/20 border-emerald-500/60"
                    : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
                }`}
              >
                <span className="text-[10px] text-emerald-300 font-bold block">
                  Avulsa / Parcial
                </span>
                <span className="font-mono text-sm font-bold text-white">
                  {analytics.byScope.single + analytics.byScope.partial} (
                  {pct(analytics.byScope.single + analytics.byScope.partial)}%)
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Radar Geográfico: Top Cidades Consultadas & Origem dos Leads (Cols 10-12) */}
        <div className="lg:col-span-3 rounded-[28px] p-6 bg-[#0A0B10]/90 border border-white/10 backdrop-blur-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-ps-display text-base font-bold text-white">
                Radar Geográfico
              </h3>
              <Globe2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="inline-flex p-1 rounded-xl bg-black/60 border border-white/10 w-full mb-4">
              <button
                type="button"
                onClick={() => setGeoTab("consulted")}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  geoTab === "consulted"
                    ? "bg-white text-black"
                    : "text-white/45 hover:text-white"
                }`}
              >
                Consultadas
              </button>
              <button
                type="button"
                onClick={() => setGeoTab("birth")}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  geoTab === "birth"
                    ? "bg-white text-black"
                    : "text-white/45 hover:text-white"
                }`}
              >
                Nascimento
              </button>
            </div>

            {(() => {
              const list =
                geoTab === "consulted"
                  ? analytics.topConsultedCities
                  : analytics.topBirthCities;
              if (list.length === 0) {
                return (
                  <p className="text-white/40 text-xs text-center py-10">
                    Sem cidades registradas neste período.
                  </p>
                );
              }
              return (
                <div className="space-y-2">
                  {list.map((c, idx) => (
                    <button
                      key={c.city}
                      type="button"
                      onClick={() => setSearchQuery(c.city.split(",")[0])}
                      className="w-full flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-xs transition-colors"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[10px] text-white/35 w-4">
                          {idx + 1}.
                        </span>
                        <span className="text-white/85 truncate">{c.city}</span>
                      </span>
                      <span className="font-mono text-[11px] font-bold text-emerald-300 shrink-0">
                        {c.count}x
                      </span>
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          <p className="text-[10px] text-white/35 mt-4 pt-3 border-t border-white/10">
            Toque em qualquer cidade para filtrar a lista de consultas abaixo.
          </p>
        </div>
      </div>

      {/* ── LINHA 3: BARRA DE FILTROS COMBINADOS + AUDITORIA DETALHADA ── */}
      <div className="rounded-[28px] p-5 sm:p-6 bg-[#0A0B10]/90 border border-white/10 backdrop-blur-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/60 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#F5B041]" />
              Filtros ({filteredRows.length})
            </span>

            {/* Select Tempo */}
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value as ModeFilter)}
              className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400/60"
            >
              <option value="all">Todos os Tempos</option>
              <option value="futuro">Futuro</option>
              <option value="presente">Presente</option>
              <option value="passado">Passado</option>
            </select>

            {/* Select Caminho */}
            <select
              value={pathFilter}
              onChange={(e) => setPathFilter(e.target.value as PathFilter)}
              className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400/60"
            >
              <option value="all">Todos os Caminhos</option>
              <option value="cidade">Por Cidade</option>
              <option value="casa">Por Casa</option>
              <option value="intencao">Por Intenção</option>
            </select>

            {/* Select Casa */}
            <select
              value={houseFilter}
              onChange={(e) => setHouseFilter(e.target.value)}
              className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400/60"
            >
              <option value="all">Todas as Casas (1–12)</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={String(h)}>
                  Casa {h} — {HOUSE_META[h].short}
                </option>
              ))}
            </select>

            {/* Select Escopo */}
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value as ScopeFilter)}
              className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400/60"
            >
              <option value="all">Qualquer Escopo</option>
              <option value="full">Mapa Completo (12 Casas)</option>
              <option value="single">1 Casa / Parcial</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Limpar
              </button>
            )}
          </div>

          {/* Campo de Busca */}
          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar nome, e-mail, cidade, ano..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 border border-white/15 text-white pl-9 pr-4 py-2 rounded-xl text-xs placeholder:text-white/35 focus:outline-none focus:border-emerald-400/60"
            />
          </div>
        </div>

        {/* Lista de Consultas */}
        <div className="space-y-2">
          {filteredRows.slice(0, visibleLimit).map((r) => {
            const houseMeta = r.goal ? HOUSE_META[r.goal] : null;
            const modeCls =
              r.normalizedMode === "futuro"
                ? "bg-[#F5B041]/15 border-[#F5B041]/35 text-[#F5B041]"
                : r.normalizedMode === "presente"
                ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-300"
                : "bg-slate-400/15 border-slate-400/35 text-slate-300";

            const pathLabel =
              r.pathType === "cidade"
                ? "Por Cidade"
                : r.pathType === "intencao"
                ? "Por Intenção"
                : "Por Casa";

            return (
              <div
                key={r.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs transition-colors"
              >
                {/* Esquerda: Data + Cliente */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <span className="font-mono text-[11px] text-white/45 w-28 shrink-0">
                    {new Date(r.created_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-bold truncate">
                        {r.userName}
                      </p>
                      {r.name &&
                        r.name.trim().toLowerCase() !==
                          r.userName.trim().toLowerCase() && (
                          <span className="text-[10px] text-white/45">
                            (mapa de {r.name})
                          </span>
                        )}
                    </div>
                    <p className="text-white/45 text-[11px] truncate">
                      {r.userEmail}
                      {r.birth_place
                        ? ` • Nasc.: ${normalizeCityLabel(r.birth_place)}`
                        : ""}
                    </p>
                  </div>
                </div>

                {/* Direita: Tags de Contexto */}
                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <span
                    className={`px-2.5 py-1 rounded-xl border text-[10px] font-bold uppercase tracking-wider ${modeCls}`}
                  >
                    {r.normalizedMode} · {r.year}
                  </span>

                  <span className="px-2.5 py-1 rounded-xl border border-white/10 bg-white/[0.04] text-white/75 text-[10px] font-semibold uppercase tracking-wider">
                    {pathLabel}
                  </span>

                  {r.origin && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 text-[10px] font-semibold">
                      <MapPin className="w-3 h-3" />
                      {normalizeCityLabel(r.origin)}
                    </span>
                  )}

                  {r.goal && (
                    <span
                      className="px-2.5 py-1 rounded-xl border text-[10px] font-bold"
                      style={{
                        borderColor: `${houseMeta?.color || "#F5B041"}45`,
                        backgroundColor: `${houseMeta?.color || "#F5B041"}15`,
                        color: houseMeta?.color || "#F5B041",
                      }}
                    >
                      Casa {r.goal}
                      {houseMeta ? ` · ${houseMeta.short.split("&")[0].trim()}` : ""}
                    </span>
                  )}

                  <span
                    className={`px-2.5 py-1 rounded-xl font-mono text-[10px] font-bold border ${
                      r.isFullMap
                        ? "bg-[#F5B041]/20 border-[#F5B041]/45 text-[#FFF3D1]"
                        : "bg-white/[0.03] border-white/10 text-white/55"
                    }`}
                  >
                    {r.isFullMap ? "12 Casas" : `${r.unlockedCount} Casa${r.unlockedCount > 1 ? "s" : ""}`}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredRows.length === 0 && (
            <div className="py-10 text-center rounded-2xl border border-dashed border-white/10">
              <p className="text-white/55 text-sm">
                Nenhuma consulta encontrada com os filtros atuais.
              </p>
            </div>
          )}

          {filteredRows.length > visibleLimit && (
            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={() => setVisibleLimit((v) => v + 100)}
                className="px-5 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white transition-colors"
              >
                Carregar mais ({filteredRows.length - visibleLimit} restantes)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationsAnalytics;
