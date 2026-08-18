import React, { useState, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sun, Compass, Hourglass, Star, MapPin } from "lucide-react";

// ─── DESIGN SYSTEM & PALETA OFICIAL ──────────────────────────────────────────
const BG = "#030306";
const GOLD = "#D4AF37";
const TITLE_COLOR = "#F4F1EA";
const BODY_COLOR = "#A5A7B3";

// ─── CONTRATO DAS 6 TELAS OFICIAIS ───────────────────────────────────────────
const SCREENS = [
  {
    step: 1,
    counter: "1/6",
    title: ["O CÉU SE MOVE.", "E VOCÊ TAMBÉM."],
    goldLine: 1,
    subtitle: "A Astrologia de Relocalização mostra como os planetas ativam diferentes áreas da sua vida em cada lugar do mundo.",
    bgType: "orbital",
  },
  {
    step: 2,
    counter: "2/6",
    title: ["CADA LUGAR", "ATIVA UMA ENERGIA."],
    goldLine: 1,
    subtitle: "Seu mapa muda conforme o lugar onde você está ou escolhe estar. E isso muda tudo.",
    bgType: "globe",
  },
  {
    step: 3,
    counter: "3/6",
    title: ["SEU MAPA. QUALQUER LUGAR.", "QUALQUER POSSIBILIDADE."],
    goldLine: 1,
    subtitle: "Calculamos sua Revolução Solar para o lugar e a data que você escolher e revelamos como será seu próximo ciclo.",
    bgType: "infographic",
  },
  {
    step: 4,
    counter: "4/6",
    title: ["MESMO CÉU.", "ENERGIAS DIFERENTES."],
    goldLine: 1,
    subtitle: "São Paulo ou Nova York?\nSeu mapa mostra como cada lugar ativa áreas diferentes da sua vida.",
    bgType: "pins",
  },
  {
    step: 5,
    counter: "5/6",
    title: ["PASSADO, PRESENTE,", "FUTURO."],
    goldLine: 1,
    subtitle: "Entenda o que já viveu,\no que está vivendo agora\ne o que pode criar a seguir.",
    bgType: "timeline",
  },
  {
    step: 6,
    counter: "6/6",
    title: ["AGORA É", "SOBRE VOCÊ."],
    goldLine: 1,
    subtitle: "Use seus dados de nascimento para calcular sua Revolução Solar e explorar diferentes possibilidades pelo mundo.",
    bgType: "cta",
  }
];

// ─── COMPONENTE DO LOGO TOPO ──────────────────────────────────────────────────
const HeaderLogo = ({ counter }: { counter: string }) => (
  <div className="relative w-full pt-8 pb-3 px-6 flex flex-col items-center justify-center shrink-0 z-20">
    {/* Contador no canto superior direito */}
    <div className="absolute right-6 top-8 text-[15px] font-medium tracking-wider text-[#F4F1EA]">
      {counter}
    </div>

    {/* Ícone Bússola Dourada */}
    <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center mb-2.5 bg-[#030306]/80 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#D4AF37" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="6" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
        <polygon points="12,4 14.5,12 12,10.5 9.5,12" fill="#D4AF37" />
        <polygon points="12,20 9.5,12 12,13.5 14.5,12" fill="#D4AF37" opacity="0.5" />
        <circle cx="12" cy="12" r="1.5" fill="#D4AF37" />
      </svg>
    </div>

    {/* Textos da Marca */}
    <span className="text-[10px] font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
      PROTOCOLO SOLAR
    </span>
    <span className="text-[8px] font-medium tracking-[0.2em] text-[#D4AF37]/80 uppercase mt-0.5">
      ASTROLOGIA DE RELOCALIZAÇÃO
    </span>
  </div>
);

// ─── BLOCO EDITORIAL (TÍTULO + DIVISOR + SUBTÍTULO) ───────────────────────────
const EditorialBlock = ({ title, subtitle, goldLine }: { title: string[]; subtitle: string; goldLine: number }) => (
  <div className="w-full px-6 flex flex-col items-center text-center shrink-0 z-20 mt-1">
    <h1
      className="text-center font-normal leading-[1.25] tracking-[0.02em] text-[#F4F1EA]"
      style={{
        fontFamily: "'Cinzel', Georgia, serif",
        fontSize: "clamp(22px, 5.8vw, 30px)",
      }}
    >
      {title[0]}
      {title[1] && (
        <>
          <br />
          <span style={{ color: goldLine === 1 ? GOLD : TITLE_COLOR }}>{title[1]}</span>
        </>
      )}
    </h1>

    {/* Divisor Dourado elegante com ponto central */}
    <div className="flex items-center justify-center gap-2 my-3.5">
      <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
      <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
    </div>

    {/* Subtítulo em Inter */}
    <p
      className="text-center font-light leading-[1.6] text-[#A5A7B3] whitespace-pre-line"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "clamp(13px, 3.4vw, 15px)",
        maxWidth: "90%",
      }}
    >
      {subtitle}
    </p>
  </div>
);

