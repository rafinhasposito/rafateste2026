import { useState } from "react";
import {
  Copy,
  Check,
  MessageCircle,
  Instagram,
  Video,
  Download,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { buildAffiliateLink, formatAffiliateShortPath } from "@/lib/affiliates";

interface AffiliatePromoKitProps {
  code: string;
  affiliateName: string;
}

type KitTab = "whatsapp" | "stories" | "reels" | "card";

const drawStoryPromoPng = async (code: string): Promise<Blob | null> => {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready.catch(() => {});
  }

  // Fundo void obsidian oficial Protocolo Solar
  const bg = ctx.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#02050A");
  bg.addColorStop(0.45, "#07101A");
  bg.addColorStop(1, "#03060C");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1920);

  const glow = ctx.createRadialGradient(540, 620, 40, 540, 620, 560);
  glow.addColorStop(0, "rgba(201, 162, 39, 0.32)");
  glow.addColorStop(0.5, "rgba(201, 162, 39, 0.10)");
  glow.addColorStop(1, "rgba(2, 5, 10, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1080, 1920);

  // Órbitas vetoriais finas em champagne gold
  ctx.strokeStyle = "rgba(232, 213, 155, 0.18)";
  ctx.lineWidth = 2;
  [210, 320, 440].forEach((r) => {
    ctx.beginPath();
    ctx.arc(540, 620, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Sol central em ouro champanhe
  const sun = ctx.createRadialGradient(540, 620, 12, 540, 620, 110);
  sun.addColorStop(0, "#FFF8E1");
  sun.addColorStop(0.48, "#C9A227");
  sun.addColorStop(1, "rgba(201, 162, 39, 0)");
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(540, 620, 110, 0, Math.PI * 2);
  ctx.fill();

  // Moldura fina editorial
  ctx.strokeStyle = "rgba(232, 213, 155, 0.22)";
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, 984, 1824);

  ctx.textAlign = "center";

  // Badge topo
  ctx.fillStyle = "#E8D59B";
  ctx.font = "600 24px 'Inter', sans-serif";
  ctx.fillText("PROTOCOLO SOLAR  •  REVOLUÇÃO SOLAR", 540, 165);

  // Headline principal em Marcellus (peso 400 — fiel à marca!)
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "400 72px 'PS Marcellus', 'Cinzel', serif";
  ctx.fillText("A cidade onde você", 540, 960);
  ctx.fillText("passa o aniversário", 540, 1048);

  ctx.fillStyle = "#E8D59B";
  ctx.fillText("muda o seu ano.", 540, 1136);

  // Subtítulo
  ctx.fillStyle = "rgba(242, 244, 247, 0.78)";
  ctx.font = "400 32px 'Inter', sans-serif";
  ctx.fillText("Descubra qual destino ativa Dinheiro,", 540, 1235);
  ctx.fillText("Amor, Carreira ou Virada de Vida.", 540, 1285);

  // Espaço dedicado para o Sticker de Link do Instagram Stories
  ctx.fillStyle = "rgba(201, 162, 39, 0.12)";
  ctx.strokeStyle = "rgba(201, 162, 39, 0.55)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(170, 1400, 740, 190, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#F5DE98";
  ctx.font = "600 26px 'Inter', sans-serif";
  ctx.fillText("TOQUE NO LINK AQUI PARA TESTAR", 540, 1468);
  ctx.fillStyle = "rgba(242, 244, 247, 0.6)";
  ctx.font = "400 23px 'Inter', sans-serif";
  ctx.fillText("(cole seu sticker de link do Instagram aqui)", 540, 1525);

  // Rodapé com link curto limpo
  ctx.fillStyle = "rgba(232, 213, 155, 0.78)";
  ctx.font = "500 24px 'JetBrains Mono', monospace";
  ctx.fillText(formatAffiliateShortPath(code), 540, 1775);

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));
};

