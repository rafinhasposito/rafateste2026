import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { OrbitSky } from "./OrbitSky";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const fade = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};
const chapters = ["O Universo", "As 12 Casas", "Casa em destaque"];
const stops = [0, 0.70, 1];

function HouseWheel({ progress }: { progress: number }) {
  const visible = fade(0.40, 0.61, progress);
  const focus = fade(0.73, 0.94, progress);
  const angle = Math.PI / 6;
  const start = Math.PI / 2;
  const point = (radius: number, a: number) => `${Math.cos(a) * radius},${Math.sin(a) * radius}`;
  const sector = `M ${point(155, start)} L ${point(224, start)} A 224 224 0 0 1 ${point(224, start + angle)} L ${point(155, start + angle)} A 155 155 0 0 0 ${point(155, start)} Z`;

  return (
    <svg className="solar-house-wheel" viewBox="-250 -250 500 500" style={{ opacity: visible }} aria-hidden="true">
      <defs>
        <radialGradient id="solar-house-light"><stop stopColor="#eacb84" stopOpacity=".14" /><stop offset="1" stopColor="#eacb84" stopOpacity="0" /></radialGradient>
      </defs>
      <circle r="152" fill="url(#solar-house-light)" opacity={focus} />
      <circle r="224" fill="none" stroke="#b9d9ed" strokeOpacity=".25" strokeWidth=".6" />
      <circle r="155" fill="none" stroke="#b9d9ed" strokeOpacity=".22" strokeWidth=".6" />
      <path d={sector} fill="#dcb662" fillOpacity={focus * .17} stroke="#f3d38c" strokeOpacity={focus * .9} strokeWidth="1.2" />
      {Array.from({ length: 12 }, (_, index) => {
        const a = index * angle - Math.PI / 2;
        const middle = a + angle / 2;
        return (
          <g key={index} opacity={index === 6 ? 1 : 1 - focus * .55}>
            <line x1={Math.cos(a) * 155} y1={Math.sin(a) * 155} x2={Math.cos(a) * 224} y2={Math.sin(a) * 224} stroke="#c4dce9" strokeOpacity=".3" strokeWidth=".6" />
            <text x={Math.cos(middle) * 190} y={Math.sin(middle) * 190} textAnchor="middle" dominantBaseline="central" fill={index === 6 && focus > .4 ? "#ffe2a0" : "#dbe5ed"} fontSize="18" fontFamily="PS Marcellus, serif">{index + 1}</text>
          </g>
        );
      })}
      <g opacity={1 - fade(.73, .82, progress)} fill="#e9edf3" textAnchor="middle">
        <text y="5" fontSize="64" fontFamily="PS Marcellus, serif">12</text>
        <text y="38" fontSize="11" letterSpacing="4">CASAS</text>
      </g>
      <g opacity={fade(.84, .94, progress)} textAnchor="middle" fill="#f3d38c">
        <text y="-17" fontSize="11" letterSpacing="4">EM DESTAQUE</text>
        <text y="34" fontSize="43" fontFamily="PS Marcellus, serif">Casa 7</text>
        <text y="63" fontSize="9" letterSpacing="2.5">ENCONTROS E PARCERIAS</text>
      </g>
    </svg>
  );
}

export function UniverseJourney({ playing, reduced, onComplete }: { playing: boolean; reduced: boolean; onComplete: () => void }) {
  const section = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const chapter = progress < .38 ? 0 : progress < .82 ? 1 : 2;

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const element = section.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const viewport = element.firstElementChild?.clientHeight || window.innerHeight;
      setProgress(clamp(-rect.top / Math.max(1, rect.height - viewport)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    if (section.current) observer.observe(section.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const goTo = useCallback((next: number) => {
    const element = section.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const viewport = element.firstElementChild?.clientHeight || window.innerHeight;
    window.scrollTo({ top: window.scrollY + rect.top + stops[next] * (rect.height - viewport), behavior: reduced ? "instant" : "smooth" });
  }, [reduced]);

  const visualProgress = reduced ? stops[chapter] : progress;
  const opacity = [1 - fade(.08, .28, visualProgress), fade(.37, .55, visualProgress) * (1 - fade(.71, .80, visualProgress)), fade(.84, .96, visualProgress)];

  return (
    <section ref={section} className="solar-universe" aria-label="Do Universo às 12 Casas">
      <div className="solar-universe-frame">
        <OrbitSky playing={playing} progress={visualProgress} />
        <HouseWheel progress={visualProgress} />
        <div className="solar-universe-copy">
          <div className="solar-universe-chapter" style={{ opacity: opacity[0], transform: `translateY(${-32 * (1 - opacity[0])}px)` }} aria-hidden={chapter !== 0}>
            <p className="solar-label">Tecnologia & Precisão Astronômica</p>
            <h1>O Universo mapeado<br />para você.</h1>
            <p>Cruzamos a exatidão do seu nascimento com a rotação dos astros em milissegundos.</p>
          </div>
          <div className="solar-universe-chapter" style={{ opacity: opacity[1], transform: `translateY(${24 * (1 - opacity[1])}px)` }} aria-hidden={chapter !== 1}>
            <p className="solar-label">Seu mapa, área por área</p>
            <h2>12 Casas.<br />12 áreas da<br className="solar-desktop-break" /> sua vida.</h2>
            <p>Amor, carreira, dinheiro e novos caminhos. Cada Casa coloca uma área da vida em destaque.</p>
          </div>
          <div className="solar-universe-chapter" style={{ opacity: opacity[2], transform: `translateY(${24 * (1 - opacity[2])}px)` }} aria-hidden={chapter !== 2}>
            <p className="solar-label">No exemplo de Ana · Roma</p>
            <h2>Muda a Casa.<br /><em>Muda o foco.</em></h2>
            <p>A Casa 7 coloca encontros e parcerias em destaque. Veja como essa leitura aparece na prévia do destino.</p>
            <span className="solar-illustration-note">Exemplo ilustrativo · seu mapa será calculado com seus dados.</span>
          </div>
        </div>
        <div className="solar-scroll-cue" style={{ opacity: 1 - fade(0, .12, progress) }} aria-hidden="true"><span>ROLE PARA DESCOBRIR</span><ArrowDown size={15} /></div>
        <footer className="solar-universe-nav">
          <nav className="solar-chapters" aria-label="Momentos da animação">
            {chapters.map((label, index) => <button key={label} aria-current={chapter === index ? "step" : undefined} onClick={() => goTo(index)} aria-label={`${index + 1}. ${label}`}><span className="solar-chapter-line" /><span className="solar-chapter-label">{String(index + 1).padStart(2, "0")} <b>{label}</b></span></button>)}
          </nav>
          <button className="solar-primary" onClick={() => chapter < 2 ? goTo(chapter + 1) : onComplete()}>{chapter === 0 ? "EXPLORAR AS CASAS" : chapter === 1 ? "VER CASA EM DESTAQUE" : "VER A PRÉVIA EM ROMA"}<ArrowRight size={17} /></button>
        </footer>
        <p className="solar-sr-only" aria-live="polite">{chapters[chapter]}</p>
      </div>
    </section>
  );
}
