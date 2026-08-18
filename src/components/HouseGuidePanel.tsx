import { Clock, Sparkles, Target, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getHouseGuide } from "@/data/houseGuide";

const CARD = { background: "rgba(0,0,0,0.40)", border: "1px solid rgba(255,255,255,0.18)" };

interface HouseGuidePanelProps {
  house: number;
  /** "r, g, b" string used for decorative accents */
  accentColor?: string;
}

const HouseGuidePanel = ({ house, accentColor = "212, 175, 55" }: HouseGuidePanelProps) => {
  const guide = getHouseGuide(house);
  if (!guide) return null;

  const blocks: { label: string; text: string }[] = [
    { label: "O tema do seu ano", text: guide.tema },
    { label: "O que você pode ganhar", text: guide.ganho },
    { label: "Como isso aparece na vida real", text: guide.vidaReal },
    { label: "Dinheiro", text: guide.dinheiro },
    { label: "Amor", text: guide.amor },
    { label: "Trabalho", text: guide.trabalho },
    { label: "Vida pessoal", text: guide.vidaPessoal },
  ];

  return (
    <div className="space-y-4">
      {/* Título + 10 segundos */}
      <div className="p-5 rounded-xl space-y-3" style={CARD}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
          <p className="font-cinzel text-xs font-bold uppercase tracking-wider text-white">
            Casa {guide.house} — {guide.name}
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] font-semibold" style={{ color: `rgb(${accentColor})` }}>
          Entenda em 10 segundos
        </p>
        <p className="text-white/95 text-sm leading-relaxed">{guide.tenSeconds}</p>
      </div>

      {/* Pode favorecer */}
      <div className="p-5 rounded-xl space-y-3" style={CARD}>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
          <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.15em] text-white">Pode favorecer</h4>
        </div>
        <ul className="grid gap-2 md:grid-cols-2">
          {guide.favors.map((f, i) => (
            <li
              key={i}
              className="flex gap-2 items-start p-3 rounded-lg text-white/95 text-xs leading-relaxed"
              style={{ background: `rgba(${accentColor}, 0.10)`, border: `1px solid rgba(${accentColor}, 0.25)` }}
            >
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* O segredo deste ano */}
      <div
        className="p-5 rounded-xl space-y-2"
        style={{ background: `rgba(${accentColor}, 0.10)`, border: `1px solid rgba(${accentColor}, 0.30)` }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold" style={{ color: `rgb(${accentColor})` }}>
            O segredo deste ano
          </p>
        </div>
        <p className="text-white/95 text-sm leading-relaxed">{guide.secret}</p>
      </div>

      {/* Blocos detalhados */}
      <div className="grid gap-3 md:grid-cols-2">
        {blocks.map(({ label, text }) => (
          <div key={label} className="p-5 rounded-xl space-y-2" style={CARD}>
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: `rgb(${accentColor})` }}>
              {label}
            </p>
            <p className="text-white/90 text-xs leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* Como aproveitar */}
      <div className="p-5 rounded-xl space-y-2" style={CARD}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold" style={{ color: `rgb(${accentColor})` }}>
            Como aproveitar esse ano
          </p>
        </div>
        <p className="text-white/95 text-sm leading-relaxed">{guide.aproveitar}</p>
      </div>

      {/* Cuidado com */}
      <div className="p-5 rounded-xl space-y-2" style={{ background: "rgba(239, 68, 68, 0.10)", border: "1px solid rgba(239, 68, 68, 0.28)" }}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-300" />
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-red-300">Cuidado com</p>
        </div>
        <p className="text-white/90 text-xs leading-relaxed">{guide.cuidado}</p>
      </div>

      {/* Resumo */}
      <div
        className="p-5 rounded-xl space-y-2"
        style={{ background: `rgba(${accentColor}, 0.12)`, border: `1px solid rgba(${accentColor}, 0.35)` }}
      >
        <p className="text-[10px] uppercase tracking-[0.25em] font-semibold" style={{ color: `rgb(${accentColor})` }}>
          Resumo
        </p>
        <p className="text-white text-sm leading-relaxed font-medium">{guide.resumo}</p>
      </div>
    </div>
  );
};

export default HouseGuidePanel;
