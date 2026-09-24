/**
 * PremiumButton.tsx
 * Shell Global — Design System v2.0
 *
 * Botão com variantes React. Substitui .btn-gold-luxury e .btn-ghost-premium.
 * Três variantes: primary (gold CTA), ghost, outline.
 * Três tamanhos: sm, md, lg.
 *
 * Accessibilidade:
 * - disabled desativa visualmente e semanticamente (aria-disabled)
 * - loading mostra spinner e bloqueia interação
 * - focus-visible outline dourado
 */
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export type PremiumButtonVariant = "primary" | "ghost" | "outline";
export type PremiumButtonSize = "sm" | "md" | "lg";

export interface PremiumButtonProps
  extends Omit<HTMLMotionProps<"button">, "children" | "size"> {
  variant?: PremiumButtonVariant;
  size?: PremiumButtonSize;
  loading?: boolean;
  disabled?: boolean;
  /** Ícone à esquerda */
  iconLeft?: React.ReactNode;
  /** Ícone à direita */
  iconRight?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<PremiumButtonVariant, string> = {
  primary: [
    // DS: gradiente gold — inevitável: Tailwind não interpola múltiplas paradas de cor via var()
    "relative overflow-hidden",
    "bg-gradient-to-br from-[#C28912] via-[#C9A227] to-[#F5E09C]",
    "text-[#030306]", // DS: --background (void black)
    "font-bold tracking-[0.16em] uppercase",
    // DS: sombra composta inevitável
    "shadow-[0_0_24px_rgba(212,175,55,0.3),0_4px_12px_rgba(0,0,0,0.5)]",
    "hover:shadow-[0_0_40px_rgba(212,175,55,0.5),0_6px_20px_rgba(0,0,0,0.6)]",
    "hover:brightness-105",
    "active:brightness-95 active:scale-[0.98]",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A227] focus-visible:outline-offset-2",
  ].join(" "),

  ghost: [
    // DS: branco translúcido — bg-white/5 é equivalente semântico
    "bg-white/5 backdrop-blur-sm",
    "text-white/80",
    "font-medium tracking-[0.12em] uppercase",
    "border border-white/[0.12]",
    "hover:bg-white/10 hover:border-white/[0.22] hover:text-white",
    "active:scale-[0.98]",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50 focus-visible:outline-offset-2",
  ].join(" "),

  outline: [
    "bg-transparent",
    "text-[#C9A227]", // DS: --gold
    "font-medium tracking-[0.12em] uppercase",
    "border border-[#C9A227]/35",
    "hover:bg-[#C9A227]/[0.06] hover:border-[#C9A227]/60",
    "active:scale-[0.98]",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A227] focus-visible:outline-offset-2",
  ].join(" "),
};

const sizeClasses: Record<PremiumButtonSize, string> = {
  sm: "h-9 px-4 text-[0.625rem] gap-1.5 rounded-full",
  md: "h-11 px-6 text-[0.6875rem] gap-2 rounded-full",
  lg: "h-14 px-8 text-[0.75rem] gap-2.5 rounded-full",
};

const Spinner: React.FC = () => (
  <svg
    className="animate-spin w-4 h-4 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  children,
  className = "",
  ...motionProps
}) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileTap={!isDisabled ? { scale: 0.97 } : undefined}
      transition={{ duration: 0.15 }}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={[
        "inline-flex items-center justify-center",
        "font-[var(--font-sans)]",
        "transition-all duration-[var(--motion-normal)]",
        "select-none cursor-pointer",
        sizeClasses[size],
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...motionProps}
    >
      {/* Inner highlight para primary (simula glossy) */}
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none"
        />
      )}

      {loading ? (
        <Spinner />
      ) : (
        <>
          {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
          <span>{children}</span>
          {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
        </>
      )}
    </motion.button>
  );
};
