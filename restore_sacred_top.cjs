const fs = require('fs');

// We will build the absolute definitive version of the page
// with ONLY the approved Top + Paywall, and leave the unlocked area empty
// so the user can see we got the first half 100% right.

let code = `
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DesktopWebChrome } from "@/layouts/DesktopWebChrome";
import { MobileAppChrome } from "@/layouts/MobileAppChrome";
import { MapPin, Plane, Calendar, Clock, Lock, Star, Activity, Crown, Heart, Briefcase, Zap, Shield, Target, Compass, ChevronRight, Sun, ArrowUpCircle, User, AlertTriangle } from "lucide-react";

const P = {
  firstName: "Rafael",
  origin: "Surubim",
  city: "Nova Iorque",
  match: 98,
  house: 2,
  intention: "Dinheiro",
};

const MATCH_LIST = [
  { label: "Dinheiro e Recursos", val: 98, color: "#10b981" },
  { label: "Trabalho e Carreira", val: 88, color: "#3b82f6" },
  { label: "Identidade e Imagem", val: 80, color: "#8b5cf6" },
  { label: "Rotina e Produtividade", val: 72, color: "#ec4899" },
  { label: "Networking e Conexões", val: 65, color: "#f59e0b" },
  { label: "Amor e Relacionamento", val: 62, color: "#ef4444" },
  { label: "Espiritual e Propósito", val: 55, color: "#6366f1" },
  { label: "Saúde e Vitalidade", val: 52, color: "#14b8a6" },
];

export default function AppleResultPreview() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="min-h-screen bg-[#02160F] text-white selection:bg-[#10b981]/30 font-sans pb-32">
      {/* 1. TOPO: EUA / NOVA IORQUE / MANCHETE */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40 scale-105">
            <source src="https://services.meteored.com/img/article/inteligencia-artificial-revela-como-sera-nova-york-em-2100-consequencias-mudancas-climaticas-1700234057887_1280.jpg" type="image/jpeg" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#02160F]/40 via-[#02160F]/80 to-[#02160F]" />
        </div>
        <div className="relative z-10 text-center px-6 w-full max-w-4xl mx-auto mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center">
            <span className="text-white/60 uppercase tracking-[0.3em] text-sm font-semibold mb-6">EUA</span>
            <span className="text-[#10b981] mb-6">✦</span>
            <p className="text-white/70 text-lg md:text-xl mb-4 font-light">{P.firstName}, o seu próximo aniversário pode ser em...</p>
            <h1 className="text-6xl md:text-8xl font-ps-display font-bold tracking-tight mb-8 text-white">Nova Iorque</h1>
            <p className="text-xl md:text-3xl text-[#10b981] font-serif italic max-w-3xl leading-relaxed">
              "O destino exato para destravar o seu dinheiro, valorizar seu trabalho e construir estabilidade no seu novo ciclo."
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. RESULTADO PERSONALIZADO (FOCO E BOARDING PASS) */}
      <section className="relative pt-20 pb-10 px-6 max-w-4xl mx-auto z-10">
        <div className="text-center mb-16">
          <h2 className="text-white/50 uppercase tracking-[0.2em] text-xs font-bold mb-4">Seu Resultado Personalizado</h2>
          <h3 className="text-4xl md:text-5xl font-ps-display font-bold mb-4 text-white">O foco é <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-emerald-300">Dinheiro</span>.</h3>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            A Casa 2 foi calculada sob medida para ser a chave exata que destrava o seu objetivo no novo ciclo.
          </p>
        </div>

        {/* BOARDING PASS */}
        <div className="bg-[#02160F]/80 border border-[#10b981]/30 rounded-[32px] overflow-hidden shadow-[0_30px_80px_rgba(16,185,129,0.15)] backdrop-blur-xl flex flex-col mb-16">
          <div className="p-8 md:p-10 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <p className="text-white font-bold text-2xl md:text-3xl uppercase tracking-tight flex items-center justify-center md:justify-start gap-2">
                  {P.origin}
                </p>
              </div>
              <div className="flex items-center gap-4 text-[#10b981]/50 w-full md:w-1/3 justify-center">
                <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent"></div>
                <Plane className="w-6 h-6 text-[#10b981] shrink-0" />
                <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent"></div>
              </div>
              <div className="flex-1 text-center md:text-right">
                <p className="text-[#10b981] font-bold text-2xl md:text-3xl uppercase tracking-tight flex items-center justify-center md:justify-end gap-2">
                  {P.city}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 gap-4">
              <span className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-xl border border-white/10 text-white font-medium text-lg">
                <Calendar className="w-5 h-5 text-[#10b981]"/> 09 Ago, 2027
              </span>
              <span className="text-white/20 hidden md:inline">|</span>
              <div className="flex items-center gap-3 bg-[#10b981]/20 px-6 py-3 rounded-xl border border-[#10b981]/30">
                <Star className="w-5 h-5 text-[#10b981]" />
                <span className="text-[#10b981] font-bold tracking-widest text-lg">98% MATCH</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. LISTA DE % MATCH DAS CASAS */}
        <div className="max-w-2xl mx-auto mb-20 bg-white/[0.02] border border-white/5 rounded-[32px] p-8 md:p-10">
          <div className="space-y-4">
            {MATCH_LIST.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <span className="text-white/80 font-medium text-lg">{item.label}</span>
                <span className="font-bold text-lg" style={{ color: item.color }}>{item.val}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. PAYWALL (CONTEÚDO BLOQUEADO) */}
        {!unlocked && (
          <div className="text-center relative py-20 border-t border-white/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1)_0%,transparent_70%)] pointer-events-none" />
            <Lock className="w-12 h-12 text-[#10b981]/50 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Conteúdo personalizado bloqueado</h3>
            <button 
              onClick={() => setUnlocked(true)}
              className="bg-[#10b981] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            >
              Desbloquear com 1 Crédito
            </button>
          </div>
        )}
      </section>

      {/* =========================================================
          ÁREA DESBLOQUEADA (Para implementarmos juntos)
          ========================================================= */}
      {unlocked && (
        <section className="border-t border-[#10b981]/20 pt-20 px-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
           <div className="text-center text-white/50 py-32 border border-dashed border-white/10 rounded-3xl">
              <p className="font-mono text-sm uppercase tracking-widest mb-4">Área do Dossiê Desbloqueado</p>
              <p className="text-lg">Pronto para receber o design final das Fases, DNA e Radar.</p>
           </div>
        </section>
      )}

      <style dangerouslySetInnerHTML={{__html: \`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}\`}} />
    </div>
  );
}
`;

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log('Sacred Top restored.');
