const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const startStr = `<motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true, margin: "-50px" }}
                        variants={{
                          visible: { transition: { staggerChildren: 0.15 } },
                          hidden: {}
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                      >`;

const endStr = `</motion.div>
                    </div>
                  )}
               </div>`;

if (code.includes(startStr)) {
    const startIndex = code.indexOf(startStr);
    const endStrIndex = code.indexOf(endStr, startIndex);
    
    if (endStrIndex !== -1) {
        const replacement = `<motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true, margin: "-50px" }}
                        variants={{
                          visible: { transition: { staggerChildren: 0.15 } },
                          hidden: {}
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                      >
                        {currentActiveData.pillars?.map((pilar, index) => (
                          <motion.div 
                             key={index}
                             variants={{
                               hidden: { opacity: 0, y: 30 },
                               visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
                             }}
                             className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 md:p-10 hover:bg-white/[0.04] hover:-translate-y-2 hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 relative overflow-hidden group"
                          >
                             <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ boxShadow: \`inset 0 0 0 1px \${currentActiveData.color}20\` }} />
                             <div className="absolute -top-10 -right-10 w-48 h-48 opacity-10 pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:opacity-20 blur-3xl" style={{ backgroundColor: currentActiveData.color }} />
                             
                             <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-transform duration-500 group-hover:scale-110 shadow-lg" style={{ backgroundColor: \`\${currentActiveData.color}10\`, borderColor: \`\${currentActiveData.color}30\`, boxShadow: \`0 10px 20px -10px \${currentActiveData.color}40\` }}>
                               <pilar.icon className="w-7 h-7" style={{ color: currentActiveData.color }} />
                             </div>
                             <h3 className="text-2xl font-bold text-white mb-4 tracking-tight transition-colors duration-500 group-hover:!text-[var(--hover-color)]" style={{ '--hover-color': currentActiveData.color }}>{pilar.title}</h3>
                             <p className="text-white/60 text-base leading-[1.8] font-light">{pilar.text}</p>
                          </motion.div>
                        ))}
                      `;
        code = code.substring(0, startIndex) + replacement + code.substring(endStrIndex);
        fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
        console.log("Grid JSX replaced to use dynamic currentActiveData.pillars mapping!");
    } else {
        console.log("End string not found!");
    }
} else {
    console.log("Start string not found!");
}
