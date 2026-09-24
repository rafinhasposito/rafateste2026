import sys
import re

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

# First, find where to inject the displayAreas logic
# Right after: const [selectedIntention, setSelectedIntention] = useState<string | null>(null);

logic_pattern = r"(const \[selectedIntention,\s*setSelectedIntention\]\s*=\s*useState<string\s*\|\s*null>\(null\);)"
logic_replacement = r"""\1

  const activeArea = LIFE_AREAS.find(a => a.id === openArea);
  const otherAreas = LIFE_AREAS.filter(a => a.id !== openArea);
  const displayAreas = activeArea ? [activeArea, ...otherAreas] : LIFE_AREAS;"""

content = re.sub(logic_pattern, logic_replacement, content)

# Now replace the <div className="w-full"> ... </div> that wraps the grid
# Using exact string boundaries is risky, I will use regex on the main section block.
# We want to replace from: <div className="w-full">
# To the end of the section just before {/* STICKY BOTTOM BAR

grid_pattern = r'<div className="w-full">\s*<div className="grid grid-cols-1 md:grid-cols-12 gap-8">.*?(?={/\*\s*STICKY BOTTOM BAR)'

replacement_ui = """<div className="w-full max-w-4xl mx-auto flex flex-col gap-4 relative z-10 pb-20">
              {displayAreas.map((area) => {
                const isOpen = openArea === area.id;
                const isSelected = selectedIntention === area.id;

                return (
                  <motion.div
                    layout
                    key={area.id}
                    initial={{ borderRadius: 24 }}
                    animate={{ borderRadius: isOpen ? 40 : 24 }}
                    transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                    className={`w-full overflow-hidden border transition-colors duration-500 cursor-pointer ${isOpen ? 'bg-black/60 border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05)]' : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10'}`}
                    onClick={() => !isOpen && setOpenArea(area.id)}
                  >
                    {isOpen ? (
                      /* === PAINEL GIGANTE (SELECIONADO) === */
                      <div className="relative min-h-[500px] flex flex-col justify-end overflow-hidden group cursor-default">
                        
                        {/* AURA DINÂMICA */}
                        <div className="absolute inset-0 opacity-40 transition-colors duration-1000 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at top right, ${area.color} 0%, transparent 70%)` }} />
                        
                        {/* VÍDEO PREMIUM DE FUNDO */}
                        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-50 pointer-events-none" src="/videos/aura-loop.mp4" />
                        
                        {/* CAMADA DE TINTURA */}
                        <div className="absolute inset-0 mix-blend-color opacity-70 transition-colors duration-1000 pointer-events-none" style={{ backgroundColor: area.color }} />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/70 to-[#0B1426] pointer-events-none" />

                        {/* CONTEÚDO DO PAINEL */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="relative z-10 p-8 md:p-12 w-full">
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center border transition-colors duration-500 shrink-0" style={{ backgroundColor: `${area.color}33`, borderColor: `${area.color}4D` }}>
                              <area.icon className="w-8 h-8 transition-colors duration-500" style={{ color: area.color }} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-ps-display text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">{area.label}</h3>
                              <div className="flex items-center gap-4">
                                <div className="w-full max-w-[280px] h-3 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${area.score}%` }} transition={{ duration: 1, delay: 0.3 }} style={{ backgroundColor: area.color }} />
                                </div>
                                <span className="text-[12px] font-bold tracking-widest uppercase" style={{ color: area.color }}>{area.score}% MATCH</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="max-w-3xl">
                            <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed mb-8">{area.teaser}</p>
                            
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleSelectIntention(area.id, e); }}
                              className={`w-full md:w-auto px-12 py-5 font-bold text-sm uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-3 ${!isSelected && 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:bg-gray-200 hover:scale-105 active:scale-95'}`}
                              style={isSelected ? { backgroundColor: area.color, color: '#fff', boxShadow: `0 0 40px ${area.color}66` } : {}}
                            >
                              {isSelected ? <Sparkles className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                              {isSelected ? 'Foco Selecionado' : 'Escolher Este Foco'}
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      /* === MENUZINHO ENCOLHIDO (AS OUTRAS 7 OPÇÕES) === */
                      <div className="flex items-center gap-4 px-6 py-5">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-white/5 border-white/10 group-hover:border-white/20 transition-colors">
                          <area.icon className="w-5 h-5 text-white/50" />
                        </div>
                        
                        <div className="flex-1 text-left flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-8">
                          <span className="block text-lg font-medium text-white/80">{area.label}</span>
                          
                          <div className="flex items-center gap-4 w-full md:max-w-[300px]">
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full rounded-full" 
                                initial={{ width: 0 }}
                                animate={{ width: `${area.score}%` }}
                                transition={{ duration: 0.8 }}
                                style={{ backgroundColor: area.color, opacity: 0.5 }} 
                              />
                            </div>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-white/40 shrink-0 w-[80px] text-right">{area.score}% MATCH</span>
                          </div>
                        </div>

                        <div className="shrink-0 pl-2">
                          <ChevronDown className="w-5 h-5 text-white/20 -rotate-90" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      """

content = re.sub(grid_pattern, replacement_ui, content, flags=re.DOTALL)

with open("src/pages/HouseTrailer.tsx", "w") as f:
    f.write(content)

print("Replacement complete")
