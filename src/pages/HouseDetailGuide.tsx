import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Briefcase,
  DollarSign,
  Leaf,
  Users,
  Calendar,
  Sparkles,
  Crown,
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  Target,
  Zap,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FOCUS_MATRIX } from "@/data/focusMatrix";
import { HOUSES_SHOWCASE } from "@/data/housesShowcase";
import { interpolateCityCopy } from "@/lib/cityCopy";
import { houseThemes } from "@/data/houseThemes";
import { getHouseVideoAssets } from "@/components/HouseVideoPreview";

const LIFE_AREAS = [
  { id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e", teaser: "Ative o melhor alinhamento para viver conexões afetivas mais verdadeiras e leves neste novo ciclo." },
  { id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#10b981", teaser: "Direcione a energia do seu ano para ganhar tração profissional, autoridade e novos resultados." },
  { id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#f59e0b", teaser: "Fortaleça sua relação com ganhos, precificação e novas oportunidades financeiras nos próximos 12 meses." },
  { id: "saude", icon: Leaf, label: "Saúde e Vitalidade", color: "#22c55e", teaser: "Renove sua disposição física, equilíbrio emocional e constância no cuidado com o próprio corpo." },
  { id: "networking", icon: Users, label: "Networking e Conexões", color: "#3b82f6", teaser: "Aproxime pessoas estratégicas, mentores e alianças capazes de abrir novas portas no seu caminho." },
  { id: "rotina", icon: Calendar, label: "Rotina e Produtividade", color: "#a855f7", teaser: "Organize seu tempo e sua energia diária para produzir com mais clareza, foco e leveza." },
  { id: "espiritual", icon: Sparkles, label: "Espiritual e Propósito", color: "#818cf8", teaser: "Aprofunde sua clareza de propósito, intuição e sentido real por trás das escolhas do ano." },
  { id: "identidade", icon: Crown, label: "Identidade e Imagem", color: "#c9a227", teaser: "Fortaleça seu posicionamento pessoal, autoconfiança e a forma como o mundo percebe o seu valor." },
];

const AFFINITY_MATRIX: Record<number, Record<string, number>> = {
  1: { amor: 72, trabalho: 85, dinheiro: 75, saude: 92, networking: 68, rotina: 70, espiritual: 65, identidade: 98 },
  2: { amor: 62, trabalho: 88, dinheiro: 98, saude: 52, networking: 65, rotina: 72, espiritual: 55, identidade: 80 },
  3: { amor: 65, trabalho: 92, dinheiro: 80, saude: 58, networking: 88, rotina: 85, espiritual: 60, identidade: 72 },
  4: { amor: 82, trabalho: 60, dinheiro: 78, saude: 72, networking: 50, rotina: 75, espiritual: 88, identidade: 65 },
  5: { amor: 98, trabalho: 82, dinheiro: 75, saude: 78, networking: 70, rotina: 60, espiritual: 65, identidade: 92 },
  6: { amor: 50, trabalho: 88, dinheiro: 78, saude: 98, networking: 60, rotina: 95, espiritual: 55, identidade: 65 },
  7: { amor: 98, trabalho: 86, dinheiro: 75, saude: 55, networking: 92, rotina: 60, espiritual: 65, identidade: 72 },
  8: { amor: 88, trabalho: 80, dinheiro: 92, saude: 70, networking: 65, rotina: 55, espiritual: 85, identidade: 78 },
  9: { amor: 72, trabalho: 88, dinheiro: 75, saude: 70, networking: 82, rotina: 58, espiritual: 98, identidade: 80 },
  10: { amor: 58, trabalho: 98, dinheiro: 88, saude: 55, networking: 80, rotina: 72, espiritual: 68, identidade: 95 },
  11: { amor: 72, trabalho: 90, dinheiro: 85, saude: 62, networking: 98, rotina: 68, espiritual: 78, identidade: 80 },
  12: { amor: 70, trabalho: 60, dinheiro: 65, saude: 88, networking: 50, rotina: 80, espiritual: 98, identidade: 75 },
};

export default function HouseDetailGuide() {
  const { houseId } = useParams<{ houseId: string }>();
  const navigate = useNavigate();

  const parsed = Number(houseId);
  const currentHouse = parsed >= 1 && parsed <= 12 ? parsed : 1;

  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [isPanelHovered, setIsPanelHovered] = useState(false);

  useEffect(() => {
    setHoveredArea(null);
    setIsPanelHovered(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [currentHouse]);

  const theme = houseThemes[currentHouse] || houseThemes[1];
  const showcase = HOUSES_SHOWCASE.find((h) => h.id === currentHouse) || HOUSES_SHOWCASE[0];

  const houseFocusMap = FOCUS_MATRIX[currentHouse] || {};
  const sortedAreas = [...LIFE_AREAS]
    .map((area) => {
      const matrixEntry = houseFocusMap[area.id];
      const houseTeaser = matrixEntry?.headline
        ? interpolateCityCopy(matrixEntry.headline, null)
        : area.teaser;
      const score = matrixEntry?.match || AFFINITY_MATRIX[currentHouse]?.[area.id] || 50;
      return {
        ...area,
        teaser: houseTeaser,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  const bgBase = `color-mix(in srgb, ${theme.themeColor} 12%, #000000)`;
  const heroGradient = `linear-gradient(to bottom, transparent, color-mix(in srgb, ${theme.themeColor} 12%, rgba(0,0,0,0.8)) 60%, ${bgBase} 100%)`;

  const prevHouse = currentHouse === 1 ? 12 : currentHouse - 1;
  const nextHouse = currentHouse === 12 ? 1 : currentHouse + 1;

  return (
    <div
      className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-white/10 pb-20 relative transition-colors duration-1000"
      style={{ backgroundColor: bgBase }}
    >
      {/* SUB-BARRA INLINE LIMPA (Desktop mostra Voltar; no Mobile o header já exibe Voltar) */}
      <div className="relative z-30 max-w-6xl mx-auto px-4 md:px-8 pt-20 lg:pt-6 pb-2 flex items-center justify-end lg:justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/casas")}
          className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-xs font-semibold uppercase tracking-[0.16em] text-white/90 transition-all backdrop-blur-xl"
        >
          <ChevronLeft className="w-4 h-4" />
          Todas as 12 Casas
        </button>
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70 truncate text-right">
          Casa {String(currentHouse).padStart(2, "0")} • {theme.subtitle}
        </span>
      </div>

      {/* HERO CINEMATOGRÁFICO */}
      <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center pt-14 pb-16">
        <div
          className="w-[100vw] absolute left-1/2 -translate-x-1/2 top-0 h-[100vh] z-0 pointer-events-none"
          style={{
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
          }}
        >
          <div
            className="absolute inset-0 z-10 mix-blend-soft-light opacity-45 transition-colors duration-1000"
            style={{ backgroundColor: theme.themeColor }}
          />
          <video
            key={`house-detail-video-${currentHouse}`}
            src={getHouseVideoAssets(currentHouse).videoSrc}
            poster={getHouseVideoAssets(currentHouse).posterSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-55"
          />
        </div>
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none transition-colors duration-1000"
          style={{ background: heroGradient }}
        />

        <motion.div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
          <motion.div
            key={`hero-${currentHouse}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1
              className="text-[clamp(3.75rem,18vw,13.75rem)] font-ps-display font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 uppercase pb-6 md:pb-12"
              style={{ filter: `drop-shadow(0px 20px 40px ${theme.themeColor}33)` }}
            >
              Casa {currentHouse}
            </h1>
          </motion.div>
          <motion.h2
            key={`sub-${currentHouse}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl md:text-3xl font-ps-display font-light tracking-tight text-white/80 mt-[-30px] md:mt-[-60px]"
          >
            {showcase.title}
          </motion.h2>
        </motion.div>

        {/* RESUMO RÁPIDO PARA DECISÃO (CLARO EM 5 SEGUNDOS) */}
        <motion.div
          key={`summary-${currentHouse}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-20 mt-12 md:mt-16 w-full max-w-5xl mx-auto px-5 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl p-5 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 shrink-0" style={{ color: theme.themeColor }} />
              <span
                className="text-[10px] font-ps-ui font-bold uppercase tracking-[0.2em]"
                style={{ color: theme.themeColor }}
              >
                Para quem é
              </span>
            </div>
            <p className="font-ps-ui text-sm text-white/90 leading-relaxed">
              {showcase.profile}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl p-5 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 shrink-0 text-[#F5DE98]" />
              <span className="text-[10px] font-ps-ui font-bold uppercase tracking-[0.2em] text-white/65">
                A energia da cidade
              </span>
            </div>
            <p className="font-ps-ui text-sm text-white/85 leading-relaxed">
              {showcase.cycleFocus}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl p-5 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 shrink-0 text-[#EAB344]" />
              <span className="text-[10px] font-ps-ui font-bold uppercase tracking-[0.2em] text-[#F3DC9B]">
                Quais cidades ativam?
              </span>
            </div>
            <p className="font-ps-ui text-sm text-white/90 leading-relaxed">
              <strong className="text-white font-semibold">
                Muda de pessoa para pessoa:
              </strong>{" "}
              não existe cidade fixa para a Casa {currentHouse}. Calculamos quais cidades do Brasil e do mundo ativam essa área especificamente para a sua data, hora e local de nascimento.
            </p>
          </div>
        </motion.div>

        {/* COMO FUNCIONA NA PRÁTICA (3 CENAS DA VIDA REAL) */}
        <motion.div
          key={`practice-${currentHouse}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="relative z-20 mt-14 md:mt-20 w-full max-w-5xl mx-auto px-5 sm:px-6"
        >
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-8 md:p-10">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span
                style={{ color: theme.themeColor }}
                className="text-[10px] font-bold uppercase tracking-[0.28em] block mb-2.5"
              >
                Na Vida Real
              </span>
              <h3 className="font-ps-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                Como a Casa {currentHouse} funciona na prática
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {showcase.inPractice.map((item, idx) => (
                <div
                  key={`${currentHouse}-prac-${idx}`}
                  className="rounded-2xl border border-white/[0.08] bg-black/35 p-5 flex flex-col gap-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold shrink-0"
                      style={{
                        backgroundColor: `${theme.themeColor}22`,
                        color: theme.themeColor,
                        border: `1px solid ${theme.themeColor}45`,
                      }}
                    >
                      0{idx + 1}
                    </span>
                    <h4 className="font-ps-display text-sm sm:text-base font-bold text-white leading-snug">
                      {item.area}
                    </h4>
                  </div>
                  <p className="font-ps-ui text-[13.5px] sm:text-sm text-white/78 leading-relaxed">
                    {item.example}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* A ENERGIA DO ANO */}
        <motion.div className="relative z-20 mt-20 md:mt-24 max-w-4xl mx-auto px-6">
          <span
            style={{ color: theme.themeColor }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-10 text-center"
          >
            A Energia do Ano
          </span>

          <p className="text-3xl md:text-5xl font-light text-white/90 leading-tight mb-20 text-center">
            {theme.energyIntro.split(" ").map((word, i, arr) => {
              const splitIndex = Math.floor(arr.length * 0.55);
              const isColored = i >= splitIndex;
              return (
                <motion.span
                  key={`${currentHouse}-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.025, ease: [0.16, 1, 0.3, 1] }}
                  style={isColored ? { color: theme.themeColor } : {}}
                  className={`inline-block mr-[0.25em] ${isColored ? "font-medium" : ""}`}
                >
                  {word}
                </motion.span>
              );
            })}
          </p>

          <div className="flex flex-col divide-y divide-white/[0.06]">
            {theme.energyPoints.map((point, i) => (
              <motion.div
                key={`${currentHouse}-pt-${i}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-6 md:gap-8 py-8 group"
              >
                <span
                  className="font-ps-display text-5xl md:text-6xl font-bold leading-none shrink-0 w-16 text-right opacity-35 group-hover:opacity-75 transition-opacity duration-300"
                  style={{ color: theme.themeColor }}
                >
                  0{i + 1}
                </span>
                <div className="flex-1 mt-1">
                  <h4 className="text-xl md:text-2xl font-ps-display font-bold text-white/90 mb-2 group-hover:text-white transition-colors duration-300">
                    {point.title}
                  </h4>
                  <p className="text-white/55 text-sm md:text-base font-light leading-relaxed group-hover:text-white/85 transition-colors duration-300">
                    {point.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PARA QUEM É A CASA X & AS 8 ÁREAS DA VIDA */}
      <section className="relative z-20 max-w-[1200px] mx-auto px-6 mt-10">
        <div
          className="w-full backdrop-blur-3xl border border-white/[0.05] rounded-[28px] p-8 md:p-12 mb-20 shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col items-center relative overflow-hidden mt-12 transition-colors duration-1000"
          style={{ backgroundColor: `color-mix(in srgb, ${theme.themeColor} 18%, rgba(0,0,0,0.8))` }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px]"
            style={{ backgroundImage: `linear-gradient(to right, transparent, ${theme.themeColor}4d, transparent)` }}
          />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4"
            style={{ color: theme.themeColor }}
          >
            Perfil Ideal
          </span>
          <h3 className="text-3xl md:text-5xl font-ps-display font-bold text-white mb-6 text-center leading-tight">
            Para quem é a Casa {currentHouse}?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full mt-10">
            {theme.personas.map(({ avatarM, text }, i) => (
              <div
                key={`${currentHouse}-fw-${i}`}
                className="flex flex-col items-center text-center group bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 pt-6 relative hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
              >
                <div className="relative z-20 w-32 h-32 mb-4">
                  <div
                    className="absolute inset-0 rounded-full blur-[20px]"
                    style={{ backgroundColor: `${theme.themeColor}0d` }}
                  />
                  <img
                    src={`/memojis/${avatarM}`}
                    alt="Perfil ideal"
                    className="w-full h-full object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2 relative z-10"
                  />
                </div>
                <p className="text-white/70 text-base font-light leading-relaxed group-hover:text-white transition-colors duration-200 relative z-10">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AS 8 ÁREAS DA VIDA NESTA CASA (100% EDITORIAL — ZERO BOTÕES ARTIFICIAIS) */}
        <div className="mt-20 pt-16 border-t border-white/5 relative z-10 flex flex-col items-center w-full">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest mb-8"
            style={{ color: theme.themeColor }}
          >
            <Sparkles className="w-3 h-3" />
            <span>As 8 Áreas da Vida</span>
          </div>

          <h3 className="text-4xl md:text-6xl font-ps-display font-bold text-center mb-4">
            O impacto em cada área.
          </h3>
          <p className="text-white/55 text-center text-base md:text-lg max-w-2xl mx-auto mb-14">
            Toque em uma área abaixo para ver como a Casa {currentHouse} atua ao longo do ano.
          </p>

          <div className="w-full max-w-[1400px] mx-auto px-0 md:px-4 flex flex-col-reverse lg:flex-row gap-6 relative z-10 pb-14 lg:h-[700px] xl:h-[760px] items-stretch">
            {/* DESKTOP SIDEBAR */}
            <motion.div
              animate={{ width: isPanelHovered ? 72 : 300 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.15 }}
              className="hidden lg:flex shrink-0 flex-col gap-2 items-stretch h-full overflow-hidden"
            >
              {sortedAreas.map((area) => {
                const currentActive = hoveredArea || sortedAreas[0].id;
                const isActive = currentActive === area.id;

                return (
                  <div
                    key={area.id}
                    onMouseEnter={() => setHoveredArea(area.id)}
                    onClick={() => {
                      setHoveredArea(area.id);
                      setIsPanelHovered(true);
                    }}
                    className="relative flex-1 rounded-2xl border overflow-hidden cursor-pointer group transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? `${area.color}18` : `${area.color}08`,
                      borderColor: isActive ? `${area.color}44` : "rgba(255,255,255,0.05)",
                      boxShadow: isActive ? `0 0 20px ${area.color}20` : "none",
                    }}
                  >
                    {isActive && (
                      <div
                        className="absolute inset-0 pointer-events-none opacity-10"
                        style={{ background: `linear-gradient(135deg, ${area.color} 0%, transparent 70%)` }}
                      />
                    )}

                    <div className="absolute inset-0 flex items-center gap-3 px-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: isActive ? `${area.color}33` : `${area.color}15`,
                          borderColor: isActive ? `${area.color}55` : `${area.color}30`,
                        }}
                      >
                        <area.icon className="w-4 h-4" style={{ color: isActive ? area.color : `${area.color}80` }} />
                      </div>

                      <motion.div
                        animate={{ opacity: isPanelHovered ? 0 : 1 }}
                        transition={{ duration: 0.25 }}
                        className="flex-1 min-w-0 pointer-events-none"
                      >
                        <span
                          className={`block font-ps-display text-sm font-bold mb-1 whitespace-nowrap tracking-wide transition-colors duration-300 ${
                            isActive ? "text-white" : "text-white/60 group-hover:text-white/90"
                          }`}
                        >
                          {area.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              animate={{ width: isActive ? `${area.score}%` : "0%" }}
                              transition={{ duration: 0.8, type: "spring", bounce: 0.25, delay: isActive ? 0.05 : 0 }}
                              style={{ backgroundColor: area.color, opacity: isActive ? 1 : 0.4 }}
                            />
                          </div>
                          <motion.span
                            animate={{ opacity: isActive ? 1 : 0 }}
                            transition={{ duration: 0.3, delay: isActive ? 0.5 : 0 }}
                            className="text-[10px] font-bold tracking-widest shrink-0 text-white"
                          >
                            {area.score}%
                          </motion.span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* MOBILE ACCORDION */}
            <div className="w-full lg:hidden flex flex-col gap-3">
              {sortedAreas.map((area) => {
                const currentActive = hoveredArea || sortedAreas[0].id;
                const isActive = currentActive === area.id;

                return (
                  <div key={area.id} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setHoveredArea(isActive ? null : area.id)}
                      className="relative flex items-center gap-4 p-4 rounded-2xl border overflow-hidden text-left transition-all duration-300"
                      style={{
                        backgroundColor: isActive ? `${area.color}18` : `${area.color}08`,
                        borderColor: isActive ? `${area.color}44` : "rgba(255,255,255,0.06)",
                        boxShadow: isActive ? `0 0 20px ${area.color}20` : "none",
                      }}
                    >
                      {isActive && (
                        <div
                          className="absolute inset-0 pointer-events-none opacity-10"
                          style={{ background: `linear-gradient(135deg, ${area.color} 0%, transparent 70%)` }}
                        />
                      )}

                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300"
                        style={{
                          backgroundColor: isActive ? `${area.color}33` : `${area.color}15`,
                          borderColor: isActive ? `${area.color}55` : `${area.color}30`,
                        }}
                      >
                        <area.icon className="w-5 h-5" style={{ color: isActive ? area.color : `${area.color}80` }} />
                      </div>

                      <div className="flex-1 min-w-0 relative z-10">
                        <span
                          className={`block font-ps-display text-base font-bold mb-2 transition-colors duration-300 ${
                            isActive ? "text-white" : "text-white/70"
                          }`}
                        >
                          {area.label}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              animate={{ width: isActive ? `${area.score}%` : "0%" }}
                              transition={{ duration: 0.8, type: "spring", bounce: 0.25, delay: isActive ? 0.05 : 0 }}
                              style={{ backgroundColor: area.color }}
                            />
                          </div>
                          <motion.span
                            animate={{ opacity: isActive ? 1 : 0 }}
                            transition={{ duration: 0.3, delay: isActive ? 0.5 : 0 }}
                            className="text-[10px] font-bold tracking-widest shrink-0 text-white"
                          >
                            {area.score}%
                          </motion.span>
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="relative mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
                            <div
                              className="absolute inset-0 opacity-30 pointer-events-none"
                              style={{ backgroundImage: `radial-gradient(circle at top right, ${area.color} 0%, transparent 80%)` }}
                            />
                            <div
                              className="absolute inset-0 mix-blend-color opacity-60 pointer-events-none"
                              style={{ backgroundColor: area.color }}
                            />
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background: `linear-gradient(to top, ${bgBase}, color-mix(in srgb, ${theme.themeColor} 12%, rgba(0,0,0,0.7)) 50%, transparent)`,
                              }}
                            />

                            <div className="relative z-10 p-6 flex flex-col">
                              <div className="flex items-center gap-3 mb-4">
                                <div
                                  className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 bg-black/20"
                                  style={{ borderColor: `${area.color}55` }}
                                >
                                  <area.icon className="w-4 h-4" style={{ color: area.color }} />
                                </div>
                                <span className="text-white/60 text-[10px] uppercase font-bold tracking-[0.25em]">
                                  Casa {currentHouse}
                                </span>
                              </div>
                              <h3 className="font-ps-display text-3xl font-bold text-white leading-tight mb-4">
                                {area.label}
                              </h3>
                              <div className="w-12 h-px mb-4" style={{ backgroundColor: `${area.color}80` }} />
                              <p className="text-white/85 text-sm font-light leading-relaxed">{area.teaser}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP PAINEL DE CINEMA */}
            <motion.div
              layout
              onMouseEnter={() => setIsPanelHovered(true)}
              onMouseLeave={() => setIsPanelHovered(false)}
              className="hidden lg:block flex-1 h-[600px] lg:h-full relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10 transition-colors duration-1000"
              style={{ backgroundColor: bgBase }}
            >
              <AnimatePresence mode="wait">
                {sortedAreas
                  .filter((a) => a.id === (hoveredArea || sortedAreas[0].id))
                  .map((activeArea) => (
                    <motion.div
                      key={activeArea.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="absolute inset-0 w-full h-full flex flex-col justify-end"
                    >
                      <div
                        className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
                        style={{ backgroundImage: `radial-gradient(circle at top right, ${activeArea.color} 0%, transparent 80%)` }}
                      />
                      <div
                        className="absolute inset-0 mix-blend-color opacity-80 pointer-events-none"
                        style={{ backgroundColor: activeArea.color }}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `linear-gradient(to top, ${bgBase}, color-mix(in srgb, ${theme.themeColor} 12%, rgba(0,0,0,0.8)) 50%, transparent)`,
                        }}
                      />

                      <div className="relative z-10 p-8 md:p-12 w-full flex flex-col justify-end h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 bg-black/20 backdrop-blur-md"
                            style={{ borderColor: `${activeArea.color}55` }}
                          >
                            <activeArea.icon className="w-5 h-5" style={{ color: activeArea.color }} />
                          </div>
                          <span className="text-white/60 text-xs uppercase font-bold tracking-[0.25em]">
                            Casa {currentHouse}
                          </span>
                        </div>

                        <h3 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-none drop-shadow-xl mb-6">
                          {activeArea.label}
                        </h3>

                        <div className="w-16 h-px mb-6" style={{ backgroundColor: `${activeArea.color}80` }} />

                        <p className="text-white/80 text-base md:text-lg font-light leading-relaxed max-w-xl drop-shadow-md">
                          {activeArea.teaser}
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* NAVEGAÇÃO ENTRE CASAS + CONVITE DISCRETO (IN-FLOW — ZERO COMPRA FORÇADA) */}
        <div className="mt-10 pt-10 border-t border-white/10 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(`/casas/${prevHouse}`)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/12 bg-white/[0.04] hover:bg-white/[0.09] text-xs sm:text-sm font-ps-ui font-medium text-white/85 transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-[#F5DE98]" />
              <span>Casa {prevHouse}</span>
            </button>

            <Link
              to="/casas"
              className="text-xs font-ps-ui uppercase tracking-[0.18em] text-white/55 hover:text-[#F5DE98] transition-colors"
            >
              Ver todas as 12
            </Link>

            <button
              type="button"
              onClick={() => navigate(`/casas/${nextHouse}`)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/12 bg-white/[0.04] hover:bg-white/[0.09] text-xs sm:text-sm font-ps-ui font-medium text-white/85 transition-all"
            >
              <span>Casa {nextHouse}</span>
              <ChevronRight className="w-4 h-4 text-[#F5DE98]" />
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div>
              <h4 className="font-ps-display text-lg md:text-xl font-bold text-white">
                Decidiu que a Casa {String(currentHouse).padStart(2, "0")} faz sentido para o seu próximo ano?
              </h4>
              <p className="font-ps-ui text-xs md:text-sm text-white/60 mt-1">
                O cálculo usa sua data, hora e cidade de nascimento para encontrar suas coordenadas exatas.
              </p>
            </div>
            <Link
              to={`/?mode=futuro&path=casa&house=${currentHouse}`}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-ps-ui text-xs font-bold uppercase tracking-[0.16em] bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] transition-all shadow-[0_8px_28px_rgba(201,162,39,0.28)]"
            >
              <Compass className="w-4 h-4" />
              <span>Explorar cidades para a Casa {String(currentHouse).padStart(2, "0")}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
