const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const heroTargetRegex = /\{\/\* ══════════════════════════════════════════════════\n         1\. HERO[\s\S]*?<\/section>/;

const heroReplacementBlock = `{/* ══════════════════════════════════════════════════
         1. HERO (Sticky Parallax Apple-style)
         ══════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[200vh]">
        {/* Sticky Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-end items-center pb-16 md:pb-24">
          
          {/* Video Background */}
          <motion.div style={{ opacity: vidOpacity }} className="absolute inset-0 z-0 bg-black">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="/assets/ny.mp4" type="video/mp4" />
            </video>
          </motion.div>
          
          {/* Gradient to protect text at the bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/60 to-transparent pointer-events-none z-10" />

          {/* Tag EUA */}
          <div className="absolute top-20 md:top-24 right-6 md:right-10 z-20 flex items-center gap-2 text-white/50">
             <MapPin className="w-3.5 h-3.5" />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em]">EUA</span>
          </div>

          {/* The Text Block - Fixed at bottom (like Option 1) but animated by scroll (like Option 2) */}
          <div className="relative z-20 flex flex-col items-center text-center w-full max-w-4xl px-6">
            <motion.div style={{ opacity: textOpacity }} className="mb-6">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full text-[10px] md:text-xs uppercase font-bold tracking-[0.3em] text-white/70">
                <span>✦</span>
                <span>{P.firstName}, o seu próximo aniversário pode ser em...</span>
              </div>
            </motion.div>

            <motion.h2
              style={{ scale: textScale, opacity: textOpacity, filter: textBlur }}
              className="font-ps-display text-[20vw] md:text-[160px] font-bold tracking-tighter leading-[0.8] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-[#3b82f6] to-blue-200 origin-center uppercase"
            >
              {P.city}
            </motion.h2>

            <motion.div style={{ opacity: textOpacity }} className="flex flex-col items-center">
               <div className="flex flex-col items-center mb-6">
                 <span className="text-white/50 text-xs font-bold uppercase tracking-[0.3em] mb-3">Foco Escolhido</span>
                 <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6] text-sm uppercase tracking-widest font-semibold backdrop-blur-md">
                    <Heart className="w-4 h-4" /> {P.intention}
                 </div>
               </div>

               <p className="text-white/60 text-base md:text-lg font-light leading-relaxed text-center max-w-2xl">
                 O destino exato para ativar a Casa que multiplica o seu poder de conexão e coloca grupos, amizades e internet a serviço dos seus resultados.
               </p>
            </motion.div>
          </div>
        </div>
      </section>`;

content = content.replace(heroTargetRegex, heroReplacementBlock);

fs.writeFileSync(file, content);
console.log("Success!");
