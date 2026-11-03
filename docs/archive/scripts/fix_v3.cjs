const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

// 1. IMPORTS
content = content.replace(
  'import { cityDatabase } from "@/data/houses";',
  'import { cityDatabase } from "@/data/houses";\nimport { FOCUS_MATRIX } from "@/data/focusMatrix";\nimport { BASE_HOUSE_PROFILES } from "@/data/baseHouseProfiles";'
);

// 2. LIFE_AREAS (Strip the mock)
const lifeAreasRegex = /const LIFE_AREAS = \[\s*\{\s*id: "dinheiro"[\s\S]*?\];/m;
const newLifeAreas = `const LIFE_AREAS = [
  { id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#10b981", unlocked: true },
  { id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#3b82f6", unlocked: false },
  { id: "identidade", icon: Crown, label: "Identidade e Imagem", color: "#c9a227", unlocked: false },
  { id: "saude", icon: Leaf, label: "Saúde e Rotina", color: "#22c55e", unlocked: false },
  { id: "networking", icon: Users, label: "Networking e Conexões", color: "#14b8a6", unlocked: false },
  { id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e", unlocked: false },
  { id: "sociedades", icon: Users, label: "Casamento e Sociedades", color: "#eab308", unlocked: false },
  { id: "espiritual", icon: Sparkles, label: "Espiritual e Propósito", color: "#6366f1", unlocked: false }
];`;
content = content.replace(lifeAreasRegex, newLifeAreas);

// 3. STATE & DATA MERGING
const stateRegex = /const \[areas, setAreas\] = useState\(LIFE_AREAS\);[\s\S]*?const currentActiveData = sortedAreas\.find\(a => a\.id === \(hoveredArea \|\| sortedAreas\[0\]\.id\)\);/m;
const newState = `const [areas, setAreas] = useState(LIFE_AREAS);
  const [activeDnaTab, setActiveDnaTab] = useState('essencia');
  const [openTimelinePhase, setOpenTimelinePhase] = useState<number | null>(0);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  
  const baseHouseId = P.house as keyof typeof BASE_HOUSE_PROFILES;
  const currentHouseProfiles = (FOCUS_MATRIX as any)[baseHouseId] || {};
  const houseBaseData = (BASE_HOUSE_PROFILES as any)[baseHouseId] || { vibe: "", understand: "", realDynamics: "" };

  const mergedAreas = areas.map(area => {
    const focusData = currentHouseProfiles[area.id] || {};
    return {
      ...area,
      score: focusData.match || 50,
      focusData: focusData,
    };
  });

  const sortedAreas = [...mergedAreas].sort((a,b) => b.score - a.score);
  const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id)) || sortedAreas[0];
  const focusData = currentActiveData?.focusData || {};
  
  const baseDna = {
    essencia: \`Com o Sol em \${P.sign}, sua força e magnetismo natural são ativados por essa cidade. O universo entra em ressonância com a sua essência.\`,
    metodo: \`Seu Ascendente em \${P.ascendant} dita o método. O destino facilita a execução da sua visão de mundo com clareza.\`,
    fase: \`Nesta fase da sua vida (\${P.phase}), o objetivo astrológico principal ganha maturidade e a ambição cede espaço à sabedoria prática.\`
  };`;
content = content.replace(stateRegex, newState);

// 4. FIX UNLOCK BUTTONS (DOUBLE PAYWALL)
// Mobile button inside blurred view
content = content.replace(
  /<button className="w-full px-6 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 bg-white text-black hover:scale-105 active:scale-95 transition-transform">\s*<CreditCard className="w-4 h-4" \/>\s*Desbloquear com 1 Crédito\s*<\/button>/g,
  `<button onClick={(e) => { e.stopPropagation(); setUnlockedItems(prev => [...prev, area.id]); }} className="w-full px-6 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 bg-white text-black hover:scale-105 active:scale-95 transition-transform">
    <CreditCard className="w-4 h-4" />
    Desbloquear com 1 Crédito
  </button>`
);

// Desktop button inside blurred view
content = content.replace(
  /onClick=\{\(\) => setAreas\(areas\.map\(a => a\.id === activeArea\.id \? \{ \.\.\.a, unlocked: true \} : a\)\)\}/g,
  'onClick={(e) => { e.stopPropagation(); setUnlockedItems(prev => [...prev, activeArea.id]); }}'
);

// 5. TEXT REPLACEMENTS FOR FOCUS AND HOUSE BASE
content = content.replace(/currentActiveData\.teaser/g, 'focusData.headline');
content = content.replace(/currentActiveData\.pillars/g, 'focusData.pillars');
content = content.replace(/currentActiveData\.timeline/g, 'focusData.phases');
content = content.replace(/phase\.phase/g, 'phase.title');
content = content.replace(/phase\.text/g, 'phase.description');
content = content.replace(/phase\.period/g, '""');

// Fix City Profile Frankenstein
content = content.replace(/currentActiveData\.image/g, 'cityDatabase[P.house as keyof typeof cityDatabase]?.image || "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9"');
content = content.replace(/currentActiveData\.city\}/g, 'cityDatabase[P.house as keyof typeof cityDatabase]?.nome}');
content = content.replace(/currentActiveData\.cityDesc/g, 'houseBaseData.understand');

