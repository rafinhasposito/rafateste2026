import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { InteractiveHouseSelector } from "../InteractiveHouseSelector";

export const OrbitalOnboarding = () => {
  const [step, setStep] = useState(0);
  const [dream, setDream] = useState("");

  const steps = [
    {
      title: "Conte-nos sobre seus sonhos",
      subtitle: "O que você deseja alcançar no próximo ciclo?",
      placeholder: "Ex: Quero lançar uma startup...",
      suggestions: ["Lançar uma Startup", "Viajar o Mundo", "Encontrar um Amor", "Aprender um Idioma"]
    },
    {
      title: "Onde você está agora?",
      subtitle: "Qual a sua realidade atual neste exato momento?",
      placeholder: "Ex: Sou um designer júnior...",
      suggestions: ["Estudando", "Procurando emprego", "Transição de carreira", "Empreendendo"]
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else {
      setStep(step + 1); // Goes to step 2, which will render InteractiveHouseSelector
    }
  };

  if (step >= steps.length) {
    return <InteractiveHouseSelector />;
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="premium-bg" />

      {/* ANÉIS ORBITAIS (Inspirado no vídeo exemplo.mp4) */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="orbital-ring w-[300px] h-[300px] md:w-[600px] md:h-[600px]"
      >
        <div className="orb w-3 h-3 bg-white/50 -top-1.5 left-1/2" />
        <div className="orb w-2 h-2 bg-white/30 top-1/2 -left-1" />
      </motion.div>

      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="orbital-ring w-[500px] h-[500px] md:w-[900px] md:h-[900px] opacity-50"
      >
        <div className="orb w-4 h-4 bg-gold/50 top-1/4 -right-2" />
      </motion.div>

      {/* O SOL / ORBE CENTRAL */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="orb-primary absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* CONTEÚDO PRINCIPAL (INTERAÇÃO) */}
      <div className="relative z-20 w-full max-w-lg mt-32 md:mt-40 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl md:text-5xl font-outfit font-light text-slate-900 tracking-tight mb-2">
                {steps[step].title}
              </h1>
              <p className="text-slate-500 font-inter">
                {steps[step].subtitle}
              </p>
            </div>

            <div className="relative w-full max-w-sm mx-auto">
              <input 
                type="text"
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder={steps[step].placeholder}
                className="w-full bg-transparent border-b-2 border-slate-200 focus:border-slate-800 text-slate-900 text-xl py-4 text-center placeholder:text-slate-400 focus:outline-none transition-colors font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {steps[step].suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setDream(suggestion)}
                  className="px-4 py-2 rounded-full border border-slate-200 bg-white text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all font-inter shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className={`mt-10 flex items-center justify-center gap-2 mx-auto px-8 py-4 rounded-full font-bold transition-all shadow-lg ${
                !dream 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl'
              }`}
            >
              Continuar <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slate-400 text-xs font-inter uppercase tracking-widest">
        <Sparkles className="w-3 h-3" />
        Protocolo Solar IA
      </div>
    </div>
  );
};
