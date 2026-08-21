import { getHouseGuide } from "@/data/houseGuide";

interface HouseGuidePanelProps {
  house: number;
  /** "r, g, b" string used for decorative accents */
  accentColor?: string;
}

/**
 * Leitura narrativa da casa — sem painéis, sem grids.
 * O conteúdo é apresentado como capítulos de um texto contínuo.
 */
const HouseGuidePanel = ({ house, accentColor = "212, 175, 55" }: HouseGuidePanelProps) => {
  const guide = getHouseGuide(house);
  if (!guide) return null;

  const Chapter = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <section className="space-y-3">
      <p
        className="text-[10px] font-bold uppercase tracking-[0.3em]"
        style={{ color: `rgb(${accentColor})` }}
      >
        {label}
      </p>
      {children}
    </section>
  );

  const paragraph = "text-white/90 text-[15px] md:text-base leading-[1.85] font-light";

  return (
    <div className="space-y-10 max-w-2xl">
      {/* Abertura */}
      <section className="space-y-4">
        <h3 className="font-cinzel text-xl md:text-2xl font-bold text-white leading-snug">
          Casa {guide.house} — {guide.name}
        </h3>
        <p
          className="text-lg md:text-xl leading-[1.7] text-white font-light"
          style={{ borderLeft: `2px solid rgb(${accentColor})`, paddingLeft: "1rem" }}
        >
          {guide.tenSeconds}
        </p>
      </section>

      <Chapter label="O que este ano pode abrir">
        <div className="space-y-2">
          {guide.favors.map((f, i) => (
            <p key={i} className={paragraph}>
              {f}
            </p>
          ))}
        </div>
      </Chapter>

      <Chapter label="O segredo deste ano">
        <p className={paragraph}>{guide.secret}</p>
      </Chapter>

      <Chapter label="O tema do seu ano">
        <p className={paragraph}>{guide.tema}</p>
        <p className={paragraph}>{guide.ganho}</p>
        <p className={paragraph}>{guide.vidaReal}</p>
      </Chapter>

      <Chapter label="Como isso toca cada área da vida">
        <p className={paragraph}>
          <span className="font-semibold text-white">Dinheiro. </span>
          {guide.dinheiro}
        </p>
        <p className={paragraph}>
          <span className="font-semibold text-white">Amor. </span>
          {guide.amor}
        </p>
        <p className={paragraph}>
          <span className="font-semibold text-white">Trabalho. </span>
          {guide.trabalho}
        </p>
        <p className={paragraph}>
          <span className="font-semibold text-white">Vida pessoal. </span>
          {guide.vidaPessoal}
        </p>
      </Chapter>

      <Chapter label="Como aproveitar este ciclo">
        <p className={paragraph}>{guide.aproveitar}</p>
      </Chapter>

      <Chapter label="E onde pisar com cuidado">
        <p className={paragraph}>{guide.cuidado}</p>
      </Chapter>

      {/* Fecho */}
      <section className="pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <p className="pt-6 text-lg md:text-xl leading-[1.7] text-white font-light italic">
          {guide.resumo}
        </p>
      </section>
    </div>
  );
};

export default HouseGuidePanel;
