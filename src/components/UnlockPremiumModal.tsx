import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, X, Compass, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (id: string, type: 'single' | 'full') => void;
  targetArea?: { id: string; label: string; color: string; type: 'foco' | 'rota' } | null;
  isEmbedded?: boolean;
  userCredits?: number;
}

export default function UnlockPremiumModal({ isOpen, onClose, onSuccess, targetArea, isEmbedded, userCredits, houseCost = 1, fullMapCost = 7, focusCost = 1, allFocusesCost = 3 }: Props & { houseCost?: number; fullMapCost?: number, focusCost?: number, allFocusesCost?: number }) {
  if (!isOpen) return null;
  const color = targetArea?.color || '#10b981';
  const isFoco = targetArea?.type === 'foco';

  const handleUnlock = (purchaseType: 'single' | 'full') => {
    onClose();
    if (!isEmbedded) {
      if (purchaseType === 'single') {
        toast.success(`${isFoco ? 'Intenção' : 'Rota'} de ${targetArea?.label || 'Destino'} desbloqueada com sucesso!`);
      } else {
        toast.success(isFoco ? "Todas as Intenções desbloqueadas com sucesso!" : "Visão 360º desbloqueada! Todas as 12 Casas e Focos estão livres.");
      }
    }
    if (onSuccess && targetArea) {
      onSuccess(targetArea.id, purchaseType);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)]"
        >
          {/* Efeito Glow Direcional */}
          <div className="absolute top-0 right-0 w-96 h-96 blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: color }}></div>

          <button onClick={onClose} className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
            <X className="w-5 h-5 text-white/50" />
          </button>

          {/* Coluna Esquerda: O Desejo */}
          <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full w-fit mb-8 border" style={{ borderColor: `${color}30` }}>
              <Lock className="w-4 h-4" style={{ color }} />
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold" style={{ color }}>Acesso Restrito</span>
            </div>

            <h2 className="font-ps-display text-4xl md:text-5xl text-white font-bold tracking-tighter mb-4">
              Desbloqueie <span style={{ color }}>{isFoco ? 'a Intenção' : 'a Casa'}</span>.
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              {isFoco 
                ? `Liberar este Foco revela a cidade exata que destrava o seu potencial máximo em ${targetArea?.label || 'sua vida'}.`
                : `A sua Rota de Ancoragem para a ${targetArea?.label || 'área'} revela a cidade exata que destrava este potencial.`}
            </p>

            <ul className="space-y-4">
              {[
                "Dossiê Astrológico Completo",
                "As 3 Rotas Alternativas",
                "Ritual de Imantação 24h",
                "Mantra de Poder"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70">
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna Direita: O Paywall */}
          <div className="w-full md:w-1/2 p-10 md:p-14 bg-black/40 flex flex-col justify-center">
            
            {/* Opção 1 */}
            <div onClick={() => handleUnlock('single')} className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-4 hover:border-white/30 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-bold text-xl">Passe Único</h4>
                <div className="font-mono font-bold text-white/50 group-hover:text-white transition-colors">{isFoco ? focusCost : houseCost} Crédito{(isFoco ? focusCost : houseCost) > 1 ? "s" : ""}</div>
              </div>
              <p className="text-white/40 text-sm mb-6">
                Desbloqueia apenas {isFoco ? 'a intenção de ' : 'a rota de '} {targetArea?.label || 'Destino'}.
              </p>
              <button className="w-full py-4 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors pointer-events-none">
                {isFoco ? 'Desbloquear Intenção' : 'Desbloquear Rota'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Opção 2 */}
            {!isFoco && (
              <div onClick={() => handleUnlock('full')} className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border rounded-2xl p-6 hover:brightness-110 transition-all cursor-pointer group" style={{ borderColor: `${color}50` }}>
                <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                  <span className="font-mono text-[9px] uppercase font-bold text-black tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Melhor Custo-Benefício
                  </span>
                </div>
                <div className="flex justify-between items-start mb-2 mt-2">
                  <h4 className="text-white font-bold text-xl">{isFoco ? 'Todas as Intenções' : 'Visão 360º Completa'}</h4>
                  <div className="font-mono font-bold" style={{ color }}>{isFoco ? allFocusesCost : fullMapCost} Créditos</div>
                </div>
                <p className="text-white/50 text-sm mb-6">{isFoco ? 'Desbloqueia todas as Intenções desta mesma Casa de uma vez.' : 'Desbloqueia as 11 Rotas restantes do seu mapa de uma só vez.'}</p>
                <button className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white border transition-colors shadow-2xl pointer-events-none" style={{ backgroundColor: `${color}20`, borderColor: `${color}50` }}>
                  <Compass className="w-4 h-4" /> {isFoco ? 'Expandir Todas' : 'Expandir Mapa Inteiro'}
                </button>
              </div>
            )}

            <p className="text-center text-white/30 text-xs mt-6">
              Você possui <span className="text-white/60 font-bold">{userCredits ?? 0} Créditos</span> na sua conta.
            </p>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
