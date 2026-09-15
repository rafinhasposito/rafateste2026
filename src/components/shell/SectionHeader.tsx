/**
 * SectionHeader.tsx
 * Shell Global — Design System v2.0
 *
 * Tipografia de seção padronizada.
 * Cinzel para o título editorial.
 * Inter para label e subtítulo.
 *
 * Três alinhamentos: left, center, right.
 * divider opcional — linha dourada sutil abaixo do título.
 */
import React from "react";
import { motion } from "framer-motion";

export type SectionHeaderAlign = "left" | "center" | "right";

export interface SectionHeaderProps {
  /** Label menor acima do título (Inter, uppercase, tracking largo, dourado) */
  label?: string;
  /** Título principal (Cinzel, uppercase) */
  title: string;
  /** Subtítulo descritivo (Inter, muted) */
  subtitle?: string;
  /** Separador dourado minimalista abaixo do título */
  divider?: boolean;
  align?: SectionHeaderAlign;
  /** Permite animar a entrada do bloco */
  animate?: boolean;
  className?: string;
}

const alignClass: Record<SectionHeaderAlign, string> = {
  left:   "items-start text-left",
  center: "items-center text-center",
  right:  "items-end text-right",
};

const Divider: React.FC<{ align: SectionHeaderAlign }> = ({ align }) => (
  <div
    aria-hidden="true"
    className={[
      "flex items-center gap-2 mt-3",
      align === "center" && "justify-center",
      align === "right" && "justify-end",
    ]
      .filter(Boolean)
      .join(" ")}
  >
    <div className="h-px w-6 bg-gradient-to-r from-transparent to-[#C9A227]/50" />
    <div className="w-1 h-1 rounded-full bg-[#C9A227]/70 shadow-[0_0_4px_#C9A227/50]" />
    <div className="h-px w-6 bg-gradient-to-l from-transparent to-[#C9A227]/50" />
  </div>
);

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  subtitle,
  divider = false,
  align = "center",
  animate = true,
  className = "",
}) => {
  const Wrapper = animate ? motion.div : "div";
  const animateProps = animate
    ? {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      }
    : {};

  return (
    <Wrapper
      className={["flex flex-col", alignClass[align], className].join(" ")}
      {...animateProps}
    >
      {/* Label editorial */}
      {label && (
        <p
          className={[
            "font-[var(--font-sans)]",
            "text-[0.625rem] font-semibold",
            "tracking-[0.3em] uppercase",
            "text-[#C9A227]/80", // DS: --gold com 80% de opacidade
            "mb-2",
          ].join(" ")}
        >
          {label}
        </p>
      )}

      {/* Título em Cinzel */}
      <h2
        className={[
          "font-[var(--font-display)]",
          "text-[clamp(1.5rem,4vw,2.25rem)]",
          "font-normal leading-tight tracking-wide",
          "text-white",
          "uppercase",
        ].join(" ")}
      >
        {title}
      </h2>

      {/* Divider */}
      {divider && <Divider align={align} />}

      {/* Subtítulo em Inter */}
      {subtitle && (
        <p
          className={[
            "font-[var(--font-sans)]",
            "text-[0.875rem] font-light leading-relaxed",
            "text-white/60",
            "max-w-lg",
            divider ? "mt-4" : "mt-3",
          ].join(" ")}
        >
          {subtitle}
        </p>
      )}
    </Wrapper>
  );
};
