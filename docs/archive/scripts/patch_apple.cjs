const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `            <motion.h2
              style={{ scale: casaScale, opacity: casaOpacity, filter: casaBlur }}
              className="font-ps-display text-[22vw] md:text-[200px] font-bold tracking-tighter leading-[0.8] mb-2 text-transparent bg-clip-text bg-gradient-to-b from-[#3b82f6] to-blue-200 origin-center uppercase"
            >
              {P.city}
            </motion.h2>
            </div>
        </div>`;

const replacement = `            <motion.h2
              style={{ scale: casaScale, opacity: casaOpacity, filter: casaBlur }}
              className="font-ps-display text-[22vw] md:text-[200px] font-bold tracking-tighter leading-[0.8] mb-2 text-transparent bg-clip-text bg-gradient-to-b from-[#3b82f6] to-blue-200 origin-center uppercase"
            >
              {P.city}
            </motion.h2>
            
            <motion.div style={{ opacity: casaOpacity }} className="mt-8 flex flex-col items-center">
               <span className="text-white/50 text-xs font-bold uppercase tracking-[0.3em] mb-3">Foco Escolhido</span>
               <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6] text-sm uppercase tracking-widest font-semibold backdrop-blur-md">
                  <Heart className="w-4 h-4" /> {P.intention}
               </div>
            </motion.div>
          </div>
        </div>`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