// ─── ELEMENTO VISUAL CENTRAL: TELA 3 (INFOGRÁFICO ORBITAL) ────────────────────
const VisualInfographic = () => {
  const nodes = [
    { title: "PLANETAS", angle: -45 },
    { title: "NOVOS CENÁRIOS", angle: 45 },
    { title: "ESCOLHAS", angle: 135 },
    { title: "CONEXÕES", angle: 225 },
  ];

  return (
    <div className="w-full flex-1 flex items-center justify-center relative py-4 z-10">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Órbitas concêntricas sutis */}
        <div className="absolute w-56 h-56 rounded-full border border-[#D4AF37]/20" />
        <div className="absolute w-40 h-40 rounded-full border border-[#D4AF37]/30" />
        <div className="absolute w-24 h-24 rounded-full border border-[#D4AF37]/40" />

        {/* Sol Central Brilhante */}
        <div className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF3C4] shadow-[0_0_35px_rgba(212,175,55,0.8)] flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-white/40 blur-[1px]" />
        </div>

        {/* 4 Nós Orbitais */}
        {nodes.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const r = 98;
          const x = Math.cos(rad) * r;
          const y = Math.sin(rad) * r;
          return (
            <div
              key={i}
              className="absolute flex flex-col items-center text-center"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/60 bg-[#030306]/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.3)] mb-1.5">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              </div>
              <span className="text-[8.5px] font-semibold tracking-[0.15em] text-[#D4AF37] uppercase whitespace-nowrap">
                {node.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── ELEMENTO VISUAL CENTRAL: TELA 4 (PINS SÃO PAULO & NOVA YORK) ─────────────
const VisualPins = () => (
  <div className="w-full flex-1 flex flex-col justify-end relative z-10 pb-0">
    {/* Pins e Linhas Conectadas */}
    <div className="w-full flex justify-around px-8 items-end relative z-20 mb-[-15px]">
      {/* São Paulo */}
      <div className="flex flex-col items-center">
        <span className="text-[11px] font-bold tracking-[0.18em] text-[#D4AF37] uppercase mb-1.5" style={{ fontFamily: "'Cinzel', serif" }}>
          SÃO PAULO
        </span>
        <div className="text-[#D4AF37] mb-1">
          <svg width="22" height="28" viewBox="0 0 24 30" fill="none">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 18 12 18s12-9 12-18c0-6.63-5.37-12-12-12z" fill="#D4AF37" />
            <circle cx="12" cy="11" r="4.5" fill="#030306" />
          </svg>
        </div>
        <div className="w-[1.5px] h-28 bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/60 to-transparent" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] -mt-1" />
      </div>

      {/* Nova York */}
      <div className="flex flex-col items-center">
        <span className="text-[11px] font-bold tracking-[0.18em] text-[#7EB8FF] uppercase mb-1.5" style={{ fontFamily: "'Cinzel', serif" }}>
          NOVA YORK
        </span>
        <div className="text-[#7EB8FF] mb-1">
          <svg width="22" height="28" viewBox="0 0 24 30" fill="none">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 18 12 18s12-9 12-18c0-6.63-5.37-12-12-12z" fill="#7EB8FF" />
            <circle cx="12" cy="11" r="4.5" fill="#030306" />
          </svg>
        </div>
        <div className="w-[1.5px] h-28 bg-gradient-to-b from-[#7EB8FF] via-[#7EB8FF]/60 to-transparent" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#7EB8FF] shadow-[0_0_10px_#7EB8FF] -mt-1" />
      </div>
    </div>

    {/* Imagem da Terra no Rodapé da Tela 4 */}
    <div
      className="w-full h-48 bg-cover bg-center shrink-0 relative"
      style={{
        backgroundImage: "url('/earth-orbital-hires.jpg')",
        maskImage: "linear-gradient(to top, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
      }}
    />
  </div>
);

// ─── ELEMENTO VISUAL CENTRAL: TELA 5 (TIMELINE PASSADO / PRESENTE / FUTURO) ───
const VisualTimeline = () => {
  const nodes = [
    {
      title: "PASSADO",
      sub: "o que te trouxe\naté aqui",
      color: "#9B72CF",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9B72CF" strokeWidth="1.5">
          <path d="M6 2h12M6 22h12M6 2c0 6 6 8 6 10S6 16 6 22M18 2c0 6-6 8-6 10s6 4 6 10" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "PRESENTE",
      sub: "o ciclo que\nvocê vive agora",
      color: "#D4AF37",
      icon: (
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#D4AF37]/50" />
          <div className="w-4 h-4 rounded-full bg-[#D4AF37] shadow-[0_0_15px_#D4AF37]" />
        </div>
      ),
    },
    {
      title: "FUTURO",
      sub: "o que está ao\nseu alcance",
      color: "#E07B5A",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E07B5A" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18M6 6l12 12M6 18L18 6" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full flex-1 flex items-center justify-center px-4 relative z-10 py-6">
      {/* Linha horizontal contínua passando pelo centro dos 3 nós */}
      <div className="absolute w-[80%] h-[1.5px] top-1/2 -translate-y-6 bg-gradient-to-r from-[#9B72CF]/40 via-[#D4AF37]/70 to-[#E07B5A]/40" />

      <div className="w-full flex justify-between items-start relative z-10">
        {nodes.map((node, i) => (
          <div key={i} className="flex-1 flex flex-col items-center text-center px-1">
            {/* Círculo do Nó */}
            <div
              className="w-16 h-16 rounded-full bg-[#030306] border flex items-center justify-center mb-3 relative z-20 shadow-lg"
              style={{ borderColor: `${node.color}60` }}
            >
              {node.icon}
            </div>

            {/* Nome do Nó */}
            <span
              className="text-[10px] font-bold tracking-[0.18em] uppercase mb-1"
              style={{ color: node.color, fontFamily: "'Cinzel', serif" }}
            >
              {node.title}
            </span>

            {/* Descrição */}
            <span className="text-[9.5px] leading-[1.4] text-[#A5A7B3] font-light whitespace-pre-line">
              {node.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── NAVEGAÇÃO INFERIOR / FOOTER (PADRÃO IDÊNTICO 1/6 A 6/6) ───────────────────
const BottomNav = ({
  step,
  total,
  onPrev,
  onNext,
}: {
  step: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) => (
  <div className="w-full px-7 pb-8 pt-3 flex items-center justify-between shrink-0 relative z-20">
    {/* Botão Anterior */}
    <button
      onClick={onPrev}
      disabled={step === 0}
      className={`w-11 h-11 rounded-full border border-[#D4AF37] flex items-center justify-center transition-opacity ${
        step === 0 ? "opacity-20 cursor-default" : "opacity-100 hover:bg-[#D4AF37]/10 active:scale-95"
      }`}
      aria-label="Voltar"
    >
      <span className="text-[#D4AF37] text-[18px] leading-none select-none">←</span>
    </button>

    {/* 6 Dots de Progresso */}
    <div className="flex items-center gap-2.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === step
              ? "w-2.5 h-2.5 bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"
              : "w-2 h-2 border border-[#D4AF37]/50 bg-transparent"
          }`}
        />
      ))}
    </div>

    {/* Botão Próximo */}
    <button
      onClick={onNext}
      disabled={step === total - 1}
      className={`w-11 h-11 rounded-full border border-[#D4AF37] flex items-center justify-center transition-opacity ${
        step === total - 1 ? "opacity-20 cursor-default" : "opacity-100 hover:bg-[#D4AF37]/10 active:scale-95"
      }`}
      aria-label="Avançar"
    >
      <span className="text-[#D4AF37] text-[18px] leading-none select-none">→</span>
    </button>
  </div>
);

// ─── APP PRINCIPAL COMPLETO (SITE RESPONSIVO & MOBILE NATIVO) ──────────────────
export const MobileOnboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const current = SCREENS[step];

  const goNext = useCallback(() => {
    if (step < SCREENS.length - 1) {
      setStep((s) => s + 1);
    } else {
      navigate("/");
    }
  }, [step, navigate]);

  const goPrev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  const handleDrag = (_: any, info: PanInfo) => {
    if (info.offset.x < -50) goNext();
    else if (info.offset.x > 50) goPrev();
  };

  return (
    <div className="w-full h-[100dvh] bg-black flex items-center justify-center overflow-hidden">
      {/* 
        CHASSI PRINCIPAL:
        - No Desktop/Web: Centralizado com max-width de 430px (dimensão de iPhone) e sombra
        - No Mobile: Ocupa 100% da tela perfeitamente
      */}
      <div
        className="w-full max-w-[430px] h-full max-h-[932px] bg-[#030306] flex flex-col relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* ── CAMADA DE BACKGROUND / COSMOS ── */}
        <div
          className="absolute inset-0 pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: "url('/bg_deep_space.jpg')" }}
        />

        {/* ── FUNDOS DINÂMICOS CONFORME A TELA DO TARGET ── */}
        {/* Telas 1 e 6: Terra Orbital com Nascer do Sol */}
        {(current.bgType === "orbital" || current.bgType === "cta") && (
          <div
            className="absolute bottom-0 inset-x-0 h-[55%] pointer-events-none bg-cover bg-center"
            style={{
              backgroundImage: "url('/earth-orbital-hires.jpg')",
              maskImage: "linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
            }}
          />
        )}

        {/* Tela 2: Globo Inteiro Flutuante */}
        {current.bgType === "globe" && (
          <div className="absolute inset-x-0 bottom-24 flex justify-center items-center pointer-events-none">
            <div className="w-56 h-56 rounded-full overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.2)] border border-[#D4AF37]/30">
              <img src="/target_2.png" alt="Earth" className="w-full h-full object-cover scale-[1.35]" />
            </div>
          </div>
        )}

        {/* ── CONTEÚDO PRINCIPAL INTERATIVO COM SWIPE ── */}
        <motion.div
          className="relative z-10 flex flex-col h-full justify-between"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDrag}
        >
          {/* Topo / Header */}
          <HeaderLogo counter={current.counter} />

          {/* Textos Editoriais com Animação Suave */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="w-full flex flex-col items-center"
            >
              <EditorialBlock
                title={current.title}
                subtitle={current.subtitle}
                goldLine={current.goldLine}
              />
            </motion.div>
          </AnimatePresence>

          {/* Área Central / Visual Slot */}
          <div className="flex-1 w-full flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={step + "-visual"}
                className="w-full flex-1 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {current.bgType === "infographic" && <VisualInfographic />}
                {current.bgType === "pins" && <VisualPins />}
                {current.bgType === "timeline" && <VisualTimeline />}
                {current.bgType === "cta" && (
                  <div className="w-full px-7 pt-4 pb-2 z-30">
                    <button
                      onClick={() => navigate("/")}
                      className="w-full h-14 rounded-full font-bold tracking-[0.15em] text-[13px] uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                      style={{
                        background: "linear-gradient(90deg, #D4AF37 0%, #F3E5AB 50%, #D4AF37 100%)",
                        color: "#030306",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      CALCULAR MEU MAPA <span className="text-[16px]">→</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Rodapé / Navegação */}
          <BottomNav
            step={step}
            total={SCREENS.length}
            onPrev={goPrev}
            onNext={goNext}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default MobileOnboarding;
