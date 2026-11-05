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

const ONBOARDING_PRELOAD_IMAGES = [
  '/assets/earth-blue.jpg',
  '/images/abertura/tokyo.jpg',
  '/images/abertura/zurich.jpg',
  '/images/abertura/ny.jpg',
  '/images/abertura/paris.jpg',
  '/images/abertura/stars.jpg',
  '/images/abertura/particles.jpg',
  '/images/abertura/roma.jpg',
];

export default function MobileOnboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Pré-carrega todas as imagens leves das telas 1 a 6 em memória assim que o onboarding abre
  useEffect(() => {
    ONBOARDING_PRELOAD_IMAGES.forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const goNext = () => {
    if (step < 6) {
      setStep(s => s + 1);
    } else {
      localStorage.setItem('ps_onboarding_completed', 'true');
      sessionStorage.setItem('ps_pending_mode', 'futuro');
      if (user) {
        navigate('/?mode=futuro');
      } else {
        navigate('/auth?setup=true');
      }
    }
  };

  const goPrev = () => setStep(s => Math.max(1, s - 1));

  return (
    <div className="relative min-h-[100svh] w-full bg-[#030306] overflow-x-hidden selection:bg-white/20">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full min-h-[100svh]"
        >
          {step === 1 && <Screen1 />}
          {step === 2 && <Screen2 />}
          {step === 3 && <Screen3 />}
          {step === 4 && <Screen4 />}
          {step === 5 && <Screen5 />}
          {step === 6 && <Screen6 onComplete={goNext} />}
        </motion.div>
      </AnimatePresence>

      <OnboardingNav
        step={step}
        totalSteps={6}
        onNext={goNext}
        onPrev={goPrev}
        isFinal={step === 6}
      />
    </div>
  );
}
