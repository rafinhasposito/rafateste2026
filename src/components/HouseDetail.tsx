import { motion } from "framer-motion";
import { HouseData, houseColors } from "@/data/houses";
import { getHouseArchetype, houseSigns } from "@/lib/houseMeta";
import { MapPin, X } from "lucide-react";

interface CityOption {
  city: string;
  country: string;
  continent: string;
  display_name: string;
  lat: number;
  lon: number;
}

interface HouseResult {
  city: CityOption;
  options: {
    nacional: CityOption | null;
    acessivel: CityOption | null;
    highticket: CityOption | null;
  };
}

interface HouseDetailProps {
  house: HouseData;
  result: HouseResult | null;
  mode: "passado" | "presente" | "futuro";
  isGoal?: boolean;
  originCity?: string | null;
  onClose: () => void;
}

const getMapUrl = (lat: number, lon: number) =>
  `https://maps.google.com/maps?q=${lat},${lon}&z=6&output=embed`;

const extractAccentColor = (house: number): string => {
  const gradient = houseColors[house] || "";
  const match = gradient.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) return `${match[1]}, ${match[2]}, ${match[3]}`;
  return "255, 215, 0";
};

const RadarBar = ({ label, value, accent }: { label: string; value: number; accent: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <span className="text-foreground/60 text-[10px] uppercase tracking-[0.2em]">{label}</span>
      <span className="text-foreground/50 text-[10px] font-semibold">{value}%</span>
    </div>
    <div className="h-1 rounded-full bg-foreground/5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        className="h-full rounded-full"
        style={{ background: `rgb(${accent})` }}
      />
    </div>
  </div>
);

const DestinationCard = ({
  city,
  label,
  accent,
}: {
  city: CityOption;
  label: string;
  accent: string;
}) => {
  if (!city) return null;
  const lat = typeof city.lat === "number" ? city.lat : Number(city.lat);
  const lon = typeof city.lon === "number" ? city.lon : Number(city.lon);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lon);
  return (
    <div className="bg-card/40 border border-border/50 rounded-2xl p-4 hover:border-foreground/20 transition-all group/dest">
      <p
        className="text-[9px] uppercase tracking-[0.25em] font-bold mb-3"
        style={{ color: `rgb(${accent})` }}
      >
        {label}
      </p>
      <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5 shrink-0" style={{ color: `rgba(${accent}, 0.7)` }} />
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-bold text-base">{city.city}</p>
          <p className="text-muted-foreground text-[11px]">{city.country} · {city.continent}</p>
        </div>
      </div>
      {hasCoords && (
        <>
          <div className="mt-3 rounded-lg overflow-hidden border border-border/30 h-24 bg-background/50">
            <iframe
              src={getMapUrl(lat, lon)}
              className="w-full h-full border-0 opacity-70 group-hover/dest:opacity-100 transition-opacity pointer-events-none"
              loading="lazy"
              title={`Mapa de ${city.city}`}
            />
          </div>
          <p className="text-foreground/40 text-[9px] mt-2 text-center tracking-wider">
            {lat.toFixed(2)}° {lat > 0 ? "N" : "S"}, {lon.toFixed(2)}° {lon > 0 ? "L" : "O"}
          </p>
        </>
      )}
    </div>
  );
};

const SectionLabel = ({ children, accent }: { children: React.ReactNode; accent: string }) => (
  <h4
    className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3"
    style={{ color: `rgb(${accent})` }}
  >
    {children}
  </h4>
);

