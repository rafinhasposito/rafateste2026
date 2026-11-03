const fs = require('fs');

let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

// 1. Add Imports
content = content.replace(
  'import { cityDatabase } from "@/data/houses";',
  'import { cityDatabase } from "@/data/houses";\nimport { FOCUS_MATRIX } from "@/data/focusMatrix";\nimport { BASE_HOUSE_PROFILES } from "@/data/baseHouseProfiles";'
);

// 2. Safe merge of data just after useState(LIFE_AREAS)
const stateLineRegex = /const \[unlockedItems, setUnlockedItems\] = useState<string\[\]>\(\[\]\);\n\s*const sortedAreas = \[\.\.\.areas\]\.sort\(\(a,b\) => b\.score - a\.score\);\n\s*const currentActiveData = sortedAreas\.find\(a => a\.id === \(hoveredArea \|\| sortedAreas\[0\]\.id\)\);/;

const safeMergeLogic = `const [unlockedItems, setUnlockedItems] = useState<string[]>([]);

  const baseHouseId = P.house as keyof typeof BASE_HOUSE_PROFILES;
  const houseBaseData = (BASE_HOUSE_PROFILES as any)[baseHouseId];
  const currentHouseProfiles = (FOCUS_MATRIX as any)[baseHouseId] || {};

  const mergedAreas = areas.map(area => {
    const focusData = currentHouseProfiles[area.id];
    if (!focusData) return area;
    
    return {
      ...area,
      score: focusData.match || area.score,
      teaser: focusData.headline || area.teaser,
      full: focusData.headline || area.teaser,
      mantra: focusData.mantra || area.mantra,
      pillars: focusData.pillars?.map((p: any, i: number) => ({
        icon: area.pillars?.[i]?.icon || area.pillars?.[0]?.icon || Target,
        title: p.title,
        text: p.description
      })) || area.pillars,
      timeline: focusData.phases?.map((p: any, i: number) => ({
        phase: p.title,
        period: area.timeline?.[i]?.period || "",
        text: p.description
      })) || area.timeline,
      dna: {
        essencia: \`Com o Sol em \${P.sign}, sua força e magnetismo natural são ativados por essa cidade. O universo entra em ressonância com a sua essência.\`,
        metodo: \`Seu Ascendente em \${P.ascendant} dita o método. O destino facilita a execução da sua visão de mundo com clareza.\`,
        fase: \`Nesta fase da sua vida (\${P.phase}), o objetivo astrológico principal ganha maturidade e a ambição cede espaço à sabedoria prática.\`
      },
      ritualData: focusData.ritual,
      themeData: focusData.theme,
      secretData: focusData.secret,
      blindSpotData: focusData.blindSpot,
      defenseProtocolData: focusData.defenseProtocol
    };
  });

  const sortedAreas = [...mergedAreas].sort((a,b) => b.score - a.score);
  const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id)) || sortedAreas[0];
`;

content = content.replace(stateLineRegex, safeMergeLogic);


// 3. Fix Frankenstein Block 4
content = content.replace(
  /<img src=\{currentActiveData\.image\} alt=\{currentActiveData\.city\} className="w-full h-full object-cover opacity-90 transition-all duration-1000" \/>/g,
  '<img src={cityDatabase[P.house as keyof typeof cityDatabase]?.image || currentActiveData.image} alt={cityDatabase[P.house as keyof typeof cityDatabase]?.nome || currentActiveData.city} className="w-full h-full object-cover opacity-90 transition-all duration-1000" />'
);

content = content.replace(
  /<span className="font-sans text-sm tracking-widest uppercase text-white font-semibold">\{currentActiveData\.city\}<\/span>/g,
  '<span className="font-sans text-sm tracking-widest uppercase text-white font-semibold">{cityDatabase[P.house as keyof typeof cityDatabase]?.nome || currentActiveData.city}</span>'
);

content = content.replace(
  /\{currentActiveData\.cityDesc\}/g,
  '{houseBaseData?.understand || currentActiveData.cityDesc}'
);

