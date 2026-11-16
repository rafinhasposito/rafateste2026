import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Ticket,
  Sparkles,
  Copy,
  Check,
  Printer,
  Plus,
  RefreshCw,
  Trash2,
  Crown,
  Compass,
  MapPin,
  QrCode,
  Link as LinkIcon,
  X,
  Power,
} from "lucide-react";
import {
  COUPON_REWARD_META,
  createCoupon,
  deleteCoupon,
  generateCouponCode,
  listCoupons,
  toggleCouponActive,
  type CouponRewardType,
  type RedeemCouponRow,
} from "@/lib/coupons";

const REWARD_OPTIONS: {
  type: CouponRewardType;
  title: string;
  subtitle: string;
  priceTag: string;
  Icon: typeof MapPin;
}[] = [
  {
    type: "1_casa",
    title: "1 Casa Avulsa",
    subtitle: "Libera 1 Casa escolhida + 1º Foco Principal",
    priceTag: "Equivale a R$ 19,90 (1 Créd.)",
    Icon: MapPin,
  },
  {
    type: "expansao",
    title: "Passe Expansão (Casa + Focos)",
    subtitle: "Libera 1 Casa escolhida + TODOS os 8 Focos",
    priceTag: "Equivale a R$ 49,90 (Passe Expansão)",
    Icon: Crown,
  },
  {
    type: "full_map",
    title: "Mapa Completo (12 Casas + Focos)",
    subtitle: "Libera TODAS as 12 Casas + TODOS os Focos",
    priceTag: "Equivale a R$ 99,90 (Passe Total)",
    Icon: Compass,
  },
];

