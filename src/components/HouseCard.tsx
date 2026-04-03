import { motion } from "framer-motion";
import { HouseData, houseColors } from "@/data/houses";
import { getHouseArchetype, houseSigns } from "@/lib/houseMeta";
import { getCountryFlag } from "@/lib/countryFlags";
import { MapPin } from "lucide-react";

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

interface HouseCardProps {
  houseNum: number;
  house: HouseData;
  result: HouseResult | null;
  locked: boolean;
  isGoal: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const HouseCard = ({ houseNum, house, result, locked, isGoal, isSelected, onSelect }: HouseCardProps) => {
  const bgGradient = houseColors[houseNum];
  const archetype = getHouseArchetype(house.name);
  const sign = houseSigns[houseNum];

  const cityName = result?.city?.city;
  const countryName = result?.city?.country;
  const flag = countryName ? getCountryFlag(countryName) : null;

  return (
    <motion.button
      onClick={() => !locked && onSelect()}
      whileHover={!locked ? { scale: 1.03, y: -4 } : {}}
      whileTap={!locked ? { scale: 0.97 } : {}}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: houseNum * 0.06, type: "spring", stiffness: 200 }}
      className={`relative rounded-2xl border text-left transition-all duration-500 overflow-hidden group ${
        locked
          ? "border-muted/10 opacity-30 cursor-not-allowed"
          : isSelected
            ? "border-primary/60 shadow-[0_0_40px_hsl(var(--gold)/0.25)] ring-1 ring-primary/30"
            : isGoal
              ? "border-primary/40 hover:border-primary/60 shadow-[0_0_20px_hsl(var(--gold)/0.1)]"
              : "border-border/50 hover:border-primary/30"
      }`}
      style={!locked ? { background: bgGradient } : undefined}
    >
      {locked && (
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
        {isGoal && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary/25 border border-primary/40 backdrop-blur-sm">
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary">Casa-alvo</span>
          </div>
        )}

        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-primary font-cinzel text-[11px] font-bold uppercase tracking-wider">Casa {houseNum}</p>
            <p className="text-foreground text-sm font-semibold mt-0.5">{house.label}</p>
            <p className="text-foreground/50 text-[10px] mt-0.5">{archetype} · {sign}</p>
            <p className="text-foreground/50 text-[10px] mt-0.5">{house.regente}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {house.tags.map((tag) => (
            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-foreground/50 text-[10px] uppercase tracking-[0.18em]">Cristal:</span>
          <span className="text-foreground/70 text-[10px]">{house.cristal}</span>
        </div>

        {/* City with flag */}
        {result && !locked && cityName && (
          <div className="mt-2 pt-3 border-t border-foreground/10">
            <div className="flex items-center gap-2.5">
              {flag && <span className="text-lg leading-none">{flag}</span>}
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-semibold text-sm truncate">{cityName}</p>
                <p className="text-foreground/40 text-[10px]">{countryName}</p>
              </div>
              <MapPin className="w-3.5 h-3.5 text-primary/40 shrink-0" />
            </div>
          </div>
        )}
      </div>
    </motion.button>
  );
};

export default HouseCard;
