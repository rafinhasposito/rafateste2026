import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, AlertTriangle, Lock, Sparkles, X, Crown, Shield } from 'lucide-react';

interface UnlockPremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAreaLabel?: string;
  targetAreaColor?: string;
  onUnlock: (option: 'single' | 'bundle' | 'all') => void;
  userCredits: number;
}

export default function UnlockPremiumModal({ 
  isOpen, 
  onClose, 
  targetAreaLabel = "Casa Astrológica", 
  targetAreaColor = "#FBBF24",
  onUnlock,
  userCredits
}: UnlockPremiumModalProps) {
  
  const [selectedOption, setSelectedOption] = useState<'single' | 'bundle' | 'all' | null>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          onClick={onClose}
          className="absolute inset-0 bg-[#03100B]/80"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#080808] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none" />

          {/* Left Side: Editorial & Value Prop */}
          <div className="w-full md:w-[45%] p-10 md:p-14 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between relative overflow-hidden bg-black/40">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                <Lock className="w-5 h-5 text-amber-500" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-ps-display font-bold text-white leading-tight mb-4 tracking-tight">
                Você descobriu uma área trancada.
              </h2>
              
              <p className="text-white/60 text-lg font-light leading-relaxed mb-8">
                O dossiê de <strong className="text-white font-medium" style={{ color: targetAreaColor }}>{targetAreaLabel}</strong> contém rituais práticos, mantras magnéticos e a linha do tempo exata de acontecimentos nesta cidade.
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="text-white/80 text-sm font-medium">Acesso Vitalício ao Laudo</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-amber-500" />
                <span className="text-white/80 text-sm font-medium">Alertas de Autossabotagem</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-white/80 text-sm font-medium">Ritual Prático de 24h</span>
              </div>
            </div>
          </div>

          {/* Right Side: Credit Selection */}
          <div className="w-full md:w-[55%] p-10 md:p-14 bg-[#0a0a0a] flex flex-col justify-center relative">
            <button onClick={onClose} className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 text-white/50" />
            </button>

            <div className="flex items-center justify-between mb-10">
              <h3 className="font-mono text-xs tracking-widest uppercase text-white/50 font-bold">Desbloquear Dossiê</h3>
              <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
                <CreditCard className="w-4 h-4 text-amber-500" />
                <span className="font-mono text-xs font-bold text-amber-500">{userCredits} créditos disponíveis</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Option 1: Single */}
              <div 
                onClick={() => setSelectedOption('single')}
                className={`w-full p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${selectedOption === 'single' ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-white font-medium text-lg">Apenas {targetAreaLabel}</h4>
                  <span className="font-mono text-sm text-white/60 line-through">2 créditos</span>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-white/50 text-sm">Libera o acesso completo para esta área da vida.</p>
                  <span className="font-ps-display text-2xl text-amber-500 font-bold">1 Crédito</span>
                </div>
              </div>

              {/* Option 2: All 11 */}
              <div 
                onClick={() => setSelectedOption('all')}
                className={`w-full p-6 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden ${selectedOption === 'all' ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
              >
                {/* Popular Badge */}
                <div className="absolute top-0 right-0 bg-amber-500 text-black font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-bl-lg">
                  Mais Vantajoso
                </div>
                
                <div className="flex justify-between items-center mb-2 pr-24">
                  <h4 className="text-white font-medium text-lg">O Laudo Completo (11 Casas)</h4>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-white/50 text-sm max-w-[70%]">Desbloqueia Amor, Saúde, Finanças e todas as outras 8 áreas em Nova York.</p>
                  <span className="font-ps-display text-2xl text-amber-500 font-bold">7 Créditos</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <button 
                disabled={!selectedOption || userCredits < (selectedOption === 'all' ? 7 : 1)}
                onClick={() => selectedOption && onUnlock(selectedOption)}
                className="w-full py-5 rounded-2xl bg-amber-500 text-black font-bold text-sm tracking-widest uppercase hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-[0_0_40px_rgba(245,158,11,0.3)]"
              >
                {!selectedOption 
                  ? "Selecione uma opção" 
                  : userCredits < (selectedOption === 'all' ? 7 : 1) 
                    ? "Créditos Insuficientes" 
                    : "Confirmar Desbloqueio"}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-white/40">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-[10px] uppercase font-mono tracking-widest">Ação irreversível. O consumo é imediato.</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
