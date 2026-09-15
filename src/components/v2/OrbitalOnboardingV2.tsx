import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface OrbitalOnboardingV2Props {
  onComplete: (dream: string) => void;
}

export function OrbitalOnboardingV2({ onComplete }: OrbitalOnboardingV2Props) {
  const [step, setStep] = useState(0);
  const [dream, setDream] = useState("");

  const steps = [
    {
      title: "Conte-nos sobre seus sonhos",
      subtitle: "O que você deseja alcançar no próximo ciclo?",
      placeholder: "Ex: Conquistar liberdade financeira...",
      suggestions: ["Encontrar um Amor", "Multiplicar Patrimônio", "Paz de Espírito", "Reconhecimento Público"],
    },
    {
      title: "Onde você está hoje?",
      subtitle: "Qual o maior desafio que bloqueia esse sonho?",
      placeholder: "Ex: Exaustão extrema...",
      suggestions: ["Estagnação Profissional", "Falta de Tempo", "Medo de Arriscar", "Relacionamentos Tóxicos"],
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      setDream("");
    } else {
      onComplete(dream);
    }
  };

  return (
    <div className="relative h-[85dvh] w-full bg-white rounded-3xl overflow-hidden flex flex-col items-center justify-center p-6 shadow-sm border border-slate-100">
      
      {/* Premium background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white -z-10" />

      {/* Orbital Rings Light Mode */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-slate-200 rounded-full"
      >
        <div className="absolute w-3 h-3 bg-slate-300 rounded-full -top-1.5 left-1/2" />
        <div className="absolute w-2 h-2 bg-slate-200 rounded-full top-1/2 -left-1" />
      </motion.div>

      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute w-[500px] h-[500px] md:w-[900px] md:h-[900px] border border-slate-100 rounded-full opacity-50"
      >
        <div className="absolute w-4 h-4 bg-amber-200 rounded-full top-1/4 -right-2" />
      </motion.div>

      {/* Central Sun */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-amber-100 to-transparent rounded-full blur-3xl opacity-50"
      />

      <div className="relative z-20 w-full max-w-sm text-center mt-12">
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
              <h1 className="text-3xl font-sans font-black text-slate-900 tracking-tight mb-2">
                {steps[step].title}
              </h1>
              <p className="text-slate-500 font-ps-ui font-medium text-sm">
                {steps[step].subtitle}
              </p>
            </div>

            <div className="relative w-full mx-auto">
              <input 
                type="text"
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder={steps[step].placeholder}
                className="w-full bg-transparent border-b-2 border-slate-200 focus:border-slate-800 text-slate-900 text-xl py-4 text-center placeholder:text-slate-300 focus:outline-none transition-colors font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {steps[step].suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setDream(suggestion)}
                  className="px-4 py-2 rounded-full border border-slate-200 bg-white text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all font-ps-ui shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className={`mt-10 flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black transition-all shadow-lg uppercase tracking-widest text-sm ${
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

    </div>
  );
}
