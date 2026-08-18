import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CinematicEarth — Motor de composição em 3 camadas independentes.
 *
 * CAMADA 1: bg_deep_space.png  → Cosmos Master. Fixo. Nunca animado.
 * CAMADA 2: earth-master.png   → Globo PNG com alpha real. Animado via Framer Motion.
 *                                 Wrapper separa posicionamento da animação.
 * CAMADA 3: UI gradient mask   → Área do texto sempre escura e legível.
 *
 * O globo é ancorado no centro da tela (left-1/2 / -translate-x-1/2)
 * e posicionado verticalmente via EARTH_STATES[n].y
 * BASE_EARTH_WIDTH = 160vw → scale: 1 cobre toda a largura + sangra nas laterais
 */
export const CinematicEarth = ({ scale, x, y, opacity, showHorizonGlow }: any) => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

    {/* ── CAMADA 1: COSMOS MASTER ────────────────────────────────────────────── */}
    <div className="absolute inset-0 bg-[url('/bg_deep_space.png')] bg-cover bg-center" />

    {/* ── CAMADA 2: EARTH MASTER ─────────────────────────────────────────────── */}
    {/* Wrapper: centralização estrutural (nunca recebe animação) */}
    <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
      style={{ bottom: "-20%", top: "auto" }}>
      {/* motion.img: SOMENTE animação — scale/y/opacity */}
      <motion.img
        src="/earth-master.png"
        alt=""
        className="w-[160vw] max-w-none origin-center pointer-events-none select-none"
        initial={{ scale: scale * 0.97, y: (typeof y === 'number' ? y + 20 : y), opacity: opacity * 0.85 }}
        animate={{ scale, y, opacity }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        draggable={false}
      />
    </div>

    {/* ── CAMADA 3: MÁSCARA EDITORIAL ────────────────────────────────────────── */}
    {/* Garante que a zona do header + texto seja sempre legível */}
    <div
      className="absolute top-0 inset-x-0 pointer-events-none"
      style={{
        height: "50svh",
        background: "linear-gradient(to bottom, #030306 0%, #030306 50%, transparent 100%)",
      }}
    />

    {/* ── CAMADA 4: SUNRISE SUTIL ────────────────────────────────────────────── */}
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
            background: "radial-gradient(ellipse 60% 80% at 65% 110%, rgba(212,175,55,0.20) 0%, transparent 60%)",
          }}
        />
      )}
    </AnimatePresence>

  </div>
);
