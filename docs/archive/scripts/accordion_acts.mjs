import fs from 'fs';
const file = '/Volumes/SSD EXTERNO/PROJETO PROTOCOLO SOLAR - ONDE PASSAR SEU ANIVERSARIO/solar-release-candidate/src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');

const radarStart = lines.findIndex(l => l.includes('8. RADAR 360°')) - 1;
const radarEnd = lines.findIndex(l => l.includes('9. CRONOGRAMA')) - 2;

const timelineStart = lines.findIndex(l => l.includes('9. CRONOGRAMA')) - 1;
const timelineEnd = lines.findIndex(l => l.includes('10. ATO 4')) - 2;

const ato4Start = lines.findIndex(l => l.includes('10. ATO 4')) - 1;
const ato4End = lines.findIndex(l => l.includes('11. PLANO B')) - 2;

const beforeRadar = lines.slice(0, radarStart).join('\n');
const radarContent = lines.slice(radarStart, radarEnd + 1).join('\n');
const timelineContent = lines.slice(timelineStart, timelineEnd + 1).join('\n');
const ato4Content = lines.slice(ato4Start, ato4End + 1).join('\n');
const afterAto4 = lines.slice(ato4End + 1).join('\n');

const newAto3 = `
      {/* ══════════════════════════════════════════════════
         ATO 3 (ACCORDION)
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-10 border-t border-white/[0.02]">
        <button 
          onClick={() => setOpenActs({...openActs, ato3: !openActs.ato3})}
          className="w-full max-w-4xl mx-auto flex items-center justify-between bg-white/[0.02] border border-white/[0.05] rounded-[24px] p-8 hover:bg-white/[0.04] transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center">
               <Calendar className="w-4 h-4 text-[#10b981]" />
            </div>
            <span className="text-white md:text-lg font-bold">O Mapa do Ano (Ver as 3 Fases e Radar 360)</span>
          </div>
          <ChevronDown className={\`w-6 h-6 text-white/50 group-hover:text-white transition-transform \${openActs.ato3 ? 'rotate-180' : ''}\`} />
        </button>

        <AnimatePresence>
          {openActs.ato3 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-10">
${timelineContent}
${radarContent}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
`;

const newAto4 = `
      {/* ══════════════════════════════════════════════════
         ATO 4 (ACCORDION)
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-10 border-t border-white/[0.02]">
        <button 
          onClick={() => setOpenActs({...openActs, ato4: !openActs.ato4})}
          className="w-full max-w-4xl mx-auto flex items-center justify-between bg-white/[0.02] border border-white/[0.05] rounded-[24px] p-8 hover:bg-white/[0.04] transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center">
               <Compass className="w-4 h-4 text-[#10b981]" />
            </div>
            <span className="text-white md:text-lg font-bold">O Que Eu Faço Agora? (Sinais e Plano de Ação)</span>
          </div>
          <ChevronDown className={\`w-6 h-6 text-white/50 group-hover:text-white transition-transform \${openActs.ato4 ? 'rotate-180' : ''}\`} />
        </button>

        <AnimatePresence>
          {openActs.ato4 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-10">
${ato4Content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
`;

const finalContent = beforeRadar + '\n' + newAto3 + '\n' + newAto4 + '\n' + afterAto4;
fs.writeFileSync(file, finalContent, 'utf8');
console.log("Success");
