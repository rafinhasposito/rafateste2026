import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dashboardData } from "@/data/houseDashboardData";
import { CarouselV2 } from "@/components/v2/CarouselV2";
import { TinderGameV2 } from "@/components/v2/TinderGameV2";
import { DashboardV2 } from "@/components/v2/DashboardV2";
import { OrbitalOnboardingV2 } from "@/components/v2/OrbitalOnboardingV2";
import { QuizV2 } from "@/components/v2/QuizV2";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type GameStep = 'onboarding' | 'carousel' | 'tinder' | 'quiz' | 'dashboard';

export default function SolarGameV2() {
  const [step, setStep] = useState<GameStep>('onboarding');
  const [activeHouseId, setActiveHouseId] = useState<number>(2);
  const navigate = useNavigate();

  const activeHouse = dashboardData[activeHouseId] || dashboardData[1];

  const handleBack = () => {
    if (step === 'onboarding') navigate('/');
    if (step === 'carousel') setStep('onboarding');
    if (step === 'tinder') setStep('carousel');
    if (step === 'quiz') setStep('tinder');
    if (step === 'dashboard') setStep('quiz');
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#FAFAFA] font-sans relative overflow-hidden flex flex-col">
      {/* Premium Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 px-4 py-3 flex justify-between items-center">
         <button onClick={handleBack} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
         </button>
         <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Protocolo Solar</span>
            <span className="font-bold text-slate-800 text-sm">
              {step === 'onboarding' && 'Intenção'}
              {step === 'carousel' && 'O Seu Destino'}
              {step === 'tinder' && 'Sintonia'}
              {step === 'quiz' && 'O Desafio'}
              {step === 'dashboard' && 'Dossiê'}
            </span>
         </div>
         <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/20">
            <Sparkles className="w-4 h-4" />
         </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto relative pt-20 pb-safe px-4">
        <AnimatePresence mode="wait">
          {step === 'onboarding' && (
            <motion.div key="onboarding" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
               <OrbitalOnboardingV2 onComplete={() => setStep('carousel')} />
            </motion.div>
          )}

          {step === 'carousel' && (
            <motion.div key="carousel" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
               <CarouselV2 onSelect={(id) => { setActiveHouseId(id); setStep('tinder'); }} />
            </motion.div>
          )}

          {step === 'tinder' && (
            <motion.div key="tinder" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
               <TinderGameV2 house={activeHouse} onComplete={() => setStep('quiz')} />
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
               <QuizV2 house={activeHouse} onComplete={() => setStep('dashboard')} />
            </motion.div>
          )}

          {step === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
               <DashboardV2 house={activeHouse} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
