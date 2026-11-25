import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  Gift,
  Pause,
  Plane,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import ScanningOverlay from "@/components/ScanningOverlay";
import { HOUSES_SHOWCASE } from "@/data/housesShowcase";
import { getHousePalette } from "@/data/housePalette";
import { getCurrentSolarYear } from "@/lib/astro";
import { prewarmSolarApi, runFreePastAudit } from "@/lib/pastAuditClient";
import { type SupportedLocale, useI18n } from "@/lib/i18n";
import {
  FREE_PAST_STORAGE_KEY,
  type StoredFreePastPayload,
} from "@/pages/FreePastResult";
import { toast } from "sonner";

type MobileView = "hook" | "quiz" | "plans";

interface MobileStoryExample {
  id: string;
  code: string;
  houseNum: number;
  houseCode: string;
  videoSrc: string;
  posterSrc: string;
  city: Record<SupportedLocale, string>;
  theme: Record<SupportedLocale, string>;
}

const STORY_EXAMPLES: MobileStoryExample[] = [
  {
    id: "zurich",
    code: "ZRH",
    houseNum: 2,
    houseCode: "02",
    videoSrc: "/videos/v3/theo-zurique-v3.mp4",
    posterSrc: "/videos/v3/theo-zurique-v3-poster.jpg",
    city: { pt: "Zurique", es: "Zúrich", en: "Zurich", fr: "Zurich", it: "Zurigo" },
    theme: { pt: "Dinheiro", es: "Dinero", en: "Wealth", fr: "Argent", it: "Denaro" },
  },
  {
    id: "rome",
    code: "FCO",
    houseNum: 5,
    houseCode: "05",
    videoSrc: "/videos/v3/theo-roma-v3.mp4",
    posterSrc: "/videos/v3/theo-roma-v3-poster.jpg",
    city: { pt: "Roma", es: "Roma", en: "Rome", fr: "Rome", it: "Roma" },
    theme: { pt: "Amor", es: "Amor", en: "Love", fr: "Amour", it: "Amore" },
  },
  {
    id: "ny",
    code: "JFK",
    houseNum: 10,
    houseCode: "10",
    videoSrc: "/videos/v3/theo-ny-v3.mp4",
    posterSrc: "/videos/v3/theo-ny-v3-poster.jpg",
    city: { pt: "Nova York", es: "Nueva York", en: "New York", fr: "New York", it: "New York" },
    theme: { pt: "Carreira", es: "Carrera", en: "Career", fr: "Carrière", it: "Carriera" },
  },
];

interface MobileCopy {
  badge: string;
  headlineStart: string;
  headlineHighlight: string;
  subline: string;
  samePersonHint: string;
  ctaFree: string;
  ctaVideo: string;
  ctaNextYear: string;
  sampleLink: string;
  stepLabel: string;
  q1Title: string;
  q1NameLabel: string;
  q1NamePlaceholder: string;
  q1DateLabel: string;
  q2Title: string;
  q2TimeLabel: string;
  q2UnknownTitle: string;
  q2UnknownSub: string;
  q3Title: string;
  q3Placeholder: string;
  q4Title: string;
  q4YearLabel: string;
  q4CityLabel: string;
  q4Placeholder: string;
  nextBtn: string;
  revealBtn: string;
  calculatingBtn: string;
  plansTitle: string;
  plansSub: string;
  oneTime: string;
  popular: string;
  plans: {
    pkg: "1" | "3" | "full";
    featured?: boolean;
    priceInt: string;
    priceDec: string;
    title: string;
    desc: string;
    cta: string;
  }[];
  giftText: string;
  giftLink: string;
  closeLabel: string;
}

