const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. REMOVE THE BOTTOM RECEIPT
const receiptStart = '{/* 9. REGISTRO OFICIAL DO PROTOCOLO (O "Recibo" Técnico Padronizado) */}';
const receiptEnd = '{/* 10. VISÃO COMPLETA (GRADE DE 12 CASAS) */}';

const rs = content.indexOf(receiptStart);
const re = content.indexOf(receiptEnd);
if (rs !== -1 && re !== -1) {
  content = content.substring(0, rs) + content.substring(re);
}

// 2. REPLACE THE TOP CARD WITH THE UNIFIED DESIGN
const topCardStart = '{/* 1. PROTOCOLO SOLAR - PREMIUM CARD (Só Metadados Essenciais) */}';
const topCardEnd = '{/* 2. HERO - CINEMATOGRÁFICO, FOCO NA CASA E BRILHANTE */}';

const unifiedCard = `{/* 1. PROTOCOLO SOLAR - UNIFIED TICKET (Boarding Pass Style) */}
      <div className="max-w-4xl mx-auto mb-10 px-4 md:px-0">
        <div className="w-full bg-gradient-to-br from-[#08090F] to-[#030305] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-primary/30 font-mono relative">
          
          {/* Parte de Cima (O Destaque Centralizado) */}
          <div className="p-8 md:p-10 flex flex-col items-center text-center relative z-10">
            <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase font-bold text-primary/60 tracking-[0.3em] mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Protocolo Solar</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-ps-display text-primary font-bold tracking-widest drop-shadow-md mb-6 uppercase">
              CASA {house} - {mode}
            </h2>

            <div className="flex items-center justify-center gap-8 md:gap-16">
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Vetor</span>
                <span className="text-sm md:text-base font-bold text-white uppercase tracking-wider">{searchPath ? searchPath.toUpperCase() : 'CASA'}</span>
              </div>
              <div className="w-px h-8 bg-primary/20"></div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary/70 mb-1">Custo</span>
                <span className="text-sm md:text-base font-bold text-primary uppercase tracking-wider">1 Crédito</span>
              </div>
            </div>
          </div>

          {/* Divisória Serrilhada (Estilo Passagem) */}
          <div className="relative w-full h-8 flex items-center justify-between px-[-10px]">
            <div className="absolute left-[-15px] w-8 h-8 bg-background rounded-full border-r border-primary/30 z-20"></div>
            <div className="w-full border-t-2 border-dashed border-primary/20 absolute top-1/2 left-0 z-10"></div>
            <div className="absolute right-[-15px] w-8 h-8 bg-background rounded-full border-l border-primary/30 z-20"></div>
          </div>

          {/* Parte de Baixo (Dados da Pessoa B2C) */}
          <div className="p-8 md:p-10 bg-[#050505]/50 relative z-10">
            
            {/* Rota */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
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

            {/* Grid de Dados Pessoais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Viajante</p>
                <p className="text-xs text-white/90 font-semibold truncate">{userFullName}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Data da Viagem (Retorno)</p>
                <p className="text-xs text-white/90 font-semibold">{returnDate}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Hora Exata (UTC)</p>
                <p className="text-xs text-white/90 font-semibold">{returnTime}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-primary mb-1">Compatibilidade</p>
                <p className="text-sm text-primary font-bold">{matchScore}% MATCH</p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center opacity-70">
              <span className="text-[8px] uppercase tracking-[0.3em] text-muted-foreground">ID da Consulta</span>
              <span className="text-[10px] font-mono tracking-widest text-white">#{consultationId?.split('-')[0].toUpperCase() || 'RS-9928X'}</span>
            </div>

          </div>
        </div>
      </div>

`;

const ts = content.indexOf(topCardStart);
const te = content.indexOf(topCardEnd);
if (ts !== -1 && te !== -1) {
  content = content.substring(0, ts) + unifiedCard + content.substring(te);
}

fs.writeFileSync(file, content);
console.log("Unified Protocol Card patched in.");
