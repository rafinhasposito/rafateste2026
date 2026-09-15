/**
 * PremiumCard.tsx
 * Shell Global — Design System v2.0
 *
 * Card com os novos tokens de superfície.
 * Substitui .glass-panel progressivamente durante a migração.
 *
 * Variantes:
 * "base"     → fundo opaco escuro (telas funcionais)
 * "glass"    → glass neutro iOS-like (padrão)
 * "elevated" → glass mais elevado, mais blur (painéis flutuantes)
 *
 * Nota: "cinematic" não é uma variante de card.
 * Cinematografia pertence ao ambiente/página (CinematicBackground),
 * não a caixinhas individuais.
 */
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export type PremiumCardVariant = "base" | "glass" | "elevated";

export interface PremiumCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: PremiumCardVariant;
  /**
   * accent=true → borda + glow dourado sutil.
   * Usar somente em cards de destaque ou selecionados.
   */
  accent?: boolean;
  /**
   * hover=true → micro-animação de elevação ao passar o mouse.
   * Desative em cards dentro de listas longas para não poluir.
   */
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
  /** Acessibilidade: se o card for interativo, passe role e tabIndex */
  role?: string;
}

/** Base tokens — usam apenas variáveis da Foundation */
const variantStyles: Record<PremiumCardVariant, string> = {
  base: [
    // DS: --background + opacidade. rgba inevitável: valor parcial sem token Tailwind
    "bg-[rgba(15,15,15,0.85)]",
    "border border-white/[0.08]",
    "rounded-[var(--radius-lg)]",
    "shadow-[var(--shadow-md)]",
  ].join(" "),

  glass: [
    "bg-white/5",
    "backdrop-blur-xl",
    "border border-white/10",
    "rounded-[var(--radius-lg)]",
    // DS: sombra composta inevitável — Tailwind não suporta inset + múltiplos valores via var()
    "shadow-[0_20px_48px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]",
  ].join(" "),

  elevated: [
    "bg-white/[0.08]",
    "backdrop-blur-2xl",
    "border border-white/[0.14]",
    "rounded-[var(--radius-xl)]",
    // DS: sombra composta inevitável
    "shadow-[0_24px_56px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.12)]",
  ].join(" "),
};

// DS: --gold (#C9A227) como acento de borda/glow
const accentStyle =
  "border-[#C9A227]/30 shadow-[0_0_24px_rgba(212,175,55,0.12)]";

export const PremiumCard: React.FC<PremiumCardProps> = ({
  variant = "glass",
  accent = false,
  hover = false,
  children,
  className = "",
  role,
  ...motionProps
}) => {
  const baseClass = [
    variantStyles[variant],
    accent && accentStyle,
    "transition-all duration-[var(--motion-normal)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className={baseClass}
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      whileTap={hover ? { scale: 0.995 } : undefined}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      role={role}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};
