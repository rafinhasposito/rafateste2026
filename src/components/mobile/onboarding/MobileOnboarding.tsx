import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Screen1 } from './screens/Screen1';
import { Screen2 } from './screens/Screen2';
import { Screen3 } from './screens/Screen3';
import { Screen4 } from './screens/Screen4';
import { Screen5 } from './screens/Screen5';
import { Screen6 } from './screens/Screen6';
import { OnboardingNav } from './OnboardingNav';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, Compass, ArrowRight } from 'lucide-react';

export default function MobileOnboarding() {
  // Começa no Portal de Entrada (step 0): abre em 0.05s sem depender de vídeo
  // enquanto faz o pré-carregamento invisível do vídeo da Terra em segundo plano.
  const [step, setStep] = useState(0);
  const [earthReady, setEarthReady] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const img = new Image();
    img.src = '/assets/earth-blue.jpg';
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [step]);

  const goNext = () => {
    if (step < 6) {
      setStep(s => s + 1);
    } else {
      localStorage.setItem('ps_onboarding_completed', 'true');
      if (user) {
        navigate('/');
      } else {
        navigate('/auth');
      }
    }
  };

  const skipToHome = () => {
    localStorage.setItem('ps_onboarding_completed', 'true');
    navigate('/');
  };

  const goPrev = () => setStep(s => Math.max(1, s - 1));

  return (
    <div className="w-full h-[100dvh] bg-[#030306] overflow-hidden relative selection:bg-white/20">
      {/* Pré-carregador invisível em segundo plano: baixa o vídeo da Tela 1 enquanto o usuário lê a pergunta do Portal */}
      <video
        src="/assets/vecteezy-earth.mp4"
        preload="auto"
        muted
        playsInline
        onCanPlayThrough={() => setEarthReady(true)}
        onLoadedData={() => setEarthReady(true)}
        className="hidden pointer-events-none w-0 h-0 opacity-0"
      />

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="portal-step-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full flex flex-col justify-between px-6 py-6 md:py-12 items-center text-center overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch] overscroll-y-contain"
          >
            {/* Fundo Cósmico Instantâneo (100% CSS/GPU — 0 KB de download) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,162,39,0.14)_0%,_rgba(8,17,31,0.65)_45%,_#030306_85%)] pointer-events-none" />
            
            {/* Anéis Orbitais Animados */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] md:w-[620px] md:h-[620px] rounded-full border border-[#C9A227]/15 pointer-events-none"
            >
              <div className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full bg-[#F5DE98] shadow-[0_0_20px_#C9A227]" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[440px] md:h-[440px] rounded-full border border-white/[0.06] pointer-events-none"
            >
              <div className="absolute top-1/2 -right-1 w-2 h-2 rounded-full bg-[#C9A227]/70" />
            </motion.div>

            {/* Topo: Logo */}
            <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between">
              <img
                src="/brand/protocolo-solar-logo-horizontal-4096.png"
                alt="Protocolo Solar"
                className="w-[150px] md:w-[240px] h-auto opacity-95"
                draggable={false}
              />
              <button
                onClick={skipToHome}
                className="text-[11px] font-ps-ui uppercase tracking-[0.2em] text-white/45 hover:text-white/80 px-3.5 py-2 rounded-full border border-white/10 bg-white/[0.03] transition-colors"
              >
                Ir ao Calculador →
              </button>
            </div>

            {/* Centro: A Pergunta Magnética */}
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center my-auto py-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A227]/35 bg-[#C9A227]/10 text-[#F5DE98] text-[10px] uppercase tracking-[0.26em] font-semibold mb-6 shadow-[0_0_30px_rgba(201,162,39,0.15)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E5C158]" />
                <span>Protocolo Solar · Revolução Anual</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-ps-display text-3xl sm:text-5xl md:text-6xl text-white font-bold leading-[1.12] tracking-tight mb-6"
              >
                Quer descobrir <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5DE98] via-[#E5C158] to-[#C9A227]">onde passar seu aniversário</span> e mudar a energia do seu ano?
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-ps-ui text-white/65 text-sm sm:text-base md:text-lg font-light max-w-lg leading-relaxed mb-10"
              >
                A cidade onde você vira o seu ciclo anual pode ativar prosperidade, amor, carreira ou saúde pelos próximos 12 meses.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="w-full max-w-sm flex flex-col gap-3"
              >
                <button
                  onClick={() => setStep(1)}
                  className="w-full h-14 md:h-16 px-8 rounded-2xl bg-gradient-to-r from-[#E5C158] to-[#C9A227] hover:from-[#F5DE98] hover:to-[#E5C158] text-[#02050A] font-ps-display font-bold text-sm sm:text-base uppercase tracking-[0.14em] flex items-center justify-center gap-3 shadow-[0_12px_40px_rgba(201,162,39,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span>Sim, Quero Descobrir</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  onClick={skipToHome}
                  className="w-full py-3 rounded-xl text-white/50 hover:text-white text-xs font-ps-ui uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5 text-[#C9A227]/70" />
                  <span>Já conheço · Calcular minha rota agora</span>
                </button>
              </motion.div>
            </div>

            {/* Rodapé discreto indicando status de sincronização */}
            <div className="relative z-10 flex items-center gap-2 text-[10px] font-ps-ui uppercase tracking-[0.25em] text-white/35">
              <span className={`w-1.5 h-1.5 rounded-full ${earthReady ? 'bg-emerald-400' : 'bg-[#C9A227] animate-pulse'}`} />
              <span>{earthReady ? 'Experiência 3D Pronta' : 'Sincronizando Atlas Planetário...'}</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {step === 1 && <Screen1 />}
            {step === 2 && <Screen2 />}
            {step === 3 && <Screen3 />}
            {step === 4 && <Screen4 />}
            {step === 5 && <Screen5 />}
            {step === 6 && <Screen6 onComplete={goNext} />}
          </motion.div>
        )}
      </AnimatePresence>

      {step >= 1 && (
        <OnboardingNav
          step={step}
          totalSteps={6}
          onNext={goNext}
          onPrev={goPrev}
          isFinal={step === 6}
        />
      )}
    </div>
  );
}
