const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

const debugBox = `
      {/* FLOATING DEBUG BOX */}
      <div className="fixed top-4 left-4 z-[9999] bg-black/80 border-2 border-red-500 text-white p-4 font-mono text-xs rounded-xl shadow-2xl backdrop-blur-md">
        <div className="text-red-500 font-bold text-lg mb-2">DEBUG V4 ATIVO</div>
        <div>Route Index: {activeRouteIndex}</div>
        <div>Hovered Area: {hoveredArea}</div>
        <div>Theme Color: {themeColor}</div>
        <div>House Name: {dynamicCity}</div>
        <div>Unlocked Items: {unlockedItems.join(',')}</div>
      </div>
`;

content = content.replace('{/* AS 8 ÁREAS - GRID SPLIT */}', debugBox + '\n{/* AS 8 ÁREAS - GRID SPLIT */}');

fs.writeFileSync(file, content);
console.log("Added Debug Box!");
