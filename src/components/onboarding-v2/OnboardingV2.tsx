import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Pause, Play, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Screen1 } from "@/components/mobile/onboarding/screens/Screen1";
import { Screen6 } from "@/components/mobile/onboarding/screens/Screen6";
import { PriorityScreen } from "./PriorityScreen";
import { cities } from "./example";
import { OrbitSky } from "./OrbitSky";
import { MapLesson } from "./MapLesson";
import "./onboarding.css";

const paths = [
  {
    id: "cidade",
    title: "Por Cidade",
    hook: "Já sei para onde quero viajar.",
    description: "Descubra exatamente como essa coordenada vai ativar novos acontecimentos e transformar seu novo ciclo.",
    image: "paris",
  },
  {
    id: "casa",
    title: "Por Casa Astrológica",
    hook: "Quero virar a chave em uma área.",
    description: "Destrave finanças, carreira ou amor. Escolha a mudança que você precisa e encontre os destinos ideais.",
    image: "stars",
  },
  {
    id: "intencao",
    title: "Por Intenção",
    hook: "Sei o resultado que quero alcançar.",
    description: "Escolha o que quer viver neste ano e descubra os destinos ligados ao seu objetivo.",
    image: "particles",
  },
];

function Film({ file, poster }: { file: string; poster: string }) {
  return (
    <video autoPlay muted playsInline loop preload="metadata" poster={poster} aria-hidden="true">
      <source src={file} type="video/mp4" />
    </video>
  );
}

export default function OnboardingV2() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [paused, setPaused] = useState(false);
  const playing = !reduced && !paused;
  const [step, setStep] = useState(() => {
    const requestedStep = Number(params.get("tela"));
    return Number.isInteger(requestedStep) && requestedStep >= 1 && requestedStep <= 6 ? requestedStep : 1;
  });
  const [path, setPath] = useState("intencao");
  const [lesson, setLesson] = useState(false);
  const root = useRef<HTMLElement>(null);
  const playingRef = useRef(playing);
  playingRef.current = playing && !(step === 2 && lesson);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const sync = () => {
      container.querySelectorAll("video").forEach(video => {
        if (playingRef.current && !document.hidden) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    };
    const stopAutoplay = (event: Event) => {
      if (!playingRef.current || document.hidden) (event.target as HTMLVideoElement).pause();
    };
    sync();
    container.addEventListener("play", stopAutoplay, true);
    document.addEventListener("visibilitychange", sync);
    return () => {
      container.removeEventListener("play", stopAutoplay, true);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [step, playing, lesson]);

  const advance = () => {
    if (step < 6) {
      setStep(step + 1);
      return;
    }
    localStorage.setItem("ps_onboarding_completed", "true");
    if (user) {
      navigate(`/?mode=futuro&path=${path}`);
    } else {
      sessionStorage.setItem("ps_pending_mode", "futuro");
      sessionStorage.setItem("ps_onboarding_v2_path", path);
      navigate("/auth?setup=true");
    }
  };

  return (
    <main ref={root} className={`solar-v2 solar-step-${step} ${playing ? "" : "solar-still"}`}>
      <header className="solar-top">
        {step === 1 ? (
          <img className="solar-brand" src="/brand/protocolo-solar-logo-horizontal-4096.png" alt="Protocolo Solar" />
        ) : (
          <button className="solar-round" onClick={() => setStep(step - 1)} aria-label="Voltar"><ArrowLeft size={19} /></button>
        )}
        <div className="solar-top-actions">
          <span className="solar-counter" aria-live="polite">{step} de 6</span>
          {!reduced && (
            <button className="solar-round" aria-label={paused ? "Ativar movimento" : "Pausar movimento"} onClick={() => setPaused(!paused)}>
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          )}
          <button className="solar-round" aria-label="Sair da prévia" onClick={() => navigate("/")}><X size={17} /></button>
        </div>
      </header>

      {step === 1 && <div className="solar-original solar-opening"><Screen1 /></div>}

      {step === 2 && (
        <section className="solar-stage">
          <div className="solar-heading">
            <p className="solar-label">A geografia recalcula o seu destino</p>
            <h1>Mesmo dia. Mesma pessoa.</h1>
            <p className="solar-lead">Ana vai fazer aniversário. Veja como a Casa em destaque muda em cada cidade.</p>
            <button className="solar-link" aria-expanded={lesson} onClick={() => setLesson(!lesson)}>
              <Play size={15} /> Ver o exemplo de Ana
            </button>
          </div>
          {lesson && <MapLesson motion={playing} close={() => setLesson(false)} />}
          <div className="solar-cards">
            {cities.map(city => (
              <article className="solar-card" key={city.name}>
                <Film file={`/assets/${city.cover}.mp4`} poster={`/images/abertura/${city.cover}.jpg`} />
                <span className="solar-city-label">{city.name}</span>
                <div className="solar-card-copy">
                  <p className="solar-label">Ativação da Casa {city.house}</p>
                  <h2>{city.topic}</h2>
                  <p>{city.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {step === 3 && <div className="solar-original"><PriorityScreen /></div>}

      {step === 4 && (
        <section className="solar-stage">
          <div className="solar-heading">
            <h1>Como você quer transformar seu ano?</h1>
            <p className="solar-label">Três caminhos para mudar a sua realidade.</p>
          </div>
          <div className="solar-cards">
            {paths.map((item, index) => (
              <button key={item.id} className="solar-card solar-path" aria-pressed={path === item.id} onClick={() => setPath(item.id)}>
                <Film file={`/assets/${item.image}.mp4`} poster={`/images/abertura/${item.image}.jpg`} />
                <span className="solar-card-index">{String(index + 1).padStart(2, "0")}</span>
                {path === item.id && <span className="solar-selected"><Check size={18} /></span>}
                <div className="solar-card-copy">
                  <h2>{item.title}</h2>
                  <p className="solar-hook">“{item.hook}”</p>
                  <p>{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 5 && (
        <section className="solar-universe">
          <OrbitSky playing={playing} />
          <div className="solar-universe-copy">
            <p className="solar-label">Tecnologia & Precisão Astronômica</p>
            <h1>O Universo mapeado<br />para você.</h1>
            <p>Cruzamos a exatidão do seu nascimento com a rotação dos astros em milissegundos.</p>
          </div>
        </section>
      )}

      {step === 6 && <div className="solar-original solar-finish"><Screen6 onComplete={advance} /></div>}

      <footer className={`solar-nav ${step === 6 ? "solar-final-nav" : ""}`}>
        <button className="solar-primary" onClick={advance}>
          {step === 6 ? "REVELAR MEU DESTINO" : "CONTINUAR"} <ArrowRight size={17} />
        </button>
      </footer>
    </main>
  );
}
