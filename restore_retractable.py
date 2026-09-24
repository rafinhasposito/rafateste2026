with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

start_str = '{/* LAYOUT: SIDEBAR ACCORDION + PAINEL GIGANTE */}'
end_str = '{/* STICKY BOTTOM BAR (Aparece quando escolhe) */}'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_ui = """{/* LAYOUT: SIDEBAR RETRÁTIL + PAINEL QUE CRESCE */}
            <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col-reverse lg:flex-row gap-6 lg:gap-6 relative z-10 pb-20 lg:h-[700px] xl:h-[760px] items-stretch">
              
              {/* COLUNA ESQUERDA: SIDEBAR (Expandida por padrão, encolhe pra ícones no hover) */}
              <motion.div
                animate={{ width: hoveredArea ? 72 : 320 }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.15 }}
                className="hidden lg:flex shrink-0 flex-col gap-2 items-stretch h-full overflow-hidden"
              >
                {LIFE_AREAS.map((area) => {
                  const currentActive = hoveredArea || "amor";
                  const isActive = currentActive === area.id;

                  return (
                    <motion.div
                      key={area.id}
                      onMouseEnter={() => setHoveredArea(area.id)}
                      onClick={() => setHoveredArea(area.id)}
                      className={`relative flex items-center gap-4 p-3 rounded-2xl border overflow-hidden cursor-pointer group flex-1 transition-colors duration-300 ${
                        isActive && hoveredArea
                          ? 'border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                          : 'border-white/5 hover:border-white/15'
                      }`}
                      style={{
                        backgroundColor: isActive ? `${area.color}18` : `${area.color}08`,
                        borderColor: isActive && hoveredArea ? `${area.color}44` : undefined,
                      }}
                    >
                      {/* Aura sutil para o item ativo */}
                      {isActive && hoveredArea && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.15 }}
                          className="absolute inset-0 pointer-events-none"
                          style={{ background: `linear-gradient(135deg, ${area.color} 0%, transparent 70%)` }}
                        />
                      )}

                      {/* Ícone (Sempre visível) */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500 relative z-10 group-hover:scale-110"
                        style={{
                          backgroundColor: isActive ? `${area.color}33` : `${area.color}15`,
                          borderColor: isActive ? `${area.color}55` : `${area.color}30`,
                        }}
                      >
                        <area.icon className="w-5 h-5 transition-colors duration-500" style={{ color: isActive ? area.color : `${area.color}99` }} />
                      </div>

                      {/* Texto + Barra (Visível quando sidebar expandida, esconde quando retraída) */}
                      <motion.div
                        animate={{ opacity: hoveredArea ? 0 : 1, x: hoveredArea ? -10 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 min-w-[180px] relative z-10"
                      >
                        <span className="block font-ps-display text-sm text-white font-bold mb-1.5 whitespace-nowrap tracking-wide">
                          {area.label}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              animate={{ width: !hoveredArea ? `${area.score}%` : '0%' }}
                              transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
                              style={{ backgroundColor: area.color }}
                            />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                            {area.score}%
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* VERSÃO MOBILE DA SIDEBAR (Sempre expandida, sem retração) */}
              <div className="w-full lg:hidden flex flex-col gap-2">
                {LIFE_AREAS.map((area) => {
                  const currentActive = hoveredArea || "amor";
                  const isActive = currentActive === area.id;

                  return (
                    <button
                      key={area.id}
                      onClick={() => setHoveredArea(area.id)}
                      className={`relative flex items-center gap-4 p-3 rounded-2xl border overflow-hidden text-left ${
                        isActive ? 'border-white/20' : 'border-white/5'
                      }`}
                      style={{
                        backgroundColor: isActive ? `${area.color}18` : `${area.color}08`,
                        borderColor: isActive ? `${area.color}44` : undefined,
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{ backgroundColor: `${area.color}22`, borderColor: `${area.color}44` }}
                      >
                        <area.icon className="w-5 h-5" style={{ color: area.color }} />
                      </div>
                      <div className="flex-1">
                        <span className="block font-ps-display text-sm text-white font-bold mb-1">
                          {area.label}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              animate={{ width: `${area.score}%` }}
                              transition={{ duration: 0.8, type: 'spring' }}
                              style={{ backgroundColor: area.color }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-white/70">{area.score}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* COLUNA DIREITA: O PAINEL DE CINEMA (Cresce quando a sidebar encolhe) */}
              <motion.div
                layout
                className="flex-1 h-[600px] lg:h-full relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-[#0B1426] z-10"
              >
                <AnimatePresence mode="wait">
                  {LIFE_AREAS.filter(a => a.id === (hoveredArea || "amor")).map((activeArea) => (
                    <motion.div
                      key={activeArea.id}
                      initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="absolute inset-0 w-full h-full flex flex-col justify-end"
                    >
                      {/* BACKGROUNDS PREMIUM */}
                      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at top right, ${activeArea.color} 0%, transparent 80%)` }} />
                      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-60 pointer-events-none" src="/videos/aura-loop.mp4" />
                      <div className="absolute inset-0 mix-blend-color opacity-80 pointer-events-none" style={{ backgroundColor: activeArea.color }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/80 to-transparent pointer-events-none" />
                      
                      {/* CONTEÚDO PRINCIPAL */}
                      <div className="relative z-10 p-8 md:p-16 w-full max-w-4xl flex flex-col">
                        
                        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] flex items-center justify-center border shrink-0 shadow-[0_0_50px_rgba(255,255,255,0.15)] bg-black/20 backdrop-blur-md" style={{ borderColor: `${activeArea.color}66` }}>
                            <activeArea.icon className="w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" style={{ color: activeArea.color }} />
                          </div>
                          <div className="flex-1 pb-2">
                            <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] mb-4 text-white drop-shadow-md">
                              Foco e Intenção
                            </span>
                            <h3 className="font-ps-display text-4xl md:text-6xl font-bold tracking-tight text-white leading-none drop-shadow-xl">{activeArea.label}</h3>
                          </div>
                        </div>
                        
                        <div className="w-full h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent mb-8" />
                        
                        <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-2xl drop-shadow-md">
                          {activeArea.teaser}
                        </p>
                        
                        <div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleSelectIntention(activeArea.id, e); }}
                            className={`w-full md:w-auto px-10 py-5 font-bold text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${selectedIntention !== activeArea.id && 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 hover:bg-gray-100'}`}
                            style={selectedIntention === activeArea.id ? { backgroundColor: activeArea.color, color: '#fff', boxShadow: `0 0 50px ${activeArea.color}80` } : {}}
                          >
                            {selectedIntention === activeArea.id ? <Sparkles className="w-5 h-5 shrink-0" /> : <Target className="w-5 h-5 shrink-0" />}
                            {selectedIntention === activeArea.id ? 'Foco Selecionado' : 'Selecionar Como Meu Destino'}
                          </button>
                        </div>
                        
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

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
