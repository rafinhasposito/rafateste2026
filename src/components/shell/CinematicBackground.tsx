/**
 * CinematicBackground.tsx
 * Shell Global — Design System v2.0
 *
 * Fundo universal. Dois modos bem distintos:
 * - "discovery": cinematográfico, fotografia, estrelas, globo
 * - "functional": silencioso, Void Black + glow dourado sutil
 *
 * Não contém lógica de produto. Não importa nenhuma tela.
 */
import React, { useMemo } from "react";
import { motion } from "framer-motion";

export type BackgroundMode = "discovery" | "functional";
export type BackgroundIntensity = "low" | "medium" | "high";

export interface CinematicBackgroundProps {
  /** "discovery" = cinematográfico/emocional. "functional" = silencioso/dados */
  mode?: BackgroundMode;
  /** Controla opacidade do overlay e vivacidade dos elementos */
  intensity?: BackgroundIntensity;
  /** Exibe o globo terrestre no rodapé (somente discovery) */
  globe?: boolean;
  /** URL de imagem de fundo opcional. Se omitido, usa só as estrelas/gradiente */
  image?: string;
  children?: React.ReactNode;
  className?: string;
}

/** Mapa de opacidade do overlay por intensidade */
const overlayOpacity: Record<BackgroundIntensity, { img: number; gradient: string }> = {
  // DS: #030306 = --background (Void Black). Inevitável: Tailwind não interpola variante de opacidade
  // com var() CSS em classes from-[] / via-[] / to-[].
  low:    { img: 0.25, gradient: "from-[#030306]/95 via-[#030306]/80 to-[#030306]/95" },
  medium: { img: 0.45, gradient: "from-[#030306]/85 via-[#030306]/60 to-[#030306]/90" },
  high:   { img: 0.60, gradient: "from-[#030306]/70 via-[#030306]/40 to-[#030306]/80" },
};

/** Estrelas cintilantes — geradas uma vez, memorized para evitar re-render */
const StarField: React.FC<{ count?: number }> = ({ count = 28 }) => {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: `${(i * 37 + 11) % 97}%`,
        left: `${(i * 53 + 7) % 97}%`,
        size: i % 5 === 0 ? "1.5px" : "1px",
        duration: 2 + (i % 4),
        delay: (i * 0.3) % 3,
      })),
    [count]
  );

  return (
    <>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          aria-hidden="true"
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
          animate={{ opacity: [0.1, 0.9, 0.1] }}
          transition={{ duration: s.duration, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        />
      ))}
    </>
  );
};

/** Globo terrestre animado no rodapé */
const GlobeFooter: React.FC = () => (
  <motion.div
    aria-hidden="true"
    initial={{ opacity: 0, y: 60 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    className="absolute bottom-0 left-0 w-full h-[30vh] pointer-events-none z-[1]"
  >
    {/* Gradient que funde o globo com o fundo */}
    {/* DS: #030306 = --background. Inevitável: Tailwind não interpola var() em from-[]/via-[] */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#030306] via-[#030306]/70 to-transparent z-10" />
    <img
      src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2000&auto=format&fit=crop"
      alt=""
      aria-hidden="true"
      className="w-full h-full object-cover object-center opacity-80 mix-blend-screen scale-110"
    />
  </motion.div>
);

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  mode = "discovery",
  intensity = "medium",
  globe = false,
  image,
  children,
  className = "",
}) => {
  const overlay = overlayOpacity[intensity];
  const isDiscovery = mode === "discovery";

  // DS: bg-[#030306] = --background (Void Black). Inevitável: Tailwind não resolve var() com opacidade em bg-[].
  return (
    <div
      className={`relative min-h-[100dvh] w-full bg-[#030306] overflow-hidden ${className}`}
    >
      {/* ── Camada 0: Imagem de fundo (opcional, somente discovery) ── */}
      {isDiscovery && image && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: overlay.img }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-[1] pointer-events-none"
        >
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* ── Camada 1: Overlay gradiente ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-[2] pointer-events-none bg-gradient-to-b ${overlay.gradient}`}
      />

      {/* ── Camada 2: Estrelas (somente discovery) ───────────────────── */}
      {isDiscovery && (
        <div aria-hidden="true" className="absolute inset-0 z-[3] pointer-events-none">
          <StarField count={intensity === "high" ? 40 : intensity === "medium" ? 28 : 16} />
        </div>
      )}

      {/* ── Camada 3: Glow topo — discovery tem tom quente, functional tem dourado sutil ── */}
      {/*
        DS: radial-gradient inline — inevitável: Tailwind não gera radial-gradient dinâmico.
        #D4AF37 = --gold. Opacidade 0.08 (discovery) e 0.04 (functional) é a distinção entre modos.
      */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-[40vh] z-[4] pointer-events-none"
        style={{
          background: isDiscovery
            ? `radial-gradient(ellipse at 50% -10%, rgba(212,175,55,0.08) 0%, transparent 65%)`
            : `radial-gradient(ellipse at 50% -20%, rgba(212,175,55,0.04) 0%, transparent 55%)`,
        }}
      />

      {/* ── Camada 4: Globo (somente discovery, se globe=true) ────────── */}
      {isDiscovery && globe && <GlobeFooter />}

      {/* ── Camada 5: Conteúdo ─────────────────────────────────────────── */}
      <div className="relative z-[10]">
        {children}
      </div>
    </div>
  );
};
