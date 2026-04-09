import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, MapPin, Star, Heart, Briefcase, User, Sparkles,
  Globe, Crown, Gem, Eye, Search, BookOpen, Loader2, ExternalLink,
  CreditCard, ShoppingCart, Cloud, Thermometer
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCountryFlag } from "@/lib/countryFlags";
import { cityDatabase, houseColors, type HouseData } from "@/data/houses";
import { getHouseArchetype, houseSigns } from "@/lib/houseMeta";
import { supabase } from "@/integrations/supabase/client";

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
  onUnlock?: (houses: number) => void;
  userCredits?: number;
  isAuthenticated?: boolean;
}

interface WikiData {
  title: string;
  extract: string;
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string };
  description?: string;
  content_urls?: { desktop?: { page?: string } };
}

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  humidity: number;
}

function extractAccentColor(house: number): string {
  const gradient = houseColors[house] || "";
  const match = gradient.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) return `${match[1]}, ${match[2]}, ${match[3]}`;
  return "255, 215, 0";
}

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
  "sydney": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80",
  "berlim": "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&q=80",
  "buenos aires": "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200&q=80",
  "istambul": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80",
  "lisboa": "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200&q=80",
  "cusco": "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80",
  "santorini": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80",
  "florianópolis": "https://images.unsplash.com/photo-1588001832198-c15cff59b078?w=1200&q=80",
  "salvador": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80",
  "auckland": "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&q=80",
  "banguecoque": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80",
  "bangkok": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80",
  "bora bora": "https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?w=1200&q=80",
  "fernando de noronha": "https://images.unsplash.com/photo-1598443928710-7def5b3b037e?w=1200&q=80",
};
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80";

function getCityImage(cityName: string): string {
  const key = cityName.toLowerCase().trim();
  if (CITY_IMAGES[key]) return CITY_IMAGES[key];
  // Unsplash Source fallback
  return `https://source.unsplash.com/800x600/?${encodeURIComponent(cityName)},city,travel`;
}

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

function maskCityName(name: string): string {
  if (!name || name.length < 3) return "???";
  return name[0] + "*".repeat(Math.min(name.length - 1, 5));
}

async function fetchWikipediaData(cityName: string): Promise<WikiData | null> {
  try {
    const ptRes = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`);
    if (ptRes.ok) {
      const data = await ptRes.json();
      if (data.type !== "disambiguation" && data.extract) return data;
    }
    const enRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`);
    if (enRes.ok) {
      const data = await enRes.json();
      if (data.extract) return data;
    }
  } catch (e) {
    console.error("Wikipedia fetch error:", e);
  }
  return null;
}

async function fetchWeatherData(city: string, country?: string): Promise<WeatherData | null> {
  try {
    const { data, error } = await supabase.functions.invoke('get-weather', {
      body: { city, country },
    });
    if (error || !data) return null;
    return data as WeatherData;
  } catch (e) {
    console.error("Weather fetch error:", e);
    return null;
  }
}

function groupByContinentMock(cities: CityOption[]): Record<string, CityOption[]> {
  const groups: Record<string, CityOption[]> = {};
  for (const c of cities) {
    const continent = c.continent || "Outros";
    if (!groups[continent]) groups[continent] = [];
    groups[continent].push(c);
  }
  return groups;
}

const UNLOCK_PACKAGES = [
  { houses: 1, credits: 1, label: "+1 Casa", desc: "Desbloqueia 1 casa adicional" },
  { houses: 3, credits: 2, label: "+3 Casas", desc: "Desbloqueia 3 casas adicionais" },
  { houses: 12, credits: 3, label: "Mapa Completo", desc: "Todas as 12 casas reveladas" },
];

