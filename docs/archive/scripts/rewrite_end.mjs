import fs from 'fs';
const file = '/Volumes/SSD EXTERNO/PROJETO PROTOCOLO SOLAR - ONDE PASSAR SEU ANIVERSARIO/solar-release-candidate/src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

// let's just find the end of section 3 and replace it perfectly.
const startIndex = lines.findIndex(l => l.includes('STATUS BADGES'));
const endIndex = lines.findIndex(l => l.includes('5. ATO 2 — "POR QUE ESSE LUGAR MUDA TUDO"'));

// Let's replace from startIndex to endIndex - 2 with perfectly balanced tags.
const newEnd = `                  {/* STATUS BADGES */}
                  <div className="flex flex-wrap justify-center gap-4 mt-8 pb-4">
                    <div className="flex items-center gap-2.5 bg-[#10b981]/10 border border-[#10b981]/20 rounded-full px-5 py-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                      <span className="text-[10px] text-[#10b981] font-bold uppercase tracking-widest">Status de Ancoragem: Registrado</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
                      <Clock className="w-3.5 h-3.5 text-white/50" />
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Janela de Ativação: 24h no Destino</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Reveal>
  </div>
</section>`;

let before = lines.slice(0, startIndex).join('\n');
let after = lines.slice(endIndex - 2).join('\n'); // 2 lines before section 5

fs.writeFileSync(file, before + '\n' + newEnd + '\n' + after, 'utf8');
console.log("Success");
