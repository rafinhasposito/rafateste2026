const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldGridItem = `<span className={\`text-sm font-ps-display truncate \${isCurrentHouse ? "text-foreground" : (isUnlocked ? "text-foreground/90" : "text-muted-foreground")}\`}>
                        {houseItem.label}
                      </span>`;

const newGridItem = `<span className={\`text-sm font-ps-display truncate \${isCurrentHouse ? "text-foreground" : (isUnlocked ? "text-foreground/90" : "text-muted-foreground")}\`}>
                        {houseItem.label}
                      </span>
                      {houseItem.tag && (
                        <span className={\`text-[8px] uppercase tracking-widest mt-0.5 font-semibold truncate \${isCurrentHouse ? "text-primary/70" : "text-muted-foreground/50"}\`}>
                          {houseItem.tag}
                        </span>
                      )}`;

if (content.includes(oldGridItem)) {
  content = content.replace(oldGridItem, newGridItem);
  fs.writeFileSync(file, content);
  console.log("Patched DestinyResults grid with tags.");
} else {
  console.log("Could not find the target code in DestinyResults.tsx");
}
