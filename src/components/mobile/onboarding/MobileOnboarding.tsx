import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Screen1 } from './screens/Screen1';
import { Screen2 } from './screens/Screen2';
import { Screen3 } from './screens/Screen3';
import { Screen4 } from './screens/Screen4';
import { Screen5 } from './screens/Screen5';
import { Screen6 } from './screens/Screen6';
import { OnboardingNav } from './OnboardingNav';
import { useNavigate } from 'react-router-dom';

export default function MobileOnboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const goNext = () => {
    if (step < 6) {
      setStep(s => s + 1);
    } else {
      localStorage.setItem('ps_onboarding_completed', 'true');
      navigate('/');
    }
  };

  const goPrev = () => setStep(s => Math.max(1, s - 1));

  return (
    <div className="w-full h-[100dvh] bg-[#030306] overflow-hidden relative selection:bg-white/20">

      <AnimatePresence mode="wait">
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
          {step === 6 && <Screen6 />}
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

