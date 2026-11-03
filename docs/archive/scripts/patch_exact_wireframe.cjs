const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

const ticketStart = '{/* 1. PROTOCOLO SOLAR - UNIFIED TICKET (Boarding Pass Style) */}';
const ticketEnd = '{/* 2. HERO - CINEMATOGRÁFICO, FOCO NA CASA E BRILHANTE */}';

const exactCard = `{/* 1. PROTOCOLO SOLAR - EXACT WIREFRAME */}
      <div className="max-w-4xl mx-auto mb-10 px-4 md:px-0">
        <div className="w-full bg-gradient-to-br from-[#08090F] to-[#030305] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-primary/30 font-mono relative">
          
          {/* Parte de Cima: METADADOS DO SISTEMA */}
          <div className="p-8 md:p-10 flex flex-col items-center text-center relative z-10">
            <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase font-bold text-primary/60 tracking-[0.3em] mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Protocolo Solar</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-ps-display text-primary font-bold tracking-widest drop-shadow-md mb-6 uppercase">
              CASA {house} - {mode}
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Vetor:</span> <strong className="text-white">{searchPath ? searchPath.toUpperCase() : 'CASA'}</strong>
              </div>
              <div className="w-px h-3 bg-primary/20 hidden md:block"></div>
              <div className="flex items-center gap-2">
                <span>Custo:</span> <strong className="text-primary">1 CRÉDITO</strong>
              </div>
              <div className="w-px h-3 bg-primary/20 hidden md:block"></div>
              <div className="flex items-center gap-2">
                <span>Compatibilidade:</span> <strong className="text-white">{matchScore}% MATCH</strong>
              </div>
              <div className="w-px h-3 bg-primary/20 hidden md:block"></div>
              <div className="flex items-center gap-2">
                <span>ID da Consulta:</span> <strong className="text-white font-mono">#{consultationId?.split('-')[0].toUpperCase() || 'RS-9928X'}</strong>
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
          <div className="p-8 md:p-10 bg-[#050505]/50 relative z-10">
            
            {/* Rota */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Ponto de Partida</p>
                <p className="text-xl md:text-2xl font-ps-display text-white tracking-wide truncate">{profile?.birth_city || "Sua Base"}</p>
              </div>
              
              <div className="flex flex-col items-center justify-center px-4 hidden md:flex w-1/3">
                <div className="w-full h-px bg-primary/30 mb-2 relative">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050505] px-3">
                     <Compass className="w-5 h-5 text-primary opacity-80" />
                   </div>
                </div>
                <span className="text-[8px] uppercase tracking-widest text-primary mt-2 border border-primary/10 px-2 py-0.5 rounded-full bg-primary/5">Salto de Rota</span>
              </div>

              <div className="flex-1 text-left md:text-right">
                <p className="text-[10px] uppercase tracking-widest text-primary mb-1">Destino Ideal</p>
                <p className="text-xl md:text-2xl font-ps-display text-white tracking-wide truncate">{cityName}</p>
              </div>
            </div>

            {/* Dados Pessoais (3 Colunas) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-white/5 pt-6">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Viajante</p>
                <p className="text-xs text-white/90 font-semibold truncate">{userFullName}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Data da Viagem</p>
                <p className="text-xs text-white/90 font-semibold">{returnDate}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Hora Exata</p>
                <p className="text-xs text-white/90 font-semibold">{returnTime}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

`;

const ts = content.indexOf(ticketStart);
const te = content.indexOf(ticketEnd);
if (ts !== -1 && te !== -1) {
  content = content.substring(0, ts) + exactCard + content.substring(te);
}

fs.writeFileSync(file, content);
console.log("Exact wireframe patched in.");
