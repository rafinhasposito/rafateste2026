import sys
import re

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

start_str = '{/* A GALERIA HOVER FLUIDA IGUAL A TELA 2 DO ONBOARDING */}'
end_str = '{/* STICKY BOTTOM BAR (Aparece quando escolhe) */}'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_ui = """{/* A GALERIA EQUALIZADOR (DESKTOP) E ACCORDION (MOBILE) */}
            <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row gap-3 md:gap-2 relative z-10 pb-10 md:h-[650px]">
              {LIFE_AREAS.map((area) => {
                const isHovered = hoveredArea === area.id;
                const isOtherHovered = hoveredArea !== null && hoveredArea !== area.id;
                const isSelected = selectedIntention === area.id;

                return (
                  <motion.div
                    key={area.id}
                    onMouseEnter={() => { if (typeof window !== "undefined" && window.innerWidth >= 768) setHoveredArea(area.id) }}
                    onMouseLeave={() => { if (typeof window !== "undefined" && window.innerWidth >= 768) setHoveredArea(null) }}
                    onClick={() => {
                      if (typeof window !== "undefined" && window.innerWidth < 768) {
                        setHoveredArea(isHovered ? null : area.id);
                      }
                    }}
                    animate={{
                      // Desktop: Largura flexível. Mobile: Largura 100%
                      width: typeof window !== "undefined" && window.innerWidth >= 768 
                        ? (isHovered ? '45%' : hoveredArea ? '7.8%' : '12.5%') 
                        : '100%',
                      // Desktop: Altura 100% do container (650px). Mobile: Altura fixa (expande a página).
                      height: typeof window !== "undefined" && window.innerWidth < 768
                        ? (isHovered ? 550 : 70)
                        : '100%',
                      opacity: isOtherHovered ? 0.7 : 1,
                      filter: isOtherHovered ? 'grayscale(40%) brightness(0.8)' : 'grayscale(0%) brightness(1)',
                    }}
                    transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer bg-[#0B1426] flex flex-col group"
                  >
                    
                    {/* VIDEO HEADER AREA (Ocupa 100% quando fechado no desktop, encolhe para 40% quando aberto) */}
                    <motion.div
                      animate={{ 
                        height: isHovered ? (typeof window !== "undefined" && window.innerWidth < 768 ? '40%' : '50%') : '100%' 
                      }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="relative w-full shrink-0 overflow-hidden bg-black/50"
                    >
                      {/* O fundo de vídeo e cor só aparecem plenos quando expandido. No colapsado, o gráfico de barras sobrepõe */}
                      <motion.div animate={{ opacity: isHovered ? 1 : 0 }} className="absolute inset-0">
                        <div className="absolute inset-0 opacity-40 transition-colors duration-1000 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at top right, ${area.color} 0%, transparent 70%)` }} />
                        <video 
                          autoPlay loop muted playsInline 
                          className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-60 pointer-events-none" 
                          src="/videos/aura-loop.mp4" 
                        />
                        <div className="absolute inset-0 mix-blend-color opacity-80 pointer-events-none transition-colors duration-1000" style={{ backgroundColor: area.color }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/30 to-transparent pointer-events-none" />
                      </motion.div>

                      {/* ESTADO COLAPSADO - O GRÁFICO DE BARRAS (EQUALIZADOR) */}
                      <motion.div 
                        animate={{ opacity: isHovered ? 0 : 1 }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        {/* Versão Desktop (Barra Vertical) */}
                        <div className="hidden md:flex absolute inset-0 p-2 flex-col justify-end">
                          <div className="w-full relative rounded-2xl overflow-hidden bg-white/5 flex flex-col justify-end" style={{ height: '100%' }}>
                            {/* Preenchimento do MATCH */}
                            <motion.div 
                              className="w-full relative z-0" 
                              initial={{ height: 0 }}
                              animate={{ height: `${area.score}%` }}
                              transition={{ duration: 1.5, type: 'spring' }}
                              style={{ backgroundColor: area.color, opacity: 0.6 }}
                            >
                              {/* Efeito visual na barra (brilho no topo) */}
                              <div className="absolute top-0 left-0 right-0 h-1 bg-white/50" />
                            </motion.div>
                            
                            {/* Ícone e % na barra */}
                            <div className="absolute inset-0 flex flex-col items-center justify-between py-6 z-10">
                              <span className="text-white font-ps-display text-sm font-bold drop-shadow-md">{area.score}%</span>
                              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <area.icon className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Versão Mobile (Barra Horizontal) */}
                        <div className="md:hidden absolute inset-0 p-1">
                          <div className="w-full h-full relative rounded-2xl overflow-hidden bg-white/5 flex items-center px-4">
                            {/* Preenchimento do MATCH */}
                            <motion.div 
                              className="absolute top-0 left-0 h-full z-0" 
                              initial={{ width: 0 }}
                              animate={{ width: `${area.score}%` }}
                              transition={{ duration: 1.5, type: 'spring' }}
                              style={{ backgroundColor: area.color, opacity: 0.6 }}
                            >
                              <div className="absolute top-0 bottom-0 right-0 w-1 bg-white/50" />
                            </motion.div>
                            
                            <div className="relative z-10 flex justify-between items-center w-full">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                                  <area.icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-white font-ps-display text-sm uppercase tracking-wider drop-shadow-md">{area.label}</span>
                              </div>
                              <span className="text-white font-ps-display text-sm font-bold drop-shadow-md">{area.score}%</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* CONTEÚDO EXPANDIDO (Aparece embaixo do vídeo quando hovered/clicado) */}
                    <motion.div 
                      initial={false}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.4, delay: isHovered ? 0.1 : 0 }}
                      className="flex-1 p-5 md:p-8 flex flex-col overflow-y-auto overflow-x-hidden min-w-[280px] custom-scrollbar"
                    >
                      <div className="flex items-center gap-4 mb-4 shrink-0">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]" style={{ backgroundColor: `${area.color}33`, borderColor: `${area.color}4D` }}>
                          <area.icon className="w-6 h-6" style={{ color: area.color }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-ps-display text-xl md:text-3xl font-bold tracking-tight text-white leading-none mb-1.5">{area.label}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: area.color }}>{area.score}% MATCH</span>
                            <div className="flex-1 max-w-[120px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <motion.div className="h-full rounded-full" style={{ width: `${area.score}%`, backgroundColor: area.color }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-white/80 text-xs md:text-sm font-light leading-relaxed mb-6 italic border-l-2 pl-4 shrink-0" style={{ borderColor: area.color }}>
                        "{area.teaser}"
                      </p>
                      
                      <div className="mt-auto shrink-0">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleSelectIntention(area.id, e); }}
                          className={`w-full py-3.5 md:py-4 font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 ${!isSelected && 'bg-white/10 border border-white/20 text-white hover:bg-white/20 active:scale-95'}`}
                          style={isSelected ? { backgroundColor: area.color, color: '#fff', boxShadow: `0 0 30px ${area.color}66` } : {}}
                        >
                          {isSelected ? <Sparkles className="w-4 h-4 shrink-0" /> : <Target className="w-4 h-4 shrink-0" />}
                          {isSelected ? 'Foco Selecionado' : 'Escolher Este Foco'}
                        </button>
                      </div>
                    </motion.div>

                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      
      """
    new_content = content[:start_idx] + new_ui + content[end_idx:]
    
    with open("src/pages/HouseTrailer.tsx", "w") as f:
        f.write(new_content)
    print("Success")
else:
    print(f"Failed again: {start_idx}, {end_idx}")
