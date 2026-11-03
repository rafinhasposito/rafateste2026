const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

content = content.replace(/\{area\.unlocked \?/g, '{(area.unlocked || unlockedItems.includes(area.id)) ?');
content = content.replace(/\{activeArea\.unlocked \?/g, '{(activeArea.unlocked || unlockedItems.includes(activeArea.id)) ?');
content = content.replace(/\{currentActiveData\?\.unlocked && \(/g, '{(currentActiveData?.unlocked || (currentActiveData && unlockedItems.includes(currentActiveData.id))) && (');

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
