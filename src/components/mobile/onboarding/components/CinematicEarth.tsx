import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EarthProps {
  mode: "orbital" | "globe" | "none";
  src: string | null;
  scale: number;
  x?: number;
  y: number | string;
  opacity: number;
  showHorizonGlow: boolean;
  maskStart?: string | null;
  maskMid?: string | null;
  maskEnd?: string | null;
}

/**
 * CinematicEarth — Motor de composição visual em camadas.
 *
 * CAMADA 1: bg_deep_space.png  → Cosmos Master. Fixo. Nunca animado.
 * CAMADA 2: Earth Layer        → Renderizado em 3 modos:
 *   "orbital"  = bg-cover posicionado na base (horizonte curvo)
 *   "globe"    = globo PNG com alpha, flutuante e centralizado
 *   "none"     = sem Terra (cosmos puro)
 * CAMADA 3: Máscara editorial  → Área do texto sempre legível.
 * CAMADA 4: Sunrise glow       → Opcional por tela.
 */
export const CinematicEarth = ({
  mode,
  src,
  scale,
  x = 0,
  y,
  opacity,
  showHorizonGlow,
  maskStart,
  maskMid,
  maskEnd,
}: EarthProps) => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

    {/* ── CAMADA 1: COSMOS MASTER ─────────────────────────────────────────── */}
    <div className="absolute inset-0 bg-[url('/bg_deep_space.png')] bg-cover bg-center" />

    {/* ── CAMADA 2: EARTH LAYER ───────────────────────────────────────────── */}

    {/* MODO "orbital": imagem bg-cover ancorada na base, mascara gradiente no topo */}
    {mode === "orbital" && src && (
      <motion.div
        className="absolute inset-0 bg-cover bg-bottom origin-bottom"
        style={{
          backgroundImage: `url('${src}')`,
          maskImage: `linear-gradient(to bottom, transparent ${maskStart || "28%"}, rgba(0,0,0,0.65) ${maskMid || "48%"}, black ${maskEnd || "62%"})`,
          WebkitMaskImage: `linear-gradient(to bottom, transparent ${maskStart || "28%"}, rgba(0,0,0,0.65) ${maskMid || "48%"}, black ${maskEnd || "62%"})`,
        }}
        animate={{ scale, y, opacity }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      />
    )}

    {/* MODO "globe": globo PNG com alpha, ancorado no wrapper centralizado */}
    {mode === "globe" && src && (
      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
           style={{ bottom: "-10%" }}>
        <motion.img
          src={src}
          alt=""
          className="w-[160vw] max-w-none origin-center pointer-events-none select-none"
          initial={{ scale: (scale as number) * 0.95, y: typeof y === "number" ? y + 30 : y, opacity: opacity * 0.8 }}
          animate={{ scale, y, opacity }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          draggable={false}
        />
      </div>
    )}

    {/* MODO "none": cosmos puro — sem camada de Terra */}

    {/* ── CAMADA 3: MÁSCARA EDITORIAL ─────────────────────────────────────── */}
    {/* Garante que header + texto sejam sempre legíveis */}
    <div
      className="absolute top-0 inset-x-0 pointer-events-none"
      style={{
        height: "52svh",
        background: "linear-gradient(to bottom, #030306 0%, #030306 52%, transparent 100%)",
      }}
    />

    {/* ── CAMADA 4: SUNRISE SUTIL ─────────────────────────────────────────── */}
    <AnimatePresence>
      {showHorizonGlow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
          className="absolute bottom-0 inset-x-0 pointer-events-none"
          style={{
            height: "40svh",
            background: "radial-gradient(ellipse 60% 80% at 68% 110%, rgba(212,175,55,0.22) 0%, transparent 60%)",
          }}
        />
      )}
    </AnimatePresence>

  </div>
);