// Fix Ritual and Mantra
content = content.replace(/currentActiveData\?\.mantra/g, 'focusData?.mantra');
content = content.replace(/currentActiveData\.mantra/g, 'focusData.mantra');

// Replace the ritual HTML block carefully
const oldRitualBlock = `<span className="font-sans text-xl font-bold mt-1" style={{ color: currentActiveData?.color || '#10b981' }}>1.</span>
                              <p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-6">
                                Compre um item simbólico de alto valor (mesmo que pequeno) usando dinheiro físico. Este objeto será o seu amuleto financeiro.
                              </p>
                              <span className="font-sans text-xl font-bold mt-1" style={{ color: currentActiveData?.color || '#10b981' }}>2.</span>
                              <p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-6">
                                Durante a transação, afirme mentalmente: "Este é o último investimento do meu antigo ciclo de escassez".
                              </p>
                              <span className="font-sans text-xl font-bold mt-1" style={{ color: currentActiveData?.color || '#10b981' }}>3.</span>
                              <p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-6">
                                Ancore na cidade caminhando pelos distritos financeiros sentindo que aquele é o seu habitat natural.
                              </p>`;
const newRitualBlock = `<span className="font-sans text-xl font-bold mt-1" style={{ color: currentActiveData?.color || '#10b981' }}>1.</span>
                              <p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-6">
                                {focusData?.ritual?.step1}
                              </p>
                              <span className="font-sans text-xl font-bold mt-1" style={{ color: currentActiveData?.color || '#10b981' }}>2.</span>
                              <p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-6">
                                {focusData?.ritual?.step2}
                              </p>
                              <span className="font-sans text-xl font-bold mt-1" style={{ color: currentActiveData?.color || '#10b981' }}>3.</span>
                              <p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-6">
                                {focusData?.ritual?.step3}
                              </p>`;
content = content.replace(oldRitualBlock, newRitualBlock);

// Replace Theme and Secret HTML blocks
const oldThemeBlock = `<p className="text-white font-sans text-lg md:text-xl font-medium leading-relaxed mb-12">
                              Consolidação e Crescimento Material
                            </p>`;
const newThemeBlock = `<p className="text-white font-sans text-lg md:text-xl font-medium leading-relaxed mb-12">
                              {focusData?.theme}
                            </p>`;
content = content.replace(oldThemeBlock, newThemeBlock);

const oldSecretBlock = `<p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-12">
                              A verdadeira prosperidade neste ciclo não virá do esforço exaustivo, mas do posicionamento estratégico. O universo pede que você pare de trocar tempo por dinheiro e comece a ancorar o seu valor. A cidade destino ativa a frequência da abundância: o dinheiro que trabalha para você.
                            </p>`;
const newSecretBlock = `<p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-12">
                              {focusData?.secret}
                            </p>`;
content = content.replace(oldSecretBlock, newSecretBlock);

// Replace BlindSpot and Defense
const oldBlindBlock = `<p className="text-white/60 font-sans text-sm md:text-base leading-relaxed mb-8">
                            A euforia desta configuração astrológica atrai oportunidades, mas também um impulso irresistível para o desperdício. Seu maior risco é confundir alto fluxo com patrimônio consolidado.
                          </p>`;
const newBlindBlock = `<p className="text-white/60 font-sans text-sm md:text-base leading-relaxed mb-8">
                            {focusData?.blindSpot}
                          </p>`;
content = content.replace(oldBlindBlock, newBlindBlock);

const oldDefenseBlock = `<p className="text-white/80 font-sans text-sm md:text-base leading-relaxed font-medium mt-2">
                              "Congele 30% de todo lucro novo no momento em que ele tocar a sua conta, antes de tomar qualquer decisão de gasto."
                            </p>`;
const newDefenseBlock = `<p className="text-white/80 font-sans text-sm md:text-base leading-relaxed font-medium mt-2">
                              "{focusData?.defenseProtocol}"
                            </p>`;
content = content.replace(oldDefenseBlock, newDefenseBlock);

// Fix DNA Fallbacks
content = content.replace(/currentActiveData\.dna\?\.essencia/g, 'baseDna.essencia');
content = content.replace(/currentActiveData\.dna\?\.metodo/g, 'baseDna.metodo');
content = content.replace(/currentActiveData\.dna\?\.fase/g, 'baseDna.fase');

// Replace remaining activeArea.full/area.full
content = content.replace(/activeArea\.full/g, 'focusData?.headline');
content = content.replace(/area\.full/g, 'area.focusData?.headline');

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
console.log("Successfully rebuilt AppleResultPreviewV3.tsx");
