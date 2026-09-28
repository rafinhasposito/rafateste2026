const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Restore the simple hook setup
const hooksTargetRegex = /  const \{ scrollYProgress \} = useScroll\(\{ target: heroRef, offset: \["start start", "end end"\] \}\);[\s\S]*?const casaRef = useRef<HTMLDivElement>\(null\);/;

const hooksReplacement = `  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const vidScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const vidOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const carRef = useRef<HTMLDivElement>(null);
  const scrollCar = (d: number) => carRef.current?.scrollBy({ left: d, behavior: "smooth" });
  const [openArea, setOpenArea] = useState<string>("amor");
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const casaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: casaProgress } = useScroll({
    target: casaRef,
    offset: ["start 90%", "start 40%"]
  });
  const textScale = useTransform(casaProgress, [0, 1], [1.4, 1]);
  const textOpacity = useTransform(casaProgress, [0, 1], [0, 1]);
  const textBlur = useTransform(casaProgress, [0, 1], ["blur(16px)", "blur(0px)"]);`;

content = content.replace(hooksTargetRegex, hooksReplacement);


// 2. Rewrite Hero to be a standard relative video block (like Option 1)
const heroTargetRegex = /\{\/\* ══════════════════════════════════════════════════\n         1\. HERO[\s\S]*?<\/section>/;

const heroReplacementBlock = `{/* ══════════════════════════════════════════════════
         1. HERO DO VÍDEO (Padrão)
         ══════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Vídeo em full brightness */}
        <motion.div style={{ scale: vidScale, opacity: vidOpacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0B1426] z-10" />
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/videos/teste-fundo.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        <div className="absolute top-20 md:top-24 right-6 md:right-10 z-20 flex items-center gap-2 text-white/50">
           <MapPin className="w-3.5 h-3.5" />
           <span className="text-[10px] font-bold uppercase tracking-[0.3em]">EUA</span>
        </div>

        {/* Degradê na base para proteger a transição */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#0B1426] to-transparent pointer-events-none z-10" />
      </section>

      {/* ══════════════════════════════════════════════════
         2. TEXTO DA CIDADE (Sobreposição Option 1)
         ══════════════════════════════════════════════════ */}
      <section ref={casaRef} className="relative z-20 -mt-[25vh] pb-24 md:pb-32 flex flex-col items-center px-6">
        <motion.div style={{ opacity: textOpacity }} className="mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full text-[10px] md:text-xs uppercase font-bold tracking-[0.3em] text-white/70">
            <span>✦</span>
            <span>{P.firstName}, o seu próximo aniversário pode ser em...</span>
          </div>
        </motion.div>
        
        <motion.h2
          style={{ scale: textScale, opacity: textOpacity, filter: textBlur }}
          className="font-ps-display text-[20vw] md:text-[160px] font-bold tracking-tighter leading-[0.8] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-[#3b82f6] to-blue-200 origin-center uppercase text-center"
        >
          {P.city}
        </motion.h2>

        <motion.div style={{ opacity: textOpacity }} className="flex flex-col items-center max-w-2xl text-center">
           <div className="flex flex-col items-center mb-6">
             <span className="text-white/50 text-xs font-bold uppercase tracking-[0.3em] mb-3">Foco Escolhido</span>
             <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6] text-sm uppercase tracking-widest font-semibold backdrop-blur-md">
                <Heart className="w-4 h-4" /> {P.intention}
             </div>
           </div>

           <p className="text-white/60 text-base md:text-lg font-light leading-relaxed">
             O destino exato para ativar a Casa que multiplica o seu poder de conexão e coloca grupos, amizades e internet a serviço dos seus resultados.
           </p>
        </motion.div>
      </section>`;

content = content.replace(heroTargetRegex, heroReplacementBlock);

fs.writeFileSync(file, content);
console.log("Success!");
