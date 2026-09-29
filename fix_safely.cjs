const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Hide the horizontal tabs (the left sidebar and the top menu in mobile)
// Left sidebar: <div className="hidden lg:flex w-[72px] shrink-0 flex-col gap-2 items-stretch min-h-[700px]">
code = code.replace(
  /<div\n\s*className="hidden lg:flex w-\[72px\] shrink-0 flex-col gap-2 items-stretch min-h-\[700px\]"/g,
  `<div className="hidden"`
);

// Mobile top menu: <div className="flex lg:hidden w-full overflow-x-auto gap-4 pb-6 snap-x hide-scrollbar">
code = code.replace(
  /<div className="flex lg:hidden w-full overflow-x-auto gap-4 pb-6 snap-x hide-scrollbar">/g,
  `<div className="hidden">`
);

// 2. Replace the hardcoded texts in O Tema and O Segredo
code = code.replace(
  /<p className="text-white\/90 text-xl md:text-2xl font-ps-display font-medium leading-tight">\s*Estruturação, Valor e Segurança\.\s*<\/p>/g,
  `<p className="text-white/90 text-xl md:text-2xl font-ps-display font-medium leading-tight">{houseData?.oTema || "Consolidação Astrológica"}</p>`
);

code = code.replace(
  /<p className="text-white\/80 text-lg font-light leading-relaxed">\s*A verdadeira riqueza deste ciclo não virá do esforço bruto.*?\s*<\/p>/g,
  `<p className="text-white/80 text-lg font-light leading-relaxed">{houseData?.oSegredo || "A verdadeira riqueza vem do alinhamento correto das suas intenções."}</p>`
);

code = code.replace(
  /<ul className="space-y-4">[\s\S]*?<\/ul>/,
  `<ul className="space-y-4">
                                  <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                                    <p className="text-white/80 font-light">{houseData?.ritual24h || "Caminhe observando a cidade. Respire a intenção de transformar a sua realidade local."}</p>
                                  </li>
                                </ul>`
);

// 3. Delete the "Os 3 Pilares" block which is completely fake data
// Search for `<div className="flex items-center gap-4 mb-12">` to `</motion.div>`
const pilaresStart = `<h2 className="font-ps-display text-3xl md:text-5xl font-bold tracking-tight">Os 3 Pilares da Ativação</h2>`;
const pilaresFullStart = code.lastIndexOf(`<div className="flex items-center gap-4 mb-12">`, code.indexOf(pilaresStart));
const pilaresEnd = code.indexOf(`{/* BLOCO 3: O SEU DNA DE ATIVAÇÃO`, pilaresFullStart);
if (pilaresFullStart > -1 && pilaresEnd > -1) {
  code = code.substring(0, pilaresFullStart) + code.substring(pilaresEnd);
}

// 4. Delete the "O SEU DNA DE ATIVAÇÃO" elements (Essencia, Metodo, Fase Atual)
const dnaEssencia = `<span className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm mb-6" style={{ color: currentActiveData.color }}>\n                              01. Sua Essência`;
const dnaEnd = code.indexOf(`{/* O Tema, Segredo e Gestos (Novo layout minimalista e luxuoso) */}`);
const dnaStart = code.lastIndexOf(`{/* Elemento 1: Essência`, code.indexOf(dnaEssencia));
if (dnaStart > -1 && dnaEnd > -1) {
  code = code.substring(0, dnaStart) + code.substring(dnaEnd);
}

// 5. Inject Accordion right above Rotas Alternativas
// But we need to make sure we don't duplicate. We restored git so we don't have Rotas Alternativas either!
// Oh, the file HAS Rotas Alternativas? Let's check if the file has it. We did git checkout.
// If it doesn't have it, we just inject Accordion at the end of Dossiê.
// Wait, my previous git diff showed `ROTAS ALTERNATIVAS` wasn't there! Because my git commit didn't have it.
fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Safe replacement done!");
