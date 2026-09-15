import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type FlowState = 'INTENCAO' | 'PROCESSANDO' | 'LOCALIZACAO' | 'ALINHAMENTO';

export default function NorthStarFlow() {
  const [currentState, setCurrentState] = useState<FlowState>('INTENCAO');
  const [intencao, setIntencao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const navigate = useNavigate();

  const handleIntencaoSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!intencao.trim()) return;
    
    setCurrentState('PROCESSANDO');
    
    setTimeout(() => {
      setCurrentState('LOCALIZACAO');
    }, 2800);
  };

  const handleLocalizacaoSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!localizacao.trim()) return;
    
    setCurrentState('ALINHAMENTO');
  };

  const easeInOut = [0.4, 0, 0.2, 1];

  return (
    <div className="fixed inset-0 w-full h-full bg-[#000000] font-ps-ui overflow-hidden flex flex-col items-center justify-center text-[#F2F8FB] selection:bg-white/20">
      
      {/* 🌌 DEEP SPACE BACKGROUND 🌌 */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-screen" />
         
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: currentState === 'PROCESSANDO' ? 1 : 0 }}
           transition={{ duration: 1.5 }}
           className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-white/10 to-transparent blur-3xl"
         />
      </div>

      {/* CORE SACRED ENGINE (THE ORBS) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        
        {/* ORB 1: The Destination / Intention Star */}
        <motion.div
          animate={{
            y: currentState === 'ALINHAMENTO' ? -150 : 
               currentState === 'PROCESSANDO' ? -50 : 0,
            scale: currentState === 'ALINHAMENTO' ? 0.6 : 
                   currentState === 'PROCESSANDO' ? 1.2 : 1,
            opacity: currentState === 'PROCESSANDO' ? 0.9 : 1,
          }}
          transition={{ duration: 1.8, ease: easeInOut }}
          className="relative flex items-center justify-center"
        >
          {/* God-Tier Ethereal Orb */}
          <motion.div 
            animate={{
              boxShadow: currentState === 'PROCESSANDO' 
                ? '0 0 100px 30px rgba(255, 255, 255, 0.4), inset 0 0 50px 10px rgba(255, 255, 255, 1)'
                : '0 0 60px 10px rgba(255, 255, 255, 0.1), inset -10px -10px 40px rgba(0, 0, 0, 0.8), inset 10px 10px 30px rgba(255, 255, 255, 0.5)'
            }}
            transition={{ duration: 2, ease: "easeInOut", repeat: currentState === 'INTENCAO' ? Infinity : 0, repeatType: "reverse" }}
            className="w-32 h-32 rounded-full bg-[#000000] border border-white/20 z-20"
          />
          
          {/* Orbital Rings SVG */}
          <motion.svg 
            animate={{ 
              rotateX: currentState === 'ALINHAMENTO' ? 70 : 60,
              rotateZ: currentState === 'ALINHAMENTO' ? 0 : 360,
              scale: currentState === 'PROCESSANDO' ? 0 : 1,
              opacity: currentState === 'PROCESSANDO' ? 0 : 1,
            }}
            transition={{ 
              rotateZ: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 1 },
              rotateX: { duration: 1.5, ease: easeInOut }
            }}
            viewBox="0 0 300 300"
            className="absolute w-[300px] h-[300px] z-10 opacity-60"
          >
            <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            <circle cx="150" cy="10" r="4" fill="white" />
          </motion.svg>

          <motion.svg 
            animate={{ 
              rotateX: currentState === 'ALINHAMENTO' ? 70 : 65,
              rotateZ: currentState === 'ALINHAMENTO' ? 0 : -360,
              scale: currentState === 'PROCESSANDO' ? 0 : 1,
              opacity: currentState === 'PROCESSANDO' ? 0 : 1,
            }}
            transition={{ 
              rotateZ: { duration: 40, repeat: Infinity, ease: "linear" },
              scale: { duration: 1 },
              rotateX: { duration: 1.5, ease: easeInOut }
            }}
            viewBox="0 0 400 400"
            className="absolute w-[400px] h-[400px] z-10 opacity-30"
          >
            <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="200" cy="390" r="3" fill="white" />
          </motion.svg>
          
          {/* Label for Vision */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: currentState === 'ALINHAMENTO' ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute -top-12 text-white/60 text-[9px] tracking-[0.4em] font-light uppercase"
          >
            Visão
          </motion.div>
        </motion.div>

        {/* ORB 2: The Now / Current Reality */}
        <motion.div
          initial={{ y: 200, scale: 0, opacity: 0 }}
          animate={{
            y: currentState === 'ALINHAMENTO' ? 150 : 0,
            scale: currentState === 'LOCALIZACAO' ? 1 : currentState === 'ALINHAMENTO' ? 0.8 : 0,
            opacity: (currentState === 'LOCALIZACAO' || currentState === 'ALINHAMENTO') ? 1 : 0,
          }}
          transition={{ duration: 1.5, ease: easeInOut }}
          className="absolute flex items-center justify-center"
        >
          {/* Current Planet (Dark Obsidian) */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#000000] border border-white/10 shadow-[inset_-5px_-5px_20px_rgba(0,0,0,0.8)] z-20" />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: currentState === 'ALINHAMENTO' ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute -bottom-10 text-white/60 text-[9px] tracking-[0.4em] font-light uppercase"
          >
            Agora
          </motion.div>
        </motion.div>

        {/* THE ALIGNMENT BEAM */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ 
            scaleY: currentState === 'ALINHAMENTO' ? 1 : 0,
            opacity: currentState === 'ALINHAMENTO' ? 1 : 0 
          }}
          transition={{ duration: 1.5, ease: easeInOut, delay: 0.2 }}
          className="absolute h-[300px] w-px bg-gradient-to-b from-white via-white/30 to-transparent origin-top z-0"
          style={{ top: 'calc(50% - 150px)' }}
        />
      </div>

      {/* UI LAYER (INPUTS & CARDS - GLASSMORPHISM) */}
      <div className="relative z-30 w-full max-w-md px-6 flex flex-col items-center justify-center h-full">
        <AnimatePresence mode="wait">
          
          {/* FASE 1: INTENCAO */}
          {currentState === 'INTENCAO' && (
            <motion.div 
              key="intencao"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="w-full text-center mt-48"
            >
              <h2 className="text-white/60 text-xs tracking-[0.2em] font-light mb-8 uppercase">
                Qual a sua intenção principal para o próximo ciclo?
              </h2>
              <form onSubmit={handleIntencaoSubmit} className="relative w-full">
                <div className="relative flex items-center justify-between bg-white/5 border border-white/20 rounded-full px-6 py-4 backdrop-blur-2xl">
                  <input
                    type="text"
                    value={intencao}
                    onChange={(e) => setIntencao(e.target.value)}
                    placeholder="Ex: Expansão financeira, Casamento..."
                    autoFocus
                    className="w-full bg-transparent text-white text-sm font-light placeholder:text-white/30 outline-none"
                  />
                  <button 
                    type="submit"
                    disabled={!intencao.trim()}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-20 hover:scale-105 transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
              
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {['Multiplicar Patrimônio', 'Atrair Parceiro', 'Reconhecimento'].map((tag) => (
                  <button 
                    key={tag}
                    type="button"
                    onClick={() => { setIntencao(tag); setTimeout(() => handleIntencaoSubmit(), 100); }}
                    className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-[10px] tracking-wider uppercase hover:bg-white/10 hover:text-white hover:border-white/30 transition-all backdrop-blur-md"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* FASE 2: PROCESSANDO */}
          {currentState === 'PROCESSANDO' && (
            <motion.div 
              key="processando"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute text-center mt-60"
            >
              <div className="text-white text-[10px] tracking-[0.4em] uppercase font-light animate-pulse mb-3">
                Calculando Efemérides
              </div>
              <div className="text-white/80 text-lg font-light tracking-wide">
                {intencao}
              </div>
            </motion.div>
          )}

          {/* FASE 3: LOCALIZACAO */}
          {currentState === 'LOCALIZACAO' && (
            <motion.div 
              key="localizacao"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="w-full text-center mt-64"
            >
              <h2 className="text-white/60 text-xs tracking-[0.2em] font-light mb-8 uppercase">
                Onde você está localizado agora?
              </h2>
              <form onSubmit={handleLocalizacaoSubmit} className="relative w-full">
                 <div className="relative flex items-center justify-between bg-white/5 border border-white/20 rounded-full px-6 py-4 backdrop-blur-2xl">
                  <input
                    type="text"
                    value={localizacao}
                    onChange={(e) => setLocalizacao(e.target.value)}
                    placeholder="Ex: São Paulo, Brasil"
                    autoFocus
                    className="w-full bg-transparent text-white text-sm font-light placeholder:text-white/30 outline-none"
                  />
                  <button 
                    type="submit"
                    disabled={!localizacao.trim()}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-20 hover:scale-105 transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* FASE 4: ALINHAMENTO (RESULTADO) */}
          {currentState === 'ALINHAMENTO' && (
            <motion.div 
              key="alinhamento"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute w-full px-6 flex justify-center items-center h-full pointer-events-auto"
            >
              <div className="w-full max-w-sm rounded-[2rem] bg-white/5 border border-white/20 p-8 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <div className="text-white font-light text-2xl tracking-wide mb-2">Rota Identificada</div>
                    <div className="text-white/50 text-[10px] uppercase tracking-[0.2em]">Alinhamento necessário</div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                    <Compass className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-3 mb-10 relative z-10">
                  <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-white/50 text-[10px] uppercase tracking-widest">Origem</span>
                    <span className="text-white text-xs font-light tracking-wide">{localizacao || "Seu Local"}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/10 border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <span className="text-white/50 text-[10px] uppercase tracking-widest">Intenção</span>
                    <span className="text-white text-xs font-medium tracking-wide truncate max-w-[150px] text-right">{intencao}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/v2/game')}
                  className="w-full py-4 rounded-full border border-white/30 bg-white/10 text-white font-light text-[10px] uppercase tracking-[0.3em] hover:bg-white/20 transition-all active:scale-[0.98] relative z-10"
                >
                  Revelar o Destino Ideal
                </button>
                
                {/* Subtle internal glow */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}

