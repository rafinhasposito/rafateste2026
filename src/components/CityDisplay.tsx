import { MapPin, Globe } from "lucide-react";
import { getCountryFlag } from "@/lib/countryFlags";

interface CityDisplayProps {
  city: string;
  country: string;
  lat?: number;
  lon?: number;
  tier?: "highticket" | "acessivel" | "nacional";
  compact?: boolean;
}

const tierLabels: Record<string, { label: string; className: string }> = {
  highticket: { label: "Alto Padrão", className: "bg-primary/20 text-primary" },
  acessivel: { label: "Médio Padrão", className: "bg-accent/20 text-accent-foreground" },
  nacional: { label: "Nacional", className: "bg-secondary text-secondary-foreground" },
};

const CityDisplay = ({ city, country, lat, lon, tier, compact }: CityDisplayProps) => {
  const flag = getCountryFlag(country);
  const tierInfo = tier ? tierLabels[tier] : null;
  const hasCoords = typeof lat === "number" && typeof lon === "number";

  if (compact) {
    return (
      <div className="flex items-center gap-2.5">
        <span className="text-lg leading-none">{flag}</span>
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-semibold text-sm truncate">{city}</p>
          <p className="text-foreground/40 text-[10px]">{country}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/10 bg-card/40 overflow-hidden transition-all hover:border-primary/25">
      {/* Map preview */}
      {hasCoords && (
        <div className="relative h-28 bg-background/60 overflow-hidden">
          <iframe
            title={`Mapa de ${city}`}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon! - 0.15},${lat! - 0.08},${lon! + 0.15},${lat! + 0.08}&layer=mapnik&marker=${lat},${lon}`}
            className="w-full h-full border-0 pointer-events-none opacity-70"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-primary/60" />
            <span className="text-[9px] text-foreground/50 uppercase tracking-wider">
              {lat?.toFixed(2)}°, {lon?.toFixed(2)}°
            </span>
          </div>
        </div>
      )}

      {/* City info */}
      <div className="p-4">
        {tierInfo && (
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${tierInfo.className} inline-block mb-2.5`}>
            {tierInfo.label}
          </span>
        )}
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none">{flag}</span>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-semibold text-base truncate">{city}</p>
            <p className="text-foreground/50 text-xs">{country}</p>
          </div>
          <MapPin className="w-4 h-4 text-primary/40 shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default CityDisplay;
