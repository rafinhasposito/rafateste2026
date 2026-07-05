import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Thermometer, ExternalLink, Loader2, BookOpen, Camera } from "lucide-react";
import { getCountryFlag } from "@/lib/countryFlags";

interface WikiData {
  title: string;
  extract: string;
  extract_html?: string;
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string };
  description?: string;
  content_urls?: { desktop?: { page?: string } };
}

interface CityDetailsModalProps {
  cityName: string;
  country: string;
  lat?: number;
  lon?: number;
  onClose: () => void;
}

async function fetchWikipediaData(cityName: string): Promise<WikiData | null> {
  try {
    // Try Portuguese Wikipedia first
    const ptRes = await fetch(
      `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`
    );
    if (ptRes.ok) {
      const data = await ptRes.json();
      if (data.type !== "disambiguation" && data.extract) return data;
    }
    // Fallback to English
    const enRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`
    );
    if (enRes.ok) {
      const data = await enRes.json();
      if (data.extract) return data;
    }
  } catch (e) {
    console.error("Wikipedia fetch error:", e);
  }
  return null;
}

const CityDetailsModal: React.FC<CityDetailsModalProps> = ({
  cityName,
  country,
  lat,
  lon,
  onClose,
}) => {
  const [wiki, setWiki] = useState<WikiData | null>(null);
  const [loading, setLoading] = useState(true);
  const flag = getCountryFlag(country);

  useEffect(() => {
    setLoading(true);
    fetchWikipediaData(cityName).then((data) => {
      setWiki(data);
      setLoading(false);
    });
  }, [cityName]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const heroImage =
    wiki?.originalimage?.source ||
    wiki?.thumbnail?.source ||
    null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-primary/20 bg-card shadow-[0_0_80px_hsl(var(--gold)/0.1)]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-background/60 backdrop-blur-sm border border-primary/15 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Hero image */}
          {heroImage && (
            <div className="relative w-full h-56 md:h-72 overflow-hidden">
              <img
                src={heroImage}
                alt={cityName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              <div className="absolute bottom-4 left-6 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-primary/60" />
                <span className="text-[9px] uppercase tracking-wider text-foreground/40">
                  Fonte: Wikipedia
                </span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                {wiki?.title || cityName}
              </h2>
              <div className="flex items-center gap-3 text-foreground/50">
                <span className="text-lg">{flag}</span>
                <span className="text-sm">{country}</span>
                {lat != null && lon != null && (
                  <>
                    <span className="text-foreground/15">|</span>
                    <MapPin className="w-3.5 h-3.5 text-primary/40" />
                    <span className="text-xs font-mono text-foreground/35">
                      {lat.toFixed(2)}°, {lon.toFixed(2)}°
                    </span>
                  </>
                )}
              </div>
              {wiki?.description && (
                <p className="text-xs text-primary/70 italic mt-1">
                  {wiki.description}
                </p>
              )}
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="ml-3 text-sm text-foreground/40">
                  Consultando dados da cidade…
                </span>
              </div>
            )}

            {/* Wikipedia extract */}
            {!loading && wiki?.extract && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary/60" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                    Sobre a Cidade
                  </h3>
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {wiki.extract}
                </p>
              </div>
            )}

            {/* No data state */}
            {!loading && !wiki && (
              <p className="text-foreground/40 text-sm text-center py-8">
                Não foi possível carregar informações sobre esta cidade.
              </p>
            )}

            {/* Wikipedia link */}
            {wiki?.content_urls?.desktop?.page && (
              <a
                href={wiki.content_urls.desktop.page}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-primary/60 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Ver mais na Wikipedia
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CityDetailsModal;