const HouseDetail = ({ house, result, mode, isGoal, originCity, onClose }: HouseDetailProps) => {
  const accent = extractAccentColor(house.id);
  const archetype = getHouseArchetype(house.name);
  const sign = houseSigns[house.id];
  const isPast = mode === "passado";
  const isFuture = mode === "futuro";

  // Time-aware text selection
  const beneficio = isPast ? house.beneficio_passado : house.beneficio;
  const ideal = isPast ? house.ideal_passado : house.ideal;
  const pessoal = isPast ? house.pessoal_passado : house.pessoal;
  const amor = isPast ? house.amor_passado : house.amor;
  const prof = isPast ? house.prof_passado : house.prof;
  const mainText = isPast ? house.past_text : house.porque;

  const modeToken = isPast
    ? { label: "Análise do Passado", cls: "text-amber-400 border-amber-400/30 bg-amber-400/10", dot: "bg-amber-400" }
    : isFuture
      ? { label: "Previsão Futura", cls: "text-indigo-400 border-indigo-400/30 bg-indigo-400/10", dot: "bg-indigo-400" }
      : { label: "Momento Presente", cls: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10", dot: "bg-emerald-400" };

  const promessaTitulo = isPast
    ? "O Que o Universo Preparou Naquele Ciclo"
    : isFuture
      ? "A Promessa do Universo Para Este Ciclo"
      : "A Energia Ativa Neste Momento";

  const leituraTitulo = isPast
    ? "Análise Retroativa da Casa"
    : isFuture
      ? "Leitura de Ativação da Casa"
      : "Energia em Ação";

  const leituraTexto = isPast
    ? `Naquele ciclo, quem ativou a Casa ${house.id} focou em ${house.label}, canalizando a energia de ${archetype}. Veja abaixo como essa frequência se manifestou.`
    : isFuture
      ? `Quem escolhe a Casa ${house.id} ativa foco em ${house.label}, com energia de ${archetype}. Escolha uma das cidades calculadas e passe 24h no local para ancorar essa frequência.`
      : `A Casa ${house.id} está ativa com foco em ${house.label}, canalizando ${archetype}. As cidades abaixo potencializam essa energia.`;

  const destinoLabel = isPast ? "Onde a Energia se Ancorou" : "Destinos Calculados";
  const destinoDesc = isPast
    ? "As cidades abaixo representam os pontos de ancoragem energética daquele ciclo."
    : "A matemática pode retornar 1, 2 ou 3 rotas, conforme viabilidade astrológica de cada casa.";

  const areaLabels = isPast
    ? { prof: "Cenário Profissional", amor: "Cenário Afetivo", pessoal: "Cenário Pessoal" }
    : { prof: "Profissional", amor: "Amor", pessoal: "Pessoal" };

  const destinations: { city: CityOption; label: string }[] = [];
  if (result) {
    destinations.push({ city: result.city, label: isPast ? "Destino Ativado" : "Destino Principal" });
    if (result.options.nacional) destinations.push({ city: result.options.nacional, label: "Opção Nacional" });
    if (result.options.acessivel && result.options.acessivel.city !== result.city.city)
      destinations.push({ city: result.options.acessivel, label: "Rota Acessível" });
    if (result.options.highticket && result.options.highticket.city !== result.city.city)
      destinations.push({ city: result.options.highticket, label: "Rota Premium" });
  }

  return (
    <motion.div
      key={house.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-md overflow-hidden mb-12"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, rgba(${accent},0.9), rgba(${accent},0.2))` }} />

      <div className="flex flex-col lg:flex-row">
        {/* SIDEBAR — Identity */}
        <aside
          className="lg:w-[38%] p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-border/50 bg-background/30"
          style={{ borderLeft: `8px solid rgb(${accent})` }}
        >
          <div className="flex justify-between items-start mb-1 lg:hidden">
            <span />
            <button onClick={onClose} className="text-foreground/40 hover:text-foreground/80 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="font-cinzel text-[11px] font-bold uppercase tracking-[0.3em] mb-1" style={{ color: `rgb(${accent})` }}>
            Casa {house.id}
          </p>
          <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wider leading-tight mb-3">
            {house.label}
          </h3>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-foreground/50 mb-5">
            <span>{archetype}</span>
            <span className="text-foreground/20">·</span>
            <span>{sign}</span>
            <span className="text-foreground/20">·</span>
            <span>{house.regente}</span>
          </div>

          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-[0.25em] mb-6 ${modeToken.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${modeToken.dot}`} />
            {modeToken.label}
          </div>

          {/* Cristal */}
          <div className="flex items-center gap-2 mb-6 text-[11px]">
            <span className="text-foreground/50 uppercase tracking-[0.2em]">Cristal:</span>
            <span className="text-foreground/80 font-medium">{house.cristal}</span>
          </div>

          {/* Origin highlight for goal house in past mode */}
          {isPast && isGoal && originCity && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
              <p className="text-[9px] uppercase tracking-[0.25em] text-amber-400 font-bold mb-2">Cidade do Aniversário</p>
              <p className="text-foreground/80 text-xs leading-relaxed">
                Você passou o aniversário em <span className="text-foreground font-semibold">{originCity}</span>, e o Sol ativou a Casa {house.id}.
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="mb-6">
            <SectionLabel accent={accent}>Palavras-chave</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {house.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2.5 py-1 rounded-full border font-medium uppercase tracking-wider"
                  style={{
                    background: `rgba(${accent}, 0.1)`,
                    borderColor: `rgba(${accent}, 0.25)`,
                    color: `rgb(${accent})`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Radar */}
          <div>
            <SectionLabel accent={accent}>Radar de Impacto</SectionLabel>
            <div className="space-y-3">
              <RadarBar label="Dinheiro" value={house.radar.dinheiro} accent={accent} />
              <RadarBar label="Amor" value={house.radar.amor} accent={accent} />
              <RadarBar label="Saúde" value={house.radar.saude} accent={accent} />
            </div>
          </div>
        </aside>

        {/* MAIN — Content */}
        <div className="lg:w-[62%] p-6 md:p-10 space-y-8">
          <div className="hidden lg:flex justify-end -mt-2 -mr-2">
            <button
              onClick={onClose}
              className="text-foreground/40 hover:text-foreground/80 transition-colors text-[11px] uppercase tracking-[0.2em] flex items-center gap-1.5"
            >
              Fechar <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Leitura */}
          <section>
            <SectionLabel accent={accent}>{leituraTitulo}</SectionLabel>
            <p className="text-foreground/80 text-sm leading-relaxed font-light">{leituraTexto}</p>
          </section>

          {/* Egrégora / Resumo */}
          <section className="rounded-2xl bg-background/30 border border-border/50 p-5">
            <p className="font-cinzel text-sm font-bold uppercase tracking-[0.2em] mb-2" style={{ color: `rgb(${accent})` }}>
              {house.resumo}
            </p>
            <p className="text-foreground/70 text-sm leading-relaxed">{mainText}</p>
          </section>

          {/* Sombra (past only) */}
          {isPast && house.sombra && (
            <section className="rounded-2xl bg-destructive/5 border border-destructive/20 p-5">
              <SectionLabel accent="248, 113, 113">O Lado Sombra Daquele Ciclo</SectionLabel>
              <p className="text-foreground/70 text-xs leading-relaxed">{house.sombra}</p>
            </section>
          )}

          {/* Destinos */}
          {destinations.length > 0 && (
            <section>
              <SectionLabel accent={accent}>{destinoLabel}</SectionLabel>
              <p className="text-muted-foreground text-[11px] mb-4 leading-relaxed">{destinoDesc}</p>
              <div className={`grid grid-cols-1 ${destinations.length >= 2 ? 'md:grid-cols-2' : ''} gap-3`}>
                {destinations.map((d, i) => (
                  <DestinationCard key={i} city={d.city} label={d.label} accent={accent} />
                ))}
              </div>
            </section>
          )}

          {/* Promessa */}
          <section className="rounded-2xl p-5 border" style={{ background: `rgba(${accent}, 0.05)`, borderColor: `rgba(${accent}, 0.2)` }}>
            <SectionLabel accent={accent}>{promessaTitulo}</SectionLabel>
            <p className="text-foreground/85 text-sm italic leading-relaxed font-light">"{house.promessa_texto}"</p>
          </section>

          {/* Areas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: areaLabels.prof, text: prof },
              { label: areaLabels.amor, text: amor },
              { label: areaLabels.pessoal, text: pessoal },
            ].map((a) => (
              <div key={a.label} className="rounded-2xl bg-background/30 border border-border/50 p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] font-bold mb-2" style={{ color: `rgb(${accent})` }}>
                  {a.label}
                </p>
                <p className="text-foreground/70 text-xs leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>

          {/* Benefício + Ideal */}
          <footer className="flex flex-col md:flex-row gap-6 pt-6 border-t border-border/50">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-bold mb-1.5">
                {isPast ? "O Que Foi Colhido" : "Benefício"}
              </p>
              <p className="text-foreground/80 text-sm leading-relaxed">{beneficio}</p>
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold mb-1.5">
                {isPast ? "O Que Era Necessário" : "Ideal Para"}
              </p>
              <p className="text-foreground/80 text-sm leading-relaxed">{ideal}</p>
            </div>
          </footer>
        </div>
      </div>
    </motion.div>
  );
};

export default HouseDetail;
