import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type Mode = "futuro" | "passado" | "presente" | "cidade";

interface Props {
  onSelectMode: (mode: Mode) => void;
}

// ─── Desktop: Cinematic Widescreen Layout (Text Left, Glowing Earth Right) ───
function DesktopScene({ onSelectMode }: Props) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#02050A] flex items-center">
      {/* Background Cinematic — Shifted right on Desktop Web so Earth frames the right side */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/earth-orbital-hires.jpg"
          className="w-full h-full object-cover object-center translate-x-[20%] scale-105"
          style={{ filter: "brightness(0.85) contrast(1.1) saturate(1.15)" }}
        >
          <source src="/bg-earth-web.mp4" type="video/mp4" />
        </video>
        {/* Dedicated Web widescreen masks: deep obsidian behind left copy, crystal clear Earth on right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, #02050A 0%, rgba(2,5,10,0.96) 34%, rgba(2,5,10,0.72) 54%, rgba(2,5,10,0.18) 78%, rgba(2,5,10,0.45) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02050A] via-transparent to-[#02050A]/50 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-12 lg:px-16 flex flex-col justify-center h-full">
        <div className="max-w-2xl">
          {/* Label */}
          <motion.span
            className="block font-ps-ui text-[11px] font-semibold tracking-[0.35em] text-[#F5DE98] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] uppercase mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.45 }}
          >
            O GPS do Seu Novo Ano
          </motion.span>

          {/* Headline */}
          <motion.h1
            className="font-ps-display text-white leading-[1.06] drop-shadow-2xl mb-6"
            style={{ fontSize: "clamp(2.85rem, 5.2vw, 4.35rem)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.55, ease: "easeOut" }}
          >
            Descubra onde comemorar seu próximo aniversário.
          </motion.h1>

          {/* Subcopy */}
          <motion.p
            className="font-ps-ui text-white/80 font-light leading-relaxed mb-9 max-w-lg text-lg drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.16, duration: 0.5 }}
          >
            O sistema calcula a cidade exata no mundo para ativar a mudança que você quer viver nos próximos 12 meses.
          </motion.p>

          {/* Main CTA */}
          <motion.button
            onClick={() => onSelectMode("futuro")}
            className="h-15 py-4 px-11 rounded-xl font-ps-display font-bold tracking-[0.08em] text-base lg:text-lg hover:scale-[1.03] hover:bg-[#E5C158] active:scale-95 transition-all mb-12 flex items-center justify-center gap-3"
            style={{
              background: "#C9A227",
              color: "#02050A",
              boxShadow: "0 10px 36px rgba(201,162,39,0.34)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.45 }}
          >
            DESCOBRIR MEU DESTINO
          </motion.button>

          {/* Secondary Paths - Premium Cards */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="max-w-lg"
          >
            <p className="font-ps-ui text-[11px] text-white/55 uppercase tracking-[0.28em] font-medium mb-3.5">
              Explorar outros momentos
            </p>
            <div className="flex gap-4">
              {[
                { id: "presente" as Mode, label: "Presente", sub: "A energia do seu ano atual", border: "border-[#10B981]/35 hover:border-[#10B981]/70", text: "text-[#A7F3D0]" },
                { id: "passado" as Mode, label: "Passado", sub: "Reveja aniversários anteriores", border: "border-[#94A3B8]/35 hover:border-[#94A3B8]/70", text: "text-[#E2E8F0]" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onSelectMode(opt.id)}
                  className={`flex-1 px-5 py-4 rounded-2xl text-left bg-[#08111F]/92 hover:bg-[#0D1B30]/98 border ${opt.border} transition-all group shadow-[0_14px_34px_rgba(0,0,0,0.55)] backdrop-blur-xl`}
                >
                  <span className={`block font-ps-display font-semibold ${opt.text} text-lg mb-1 group-hover:text-white transition-colors`}>
                    {opt.label}
                  </span>
                  <span className="block font-ps-ui text-white/65 text-xs leading-snug font-light">
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile: Touch-first vertical layout (Earth Horizon Top, Crisp Obsidian Bottom) ─
function MobileTimeline({ onSelectMode }: Props) {
  return (
    <div className="relative w-full min-h-[100svh] overflow-y-auto overflow-x-hidden flex flex-col bg-[#02050A]">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/earth-orbital-hires.jpg"
          className="w-full h-full object-cover object-center -translate-y-[14%] scale-105"
          style={{ filter: "brightness(0.85) contrast(1.1) saturate(1.1)" }}
        >
          <source src="/bg-earth-web.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-x-0 top-0 h-28 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(2,5,10,0.85) 0%, transparent 100%)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[72%] pointer-events-none"
          style={{ background: "linear-gradient(to top, #02050A 0%, rgba(2,5,10,0.96) 42%, rgba(2,5,10,0.68) 72%, transparent 100%)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col w-full min-h-[100svh]">
        {/* Spacer to showcase Earth horizon at top below MobileAppChrome header */}
        <div className="flex-1 min-h-[210px]" />

        <div className="px-6 pb-8" style={{ paddingBottom: "max(env(safe-area-inset-bottom, 32px), 92px)" }}>
          {/* Label */}
          <motion.span
            className="block font-ps-ui text-[10px] font-semibold tracking-[0.32em] text-[#F5DE98] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] uppercase mb-3.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.45 }}
          >
            O GPS do Seu Novo Ano
          </motion.span>

          {/* Headline (styled identically, avoids duplicate H1 in DOM for SEO) */}
          <motion.p
            className="font-ps-display text-white leading-[1.08] mb-4 drop-shadow-xl"
            style={{ fontSize: "clamp(1.95rem, 8.6vw, 2.65rem)" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.55, ease: "easeOut" }}
          >
            Descubra onde comemorar seu próximo aniversário.
          </motion.p>

          {/* Subcopy */}
          <motion.p
            className="font-ps-ui text-white/80 font-light leading-relaxed mb-7 max-w-sm drop-shadow"
            style={{ fontSize: "clamp(14px, 3.8vw, 15.5px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.16, duration: 0.5 }}
          >
            O sistema calcula a cidade exata no mundo para ativar a mudança que você quer viver nos próximos 12 meses.
          </motion.p>

          {/* Main CTA */}
          <motion.button
            onClick={() => onSelectMode("futuro")}
            className="w-full h-14 rounded-xl font-ps-display font-bold tracking-wide flex items-center justify-center gap-2 active:scale-95 transition-all mb-6"
            style={{
              fontSize: "0.98rem",
              background: "#C9A227",
              color: "#02050A",
              boxShadow: "0 10px 30px rgba(201,162,39,0.36)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.45 }}
          >
            DESCOBRIR MEU DESTINO
          </motion.button>

          {/* Secondary Paths */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.45 }}
          >
            <p className="font-ps-ui text-[10px] text-white/55 uppercase tracking-[0.25em] text-center mb-3">
              Explorar outros momentos
            </p>
            <div className="flex gap-3">
              {[
                { id: "presente" as Mode, label: "Presente", sub: "Ano Atual", border: "border-[#10B981]/30 hover:border-[#10B981]/60", text: "text-[#A7F3D0]" },
                { id: "passado" as Mode, label: "Passado", sub: "Anos Anteriores", border: "border-[#94A3B8]/35 hover:border-[#94A3B8]/65", text: "text-[#E2E8F0]" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onSelectMode(opt.id)}
                  className={`flex-1 py-4 px-3 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-b from-[#0A1322]/90 to-[#050A14]/95 border ${opt.border} active:scale-95 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl group`}
                >
                  <span className={`block font-ps-display ${opt.text} text-[15px] mb-1 font-medium group-hover:text-white transition-colors`}>
                    {opt.label}
                  </span>
                  <span className="block font-ps-ui text-white/60 text-[9px] text-center uppercase tracking-[0.18em] leading-tight font-light">
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Link to Onboarding Guide */}
            <div className="mt-4 flex items-center justify-center">
              <Link
                to="/app/onboarding"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-[#F5DE98]/80 hover:text-[#F5DE98] text-[11px] font-ps-ui tracking-wide transition-all active:scale-95"
              >
                <span>Como funciona, em 1 minuto</span>
                <span className="text-xs">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export function TemporalSelection({ onSelectMode }: Props) {
  return (
    <>
      <div className="hidden lg:block w-full" style={{ height: "calc(100dvh - 80px)" }}>
        <DesktopScene onSelectMode={onSelectMode} />
      </div>
      <div className="lg:hidden w-full h-full">
        <MobileTimeline onSelectMode={onSelectMode} />
      </div>
    </>
  );
}
