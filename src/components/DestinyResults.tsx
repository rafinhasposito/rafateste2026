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
  allResults?: Record<string, any>;
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
  // Returns a HIGH-CONTRAST decorative color per house (for icons, borders, badges).
  // NEVER use this for body text — text must always be white/off-white.
  return HOUSE_ACCENT_RGB[house] || "255, 215, 0";
}

/** Bright, legible accent colors per house — for icons, borders, badges ONLY (never body text) */
const HOUSE_ACCENT_RGB: Record<number, string> = {
  1: "255, 99, 99",     // Áries — vibrant red
  2: "120, 220, 140",   // Touro — fresh green
  3: "120, 200, 255",   // Gêmeos — sky blue
  4: "200, 160, 255",   // Câncer — soft violet
  5: "255, 200, 80",    // Leão — bright gold
  6: "120, 230, 200",   // Virgem — mint teal
  7: "230, 170, 230",   // Libra — pink plum
  8: "180, 140, 255",   // Escorpião — bright indigo
  9: "120, 180, 255",   // Sagitário — royal sky
  10: "200, 200, 200",  // Capricórnio — light silver
  11: "120, 220, 230",  // Aquário — bright cyan
  12: "200, 180, 255",  // Peixes — lavender
};

/** Solid background colors per house */
const HOUSE_SOLID_COLORS: Record<number, string> = {
  1: "#6e1e1e",   // Áries — deep red
  2: "#2e4a2e",   // Touro — deep green
  3: "#2e3a5e",   // Gêmeos — steel blue
  4: "#3a2e5e",   // Câncer — deep violet
  5: "#6e4a1e",   // Leão — deep gold
  6: "#1e4a3e",   // Virgem — teal
  7: "#3e2e4e",   // Libra — plum
  8: "#1e1e2e",   // Escorpião — near-black indigo
  9: "#1e3a6e",   // Sagitário — royal blue
  10: "#2e2e2e",  // Capricórnio — charcoal
  11: "#1e3e4e",  // Aquário — dark cyan
  12: "#2e2e4e",  // Peixes — midnight violet
};

/** Element border colors for the 12-house grid */
const ELEMENT_COLORS: Record<number, string> = {
  1: "#e74c3c", 5: "#e74c3c", 9: "#e74c3c",   // Fogo
  2: "#27ae60", 6: "#27ae60", 10: "#27ae60",   // Terra
  3: "#3498db", 7: "#3498db", 11: "#3498db",   // Ar
  4: "#9b59b6", 8: "#9b59b6", 12: "#9b59b6",   // Água
};

const CITY_IMAGES: Record<string, string> = {
  "nova iorque": "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200&q=80",
  "new york": "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200&q=80",
  "los angeles": "https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=1200&q=80",
  "paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
  "londres": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  "london": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  "dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
  "tóquio": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
  "tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
  "roma": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
  "rome": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
  "barcelona": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80",
  "miami": "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=1200&q=80",
  "são paulo": "https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=1200&q=80",
  "rio de janeiro": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80",
  "bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
  "singapura": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80",
  "singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80",
  "amsterdam": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=80",
  "sydney": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80",
  "berlim": "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&q=80",
  "berlin": "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&q=80",
  "buenos aires": "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200&q=80",
  "istambul": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80",
  "istanbul": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80",
  "lisboa": "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200&q=80",
  "lisbon": "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200&q=80",
  "cusco": "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80",
  "santorini": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80",
  "florianópolis": "https://images.unsplash.com/photo-1588001832198-c15cff59b078?w=1200&q=80",
  "salvador": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80",
  "auckland": "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&q=80",
  "banguecoque": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80",
  "bangkok": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80",
  "bora bora": "https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?w=1200&q=80",
  "fernando de noronha": "https://images.unsplash.com/photo-1598443928710-7def5b3b037e?w=1200&q=80",
  "praga": "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80",
  "prague": "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80",
  "viena": "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200&q=80",
  "vienna": "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200&q=80",
  "moscou": "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1200&q=80",
  "moscow": "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1200&q=80",
  "cairo": "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200&q=80",
  "marrakech": "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=1200&q=80",
  "hong kong": "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1200&q=80",
  "seul": "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200&q=80",
  "seoul": "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200&q=80",
  "madri": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80",
  "madrid": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80",
  "atenas": "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&q=80",
  "athens": "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&q=80",
  "zurique": "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1200&q=80",
  "zurich": "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1200&q=80",
  "vancouver": "https://images.unsplash.com/photo-1559511260-66a68e7e59b0?w=1200&q=80",
  "toronto": "https://images.unsplash.com/photo-1517090504332-af2865de5e60?w=1200&q=80",
  "cidade do méxico": "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=1200&q=80",
  "mexico city": "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=1200&q=80",
  "bogotá": "https://images.unsplash.com/photo-1536989754687-832a88507bd6?w=1200&q=80",
  "lima": "https://images.unsplash.com/photo-1531968455001-5c5272a67c71?w=1200&q=80",
  "santiago": "https://images.unsplash.com/photo-1510253687831-0f982bfc4c72?w=1200&q=80",
  "montevidéu": "https://images.unsplash.com/photo-1597867397684-d94dd8eb0db8?w=1200&q=80",
  "montevideo": "https://images.unsplash.com/photo-1597867397684-d94dd8eb0db8?w=1200&q=80",
};
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80";

