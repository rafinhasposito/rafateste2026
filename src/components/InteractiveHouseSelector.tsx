import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Zap, ChevronRight, X, Flame, ThumbsDown, Info, Lock } from "lucide-react";
import { dashboardData } from "../data/houseDashboardData";
import { SwipeToUnlock } from "./SwipeToUnlock";

// Helper components
const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-6 h-6 text-white" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-white" />,
  Zap: <Zap className="w-6 h-6 text-white" />,
};

export function InteractiveHouseSelector() {
  const [activeId, setActiveId] = useState(2);
  const activeData = dashboardData[activeId] || dashboardData[2]; 
  const housesList = Object.keys(dashboardData).map(k => dashboardData[Number(k)]).sort((a,b) => a.id - b.id);

  // Gamification State
  const [step, setStep] = useState(1);
  const [tinderIndex, setTinderIndex] = useState(0);
  const [tinderMatches, setTinderMatches] = useState<Record<number, boolean>>({});
  const [quizPhase, setQuizPhase] = useState(0); 
  const [diagCaos, setDiagCaos] = useState<'sim' | 'nao' | null>(null);
  const [isReadingStars, setIsReadingStars] = useState(false);
  const [showTinderFeedback, setShowTinderFeedback] = useState<string | null>(null);

  const pills = activeData.pills.slice(0, 3);
  const totalMatches = Object.values(tinderMatches).filter(v => v !== undefined).length;
  const quizAnswers = (diagCaos ? 2 : 0);
  const matchPercentage = ((totalMatches + quizAnswers) / 5) * 100;

  const tinderRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const climaxRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
  };

  const handleTinderSwipe = (choice: 'quero' | 'nao') => {
    const currentPill = pills[tinderIndex];
    const isNegative = currentPill.comando.toLowerCase() === 'bloqueia';
    
    if ((isNegative && choice === 'nao') || (!isNegative && choice === 'quero')) {
       setShowTinderFeedback(`Exato! A Casa ${activeData.id} cuida disso.`);
    } else {
       setShowTinderFeedback(`A Casa ${activeData.id} vai alinhar isso pra você.`);
    }

    setTinderMatches({...tinderMatches, [tinderIndex]: true});
    setTimeout(() => {
      setShowTinderFeedback(null);
      if (tinderIndex < pills.length - 1) {
        setTinderIndex(tinderIndex + 1);
      } else {
        setStep(3); setQuizPhase(1); scrollTo(quizRef);
      }
    }, 1500);
  };

  const handleQuizAnswer = (answer: 'sim' | 'nao') => {
    setDiagCaos(answer);
    setIsReadingStars(true);
    setTimeout(() => {
      setIsReadingStars(false);
      setQuizPhase(2);
      setStep(4);
      scrollTo(climaxRef);
    }, 1500);
  };

  // Reset state when changing house
  useEffect(() => {
    setStep(1);
    setTinderIndex(0);
    setTinderMatches({});
    setQuizPhase(0);
    setDiagCaos(null);
  }, [activeId]);

  return (
    <div className="w-full min-h-[100dvh] bg-[#F8F9FB] font-outfit pb-32 flex flex-col relative overflow-x-hidden">
      
      {/* 1. MOBILE-FIRST HEADER (Glassmorphism & Persona Pill) */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100 px-4 py-3 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
             <span className="text-white font-black text-sm">✦</span>
           </div>
           <span className="font-black text-lg tracking-tight text-slate-900">Solar</span>
         </div>
         
         <div className="flex items-center gap-2 bg-white/80 pl-1 pr-3 py-1.5 rounded-full border border-slate-200/80 shadow-sm backdrop-blur-md">
            <div className="relative w-8 h-8 flex-shrink-0">
               <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                 <circle cx="50%" cy="50%" r="45%" stroke="#f1f5f9" strokeWidth="2.5" fill="none" />
                 <motion.circle 
                   cx="50%" cy="50%" r="45%" 
                   stroke={activeData.bg.includes('indigo') ? '#4f46e5' : activeData.bg.includes('emerald') ? '#059669' : '#e11d48'} 
                   strokeWidth="2.5" fill="none" 
                   strokeDasharray="100" strokeDashoffset="100"
                   animate={{ strokeDashoffset: 100 - matchPercentage }} 
                   strokeLinecap="round"
                   style={{ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 }}
                 />
               </svg>
               <div className="absolute inset-[2.5px] rounded-full overflow-hidden bg-slate-100">
                  <img src={activeData.memoji} alt="Persona" className="w-[120%] h-[120%] object-cover object-top" />
               </div>
            </div>
            <span className={`text-xs font-black ${activeData.color}`}>{Math.round(matchPercentage)}%</span>
         </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto">
         
         {/* 2. CARROSSEL HORIZONTAL CONTÍNUO (Nunca se perde) */}
         <div className="w-full bg-white border-b border-slate-100 pt-5 pb-4 px-0">
            <div className="px-4 mb-3 flex justify-between items-center">
               <h2 className="text-base font-black text-slate-900 tracking-tight">Destinos Astrológicos</h2>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">Deslize</span>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 px-4 pb-2 scrollbar-hide">
              {housesList.map(house => (
                <div 
                  key={house.id} 
                  onClick={() => setActiveId(house.id)}
                  className={`snap-center flex-shrink-0 w-32 rounded-3xl p-2 cursor-pointer transition-all border-2 bg-white ${activeId === house.id ? `border-indigo-500 shadow-md` : 'border-slate-100 hover:border-slate-200'}`}
                >
                   <div className={`w-full h-24 rounded-2xl ${house.bg} mb-3 overflow-hidden flex justify-center items-end relative`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                      <img src={house.memoji} alt={house.archetype} className="w-[120%] h-[120%] object-cover object-top relative z-0" />
                      <span className="absolute bottom-2 left-2 z-20 text-[10px] font-black text-white uppercase tracking-widest">CASA {house.id}</span>
                   </div>
                   <p className="text-center text-xs font-bold text-slate-600 truncate px-1">
                     {house.archetype}
                   </p>
                </div>
              ))}
            </div>
         </div>

         {/* 3. A ÁREA DO JOGO (CONTEÚDO MOBILE-FIRST EDGE-TO-EDGE) */}
         <div className="p-4 flex flex-col gap-6 pt-6">
            
            {/* O HOOK (BANNER IMERSIVO) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`w-full ${activeData.bg} rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden flex flex-col items-start justify-center min-h-[300px]`}>
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
               <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black tracking-widest uppercase text-white mb-6 backdrop-blur-md border border-white/20">
                 Frequência Ativada
               </span>
               <h1 className="text-3xl font-black leading-tight mb-4 tracking-tight drop-shadow-md">
                 {activeData.headline}
               </h1>
               <p className="text-white/90 text-sm font-medium leading-relaxed max-w-lg mb-8">
                 {activeData.beneficioBanner}
               </p>
            </motion.div>

            {/* O TINDER GAME */}
            {step >= 2 && (
               <motion.div ref={tinderRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 mt-2">
                 <h3 className="text-2xl font-black text-slate-900 px-2">Sintonia Fina</h3>
                 
                 {step === 2 && tinderIndex < pills.length ? (
                   <AnimatePresence mode="wait">
                     <motion.div 
                       key={tinderIndex} 
                       initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
                       className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center w-full relative"
                     >
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 bg-slate-50 px-3 py-1 rounded-full">Carta {tinderIndex + 1} de 3</span>
                       
                       {showTinderFeedback ? (
                         <motion.div initial={{scale:0.8}} animate={{scale:1}} className="flex flex-col items-center justify-center py-10">
                           <Sparkles className={`w-12 h-12 mb-4 ${activeData.color}`} />
                           <h4 className="text-lg font-black text-slate-800">{showTinderFeedback}</h4>
                         </motion.div>
                       ) : (
                         <>
                           <h4 className={`text-xs font-black uppercase tracking-widest mb-3 ${activeData.color} bg-${activeData.color.replace('text-', '')}/10 px-4 py-1.5 rounded-full`}>
                             {pills[tinderIndex].comando}
                           </h4>
                           <p className="text-2xl font-black text-slate-900 mb-10 leading-tight">
                             {pills[tinderIndex].label}
                           </p>
                           <div className="flex w-full gap-4">
                             <button 
                               onClick={() => handleTinderSwipe('nao')} 
                               className="flex-1 py-5 rounded-2xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-black border-2 border-slate-100 hover:border-rose-200 transition-all flex flex-col items-center gap-2 active:scale-95"
                             >
                               <ThumbsDown className="w-6 h-6" />
                               <span className="text-[10px] uppercase tracking-widest">Tô Fora</span>
                             </button>
                             <button 
                               onClick={() => handleTinderSwipe('quero')} 
                               className={`flex-1 py-5 rounded-2xl ${activeData.bg} text-white font-black shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-2 active:scale-95`}
                             >
                               <Flame className="w-6 h-6" />
                               <span className="text-[10px] uppercase tracking-widest">Quero!</span>
                             </button>
                           </div>
                         </>
                       )}
                     </motion.div>
                   </AnimatePresence>
                 ) : (
                   <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`bg-${activeData.color.replace('text-', '')}/10 border border-${activeData.color.replace('text-', '')}/20 rounded-[2rem] p-6 flex items-center justify-center gap-3`}>
                      <ShieldCheck className={`w-6 h-6 ${activeData.color}`} />
                      <h4 className="text-sm font-black text-slate-900">Sintonia Energética Concluída</h4>
                   </motion.div>
                 )}
               </motion.div>
            )}

            {/* O QUIZ */}
            {step >= 3 && (
               <motion.div ref={quizRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 mt-2">
                 <h3 className="text-2xl font-black text-slate-900 px-2">Diagnóstico</h3>
                 
                 <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
                   {quizPhase >= 1 && (
                     <div>
                       <p className="text-base font-black text-slate-900 mb-6">Como você descreve seu momento atual?</p>
                       
                       {!diagCaos && !isReadingStars && (
                         <div className="flex flex-col gap-4">
                           <button onClick={() => handleQuizAnswer('sim')} className="p-5 rounded-2xl bg-slate-50 text-left hover:bg-slate-100 border-2 border-transparent hover:border-slate-200 active:scale-95 transition-all">
                             <span className="block text-sm font-black text-slate-900 mb-1">Caótico</span>
                             <span className="text-xs font-medium text-slate-500">Preciso organizar a bagunça urgente.</span>
                           </button>
                           <button onClick={() => handleQuizAnswer('nao')} className="p-5 rounded-2xl bg-slate-50 text-left hover:bg-slate-100 border-2 border-transparent hover:border-slate-200 active:scale-95 transition-all">
                             <span className="block text-sm font-black text-slate-900 mb-1">Estável</span>
                             <span className="text-xs font-medium text-slate-500">Quero escalar e expandir de vez.</span>
                           </button>
                         </div>
                       )}

                       {isReadingStars && (
                         <div className="flex flex-col items-center justify-center p-10 gap-4 text-slate-400">
                           <Sparkles className={`w-8 h-8 animate-spin ${activeData.color}`} />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Lendo os Astros...</span>
                         </div>
                       )}

                       {diagCaos && !isReadingStars && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`bg-${activeData.color.replace('text-', '')}/10 p-6 rounded-2xl border-l-4 border-${activeData.color.replace('text-', '')}`}>
                            <strong className={`font-black uppercase text-[10px] tracking-widest block mb-2 ${activeData.color}`}>A Mágica da Casa {activeData.id}:</strong> 
                            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                              {diagCaos === 'sim' 
                                ? 'Você escolheu o refúgio perfeito. Essa energia vai estabilizar o caos e trazer paz mental.' 
                                : 'Prepare-se para o salto. Essa energia vai alavancar seus recursos para o próximo nível.'}
                            </p>
                          </motion.div>
                       )}
                     </div>
                   )}
                 </div>
               </motion.div>
            )}

            {/* O CLIMAX (SCORECARD) */}
            {step >= 4 && (
               <motion.div ref={climaxRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 mt-2">
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center overflow-hidden">
                     <h3 className="text-lg font-black text-slate-900 mb-8">Score de Sinergia Final</h3>
                     
                     <div className="relative w-full max-w-[220px] aspect-[2/1] overflow-hidden flex justify-center mb-6">
                       <svg className="absolute w-full h-[200%] top-0 left-0" viewBox="0 0 100 100">
                          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
                          <motion.path 
                            d="M 10 50 A 40 40 0 0 1 90 50" 
                            fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" 
                            className={activeData.color} strokeDasharray="125.6" 
                            initial={{ strokeDashoffset: 125.6 }}
                            animate={{ strokeDashoffset: 125.6 - (125.6 * 0.91) }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                          />
                       </svg>
                       <div className="absolute bottom-0 flex flex-col items-center">
                          <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }} className={`text-6xl font-black tracking-tighter ${activeData.color}`}>
                            9.1
                          </motion.span>
                       </div>
                     </div>
                     
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sua Persona está pronta</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem] p-6 shadow-sm border border-amber-100 flex flex-col justify-center">
                     <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                       <Info className="w-5 h-5 text-amber-600" />
                     </div>
                     <h3 className="text-base font-black text-amber-900 mb-2">Conselho Cósmico</h3>
                     <p className="text-amber-800 text-sm font-semibold leading-relaxed">
                       {activeData.lossAversion || "Cuidado: Se você tiver medo de cobrar pelo seu valor, o seu dinheiro vai direto para o bolso do seu concorrente."}
                     </p>
                  </div>

                  <div className="mt-6">
                    <SwipeToUnlock colorBg={activeData.bg} colorText={activeData.color} />
                  </div>
               </motion.div>
            )}
            
         </div>
      </main>

      {/* 4. ZONA DO POLEGAR (STICKY BOTTOM ACTION) */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white/90 backdrop-blur-2xl border-t border-slate-100 z-50 flex items-center justify-center pb-safe">
         <div className="w-full max-w-md mx-auto">
            <AnimatePresence mode="popLayout">
               {step === 1 && (
                 <motion.button 
                   key="btn1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                   onClick={() => { setStep(2); scrollTo(tinderRef); }} 
                   className={`w-full py-4 rounded-[1.5rem] ${activeData.bg} text-white font-black text-base shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2`}
                 >
                   Eu Quero Isso! <Sparkles className="w-5 h-5" />
                 </motion.button>
               )}
               {step === 2 && tinderIndex >= pills.length && (
                 <motion.button 
                   key="btn2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                   onClick={() => { setStep(3); setQuizPhase(1); scrollTo(quizRef); }} 
                   className={`w-full py-4 rounded-[1.5rem] ${activeData.bg} text-white font-black text-base shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2`}
                 >
                   Avançar <ChevronRight className="w-5 h-5" />
                 </motion.button>
               )}
               {step === 3 && quizPhase === 2 && (
                 <motion.button 
                   key="btn3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                   onClick={() => { setStep(4); scrollTo(climaxRef); }} 
                   className={`w-full py-4 rounded-[1.5rem] ${activeData.bg} text-white font-black text-base shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2`}
                 >
                   Resultado Final <ChevronRight className="w-5 h-5" />
                 </motion.button>
               )}
               {step >= 4 && (
                 <motion.div key="btn4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full text-center py-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1"><Lock className="w-3 h-3"/> Rota Mestre Calculada</span>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
