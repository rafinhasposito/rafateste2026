import { useState, useRef, useEffect, useCallback } from "react";
import { resolveSearchTerm } from "@/lib/cityAliases";

export interface CityCoords {
  lat: number;
  lon: number;
}

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string, isValid: boolean, coords?: CityCoords) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  invalid?: boolean;
}

interface CityFeature {
  properties: { name?: string; state?: string; country?: string };
  geometry: { type: string; coordinates: [number, number] };
}

interface SuggestionItem {
  display: string;
  coords: CityCoords;
}

const CityAutocomplete = ({ value, onChange, placeholder, required, className, invalid }: CityAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchCities = useCallback(async (q: string) => {
    if (q.length < 3) { setSuggestions([]); return; }

    // Resolve PT-BR aliases (e.g. "Nova York" → "New York")
    const searchTerm = resolveSearchTerm(q);

    try {
      const r = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchTerm)}&limit=6`);
      const d = await r.json();
      if (d.features) {
        const items: SuggestionItem[] = d.features.map((f: CityFeature) => {
          const p = f.properties;
          const parts = [p.name, p.state, p.country].filter(Boolean);
          const display = parts.join(", ");
          const coords: CityCoords = {
            lon: f.geometry.coordinates[0],
            lat: f.geometry.coordinates[1],
          };
          return { display, coords };
        });
        setSuggestions(items);
        setShowSuggestions(true);
      }
    } catch { /* silently fail */ }
  }, []);

  const handleInput = (val: string) => {
    onChange(val, false);
    setIsValid(false);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchCities(val), 400);
  };

  const selectCity = (item: SuggestionItem) => {
    onChange(item.display, true, item.coords);
    setIsValid(true);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full h-full bg-white/5 border rounded-xl px-4 text-white placeholder:text-white/30 text-sm focus:outline-none focus:bg-white/[0.08] transition-all duration-300 ${invalid && !isValid ? "border-red-500/50" : "border-white/10 focus:border-[#D4AF37]/50"} ${className || ""}`}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0C10]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">
          {suggestions.map((item, i) => (
            <div key={i} className="px-4 py-3 cursor-pointer hover:bg-white/5 flex items-center gap-3 text-white/80 text-sm transition-colors border-b border-white/5 last:border-0" onClick={() => selectCity(item)}>
              <svg className="w-4 h-4 text-[#D4AF37] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {item.display}
            </div>
          ))}
        </div>
      )}
      {invalid && !isValid && (
        <p className="text-destructive text-[8px] mt-1">Selecione uma opção na lista.</p>
      )}
    </div>
  );
};

export default CityAutocomplete;
