import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type Mode = "futuro" | "passado" | "presente" | "cidade";

interface Props {
  onSelectMode: (mode: Mode) => void;
}

// ─── Desktop: Cinematic Layout ─────────────────────────────────────────────
function DesktopScene({ onSelectMode }: Props) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-ps-void flex items-center">
      {/* Background Cinematic */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/earth-orbital-hires.jpg"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.8) contrast(1.1) saturate(1.2)" }}
        >
          <source src="/bg-earth-web.mp4" type="video/mp4" />
        </video>
        {/* Gradient mask to make text pop on the left/bottom */}
        <div className="absolute inset-0 bg-gradient-to-r from-ps-void/90 via-ps-void/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-ps-void/90 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-12 lg:px-16 flex flex-col justify-center h-full">
        <div className="max-w-2xl">
          {/* Label */}
          <motion.span
            className="block font-ps-ui text-[11px] font-semibold tracking-[0.35em] text-[#F5DE98] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] uppercase mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            O GPS do Seu Novo Ano
          </motion.span>

          {/* Headline */}
          <motion.h1
            className="font-ps-display text-white leading-[1.05] drop-shadow-2xl mb-6"
            style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.85, ease: "easeOut" }}
          >
            Descubra onde comemorar seu próximo aniversário.
          </motion.h1>

          {/* Subcopy */}
          <motion.p
            className="font-ps-ui text-ps-text/80 font-light leading-relaxed mb-10 max-w-lg text-lg drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            O sistema calcula a cidade exata no mundo para ativar a mudança que você quer viver nos próximos 12 meses.
          </motion.p>

          {/* Main CTA */}
          <motion.button
            onClick={() => onSelectMode("futuro")}
            className="h-16 px-12 rounded-xl font-ps-display tracking-[0.08em] text-lg hover:scale-105 active:scale-95 transition-all mb-16 flex items-center justify-center gap-3"
            style={{
              background: "#C9A227",
              color: "#02050A",
              boxShadow: "0 0 40px rgba(201,162,39,0.3)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            DESCOBRIR MEU DESTINO
          </motion.button>

          {/* Secondary Paths - Premium Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            <p className="font-ps-ui text-[11px] text-ps-muted uppercase tracking-[0.3em] mb-4">
              Explorar outros momentos
            </p>
            <div className="flex gap-4">
              {[
                { id: "presente" as Mode, label: "Presente", sub: "A energia do seu ano atual" },
                { id: "passado" as Mode, label: "Passado", sub: "Auditoria de anos anteriores" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onSelectMode(opt.id)}
                  className="flex-1 px-5 py-4 rounded-xl text-left bg-[#0A1424]/85 hover:bg-[#102038]/95 border border-[#C9A227]/30 hover:border-[#C9A227]/60 transition-all group shadow-lg backdrop-blur-xl"
                >
                  <span className="block font-ps-display text-[#F5DE98] text-lg mb-1 group-hover:text-white transition-colors">
                    {opt.label}
                  </span>
                  <span className="block font-ps-ui text-white/60 text-[11px] leading-tight font-light">
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

// ─── Mobile: Touch-first vertical layout ─────────────────────────────────────
function MobileTimeline({ onSelectMode }: Props) {
  return (
    <div className="relative w-full min-h-[100svh] overflow-y-auto overflow-x-hidden flex flex-col bg-ps-void">
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/earth-orbital-hires.jpg"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.85) contrast(1.1) saturate(1.1)" }}
        >
          <source src="/bg-earth-web.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <div
          className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(2,5,10,0.98) 0%, rgba(2,5,10,0.85) 40%, rgba(2,5,10,0.40) 70%, transparent 100%)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col w-full min-h-[100svh]">
        {/* Spacer to push content to bottom, and leave top clean for MobileAppChrome logo */}
        <div className="flex-1" />

        <div className="px-6 pb-8" style={{ paddingBottom: "max(env(safe-area-inset-bottom, 32px), 96px)" }}>
          {/* Label */}
          <motion.span
            className="block font-ps-ui text-[10px] font-semibold tracking-[0.32em] text-[#F5DE98] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            O GPS do Seu Novo Ano
          </motion.span>

          {/* Headline (styled identically, avoids duplicate H1 in DOM for SEO) */}
          <motion.p
            className="font-ps-display text-white leading-[1.05] mb-5 drop-shadow-xl"
            style={{ fontSize: "clamp(2rem, 9vw, 2.8rem)" }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.85, ease: "easeOut" }}
          >
            Descubra onde comemorar seu próximo aniversário.
          </motion.p>

          {/* Subcopy */}
          <motion.p
            className="font-ps-ui text-ps-text/80 font-light leading-relaxed mb-8 max-w-sm drop-shadow"
            style={{ fontSize: "clamp(14px, 3.8vw, 16px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            O sistema calcula a cidade exata no mundo para ativar a mudança que você quer viver nos próximos 12 meses.
          </motion.p>

          {/* Main CTA */}
          <motion.button
            onClick={() => onSelectMode("futuro")}
            className="w-full h-14 rounded-xl font-ps-display tracking-wide flex items-center justify-center gap-2 active:scale-95 transition-all mb-6"
            style={{
              fontSize: "1rem",
              background: "#C9A227",
              color: "#02050A",
              boxShadow: "0 0 30px rgba(201,162,39,0.4)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            DESCOBRIR MEU DESTINO
          </motion.button>

          {/* Secondary Paths */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            <p className="font-ps-ui text-[10px] text-ps-muted/80 uppercase tracking-[0.25em] text-center mb-3">
              Explorar outros momentos
            </p>
            <div className="flex gap-3">
              {[
                { id: "presente" as Mode, label: "Presente", sub: "Ano Atual" },
                { id: "passado" as Mode, label: "Passado", sub: "Anos Anteriores" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onSelectMode(opt.id)}
                  className="flex-1 py-4 px-3 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-b from-[#0F1C36]/90 to-[#060D1A]/95 border border-[#C9A227]/30 hover:border-[#C9A227]/60 active:scale-95 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl group"
                >
                  <span className="block font-ps-display text-[#F5DE98] text-[15px] mb-1 font-medium group-hover:text-white transition-colors">
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
      <div className="hidden lg:block w-full" style={{ height: "calc(100vh - 56px)" }}>
        <DesktopScene onSelectMode={onSelectMode} />
      </div>
      <div className="lg:hidden w-full h-full">
        <MobileTimeline onSelectMode={onSelectMode} />
      </div>
    </>
  );
}
