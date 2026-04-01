import { motion } from "framer-motion";
import { HouseData, houseColors } from "@/data/houses";
import { getHouseArchetype, houseSigns } from "@/lib/houseMeta";

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

import { MapPin } from "lucide-react";

const getMapUrl = (lat: number, lon: number) =>
  `https://maps.google.com/maps?q=${lat},${lon}&z=6&output=embed`;

const RadarBar = ({ label, value, toneClass }: { label: string; value: number; toneClass: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <span className="text-foreground/60 text-[10px] uppercase tracking-wider">{label}</span>
      <span className="text-foreground/40 text-[10px]">{value}%</span>
    </div>
    <div className="h-1.5 rounded-full bg-foreground/5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        className={`h-full rounded-full ${toneClass}`}
      />
    </div>
  </div>
);

const DestinationCard = ({
  city,
  label,
  toneClass,
}: {
  city: CityOption;
  label: string;
  toneClass: string;
}) => (
  <div className="bg-card/40 border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-all group/dest">
    <p className={`text-[9px] uppercase tracking-[0.2em] font-semibold mb-3 ${toneClass}`}>
      {label}
    </p>
    <div className="flex items-center gap-3">
      <span className="text-2xl">{getFlag(city.country)}</span>
      <div className="flex-1 min-w-0">
        <p className="text-foreground font-bold text-base">{city.city}</p>
        <p className="text-muted-foreground text-[11px]">{city.country} · {city.continent}</p>
      </div>
    </div>
    <div className="mt-3 rounded-lg overflow-hidden border border-border/30 h-24 bg-background/50">
      <iframe
        src={getMapUrl(city.lat, city.lon)}
        className="w-full h-full border-0 opacity-70 group-hover/dest:opacity-100 transition-opacity pointer-events-none"
        loading="lazy"
        title={`Mapa de ${city.city}`}
      />
    </div>
    <p className="text-foreground/30 text-[9px] mt-2 text-center">
      {city.lat.toFixed(2)}° {city.lat > 0 ? "N" : "S"}, {city.lon.toFixed(2)}° {city.lon > 0 ? "L" : "O"}
    </p>
  </div>
);

const HouseDetail = ({ house, result, mode, isGoal, originCity, onClose }: HouseDetailProps) => {
  const bgGradient = houseColors[house.id];
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

  // Time-aware labels
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

  const destinations: { city: CityOption; label: string; toneClass: string }[] = [];

  if (result) {
    destinations.push({
      city: result.city,
      label: isPast ? "Destino Ativado" : "Destino Principal",
      toneClass: "text-primary",
    });

    if (result.options.nacional) {
      destinations.push({
        city: result.options.nacional,
        label: "Opção Nacional",
        toneClass: "text-foreground",
      });
    }

    if (result.options.acessivel && result.options.acessivel.city !== result.city.city) {
      destinations.push({
        city: result.options.acessivel,
        label: "Rota Acessível",
        toneClass: "text-muted-foreground",
      });
    }

    if (result.options.highticket && result.options.highticket.city !== result.city.city) {
      destinations.push({
        city: result.options.highticket,
        label: "Rota Premium",
        toneClass: "text-primary",
      });
    }
  }

  return (
    <motion.div
      key={house.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-3xl border border-primary/20 overflow-hidden mb-12"
      style={{ background: bgGradient }}
    >
      <div className="flex justify-end p-4 pb-0">
        <button onClick={onClose} className="text-foreground/30 hover:text-foreground/60 transition-colors text-sm">Fechar</button>
      </div>

      <div className="p-6 md:p-10 pt-2">
        {/* Header */}
        <div className="flex items-start gap-4 mb-2">
          <div className="flex-1">
            <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wider">
              Casa {house.id}
            </h3>
            <p className="text-primary text-sm uppercase tracking-[0.3em] mt-1 font-semibold">{house.label}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-foreground/40 text-xs">{archetype}</span>
              <span className="text-foreground/20">·</span>
              <span className="text-foreground/40 text-xs">{sign}</span>
              <span className="text-foreground/20">·</span>
              <span className="text-foreground/40 text-xs">{house.regente}</span>
              <span className="text-foreground/20">·</span>
              <span className="text-foreground/40 text-xs">Cristal: {house.cristal}</span>
            </div>
          </div>
        </div>

        {/* Mode badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/15 bg-primary/5 mt-3 mb-5">
          <div className={`w-1.5 h-1.5 rounded-full ${isPast ? 'bg-amber-400' : isFuture ? 'bg-emerald-400' : 'bg-blue-400'}`} />
          <span className="text-[9px] uppercase tracking-[0.3em] text-primary font-semibold">
            {isPast ? "Análise do Passado" : isFuture ? "Previsão Futura" : "Momento Presente"}
          </span>
        </div>

        {/* Origin highlight for goal house in past mode */}
        {isPast && isGoal && originCity && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 mb-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-semibold mb-2">Cidade do Aniversário</p>
            <p className="text-foreground/80 text-sm leading-relaxed">
              Você passou o aniversário de {house.id === 1 ? "ciclo" : "ano"} em <span className="text-foreground font-semibold">{originCity}</span>, e o Sol se posicionou na Casa {house.id} — ativando a área de <span className="text-primary font-semibold">{house.label}</span>.
            </p>
          </div>
        )}

        {/* Leitura */}
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-6 mb-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold mb-3">{leituraTitulo}</p>
          <p className="text-foreground/80 text-sm leading-relaxed font-light">{leituraTexto}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {house.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Main resumo */}
        <div className="bg-background/30 backdrop-blur-sm rounded-xl p-5 border border-foreground/5 mb-6">
          <p className="text-primary font-cinzel text-sm font-bold uppercase tracking-wider mb-2">{house.resumo}</p>
          <p className="text-foreground/70 text-sm leading-relaxed">{mainText}</p>
        </div>

        {/* Sombra (past only) */}
        {isPast && house.sombra && (
          <div className="bg-destructive/5 border border-destructive/15 rounded-xl p-5 mb-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-destructive font-semibold mb-3">O Lado Sombra Daquele Ciclo</p>
            <p className="text-foreground/70 text-xs leading-relaxed">{house.sombra}</p>
          </div>
        )}

        {/* Destinations */}
        {destinations.length > 0 && (
          <div className="mb-8">
            <h4 className="font-cinzel text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
              {destinoLabel}
            </h4>
            <p className="text-foreground/60 text-[11px] mb-4 leading-relaxed">{destinoDesc}</p>
            <div className={`grid grid-cols-1 ${destinations.length >= 3 ? 'md:grid-cols-3' : destinations.length === 2 ? 'md:grid-cols-2' : ''} gap-4`}>
              {destinations.map((d, i) => (
                <DestinationCard key={i} {...d} />
              ))}
            </div>
          </div>
        )}

        {/* Radar */}
        <div className="bg-background/30 backdrop-blur-sm rounded-xl p-5 border border-foreground/5 mb-6">
          <h4 className="font-cinzel text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4">
            Radar de Impacto
          </h4>
          <div className="space-y-3">
            <RadarBar label="Dinheiro" value={house.radar.dinheiro} toneClass="bg-primary" />
            <RadarBar label="Amor" value={house.radar.amor} toneClass="bg-foreground/70" />
            <RadarBar label="Saúde" value={house.radar.saude} toneClass="bg-muted-foreground" />
          </div>
        </div>

        {/* Promise */}
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-6 mb-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold mb-3">{promessaTitulo}</p>
          <p className="text-foreground/80 text-sm italic leading-relaxed font-light">
            "{house.promessa_texto}"
          </p>
        </div>

        {/* Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-background/30 backdrop-blur-sm rounded-xl p-5 border border-foreground/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">{areaLabels.prof}</p>
            <p className="text-foreground/60 text-xs leading-relaxed">{prof}</p>
          </div>
          <div className="bg-background/30 backdrop-blur-sm rounded-xl p-5 border border-foreground/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">{areaLabels.amor}</p>
            <p className="text-foreground/60 text-xs leading-relaxed">{amor}</p>
          </div>
          <div className="bg-background/30 backdrop-blur-sm rounded-xl p-5 border border-foreground/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">{areaLabels.pessoal}</p>
            <p className="text-foreground/60 text-xs leading-relaxed">{pessoal}</p>
          </div>
        </div>

        {/* Benefício & Ideal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background/30 backdrop-blur-sm rounded-xl p-5 border border-foreground/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">
              {isPast ? "O Que Foi Colhido" : "Benefício"}
            </p>
            <p className="text-foreground/60 text-xs leading-relaxed">{beneficio}</p>
          </div>
          <div className="bg-background/30 backdrop-blur-sm rounded-xl p-5 border border-foreground/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">
              {isPast ? "O Que Era Necessário" : "Ideal Para"}
            </p>
            <p className="text-foreground/60 text-xs leading-relaxed">{ideal}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HouseDetail;
