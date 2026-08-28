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
    clearTimeout(timerRef.current);
    onChange(item.display, true, item.coords);
    setIsValid(true);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  useEffect(() => {
    const handleOutside = (e: Event) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`quantum-input transition-colors duration-300 ${invalid && !isValid ? "invalid" : ""} ${className || ""}`}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="autocomplete-results">
          {suggestions.map((item, i) => (
            <div key={i} className="suggestion-item" onClick={() => selectCity(item)}>
              <svg className="w-4 h-4 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
