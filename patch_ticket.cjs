const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure Plane and QrCode icons are imported
if (!content.includes('Plane')) {
  content = content.replace('MapPin,', 'MapPin, Plane, QrCode,');
}

const oldTicketStart = '{/* 1. O TICKET OFICIAL (Certificado de Consulta) */}';
const oldTicketEnd = '{/* 2. HERO - CINEMATOGRÁFICO, FOCO NA CASA E BRILHANTE */}';

const newTicket = `
      {/* 1. O TICKET DE EMBARQUE (BOARDING PASS PREMIUM) */}
      <div className="max-w-4xl mx-auto mb-10 px-4 md:px-0">
        <div className="w-full flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-primary/20 font-mono">
          
          {/* Lado Esquerdo: Main Pass (Dark Glass com detalhes Dourados) */}
          <div className="flex-1 bg-gradient-to-br from-[#08090F] to-[#030305] p-6 md:p-8 relative border-r-2 border-dashed border-primary/30">
            {/* Header */}
            <div className="flex justify-between items-center text-[10px] md:text-xs uppercase font-bold text-primary/60 tracking-[0.2em] mb-6">
              <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-primary" /> Solar Return Protocol</span>
              <span>BOARDING PASS</span>
            </div>

            {/* Rota (Origem -> Destino) */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1">
                <p className="text-4xl md:text-5xl font-ps-display text-white tracking-wider">NAT</p>
                <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary/50 mt-1">Origem (Natal)</p>
              </div>
              
              <div className="flex flex-col items-center justify-center px-4">
                <div className="w-full h-px bg-primary/30 mb-2 absolute left-0 right-0 top-1/2 -z-10" />
                <Plane className="w-6 h-6 md:w-8 md:h-8 text-primary opacity-80" />
                <span className="text-[8px] uppercase tracking-widest text-primary mt-2 border border-primary/30 px-2 py-0.5 rounded-full bg-[#030305]">Voo Direto</span>
              </div>

              <div className="flex-1 text-right">
                <p className="text-4xl md:text-5xl font-ps-display text-white tracking-wider truncate">
                  {cityName.substring(0, 3).toUpperCase()}
                </p>
                <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary/50 mt-1 truncate">{cityName}</p>
              </div>
            </div>

            {/* Detalhes do Passageiro e Voo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Passageiro</p>
                <p className="text-xs text-white/90 font-semibold truncate">{userFullName}</p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Data do Retorno</p>
                <p className="text-xs text-white/90 font-semibold">{profile?.birth_date ? \`\${profile.birth_date.split('-')[2]}/\${profile.birth_date.split('-')[1]}/\${targetYear}\` : "15/03/2026"}</p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Hora Local</p>
                <p className="text-xs text-white/90 font-semibold">{returnTime} (UTC)</p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Classe</p>
                <p className="text-xs text-primary font-bold">CASA {house} VIP</p>
              </div>
            </div>
          </div>

          {/* Lado Direito: Stub (Recibo destacável) */}
          <div className="w-full md:w-64 bg-primary text-black p-6 flex flex-col justify-between relative">
            {/* Círculos imitando o picote da passagem */}
            <div className="hidden md:block absolute -left-2 top-[-10px] w-4 h-4 rounded-full bg-background"></div>
            <div className="hidden md:block absolute -left-2 bottom-[-10px] w-4 h-4 rounded-full bg-background"></div>

            <div className="mb-4">
              <p className="text-[9px] uppercase tracking-widest text-black/60 font-bold mb-1">Ticket #</p>
              <p className="text-sm font-bold">{consultationId?.split('-')[0].toUpperCase() || 'RS-9928X'}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-[9px] uppercase tracking-widest text-black/60 font-bold mb-1">Destino Mestre</p>
              <p className="text-base font-ps-display font-bold leading-tight">{cityName}</p>
              <p className="text-[10px] font-semibold mt-1">Match: {matchScore}%</p>
            </div>

            <div className="mt-auto flex justify-center">
              {/* Fake Barcode Effect */}
              <div className="w-full h-12 flex justify-between items-end opacity-80">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="bg-black" style={{ width: \`\${Math.random() * 4 + 1}px\`, height: \`\${Math.random() * 40 + 60}%\` }}></div>
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
  console.log("Boarding Pass successfully injected.");
} else {
  console.log("Could not find ticket indices.");
}
