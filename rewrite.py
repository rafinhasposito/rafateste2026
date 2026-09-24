import sys
import re

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

start_idx = content.find('{/* O ACORDEÃO VERTICAL FLUIDO')
end_idx = content.find('{/* STICKY BOTTOM BAR')

if start_idx != -1 and end_idx != -1:
    new_ui = """{/* A GALERIA HOVER FLUIDA IGUAL A TELA 2 DO ONBOARDING */}
            <div className="w-full max-w-[1400px] mx-auto px-4 h-[75vh] md:h-[650px] flex flex-col md:flex-row gap-2 md:gap-3 relative z-10 pb-10">
              {LIFE_AREAS.map((area) => {
                const isHovered = hoveredArea === area.id;
                const isOtherHovered = hoveredArea !== null && hoveredArea !== area.id;
                const isSelected = selectedIntention === area.id;

                return (
                  <motion.div
                    key={area.id}
                    onMouseEnter={() => setHoveredArea(area.id)}
                    onMouseLeave={() => setHoveredArea(null)}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setHoveredArea(isHovered ? null : area.id);
                      }
                    }}
                    animate={{
                      width: typeof window !== "undefined" && window.innerWidth >= 768 
                        ? (isHovered ? '40%' : hoveredArea ? '8.5%' : '12.5%') 
                        : '100%',
                      height: typeof window !== "undefined" && window.innerWidth < 768
                        ? (isHovered ? '60%' : hoveredArea ? '5.7%' : '12.5%')
                        : '100%',
                      opacity: isOtherHovered ? 0.7 : 1,
                      filter: isOtherHovered ? 'grayscale(40%) brightness(0.8)' : 'grayscale(0%) brightness(1)',
                    }}
                    transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer bg-[#0B1426] flex flex-col group"
                  >
                    
                    {/* VIDEO HEADER AREA (Ocupa 100% quando fechado, encolhe para 40% quando aberto) */}
                    <motion.div
                      animate={{ 
                        height: isHovered ? (typeof window !== "undefined" && window.innerWidth < 768 ? '35%' : '45%') : '100%' 
                      }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="relative w-full shrink-0 overflow-hidden bg-black/50"
                    >
                      <div className="absolute inset-0 opacity-40 transition-colors duration-1000 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at top right, ${area.color} 0%, transparent 70%)` }} />
                      <video 
                        autoPlay loop muted playsInline 
                        className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-60 pointer-events-none" 
                        src="/videos/aura-loop.mp4" 
                      />
                      <div className="absolute inset-0 mix-blend-color opacity-80 pointer-events-none transition-colors duration-1000" style={{ backgroundColor: area.color }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/30 to-transparent pointer-events-none" />

                      {/* TEXTO COLAPSADO (Centralizado no meio do vídeo quando fechado) */}
                      <motion.div 
                        animate={{ opacity: isHovered ? 0 : 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                          <area.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white font-ps-display text-lg tracking-wider md:-rotate-90 md:mt-16 md:whitespace-nowrap drop-shadow-lg text-center leading-tight">
                          {area.label}
                        </span>
                      </motion.div>
                    </motion.div>

                    {/* CONTEÚDO EXPANDIDO (Aparece embaixo do vídeo quando hovered) */}
                    <motion.div 
                      initial={false}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.4, delay: isHovered ? 0.1 : 0 }}
                      className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto overflow-x-hidden min-w-[280px] custom-scrollbar"
                    >
                      <div className="flex items-center gap-4 mb-4 shrink-0">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]" style={{ backgroundColor: `${area.color}33`, borderColor: `${area.color}4D` }}>
                          <area.icon className="w-6 h-6" style={{ color: area.color }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-ps-display text-2xl md:text-3xl font-bold tracking-tight text-white leading-none mb-1.5">{area.label}</h3>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: area.color }}>{area.score}% MATCH</span>
                            <div className="flex-1 max-w-[120px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <motion.div className="h-full rounded-full" style={{ width: `${area.score}%`, backgroundColor: area.color }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-white/80 text-sm font-light leading-relaxed mb-6 italic border-l-2 pl-4 shrink-0" style={{ borderColor: area.color }}>
                        "{area.teaser}"
                      </p>
                      
                      <div className="mt-auto shrink-0">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleSelectIntention(area.id, e); }}
                          className={`w-full py-4 font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 ${!isSelected && 'bg-white/10 border border-white/20 text-white hover:bg-white/20 active:scale-95'}`}
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
    
    # Replace openArea with hoveredArea
    new_content = new_content.replace('const [openArea, setOpenArea] = useState<string>("amor");', 'const [hoveredArea, setHoveredArea] = useState<string | null>(null);')
    new_content = new_content.replace('setOpenArea(area.id)', 'setHoveredArea(area.id)')
    new_content = new_content.replace('setOpenArea("")', 'setHoveredArea(null)')
    
    with open("src/pages/HouseTrailer.tsx", "w") as f:
        f.write(new_content)
    print("Success")
else:
    print(f"Failed again: {start_idx}, {end_idx}")
