import sys
import re

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

# Replace the array reordering (we don't need it, we map over LIFE_AREAS directly)
logic_pattern = r"(const activeArea = LIFE_AREAS\.find\(a => a\.id === openArea\);\s*const otherAreas = LIFE_AREAS\.filter\(a => a\.id !== openArea\);\s*const displayAreas = activeArea \? \[activeArea, \.\.\.otherAreas\] : LIFE_AREAS;)"
content = re.sub(logic_pattern, "", content)

# Now find the UI block.
# We will match from <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 relative z-10 pb-20">
# up to the end of AnimatePresence.
start_str = '<div className="w-full max-w-4xl mx-auto flex flex-col gap-4 relative z-10 pb-20">'
end_str = '{/* STICKY BOTTOM BAR (Aparece quando escolhe) */}'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_ui = """{/* A GALERIA FLEX-GROW IGUAL A TELA 2 DO ONBOARDING */}
            <div className="w-full max-w-7xl mx-auto px-4 h-[650px] flex flex-col lg:flex-row gap-3 lg:gap-4 relative z-10 pb-10">
              {LIFE_AREAS.map((area) => {
                const isActive = openArea === area.id;
                const isSelected = selectedIntention === area.id;

                return (
                  <motion.div
                    key={area.id}
                    onClick={() => setOpenArea(isActive ? "" : area.id)}
                    animate={{ flex: isActive ? (typeof window !== "undefined" && window.innerWidth >= 1024 ? 6 : 4) : 1 }}
                    transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                    className={`relative rounded-3xl overflow-hidden border cursor-pointer transition-colors duration-500 flex-shrink-0 flex flex-col justify-end ${
                      isActive ? 'border-white/20 shadow-[0_0_80px_rgba(255,255,255,0.05)]' : 'border-white/5 shadow-md hover:border-white/10'
                    }`}
                  >
                    {/* AURA / BACKGROUND */}
                    <div className="absolute inset-0 bg-black/60" />
                    {isActive && (
                      <>
                        <div className="absolute inset-0 opacity-40 pointer-events-none transition-colors duration-1000" style={{ backgroundImage: `radial-gradient(circle at top right, ${area.color} 0%, transparent 70%)` }} />
                        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-50 pointer-events-none" src="/videos/aura-loop.mp4" />
                        <div className="absolute inset-0 mix-blend-color opacity-70 pointer-events-none transition-colors duration-1000" style={{ backgroundColor: area.color }} />
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/60 to-transparent pointer-events-none" />

                    {/* COLAPSADO (TIRINHA) */}
                    <motion.div 
                      animate={{ opacity: isActive ? 0 : 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                        <area.icon className="w-5 h-5 text-white/50" />
                      </div>
                      {/* O texto fica deitado no desktop, mas vertical no mobile. Truque CSS: */}
                      <span className="text-white/60 font-medium whitespace-nowrap lg:-rotate-90 lg:mt-16 text-sm tracking-wide">
                        {area.label}
                      </span>
                    </motion.div>

                    {/* EXPANDIDO (PAINEL GIGANTE) */}
                    <motion.div
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 pointer-events-none"
                    >
                      <div className="pointer-events-auto flex flex-col justify-end h-full w-full max-w-2xl">
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0" style={{ backgroundColor: `${area.color}33`, borderColor: `${area.color}4D` }}>
                            <area.icon className="w-6 h-6" style={{ color: area.color }} />
                          </div>
                          <div>
                            <h3 className="font-ps-display text-2xl md:text-4xl font-bold tracking-tight text-white mb-1">{area.label}</h3>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: area.color }}>{area.score}% MATCH</span>
                              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div className="h-full rounded-full" style={{ width: `${area.score}%`, backgroundColor: area.color }} />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-white/70 text-sm md:text-base font-light leading-relaxed mb-6 opacity-90">{area.teaser}</p>
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleSelectIntention(area.id, e); }}
                          className={`w-full md:w-fit px-8 py-4 font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-3 ${!isSelected && 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:bg-gray-200 active:scale-95'}`}
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
    print(f"Failed. start: {start_idx}, end: {end_idx}")
