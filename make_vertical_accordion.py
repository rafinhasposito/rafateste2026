import re

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

# Replace the gallery with the proper vertical accordion
start_str = '{/* A GALERIA FLEX-GROW IGUAL A TELA 2 DO ONBOARDING */}'
end_str = '{/* STICKY BOTTOM BAR (Aparece quando escolhe) */}'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_ui = """{/* O ACORDEÃO VERTICAL FLUIDO (HOVER APPLE) */}
            <div className="w-full max-w-5xl mx-auto flex flex-col gap-3 relative z-10 pb-10 min-h-[800px]">
              {LIFE_AREAS.map((area) => {
                const isActive = openArea === area.id;
                const isSelected = selectedIntention === area.id;

                return (
                  <motion.div
                    layout
                    key={area.id}
                    onMouseEnter={() => setOpenArea(area.id)}
                    onClick={() => { setOpenArea(area.id); if(!isActive) return; }}
                    initial={{ borderRadius: 24 }}
                    animate={{ 
                      borderRadius: isActive ? 32 : 24,
                      flex: isActive ? 5 : 0,
                      height: isActive ? 'auto' : '88px'
                    }}
                    transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                    className={`relative overflow-hidden border cursor-pointer transition-colors duration-500 w-full shrink-0 flex flex-col justify-center ${
                      isActive ? 'border-white/20 shadow-[0_0_80px_rgba(255,255,255,0.05)] bg-[#0B1426]' : 'border-white/5 shadow-md hover:border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    {/* VIDEO E AURA (Sempre presentes, opacidade muda na transição) */}
                    <div className="absolute inset-0 bg-[#030306] pointer-events-none" />
                    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isActive ? 'opacity-30' : 'opacity-0'}`} style={{ backgroundImage: `radial-gradient(circle at top right, ${area.color} 0%, transparent 70%)` }} />
                    <video autoPlay loop muted playsInline className={`absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none transition-opacity duration-700 ${isActive ? 'opacity-40' : 'opacity-0'}`} src="/videos/aura-loop.mp4" />
                    <div className={`absolute inset-0 mix-blend-color pointer-events-none transition-opacity duration-700 ${isActive ? 'opacity-60' : 'opacity-0'}`} style={{ backgroundColor: area.color }} />
                    <div className={`absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/60 to-transparent pointer-events-none transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                    {/* COLAPSADO (A BARRINHA HORIZONTAL ORIGINAL) */}
                    <motion.div 
                      animate={{ opacity: isActive ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 w-full h-full flex items-center justify-between px-6 pointer-events-none"
                    >
                      <div className="flex items-center gap-4 md:gap-6 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <area.icon className="w-5 h-5 text-white/50" />
                        </div>
                        
                        <span className="text-white/80 font-medium text-lg md:text-xl truncate w-[180px] md:w-[250px]">
                          {area.label}
                        </span>
                        
                        {/* A BARRINHA DE PORCENTAGEM */}
                        <div className="hidden md:flex items-center gap-4 flex-1 max-w-sm ml-auto mr-8">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full opacity-60" style={{ width: `${area.score}%`, backgroundColor: area.color }} />
                          </div>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-white/40 shrink-0">{area.score}% MATCH</span>
                        </div>
                      </div>

                      <div className="shrink-0 pl-4 border-l border-white/5">
                        <ChevronDown className="w-5 h-5 text-white/20 -rotate-90" />
                      </div>
                    </motion.div>

                    {/* EXPANDIDO (PAINEL GIGANTE) */}
                    <motion.div
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.4, delay: isActive ? 0.2 : 0 }}
                      className={`relative z-10 p-8 md:p-12 w-full flex flex-col justify-end min-h-[450px] ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
                    >
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
