const fs = require('fs');

const fileTarget = 'src/pages/AppleResultPrototype.tsx';
let targetContent = fs.readFileSync(fileTarget, 'utf8');

let trailerHTML = fs.readFileSync('trailer_layout.txt', 'utf8');

// Strip out the extra trailing tags from HouseTrailer
trailerHTML = trailerHTML.replace('            </div>\n          </motion.div>\n      </section>\n      \n      {/* STICKY BOTTOM BAR (Aparece quando escolhe) */}\n      <AnimatePresence>\n        {selectedIntention && (() => {', '');
trailerHTML = trailerHTML.split('            </div>\n          </motion.div>\n      </section>')[0];

// In AppleResultPrototype, we don't have `selectedIntention`, we have `openArea`.
trailerHTML = trailerHTML.replace(/hoveredArea/g, "hoveredArea");
trailerHTML = trailerHTML.replace(/setHoveredArea/g, "setHoveredArea");
trailerHTML = trailerHTML.replace(/selectedIntention/g, "openArea");
trailerHTML = trailerHTML.replace(/setSelectedIntention/g, "setOpenArea");
trailerHTML = trailerHTML.replace(/handleSelectIntention\(activeArea\.id, e\);/g, "setOpenArea(activeArea.id);");
trailerHTML = trailerHTML.replace(/handleSelectIntention\(area\.id, e\);/g, "setOpenArea(area.id);");

// Fix bgBase
trailerHTML = trailerHTML.replace(/bgBase/g, "`color-mix(in srgb, \${activeArea?.color || '#10b981'} 12%, #000000)`");
// Fix theme.themeColor
trailerHTML = trailerHTML.replace(/theme\.themeColor/g, "activeArea?.color || '#10b981'");
trailerHTML = trailerHTML.replace(/theme\.themeColor/g, "area?.color || '#10b981'");

// Add state variables
if (!targetContent.includes('const [isPanelHovered')) {
  targetContent = targetContent.replace(
    'const [openArea, setOpenArea] = useState("dinheiro");',
    `const [openArea, setOpenArea] = useState("dinheiro");\n  const [hoveredArea, setHoveredArea] = useState<string | null>(null);\n  const [isPanelHovered, setIsPanelHovered] = useState(false);\n  \n  const sortedAreas = [...LIFE_AREAS].sort((a,b) => b.score - a.score);`
  );
}

// Replace the accordion block
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

targetContent = targetContent.replace(targetRegex, replacement);

fs.writeFileSync(fileTarget, targetContent);
console.log("Transplanted successfully!");
