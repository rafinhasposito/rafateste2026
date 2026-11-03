import sys
import re

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

start_str = '{/* A GALERIA EQUALIZADOR (DESKTOP) E ACCORDION (MOBILE) */}'
end_str = '{/* STICKY BOTTOM BAR (Aparece quando escolhe) */}'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_ui = """{/* O ACORDEÃO VERTICAL UNIFICADO (PC & MOBILE) */}
            <div className="w-full max-w-5xl mx-auto px-4 flex flex-col gap-3 relative z-10 pb-10">
              {LIFE_AREAS.map((area) => {
                const isHovered = hoveredArea === area.id;
                const isOtherHovered = hoveredArea !== null && hoveredArea !== area.id;
                const isSelected = selectedIntention === area.id;

                return (
                  <motion.div
                    key={area.id}
                    onMouseEnter={() => { if (typeof window !== "undefined" && window.innerWidth >= 1024) setHoveredArea(area.id) }}
                    onMouseLeave={() => { if (typeof window !== "undefined" && window.innerWidth >= 1024) setHoveredArea(null) }}
                    onClick={() => {
                      if (typeof window !== "undefined" && window.innerWidth < 1024) {
                        setHoveredArea(isHovered ? null : area.id);
                      }
                    }}
                    animate={{
                      width: '100%',
                      height: isHovered ? (typeof window !== "undefined" && window.innerWidth < 768 ? 550 : 450) : (typeof window !== "undefined" && window.innerWidth < 768 ? 70 : 80),
                      opacity: isOtherHovered ? 0.6 : 1,
                    }}
                    transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
                    className={`relative rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer flex flex-col group ${isHovered ? 'shadow-[0_0_80px_rgba(255,255,255,0.05)] border border-white/20 bg-black/60' : 'shadow-md border border-white/5 bg-white/[0.03] hover:border-white/20'}`}
                  >
                    
                    {/* VIDEO HEADER AREA (Ocupa 100% quando fechado, encolhe no Desktop) */}
                    <motion.div
                      animate={{ 
                        height: isHovered ? '100%' : '100%' 
                      }}
                      className="absolute inset-0 w-full overflow-hidden bg-[#0B1426] pointer-events-none"
                    >
                      {/* O fundo de vídeo e cor */}
                      <motion.div animate={{ opacity: isHovered ? 1 : 0 }} className="absolute inset-0" transition={{ duration: 0.8 }}>
                        <div className="absolute inset-0 opacity-40 transition-colors duration-1000" style={{ backgroundImage: `radial-gradient(circle at top right, ${area.color} 0%, transparent 70%)` }} />
                        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-60" src="/videos/aura-loop.mp4" />
                        <div className="absolute inset-0 mix-blend-color opacity-80 transition-colors duration-1000" style={{ backgroundColor: area.color }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/70 to-[#0B1426]/30" />
                      </motion.div>

                      {/* ESTADO COLAPSADO - O GRÁFICO DE BARRAS HORIZONTAL UNIFICADO */}
                      <motion.div 
                        animate={{ opacity: isHovered ? 0 : 1 }}
                        className="absolute inset-0 p-1 md:p-2"
                      >
                        <div className="w-full h-full relative rounded-2xl overflow-hidden bg-white/5 flex items-center px-4 md:px-6">
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
                            <div className="flex items-center gap-4 md:gap-6">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center">
                                <area.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                              </div>
                              <span className="text-white font-ps-display text-sm md:text-lg uppercase tracking-wider drop-shadow-md">{area.label}</span>
                            </div>
                            <span className="text-white font-ps-display text-sm md:text-lg font-bold drop-shadow-md">{area.score}%</span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* CONTEÚDO EXPANDIDO */}
                    <motion.div 
                      initial={false}
                      animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                      transition={{ duration: 0.4, delay: isHovered ? 0.1 : 0 }}
                      className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 pointer-events-none"
                    >
                      <div className="pointer-events-auto flex flex-col w-full max-w-3xl">
                        
                        <div className="flex items-center gap-4 md:gap-6 mb-4 shrink-0">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border shrink-0 shadow-[0_0_30px_rgba(255,255,255,0.1)]" style={{ backgroundColor: `${area.color}33`, borderColor: `${area.color}4D` }}>
                            <area.icon className="w-6 h-6 md:w-8 md:h-8" style={{ color: area.color }} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-ps-display text-2xl md:text-4xl font-bold tracking-tight text-white leading-none mb-2 md:mb-3">{area.label}</h3>
                            <div className="flex items-center gap-3 md:gap-4">
                              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase" style={{ color: area.color }}>{area.score}% MATCH</span>
                              <div className="w-[120px] md:w-[200px] h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div className="h-full rounded-full" style={{ width: `${area.score}%`, backgroundColor: area.color }} />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-white/80 text-sm md:text-lg font-light leading-relaxed mb-6 md:mb-8 shrink-0 max-w-2xl border-l-2 pl-4" style={{ borderColor: area.color }}>
                          {area.teaser}
                        </p>
                        
                        <div className="shrink-0 flex items-center gap-4">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleSelectIntention(area.id, e); }}
                            className={`w-full md:w-auto px-8 py-4 font-bold text-xs md:text-sm uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 ${!isSelected && 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:bg-gray-200 active:scale-95'}`}
                            style={isSelected ? { backgroundColor: area.color, color: '#fff', boxShadow: `0 0 30px ${area.color}66` } : {}}
                          >
                            {isSelected ? <Sparkles className="w-5 h-5 shrink-0" /> : <Target className="w-5 h-5 shrink-0" />}
                            {isSelected ? 'Foco Selecionado' : 'Escolher Este Foco'}
                          </button>
                        </div>
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
    print(f"Failed. start: {start_idx}, end: {end_idx}")
