const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. REWRITE FRAMER MOTION HOOKS
const hooksTarget = `  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const vidScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const vidOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const carRef = useRef<HTMLDivElement>(null);
  const scrollCar = (d: number) => carRef.current?.scrollBy({ left: d, behavior: "smooth" });
  const [openArea, setOpenArea] = useState<string>("amor");
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const casaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: casaProgress } = useScroll({
    target: casaRef,
    offset: ["start 85%", "start 30%"]
  });
  const casaScale = useTransform(casaProgress, [0, 1], [1.4, 1]);
  const casaOpacity = useTransform(casaProgress, [0, 1], [0, 1]);
  const casaBlur = useTransform(casaProgress, [0, 1], ["blur(16px)", "blur(0px)"]);`;

const hooksReplacement = `  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end end"] });
  const vidScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const vidOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.1]);

  const textOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  const textScale = useTransform(scrollYProgress, [0.3, 0.8], [1.4, 1]);
  const textBlur = useTransform(scrollYProgress, [0.3, 0.8], ["blur(16px)", "blur(0px)"]);

  const carRef = useRef<HTMLDivElement>(null);
  const scrollCar = (d: number) => carRef.current?.scrollBy({ left: d, behavior: "smooth" });
  const [openArea, setOpenArea] = useState<string>("amor");
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const casaRef = useRef<HTMLDivElement>(null);`;

content = content.replace(hooksTarget, hooksReplacement);


// 2. REWRITE HERO SECTION (to include the sticky video AND the scrolling text overlay)
const heroTargetRegex = /\{\/\* ══════════════════════════════════════════════════\n         1\. HERO[\s\S]*?<\/section>/;

const heroReplacementBlock = `{/* ══════════════════════════════════════════════════
         1. HERO (Sticky Parallax Apple-style)
         ══════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[200vh]">
        {/* Sticky Video Background */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
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

          <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-[#0B1426] via-[#0B1426]/85 to-transparent pointer-events-none z-10" />
        </div>

        {/* Scrolling Text Layer (sits in the bottom 100vh of the 200vh container) */}
        <div className="absolute top-[100vh] left-0 right-0 h-screen flex flex-col items-center justify-center z-20 px-6 pointer-events-none">
          <motion.div style={{ opacity: textOpacity }} className="mb-6 pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full text-[10px] md:text-xs uppercase font-bold tracking-[0.3em] text-white/70">
              <span>✦</span>
              <span>{P.firstName}, o seu próximo aniversário pode ser em...</span>
            </div>
          </motion.div>
          
          <motion.h2
            style={{ scale: textScale, opacity: textOpacity, filter: textBlur }}
            className="font-ps-display text-[20vw] md:text-[160px] font-bold tracking-tighter leading-[0.8] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-[#3b82f6] to-blue-200 origin-center uppercase pointer-events-auto"
          >
            {P.city}
          </motion.h2>

          <motion.div style={{ opacity: textOpacity }} className="flex flex-col items-center max-w-2xl px-4 pointer-events-auto">
             <div className="flex flex-col items-center mb-6">
               <span className="text-white/50 text-xs font-bold uppercase tracking-[0.3em] mb-3">Foco Escolhido</span>
               <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6] text-sm uppercase tracking-widest font-semibold backdrop-blur-md">
                  <Heart className="w-4 h-4" /> {P.intention}
               </div>
             </div>

             <p className="text-white/60 text-base md:text-lg font-light leading-relaxed text-center">
               O destino exato para ativar a Casa que multiplica o seu poder de conexão e coloca grupos, amizades e internet a serviço dos seus resultados.
             </p>
          </motion.div>
        </div>
      </section>`;

content = content.replace(heroTargetRegex, heroReplacementBlock);


// 3. REMOVE OLD ZOOMING TEXT FROM CASA 11 AND CLEAN REDUNDANCIES
// Extract Accordion block precisely.
const accordionRegex = /(\{\/\* A GRANDE DIVISÃO DA PERSONALIZAÇÃO \*\/\}[\s\S]*?)(?=          <\/Reveal>)/;
const match = content.match(accordionRegex);
let accordionBlock = match[1];

accordionBlock = accordionBlock.replace(
  'className="mt-20 pt-16 border-t border-white/5 relative z-10 flex flex-col items-center"',
  'className="relative z-10 flex flex-col items-center"'
);

const section3Regex = /(      \{\/\* ══════════════════════════════════════════════════\n         3\. CASA 11 GIGANTE[\s\S]*?)(?=      \{\/\* ══════════════════════════════════════════════════\n         4\. BOARDING PASS)/;

const newSection = `      {/* ══════════════════════════════════════════════════
         3. PERSONALIZAÇÃO (ACORDEÃO)
         ══════════════════════════════════════════════════ */}
      <section className="relative pt-16 pb-20 md:pb-32 bg-[#0B1426]">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <Reveal className="mb-24 max-w-[1000px] mx-auto">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-[32px] p-8 md:p-12 relative overflow-hidden">
               {/* Fundo glow sutil */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-[#3b82f6]/5 blur-[120px] rounded-full pointer-events-none"></div>
               
               ${accordionBlock}          </Reveal>
        </div>
      </section>\n\n`;

content = content.replace(section3Regex, newSection);

// We also need to remove Section 1 (Energia do Ano) up to Section 3 (Casa 11 Gigante) since it's redundant.
// Original code has:
//      {/* ══════════════════════════════════════════════════
//         2. INTRODUÇÃO DA CASA
const section2Regex = /(      \{\/\* ══════════════════════════════════════════════════\n         2\. INTRODUÇÃO DA CASA[\s\S]*?)(?=      \{\/\* ══════════════════════════════════════════════════\n         3\. PERSONALIZAÇÃO)/;
content = content.replace(section2Regex, '');

fs.writeFileSync(file, content);
console.log("Success!");
