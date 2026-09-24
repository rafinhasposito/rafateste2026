const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldTicketStart = '{/* 1. O TICKET DE EMBARQUE (BOARDING PASS PREMIUM) */}';
const oldTicketEnd = '{/* 2. HERO - CINEMATOGRÁFICO, FOCO NA CASA E BRILHANTE */}';

const newTicket = `
      {/* 1. O PROTOCOLO OFICIAL DE ANCORAGEM (Design Inspirado em Boarding Pass, mas focado no negócio) */}
      <div className="max-w-4xl mx-auto mb-10 px-4 md:px-0">
        <div className="w-full flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-primary/20 font-mono">
          
          {/* Corpo Principal (Dark Glass) */}
          <div className="flex-1 bg-gradient-to-br from-[#08090F] to-[#030305] p-6 md:p-8 relative border-r-2 border-dashed border-primary/30">
            {/* Header */}
            <div className="flex justify-between items-center text-[10px] md:text-xs uppercase font-bold text-primary/60 tracking-[0.2em] mb-6">
              <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-primary" /> Protocolo Solar</span>
              <span>DADOS DA OPERAÇÃO</span>
            </div>

            {/* Rota (Nascimento -> Revolução) */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Ponto de Partida</p>
                <p className="text-xl md:text-2xl font-ps-display text-white tracking-wide truncate">{profile?.birth_city || "Sua Base"}</p>
              </div>
              
              <div className="flex flex-col items-center justify-center px-4 hidden md:flex w-1/3">
                <div className="w-full h-px bg-primary/30 mb-2 relative">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#030305] px-2">
                     <Compass className="w-5 h-5 text-primary opacity-80" />
                   </div>
                </div>
                <span className="text-[8px] uppercase tracking-widest text-primary mt-2">Salto de Rota</span>
              </div>

              <div className="flex-1 text-left md:text-right">
                <p className="text-[10px] uppercase tracking-widest text-primary mb-1">Coordenada Alvo</p>
                <p className="text-xl md:text-2xl font-ps-display text-white tracking-wide truncate">{cityName}</p>
              </div>
            </div>

            {/* Detalhes Técnicos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left border-t border-white/5 pt-6">
              <div>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Consulente</p>
                <p className="text-xs text-white/90 font-semibold truncate">{userFullName}</p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Data de Ancoragem</p>
                <p className="text-xs text-white/90 font-semibold">{profile?.birth_date ? \`\${profile.birth_date.split('-')[2]}/\${profile.birth_date.split('-')[1]}/\${targetYear}\` : "15/03/2026"}</p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Hora Exata (UTC)</p>
                <p className="text-xs text-white/90 font-semibold">{returnTime}</p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-primary mb-1">Intenção</p>
                <p className="text-xs text-primary font-bold">CASA {house}</p>
              </div>
            </div>
          </div>

          {/* Recibo Destacável (O Canhoto) */}
          <div className="w-full md:w-64 bg-primary text-black p-6 flex flex-col justify-between relative">
            <div className="hidden md:block absolute -left-2 top-[-10px] w-4 h-4 rounded-full bg-background"></div>
            <div className="hidden md:block absolute -left-2 bottom-[-10px] w-4 h-4 rounded-full bg-background"></div>

            <div className="mb-4">
              <p className="text-[9px] uppercase tracking-widest text-black/60 font-bold mb-1">ID da Consulta</p>
              <p className="text-sm font-bold">{consultationId?.split('-')[0].toUpperCase() || 'RS-9928X'}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-[9px] uppercase tracking-widest text-black/60 font-bold mb-1">Status do Cálculo</p>
              <p className="text-sm font-bold flex items-center gap-2">
                Concluído <CheckCircle2 className="w-3 h-3" />
              </p>
              <p className="text-[10px] font-semibold mt-2 border-t border-black/10 pt-2">
                Acurácia: {matchScore}%
              </p>
            </div>

            <div className="mt-auto flex justify-center">
              <div className="w-full h-8 flex justify-between items-end opacity-60">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="bg-black" style={{ width: \`\${Math.random() * 3 + 1}px\`, height: \`\${Math.random() * 40 + 60}%\` }}></div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

`;

const startIndex = content.indexOf(oldTicketStart);
const endIndex = content.indexOf(oldTicketEnd);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newTicket + content.substring(endIndex);
  fs.writeFileSync(file, content);
  console.log("Protocol successfully updated to match the business domain.");
} else {
  console.log("Could not find ticket indices.");
}
