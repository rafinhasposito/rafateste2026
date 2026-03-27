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
  onClose: () => void;
}

const countryFlags: Record<string, string> = {
  "França": "🇫🇷", "Espanha": "🇪🇸", "Portugal": "🇵🇹", "Portugal (Açores)": "🇵🇹",
  "Argentina": "🇦🇷", "Brasil": "🇧🇷", "EUA": "🇺🇸", "México": "🇲🇽",
  "Canadá": "🇨🇦", "Nova Zelândia": "🇳🇿", "Japão": "🇯🇵", "Austrália": "🇦🇺",
  "Singapura": "🇸🇬", "Suécia": "🇸🇪", "Polónia": "🇵🇱", "Vietname": "🇻🇳",
  "Índia": "🇮🇳", "Rússia": "🇷🇺", "Colômbia": "🇨🇴", "Fiji": "🇫🇯",
  "Polinésia Francesa": "🇵🇫", "Itália": "🇮🇹", "Alemanha": "🇩🇪", "Reino Unido": "🇬🇧",
  "Chile": "🇨🇱", "Peru": "🇵🇪", "Uruguai": "🇺🇾", "Tailândia": "🇹🇭",
  "Coreia do Sul": "🇰🇷", "China": "🇨🇳", "Grécia": "🇬🇷", "Turquia": "🇹🇷",
  "Egito": "🇪🇬", "Marrocos": "🇲🇦", "África do Sul": "🇿🇦",
};

const getFlag = (country: string) => countryFlags[country] || "🌍";

const getMapUrl = (lat: number, lon: number, city: string) =>
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
    {/* Mini map */}
    <div className="mt-3 rounded-lg overflow-hidden border border-border/30 h-24 bg-background/50">
      <iframe
        src={getMapUrl(city.lat, city.lon, city.city)}
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

const HouseDetail = ({ house, result, onClose }: HouseDetailProps) => {
  const bgGradient = houseColors[house.id];
  const archetype = getHouseArchetype(house.name);
  const sign = houseSigns[house.id];

  const destinations: { city: CityOption; label: string; toneClass: string }[] = [];

  if (result) {
    // Always show main city as the primary recommendation
    destinations.push({
      city: result.city,
      label: "Destino Principal",
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
      {/* Close button */}
      <div className="flex justify-end p-4 pb-0">
        <button onClick={onClose} className="text-foreground/30 hover:text-foreground/60 transition-colors text-sm">✕ Fechar</button>
      </div>

      <div className="p-6 md:p-10 pt-2">
        {/* House Header */}
        <div className="flex items-start gap-4 mb-2">
          <div className="flex-1">
            <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wider">
              Casa {house.id}
            </h3>
            <p className="text-primary text-sm uppercase tracking-[0.3em] mt-1 font-semibold">{house.label}</p>
            <div className="flex items-center gap-3 mt-2">
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

        <div className="bg-primary/5 border border-primary/15 rounded-xl p-6 mb-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold mb-3">Leitura de Ativação da Casa</p>
          <p className="text-foreground/80 text-sm leading-relaxed font-light mb-2">
            Quem escolhe a Casa {house.id} ativa foco em <span className="text-foreground font-medium">{house.label}</span>, com energia de <span className="text-foreground font-medium">{archetype}</span>.
          </p>
          <p className="text-foreground/70 text-xs leading-relaxed">
            Escolha uma das cidades calculadas e passe 24h no local para ancorar essa frequência no seu ciclo solar.
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4 mb-6">
          {house.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* House resumo */}
        <div className="bg-background/30 backdrop-blur-sm rounded-xl p-5 border border-foreground/5 mb-6">
          <p className="text-primary font-cinzel text-sm font-bold uppercase tracking-wider mb-2">{house.resumo}</p>
          <p className="text-foreground/70 text-sm leading-relaxed">{house.porque}</p>
        </div>

        {/* ═══════ DESTINATIONS ═══════ */}
        {destinations.length > 0 && (
          <div className="mb-8">
            <h4 className="font-cinzel text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">
              Destinos Calculados
            </h4>
            <p className="text-foreground/60 text-[11px] mb-4 leading-relaxed">
              A matemática pode retornar 1, 2 ou 3 rotas, conforme viabilidade astrológica de cada casa.
            </p>
            <div className={`grid grid-cols-1 ${destinations.length >= 3 ? 'md:grid-cols-3' : destinations.length === 2 ? 'md:grid-cols-2' : ''} gap-4`}>
              {destinations.map((d, i) => (
                <DestinationCard key={i} {...d} />
              ))}
            </div>
          </div>
        )}

        {/* ═══════ RADAR ═══════ */}
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

        {/* ═══════ PROMISE ═══════ */}
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-6 mb-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold mb-3">{house.promessa_titulo}</p>
          <p className="text-foreground/80 text-sm italic leading-relaxed font-light">
            "{house.promessa_texto}"
          </p>
        </div>

        {/* ═══════ AREAS ═══════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-background/30 backdrop-blur-sm rounded-xl p-5 border border-foreground/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">Profissional</p>
            <p className="text-foreground/60 text-xs leading-relaxed">{house.prof}</p>
          </div>
          <div className="bg-background/30 backdrop-blur-sm rounded-xl p-5 border border-foreground/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">Amor</p>
            <p className="text-foreground/60 text-xs leading-relaxed">{house.amor}</p>
          </div>
          <div className="bg-background/30 backdrop-blur-sm rounded-xl p-5 border border-foreground/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">Pessoal</p>
            <p className="text-foreground/60 text-xs leading-relaxed">{house.pessoal}</p>
          </div>
        </div>

        {/* ═══════ BENEFÍCIO & IDEAL ═══════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background/30 backdrop-blur-sm rounded-xl p-5 border border-foreground/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">Benefício</p>
            <p className="text-foreground/60 text-xs leading-relaxed">{house.beneficio}</p>
          </div>
          <div className="bg-background/30 backdrop-blur-sm rounded-xl p-5 border border-foreground/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">Ideal Para</p>
            <p className="text-foreground/60 text-xs leading-relaxed">{house.ideal}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HouseDetail;
