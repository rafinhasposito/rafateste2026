const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

const barePillStart = '{/* 1. TOP BAR ULTRA-MINIMALISTA (Só o que importa da consulta) */}';
const barePillEnd = '{/* 2. HERO - CINEMATOGRÁFICO, FOCO NA CASA E BRILHANTE */}';

const premiumHeader = `{/* 1. PROTOCOLO SOLAR - PREMIUM CARD (Só Metadados Essenciais) */}
      <div className="max-w-4xl mx-auto mb-10 px-4 md:px-0">
        <div className="w-full bg-gradient-to-br from-[#08090F] to-[#030305] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-primary/20 font-mono p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Lado Esquerdo: Marca e O Foco Absoluto (CASA) */}
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
            <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase font-bold text-primary/60 tracking-[0.3em] mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Protocolo Solar</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-ps-display text-primary font-bold tracking-widest drop-shadow-md">
              CASA {house}
            </h2>
          </div>

          {/* Lado Direito: Parâmetros Técnicos (Exigência do Usuário) */}
          <div className="flex flex-row flex-wrap md:flex-nowrap gap-3 w-full md:w-auto justify-center">
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
          </div>

        </div>
      </div>

      `;

const startIndex = content.indexOf(barePillStart);
const endIndex = content.indexOf(barePillEnd);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + premiumHeader + content.substring(endIndex);
  fs.writeFileSync(file, content);
  console.log("Premium header injected.");
} else {
  console.log("Could not find pill indices.");
}