const MOBILE_COPY: Record<SupportedLocale, MobileCopy> = {
  pt: {
    badge: "Teste Grátis em 30s",
    headlineStart: "A cidade do seu aniversário ",
    headlineHighlight: "muda o seu ano.",
    subline: "Descubra grátis o que ativou no seu último aniversário e veja se bateu com o que você viveu.",
    samePersonHint: "Exemplo real do Theo (suas cidades mudam):",
    ctaFree: "Fazer meu teste grátis",
    ctaVideo: "Vídeo (1m30)",
    ctaNextYear: "Próximo aniversário",
    sampleLink: "Ver um exemplo pronto agora",
    stepLabel: "Passo",
    q1Title: "Qual seu primeiro nome e data de nascimento?",
    q1NameLabel: "Primeiro nome",
    q1NamePlaceholder: "Ex.: Rafael",
    q1DateLabel: "Data de nascimento",
    q2Title: "Que horas você nasceu?",
    q2TimeLabel: "Horário de nascimento",
    q2UnknownTitle: "Não sei a hora exata",
    q2UnknownSub: "Usar 12:00 como estimativa aproximada",
    q3Title: "Em qual cidade você nasceu?",
    q3Placeholder: "Digite e escolha sua cidade natal...",
    q4Title: "Onde você passou seu último aniversário?",
    q4YearLabel: "Ano",
    q4CityLabel: "Cidade onde você estava",
    q4Placeholder: "Digite e escolha a cidade...",
    nextBtn: "Continuar",
    revealBtn: "Ver meu resultado grátis",
    calculatingBtn: "Calculando...",
    plansTitle: "Onde passar seu próximo aniversário?",
    plansSub: "Pagamento único · Acesso na hora · 8 áreas da vida incluídas",
    oneTime: "único",
    popular: "Mais escolhido",
    plans: [
      {
        pkg: "1",
        priceInt: "19",
        priceDec: "90",
        title: "Testar 1 Cidade",
        desc: "Já tenho 1 cidade em mente para o aniversário (+ guia se não viajar).",
        cta: "Escolher 1 Cidade",
      },
      {
        pkg: "3",
        featured: true,
        priceInt: "49",
        priceDec: "90",
        title: "Comparar 3 Cidades",
        desc: "Compare até 3 destinos diferentes antes de decidir sua viagem.",
        cta: "Comparar 3 Cidades",
      },
      {
        pkg: "full",
        priceInt: "99",
        priceDec: "90",
        title: "Melhores Cidades no Mundo",
        desc: "Descubra seus melhores destinos no Brasil e no mundo nos 12 temas.",
        cta: "Liberar Mapa Completo",
      },
    ],
    giftText: "Ganhou um presente?",
    giftLink: "Resgatar código",
    closeLabel: "Fechar",
  },
  es: {
    badge: "Prueba Gratis en 30s",
    headlineStart: "La ciudad de tu cumpleaños ",
    headlineHighlight: "cambia tu año.",
    subline: "Descubre gratis qué se activó en tu último cumpleaños y compruébalo con lo que viviste.",
    samePersonHint: "Misma persona en su cumpleaños — toca para ver:",
    ctaFree: "Hacer mi prueba gratis",
    ctaVideo: "Video (1m30)",
    ctaNextYear: "Próximo cumpleaños",
    sampleLink: "Ver un ejemplo completo ahora",
    stepLabel: "Paso",
    q1Title: "¿Cuál es tu nombre y fecha de nacimiento?",
    q1NameLabel: "Primer nombre",
    q1NamePlaceholder: "Ej.: Mateo",
    q1DateLabel: "Fecha de nacimiento",
    q2Title: "¿A qué hora naciste?",
    q2TimeLabel: "Hora de nacimiento",
    q2UnknownTitle: "No sé la hora exacta",
    q2UnknownSub: "Usar 12:00 como hora aproximada",
    q3Title: "¿En qué ciudad naciste?",
    q3Placeholder: "Escribe y elige tu ciudad natal...",
    q4Title: "¿Dónde pasaste tu último cumpleaños?",
    q4YearLabel: "Año",
    q4CityLabel: "Ciudad donde estabas",
    q4Placeholder: "Escribe y elige la ciudad...",
    nextBtn: "Continuar",
    revealBtn: "Ver mi resultado gratis",
    calculatingBtn: "Calculando...",
    plansTitle: "¿Dónde pasar tu próximo cumpleaños?",
    plansSub: "Pago único · Acceso inmediato · 8 áreas incluidas",
    oneTime: "único",
    popular: "Más elegido",
    plans: [
      {
        pkg: "1",
        priceInt: "19",
        priceDec: "90",
        title: "Probar 1 Ciudad",
        desc: "Ya tengo 1 destino en mente (+ guía si decides no viajar).",
        cta: "Elegir 1 Ciudad",
      },
      {
        pkg: "3",
        featured: true,
        priceInt: "49",
        priceDec: "90",
        title: "Comparar 3 Ciudades",
        desc: "Compara hasta 3 viajes posibles antes de decidir.",
        cta: "Comparar 3 Ciudades",
      },
      {
        pkg: "full",
        priceInt: "99",
        priceDec: "90",
        title: "Mejores Ciudades del Mundo",
        desc: "Descubre tus mejores destinos globales en los 12 temas del año.",
        cta: "Desbloquear Todo",
      },
    ],
    giftText: "¿Tienes un código?",
    giftLink: "Canjear regalo",
    closeLabel: "Cerrar",
  },
  en: {
    badge: "Free 30-Second Check",
    headlineStart: "Your birthday city ",
    headlineHighlight: "shapes your year.",
    subline: "Check for free what your last birthday activated and see if it matches the year you lived.",
    samePersonHint: "Same person on their birthday — tap to preview:",
    ctaFree: "Start my free check",
    ctaVideo: "Watch (1m30)",
    ctaNextYear: "Next birthday",
    sampleLink: "Preview a sample report now",
    stepLabel: "Step",
    q1Title: "What is your first name and birth date?",
    q1NameLabel: "First name",
    q1NamePlaceholder: "e.g., Alex",
    q1DateLabel: "Birth date",
    q2Title: "What time were you born?",
    q2TimeLabel: "Time of birth",
    q2UnknownTitle: "I don't know the exact time",
    q2UnknownSub: "Use 12:00 noon as an approximate estimate",
    q3Title: "Which city were you born in?",
    q3Placeholder: "Type and select your birth city...",
    q4Title: "Where did you spend your last birthday?",
    q4YearLabel: "Year",
    q4CityLabel: "City on that birthday",
    q4Placeholder: "Type and select the city...",
    nextBtn: "Continue",
    revealBtn: "Reveal my free result",
    calculatingBtn: "Calculating...",
    plansTitle: "Where to spend your next birthday?",
    plansSub: "One-time payment · Instant access · All 8 life areas unlocked",
    oneTime: "one-time",
    popular: "Most popular",
    plans: [
      {
        pkg: "1",
        priceInt: "19",
        priceDec: "90",
        title: "Test 1 City",
        desc: "You already have 1 specific city in mind (+ home city guide).",
        cta: "Choose 1 City",
      },
      {
        pkg: "3",
        featured: true,
        priceInt: "49",
        priceDec: "90",
        title: "Compare 3 Cities",
        desc: "Compare up to 3 possible destinations side by side.",
        cta: "Compare 3 Cities",
      },
      {
        pkg: "full",
        priceInt: "99",
        priceDec: "90",
        title: "Best Cities Worldwide",
        desc: "Unlock your best destinations worldwide across all 12 themes.",
        cta: "Unlock Full Map",
      },
    ],
    giftText: "Have a gift code?",
    giftLink: "Redeem code",
    closeLabel: "Close",
  },
  fr: {
    badge: "Test Gratuit en 30s",
    headlineStart: "La ville de votre anniversaire ",
    headlineHighlight: "change votre année.",
    subline: "Vérifiez gratuitement ce que votre dernier anniversaire a activé dans votre vie.",
    samePersonHint: "Même personne le jour de son anniversaire :",
    ctaFree: "Faire mon test gratuit",
    ctaVideo: "Vidéo (1m30)",
    ctaNextYear: "Prochain anniversaire",
    sampleLink: "Voir un exemple complet",
    stepLabel: "Étape",
    q1Title: "Quel est votre prénom et date de naissance ?",
    q1NameLabel: "Prénom",
    q1NamePlaceholder: "Ex. : Camille",
    q1DateLabel: "Date de naissance",
    q2Title: "À quelle heure êtes-vous né(e) ?",
    q2TimeLabel: "Heure de naissance",
    q2UnknownTitle: "Je ne connais pas l'heure exacte",
    q2UnknownSub: "Utiliser 12h00 à titre indicatif",
    q3Title: "Dans quelle ville êtes-vous né(e) ?",
    q3Placeholder: "Saisissez et choisissez votre ville...",
    q4Title: "Où avez-vous fêté votre dernier anniversaire ?",
    q4YearLabel: "Année",
    q4CityLabel: "Ville ce jour-là",
    q4Placeholder: "Saisissez et choisissez la ville...",
    nextBtn: "Continuer",
    revealBtn: "Voir mon bilan gratuit",
    calculatingBtn: "Calcul...",
    plansTitle: "Où fêter votre prochain anniversaire ?",
    plansSub: "Paiement unique · Accès immédiat · 8 domaines inclus",
    oneTime: "unique",
    popular: "Le plus choisi",
    plans: [
      {
        pkg: "1",
        priceInt: "19",
        priceDec: "90",
        title: "Tester 1 Ville",
        desc: "Vous avez déjà 1 destination précise en tête.",
        cta: "Choisir 1 Ville",
      },
      {
        pkg: "3",
        featured: true,
        priceInt: "49",
        priceDec: "90",
        title: "Comparer 3 Villes",
        desc: "Comparez jusqu'à 3 voyages possibles avant de choisir.",
        cta: "Comparer 3 Villes",
      },
      {
        pkg: "full",
        priceInt: "99",
        priceDec: "90",
        title: "Meilleures Villes du Monde",
        desc: "Découvrez vos meilleures destinations sur les 12 thèmes.",
        cta: "Tout Débloquer",
      },
    ],
    giftText: "Un code cadeau ?",
    giftLink: "Utiliser un code",
    closeLabel: "Fermer",
  },
  it: {
    badge: "Prova Gratuita in 30s",
    headlineStart: "La città del tuo compleanno ",
    headlineHighlight: "cambia il tuo anno.",
    subline: "Scopri gratis cosa ha attivato il tuo ultimo compleanno e confrontalo con ciò che hai vissuto.",
    samePersonHint: "Stessa persona nel giorno del compleanno:",
    ctaFree: "Fai il test gratuito",
    ctaVideo: "Video (1m30)",
    ctaNextYear: "Prossimo compleanno",
    sampleLink: "Guarda un esempio completo",
    stepLabel: "Passo",
    q1Title: "Qual è il tuo nome e data di nascita?",
    q1NameLabel: "Nome",
    q1NamePlaceholder: "Es.: Giulia",
    q1DateLabel: "Data di nascita",
    q2Title: "A che ora sei nato/a?",
    q2TimeLabel: "Ora di nascita",
    q2UnknownTitle: "Non conosco l'ora esatta",
    q2UnknownSub: "Usa le 12:00 come stima indicativa",
    q3Title: "In quale città sei nato/a?",
    q3Placeholder: "Scrivi e scegli la città di nascita...",
    q4Title: "Dove hai festeggiato l'ultimo compleanno?",
    q4YearLabel: "Anno",
    q4CityLabel: "Città in quel giorno",
    q4Placeholder: "Scrivi e scegli la città...",
    nextBtn: "Continua",
    revealBtn: "Vedi il mio risultato gratis",
    calculatingBtn: "Calcolo...",
    plansTitle: "Dove festeggiare il prossimo compleanno?",
    plansSub: "Pagamento unico · Accesso immediato · 8 aree incluse",
    oneTime: "unico",
    popular: "Più scelto",
    plans: [
      {
        pkg: "1",
        priceInt: "19",
        priceDec: "90",
        title: "Prova 1 Città",
        desc: "Hai già 1 meta precisa in mente per il compleanno.",
        cta: "Scegli 1 Città",
      },
      {
        pkg: "3",
        featured: true,
        priceInt: "49",
        priceDec: "90",
        title: "Confronta 3 Città",
        desc: "Confronta fino a 3 possibili viaggi prima di decidere.",
        cta: "Confronta 3 Città",
      },
      {
        pkg: "full",
        priceInt: "99",
        priceDec: "90",
        title: "Migliori Città nel Mondo",
        desc: "Scopri le tue mete ideali nel mondo in tutti i 12 temi.",
        cta: "Sblocca Tutto",
      },
    ],
    giftText: "Hai un codice regalo?",
    giftLink: "Riscatta codice",
    closeLabel: "Chiudi",
  },
};

