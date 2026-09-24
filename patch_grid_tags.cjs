const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldGridItem = `<span className={\`font-ps-display text-lg mt-0.5 leading-tight \${isCurrentHouse ? "text-foreground" : "text-foreground/70"}\`}>
                          {houseItem.label}
                        </span>`;

const newGridItem = `<span className={\`font-ps-display text-lg mt-0.5 leading-tight \${isCurrentHouse ? "text-foreground" : "text-foreground/70"}\`}>
                          {houseItem.label}
                        </span>
                        {houseItem.tag && (
                          <span className={\`text-[9px] uppercase tracking-widest font-semibold mt-1 leading-snug \${isCurrentHouse ? "text-primary/80" : "text-muted-foreground/50"}\`}>
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