// 4. Fix Double Paywall Buttons
// Mobile:
content = content.replace(
  /<button className="w-full px-6 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 bg-white text-black hover:scale-105 active:scale-95 transition-transform">\s*<CreditCard className="w-4 h-4" \/>\s*Desbloquear com 1 Crédito\s*<\/button>/g,
  `<button onClick={(e) => { e.stopPropagation(); setUnlockedItems(prev => [...prev, area.id]); }} className="w-full px-6 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 bg-white text-black hover:scale-105 active:scale-95 transition-transform">
    <CreditCard className="w-4 h-4" />
    Desbloquear com 1 Crédito
  </button>`
);

// Desktop:
content = content.replace(
  /onClick=\{\(\) => setAreas\(areas\.map\(a => a\.id === activeArea\.id \? \{ \.\.\.a, unlocked: true \} : a\)\)\}/g,
  'onClick={(e) => { e.stopPropagation(); setUnlockedItems(prev => [...prev, activeArea.id]); }}'
);

// 5. Inject Rituals and Text cleanly
// O Tema do Seu Ano
const oldTheme = `Consolidação e Crescimento Material`;
const newTheme = `{currentActiveData.themeData || "Consolidação e Crescimento Material"}`;
content = content.replace(oldTheme, newTheme);

// O Segredo Deste Ano
const oldSecret = `A verdadeira prosperidade neste ciclo não virá do esforço exaustivo, mas do posicionamento estratégico. O universo pede que você pare de trocar tempo por dinheiro e comece a ancorar o seu valor. A cidade destino ativa a frequência da abundância: o dinheiro que trabalha para você.`;
const newSecret = `{currentActiveData.secretData || "A verdadeira prosperidade neste ciclo não virá do esforço exaustivo, mas do posicionamento estratégico. O universo pede que você pare de trocar tempo por dinheiro e comece a ancorar o seu valor. A cidade destino ativa a frequência da abundância: o dinheiro que trabalha para você."}`;
content = content.replace(oldSecret, newSecret);

// Risco de Autossabotagem -> Ponto Cego
content = content.replace(`Risco de Autossabotagem`, `O Ponto Cego`);
const oldBlind = `A euforia desta configuração astrológica atrai oportunidades, mas também um impulso irresistível para o desperdício. Seu maior risco é confundir alto fluxo com patrimônio consolidado.`;
const newBlind = `{currentActiveData.blindSpotData || "A euforia desta configuração atrai oportunidades, mas também um impulso irresistível para o desperdício."}`;
content = content.replace(oldBlind, newBlind);

// Protocolo de Defesa
const oldDef = `"Congele 30% de todo lucro novo no momento em que ele tocar a sua conta, antes de tomar qualquer decisão de gasto."`;
const newDef = `"{currentActiveData.defenseProtocolData || 'Congele 30% de todo lucro novo no momento em que ele tocar a sua conta, antes de tomar qualquer decisão de gasto.'}"`;
content = content.replace(oldDef, newDef);

// Ritual 3 passos
content = content.replace(
  `Compre um item simbólico de alto valor (mesmo que pequeno) usando dinheiro físico. Este objeto será o seu amuleto financeiro.`,
  `{currentActiveData.ritualData?.step1 || 'Compre um item simbólico de alto valor (mesmo que pequeno) usando dinheiro físico.'}`
);
content = content.replace(
  `Durante a transação, afirme mentalmente: "Este é o último investimento do meu antigo ciclo de escassez".`,
  `{currentActiveData.ritualData?.step2 || 'Durante a transação, afirme mentalmente o compromisso com sua intenção.'}`
);
content = content.replace(
  `Ancore na cidade caminhando pelos distritos financeiros sentindo que aquele é o seu habitat natural.`,
  `{currentActiveData.ritualData?.step3 || 'Ancore na cidade sentindo que aquele é o seu habitat natural.'}`
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
console.log("Safe fix applied successfully!");
