const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Add state for areas
code = code.replace(
  'const [isPanelHovered, setIsPanelHovered] = useState(false);',
  `const [isPanelHovered, setIsPanelHovered] = useState(false);
  const [areas, setAreas] = useState(LIFE_AREAS);`
);

code = code.replace(
  'const sortedAreas = [...LIFE_AREAS].sort((a,b) => b.score - a.score);',
  'const sortedAreas = [...areas].sort((a,b) => b.score - a.score);'
);

// 2. Add onClick to button
code = code.replace(
  '<button\n                                className="w-full md:w-auto px-8 py-4',
  `<button
                                onClick={() => setAreas(areas.map(a => a.id === activeArea.id ? { ...a, unlocked: true } : a))}
                                className="w-full md:w-auto px-8 py-4`
);

// 3. Make pillars dynamic
const p1Target = `<h3 className="text-2xl font-bold text-white mb-4 tracking-tight transition-colors duration-500 group-hover:text-[#10b981]">Aumento de Ganhos</h3>
                           <p className="text-white/60 text-base leading-[1.8] font-light">Foco no aumento real de faturamento, novos clientes e atração de recursos reais. O dinheiro na Casa 2 não vem de sorte, vem da coragem de faturar e expandir os horizontes.</p>`;
const p1Replace = `<h3 className="text-2xl font-bold text-white mb-4 tracking-tight transition-colors duration-500" style={{ color: isHoveredP1 ? currentActiveData.color : '#fff' }} onMouseEnter={() => setIsHoveredP1(true)} onMouseLeave={() => setIsHoveredP1(false)}>{currentActiveData.id === 'amor' ? 'Magnetismo Real' : 'Aumento de Ganhos'}</h3>
                           <p className="text-white/60 text-base leading-[1.8] font-light">{currentActiveData.id === 'amor' ? 'Atração de pessoas maduras e construção de um relacionamento focado em reciprocidade e crescimento.' : 'Foco no aumento real de faturamento, novos clientes e atração de recursos reais. O dinheiro na Casa 2 não vem de sorte, vem da coragem de faturar.'}</p>`;

// We will just do a simple inline ternary for the test.
// Wait, I can't easily add isHoveredP1 inside a map without a component. Let's just use CSS.
// Tailwind arbitrary variants aren't dynamic like that. Let's just inject the text ternary directly.
code = code.replace('Aumento de Ganhos', '{currentActiveData.id === "amor" ? "Reciprocidade" : "Aumento de Ganhos"}');
code = code.replace('Foco no aumento real de faturamento, novos clientes e atração de recursos reais. O dinheiro na Casa 2 não vem de sorte, vem da coragem de faturar e expandir os horizontes.', '{currentActiveData.id === "amor" ? "Foco total na qualidade da sua companhia. É o ciclo para atrair pessoas que queiram construir junto, parar de investir energia em relações rasas e materializar uma parceria de peso." : "Foco no aumento real de faturamento, novos clientes e atração de recursos reais. O dinheiro na Casa 2 não vem de sorte, vem da coragem de faturar e expandir os horizontes."}');

code = code.replace('Valorização do Trabalho', '{currentActiveData.id === "amor" ? "Valorização Pessoal" : "Valorização do Trabalho"}');
code = code.replace('Foco irrestrito na autoconfiança. É o momento exato de acabar com os descontos emocionais e auditar todos os seus serviços para cobrar o valor justo.', '{currentActiveData.id === "amor" ? "Foco irrestrito no seu amor próprio. Acabar com as concessões e limites emocionais ultrapassados. Quem dita as regras do seu valor é você." : "Foco irrestrito na autoconfiança. É o momento exato de acabar com os descontos emocionais e auditar todos os seus serviços para cobrar o valor justo."}');

code = code.replace('Estabilidade & Segurança', '{currentActiveData.id === "amor" ? "Construção de Futuro" : "Estabilidade & Segurança"}');
code = code.replace('Foco prático em organização de caixa, corte de vazamentos invisíveis e reserva inteligente. Proteger o lucro é tão fundamental quanto fazê-lo acontecer.', '{currentActiveData.id === "amor" ? "Foco em planos de longo prazo. O romance deixa de ser apenas atração física e se torna uma base sólida para a vida familiar e realizações materiais conjuntas." : "Foco prático em organização de caixa, corte de vazamentos invisíveis e reserva inteligente. Proteger o lucro é tão fundamental quanto fazê-lo acontecer."}');

// Fix the hover text color to be dynamic
code = code.replace(/group-hover:text-\[\#10b981\]/g, ''); // strip tailwind hover text

const h3Target = `<h3 className="text-2xl font-bold text-white mb-4 tracking-tight transition-colors duration-500 ">`;
const h3Replace = `<h3 className="text-2xl font-bold mb-4 tracking-tight transition-colors duration-500" style={{ color: '#fff' }} onMouseEnter={(e) => e.currentTarget.style.color = currentActiveData.color} onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}>`;
// actually it's easier to just leave it white or use inline styles. I'll just leave it white.

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Unlocking functionality enabled for testing.");
