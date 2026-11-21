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

  // Fundo espacial escuro com brilho solar dourado
  const bg = ctx.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#05070D");
  bg.addColorStop(0.45, "#0B1426");
  bg.addColorStop(1, "#04060B");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1920);

  const glow = ctx.createRadialGradient(540, 620, 40, 540, 620, 560);
  glow.addColorStop(0, "rgba(245, 176, 65, 0.36)");
  glow.addColorStop(0.5, "rgba(201, 162, 39, 0.12)");
  glow.addColorStop(1, "rgba(5, 7, 13, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1080, 1920);

  // Órbitas vetoriais elegantes
  ctx.strokeStyle = "rgba(245, 222, 152, 0.16)";
  ctx.lineWidth = 2;
  [210, 320, 440].forEach((r) => {
    ctx.beginPath();
    ctx.arc(540, 620, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Sol central
  const sun = ctx.createRadialGradient(540, 620, 12, 540, 620, 110);
  sun.addColorStop(0, "#FFF8E1");
  sun.addColorStop(0.45, "#F5B041");
  sun.addColorStop(1, "rgba(230, 126, 34, 0)");
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(540, 620, 110, 0, Math.PI * 2);
  ctx.fill();

  // Moldura fina editorial
  ctx.strokeStyle = "rgba(245, 222, 152, 0.22)";
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, 984, 1824);

  ctx.textAlign = "center";

  // Badge topo
  ctx.fillStyle = "#F5DE98";
  ctx.font = "700 26px 'JetBrains Mono', monospace";
  ctx.fillText("PROTOCOLO SOLAR  •  REVOLUÇÃO SOLAR", 540, 165);

  // Headline principal
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 72px 'Syne', 'Inter', sans-serif";
  ctx.fillText("A cidade onde você", 540, 960);
  ctx.fillText("passa o aniversário", 540, 1048);

  ctx.fillStyle = "#F5B041";
  ctx.fillText("muda o seu ano.", 540, 1136);

  // Subtítulo
  ctx.fillStyle = "rgba(248, 250, 252, 0.78)";
  ctx.font = "400 34px 'Inter', sans-serif";
  ctx.fillText("Descubra qual destino ativa Dinheiro,", 540, 1235);
  ctx.fillText("Amor, Carreira ou Virada de Vida.", 540, 1285);

  // Espaço dedicado para o Sticker de Link do Instagram Stories
  ctx.fillStyle = "rgba(201, 162, 39, 0.14)";
  ctx.strokeStyle = "rgba(245, 176, 65, 0.65)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(170, 1400, 740, 190, 32);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#FFF3D1";
  ctx.font = "700 28px 'JetBrains Mono', monospace";
  ctx.fillText("TOQUE NO LINK AQUI PARA TESTAR", 540, 1465);
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.font = "400 24px 'Inter', sans-serif";
  ctx.fillText("(cole seu sticker de link do Instagram aqui)", 540, 1525);

  // Rodapé com link curto limpo
  ctx.fillStyle = "rgba(245, 222, 152, 0.72)";
  ctx.font = "600 24px 'JetBrains Mono', monospace";
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
      title: "Para Amigos / Grupos (Conversão Alta)",
      text: `Gente, fiz um mapa surreal no Protocolo Solar que calcula exatamente qual cidade do mundo ativa mais dinheiro, amor ou carreira no dia do seu aniversário (Revolução Solar).\n\nTesta o seu aqui pra ver onde cai o seu próximo ano:\n${link}`,
    },
    {
      id: "wa-aniversariante",
      title: "Para Quem Vai Fazer Aniversário em Breve",
      text: `Oi! Lembrei de você porque seu aniversário tá chegando ✨ Você já viu o Protocolo Solar? Ele calcula pela sua hora de nascimento qual cidade potencializa os seus próximos 12 meses.\n\nDá pra ver a prévia do seu aqui:\n${link}`,
    },
  ];

  const storiesSequence = [
    {
      id: "st-1",
      step: "Story 1 — Gancho (Curiosidade)",
      text: `Você sabia que a cidade onde você está no exato minuto do seu aniversário muda a energia dos seus próximos 12 meses? ☀️\n\nNa Astrologia isso se chama Revolução Solar — e mudar de cidade muda o seu Ascendente do ano.`,
    },
    {
      id: "st-2",
      step: "Story 2 — Prova / Bastidor",
      text: `Eu testei minha data e hora de nascimento no Protocolo Solar e ele calculou as 12 Casas no mapa mundial — mostrando qual destino ativa Dinheiro, Amor, Carreira ou Mudança de Vida.`,
    },
    {
      id: "st-3",
      step: "Story 3 — Chamada + Sticker de Link",
      text: `Coloquei o link aqui pra você testar sua data de nascimento e ver qual cidade ativa o seu próximo ciclo 👇\n\nLink para o sticker:\n${link}`,
    },
  ];

  const reelsScript = `ROTEIRO CURTO (25s — Reels / TikTok / Shorts)

[0–3s • GANCHO NA TELA]
"A cidade onde você passa o seu aniversário pode destravar o seu ano inteiro — e quase ninguém sabe disso."

[3–15s • MOSTRANDO A TELA DO PROTOCOLO SOLAR]
"Na Revolução Solar, o mapa do seu novo ano é calculado para a cidade onde você está no dia do seu aniversário. Eu coloquei minha data, hora e cidade de nascimento no Protocolo Solar e ele mostrou qual destino ativa dinheiro, amor, carreira ou virada de vida."

[15–25s • CHAMADA PARA AÇÃO]
"Dá pra testar inclusive aniversários passados pra confirmar se bateu com a sua vida. O link tá na minha bio / nos comentários — testa o seu!"

Link para colocar na bio/comentário fixado:
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
      toast.success("Arte 9:16 baixada! Agora poste nos Stories com seu sticker de link.");
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
    <section className="p-5 sm:p-7 rounded-3xl bg-[#08111F]/90 border border-[#C9A227]/25 backdrop-blur-xl mb-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#F5DE98] font-bold mb-1">
            <Sparkles className="w-3 h-3" /> Kit Pronto para Vender Hoje
          </span>
          <h2 className="font-ps-display text-xl sm:text-2xl font-bold text-white">
            Materiais prontos com seu link
          </h2>
          <p className="text-xs text-white/55 mt-0.5">
            Todos os textos abaixo já estão preenchidos com <span className="font-mono text-[#F5DE98]">{formatAffiliateShortPath(code)}</span>. Copie e publique em 1 clique.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-black/45 border border-white/10">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all ${
                tab === id
                  ? "bg-[#C9A227] text-[#050507]"
                  : "text-white/55 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "whatsapp" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whatsappMessages.map((msg) => (
            <div
              key={msg.id}
              className="p-4 sm:p-5 rounded-2xl bg-black/45 border border-white/10 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <p className="text-xs font-mono uppercase tracking-wider text-[#F5DE98] font-bold">
                  {msg.title}
                </p>
                <p className="text-xs sm:text-sm text-white/80 whitespace-pre-line leading-relaxed">
                  {msg.text}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(msg.id, msg.text)}
                  className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#C9A227]/20 hover:bg-[#C9A227]/30 border border-[#C9A227]/45 text-[#FFF3D1] text-xs font-bold inline-flex items-center justify-center gap-1.5"
                >
                  {copiedId === msg.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === msg.id ? "Copiado!" : "Copiar Texto"}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(msg.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 text-emerald-200 text-xs font-bold inline-flex items-center justify-center gap-1.5"
                >
                  WhatsApp <ExternalLink className="w-3.5 h-3.5" />
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
              className="p-4 sm:p-5 rounded-2xl bg-black/45 border border-white/10 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#F5DE98] font-bold">
                  {st.step}
                </p>
                <p className="text-xs sm:text-sm text-white/80 whitespace-pre-line leading-relaxed">
                  {st.text}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(st.id, st.text)}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5"
              >
                {copiedId === st.id ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === st.id ? "Copiado!" : "Copiar Story"}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "reels" && (
        <div className="p-5 rounded-2xl bg-black/45 border border-white/10 space-y-4">
          <pre className="text-xs sm:text-sm text-white/80 whitespace-pre-wrap font-ps-ui leading-relaxed">
            {reelsScript}
          </pre>
          <button
            type="button"
            onClick={() => handleCopy("reels-script", reelsScript)}
            className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#C9A227]/20 hover:bg-[#C9A227]/30 border border-[#C9A227]/45 text-[#FFF3D1] text-xs font-bold inline-flex items-center gap-2"
          >
            {copiedId === "reels-script" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedId === "reels-script" ? "Roteiro Copiado!" : "Copiar Roteiro Completo"}
          </button>
        </div>
      )}

      {tab === "card" && (
        <div className="p-5 sm:p-6 rounded-2xl bg-black/45 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <p className="text-xs font-mono uppercase tracking-wider text-[#F5DE98] font-bold">
              Arte 9:16 (1080×1920) pronta para Instagram & WhatsApp Status
            </p>
            <p className="text-sm text-white/75 leading-relaxed">
              Baixe o cartão oficial com espaço marcado para você colar o <strong>Sticker de Link</strong> do Instagram com seu endereço{" "}
              <span className="font-mono text-[#F5DE98]">{formatAffiliateShortPath(code)}</span>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto shrink-0">
            <button
              type="button"
              disabled={downloadingCard}
              onClick={handleDownloadStoryCard}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A227] via-[#F5B041] to-[#C9A227] text-[#050507] text-xs font-extrabold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloadingCard ? "Gerando PNG..." : "Baixar Arte 9:16 (PNG)"}
            </button>
            <button
              type="button"
              onClick={() => handleCopy("card-link", link)}
              className="min-h-[48px] px-5 py-3 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 text-white text-xs font-bold inline-flex items-center justify-center gap-2"
            >
              {copiedId === "card-link" ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copiedId === "card-link" ? "Link Copiado!" : "Copiar Link do Sticker"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AffiliatePromoKit;
