import sys
import re

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

# Remove the "Outras Opções" tag
tag_pattern = r'<div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-\[10px\] uppercase font-bold tracking-widest text-white/40 mb-2 w-fit">\s*<span>Outras Opções</span>\s*</div>'
content = re.sub(tag_pattern, '', content)

# Now rewrite the left column mapping
# We find the start of the mapping for the left column
start_str = '{LIFE_AREAS.map((area) => {'
end_str = '{/* COLUNA DIREITA: O PAINEL DE CINEMA */}'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_left_col = """{LIFE_AREAS.map((area) => {
                  const currentActive = hoveredArea || "amor";
                  const isActive = currentActive === area.id;

                  return (
                    <motion.div
                      key={area.id}
                      onMouseEnter={() => setHoveredArea(area.id)}
                      onClick={() => setHoveredArea(area.id)}
                      animate={{
                        width: isActive ? '100%' : '72px',
                        backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                        borderColor: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                      }}
                      transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                      className={`relative flex items-center p-3 rounded-2xl border overflow-hidden text-left cursor-pointer shadow-sm ${
                        isActive ? '' : 'hover:bg-white/[0.05] hover:border-white/20'
                      }`}
                      style={{ height: '72px' }}
                    >
                      {/* Aura sutil para o item ativo */}
                      {isActive && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(90deg, ${area.color} 0%, transparent 100%)` }} />
                      )}

                      {/* Ícone (Sempre visível) */}
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-500 relative z-10" 
                        style={{ backgroundColor: isActive ? `${area.color}22` : 'rgba(255,255,255,0.02)', borderColor: isActive ? `${area.color}44` : 'rgba(255,255,255,0.1)' }}
                      >
                        <area.icon className="w-5 h-5 transition-colors duration-500" style={{ color: isActive ? area.color : 'rgba(255,255,255,0.5)' }} />
                      </div>
                      
                      {/* Textos e Barra (Aparecem suavemente quando expande) */}
                      <motion.div 
                        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 min-w-[200px] ml-4 relative z-10"
                      >
                        <span className="block font-ps-display text-base text-white font-bold mb-1.5 whitespace-nowrap">
                          {area.label}
                        </span>
                        <div className="flex items-center gap-3 pr-2">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full rounded-full" 
                              initial={{ width: 0 }}
                              animate={{ width: `${area.score}%` }}
                              transition={{ duration: 1, delay: 0.1 }}
                              style={{ backgroundColor: area.color }} 
                            />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                            {area.score}%
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              """
    
    new_content = content[:start_idx] + new_left_col + content[end_idx:]
    
    # Also change the left column wrapper width to allow smooth expansion
    # We find `<div className="w-full lg:w-[35%] xl:w-[30%] flex flex-col gap-3">`
    wrapper_pattern = r'<div className="w-full lg:w-\[35%\] xl:w-\[30%\] flex flex-col gap-3">'
    wrapper_replacement = r'<div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-3 items-start">'
    new_content = re.sub(wrapper_pattern, wrapper_replacement, new_content)
    
    with open("src/pages/HouseTrailer.tsx", "w") as f:
        f.write(new_content)
    print("Success")
else:
    print("Failed")