function getCityImage(cityName: string): string {
  const key = cityName.toLowerCase().trim();
  if (CITY_IMAGES[key]) return CITY_IMAGES[key];
  return FALLBACK_IMAGE;
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

const DestinyResults = ({ house, houseName, houseData, cities, allResults, onUnlock, userCredits, isAuthenticated }: DestinyResultsProps) => {
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
  const houseSolidBg = HOUSE_SOLID_COLORS[house] || "#1e1e2e";

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
    if (pkg.houses === 12) {
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
      {/* ===== HERO — SOLID BG + CITY IMAGE + GLASS CARD ===== */}
      <div
        className="relative rounded-2xl overflow-hidden min-h-[420px]"
        style={{ backgroundColor: houseSolidBg }}
      >
        {/* Solid gradient background — no photo */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `linear-gradient(135deg, ${houseSolidBg} 0%, ${houseSolidBg}99 60%, rgba(0,0,0,0.9) 100%)`,
          }}
        />

        {/* House number watermark */}
        <span
          className="absolute top-4 right-6 z-[2] font-cinzel font-black select-none pointer-events-none leading-none"
          style={{ fontSize: '140px', color: `rgba(255,255,255,0.06)` }}
        >
          {house}
        </span>

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
              <div
                className="flex flex-col items-center gap-5 p-8 md:p-12 rounded-2xl backdrop-blur-xl shadow-2xl max-w-md"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: `rgba(${accentColor}, 0.2)`, border: `2px solid rgba(${accentColor}, 0.5)` }}
                >
                  <Lock className="w-7 h-7" style={{ color: `rgb(${accentColor})` }} />
                </div>
                <div className="space-y-2">
                  <p className="font-cinzel text-base md:text-lg font-bold text-white uppercase tracking-wider">
                    Casa {house}: {houseName}
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                    O seu Destino Mestre e opções secundárias estão prontos.
                  </p>
                </div>
                <button
                  onClick={handleUnlock}
                  className="mt-3 px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-[0.14em] transition-all duration-300 flex items-center gap-3"
                  style={{
                    background: `linear-gradient(135deg, rgb(${accentColor}), rgba(${accentColor}, 0.7))`,
                    color: "#fff",
                    boxShadow: `0 0 40px rgba(${accentColor}, 0.3)`,
                  }}
                >
                  <Eye className="w-5 h-5" />
                  Desbloquear Mapeamento
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* UNLOCKED STATE — GLASS CARD */}
        <AnimatePresence>
          {unlocked && (
            <motion.div
              key="content-revealed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative z-10 p-6 md:p-10"
            >
              {wikiLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: `rgb(${accentColor})` }} />
                  <span className="ml-3 text-sm text-white/60">A compilar dados...</span>
                </div>
              )}

              {/* Glass card container */}
               <div
                className="rounded-2xl p-6 md:p-8 space-y-6"
                style={{
                  background: "rgba(0,0,0,0.40)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
              >
                {/* Top label */}
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
                    O Destino Mestre
                  </span>
                </div>

                {/* House name — BIG */}
                <div className="space-y-1">
                  <h2
                    className="font-cinzel text-3xl md:text-5xl font-black text-white leading-tight"
                    style={{ textShadow: `0 0 40px rgba(${accentColor}, 0.3)` }}
                  >
                    Casa {house}
                  </h2>
                  <p className="font-cinzel text-lg md:text-xl font-semibold tracking-wide text-white/95">
                    {houseData.label}
                  </p>
                </div>

                {/* House identity badge */}
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{
                      background: `rgba(${accentColor}, 0.18)`,
                      border: `1px solid rgba(${accentColor}, 0.5)`,
                    }}
                  >
                    <span className="font-cinzel text-sm font-black text-white">
                      Casa {house}
                    </span>
                    <span className="text-white/40">·</span>
                    <span className="font-cinzel text-sm font-semibold text-white/95">
                      {houseSigns[house] || ""}
                    </span>
                  </div>

                  {/* Tags */}
                  {houseData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        border: `1px solid rgba(255,255,255,0.2)`,
                        background: "rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-white/10" />

                {/* City name + coords + weather */}
                <div className="space-y-2">
                  <h3
                    className="font-cinzel text-2xl md:text-4xl font-bold text-white leading-none tracking-tight"
                    style={{ textShadow: `0 0 30px rgba(${accentColor}, 0.25)` }}
                  >
                    {cityName}
                  </h3>
                  <div className="flex items-center gap-3 text-white/90 flex-wrap">
                    <span className="text-xl">{flag}</span>
                    <span className="text-sm font-medium tracking-wide text-white">{masterCity.country}</span>
                    {masterCity.lat != null && masterCity.lon != null && (
                      <>
                        <span className="text-white/40">|</span>
                        <MapPin className="w-3.5 h-3.5 text-white/70" />
                        <span className="text-xs text-white/85 font-mono">
                          {masterCity.lat.toFixed(2)}°, {masterCity.lon.toFixed(2)}°
                        </span>
                      </>
                    )}
                    {weatherData && (
                      <>
                        <span className="text-white/40">|</span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                          <img
                            src={`https://openweathermap.org/img/wn/${weatherData.icon}.png`}
                            alt={weatherData.description}
                            className="w-5 h-5"
                          />
                          <span className="text-xs font-semibold text-white">{weatherData.temp}°C</span>
                          <span className="text-[9px] text-white/85 capitalize">{weatherData.description}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10" />

                {/* Egrégora + Significado */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-5 rounded-xl space-y-3" style={{ background: "rgba(0,0,0,0.40)", border: "1px solid rgba(255,255,255,0.18)" }}>
                    <div className="flex items-center gap-2">
                      <Gem className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
                      <p className="font-cinzel text-xs font-bold uppercase tracking-wider text-white">
                        A Egrégora de Poder
                      </p>
                    </div>
                    <p className="text-white/95 text-sm leading-relaxed">
                      {houseData.resumo}: {houseData.porque}
                    </p>
                  </div>
                  <div className="p-5 rounded-xl space-y-3" style={{ background: "rgba(0,0,0,0.40)", border: "1px solid rgba(255,255,255,0.18)" }}>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
                      <p className="font-cinzel text-xs font-bold uppercase tracking-wider text-white">
                        O Que Significa Passar o Aniversário Aqui?
                      </p>
                    </div>
                    <p className="text-white/95 text-sm leading-relaxed">
                      {houseData.beneficio}
                    </p>
                  </div>
                </div>

                {/* Wikipedia */}
                {/* Sobre — City photo + Wikipedia */}
                {(wikiData?.extract || heroImage) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl overflow-hidden space-y-0"
                    style={{ background: "rgba(0,0,0,0.30)", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    {/* City photo — deslumbrante */}
                    {heroImage && (
                      <div className="relative overflow-hidden">
                        <img
                          src={heroImage}
                          alt={cityName}
                          className="w-full h-64 md:h-72 object-cover"
                          loading="eager"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)`,
                          }}
                        />
                        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
                          <h3 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: `rgb(${accentColor})` }}>
                            Sobre {wikiData?.title || cityName}
                          </h3>
                        </div>
                      </div>
                    )}

                    {/* Wikipedia text */}
                    {wikiData?.extract && (
                      <div className="p-5 space-y-3">
                        {!heroImage && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: `rgb(${accentColor})` }}>
                              Sobre {wikiData.title || cityName}
                            </h3>
                          </div>
                        )}
                        <p className="text-white/90 text-sm leading-relaxed">{wikiData.extract}</p>
                        {wikiData.content_urls?.desktop?.page && (
                          <a href={wikiData.content_urls.desktop.page} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] hover:underline" style={{ color: `rgba(${accentColor}, 0.7)` }}>
                            <ExternalLink className="w-3 h-3" /> Wikipedia
                          </a>
                        )}
                      </div>
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
                      <div key={i} className="relative overflow-hidden p-5 rounded-xl" style={{ background: "rgba(0,0,0,0.30)", border: "1px solid rgba(255,255,255,0.15)" }}>
                        <span className="absolute -top-2 -right-1 text-[80px] font-cinzel font-black leading-none select-none pointer-events-none" style={{ color: "rgba(255,255,255,0.03)" }}>
                          {i + 1}
                        </span>
                        <div className="relative z-10 flex gap-3 items-start">
                          <span
                            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                            style={{ background: `rgba(${accentColor}, 0.2)`, border: `1px solid rgba(${accentColor}, 0.4)`, color: `rgb(${accentColor})` }}
                          >
                            {i + 1}
                          </span>
                          <p className="text-white/90 text-xs leading-relaxed pt-1">{r}</p>
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
                      <div key={label} className="flex gap-4 items-start p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.30)", border: "1px solid rgba(255,255,255,0.15)" }}>
                        <div
                          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ border: `2px solid rgba(${accentColor}, 0.4)`, background: `rgba(${accentColor}, 0.1)` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: `rgb(${accentColor})` }} />
                        </div>
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: `rgb(${accentColor})` }}>{label}</span>
                          <p className="text-white/90 text-xs leading-relaxed">{text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== SECONDARY DESTINATIONS — CLEAN CARDS ===== */}
      {secondaryCities.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-white/50" />
            <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-[0.12em]">
              Mapeamento Global Completo
            </h3>
          </div>

          <div className="relative">
            <div className={`select-none ${!secondaryUnlocked ? 'cursor-pointer' : ''}`} onClick={() => !secondaryUnlocked && openUnlockFlow()}>
              {Object.entries(continentGroups).map(([continent, citiesList]) => (
                <div key={continent} className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2 pl-1">{continent}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {citiesList.map((c, i) => {
                      const cFlag = getCountryFlag(c.country || "");
                      return (
                        <div
                          key={`${c.city}-${i}`}
                          className="relative rounded-xl p-4 overflow-hidden"
                          style={{
                            background: "rgba(0,0,0,0.25)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderLeft: "3px solid rgba(255,255,255,0.2)",
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-base">{cFlag}</span>
                            <span className="text-[10px] text-white/50 uppercase tracking-wider">{c.continent || c.country}</span>
                          </div>
                          <p className={`text-white/90 font-semibold text-sm ${!secondaryUnlocked ? 'blur-[4px]' : ''}`}>
                            {c.city || c.display_name}
                          </p>
                          {c.lat != null && (
                            <p className={`text-white/35 text-[9px] font-mono mt-1 ${!secondaryUnlocked ? 'blur-[3px]' : ''}`}>
                              {secondaryUnlocked ? `${c.lat?.toFixed(2)}°, ${c.lon?.toFixed(2)}°` : `${c.lat?.toFixed(0)}°, ?????`}
                            </p>
                          )}
                          <div className="absolute top-3 right-3">
                            {secondaryUnlocked ? (
                              <MapPin className="w-3.5 h-3.5 text-white/30" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-white/25" />
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

      {/* ===== GRID DAS 12 CASAS — ELEMENT BORDERS ===== */}
      {unlocked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-5"
        >
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-white/50" />
            <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-[0.12em]">
              Explorar Todas as Casas
            </h3>
          </div>
          <p className="text-white/50 text-xs font-light">
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
              const elementColor = ELEMENT_COLORS[houseNum] || "#888";

              let houseCity: CityOption | null = null;
              if (isCurrentHouse) {
                houseCity = masterCity;
              } else if (allResults) {
                const hResult = allResults[String(houseNum)];
                const opts = hResult?.options || {};
                const toArr = (v: any): CityOption[] => {
                  if (!v) return [];
                  if (Array.isArray(v)) return v;
                  return [v];
                };
                const htCities = toArr(opts.highticket);
                const acCities = toArr(opts.acessivel);
                const naCities = toArr(opts.nacional);
                houseCity = htCities[0] || acCities[0] || naCities[0] || null;
              }
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
                  className={`relative rounded-2xl text-left transition-all duration-500 overflow-hidden group ${
                    !isUnlocked
                      ? "opacity-40 cursor-pointer"
                      : isCurrentHouse
                        ? "shadow-lg"
                        : ""
                  }`}
                  style={{
                    background: isUnlocked
                      ? isCurrentHouse
                        ? "rgba(0,0,0,0.30)"
                        : "rgba(0,0,0,0.25)"
                      : undefined,
                    border: isCurrentHouse
                      ? `2px solid ${elementColor}`
                      : isUnlocked
                        ? `1px solid rgba(255,255,255,0.15)`
                        : `1px solid rgba(255,255,255,0.05)`,
                    borderLeft: !isCurrentHouse ? `3px solid ${elementColor}` : undefined,
                    boxShadow: isCurrentHouse ? `0 0 30px ${elementColor}33, 0 0 0 2px ${elementColor}` : undefined,
                  }}
                >
                  {/* Locked overlay */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl z-10" style={{ background: "rgba(10,10,20,0.8)", backdropFilter: "blur(8px)" }}>
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span className="text-white/20 text-[9px] uppercase tracking-widest">Bloqueada</span>
                      </div>
                    </div>
                  )}

                  <div className="p-5 relative z-[1]">
                    {isCurrentHouse && (
                      <div
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full backdrop-blur-sm"
                        style={{ background: `${elementColor}33`, border: `1px solid ${elementColor}66` }}
                      >
                        <span className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: elementColor }}>Casa-alvo</span>
                      </div>
                    )}

                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center font-cinzel text-sm font-black"
                            style={{
                              background: `${elementColor}22`,
                              border: `2px solid ${elementColor}66`,
                              color: elementColor,
                            }}
                          >
                            {houseNum}
                          </span>
                          <p className="font-cinzel text-[11px] font-bold uppercase tracking-wider" style={{ color: `rgb(${hAccent})` }}>Casa {houseNum}</p>
                        </div>
                        <p className="font-bold text-base mt-1" style={{ color: `rgb(${hAccent})` }}>{hData?.label}</p>
                        <p className="text-white/70 text-[10px] mt-0.5">{archetype} · {sign}</p>
                        <p className="text-white/70 text-[10px] mt-0.5">{hData?.regente}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {hData?.tags.map((tag) => (
                        <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-white/50 text-[10px] uppercase tracking-[0.18em]">Cristal:</span>
                      <span className="text-white/85 text-[10px]">{hData?.cristal}</span>
                    </div>

                    {/* City with flag */}
                    {isUnlocked && houseCity && (
                      <div className="mt-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        <div className="flex items-center gap-2.5">
                          {houseCityFlag && <span className="text-lg leading-none">{houseCityFlag}</span>}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{houseCity.city || houseCity.display_name}</p>
                            <p className="text-white/50 text-[10px]">{houseCity.country}</p>
                          </div>
                          <MapPin className="w-3.5 h-3.5 text-white/30 shrink-0" />
                        </div>
                      </div>
                    )}

                    {isUnlocked && !houseCity && !isCurrentHouse && (
                      <div className="mt-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        <div className="flex items-center gap-2">
                          <Eye className="w-3.5 h-3.5 text-white/40" />
                          <span className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">Desbloqueada</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowUnlockModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
              style={{ background: "rgba(20,20,30,0.95)", border: `1px solid rgba(${accentColor}, 0.3)` }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <CreditCard className="w-8 h-8 mx-auto mb-3" style={{ color: `rgb(${accentColor})` }} />
                <h3 className="font-cinzel text-lg font-bold text-white uppercase tracking-wider">
                  Desbloquear Casas
                </h3>
                <p className="text-white/50 text-xs mt-2">
                  Seus créditos: <span className="font-bold" style={{ color: `rgb(${accentColor})` }}>{userCredits ?? 0}</span>
                </p>
              </div>

              <div className="space-y-3">
                {UNLOCK_PACKAGES.map((pkg) => {
                  const canAfford = (userCredits ?? 0) >= pkg.credits;
                  return (
                    <button
                      key={pkg.houses}
                      onClick={() => handleUnlockPackage(pkg)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        canAfford ? "hover:scale-[1.02]" : "opacity-50"
                      }`}
                      style={{
                        background: canAfford ? `rgba(${accentColor}, 0.08)` : "rgba(255,255,255,0.03)",
                        border: canAfford ? `1px solid rgba(${accentColor}, 0.3)` : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-cinzel text-sm font-bold text-white">{pkg.label}</p>
                          <p className="text-white/40 text-[10px] mt-0.5">{pkg.desc}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm" style={{ color: `rgb(${accentColor})` }}>{pkg.credits} crédito{pkg.credits > 1 ? "s" : ""}</p>
                          {!canAfford && (
                            <p className="text-red-400 text-[9px] mt-0.5">Saldo insuficiente</p>
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
                  className="text-xs font-semibold uppercase tracking-wider hover:underline flex items-center gap-1.5 mx-auto"
                  style={{ color: `rgb(${accentColor})` }}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Comprar Mais Créditos
                </button>
              </div>

              <button
                onClick={() => setShowUnlockModal(false)}
                className="mt-4 w-full py-2 text-white/40 text-xs uppercase tracking-widest hover:text-white/70 transition-colors"
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
