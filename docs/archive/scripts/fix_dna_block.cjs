const fs = require('fs');
const file = 'src/pages/HouseResult.tsx';
let content = fs.readFileSync(file, 'utf8');

// The block starts around line 705 with <div className="w-full mt-10 flex flex-col lg:flex-row gap-6 min-h-[700px] text-left">
// It has a desktop sidebar and a mobile accordion.
// We need to replace the entire 705-896 block with just a clean, single-focus DNA display.
// I will use regex or string indexing to rip out the LIFE_AREAS.map parts.

// But wait, there is a much safer way. Let's find the Exact boundary of Block 3.
const block3Start = '{/* ══════════════════════════════════════════════════';
const block3EndRegex = /\{\/\* ══════════════════════════════════════════════════\s*BLOCK 4: STORYTELLING/s;

// We'll replace everything between Block 3 and Block 4 with a simplified single-focus layout.
const newBlock3 = `
{/* ══════════════════════════════════════════════════
   BLOCK 3: DNA DO DESTINO (Single Focus)
   ══════════════════════════════════════════════════ */}
<div className="w-full bg-[#03100b] py-20 lg:py-32 relative overflow-hidden flex flex-col items-center">
  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(255,255,255,0.2) 0%, transparent 60%)' }} />
  
  <div className="w-full max-w-[1200px] mx-auto px-6 z-10 relative">
    <Reveal>
      <div className="flex flex-col items-center text-center mb-16">
        <span className="font-sans text-xs tracking-[0.2em] uppercase mb-4 font-bold" style={{ color: themeColor }}>O DNA ASTROLÓGICO DA {houseModel.id}</span>
        <h2 className="text-3xl md:text-5xl font-ps-display font-bold text-white mb-6">
          {houseModel.focusLabel}
        </h2>
        <p className="text-white/60 text-lg max-w-2xl font-light">
          A energia magnética de {houseModel.city} atua diretamente sobre esta área, forçando uma reestruturação profunda nos seus pilares.
        </p>
      </div>
    </Reveal>

    <div className="w-full flex flex-col lg:flex-row gap-8 min-h-[500px]">
      
      {/* ── PAINEL DE CONTEÚDO PRINCIPAL ── */}
      <div className="flex-1 flex flex-col relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10 transition-colors duration-1000" style={{ backgroundColor: \`color-mix(in srgb, \${themeColor} 12%, #000000)\` }}>
        
        {/* Glow de Fundo */}
        <div className="absolute inset-0 pointer-events-none transition-colors duration-1000" style={{ background: \`linear-gradient(to top, \${\`color-mix(in srgb, \${themeColor} 12%, #000000)\`}, color-mix(in srgb, \${themeColor} 12%, rgba(0,0,0,0.8)) 50%, transparent)\` }} />

        {/* Topo / Banner */}
        <div className="w-full h-48 md:h-64 relative shrink-0">
          <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-100 grayscale-[0.8] opacity-60"
               style={{ backgroundImage: \`url(\${houseModel.img})\` }} />
          <div className="absolute inset-0 bg-gradient-to-t transition-colors duration-1000" style={{ backgroundImage: \`linear-gradient(to top, \${\`color-mix(in srgb, \${themeColor} 12%, #000000)\`}, transparent)\` }} />
        </div>

        {/* Conteúdo Expansivo */}
        <div className="flex-1 flex flex-col justify-end p-8 md:p-12 z-10 relative">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-4 w-full mb-12">
            <div>
              <h3 className="font-ps-display text-4xl md:text-5xl font-bold text-white leading-none mb-4">{houseModel.focusLabel}</h3>
              <p className="text-white/80 text-lg max-w-xl font-light">Este é o pilar mestre do seu novo ano.</p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-white/50">Força da Rota</span>
              <div className="h-px w-8 bg-white/20"></div>
              <span className="font-sans text-lg font-bold" style={{ color: themeColor }}>{houseModel.score}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full pt-12 border-t border-white/10">
            {/* ESSÊNCIA */}
            <div className="flex flex-col group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 bg-black/40 mb-6 transition-colors duration-700 group-hover:border-white/30">
                <Heart className="w-5 h-5 text-white/50 group-hover:text-white transition-colors duration-700" />
              </div>
              <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-white/50 font-bold mb-3">A Essência</h4>
              <p className="text-white/80 text-sm font-light leading-relaxed">
                {currentActiveData.dna?.essencia || "Reconecte-se com as fundações desta área da sua vida e encontre clareza no que realmente importa."}
              </p>
            </div>

            {/* MÉTODO */}
            <div className="flex flex-col group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 bg-black/40 mb-6 transition-colors duration-700 group-hover:border-white/30">
                <Zap className="w-5 h-5 text-white/50 group-hover:text-white transition-colors duration-700" />
              </div>
              <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-white/50 font-bold mb-3">O Método</h4>
              <p className="text-white/80 text-sm font-light leading-relaxed">
                {currentActiveData.dna?.metodo || "Aplique a força prática deste foco na sua rotina para materializar resultados palpáveis."}
              </p>
            </div>

            {/* FASE */}
            <div className="flex flex-col group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 bg-black/40 mb-6 transition-colors duration-700 group-hover:border-white/30">
                <Target className="w-5 h-5 text-white/50 group-hover:text-white transition-colors duration-700" />
              </div>
              <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-white/50 font-bold mb-3">Sua Fase</h4>
              <p className="text-white/80 text-sm font-light leading-relaxed">
                {currentActiveData.dna?.fase || "Você está ingressando num ciclo de amadurecimento e expansão territorial."}
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</div>
`;

// Now let's extract the full block 3 logic from content
const match = content.match(/\{\/\* ══════════════════════════════════════════════════\s*BLOCK 3: DNA DO DESTINO[\s\S]*?\{\/\* ══════════════════════════════════════════════════\s*BLOCK 4: STORYTELLING/);

if (match) {
  content = content.replace(match[0], newBlock3 + '\n{/* ══════════════════════════════════════════════════\n   BLOCK 4: STORYTELLING');
  fs.writeFileSync(file, content);
  console.log("Successfully replaced Block 3 with single-focus architecture!");
} else {
  console.error("Could not find Block 3 boundary!");
}