export function MobileHomeFlow() {
  const navigate = useNavigate();
  const { locale, t } = useI18n();
  const c = MOBILE_COPY[locale] || MOBILE_COPY.pt;

  useEffect(() => {
    prewarmSolarApi();
  }, []);

  // Determine initial mobile view from URL hash (#consulta-gratuita or #planos)
  const [view, setView] = useState<MobileView>(() => {
    if (typeof window === "undefined") return "hook";
    if (window.location.hash === "#consulta-gratuita") return "quiz";
    if (window.location.hash === "#planos") return "plans";
    return "hook";
  });

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#consulta-gratuita") setView("quiz");
      else if (window.location.hash === "#planos") setView("plans");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Story preview chip state on Hook screen
  const [storyIdx, setStoryIdx] = useState(0);
  const activeStory = STORY_EXAMPLES[storyIdx] || STORY_EXAMPLES[0];

  // Full-screen 9:16 Vertical Reels Film Modal
  const [reelOpen, setReelOpen] = useState(false);
  const [reelMuted, setReelMuted] = useState(false);
  const [reelPlaying, setReelPlaying] = useState(true);
  const [reelProgress, setReelProgress] = useState(0);
  const reelVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!reelOpen) return;
    const vid = reelVideoRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    vid.muted = false;
    setReelMuted(false);
    void vid
      .play()
      .then(() => setReelPlaying(true))
      .catch(() => {
        vid.muted = true;
        setReelMuted(true);
        void vid.play().then(() => setReelPlaying(true));
      });
  }, [reelOpen]);

  // 4-Step Quiz state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [firstName, setFirstName] = useState(() => sessionStorage.getItem("ps_natal_name") || "");
  const [birthDate, setBirthDate] = useState(() => sessionStorage.getItem("ps_natal_date") || "");
  const [birthTime, setBirthTime] = useState(() => sessionStorage.getItem("ps_natal_time") || "12:00");
  const [unknownTime, setUnknownTime] = useState(
    () => sessionStorage.getItem("ps_natal_unknown_time") === "1"
  );
  const [birthCity, setBirthCity] = useState(() => sessionStorage.getItem("ps_natal_place") || "");
  const [birthCityValid, setBirthCityValid] = useState(() =>
    Boolean(sessionStorage.getItem("ps_natal_place"))
  );
  const [birthCoords, setBirthCoords] = useState<CityCoords | undefined>(() => {
    const lat = sessionStorage.getItem("ps_natal_lat");
    const lon = sessionStorage.getItem("ps_natal_lon");
    return lat && lon ? { lat: Number(lat), lon: Number(lon) } : undefined;
  });

  const currentYear = new Date().getFullYear();
  const defaultPastYear = useMemo(() => {
    if (birthDate) return getCurrentSolarYear(birthDate);
    return String(currentYear - 1);
  }, [birthDate, currentYear]);

  const [pastYear, setPastYear] = useState<string>(() => defaultPastYear);
  useEffect(() => {
    if (birthDate) setPastYear(getCurrentSolarYear(birthDate));
  }, [birthDate]);

  const [pastCity, setPastCity] = useState("");
  const [pastCityValid, setPastCityValid] = useState(false);
  const [pastCoords, setPastCoords] = useState<CityCoords | undefined>(undefined);
  const [calculating, setCalculating] = useState(false);

  const yearOptions = Array.from({ length: 6 }, (_, i) => String(currentYear - i));

  const openSampleReport = () => {
    const samplePayload: StoredFreePastPayload = {
      userName: firstName.trim() || "Theo",
      birthDate: "1990-08-19",
      birthTime: "14:35",
      birthPlace: "São Paulo, Brasil",
      pastYear: String(currentYear - 1),
      pastCityDisplay: "Roma, Itália",
      pastCityShort: "Roma",
      pastCountry: "Itália",
      pastLat: 41.9028,
      pastLon: 12.4964,
      pastHouse: 5,
      sunSign: "Leão",
      ascendant: "Escorpião",
      returnDate: `19/08/${currentYear - 1}`,
      returnTimeUtc: "18:42 UTC",
      nextYear: String(currentYear),
      nextStayHouse: 4,
      usedApproximateTime: false,
    };
    sessionStorage.setItem(FREE_PAST_STORAGE_KEY, JSON.stringify(samplePayload));
    navigate("/meu-passado");
  };

  const handleSubmitPast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastCity.trim()) {
      toast.error("Informe a cidade onde passou seu aniversário.");
      return;
    }

    setCalculating(true);
    try {
      const payload = await runFreePastAudit({
        firstName,
        birthDate,
        birthTime,
        unknownTime,
        birthCity,
        birthCoords,
        pastYear,
        pastCity,
        pastCoords,
      });
      sessionStorage.setItem(FREE_PAST_STORAGE_KEY, JSON.stringify(payload));
      navigate("/meu-passado");
    } catch (err: any) {
      toast.error(
        err?.message ||
          "Não foi possível calcular agora. Confira as cidades informadas e tente novamente."
      );
    } finally {
      setCalculating(false);
    }
  };

  // Full-screen 9:16 Reels Modal Portal
  const reelOverlay = (
    <AnimatePresence>
      {reelOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[130] bg-black flex flex-col justify-between overflow-hidden"
        >
          <video
            ref={reelVideoRef}
            src="/videos/v3/filme-protocolo-9x16.mp4"
            poster="/videos/v3/filme-protocolo-9x16-v3-poster.jpg"
            playsInline
            onTimeUpdate={(e) => {
              const el = e.currentTarget;
              if (el.duration > 0) setReelProgress((el.currentTime / el.duration) * 100);
            }}
            onEnded={() => setReelPlaying(false)}
            onClick={() => {
              const el = reelVideoRef.current;
              if (!el) return;
              if (el.paused) {
                void el.play();
                setReelPlaying(true);
              } else {
                el.pause();
                setReelPlaying(false);
              }
            }}
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/80" />

          {/* Top Reels Progress + Controls */}
          <div
            className="relative z-10 px-4 pt-3 space-y-3"
            style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 12px)" }}
          >
            <div className="w-full h-1 rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full bg-[#EAB344] transition-all duration-150"
                style={{ width: `${reelProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#F3DC9B]">
                Protocolo Solar
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = reelVideoRef.current;
                    if (!el) return;
                    el.muted = !reelMuted;
                    setReelMuted(!reelMuted);
                  }}
                  aria-label="Áudio"
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
                >
                  {reelMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reelVideoRef.current?.pause();
                    setReelOpen(false);
                  }}
                  aria-label={c.closeLabel}
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {!reelPlaying && (
            <button
              type="button"
              onClick={() => {
                void reelVideoRef.current?.play();
                setReelPlaying(true);
              }}
              aria-label="Play"
              className="relative z-10 mx-auto w-16 h-16 rounded-full bg-[#EAB344] text-[#070A12] flex items-center justify-center shadow-2xl"
            >
              <Play className="w-7 h-7 fill-current ml-0.5" />
            </button>
          )}

          {/* Bottom Reels Thumb CTA */}
          <div
            className="relative z-10 px-5 pb-6"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 24px)" }}
          >
            <button
              type="button"
              onClick={() => {
                reelVideoRef.current?.pause();
                setReelOpen(false);
                setStep(1);
                setView("quiz");
              }}
              className="ps-btn-gold w-full h-14 text-base"
            >
              <Compass className="w-5 h-5 shrink-0" />
              <span>{c.ctaFree}</span>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const activePalette = getHousePalette(activeStory.houseNum);

  return (
    <div className="relative w-full min-h-[calc(100svh-4rem)] bg-[#F4EFE6] text-[#111520] font-sans overflow-x-hidden flex flex-col pb-24">
      <ScanningOverlay visible={calculating} mode="passado" />

      {/* =====================================================================
          VIEW 1: NATIVE TRAVEL-APP HOOK + TACTILE TRAVERTINE BOARDING SHEET
          ===================================================================== */}
      {view === "hook" && (
        <div className="flex flex-col">
          {/* Top Luminous Cinema Window (Curving into Warm Travertine Sheet) */}
          <div className="relative h-[46svh] min-h-[310px] max-h-[410px] w-full overflow-hidden bg-[#060911]">
            <video
              key={activeStory.videoSrc}
              src={activeStory.videoSrc}
              poster={activeStory.posterSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(6,9,17,0.62) 0%, rgba(6,9,17,0.12) 45%, rgba(6,9,17,0.78) 100%)",
              }}
            />

            {/* Bottom-of-Video Route Telemetry + 3 Color-Coded City Switchers (Keeps Theo's face 100% clear!) */}
            <div className="absolute bottom-9 left-4 right-4 z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-white/90 drop-shadow">
                  {c.samePersonHint}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold text-white shadow"
                  style={{ backgroundColor: activePalette.hex }}
                >
                  GRU ✈ {activeStory.code} · C{activeStory.houseCode}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {STORY_EXAMPLES.map((item, idx) => {
                  const isActive = idx === storyIdx;
                  const pal = getHousePalette(item.houseNum);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStoryIdx(idx)}
                      className={`rounded-2xl py-2 px-2.5 text-left backdrop-blur-xl transition-all active:scale-95 border ${
                        isActive
                          ? "bg-white text-[#111520] border-white shadow-lg"
                          : "bg-black/50 border-white/20 text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate">
                          {item.city[locale]}
                        </span>
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: pal.hex }}
                        />
                      </div>
                      <span
                        className="block text-[10px] font-bold truncate mt-0.5"
                        style={{ color: isActive ? pal.lightText : pal.softHex }}
                      >
                        → {item.theme[locale]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Rounded [30px] Warm Travertine Sheet overlapping Video */}
          <div className="relative z-20 -mt-7 rounded-t-[30px] bg-[#F4EFE6] px-5 pt-6 pb-4 shadow-[0_-16px_40px_rgba(0,0,0,0.22)]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111520] text-[#F7D774] text-[10px] font-mono font-bold uppercase tracking-[0.14em] mb-3">
              <Sparkles className="w-3 h-3" />
              <span>{c.badge}</span>
            </div>

            <h1 className="font-display text-[30px] font-bold text-[#111520] leading-[1.08] tracking-[-0.02em]">
              {c.headlineStart}
              <span className="italic text-[#92400E]">{c.headlineHighlight}</span>
            </h1>

            <p className="font-sans text-[14.5px] text-[#111520]/75 leading-relaxed mt-2.5 mb-5">
              {c.subline}
            </p>

            {/* Primary High-Contrast Check-In Button */}
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setView("quiz");
              }}
              className="w-full h-14 rounded-2xl bg-[#111520] text-[#F7D774] font-bold text-[15px] shadow-[0_14px_30px_rgba(17,21,32,0.22)] inline-flex items-center justify-center gap-2.5 active:scale-[0.985] transition-transform"
            >
              <Compass className="w-5 h-5 shrink-0" />
              <span>{c.ctaFree}</span>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </button>

            {/* Dual Tactile Pills: Film 1m30 + Plans */}
            <div className="grid grid-cols-2 gap-2.5 mt-3">
              <button
                type="button"
                onClick={() => setReelOpen(true)}
                className="h-12 rounded-2xl bg-[#FFFDF9] border border-[#111520]/14 text-xs font-bold text-[#111520] inline-flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm"
              >
                <span className="w-6 h-6 rounded-full bg-[#F7D774] flex items-center justify-center">
                  <Play className="w-3 h-3 text-[#111520] fill-[#111520] ml-0.5" />
                </span>
                <span className="truncate">{c.ctaVideo}</span>
              </button>

              <button
                type="button"
                onClick={() => setView("plans")}
                className="h-12 rounded-2xl bg-[#FFFDF9] border border-[#111520]/14 text-xs font-bold text-[#111520] inline-flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm"
              >
                <Plane className="w-4 h-4 text-[#065F46] shrink-0" />
                <span className="truncate">{c.ctaNextYear}</span>
              </button>
            </div>

            {/* 12-House Chromatic Horizontal Carousel (Snap Scroll, Zero Fixed Cities!) */}
            <div className="mt-8 pt-6 border-t border-[#111520]/10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#92400E]">
                    AS 12 ÁREAS DO ANO
                  </p>
                  <h2 className="font-display text-xl font-bold text-[#111520]">
                    Qual tema você quer destravar?
                  </h2>
                </div>
                <Link
                  to="/casas"
                  className="text-xs font-bold text-[#111520] underline shrink-0"
                >
                  Ver todas →
                </Link>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
                {HOUSES_SHOWCASE.map((house) => {
                  const pal = getHousePalette(house.id);
                  const copy = t.houses[house.id];
                  const padded = String(house.id).padStart(2, "0");
                  return (
                    <Link
                      key={house.id}
                      to={`/casas/${house.id}`}
                      className="snap-start shrink-0 w-[220px] rounded-2xl bg-[#FFFDF9] border border-[#111520]/12 overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
                    >
                      <div className="h-1.5 w-full" style={{ backgroundColor: pal.hex }} />
                      <div className="relative aspect-[16/10] bg-[#060911]">
                        <img
                          src={`/videos/v3/casa-${padded}-lux-poster.jpg`}
                          alt={`Casa ${house.numberLabel}`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <span
                          className="absolute top-2 left-2 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold text-white shadow"
                          style={{ backgroundColor: pal.hex }}
                        >
                          CASA {house.numberLabel}
                        </span>
                      </div>
                      <div className="p-3.5">
                        <p
                          className="font-mono text-[10px] font-bold uppercase tracking-[0.1em]"
                          style={{ color: pal.lightText }}
                        >
                          {copy.shortTag}
                        </p>
                        <h3 className="font-display text-base font-bold text-[#111520] leading-snug mt-0.5 line-clamp-1">
                          {copy.title}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 2: WARM TRAVERTINE 4-STEP CHECK-IN WIZARD (Keyboard Safe!)
          ===================================================================== */}
      {view === "quiz" && (
        <div className="flex-1 pt-16 pb-8 px-5 flex flex-col">
          <div className="pt-2 pb-5">
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => {
                  if (step > 1) setStep((step - 1) as 1 | 2 | 3 | 4);
                  else setView("hook");
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111520] py-1"
              >
                <ArrowLeft className="w-4 h-4 text-[#92400E]" />
                <span>{t.nav.back}</span>
              </button>

              <span className="font-mono text-xs font-bold text-[#92400E]">
                {c.stepLabel} {step}/4
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-colors ${
                    idx <= step ? "bg-[#111520]" : "bg-[#111520]/15"
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmitPast} className="space-y-5">
            {step === 1 && (
              <div className="rounded-3xl bg-[#FFFDF9] border border-[#111520]/12 p-5 space-y-4 shadow-md">
                <h2 className="font-display text-2xl font-bold text-[#111520] leading-tight">
                  {c.q1Title}
                </h2>

                <div>
                  <label className="block text-xs font-bold text-[#111520]/75 mb-1.5">
                    {c.q1NameLabel}
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={c.q1NamePlaceholder}
                    autoComplete="given-name"
                    className="w-full h-12 rounded-xl bg-white border border-[#111520]/15 px-4 text-base text-[#111520] placeholder:text-[#111520]/35 focus:outline-none focus:border-[#B8861E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111520]/75 mb-1.5">
                    {c.q1DateLabel}
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={`${currentYear - 1}-12-31`}
                    className="w-full h-12 rounded-xl bg-white border border-[#111520]/15 px-4 text-base text-[#111520] focus:outline-none focus:border-[#B8861E] [color-scheme:light]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!firstName.trim()) {
                      toast.error("Digite seu primeiro nome.");
                      return;
                    }
                    if (!birthDate) {
                      toast.error("Escolha sua data de nascimento.");
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full h-13 py-3.5 rounded-xl bg-[#111520] text-[#F7D774] font-bold text-[15px] inline-flex items-center justify-center gap-2"
                >
                  <span>{c.nextBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={openSampleReport}
                    className="text-xs font-bold text-[#92400E] underline underline-offset-4"
                  >
                    {c.sampleLink}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-3xl bg-[#FFFDF9] border border-[#111520]/12 p-5 space-y-4 shadow-md">
                <h2 className="font-display text-2xl font-bold text-[#111520] leading-tight">
                  {c.q2Title}
                </h2>

                <div>
                  <label className="block text-xs font-bold text-[#111520]/75 mb-1.5">
                    {c.q2TimeLabel}
                  </label>
                  <input
                    type="time"
                    value={unknownTime ? "12:00" : birthTime}
                    disabled={unknownTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full h-12 rounded-xl bg-white border border-[#111520]/15 px-4 text-base text-[#111520] disabled:opacity-45 focus:outline-none focus:border-[#B8861E] [color-scheme:light]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = !unknownTime;
                    setUnknownTime(next);
                    if (next) setBirthTime("12:00");
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    unknownTime
                      ? "bg-[#111520] border-[#111520] text-white"
                      : "bg-[#F4EFE6] border-[#111520]/12 text-[#111520]"
                  }`}
                >
                  <div>
                    <span className="block text-sm font-bold">{c.q2UnknownTitle}</span>
                    <span
                      className={`block text-xs mt-0.5 ${
                        unknownTime ? "text-white/75" : "text-[#111520]/65"
                      }`}
                    >
                      {c.q2UnknownSub}
                    </span>
                  </div>
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 ${
                      unknownTime ? "text-[#F7D774]" : "text-[#111520]/30"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full py-3.5 rounded-xl bg-[#111520] text-[#F7D774] font-bold text-[15px] inline-flex items-center justify-center gap-2"
                >
                  <span>{c.nextBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="rounded-3xl bg-[#FFFDF9] border border-[#111520]/12 p-5 space-y-4 shadow-md">
                <h2 className="font-display text-2xl font-bold text-[#111520] leading-tight">
                  {c.q3Title}
                </h2>

                <div className="h-12">
                  <CityAutocomplete
                    variant="light"
                    value={birthCity}
                    onChange={(val, valid, coords) => {
                      setBirthCity(val);
                      setBirthCityValid(valid);
                      if (coords) setBirthCoords(coords);
                    }}
                    placeholder={c.q3Placeholder}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!birthCity.trim() || (!birthCityValid && birthCity.trim().length < 3)) {
                      toast.error("Escolha sua cidade natal na lista.");
                      return;
                    }
                    setStep(4);
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#111520] text-[#F7D774] font-bold text-[15px] inline-flex items-center justify-center gap-2"
                >
                  <span>{c.nextBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="rounded-3xl bg-[#FFFDF9] border border-[#111520]/12 p-5 space-y-4 shadow-md">
                <h2 className="font-display text-2xl font-bold text-[#111520] leading-tight">
                  {c.q4Title}
                </h2>

                <div>
                  <label className="block text-xs font-bold text-[#111520]/75 mb-1.5">
                    {c.q4YearLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {yearOptions.map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setPastYear(yr)}
                        className={`h-10 rounded-xl font-mono text-xs font-bold border transition-all ${
                          pastYear === yr
                            ? "bg-[#111520] border-[#111520] text-[#F7D774]"
                            : "bg-white border-[#111520]/15 text-[#111520]"
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111520]/75 mb-1.5">
                    {c.q4CityLabel}
                  </label>
                  <div className="h-12">
                    <CityAutocomplete
                      variant="light"
                      value={pastCity}
                      onChange={(val, valid, coords) => {
                        setPastCity(val);
                        setPastCityValid(valid);
                        if (coords) setPastCoords(coords);
                      }}
                      placeholder={c.q4Placeholder}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={calculating || pastCity.trim().length < 2}
                  className="w-full h-14 rounded-xl bg-gradient-to-b from-[#F7D774] to-[#E5A935] text-[#080B12] font-bold text-[15px] shadow-lg inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{calculating ? c.calculatingBtn : c.revealBtn}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* =====================================================================
          VIEW 3: PERFORATED MOBILE PASS TICKETS (Zero Wall of Text!)
          ===================================================================== */}
      {view === "plans" && (
        <div className="flex-1 pt-16 pb-12 px-5 flex flex-col">
          <div className="pt-2 pb-4">
            <button
              type="button"
              onClick={() => setView("hook")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111520] py-1"
            >
              <ArrowLeft className="w-4 h-4 text-[#92400E]" />
              <span>{t.nav.back}</span>
            </button>

            <h2 className="font-display text-2xl font-bold text-[#111520] mt-2 leading-tight">
              {c.plansTitle}
            </h2>
            <p className="text-xs text-[#111520]/70 mt-1">{c.plansSub}</p>
          </div>

          <div className="space-y-3.5">
            {c.plans.map((plan) => {
              const stubColor =
                plan.pkg === "1" ? "#10B981" : plan.pkg === "3" ? "#EAB344" : "#8B5CF6";
              return (
                <div
                  key={plan.pkg}
                  className={`relative rounded-3xl overflow-hidden border ${
                    plan.featured
                      ? "bg-[#111520] text-white border-2 border-[#EAB344] shadow-xl"
                      : "bg-[#FFFDF9] text-[#111520] border-[#111520]/14 shadow-sm"
                  }`}
                >
                  <div
                    className="px-4 py-2 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{
                      backgroundColor: stubColor,
                      color: plan.featured ? "#111520" : "#FFFFFF",
                    }}
                  >
                    <span>
                      PASS · {plan.pkg === "full" ? "12 CASAS" : `0${plan.pkg}`}
                    </span>
                    {plan.featured && <span>★ {c.popular}</span>}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display text-lg font-bold leading-snug">
                        {plan.title}
                      </h3>
                      <div className="text-right shrink-0">
                        <div className="flex items-baseline justify-end gap-0.5">
                          <span className="text-xs font-bold opacity-75">R$</span>
                          <span className="font-display text-3xl font-bold tabular-nums leading-none">
                            {plan.priceInt}
                          </span>
                          <span className="text-xs font-bold opacity-75">,{plan.priceDec}</span>
                        </div>
                        <span className="block text-[10px] opacity-65">{c.oneTime}</span>
                      </div>
                    </div>

                    <p
                      className={`text-xs leading-relaxed mb-3.5 ${
                        plan.featured ? "text-white/80" : "text-[#111520]/70"
                      }`}
                    >
                      {plan.desc}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/credits?pkg=${plan.pkg}&returnTo=${encodeURIComponent("/?mode=futuro")}`
                        )
                      }
                      className={`w-full h-11 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-2 ${
                        plan.featured
                          ? "bg-[#F7D774] text-[#111520]"
                          : "bg-[#111520] text-white"
                      }`}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-[#111520]/12 flex items-center justify-center gap-2 text-xs text-[#111520]/75">
            <Gift className="w-4 h-4 text-[#92400E]" />
            <span>{c.giftText}</span>
            <Link
              to="/resgatar"
              className="font-bold text-[#111520] underline underline-offset-4"
            >
              {c.giftLink}
            </Link>
          </div>
        </div>
      )}

      {typeof document !== "undefined" ? createPortal(reelOverlay, document.body) : null}
    </div>
  );
}
