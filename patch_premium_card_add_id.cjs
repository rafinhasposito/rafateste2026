const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldCardSection = `<div className="flex flex-row flex-wrap md:flex-nowrap gap-3 w-full md:w-auto justify-center">
            <div className="bg-background/50 border border-primary/10 rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px] flex-1">
               <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Ciclo</span>
               <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">{mode.toUpperCase()}</span>
            </div>
            <div className="bg-background/50 border border-primary/10 rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px] flex-1">
               <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Vetor</span>
               <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">{searchPath ? searchPath.toUpperCase() : 'CASA'}</span>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px] flex-1">
               <span className="text-[9px] uppercase tracking-[0.2em] text-primary/70 mb-1">Custo</span>
               <span className="text-xs md:text-sm font-bold text-primary uppercase tracking-wider">1 Crédito</span>
            </div>
          </div>`;

const newCardSection = `<div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="flex flex-row flex-wrap md:flex-nowrap gap-3 w-full justify-center md:justify-end">
              <div className="bg-background/50 border border-primary/10 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center min-w-[90px] flex-1">
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Ciclo</span>
                <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">{mode.toUpperCase()}</span>
              </div>
              <div className="bg-background/50 border border-primary/10 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center min-w-[90px] flex-1">
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Vetor</span>
                <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">{searchPath ? searchPath.toUpperCase() : 'CASA'}</span>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center min-w-[90px] flex-1">
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-primary/70 mb-1">Custo</span>
                <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider">1 Crédito</span>
              </div>
            </div>
            <div className="flex flex-row flex-wrap md:flex-nowrap gap-3 w-full justify-center md:justify-end">
              <div className="bg-background/50 border border-primary/10 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center min-w-[140px] flex-1">
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">ID (Hash)</span>
                <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider font-mono">#{consultationId?.split('-')[0].toUpperCase() || 'RS-9928X'}</span>
              </div>
              <div className="bg-background/50 border border-primary/10 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center min-w-[140px] flex-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5"></div>
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-primary/70 mb-1 relative z-10">Compatibilidade</span>
                <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider relative z-10">{matchScore}% MATCH</span>
              </div>
            </div>
          </div>`;

content = content.replace(oldCardSection, newCardSection);
fs.writeFileSync(file, content);
console.log("Added ID and MatchScore to the top card.");
