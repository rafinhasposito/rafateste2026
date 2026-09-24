import sys
import re

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

# 1. Remove isSidebarHovered logic from left column wrapper
sidebar_wrapper_pattern = r'<motion\.div\s*onMouseEnter=\{.*?\s*onMouseLeave=\{.*?\s*animate=\{\{ width:.*?\}\}\s*transition=\{.*?\s*className="shrink-0 flex flex-col gap-3 items-stretch h-full relative z-20"\s*>'
sidebar_wrapper_replacement = '<div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-3 items-stretch h-full relative z-20">'
content = re.sub(sidebar_wrapper_pattern, sidebar_wrapper_replacement, content, flags=re.DOTALL)

# Also replace the closing </motion.div> for the sidebar
closing_sidebar_pattern = r'</motion\.div>\s*{/\* COLUNA DIREITA'
closing_sidebar_replacement = '</div>\n\n              {/* COLUNA DIREITA'
content = re.sub(closing_sidebar_pattern, closing_sidebar_replacement, content)

# 2. Fix the items to always show details and have correct static background colors
item_map_pattern = r'const showDetails = typeof window !== "undefined" && window\.innerWidth < 1024 \? true : isSidebarHovered;.*?(?=</motion\.div>\s*}\)\s*</div)'
# We will use regex to find the inner return statement
# Actually it's easier to just rewrite the whole mapping
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
                        backgroundColor: isActive ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                        borderColor: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                      }}
                      transition={{ duration: 0.3 }}
                      className={`relative flex items-center p-3 rounded-2xl border overflow-hidden text-left cursor-pointer shadow-sm flex-1 ${
                        isActive ? '' : 'hover:bg-white/[0.05] hover:border-white/20'
                      }`}
                      style={{ height: '100%' }}
                    >
                      {/* Aura sutil para o item ativo usando a cor da área */}
                      {isActive && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(90deg, ${area.color} 0%, transparent 100%)` }} />
                      )}

                      {/* Ícone */}
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-500 relative z-10" 
                        style={{ backgroundColor: isActive ? `${area.color}22` : 'rgba(255,255,255,0.02)', borderColor: isActive ? `${area.color}44` : 'rgba(255,255,255,0.1)' }}
                      >
                        <area.icon className="w-5 h-5 transition-colors duration-500" style={{ color: isActive ? area.color : 'rgba(255,255,255,0.5)' }} />
                      </div>
                      
                      {/* Textos e Barra (SEMPRE VISÍVEIS) */}
                      <div className="flex-1 min-w-[200px] ml-4 relative z-10">
                        <span className={`block font-ps-display text-base font-bold mb-1.5 whitespace-nowrap transition-colors ${isActive ? 'text-white' : 'text-white/80'}`}>
                          {area.label}
                        </span>
                        <div className="flex items-center gap-3 pr-2">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full rounded-full" 
                              initial={{ width: 0 }}
                              animate={{ width: `${area.score}%` }}
                              transition={{ duration: 1.2, type: 'spring', bounce: 0.2, delay: 0.2 }}
                              style={{ backgroundColor: area.color }} 
                            />
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-white/50'}`}>
                            {area.score}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              """
    content = content[:start_idx] + new_left_col + content[end_idx:]
    
    with open("src/pages/HouseTrailer.tsx", "w") as f:
        f.write(content)
    print("Success")
else:
    print("Failed")
