const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldHeroVisual = `<motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-48 h-48 md:w-64 md:h-64 rounded-full border-[1px] border-[#C9A227]/30 flex items-center justify-center relative mb-12 shadow-[0_0_80px_-20px_#C9A227]"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#C9A227]/10 to-transparent blur-xl"></div>
            <MapPin className="w-16 h-16 text-[#C9A227]/80" strokeWidth={1} />
            <div className="absolute -bottom-4 bg-[#050505] border border-[#C9A227]/50 px-6 py-2 rounded-full">
              <span className="text-[#C9A227] font-mono text-sm tracking-widest">98% MATCH</span>
            </div>
          </motion.div>`;

const newHeroVisual = `<motion.div 
            initial={{ scale: 0.95, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full max-w-5xl aspect-video md:aspect-[21/9] relative rounded-3xl overflow-hidden mb-12 shadow-[0_0_80px_-20px_rgba(201,162,39,0.2)] border border-white/10"
          >
            {/* VIGNETTE TO BLEND EDGES INTO THE VOID */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050505_100%)] z-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40 z-10 pointer-events-none"></div>
            
            <video 
              autoPlay loop muted playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-90 scale-105"
            >
              <source src="/assets/ny.mp4" type="video/mp4" />
            </video>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-[#050505]/60 backdrop-blur-md border border-[#C9A227]/30 px-6 py-2 rounded-full shadow-2xl">
              <span className="text-[#C9A227] font-mono text-xs md:text-sm tracking-widest font-bold">NOVA IORQUE · 98% MATCH</span>
            </div>
          </motion.div>`;

if (content.includes('w-48 h-48 md:w-64 md:h-64 rounded-full border-[1px]')) {
  // Use a regex or simple split/join if exact match fails due to spacing
  const parts = content.split(/<motion\.div[\s\S]*?<\/motion\.div>/);
  // We want to replace the FIRST motion.div inside the hero section
  // Let's be more precise with regex
  content = content.replace(/<motion\.div[^>]*initial={{ scale: 0\.9, opacity: 0 }}[^>]*>[\s\S]*?<\/motion\.div>/, newHeroVisual);
  
  fs.writeFileSync(file, content);
  console.log("Patched hero visual.");
} else {
  console.log("Could not find the target code.");
}
