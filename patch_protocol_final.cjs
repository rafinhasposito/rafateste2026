const fs = require('fs');

// 1. Fix DestinyResults (Header Name + Ensure Badges render)
let drContent = fs.readFileSync('src/components/DestinyResults.tsx', 'utf8');

// Replace Relatório Astrológico with PROTOCOLO SOLAR
drContent = drContent.replace(
  '<span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-primary" /> Relatório Astrológico</span>',
  '<span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-primary" /> PROTOCOLO SOLAR</span>'
);

// If searchPath is null, don't hide the badge. Show a fallback or ensure we get it from Dashboard
drContent = drContent.replace(
  '{searchPath && (',
  '{searchPath ? ('
);
drContent = drContent.replace(
  '<span className="bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">VIA: {searchPath.toUpperCase()}</span>\n                )}',
  '<span className="bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">VIA: {searchPath.toUpperCase()}</span>\n                ) : <span className="bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">VIA: CASA</span>}'
); // fallback so it ALWAYS shows at least VIA: CASA if legacy consultation doesn't have it.

fs.writeFileSync('src/components/DestinyResults.tsx', drContent);

// 2. Fix HouseDetail to accept searchPath
let hdContent = fs.readFileSync('src/components/HouseDetail.tsx', 'utf8');
if (!hdContent.includes('searchPath?: string;')) {
  hdContent = hdContent.replace(
    'onClose?: () => void;',
    'onClose?: () => void;\n  searchPath?: string;'
  );
  hdContent = hdContent.replace(
    'originCity, onClose',
    'originCity, onClose, searchPath'
  );
  hdContent = hdContent.replace(
    '<DestinyResults',
    '<DestinyResults\n        searchPath={searchPath as any}'
  );
  fs.writeFileSync('src/components/HouseDetail.tsx', hdContent);
}

// 3. Fix Dashboard to pass searchPath inferred
let dbContent = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
if (dbContent.includes('<HouseDetail') && !dbContent.includes('searchPath={')) {
  // we know Dashboard has `const searchType = inferSearchType(consultation);` down below, but for HouseDetail it's up in the AnimatePresence.
  // Wait, in Dashboard line 395:
  dbContent = dbContent.replace(
    'onClose={() => setSelectedHouse(null)}',
    'onClose={() => setSelectedHouse(null)}\n                  searchPath={inferSearchType(consultation).label}'
  );
  fs.writeFileSync('src/pages/Dashboard.tsx', dbContent);
}

console.log("Patched DestinyResults, HouseDetail, and Dashboard.");
