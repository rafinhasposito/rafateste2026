import React, { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Compass, MapPin, ArrowRight, ArrowLeft, ArrowLeftRight, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Tipos de conteúdo para as telas
type StepType = "hero" | "paths" | "how_it_works" | "compare" | "timeline" | "cta";

const onboardingSteps = [
  {
    id: 1,
    type: "hero" as StepType,
    title: "Descubra onde\npassar seu próximo\naniversário.",
    subtitle: "O lugar onde você passa seu aniversário muda o mapa da sua Revolução Solar e define o tom dos próximos 12 meses.",
  },
  {
    id: 2,
    type: "paths" as StepType,
    title: "Uma escolha.\nMúltiplos\ncaminhos.",
    subtitle: "Cada lugar pode colocar uma área diferente da sua vida em evidência.",
    paths: ["Dinheiro", "Amor", "Carreira", "Família", "Novos começos"]
  },
  {
    id: 3,
    type: "how_it_works" as StepType,
    title: "Como o\nProtocolo Solar\nfunciona.",
    subtitle: "Por que mudar de cidade altera o resultado?",
    features: [
      { icon: Star, title: "12 Casas Astrológicas", desc: "12 áreas da sua vida." },
      { icon: Clock, title: "365 dias", desc: "Um ciclo completo." },
      { icon: MapPin, title: "Localização precisa", desc: "Cada cidade gera uma configuração diferente." }
    ]
  },
  {
    id: 4,
    type: "compare" as StepType,
    title: "Mudar de cidade\npode mudar\ntudo.",
    subtitle: "Mesmo aniversário.\nOutro lugar, outro mapa.",
    comparison: {
      left: { city: "SÃO PAULO", house: "CASA 2", desc: "Dinheiro & Segurança" },
      right: { city: "NOVA YORK", house: "CASA 10", desc: "Carreira & Reconhecimento" }
    }
  },
  {
    id: 5,
    type: "timeline" as StepType,
    title: "Você escolhe\no que quer explorar.",
    subtitle: "",
    timeline: [
      { label: "PASSADO", desc: "Onde passei meu aniversário e o que aquele ciclo ativou?" },
      { label: "PRESENTE", desc: "O que a cidade onde passei este ano colocou em evidência?" },
      { label: "FUTURO", desc: "Onde posso passar meu próximo aniversário de acordo com o que quero viver?" }
    ]
  },
  {
    id: 6,
    type: "cta" as StepType,
    title: "Agora é\nsobre você.",
    subtitle: "Use seus dados de nascimento para calcular sua Revolução Solar e explorar diferentes possibilidades pelo mundo.",
  }
];

export const MobileOnboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const currentStep = onboardingSteps[step];

  const handleNext = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/");
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  // Variantes de animação
  const slideUp = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="relative min-h-[100svh] bg-background text-foreground overflow-hidden flex flex-col font-inter">
      {/* Fundo Cinematográfico (Preto Profundo com Glow Dourado Controlado) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#030306]" />
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-gold/5 to-transparent opacity-50" />
        <div className="absolute bottom-0 inset-x-0 h-[50vh] bg-gradient-to-t from-gold/5 to-transparent opacity-50" />
        
        {/* Subtle glowing orb that follows the step progress (only subtle) */}
        {step > 0 && step < 5 && (
          <motion.div 
            className="absolute w-[600px] h-[600px] rounded-full bg-gold/5 blur-[100px]"
            animate={{
              x: step % 2 === 0 ? '-50%' : '50%',
              y: step > 2 ? '20%' : '-20%',
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            style={{ top: '10%', left: '50%' }}
          />
        )}
      </div>

      {/* Earth Background depending on step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step === 0 || step === 3 ? 'earth-center' : step === 2 || step === 4 ? 'earth-right' : step === 5 ? 'earth-full' : 'none'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={cn(
            "absolute pointer-events-none z-0",
            (step === 0 || step === 3) ? "bottom-0 inset-x-0 h-[45vh]" : "",
            (step === 2 || step === 4) ? "-bottom-10 -right-20 w-[120%] h-[40vh]" : "",
            step === 5 ? "bottom-20 inset-x-0 h-[50vh]" : "",
            step === 1 ? "hidden" : ""
          )}
        >
          {step !== 1 && (
            <>
              {/* Flare do horizonte da Terra animado */}
              {(step === 0 || step === 5) && (
                <motion.div 
                  className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-gold/10 to-transparent blur-3xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              
              <div 
                className={cn(
                  "absolute inset-0 bg-no-repeat z-10",
                  step === 5 ? "bg-contain bg-center" : "bg-contain bg-bottom"
                )}
                style={{ backgroundImage: "url('/earth-bg.png')" }}
              />
              <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#030306] via-[#030306]/80 to-transparent z-20" />
              
              {/* Sun Flare for step 3 */}
              {step === 2 && (
                <div className="absolute top-[10%] left-[20%] w-32 h-16 bg-orange-500/30 blur-2xl rounded-full z-10" />
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Header (Progresso e Pular) - Simétrico */}
      {currentStep.type !== "cta" && (
        <div className="relative z-20 pt-safe-top">
          <div className="pt-6 px-6 flex justify-between items-center w-full">
            <div className="w-16" /> {/* Espaçador para manter o logo centralizado */}
            
            {/* Centro: Progress */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">{step + 1} de {onboardingSteps.length}</span>
              <div className="flex gap-1.5">
                {onboardingSteps.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-[2px] rounded-full transition-all duration-500", 
                      i <= step ? "bg-gold" : "bg-white/10",
                      i === step ? "w-6" : "w-2"
                    )} 
                  />
                ))}
              </div>
            </div>
            {/* Direita: Pular */}
            <button onClick={handleSkip} className="w-16 flex justify-end text-[10px] font-bold tracking-[0.2em] uppercase text-gold/70 hover:text-gold transition-colors">
              Pular
            </button>
          </div>

          {/* Logo Centralizado */}
          <div className="flex flex-col mx-auto text-center items-center mt-8">
            <Compass className="w-6 h-6 text-gold mb-2 opacity-90" strokeWidth={1} />
            <h2 className="text-[10px] tracking-[0.25em] font-medium text-gold uppercase opacity-90 mb-1">Protocolo Solar</h2>
            <h3 className="text-[7px] tracking-[0.2em] font-light text-muted-foreground uppercase">Astrologia de Relocalização</h3>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="relative z-10 flex-1 flex flex-col justify-start pt-2 px-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            variants={slideUp}
            initial="initial"
            animate="animate"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="flex flex-col w-full h-full max-w-sm mx-auto items-center text-center justify-start pt-8"
          >
            {/* Título e Subtítulo (Sempre Centralizados) */}
            <h1 className="text-[1.8rem] font-cinzel leading-[1.2] mb-4 tracking-tight text-glow-white uppercase drop-shadow-md">
              {currentStep.title.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i === 1 && currentStep.type === "cta" ? <span className="gold-gradient">{line}</span> : line}
                  <br />
                </React.Fragment>
              ))}
            </h1>

            {currentStep.type === "hero" && (
              <div className="flex items-center gap-2 mb-6 opacity-80">
                <Star className="w-2 h-2 text-gold fill-gold" />
                <div className="h-[1px] w-12 bg-gradient-to-r from-gold to-transparent" />
              </div>
            )}

            {currentStep.subtitle && (
              <p className="text-[13px] text-muted-foreground font-light leading-[1.8] mb-10 drop-shadow-md max-w-[280px] mx-auto">
                {currentStep.subtitle}
              </p>
            )}

            {/* Layouts Específicos por Tipo */}

            {/* Tipo 1: Hero (Terra e Coordenadas) */}
            {currentStep.type === "hero" && (
              <>
                {/* O Pin e a Linha (ancorados perto da Terra) */}
                <div className="absolute bottom-[20vh] left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                  <div className="relative flex flex-col items-center">
                    
                    {/* Halo de respiração suave atrás do pin */}
                    <motion.div 
                      className="absolute -inset-8 rounded-full bg-gold/10 blur-xl"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Custom Premium Pin com Glow */}
                    <motion.svg 
                      width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" 
                      className="relative z-10 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37258 18.6274 0 12 0Z" fill="url(#pin-gradient)"/>
                      <circle cx="12" cy="12" r="5" fill="#030306"/>
                      <circle cx="12" cy="12" r="1.5" fill="#D4AF37"/>
                      <defs>
                        <linearGradient id="pin-gradient" x1="12" y1="0" x2="12" y2="32" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#F9D472"/>
                          <stop offset="1" stopColor="#9C731A"/>
                        </linearGradient>
                      </defs>
                    </motion.svg>
                    
                    {/* Linha orbital que desce até a Terra com energia subindo */}
                    <div className="absolute top-[28px] left-1/2 -translate-x-1/2 w-[1px] h-[15vh] bg-gradient-to-b from-gold/50 via-gold/10 to-transparent overflow-hidden">
                      <motion.div 
                        className="w-full h-8 bg-gradient-to-b from-transparent via-gold to-transparent"
                        animate={{ y: ["-20px", "15vh"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    
                    {/* Anéis de contato com a Terra (ondas) */}
                    <motion.div 
                      className="absolute top-[calc(28px+15vh)] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-gold/40"
                      initial={{ width: "10px", height: "2px", opacity: 0.8 }}
                      animate={{ width: "80px", height: "20px", opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.div 
                      className="absolute top-[calc(28px+15vh)] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-gold/20"
                      initial={{ width: "10px", height: "2px", opacity: 0.8 }}
                      animate={{ width: "120px", height: "30px", opacity: 0 }}
                      transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Coordenadas Flutuantes (Esquerda - Fantasmas) */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 1 }}
                  className="absolute bottom-[28vh] left-4 text-[7px] text-white/30 tracking-[0.3em] font-mono border-l border-gold/10 pl-3 opacity-50"
                >
                  23.5505° S<br/>
                  46.6333° W
                </motion.div>

                {/* Bússola Decorativa (Direita - Fantasma) */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 1 }}
                  className="absolute bottom-[30vh] right-0 opacity-10 translate-x-1/3"
                >
                  <Compass className="w-24 h-24 text-gold" strokeWidth={0.2} />
                </motion.div>
              </>
            )}

            {/* Tipo 2: Paths (Órbitas Elípticas) */}
            {currentStep.type === "paths" && currentStep.paths && (
              <div className="flex flex-col items-center justify-center gap-8 mt-4 w-full h-full pb-[15vh]">
                {currentStep.paths.map((path, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + (i * 0.1) }}
                    className="relative flex items-center justify-center w-full max-w-[240px]"
                  >
                    {/* Elliptical Ring */}
                    <div className="absolute inset-0 border border-gold/15 rounded-[100%] scale-y-[0.3] shadow-[0_0_15px_rgba(212,175,55,0.05)]" />
                    {/* Glowing Star/Dot on orbit */}
                    <motion.div 
                      className="absolute w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#D4AF37]"
                      animate={{ x: [ -60, 60, -60 ], y: [ 0, 5, 0 ] }}
                      transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Texto */}
                    <span className="relative z-10 font-cinzel text-gold text-[12px] tracking-[0.2em] font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-4 bg-[#030306]/60 backdrop-blur-sm rounded-full py-1">{path.toUpperCase()}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Tipo 3: Como Funciona (Centralizado) */}
            {currentStep.type === "how_it_works" && currentStep.features && (
              <div className="relative flex flex-col gap-8 mt-6 w-full items-center text-center">
                {/* Linha vertical central */}
                <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[1px] border-l border-dashed border-gold/30" />
                
                {currentStep.features.map((feat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1) }} className="relative flex flex-col items-center gap-3">
                    <div className="relative z-10 bg-[#030306] p-2 rounded-full border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                      <feat.icon className="w-5 h-5 text-gold/80" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-medium tracking-[0.15em] uppercase text-white mb-1">{feat.title}</h4>
                      <p className="text-[12px] text-muted-foreground font-light leading-relaxed px-4">{feat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Tipo 4: Comparação (Cartões com Glow) */}
            {currentStep.type === "compare" && currentStep.comparison && (
              <div className="flex flex-col items-center w-full mt-4 gap-4 px-2">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full bg-[#030306]/80 backdrop-blur-md border border-gold/20 rounded-xl p-5 relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.05)] text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
                  <h4 className="font-cinzel text-xl text-gold mb-2">{currentStep.comparison.left.city}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">{currentStep.comparison.left.house}</p>
                  <p className="text-[12px] font-light text-foreground/80">{currentStep.comparison.left.desc}</p>
                </motion.div>
                
                <div className="flex items-center justify-center">
                  <ArrowLeftRight className="w-5 h-5 text-gold/60" strokeWidth={1.5} />
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full bg-[#030306]/80 backdrop-blur-md border border-gold/20 rounded-xl p-5 relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.05)] text-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 to-transparent pointer-events-none" />
                  <h4 className="font-cinzel text-xl text-gold mb-2">{currentStep.comparison.right.city}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">{currentStep.comparison.right.house}</p>
                  <p className="text-[12px] font-light text-foreground/80">{currentStep.comparison.right.desc}</p>
                </motion.div>
              </div>
            )}

            {/* Tipo 5: Timeline (Centralizado) */}
            {currentStep.type === "timeline" && currentStep.timeline && (
              <div className="relative mt-8 w-full flex flex-col items-center">
                {/* Linha vertical centralizada */}
                <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-6 w-[1px] bg-gradient-to-b from-gold via-gold/40 to-transparent" />
                
                {currentStep.timeline.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.15) }} className="relative mb-8 last:mb-0 text-center w-full max-w-[200px]">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-3 h-3 rounded-full bg-gold shadow-[0_0_10px_#D4AF37] border-[3px] border-[#030306]" />
                    <div className="pt-4">
                      <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gold mb-1">{item.label}</h4>
                      <p className="text-[12px] text-muted-foreground font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Tipo 6: CTA */}
            {currentStep.type === "cta" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full mt-auto mb-10">
                <button
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-full font-inter text-[13px] font-bold tracking-[0.15em] uppercase bg-gold text-[#030306] hover:bg-gold-light shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all"
                >
                  Calcular Meu Mapa
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-center gap-2 text-muted-foreground/50 text-[9px] mt-6 uppercase tracking-[0.2em] font-medium">
                  <Star className="w-3 h-3" />
                  <span>Dados 100% Privados</span>
                </div>
              </motion.div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navegação Inferior (Simétrica e Centralizada) */}
      {currentStep.type !== "cta" && (
        <div className="absolute bottom-0 inset-x-0 pb-safe-bottom bg-gradient-to-t from-[#030306] to-transparent z-30">
          <div className="flex items-center justify-between px-8 pb-8 pt-12">
            {/* Voltar (invisível na tela 1 para manter simetria) */}
            <button 
              onClick={handlePrev} 
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-full border border-gold/20 bg-[#030306]/80 text-gold hover:bg-gold/10 transition-colors backdrop-blur-md",
                step === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Avançar (Sempre Visível) */}
            <button 
              onClick={handleNext} 
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gold/20 bg-[#030306]/80 text-gold hover:bg-gold/10 transition-colors backdrop-blur-md"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default MobileOnboarding;