const DestinyResults = ({ house, houseName, houseData, cities, onUnlock, userCredits, isAuthenticated }: DestinyResultsProps) => {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(false);
  const [showSecondaryOverlay, setShowSecondaryOverlay] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [unlockedHouses, setUnlockedHouses] = useState<Set<number>>(new Set([house]));
  const [secondaryUnlocked, setSecondaryUnlocked] = useState(false);

  const accentColor = extractAccentColor(house);
  const bgGradient = houseColors[house];

  const allCities = [...cities.highticket, ...cities.acessivel, ...cities.nacional];
  const masterCity = allCities[0];
  const secondaryCities = allCities.slice(1);
  const continentGroups = groupByContinentMock(secondaryCities);

  if (!masterCity) return null;

  const cityName = masterCity.city || masterCity.display_name;
  const cityImage = getCityImage(cityName);
  const flag = getCountryFlag(masterCity.country || "");
  const rituals = HOUSE_RITUALS[house] || HOUSE_RITUALS[1];

  const heroImage = wikiData?.originalimage?.source || wikiData?.thumbnail?.source || cityImage;

  const handleUnlock = () => {
    setUnlocked(true);
    setWikiLoading(true);
    fetchWikipediaData(cityName).then((data) => {
      setWikiData(data);
      setWikiLoading(false);
    });
    fetchWeatherData(cityName, masterCity.country).then((data) => {
      setWeatherData(data);
    });
  };

  const getNextHousesToUnlock = (count: number): number[] => {
    const allHouseNums = Array.from({ length: 12 }, (_, i) => i + 1);
    const locked = allHouseNums.filter(h => !unlockedHouses.has(h));
    return locked.slice(0, count);
  };

  const handleUnlockPackage = (pkg: typeof UNLOCK_PACKAGES[0]) => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    if ((userCredits ?? 0) < pkg.credits) {
      navigate("/credits");
      return;
    }
    
    // Update local state BEFORE calling onUnlock
    if (pkg.houses === 12) {
      // Unlock all
      setUnlockedHouses(new Set(Array.from({ length: 12 }, (_, i) => i + 1)));
      setSecondaryUnlocked(true);
    } else {
      const toUnlock = getNextHousesToUnlock(pkg.houses);
      setUnlockedHouses(prev => {
        const next = new Set(prev);
        toUnlock.forEach(h => next.add(h));
        return next;
      });
    }
    
    onUnlock?.(pkg.houses);
    setShowUnlockModal(false);
    setShowSecondaryOverlay(false);
  };

  const openUnlockFlow = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    setShowUnlockModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8"
      style={{ '--house-accent': accentColor } as React.CSSProperties}
    >
      {/* ===== LOCK SCREEN / MASTER DESTINY ===== */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_hsl(var(--gold)/0.08)]"
        style={{ borderColor: `rgba(${accentColor}, 0.3)`, borderWidth: '1px', borderStyle: 'solid' }}
      >
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={cityName}
            className={`w-full h-full object-cover transition-all duration-1000 ${
              !unlocked ? "blur-sm grayscale scale-105" : ""
            }`}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        </div>

        {/* LOCKED STATE */}
        <AnimatePresence>
          {!unlocked && (
            <motion.div
              key="lock-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              className="relative z-20 flex flex-col items-center justify-center text-center py-24 md:py-32 px-6"
            >
              <div className="flex flex-col items-center gap-5 p-8 md:p-12 rounded-2xl bg-card/70 backdrop-blur-xl shadow-[0_0_60px_hsl(var(--gold)/0.12)] max-w-md"
                style={{ borderColor: `rgba(${accentColor}, 0.3)`, borderWidth: '1px', borderStyle: 'solid' }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: `rgba(${accentColor}, 0.15)`, border: `2px solid rgba(${accentColor}, 0.4)` }}
                >
                  <Lock className="w-7 h-7" style={{ color: `rgb(${accentColor})` }} />
                </div>
                <div className="space-y-2">
                  <p className="font-cinzel text-base md:text-lg font-bold text-foreground uppercase tracking-wider">
                    Casa {house}: {houseName}
                  </p>
                  <p className="text-foreground/50 text-sm leading-relaxed max-w-xs">
                    O seu Destino Mestre e opções secundárias estão prontos.
                  </p>
                </div>
                <button
                  onClick={handleUnlock}
                  className="mt-3 px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-[hsl(var(--gold-light))] text-primary-foreground font-bold text-sm uppercase tracking-[0.14em] shadow-[0_0_40px_hsl(var(--gold)/0.3)] hover:shadow-[0_0_60px_hsl(var(--gold)/0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-3"
                >
                  <Eye className="w-5 h-5" />
                  Desbloquear Mapeamento
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* UNLOCKED STATE */}
        <AnimatePresence>
          {unlocked && (
            <motion.div
              key="content-revealed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative z-10 p-6 md:p-10 space-y-8"
            >
              {wikiLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <span className="ml-3 text-sm text-foreground/50">A compilar dados...</span>
                </div>
              )}

              {/* Top label */}
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: `rgb(${accentColor})` }}>
                  O Destino Mestre
                </span>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {houseData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm"
                      style={{
                        borderColor: `rgba(${accentColor}, 0.4)`,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        background: `rgba(${accentColor}, 0.12)`,
                        color: `rgb(${accentColor})`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-cinzel text-4xl md:text-6xl font-bold text-foreground leading-none tracking-tight">
                  {cityName}
                </h2>
                <div className="flex items-center gap-3 text-foreground/60 flex-wrap">
                  <span className="text-xl">{flag}</span>
                  <span className="text-sm font-light tracking-wide">{masterCity.country}</span>
                  {masterCity.lat != null && masterCity.lon != null && (
                    <>
                      <span className="text-foreground/20">|</span>
                      <MapPin className="w-3.5 h-3.5 text-primary/50" />
                      <span className="text-xs text-foreground/40 font-mono">
                        {masterCity.lat.toFixed(2)}°, {masterCity.lon.toFixed(2)}°
                      </span>
                    </>
                  )}
                  {/* Weather badge */}
                  {weatherData && (
                    <>
                      <span className="text-foreground/20">|</span>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/60 backdrop-blur-sm border border-primary/10">
                        <img
                          src={`https://openweathermap.org/img/wn/${weatherData.icon}.png`}
                          alt={weatherData.description}
                          className="w-5 h-5"
                        />
                        <span className="text-xs font-semibold text-foreground">{weatherData.temp}°C</span>
                        <span className="text-[9px] text-foreground/40 capitalize">{weatherData.description}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* City photo */}
              <div className="rounded-xl overflow-hidden border border-primary/10 shadow-lg">
                <img
                  src={getCityImage(cityName)}
                  alt={`Foto de ${cityName}`}
                  className="w-full h-48 md:h-64 object-cover"
                  loading="lazy"
                />
              </div>

              {/* Egrégora + Significado */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-5 rounded-xl bg-card/60 backdrop-blur-md border border-primary/15 space-y-3">
                  <div className="flex items-center gap-2">
                    <Gem className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
                    <p className="font-cinzel text-xs font-bold uppercase tracking-wider" style={{ color: `rgb(${accentColor})` }}>
                      A Egrégora de Poder
                    </p>
                  </div>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {houseData.resumo}: {houseData.porque}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-card/60 backdrop-blur-md border border-primary/15 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
                    <p className="font-cinzel text-xs font-bold uppercase tracking-wider" style={{ color: `rgb(${accentColor})` }}>
                      O Que Significa Passar o Aniversário Aqui?
                    </p>
                  </div>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {houseData.beneficio}
                  </p>
                </div>
              </div>

              {/* Wikipedia */}
              {wikiData?.extract && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-xl bg-card/40 backdrop-blur-sm border border-primary/10 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary/60" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                      Sobre {wikiData.title || cityName}
                    </h3>
                  </div>
                  <p className="text-foreground/60 text-sm leading-relaxed">{wikiData.extract}</p>
                  {wikiData.content_urls?.desktop?.page && (
                    <a href={wikiData.content_urls.desktop.page} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] text-primary/50 hover:text-primary transition-colors">
                      <ExternalLink className="w-3 h-3" /> Wikipedia
                    </a>
                  )}
                </motion.div>
              )}

              {/* Rituais */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
                  <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.15em]" style={{ color: `rgb(${accentColor})` }}>
                    Rituais de Revolução Solar
                  </h4>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {rituals.map((r, i) => (
                    <div key={i} className="relative overflow-hidden p-5 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/10">
                      <span className="absolute -top-2 -right-1 text-[80px] font-cinzel font-black leading-none select-none pointer-events-none" style={{ color: `rgba(${accentColor}, 0.06)` }}>
                        {i + 1}
                      </span>
                      <div className="relative z-10 flex gap-3 items-start">
                        <span
                          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                          style={{ background: `rgba(${accentColor}, 0.15)`, border: `1px solid rgba(${accentColor}, 0.3)`, color: `rgb(${accentColor})` }}
                        >
                          {i + 1}
                        </span>
                        <p className="text-foreground/70 text-xs leading-relaxed pt-1">{r}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Previsões */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
                  <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.15em]" style={{ color: `rgb(${accentColor})` }}>
                    Previsões do Ciclo
                  </h4>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: User, label: "Vida Pessoal", text: houseData.pessoal },
                    { icon: Heart, label: "Amor", text: houseData.amor },
                    { icon: Briefcase, label: "Profissional", text: houseData.prof },
                  ].map(({ icon: Icon, label, text }) => (
                    <div key={label} className="flex gap-4 items-start p-4 rounded-xl bg-card/40 backdrop-blur-sm border border-primary/8">
                      <div
                        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ border: `2px solid rgba(${accentColor}, 0.3)`, background: `rgba(${accentColor}, 0.08)` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
                      </div>
                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: `rgba(${accentColor}, 0.8)` }}>{label}</span>
                        <p className="text-foreground/60 text-xs leading-relaxed">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== SECONDARY DESTINATIONS ===== */}
      {secondaryCities.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-primary/60" />
            <h3 className="font-cinzel text-sm font-bold text-foreground uppercase tracking-[0.12em]">
              Mapeamento Global Completo
            </h3>
          </div>

          <div className="relative">
            <div className={`select-none ${!secondaryUnlocked ? 'cursor-pointer' : ''}`} onClick={() => !secondaryUnlocked && openUnlockFlow()}>
              {Object.entries(continentGroups).map(([continent, citiesList]) => (
                <div key={continent} className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 mb-2 pl-1">{continent}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {citiesList.map((c, i) => {
                      const cFlag = getCountryFlag(c.country || "");
                      return (
                        <div
                          key={`${c.city}-${i}`}
                          className="relative rounded-xl bg-card/40 p-4 overflow-hidden"
                          style={{ borderLeft: `3px solid rgba(${accentColor}, 0.4)`, borderTop: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-base">{cFlag}</span>
                            <span className="text-[10px] text-foreground/40 uppercase tracking-wider">{c.continent || c.country}</span>
                          </div>
                          <p className={`text-foreground font-semibold text-sm ${!secondaryUnlocked ? 'blur-[4px]' : ''}`}>
                            {c.city || c.display_name}
                          </p>
                          {c.lat != null && (
                            <p className={`text-foreground/30 text-[9px] font-mono mt-1 ${!secondaryUnlocked ? 'blur-[3px]' : ''}`}>
                              {secondaryUnlocked ? `${c.lat?.toFixed(2)}°, ${c.lon?.toFixed(2)}°` : `${c.lat?.toFixed(0)}°, ?????`}
                            </p>
                          )}
                          <div className="absolute top-3 right-3">
                            {secondaryUnlocked ? (
                              <MapPin className="w-3.5 h-3.5 text-primary/40" />
                            ) : (
                              <Lock className="w-3.5 h-3.5" style={{ color: `rgba(${accentColor}, 0.4)` }} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== GRID DAS 12 CASAS ===== */}
      {unlocked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-5"
        >
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-primary/60" />
            <h3 className="font-cinzel text-sm font-bold text-foreground uppercase tracking-[0.12em]">
              Explorar Todas as Casas
            </h3>
          </div>
          <p className="text-muted-foreground text-xs font-light">
            Cada casa rege uma área da sua vida. Desbloqueie mais casas para descobrir rotas alternativas de prosperidade.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((houseNum) => {
              const hData = cityDatabase[houseNum];
              const isUnlocked = unlockedHouses.has(houseNum);
              const isCurrentHouse = houseNum === house;
              const hAccent = extractAccentColor(houseNum);
              const archetype = getHouseArchetype(hData?.name || "");
              const sign = houseSigns[houseNum];

              // Get city for this house from allCities or masterCity
              const houseCity = isCurrentHouse ? masterCity : null;
              const houseCityFlag = houseCity ? getCountryFlag(houseCity.country || "") : null;

              return (
                <motion.button
                  key={houseNum}
                  onClick={() => !isUnlocked && openUnlockFlow()}
                  whileHover={!isUnlocked ? { scale: 1.03, y: -4 } : {}}
                  whileTap={!isUnlocked ? { scale: 0.97 } : {}}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: houseNum * 0.06, type: "spring", stiffness: 200 }}
                  className={`relative rounded-2xl border text-left transition-all duration-500 overflow-hidden group ${
                    !isUnlocked
                      ? "border-muted/10 opacity-40 cursor-pointer"
                      : isCurrentHouse
                        ? "border-primary/60 shadow-[0_0_40px_hsl(var(--gold)/0.25)] ring-1 ring-primary/30"
                        : "border-primary/40 hover:border-primary/60 shadow-[0_0_20px_hsl(var(--gold)/0.1)]"
                  }`}
                  style={{ background: houseColors[houseNum] }}
                >
                  {/* Locked overlay */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/80 backdrop-blur-md z-10">
                      <div className="text-center">
                        <svg className="w-8 h-8 text-muted-foreground/30 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span className="text-muted-foreground/30 text-[9px] uppercase tracking-widest">Bloqueada</span>
                      </div>
                    </div>
                  )}

                  <div className="p-5 relative z-[1]">
                    {isCurrentHouse && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary/25 border border-primary/40 backdrop-blur-sm">
                        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary">Casa-alvo</span>
                      </div>
                    )}

                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-primary font-cinzel text-[11px] font-bold uppercase tracking-wider">Casa {houseNum}</p>
                        <p className="text-foreground text-sm font-semibold mt-0.5">{hData?.label}</p>
                        <p className="text-foreground/50 text-[10px] mt-0.5">{archetype} · {sign}</p>
                        <p className="text-foreground/50 text-[10px] mt-0.5">{hData?.regente}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {hData?.tags.map((tag) => (
                        <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60 uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-foreground/50 text-[10px] uppercase tracking-[0.18em]">Cristal:</span>
                      <span className="text-foreground/70 text-[10px]">{hData?.cristal}</span>
                    </div>

                    {/* City with flag — only for unlocked houses */}
                    {isUnlocked && isCurrentHouse && houseCity && (
                      <div className="mt-2 pt-3 border-t border-foreground/10">
                        <div className="flex items-center gap-2.5">
                          {houseCityFlag && <span className="text-lg leading-none">{houseCityFlag}</span>}
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground font-semibold text-sm truncate">{houseCity.city || houseCity.display_name}</p>
                            <p className="text-foreground/40 text-[10px]">{houseCity.country}</p>
                          </div>
                          <MapPin className="w-3.5 h-3.5 text-primary/40 shrink-0" />
                        </div>
                      </div>
                    )}

                    {/* For non-current unlocked houses, show "Desbloqueada" badge */}
                    {isUnlocked && !isCurrentHouse && (
                      <div className="mt-2 pt-3 border-t border-foreground/10">
                        <div className="flex items-center gap-2">
                          <Eye className="w-3.5 h-3.5 text-primary/50" />
                          <span className="text-primary/60 text-[10px] font-semibold uppercase tracking-wider">Desbloqueada</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ===== UNLOCK MODAL ===== */}
      <AnimatePresence>
        {showUnlockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm px-4"
            onClick={() => setShowUnlockModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-primary/20 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-[0_0_80px_hsl(var(--gold)/0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <CreditCard className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-cinzel text-lg font-bold text-foreground uppercase tracking-wider">
                  Desbloquear Casas
                </h3>
                <p className="text-muted-foreground text-xs mt-2">
                  Seus créditos: <span className="text-primary font-bold">{userCredits ?? 0}</span>
                </p>
              </div>

              <div className="space-y-3">
                {UNLOCK_PACKAGES.map((pkg) => {
                  const canAfford = (userCredits ?? 0) >= pkg.credits;
                  return (
                    <button
                      key={pkg.houses}
                      onClick={() => handleUnlockPackage(pkg)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        canAfford
                          ? "border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50"
                          : "border-border/30 bg-card/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-cinzel text-sm font-bold text-foreground">{pkg.label}</p>
                          <p className="text-muted-foreground text-[10px] mt-0.5">{pkg.desc}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary font-bold text-sm">{pkg.credits} crédito{pkg.credits > 1 ? "s" : ""}</p>
                          {!canAfford && (
                            <p className="text-destructive text-[9px] mt-0.5">Saldo insuficiente</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/credits")}
                  className="text-primary text-xs font-semibold uppercase tracking-wider hover:underline flex items-center gap-1.5 mx-auto"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Comprar Mais Créditos
                </button>
              </div>

              <button
                onClick={() => setShowUnlockModal(false)}
                className="mt-4 w-full py-2 text-muted-foreground text-xs uppercase tracking-widest hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DestinyResults;
