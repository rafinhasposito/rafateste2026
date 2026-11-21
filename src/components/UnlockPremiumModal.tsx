import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, X, Compass, ChevronRight, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export type UnlockTargetType = 'foco' | 'rota' | 'all_focuses' | 'full_map';

export interface UnlockTargetArea {
  id: string;
  label: string;
  color: string;
  type: UnlockTargetType;
  houseNum?: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (id: string, type: 'single' | 'full') => void;
  onBuyCredits?: (requiredCredits?: number, purchaseType?: 'single' | 'full') => void;
  targetArea?: UnlockTargetArea | null;
  isEmbedded?: boolean;
  userCredits?: number;
  isAdmin?: boolean;
  houseCost?: number;
  fullMapCost?: number;
  focusCost?: number;
  allFocusesCost?: number;
  remainingHousesCount?: number;
  remainingFocusesCount?: number;
}

const formatCreditsLabel = (count: number) => `${count} ${count === 1 ? 'Crédito' : 'Créditos'}`;

export default function UnlockPremiumModal({
  isOpen,
  onClose,
  onSuccess,
  onBuyCredits,
  targetArea,
  isEmbedded,
  userCredits,
  isAdmin = false,
  houseCost = 1,
  fullMapCost = 7,
  focusCost = 1,
  allFocusesCost = 3,
  remainingHousesCount,
  remainingFocusesCount,
}: Props) {
  if (!isOpen || !targetArea) return null;

  const color = targetArea.color || '#10b981';
  const type = targetArea.type;
  const isFoco = type === 'foco';
  const isAllFocuses = type === 'all_focuses';
  const isFullMap = type === 'full_map';
  const isRota = type === 'rota';
  const isFocusScope = isFoco || isAllFocuses;

  const label = targetArea.label || (isFocusScope ? 'Intenção' : 'Rota de Destino');
  const houseTag = targetArea.houseNum ? `Casa ${targetArea.houseNum}` : label;

  const singleCost = isFoco ? focusCost : houseCost;
  const fullCost = isFocusScope ? allFocusesCost : fullMapCost;
  const primaryCost = isAllFocuses || isFullMap ? fullCost : singleCost;

  const hasEnoughCredits = (cost: number) => isAdmin || userCredits === undefined || userCredits >= cost;
  const canAffordPrimary = hasEnoughCredits(primaryCost);
  const canAffordSingle = hasEnoughCredits(singleCost);
  const canAffordFull = hasEnoughCredits(fullCost);

  const showUpsellOption =
    (isFoco && (remainingFocusesCount === undefined || remainingFocusesCount > 1)) ||
    (isRota && (remainingHousesCount === undefined || remainingHousesCount > 1));

  const badgeText = isAllFocuses
    ? `TODOS OS FOCOS · ${houseTag.toUpperCase()}`
    : isFullMap
      ? 'VISÃO 360º COMPLETA'
      : isFoco
        ? 'FOCO EM DESTAQUE'
        : 'ROTA SELECIONADA';

  const titlePrefix = isAllFocuses
    ? 'Desbloquear todos os focos da'
    : isFullMap
      ? 'Desbloquear o'
      : isFoco
        ? 'Desbloquear foco em'
        : 'Desbloquear rota da';

  const titleHighlight = isAllFocuses
    ? houseTag
    : isFullMap
      ? 'Mapa Completo'
      : isRota && targetArea.houseNum && !label.toLowerCase().includes('casa')
        ? `Casa ${targetArea.houseNum} · ${label}`
        : label;

  const handleAction = (purchaseType: 'single' | 'full', cost: number) => {
    if (!hasEnoughCredits(cost)) {
      onClose();
      if (onBuyCredits) {
        onBuyCredits(cost, purchaseType);
      } else {
        toast.error(`Você precisa de ${formatCreditsLabel(cost)} para este desbloqueio.`);
      }
      return;
    }

    onClose();
    if (!isEmbedded) {
      if (purchaseType === 'single') {
        toast.success(`${isFoco ? 'Foco em' : 'Rota de'} ${label} desbloqueado com sucesso!`);
      } else {
        toast.success(
          isFocusScope
            ? 'Todos os Focos desta Casa foram desbloqueados com sucesso!'
            : 'Visão 360º desbloqueada! Todas as 12 Casas estão livres.'
        );
      }
    }
    if (onSuccess) {
      onSuccess(targetArea.id, purchaseType);
    }
  };

  const includedFeatures = isFocusScope
    ? [
        'Dossiê Astrológico Completo do Foco',
        'As 3 Rotas Alternativas',
        'Ritual de Imantação 24h',
        'Mantra de Poder',
      ]
    : [
        '1º Foco de cada Casa já incluso',
        'Cidade Principal e Dossiê da Casa',
        'As 3 Rotas Alternativas',
        'Ritual de Imantação 24h & Mantra',
      ];

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
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 bg-white/5 hover:bg-white/15 border border-white/10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-white/70 hover:text-white" />
          </button>

          {/* Coluna Esquerda: Contexto e Valor */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10">
            <div
              className="flex items-center gap-2.5 px-4 py-2 rounded-full w-fit mb-5 border shadow-sm backdrop-blur-sm"
              style={{ borderColor: `${color}50`, backgroundColor: `${color}15` }}
            >
              <Lock className="w-3.5 h-3.5 shrink-0" style={{ color }} />
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold" style={{ color }}>
                {badgeText}
              </span>
            </div>

            <h2 className="font-ps-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold tracking-tight mb-4 leading-[1.1]">
              {titlePrefix} <br />
              <span
                className="inline-block mt-1 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] font-extrabold"
                style={{ color }}
              >
                {titleHighlight}
              </span>
            </h2>

            <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed mb-6 font-light">
              {isAllFocuses ? (
                <>
                  Libera {remainingFocusesCount ? `todos os ${remainingFocusesCount} Focos restantes` : 'todos os Focos restantes'} da{' '}
                  <strong className="text-white font-semibold">{houseTag}</strong> de uma só vez.
                </>
              ) : isFullMap ? (
                <>
                  Super Promoção: libera {remainingHousesCount ? `todas as ${remainingHousesCount} Casas restantes` : 'todas as 12 Casas'} da sua Revolução Solar + <strong className="text-white font-semibold">TODOS os Focos de todas as Casas</strong> de uma só vez.
                </>
              ) : isFoco ? (
                <>
                  Liberar este Foco revela a cidade exata que destrava o seu potencial máximo em{' '}
                  <strong className="text-white font-semibold underline decoration-white/30 underline-offset-4">{label}</strong> na {houseTag}.
                </>
              ) : (
                <>
                  A Rota para <strong className="text-white font-semibold">{label}</strong> revela a coordenada geográfica que catalisa esta área no seu ano — e já inclui o 1º Foco desta Casa.
                </>
              )}
            </p>

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
                  {isFocusScope ? 'Ativação exclusiva do ciclo anual' : 'Ancoragem geográfica solar'}
                </p>
                <p className="text-white/50 text-[11px] leading-tight">
                  Inclui coordenadas GPS, cálculo astronômico e manual de imantação de 24h.
                </p>
              </div>
            </div>

            <ul className="space-y-3">
              {includedFeatures.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/75 text-xs sm:text-sm">
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna Direita: Confirmação Clara por Créditos */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 bg-black/40 flex flex-col justify-center">
            {(isFoco || isRota) && (
              <div
                className="bg-[#121217] border rounded-2xl p-6 mb-4 hover:border-white/40 transition-all shadow-xl relative overflow-hidden"
                style={{ borderColor: `${color}45` }}
              >
                <div
                  className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: color }}
                />

                <div className="flex justify-between items-start gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-0.5">
                      Passe Individual
                    </span>
                    <h4 className="font-bold text-xl md:text-2xl transition-colors" style={{ color }}>
                      {label}
                    </h4>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-mono font-bold text-lg md:text-xl text-white">
                      {formatCreditsLabel(singleCost)}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-white/40">ativação única</span>
                  </div>
                </div>

                <p className="text-white/60 text-xs md:text-sm mb-6 leading-relaxed">
                  {isFoco ? (
                    <>Desbloqueia apenas a energia de <strong className="text-white font-medium">{label}</strong> para a {houseTag}.</>
                  ) : (
                    <>Desbloqueia <strong className="text-white font-medium">{label}</strong> e libera a escolha do seu 1º Foco incluso.</>
                  )}
                </p>

                <button
                  type="button"
                  onClick={() => handleAction('single', singleCost)}
                  className="w-full py-4 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all shadow-xl text-black hover:scale-[1.01] active:scale-[0.99] hover:brightness-105 cursor-pointer"
                  style={{ backgroundColor: canAffordSingle ? '#ffffff' : '#F5B041' }}
                >
                  {canAffordSingle ? (
                    <>
                      <span>Desbloquear {label}</span>
                      <span className="text-xs font-normal opacity-75">({formatCreditsLabel(singleCost)})</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Adquirir Créditos ({formatCreditsLabel(singleCost)})</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {(showUpsellOption || isAllFocuses || isFullMap) && (
              <div
                className="relative bg-gradient-to-b from-[#18181f] to-[#0d0d12] border rounded-2xl p-6 hover:brightness-110 transition-all shadow-xl"
                style={{ borderColor: `${color}50` }}
              >
                <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-md">
                  <span className="font-mono text-[9px] uppercase font-bold text-black tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {isAllFocuses || isFullMap ? 'Pacote Completo' : 'Melhor Custo-Benefício'}
                  </span>
                </div>

                <div className="flex justify-between items-start gap-3 mb-2 mt-2">
                  <h4 className="text-white font-bold text-xl">
                    {isFocusScope ? `Pacote Expansão (${houseTag})` : 'Mapa Completo (12 Casas + Todos os Focos)'}
                  </h4>
                  <div className="font-mono font-bold shrink-0" style={{ color }}>
                    {formatCreditsLabel(fullCost)}
                  </div>
                </div>

                <p className="text-white/55 text-sm mb-6 leading-relaxed">
                  {isFocusScope
                    ? remainingFocusesCount
                      ? `Libera todos os ${remainingFocusesCount} Focos restantes desta Casa de uma só vez.`
                      : 'Libera a Casa escolhida com todos os Focos desbloqueados.'
                    : 'Super Promoção: libera TODAS as 12 Casas + TODOS os Focos de todas as Casas de uma só vez.'}
                </p>

                <button
                  type="button"
                  onClick={() => handleAction('full', fullCost)}
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-colors shadow-2xl cursor-pointer hover:brightness-110"
                  style={
                    canAffordFull
                      ? { backgroundColor: `${color}25`, borderColor: `${color}60`, color: '#ffffff' }
                      : { backgroundColor: '#F5B041', borderColor: '#F5B041', color: '#050507' }
                  }
                >
                  {canAffordFull ? (
                    <>
                      <Compass className="w-4 h-4" />
                      <span>
                        {isFocusScope ? `Liberar Todos os Focos (${formatCreditsLabel(fullCost)})` : `Liberar 12 Casas + Focos (${formatCreditsLabel(fullCost)})`}
                      </span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>{isFocusScope ? 'Ativar Pacote Expansão (R$ 49,90)' : 'Ativar Mapa Completo (R$ 99,90)'}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Saldo de créditos e status */}
            {userCredits !== undefined && (
              <div className="text-center mt-5">
                <p className="text-white/40 text-xs">
                  Você possui{' '}
                  <span className="text-white font-bold">
                    {formatCreditsLabel(userCredits)}
                  </span>{' '}
                  na sua conta{isAdmin ? ' (modo Admin)' : ''}.
                </p>
                {!canAffordPrimary && !isAdmin && (
                  <p className="text-amber-400 text-[11px] mt-1.5 font-medium">
                    Saldo insuficiente para esta opção. Clique acima para adquirir créditos.
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
