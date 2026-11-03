const fs = require('fs');
const fileSource = 'src/pages/HouseTrailer.tsx';
const fileTarget = 'src/pages/AppleResultPrototype.tsx';

let sourceContent = fs.readFileSync(fileSource, 'utf8');
let targetContent = fs.readFileSync(fileTarget, 'utf8');

// 1. Extract the exact flex layout from HouseTrailer (lines 235 to 430)
const startTrailerTag = "{/* COLUNA ESQUERDA: SIDEBAR";
const endTrailerTag = "          </motion.div>\n      </section>";
const trailerRegex = new RegExp(startTrailerTag.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&') + '[\\s\\S]*?' + endTrailerTag.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&'));

let trailerMatch = sourceContent.match(trailerRegex);
if (!trailerMatch) {
  console.log("Could not find trailer section");
  process.exit(1);
}
let trailerHTML = trailerMatch[0];

// Adapt variables in trailerHTML for AppleResultPrototype
trailerHTML = trailerHTML.replace(/hoveredArea/g, "hoveredArea");
trailerHTML = trailerHTML.replace(/setHoveredArea/g, "setHoveredArea");
trailerHTML = trailerHTML.replace(/selectedIntention/g, "openArea");
trailerHTML = trailerHTML.replace(/setSelectedIntention/g, "setOpenArea");
trailerHTML = trailerHTML.replace(/handleSelectIntention\(activeArea.id, e\)/g, "setOpenArea(activeArea.id)");
trailerHTML = trailerHTML.replace(/handleSelectIntention\(area.id, e\)/g, "setOpenArea(area.id)");

// Fix bgBase reference to be dynamic or hardcoded to dark
trailerHTML = trailerHTML.replace(/bgBase/g, "`color-mix(in srgb, ${area?.color || activeArea?.color || '#10b981'} 12%, #000000)`");
// Fix themeColor reference
trailerHTML = trailerHTML.replace(/theme\.themeColor/g, "activeArea?.color || '#10b981'");
trailerHTML = trailerHTML.replace(/theme\.themeColor/g, "area?.color || '#10b981'");

// 2. Add required state to AppleResultPrototype
if (!targetContent.includes('const [isPanelHovered')) {
  targetContent = targetContent.replace(
    'const [openArea, setOpenArea] = useState("dinheiro");',
    `const [openArea, setOpenArea] = useState("dinheiro");\n  const [hoveredArea, setHoveredArea] = useState<string | null>(null);\n  const [isPanelHovered, setIsPanelHovered] = useState(false);`
  );
}

// 3. Find the old grid layout in AppleResultPrototype
const startTargetTag = "{/* Área Desbloqueada & Paywall via Acordeão Estilo Mapeamento 360 */}";
const endTargetTag = "                  </div>\n               </div>\n            </div>\n          </Reveal>";
const targetRegex = new RegExp(startTargetTag.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&') + '[\\s\\S]*?' + endTargetTag.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&'));

let targetReplacement = `{/* Área Desbloqueada & Paywall via Acordeão Estilo Mapeamento 360 */}
                  <div className="w-full mt-10 flex flex-col lg:flex-row gap-6 h-[700px]">
                    ${trailerHTML.replace('          </motion.div>\n      </section>', '')}
                  </div>
               </div>
            </div>
          </Reveal>`;

targetContent = targetContent.replace(targetRegex, targetReplacement);

fs.writeFileSync(fileTarget, targetContent);
console.log("Transplanted layout from Trailer to Prototype!");
