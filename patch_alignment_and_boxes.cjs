const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

const exactStart = '{/* 1. PROTOCOLO SOLAR - EXACT WIREFRAME */}';
const exactEnd = '{/* 2. HERO - CINEMATOGRÁFICO, FOCO NA CASA E BRILHANTE */}';

const refinedCard = `{/* 1. PROTOCOLO SOLAR - REFINED TICKET */}
      <div className="max-w-4xl mx-auto mb-10 px-4 md:px-0">
        <div className="w-full bg-gradient-to-br from-[#08090F] to-[#030305] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-primary/30 font-mono relative">
          
          {/* Parte de Cima: METADADOS DO SISTEMA */}
          <div className="p-6 md:p-10 flex flex-col items-center text-center relative z-10">
            <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase font-bold text-primary/60 tracking-[0.3em] mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Protocolo Solar</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-ps-display text-primary font-bold tracking-widest drop-shadow-md mb-8 uppercase">
              CASA {house} <span className="text-white/30 mx-2">-</span> {mode}
            </h2>

            {/* As 4 Caixinhas (Exigência do Usuário) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-3xl mx-auto">
              <div className="bg-background/60 border border-primary/10 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center shadow-inner">
                 <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Vetor</span>
                 <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">{searchPath ? searchPath.toUpperCase() : 'CASA'}</span>
              </div>
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.05)]">
                 <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-primary/80 mb-1">Custo</span>
                 <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider">1 Crédito</span>
              </div>
              <div className="bg-background/60 border border-primary/10 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center shadow-inner">
                 <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Match</span>
                 <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">{matchScore}%</span>
              </div>
              <div className="bg-background/60 border border-primary/10 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center shadow-inner">
                 <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">ID (Hash)</span>
                 <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider font-mono">#{consultationId?.split('-')[0].toUpperCase() || 'RS-9928X'}</span>
              </div>
            </div>
          </div>

          {/* Divisória Serrilhada */}
          <div className="relative w-full h-8 flex items-center justify-between px-[-10px]">
            <div className="absolute left-[-15px] w-8 h-8 bg-background rounded-full border-r border-primary/30 z-20"></div>
            <div className="w-full border-t-2 border-dashed border-primary/20 absolute top-1/2 left-0 z-10"></div>
            <div className="absolute right-[-15px] w-8 h-8 bg-background rounded-full border-l border-primary/30 z-20"></div>
          </div>

          {/* Parte de Baixo: DADOS DO VIAJANTE */}
          <div className="p-6 md:p-10 bg-[#050505]/60 relative z-10">
            
            {/* Rota (Alinhamento Perfeito com Grid) */}
            <div className="grid grid-cols-[1fr_80px_1fr] md:grid-cols-[1fr_120px_1fr] items-center w-full gap-2 md:gap-4 mb-8">
              
              {/* Origem (Esquerda) */}
              <div className="text-right overflow-hidden flex flex-col items-end">
                <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Origem Natal</p>
                <p className="text-sm md:text-2xl font-ps-display text-white truncate w-full max-w-[200px] md:max-w-xs">{profile?.birth_city?.split(',')[0] || "Base"}</p>
              </div>

              {/* Centro (Ícone e Linha) */}
              <div className="flex flex-col items-center justify-center w-full px-2">
                 <Compass className="w-5 h-5 md:w-6 md:h-6 text-primary mb-2 opacity-80" />
                 <div className="w-full h-px bg-primary/40 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                 </div>
                 <span className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-primary mt-2">Salto de Rota</span>
              </div>

              {/* Destino (Direita) */}
              <div className="text-left overflow-hidden flex flex-col items-start">
                <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-primary mb-1">Destino Ideal</p>
                <p className="text-sm md:text-2xl font-ps-display text-white truncate w-full max-w-[200px] md:max-w-xs">{cityName}</p>
              </div>
            </div>

            {/* Dados Pessoais (Bloco Sólido Integrado) */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center shadow-lg">
              <div className="py-2 md:py-0 md:px-4 flex flex-col items-center justify-center">
                <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Viajante</p>
                <p className="text-[11px] md:text-xs text-white/90 font-semibold">{userFullName}</p>
              </div>
              <div className="py-2 md:py-0 md:px-4 flex flex-col items-center justify-center">
                <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Data da Viagem</p>
                <p className="text-[11px] md:text-xs text-white/90 font-semibold">{returnDate}</p>
              </div>
              <div className="py-2 md:py-0 md:px-4 flex flex-col items-center justify-center">
                <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Hora Exata</p>
                <p className="text-[11px] md:text-xs text-white/90 font-semibold">{returnTime} (UTC)</p>
              </div>
            </div>

          </div>
        </div>
      </div>

`;

const ts = content.indexOf(exactStart);
const te = content.indexOf(exactEnd);
if (ts !== -1 && te !== -1) {
  content = content.substring(0, ts) + refinedCard + content.substring(te);
}

fs.writeFileSync(file, content);
console.log("Refined wireframe with boxes and absolute grid alignment patched in.");