const CouponsManager = () => {
  const [coupons, setCoupons] = useState<RedeemCouponRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [rewardType, setRewardType] = useState<CouponRewardType>("full_map");
  const [code, setCode] = useState<string>(() => generateCouponCode("SOLAR"));
  const [recipientName, setRecipientName] = useState("");
  const [note, setNote] = useState("");
  const [maxUses, setMaxUses] = useState<number>(1);
  const [expiresAt, setExpiresAt] = useState<string>("");

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewCoupon, setPreviewCoupon] = useState<RedeemCouponRow | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    const res = await listCoupons();
    setCoupons(res.rows);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Informe ou gere um código para o cupom.");
      return;
    }
    setCreating(true);
    try {
      const { row } = await createCoupon({
        code,
        reward_type: rewardType,
        recipient_name: recipientName,
        note,
        max_uses: maxUses,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      });
      setCoupons((prev) => [row, ...prev]);
      toast.success(`Cupom ${row.code} criado com sucesso!`);
      setCode(generateCouponCode("SOLAR"));
      setRecipientName("");
      setNote("");
      setPreviewCoupon(row);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao criar cupom.");
    } finally {
      setCreating(false);
    }
  };

  const handleCopyCode = (c: RedeemCouponRow) => {
    navigator.clipboard.writeText(c.code);
    setCopiedId(`code-${c.id}`);
    toast.success(`Código ${c.code} copiado!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getRedeemUrl = (c: RedeemCouponRow) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://protocolosolar.com.br";
    return `${origin}/resgatar?code=${encodeURIComponent(c.code)}`;
  };

  const handleCopyLink = (c: RedeemCouponRow) => {
    const url = getRedeemUrl(c);
    navigator.clipboard.writeText(url);
    setCopiedId(`link-${c.id}`);
    toast.success("Link direto de resgate copiado!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggle = async (c: RedeemCouponRow) => {
    const next = !c.active;
    await toggleCouponActive(c.id, next);
    setCoupons((prev) => prev.map((item) => (item.id === c.id ? { ...item, active: next } : item)));
    toast.success(next ? "Cupom ativado." : "Cupom desativado.");
  };

  const handleDelete = async (c: RedeemCouponRow) => {
    await deleteCoupon(c.id);
    setCoupons((prev) => prev.filter((item) => item.id !== c.id));
    toast.success(`Cupom ${c.code} removido.`);
  };

  const handlePrintCard = (c: RedeemCouponRow) => {
    const meta = COUPON_REWARD_META[c.reward_type] || COUPON_REWARD_META.full_map;
    const redeemUrl = getRedeemUrl(c);
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${encodeURIComponent(redeemUrl)}`;

    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) {
      toast.error("Permita pop-ups para imprimir o Cartão do Mídia Kit.");
      return;
    }

    win.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Mídia Kit • Protocolo Solar (${c.code})</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      background: #050507;
      color: #F8FAFC;
      font-family: 'Plus Jakarta Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 32px;
    }
    .card {
      width: 680px;
      background: radial-gradient(circle at 85% 15%, rgba(245, 176, 65, 0.22), transparent 45%),
                  linear-gradient(145deg, #0D1627 0%, #070B14 60%, #050507 100%);
      border: 1.5px solid rgba(245, 176, 65, 0.45);
      border-radius: 28px;
      padding: 40px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 30px 80px rgba(0,0,0,0.85);
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(245, 176, 65, 0.16);
      border: 1px solid rgba(245, 176, 65, 0.45);
      color: #FFF3D1;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 18px;
    }
    .recipient {
      font-size: 13px;
      color: #F5B041;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 6px;
    }
    h1 {
      font-family: 'Syne', sans-serif;
      font-size: 32px;
      line-height: 1.1;
      color: #FFFFFF;
      margin-bottom: 12px;
    }
    .desc {
      font-size: 14px;
      line-height: 1.6;
      color: #94A3B8;
      max-width: 400px;
      margin-bottom: 28px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 164px;
      gap: 24px;
      align-items: center;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 24px;
    }
    .code-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #94A3B8;
      margin-bottom: 8px;
    }
    .code-box {
      display: inline-block;
      padding: 14px 22px;
      border-radius: 16px;
      background: rgba(0,0,0,0.55);
      border: 1.5px dashed #F5B041;
      font-family: 'JetBrains Mono', monospace;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.16em;
      color: #FFF3D1;
      margin-bottom: 12px;
    }
    .steps {
      font-size: 11px;
      color: #94A3B8;
      line-height: 1.5;
    }
    .qr-wrap {
      background: #FFFFFF;
      padding: 10px;
      border-radius: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .qr-wrap img {
      width: 140px;
      height: 140px;
      display: block;
    }
    @media print {
      body { background: #050507; padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${meta.badge}</div>
    ${c.recipient_name ? `<div class="recipient">Convidado(a) Especial: ${c.recipient_name}</div>` : `<div class="recipient">Convite Exclusivo • Protocolo Solar</div>`}
    <h1>${meta.label}</h1>
    <p class="desc">${meta.description} Descubra em qual cidade do mundo passar seu próximo aniversário para ativar seu melhor ciclo anual.</p>
    <div class="grid">
      <div>
        <div class="code-label">Seu Código de Resgate</div>
        <div class="code-box">${c.code}</div>
        <div class="steps">
          Aponte a câmera para o QR Code ao lado ou acesse <strong>/resgatar</strong> e insira seu código para liberar seu acesso gratuitamente.
        </div>
      </div>
      <div class="qr-wrap">
        <img src="${qrSrc}" alt="QR Code Resgate" onload="setTimeout(() => window.print(), 300)" />
      </div>
    </div>
  </div>
</body>
</html>`);
    win.document.close();
  };

  return (
    <div className="space-y-12">
      {/* Formulário de Criação de Cupom */}
      <section className="p-6 sm:p-8 rounded-[32px] border border-[#C9A227]/35 bg-gradient-to-b from-[#0E1A32]/90 via-[#081020]/95 to-[#050811]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/35 text-[#F5DE98] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              <Sparkles className="w-3 h-3" /> Mídia Kit & Convidados VIP
            </span>
            <h3 className="font-ps-display text-2xl sm:text-3xl text-white font-bold tracking-tight">
              Criar Cupom de Resgate
            </h3>
            <p className="text-white/55 text-xs sm:text-sm font-ps-ui mt-1">
              Escolha se o presente libera 1 Casa, o Passe Expansão (Casa + Todos os Focos) ou o Mapa Completo (12 Casas + Todos os Focos).
            </p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          {/* Seleção do Tipo de Benefício */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mb-3">
              1. O que este cupom desbloqueia?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {REWARD_OPTIONS.map((opt) => {
                const selected = rewardType === opt.type;
                const Icon = opt.Icon;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setRewardType(opt.type)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                      selected
                        ? "border-[#C9A227] bg-[#C9A227]/15 shadow-[0_0_30px_rgba(201,162,39,0.2)]"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                          selected
                            ? "bg-[#C9A227]/25 border-[#C9A227]/60 text-[#F5DE98]"
                            : "bg-white/5 border-white/10 text-white/60"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5DE98]/85 font-semibold">
                        {opt.priceTag}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-ps-display text-base font-bold text-white mb-0.5">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-white/60 leading-snug">{opt.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Código, Nome do Amigo, Usos e Validade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">
                2. Código do Cupom
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ex: SOLAR-CAMILA"
                  className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-white/15 text-[#F5DE98] font-mono text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-[#C9A227]"
                />
                <button
                  type="button"
                  onClick={() => setCode(generateCouponCode("SOLAR"))}
                  title="Gerar código aleatório"
                  className="px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">
                Nome do Convidado (Opcional)
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Ex: Camila Santos"
                className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">
                Limite de Resgates
              </label>
              <input
                type="number"
                min={1}
                max={1000}
                value={maxUses}
                onChange={(e) => setMaxUses(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm font-bold focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">
                Validade (Opcional)
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Observação interna (ex: Mídia Kit Imprensa / Aniversário)..."
              className="flex-1 min-w-[220px] px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white/80 text-xs focus:outline-none focus:border-white/30"
            />
            <button
              type="submit"
              disabled={creating}
              className="px-8 py-3.5 rounded-2xl bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] font-bold text-xs uppercase tracking-[0.18em] flex items-center gap-2 shadow-[0_10px_30px_rgba(201,162,39,0.3)] transition-all active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{creating ? "Criando..." : "Criar Cupom & Gerar Cartão"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Lista de Cupons Criados */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-ps-display text-2xl text-white font-bold">
            Cupons Ativos & Mídia Kit ({coupons.length})
          </h3>
          <button
            type="button"
            onClick={fetchAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Atualizar
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-white/50 text-sm animate-pulse">
            Carregando cupons...
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-12 rounded-3xl border border-white/10 bg-white/[0.02] text-center space-y-2">
            <Ticket className="w-8 h-8 text-[#C9A227] mx-auto opacity-75" />
            <p className="text-white font-semibold">Nenhum cupom criado ainda</p>
            <p className="text-white/50 text-xs max-w-md mx-auto">
              Use o painel acima para gerar códigos de presente para o seu Mídia Kit com QR Code pronto para impressão.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((c) => {
              const meta = COUPON_REWARD_META[c.reward_type] || COUPON_REWARD_META.full_map;
              const exhausted = c.uses_count >= c.max_uses;
              return (
                <div
                  key={c.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                    !c.active || exhausted
                      ? "border-white/10 bg-white/[0.01] opacity-65"
                      : "border-[#C9A227]/35 bg-[#091326]/90 shadow-[0_12px_35px_rgba(0,0,0,0.45)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#F5DE98] text-[10px] font-bold uppercase tracking-wider mb-2">
                        {meta.shortLabel}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xl font-bold text-white tracking-wider">
                          {c.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(c)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white"
                          title="Copiar código"
                        >
                          {copiedId === `code-${c.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {c.recipient_name && (
                        <p className="text-xs text-[#F5DE98]/90 font-medium mt-1">
                          Para: {c.recipient_name}
                        </p>
                      )}
                      {c.note && <p className="text-[11px] text-white/45 mt-0.5">{c.note}</p>}
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          exhausted
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : c.active
                            ? "bg-white/10 text-white/80"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {exhausted
                          ? "Resgatado"
                          : c.active
                          ? `${c.uses_count}/${c.max_uses} usos`
                          : "Inativo"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewCoupon(c)}
                        className="px-3 py-2 rounded-xl bg-[#C9A227]/20 hover:bg-[#C9A227]/30 border border-[#C9A227]/45 text-[#F5DE98] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Cartão Mídia Kit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyLink(c)}
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        {copiedId === `link-${c.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <LinkIcon className="w-3.5 h-3.5" />
                        )}
                        <span>Copiar Link</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggle(c)}
                        title={c.active ? "Desativar cupom" : "Ativar cupom"}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        title="Excluir cupom"
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal de Prévia do Cartão de Mídia Kit para Impressão */}
      {previewCoupon && (() => {
        const meta = COUPON_REWARD_META[previewCoupon.reward_type] || COUPON_REWARD_META.full_map;
        const redeemUrl = getRedeemUrl(previewCoupon);
        const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(redeemUrl)}`;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-2xl rounded-3xl border border-[#C9A227]/50 bg-gradient-to-br from-[#0E1A30] via-[#070D19] to-[#050507] p-6 sm:p-9 shadow-[0_25px_90px_rgba(0,0,0,0.9)]">
              <button
                type="button"
                onClick={() => setPreviewCoupon(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="inline-block px-3 py-1 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/45 text-[#F5DE98] font-mono text-[10px] uppercase tracking-[0.2em] mb-4">
                {meta.badge}
              </span>

              <p className="text-xs uppercase tracking-[0.16em] text-[#C9A227] font-bold mb-1">
                {previewCoupon.recipient_name
                  ? `Convidado(a) Especial: ${previewCoupon.recipient_name}`
                  : "Convite Exclusivo • Protocolo Solar"}
              </p>

              <h3 className="font-ps-display text-2xl sm:text-3xl font-bold text-white mb-2">
                {meta.label}
              </h3>
              <p className="text-white/65 text-xs sm:text-sm leading-relaxed mb-6">
                {meta.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-5 border-t border-white/10">
                <div className="sm:col-span-8 space-y-3">
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-white/45 mb-1.5">
                      Código de Resgate
                    </span>
                    <div className="inline-block px-5 py-3 rounded-2xl bg-black/60 border border-dashed border-[#C9A227] font-mono text-2xl font-bold tracking-[0.16em] text-[#FFF3D1]">
                      {previewCoupon.code}
                    </div>
                  </div>
                  <p className="text-white/55 text-xs leading-relaxed">
                    Escaneie o QR Code ou acesse <strong>/resgatar</strong> e digite o código acima para liberar seu presente gratuitamente.
                  </p>
                </div>

                <div className="sm:col-span-4 flex justify-center">
                  <div className="p-3 bg-white rounded-2xl shadow-lg">
                    <img src={qrSrc} alt="QR Code do Cupom" className="w-32 h-32 object-contain" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 mt-7 pt-5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleCopyLink(previewCoupon)}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4 text-[#F5DE98]" />
                  <span>Copiar Link com Código</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePrintCard(previewCoupon)}
                  className="px-6 py-3 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_10px_25px_rgba(201,162,39,0.3)]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Cartão Mídia Kit</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default CouponsManager;
