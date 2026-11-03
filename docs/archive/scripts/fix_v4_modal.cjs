const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetOnSuccess = `        onSuccess={(id, purchaseType) => {
          if (purchaseType === 'single') {
            setUnlockedItems(prev => [...prev, id]);
            if (targetLockedArea?.type === 'foco') {
              setHoveredArea(id);
            }
          } else {
            // Se comprou o passaporte completo, destranca tudo (1 ao 12)
            setUnlockedItems(prev => {
              const allHouses = Array.from({length: 12}, (_, i) => (i + 1).toString());
              return Array.from(new Set([...prev, ...allHouses]));
            });
            setIsBoardingPassOpen(true);
          }
        }}`;

const newOnSuccess = `        onSuccess={(id, purchaseType) => {
          if (purchaseType === 'single') {
            setUnlockedItems(prev => [...prev, id]);
            if (targetLockedArea?.type === 'foco') {
              setHoveredArea(id);
            } else if (targetLockedArea?.type === 'rota') {
              setActiveRouteIndex(parseInt(id) - 1);
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
            }
          } else {
            // Se comprou o passaporte completo, destranca tudo (1 ao 12)
            setUnlockedItems(prev => {
              const allHouses = Array.from({length: 12}, (_, i) => (i + 1).toString());
              return Array.from(new Set([...prev, ...allHouses]));
            });
            setIsBoardingPassOpen(true);
          }
        }}`;

if (content.includes("setHoveredArea(id);")) {
    content = content.replace(targetOnSuccess, newOnSuccess);
    fs.writeFileSync(file, content);
    console.log("Modal Success fixed!");
} else {
    console.log("Could not find block.");
}
