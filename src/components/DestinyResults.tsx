import React from "react";
import { motion } from "framer-motion";
import { Lock, MapPin, Star, Heart, Briefcase, User, Sparkles, Globe, Crown, Gem, Eye } from "lucide-react";
import { getCountryFlag } from "@/lib/countryFlags";
import type { HouseData } from "@/data/houses";

interface CityOption {
  display_name: string;
  city: string;
  country: string;
  lat?: number;
  lon?: number;
  tags?: string[];
  score?: number;
  continent?: string;
}

interface DestinyResultsProps {
  house: number;
  houseName: string;
  houseData: HouseData;
  cities: {
    highticket: CityOption[];
    acessivel: CityOption[];
    nacional: CityOption[];
  };
}

// City hero images by name (curated)
const CITY_IMAGES: Record<string, string> = {
  "nova iorque": "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200&q=80",
  "new york": "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200&q=80",
  "los angeles": "https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=1200&q=80",
  "paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
  "londres": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  "london": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  "dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
  "tóquio": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
  "roma": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
  "barcelona": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80",
  "miami": "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=1200&q=80",
  "são paulo": "https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=1200&q=80",
  "rio de janeiro": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80",
  "bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
  "singapura": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80",
  "amsterdam": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=80",
  "amesterdão": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=80",
  "sydney": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80",
  "berlim": "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&q=80",
  "buenos aires": "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200&q=80",
  "istambul": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80",
  "lisboa": "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200&q=80",
  "cusco": "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80",
  "marraquexe": "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=1200&q=80",
  "santorini": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80",
  "seul": "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200&q=80",
  "hong kong": "https://images.unsplash.com/photo-1536599018102-9f803c029b22?w=1200&q=80",
  "cancún": "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=1200&q=80",
  "florianópolis": "https://images.unsplash.com/photo-1588001832198-c15cff59b078?w=1200&q=80",
  "salvador": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80",
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80";

function getCityImage(cityName: string): string {
  const key = cityName.toLowerCase().trim();
  return CITY_IMAGES[key] || FALLBACK_IMAGE;
}

// Ritual tips per house
const HOUSE_RITUALS: Record<number, string[]> = {
  1: ["Ao nascer do sol, declare em voz alta suas intenções para o novo ciclo.", "Acenda uma vela vermelha e visualize-se como o protagonista absoluto da sua história."],
  2: ["Carregue uma moeda de ouro ou pirita no bolso durante todo o dia.", "Escreva em papel dourado as 3 metas financeiras que deseja materializar neste ciclo."],
  3: ["Grave um áudio ou vídeo declarando suas intenções ao universo.", "Envie uma mensagem importante ou assine um contrato simbólico neste dia."],
  4: ["Leve uma foto da sua família ou ancestrais e medite sobre suas raízes.", "Plante algo — uma semente, uma flor — como símbolo de fundação."],
  5: ["Vista-se com sua roupa mais vibrante e celebre como se fosse uma estrela.", "Crie algo artístico neste dia — desenhe, escreva, dance — expresse sua essência."],
  6: ["Inicie uma nova rotina de saúde: um exercício, um chá, um hábito transformador.", "Organize um espaço físico importante e declare: 'A ordem precede o milagre'."],
  7: ["Faça um brinde com alguém importante — parceiro, sócio ou aliado.", "Escreva uma carta de gratidão para a pessoa que mais impactou sua vida."],
  8: ["Queime em papel algo que deseja deixar para trás — um medo, um padrão, uma dor.", "Medite em silêncio por 8 minutos visualizando seu renascimento completo."],
  9: ["Visite um templo, museu ou local de conhecimento ancestral na cidade.", "Escreva no seu diário a crença limitante que deseja transcender neste ciclo."],
  10: ["Vista-se como a versão mais poderosa de si mesmo e tire uma foto de poder.", "Declare em voz alta: 'Eu aceito o reconhecimento que o universo me oferece'."],
  11: ["Conecte-se com 3 pessoas novas neste dia — networking é o ritual.", "Escreva a visão de futuro mais ousada que conseguir imaginar."],
  12: ["Medite em silêncio absoluto por 12 minutos ao amanhecer.", "Escreva em um diário secreto o projeto que deseja gestar nos bastidores."],
};

// Group remaining cities by continent
function groupByContinentMock(cities: CityOption[]): Record<string, CityOption[]> {
  const groups: Record<string, CityOption[]> = {};
  for (const c of cities) {
    const continent = c.continent || "Outros";
    if (!groups[continent]) groups[continent] = [];
    groups[continent].push(c);
  }
  return groups;
}

const DestinyResults = ({ house, houseName, houseData, cities }: DestinyResultsProps) => {
  const [showUnlockOverlay, setShowUnlockOverlay] = React.useState(false);

  // Pick the #1 city (highest tier first)
  const allCities = [...cities.highticket, ...cities.acessivel, ...cities.nacional];
  const masterCity = allCities[0];
  const secondaryCities = allCities.slice(1);
  const continentGroups = groupByContinentMock(secondaryCities);

  if (!masterCity) return null;

  const cityImage = getCityImage(masterCity.city || masterCity.display_name);
  const flag = getCountryFlag(masterCity.country || "");
  const rituals = HOUSE_RITUALS[house] || HOUSE_RITUALS[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* ===== MASTER DESTINY CARD ===== */}
      <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-[0_0_60px_hsl(var(--gold)/0.08)]">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={cityImage}
            alt={masterCity.city}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 md:p-10 space-y-6">
          {/* Top label */}
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              The Master Destiny
            </span>
          </div>

          {/* House power tags */}
          <div className="flex flex-wrap gap-2">
            {houseData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* City name */}
          <div className="space-y-2 pt-4">
            <h2 className="font-cinzel text-4xl md:text-6xl font-bold text-foreground leading-none tracking-tight">
              {masterCity.city || masterCity.display_name}
            </h2>
            <div className="flex items-center gap-3 text-foreground/60">
              <span className="text-xl">{flag}</span>
              <span className="text-sm font-light tracking-wide">
                {masterCity.country}
              </span>
              {masterCity.lat != null && masterCity.lon != null && (
                <>
                  <span className="text-foreground/20">|</span>
                  <MapPin className="w-3.5 h-3.5 text-primary/50" />
                  <span className="text-xs text-foreground/40 font-mono">
                    {masterCity.lat.toFixed(2)}°, {masterCity.lon.toFixed(2)}°
                  </span>
                </>
              )}
            </div>
          </div>

          {/* House identity */}
          <div className="mt-4 p-5 rounded-xl bg-card/60 backdrop-blur-md border border-primary/15 space-y-3">
            <div className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-primary" />
              <p className="font-cinzel text-sm font-bold text-primary uppercase tracking-wider">
                Casa {house} — {houseName}
              </p>
            </div>
            <p className="text-foreground/70 text-sm leading-relaxed">
              {houseData.resumo}: {houseData.porque}
            </p>
          </div>

          {/* Ritual section */}
          <div className="p-5 rounded-xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <h4 className="font-cinzel text-xs font-bold text-primary uppercase tracking-[0.15em]">
                Ritual de Revolução Solar
              </h4>
            </div>
            <div className="space-y-3">
              {rituals.map((r, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="text-foreground/70 text-xs leading-relaxed pt-0.5">{r}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Life areas */}
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { icon: User, label: "Vida Pessoal", text: houseData.pessoal },
              { icon: Heart, label: "Amor", text: houseData.amor },
              { icon: Briefcase, label: "Profissional", text: houseData.prof },
            ].map(({ icon: Icon, label, text }) => (
              <div
                key={label}
                className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/8 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-primary/70" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80">{label}</span>
                </div>
                <p className="text-foreground/60 text-xs leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SECONDARY DESTINATIONS (LOCKED) ===== */}
      {secondaryCities.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-primary/60" />
            <h3 className="font-cinzel text-sm font-bold text-foreground uppercase tracking-[0.12em]">
              Mapeamento Global Completo
            </h3>
          </div>

          <div className="relative">
            {/* Blurred grid — clickable to reveal overlay */}
            <div
              className="select-none cursor-pointer"
              onClick={() => setShowUnlockOverlay(true)}
            >
              {Object.entries(continentGroups).map(([continent, citiesList]) => (
                <div key={continent} className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 mb-2 pl-1">
                    {continent}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {citiesList.map((c, i) => (
                      <div
                        key={`${c.city}-${i}`}
                        className="relative rounded-xl border border-primary/8 bg-card/40 p-4 blur-[6px] opacity-60"
                      >
                        <p className="text-foreground font-semibold text-sm">{c.city || c.display_name}</p>
                        <p className="text-foreground/40 text-[10px]">{c.country}</p>
                        {c.lat != null && (
                          <p className="text-foreground/30 text-[9px] font-mono mt-1">
                            {c.lat?.toFixed(2)}°, {c.lon?.toFixed(2)}°
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Lock overlay — only visible after clicking */}
            {showUnlockOverlay && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-card/80 backdrop-blur-xl border border-primary/20 shadow-[0_0_40px_hsl(var(--gold)/0.1)]">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-cinzel text-sm font-bold text-foreground uppercase tracking-wider">
                      Acesso Restrito
                    </p>
                    <p className="text-foreground/40 text-xs max-w-[260px]">
                      Desbloqueie todas as coordenadas e destinos secundários
                    </p>
                  </div>
                  <button className="mt-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-[hsl(var(--gold-light))] text-primary-foreground font-bold text-xs uppercase tracking-[0.14em] shadow-[0_0_30px_hsl(var(--gold)/0.25)] hover:shadow-[0_0_50px_hsl(var(--gold)/0.4)] transition-all duration-300 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Desbloquear Mapeamento Completo
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DestinyResults;
