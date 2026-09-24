import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ThumbsDown, Sparkles } from "lucide-react";

interface TinderGameV2Props {
  house: any;
  onComplete: () => void;
}

export function TinderGameV2({ house, onComplete }: TinderGameV2Props) {
  const [index, setIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const pills = house.pills.slice(0, 3);

  const handleSwipe = (choice: 'quero' | 'nao') => {
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      if (index < pills.length - 1) {
        setIndex(index + 1);
      } else {
        onComplete();
      }
    }, 1200);
  };

  const currentPill = pills[index];

  return (
    <div className="flex flex-col h-full min-h-[85dvh] relative">
      {/* Background Image Container */}
      <div className={`absolute top-0 inset-x-0 h-[60dvh] rounded-b-[3rem] overflow-hidden ${house.bg} shadow-xl`}>
         <img src={house.memoji} alt="Persona" className="w-full h-full object-cover object-top opacity-60 mix-blend-luminosity" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
         
         <div className="absolute top-8 inset-x-0 px-6 flex justify-between items-center text-white">
            <span className="text-[10px] uppercase tracking-widest font-black bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              Sintonia Fina
            </span>
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              {index + 1} / {pills.length}
            </span>
         </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col justify-end h-full pt-[35dvh] px-4 pb-8 flex-1">
        
        <AnimatePresence mode="wait">
          {!showFeedback ? (
            <motion.div 
              key={`card-${index}`}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-100 flex flex-col items-center text-center w-full mb-6"
            >
               <h4 className={`text-xs font-black uppercase tracking-widest mb-4 ${house.color} bg-${house.color.replace('text-', '')}/10 px-4 py-1.5 rounded-full`}>
                 {currentPill.comando}
               </h4>
               <p className="text-3xl font-black text-slate-900 leading-tight mb-2">
                 {currentPill.label}
               </p>
               <p className="text-sm font-medium text-slate-500 mb-8 mt-2">
                 Você deseja alinhar esta frequência?
               </p>
               
               <div className="flex w-full gap-4">
                 <button 
                   onClick={() => handleSwipe('nao')} 
                   className="flex-1 py-5 rounded-2xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-black border-2 border-slate-100 hover:border-rose-200 transition-all flex flex-col items-center gap-2 active:scale-95"
                 >
                   <ThumbsDown className="w-6 h-6" />
                   <span className="text-[10px] uppercase tracking-widest">Tô Fora</span>
                 </button>
                 <button 
                   onClick={() => handleSwipe('quero')} 
                   className={`flex-1 py-5 rounded-2xl ${house.bg} text-white font-black shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-2 active:scale-95`}
                 >
                   <Flame className="w-6 h-6" />
                   <span className="text-[10px] uppercase tracking-widest">Quero!</span>
                 </button>
               </div>
            </motion.div>
          ) : (
            <motion.div 
              key={`feedback-${index}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/90 backdrop-blur-md rounded-[2rem] p-10 shadow-xl border border-white/50 flex flex-col items-center text-center w-full mb-6"
            >
              <div className={`w-20 h-20 rounded-full ${house.bg} flex items-center justify-center text-white mb-4 shadow-lg shadow-${house.color.replace('text-', '')}/30`}>
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Sintonia Alinhada</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">O Universo registrou sua escolha.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
