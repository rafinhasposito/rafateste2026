import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, X, Compass, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (id: string, type: 'single' | 'full') => void;
  targetArea?: { id: string; label: string; color: string; type: 'foco' | 'rota'; houseNum?: number } | null;
  isEmbedded?: boolean;
  userCredits?: number;
}

export default function UnlockPremiumModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  targetArea, 
  isEmbedded, 
  userCredits, 
  houseCost = 1, 
  fullMapCost = 7, 
  focusCost = 1, 
  allFocusesCost = 3 
}: Props & { houseCost?: number; fullMapCost?: number; focusCost?: number; allFocusesCost?: number }) {
  if (!isOpen) return null;
  const color = targetArea?.color || '#10b981';
  const isFoco = targetArea?.type === 'foco';
  const label = targetArea?.label || (isFoco ? 'Intenção' : 'Rota de Destino');
  const requiredCredits = isFoco ? focusCost : houseCost;
  const hasCredits = (userCredits ?? 0) >= requiredCredits;

  const handleUnlock = (purchaseType: 'single' | 'full') => {
    onClose();
    if (!isEmbedded) {
      if (purchaseType === 'single') {
        toast.success(`${isFoco ? 'Foco em' : 'Rota de'} ${label} desbloqueado com sucesso!`);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0a0a0d] border border-white/10 rounded-[28px] md:rounded-[36px] flex flex-col md:flex-row shadow-[0_0_120px_rgba(0,0,0,0.8)] z-10"
        >
          {/* Efeito Glow Direcional Cósmico */}
          <div 
            className="absolute top-0 right-0 w-96 h-96 blur-[120px] opacity-25 pointer-events-none" 
            style={{ backgroundColor: color }} 
          />
          <div 
            className="absolute bottom-0 left-0 w-80 h-80 blur-[140px] opacity-15 pointer-events-none" 
            style={{ backgroundColor: color }} 
          />

          {/* Botão Fechar */}
          <button 
            onClick={onClose} 
            className="absolute top-5 right-5 z-20 w-10 h-10 bg-white/5 hover:bg-white/15 border border-white/10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-white/70 hover:text-white" />
          </button>

          {/* Coluna Esquerda: O Nome do Foco em Destaque Absoluto */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10">
            
            {/* Badge com Nome do Foco e Cor */}
            <div 
              className="flex items-center gap-2.5 px-4 py-2 rounded-full w-fit mb-5 border shadow-sm backdrop-blur-sm" 
              style={{ borderColor: `${color}50`, backgroundColor: `${color}15` }}
            >
              <Lock className="w-3.5 h-3.5 shrink-0" style={{ color }} />
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold" style={{ color }}>
                {isFoco ? `FOCO EM DESTAQUE` : `ROTA SELECIONADA`}
              </span>
            </div>

            {/* Título Principal com Nome do Foco em DESTAQUE GIGANTE */}
            <h2 className="font-ps-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold tracking-tight mb-4 leading-[1.1]">
              Desbloquear foco em <br />
              <span 
                className="inline-block mt-1 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] font-extrabold" 
                style={{ color }}
              >
                {label}
              </span>
            </h2>

            {/* Subtítulo explicando o benefício da escolha */}
            <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed mb-6 font-light">
              {isFoco 
                ? (
                  <>
                    Liberar este Foco revela a cidade exata que destrava o seu potencial máximo em <strong className="text-white font-semibold underline decoration-white/30 underline-offset-4">{label}</strong>.
                  </>
                ) : (
                  <>
                    A sua Rota de Ancoragem para a <strong className="text-white font-semibold">{label}</strong> revela a coordenada geográfica que catalisa este ano.
                  </>
                )}
            </p>

            {/* Card de Ativação do Ciclo */}
            <div 
              className="p-3.5 rounded-xl border mb-6 flex items-center gap-3 backdrop-blur-md"
              style={{ borderColor: `${color}35`, backgroundColor: `${color}08` }}
            >
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border shadow-inner"
                style={{ borderColor: `${color}50`, backgroundColor: `${color}25`, color }}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="text-white/90 font-medium">
                  {isFoco ? `Ativação exclusiva do ciclo anual` : `Ancoragem geográfica solar`}
                </p>
                <p className="text-white/50 text-[11px] leading-tight">
                  Inclui coordenadas GPS, cálculo astronômico e manual de imantação de 24h.
                </p>
              </div>
            </div>

            {/* O que está incluído */}
            <ul className="space-y-3">
              {[
                "Dossiê Astrológico Completo",
                "As 3 Rotas Alternativas",
                "Ritual de Imantação 24h",
                "Mantra de Poder",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/75 text-xs sm:text-sm">
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna Direita: O Paywall com Decisão Clara */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 bg-black/40 flex flex-col justify-center">
            
            {/* Card do Passe Único do Foco Selecionado */}
            <div 
              onClick={() => handleUnlock('single')} 
              className="bg-[#121217] border rounded-2xl p-6 mb-4 hover:border-white/40 transition-all cursor-pointer group shadow-xl relative overflow-hidden"
              style={{ borderColor: `${color}45` }}
            >
              {/* Glow sutil */}
              <div 
                className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none" 
                style={{ backgroundColor: color }} 
              />

              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-0.5">
                    Passe Individual
                  </span>
                  <h4 
                    className="font-bold text-xl md:text-2xl transition-colors"
                    style={{ color }}
                  >
                    {label}
                  </h4>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-mono font-bold text-lg md:text-xl text-white">
                    {requiredCredits} Crédito{requiredCredits > 1 ? "s" : ""}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/40">ativação única</span>
                </div>
              </div>

              <p className="text-white/60 text-xs md:text-sm mb-6 leading-relaxed">
                Desbloqueia apenas a energia de <strong className="text-white font-medium">{label}</strong> para o seu ano.
              </p>

              <button 
                className="w-full py-4 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all shadow-xl text-black hover:scale-[1.01] active:scale-[0.99] group-hover:brightness-105"
                style={{ backgroundColor: '#ffffff' }}
              >
                <span>Desbloquear {label}</span>
                <span className="text-xs font-normal opacity-70">
                  ({requiredCredits} crédito)
                </span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Opção 2: Visão 360º Completa (se for rota de casa) */}
            {!isFoco && (
              <div 
                onClick={() => handleUnlock('full')} 
                className="relative bg-gradient-to-b from-[#18181f] to-[#0d0d12] border rounded-2xl p-6 hover:brightness-110 transition-all cursor-pointer group shadow-xl" 
                style={{ borderColor: `${color}50` }}
              >
                <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-md">
                  <span className="font-mono text-[9px] uppercase font-bold text-black tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Melhor Custo-Benefício
                  </span>
                </div>
                <div className="flex justify-between items-start mb-2 mt-2">
                  <h4 className="text-white font-bold text-xl">Visão 360º Completa</h4>
                  <div className="font-mono font-bold" style={{ color }}>{fullMapCost} Créditos</div>
                </div>
                <p className="text-white/50 text-sm mb-6">
                  Desbloqueia as 11 Rotas restantes do seu mapa de uma só vez.
                </p>
                <button 
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white border transition-colors shadow-2xl pointer-events-none" 
                  style={{ backgroundColor: `${color}20`, borderColor: `${color}50` }}
                >
                  <Compass className="w-4 h-4" /> Expandir Mapa Inteiro
                </button>
              </div>
            )}

            {/* Saldo de créditos e status */}
            <div className="text-center mt-5">
              <p className="text-white/40 text-xs">
                Você possui <span className="text-white font-bold">{userCredits ?? 0} {userCredits === 1 ? 'Crédito' : 'Créditos'}</span> na sua conta.
              </p>
              {!hasCredits && (
                <p className="text-amber-400 text-[11px] mt-1.5 font-medium">
                  Saldo insuficiente. Adquira mais créditos para desbloquear.
                </p>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
