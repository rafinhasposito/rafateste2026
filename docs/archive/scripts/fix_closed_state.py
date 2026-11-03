import sys

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

import re

# Find the ESTADO FECHADO block
pattern = r"/\*\s*===\s*ESTADO FECHADO \(O ITEM DA LISTA\)\s*===\s*\*/.*?</div>\s*\)\}"
replacement = """/* === ESTADO FECHADO (O ITEM DA LISTA) === */
                      <div className="flex items-center gap-4 px-6 py-6">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-500 bg-white/5 border-white/10`}>
                          <Lock className="w-4 h-4 text-white/30" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="block text-base font-medium text-white/70 group-hover:text-white transition-colors">{area.label}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-2.5">
                            <div className="flex-1 max-w-[220px] h-3.5 bg-white/[0.05] rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full rounded-full" 
                                initial={{ width: 0 }}
                                animate={{ width: `${area.score}%` }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                style={{ backgroundColor: area.color, opacity: 0.5 }} 
                              />
                            </div>
                            <span className="text-[10px] font-bold font-ps-display tracking-widest uppercase text-white/30">
                              {area.score}% MATCH
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 pl-2">
                          <ChevronDown className="w-5 h-5 text-white/20 -rotate-90 group-hover:text-white/40 transition-colors" />
                        </div>
                      </div>
                    )}"""

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open("src/pages/HouseTrailer.tsx", "w") as f:
    f.write(new_content)

print("Success")
