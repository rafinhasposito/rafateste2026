const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the end of the return statement before the closing divs
const insertPoint = content.lastIndexOf('</div>\n    </motion.div>');

const gridCode = `
        {/* 5. EXPLORAR OUTRAS CASAS */}
        {!embedded && (
          <section className="border-t border-white/5 pt-12 mt-12 mb-8">
            <div className="text-center mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-foreground/40 block mb-3">
                Visão Completa
              </span>
              <h3 className="font-ps-display text-2xl text-foreground">As 12 Coordenadas do Ano</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
              {Object.values(cityDatabase).map((houseItem) => {
                const isCurrentHouse = houseItem.id === house;
                const isUnlocked = isHouseUnlocked ? isHouseUnlocked(houseItem.id) : (isCurrentHouse || autoUnlocked);

                return (
                  <div
                    key={houseItem.id}
                    onClick={() => {
                      if (!isUnlocked) {
                        if (onUnlock) onUnlock(houseItem.id);
                      } else if (onSelectHouse && !isCurrentHouse) {
                        onSelectHouse(houseItem.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={\`relative flex items-center p-3 rounded-lg border transition-all \${!isCurrentHouse ? "cursor-pointer" : ""} \${
                      isCurrentHouse
                        ? "bg-primary/10 border-primary/40 shadow-[0_0_15px_hsl(var(--primary)/0.15)]"
                        : "bg-foreground/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.03]"
                    }\`}
                  >
                    <div className="flex flex-col flex-1 truncate">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={\`text-[10px] font-mono font-bold \${isCurrentHouse ? "text-primary" : "text-foreground/50"}\`}>
                          CASA {String(houseItem.id).padStart(2, "0")}
                        </span>
                      </div>
                      <span className={\`text-xs font-semibold truncate \${isCurrentHouse ? "text-foreground" : (isUnlocked ? "text-foreground/90" : "text-foreground/40")}\`}>
                        {houseItem.label}
                      </span>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isCurrentHouse ? (
                        <Eye className="w-4 h-4 text-primary" />
                      ) : !isUnlocked ? (
                        <Lock className="w-4 h-4 text-foreground/30" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-foreground/50 group-hover:text-foreground" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
`;

content = content.slice(0, insertPoint) + gridCode + content.slice(insertPoint);
fs.writeFileSync(file, content);
console.log('Grid added back');