export const AffiliatePromoKit = ({ code }: AffiliatePromoKitProps) => {
  const [tab, setTab] = useState<KitTab>("whatsapp");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingCard, setDownloadingCard] = useState(false);

  const link = buildAffiliateLink(code);

  const whatsappMessages = [
    {
      id: "wa-amigos",
      title: "Para Amigos e Grupos",
      text: `Gente, fiz um mapa surreal no Protocolo Solar que calcula exatamente qual cidade do mundo ativa mais dinheiro, amor ou carreira no dia do seu aniversário (Revolução Solar).\n\nTesta o seu aqui pra ver onde cai o seu próximo ano:\n${link}`,
    },
    {
      id: "wa-aniversariante",
      title: "Para Quem Vai Fazer Aniversário",
      text: `Oi! Lembrei de você porque seu aniversário tá chegando ✨ Você já viu o Protocolo Solar? Ele calcula pela sua hora de nascimento qual cidade potencializa os seus próximos 12 meses.\n\nDá pra ver a prévia do seu aqui:\n${link}`,
    },
  ];

  const storiesSequence = [
    {
      id: "st-1",
      step: "Story 1 — Gancho",
      text: `Você sabia que a cidade onde você está no exato minuto do seu aniversário muda a energia dos seus próximos 12 meses? ☀️\n\nNa Astrologia isso se chama Revolução Solar — e mudar de cidade muda o seu Ascendente do ano.`,
    },
    {
      id: "st-2",
      step: "Story 2 — Prova",
      text: `Eu testei minha data e hora de nascimento no Protocolo Solar e ele calculou as 12 Casas no mapa mundial — mostrando qual destino ativa Dinheiro, Amor, Carreira ou Mudança de Vida.`,
    },
    {
      id: "st-3",
      step: "Story 3 — Sticker de Link",
      text: `Coloquei o link aqui pra você testar sua data de nascimento e ver qual cidade ativa o seu próximo ciclo 👇\n\nLink para o sticker:\n${link}`,
    },
  ];

  const reelsScript = `ROTEIRO CURTO (25s — Reels / TikTok / Shorts)

[0–3s • GANCHO NA TELA]
"A cidade onde você passa o seu aniversário pode destravar o seu ano inteiro — e quase ninguém sabe disso."

[3–15s • MOSTRANDO A TELA DO PROTOCOLO SOLAR]
"Na Revolução Solar, o mapa do seu novo ano é calculado para a cidade onde você está no dia do seu aniversário. Eu coloquei minha data, hora e cidade de nascimento no Protocolo Solar e ele mostrou qual destino ativa dinheiro, amor, carreira ou virada de vida."

[15–25s • CHAMADA PARA AÇÃO]
"Dá pra testar inclusive aniversários passados pra confirmar se bateu com a sua vida. O link tá na minha bio — testa o seu!"

Link para bio ou comentário fixado:
${link}`;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copiado com seu link exclusivo!");
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleDownloadStoryCard = async () => {
    setDownloadingCard(true);
    try {
      const blob = await drawStoryPromoPng(code);
      if (!blob) throw new Error("Não foi possível gerar a imagem.");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `protocolo-solar-story-${code.toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Arte 9:16 baixada! Poste nos Stories com seu sticker de link.");
    } catch {
      toast.error("Erro ao gerar a arte 9:16.");
    } finally {
      setDownloadingCard(false);
    }
  };

  const tabs: { id: KitTab; label: string; Icon: typeof MessageCircle }[] = [
    { id: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
    { id: "stories", label: "3 Stories", Icon: Instagram },
    { id: "reels", label: "Roteiro Reels", Icon: Video },
    { id: "card", label: "Arte 9:16", Icon: Download },
  ];

  return (
    <section className="p-5 sm:p-7 rounded-[24px] bg-[#07101A]/90 border border-[#C9A227]/22 backdrop-blur-xl mb-7 space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="inline-flex items-center gap-1.5 font-ps-ui text-[11px] uppercase tracking-[0.18em] text-[#C9A227] font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Kit Pronto de Divulgação
          </span>
          <h2 className="font-ps-display font-normal text-2xl text-white">
            Materiais prontos com seu link
          </h2>
          <p className="font-ps-ui text-xs text-[#94A3B8] mt-1">
            Todos os roteiros já vêm preenchidos com{" "}
            <span className="font-mono text-[#E8D59B]">{formatAffiliateShortPath(code)}</span>.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 p-1 rounded-xl bg-[#040912]/80 border border-white/10">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-ps-ui font-semibold inline-flex items-center justify-center gap-1.5 transition-all ${
                tab === id
                  ? "bg-[#C9A227] text-[#02050A]"
                  : "text-[#AAB6C4] hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === "whatsapp" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whatsappMessages.map((msg) => (
            <div
              key={msg.id}
              className="p-5 rounded-2xl bg-[#040912]/75 border border-white/[0.08] flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <p className="font-ps-ui text-xs uppercase tracking-[0.14em] text-[#E8D59B] font-semibold">
                  {msg.title}
                </p>
                <p className="font-ps-ui text-sm text-[#CBD5E1] whitespace-pre-line leading-relaxed">
                  {msg.text}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(msg.id, msg.text)}
                  className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#C9A227]/15 hover:bg-[#C9A227]/25 border border-[#C9A227]/40 text-[#F5DE98] font-ps-ui text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedId === msg.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === msg.id ? "Copiado!" : "Copiar Texto"}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(msg.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-[#F2F4F7] font-ps-ui text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "stories" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {storiesSequence.map((st) => (
            <div
              key={st.id}
              className="p-5 rounded-2xl bg-[#040912]/75 border border-white/[0.08] flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <p className="font-ps-ui text-xs uppercase tracking-[0.14em] text-[#E8D59B] font-semibold">
                  {st.step}
                </p>
                <p className="font-ps-ui text-sm text-[#CBD5E1] whitespace-pre-line leading-relaxed">
                  {st.text}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(st.id, st.text)}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-[#F2F4F7] font-ps-ui text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedId === st.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === st.id ? "Copiado!" : "Copiar Story"}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "reels" && (
        <div className="p-5 rounded-2xl bg-[#040912]/75 border border-white/[0.08] space-y-4">
          <pre className="font-ps-ui text-sm text-[#CBD5E1] whitespace-pre-wrap leading-relaxed">
            {reelsScript}
          </pre>
          <button
            type="button"
            onClick={() => handleCopy("reels-script", reelsScript)}
            className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#C9A227]/15 hover:bg-[#C9A227]/25 border border-[#C9A227]/40 text-[#F5DE98] font-ps-ui text-xs font-semibold inline-flex items-center gap-2 transition-colors"
          >
            {copiedId === "reels-script" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedId === "reels-script" ? "Roteiro Copiado!" : "Copiar Roteiro Completo"}</span>
          </button>
        </div>
      )}

      {tab === "card" && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#040912]/75 border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <p className="font-ps-ui text-xs uppercase tracking-[0.14em] text-[#E8D59B] font-semibold">
              Arte 9:16 (1080×1920) para Stories e Status
            </p>
            <p className="font-ps-ui text-sm text-[#CBD5E1] leading-relaxed">
              Baixe o cartão editorial com espaço reservado para o <strong className="text-white">Sticker de Link</strong> do Instagram usando{" "}
              <span className="font-mono text-xs text-[#E8D59B]">{formatAffiliateShortPath(code)}</span>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto shrink-0">
            <button
              type="button"
              disabled={downloadingCard}
              onClick={handleDownloadStoryCard}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-[#C9A227] hover:bg-[#D9B643] text-[#02050A] font-ps-ui text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingCard ? "Gerando PNG..." : "Baixar Arte 9:16"}</span>
            </button>
            <button
              type="button"
              onClick={() => handleCopy("card-link", link)}
              className="min-h-[48px] px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-[#F2F4F7] font-ps-ui text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              {copiedId === "card-link" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === "card-link" ? "Link Copiado!" : "Copiar Link"}</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AffiliatePromoKit;
