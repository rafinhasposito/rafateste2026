const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add searchPath to DestinyResultsProps
if (!content.includes('searchPath?: "cidade" | "casa" | "intencao" | null;')) {
  content = content.replace(
    /mode\?: "passado" \| "presente" \| "futuro";/,
    'mode?: "passado" | "presente" | "futuro";\n  searchPath?: "cidade" | "casa" | "intencao" | null;'
  );
}

// 2. Add searchPath to component signature
if (!content.includes('searchPath, unlockedCount')) {
  content = content.replace(
    /isHouseUnlocked, onSelectHouse, onUnlock, unlockedCount = 1/,
    'isHouseUnlocked, onSelectHouse, onUnlock, searchPath, unlockedCount = 1'
  );
}

// 3. Update Header
const oldHeader = `{/* Header */}
            <div className="flex justify-between items-center text-[10px] md:text-xs uppercase font-bold text-primary/60 tracking-[0.2em] mb-6">
              <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-primary" /> Relatório Astrológico</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">Uso: 1 Crédito</span>
            </div>`;

const newHeader = `{/* Header - Dinâmico e Funcional */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] md:text-xs uppercase font-bold text-primary/60 tracking-[0.2em] mb-6 gap-3">
              <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-primary" /> Relatório Astrológico</span>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">CICLO: {mode.toUpperCase()}</span>
                {searchPath && (
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">VIA: {searchPath.toUpperCase()}</span>
                )}
                <span className="bg-primary/10 text-primary/60 px-3 py-1 rounded-full border border-primary/10 hidden sm:block">1 CRÉDITO</span>
              </div>
            </div>`;

content = content.replace(oldHeader, newHeader);

// 4. Update Dynamic Labels
content = content.replace(
  '<p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Viajante</p>',
  '<p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Consulente</p>'
);

content = content.replace(
  '<p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Data da Viagem</p>',
  '<p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">{mode === "passado" ? "Data da Ocorrência" : "Data da Viagem"}</p>'
);


fs.writeFileSync(file, content);
console.log("Protocol dynamic patch applied successfully.");
