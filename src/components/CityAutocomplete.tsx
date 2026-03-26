import { useState, useRef, useEffect, useCallback } from "react";

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  invalid?: boolean;
}

interface CityFeature {
  properties: { name?: string; state?: string; country?: string };
}

const CityAutocomplete = ({ value, onChange, placeholder, required, className, invalid }: CityAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchCities = useCallback(async (q: string) => {
    if (q.length < 3) { setSuggestions([]); return; }
    try {
      const r = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5`);
      const d = await r.json();
      if (d.features) {
        const cities = d.features.map((f: CityFeature) => {
          const p = f.properties;
          return `${p.name || ""}, ${p.state || ""}, ${p.country || ""}`;
        });
        setSuggestions(cities);
        setShowSuggestions(true);
      }
    } catch {}
  }, []);

  const handleInput = (val: string) => {
    onChange(val, false);
    setIsValid(false);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchCities(val), 400);
  };

  const selectCity = (city: string) => {
    onChange(city, true);
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
        className={`quantum-input transition-colors duration-300 ${invalid && !isValid ? "invalid" : ""} ${className || ""}`}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="autocomplete-results">
          {suggestions.map((city, i) => (
            <div key={i} className="suggestion-item" onClick={() => selectCity(city)}>
              <svg className="w-4 h-4 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {city}
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
