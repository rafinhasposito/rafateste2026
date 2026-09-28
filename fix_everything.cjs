const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix HOUSE_CINEMATIC_TEXTS
const dictStart = "const HOUSE_CINEMATIC_TEXTS: Record<number, string> = {";
const dictRegex = new RegExp(dictStart.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&') + '[\\s\\S]*?\\};');

const newTexts = `const HOUSE_CINEMATIC_TEXTS: Record<number, string> = {
  1: "colocar você em primeiro lugar, resgatar sua coragem e liderar um novo começo na sua vida.",
  2: "destravar o seu dinheiro, valorizar seu trabalho e construir estabilidade no seu novo ciclo.",
  3: "destravar a sua voz, fechar novos negócios e fazer sua rotina girar com agilidade.",
  4: "criar raízes sólidas, reestruturar seu lar e conquistar um porto seguro de paz interior.",
  5: "reacender a sua paixão, recuperar a alegria de viver e colocar o seu brilho único em evidência.",
  6: "organizar sua rotina, recuperar sua energia física e fazer o seu dia render com máxima eficiência.",
  7: "atrair um relacionamento sério, firmar grandes parcerias e viver a verdadeira reciprocidade a dois.",
  8: "encerrar ciclos antigos, virar a página com coragem e acessar o seu verdadeiro poder pessoal.",
  9: "dar um salto quântico, expandir seus horizontes e viver uma vida sem fronteiras.",
  10: "assumir o topo do seu mercado, ser reconhecido publicamente e brilhar no modo CEO.",
  11: "atrair aliados de peso, multiplicar suas oportunidades pela rede e construir seus grandes projetos de futuro.",
  12: "desacelerar o barulho externo, gestar grandes ideias nos bastidores e renovar sua paz de espírito."
};`;

content = content.replace(dictRegex, newTexts);

// Fix the HTML prefix "O destino exato para ativar a Casa que" -> "O destino exato para"
content = content.replace('O destino exato para ativar a Casa que{" "}', 'O destino exato para{" "}');
content = content.replace('O destino exato para ativar a Casa que{" "}', 'O destino exato para{" "}');

// 2. Transplant the exact Trailer Accordion Layout
let trailerHTML = fs.readFileSync('trailer_layout.txt', 'utf8');
trailerHTML = trailerHTML.split('            </div>\n          </motion.div>\n      </section>')[0];

trailerHTML = trailerHTML.replace(/hoveredArea/g, "hoveredArea");
trailerHTML = trailerHTML.replace(/setHoveredArea/g, "setHoveredArea");
trailerHTML = trailerHTML.replace(/selectedIntention/g, "openArea");
trailerHTML = trailerHTML.replace(/setSelectedIntention/g, "setOpenArea");
trailerHTML = trailerHTML.replace(/onClick=\{\(e\) => \{ e\.stopPropagation\(\); handleSelectIntention\(activeArea\.id, e\); \}\}/g, "onClick={(e) => { e.stopPropagation(); setOpenArea(activeArea.id); }}");
trailerHTML = trailerHTML.replace(/onClick=\{\(e\) => \{ e\.stopPropagation\(\); handleSelectIntention\(area\.id, e\); \}\}/g, "onClick={(e) => { e.stopPropagation(); setOpenArea(area.id); }}");

// Fix bgBase and theme.themeColor
trailerHTML = trailerHTML.replace(/bgBase/g, "`color-mix(in srgb, ${activeArea?.color || '#10b981'} 12%, #000000)`");
trailerHTML = trailerHTML.replace(/theme\.themeColor/g, "activeArea?.color || '#10b981'");

// Add state variables to AppleResultPrototype
if (!content.includes('const [isPanelHovered')) {
  content = content.replace(
    'const [openArea, setOpenArea] = useState("dinheiro");',
    `const [openArea, setOpenArea] = useState("dinheiro");\n  const [hoveredArea, setHoveredArea] = useState<string | null>(null);\n  const [isPanelHovered, setIsPanelHovered] = useState(false);\n  \n  const sortedAreas = [...LIFE_AREAS].sort((a,b) => b.score - a.score);`
  );
}

// Replace the target block
const startTargetTag = "{/* Área Desbloqueada & Paywall via Acordeão Estilo Mapeamento 360 */}";
const endTargetTag = "                  </div>\n               </div>\n            </div>\n          </Reveal>";
const targetRegex = new RegExp(startTargetTag.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&') + '[\\s\\S]*?' + endTargetTag.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&'));

let replacement = `{/* Área Desbloqueada & Paywall via Acordeão Estilo Mapeamento 360 */}
                  <div className="w-full mt-10 flex flex-col lg:flex-row gap-6 h-[700px] text-left">
                    ${trailerHTML}
                  </div>
               </div>
            </div>
          </Reveal>`;

content = content.replace(targetRegex, replacement);

fs.writeFileSync(file, content);
console.log("EVERYTHING APPLIED SAFELY!");
