const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// The block to replace:
const targetSidebar = `              <motion.div
                animate={{ width: isPanelHovered ? 72 : 300 }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.15 }}
                className="hidden lg:flex shrink-0 flex-col gap-2 items-stretch min-h-[700px] overflow-hidden"
              >
                {sortedAreas.map((area) => {
                  const currentActive = hoveredArea || sortedAreas[0].id;
                  const isActive = currentActive === area.id;

                  return (
                    <div
                      key={area.id}
                      onMouseEnter={() => setHoveredArea(area.id)}
                      onClick={() => { setHoveredArea(area.id); setIsPanelHovered(true); }}
                      className="relative flex-1 rounded-2xl border overflow-hidden cursor-pointer group transition-all duration-300"
                      style={{
                        backgroundColor: isActive ? \`\${area.color}18\` : \`\${area.color}08\`,
                        borderColor: isActive ? \`\${area.color}44\` : 'rgba(255,255,255,0.05)',
                        boxShadow: isActive ? \`0 0 20px \${area.color}20\` : 'none',
                      }}
                    >
                      {/* Aura sutil para o item ativo */}
                      {isActive && (
                        <div
                          className="absolute inset-0 pointer-events-none opacity-10"
                          style={{ background: \`linear-gradient(135deg, \${area.color} 0%, transparent 70%)\` }}
                        />
                      )}

                      {/* Conteúdo sempre visível: ícone + nome + barra */}
                      <div className="absolute inset-0 flex items-center gap-3 px-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110"
                          style={{
                            backgroundColor: isActive ? \`\${area.color}33\` : \`\${area.color}15\`,
                            borderColor: isActive ? \`\${area.color}55\` : \`\${area.color}30\`,
                          }}
                        >
                          <area.icon className="w-4 h-4" style={{ color: isActive ? area.color : \`\${area.color}80\` }} />
                        </div>

                        <motion.div
                          animate={{ opacity: isPanelHovered ? 0 : 1 }}
                          transition={{ duration: 0.25 }}
                          className="flex-1 min-w-0 pointer-events-none"
                        >
                          <span className={\`block font-ps-display text-sm font-bold mb-1 whitespace-nowrap tracking-wide transition-colors duration-300 \${isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'}\`}>
                            {area.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                animate={{ width: isActive ? \`\${area.score}%\` : '0%' }}
                                transition={{ duration: 0.8, type: 'spring', bounce: 0.25, delay: isActive ? 0.05 : 0 }}
                                style={{ backgroundColor: area.color, opacity: isActive ? 1 : 0.4 }}
                              />
                            </div>
                            <motion.span
                              animate={{ opacity: isActive ? 1 : 0 }}
                              transition={{ duration: 0.3, delay: isActive ? 0.7 : 0 }}
                              className="text-[10px] font-bold tracking-widest shrink-0 text-white"
                            >
                              {area.score}%
                            </motion.span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>`;

const replacementSidebar = `              <div
                className="hidden lg:flex w-[72px] shrink-0 flex-col gap-2 items-stretch min-h-[700px]"
              >
                {sortedAreas.map((area) => {
                  const currentActive = hoveredArea || sortedAreas[0].id;
                  const isActive = currentActive === area.id;

                  return (
                    <div
                      key={area.id}
                      onClick={() => setHoveredArea(area.id)}
                      className="relative flex-1 rounded-2xl border flex items-center justify-center cursor-pointer group transition-all duration-300"
                      style={{
                        backgroundColor: isActive ? \`\${area.color}18\` : \`\${area.color}08\`,
                        borderColor: isActive ? \`\${area.color}44\` : 'rgba(255,255,255,0.05)',
                        boxShadow: isActive ? \`0 0 20px \${area.color}20\` : 'none',
                      }}
                    >
                      {/* Aura sutil para o item ativo */}
                      {isActive && (
                        <div
                          className="absolute inset-0 pointer-events-none opacity-10 rounded-2xl"
                          style={{ background: \`linear-gradient(135deg, \${area.color} 0%, transparent 70%)\` }}
                        />
                      )}
                      <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 z-10"
                          style={{
                            backgroundColor: isActive ? \`\${area.color}33\` : \`\${area.color}15\`,
                            borderColor: isActive ? \`\${area.color}55\` : \`\${area.color}30\`,
                          }}
                      >
                          <area.icon className="w-4 h-4" style={{ color: isActive ? area.color : \`\${area.color}80\` }} />
                      </div>
                    </div>
                  );
                })}
              </div>`;

if (code.includes(targetSidebar)) {
    code = code.replace(targetSidebar, replacementSidebar);
    console.log("Sidebar locked successfully.");
} else {
    console.log("Sidebar target not found!");
}

// Remove hover from right panel
const rightPanelTarget = `              {/* COLUNA DIREITA: O PAINEL DE CINEMA — quando mouse entra aqui a sidebar encolhe pra ícones */}
              <motion.div
                layout
                onMouseEnter={() => setIsPanelHovered(true)}
                onMouseLeave={() => setIsPanelHovered(false)}
                className="flex-1 h-[600px] lg:min-h-[700px] relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10 transition-colors duration-1000" style={{ backgroundColor: \`color-mix(in srgb, \${currentActiveData?.color || '#10b981'} 12%, #000000)\` }}
              >`;

const rightPanelReplacement = `              {/* COLUNA DIREITA: O PAINEL GIGANTE (Travado) */}
              <div
                className="flex-1 h-[600px] lg:min-h-[700px] relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10 transition-colors duration-1000" style={{ backgroundColor: \`color-mix(in srgb, \${currentActiveData?.color || '#10b981'} 12%, #000000)\` }}
              >`;

if (code.includes(rightPanelTarget)) {
    code = code.replace(rightPanelTarget, rightPanelReplacement);
    console.log("Right panel hover removed successfully.");
} else {
    console.log("Right panel target not found!");
}

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
