const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldReceiptStart = '{/* 9. DADOS PESSOAIS DA CONSULTA (ALI EMBAIXO TUDO JUNTINHO) */}';
const oldReceiptEnd = '{/* 10. VISÃO COMPLETA (GRADE DE 12 CASAS) */}';

const newReceipt = `{/* 9. REGISTRO OFICIAL DO PROTOCOLO (O "Recibo" Técnico Padronizado) */}
        <section className="mb-16 mt-20">
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/50 block mb-2">
              Certificado de Validação
            </span>
            <h3 className="font-ps-display text-2xl text-foreground">Registro Oficial do Protocolo</h3>
          </div>

          <div className="max-w-2xl mx-auto border border-primary/20 rounded-2xl overflow-hidden bg-[#050505] shadow-2xl relative">
            {/* Linha superior estilizada */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <div className="bg-primary/5 border-b border-primary/10 p-4 md:p-6 flex justify-between items-center font-mono">
              <div className="flex flex-col">
                <span className="text-[8px] text-muted-foreground uppercase tracking-widest mb-1">Status da Operação</span>
                <span className="text-[10px] md:text-xs text-primary uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Validado pelo Sistema
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[8px] text-muted-foreground uppercase tracking-widest mb-1">ID da Consulta (Hash)</span>
                <span className="text-[10px] md:text-xs text-white uppercase tracking-widest">
                  #{consultationId?.split('-')[0].toUpperCase() || 'RS-9928X'}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 font-mono text-[10px] md:text-xs text-foreground/80 space-y-4 relative">
              
              <div className="flex justify-between items-end border-b border-white/5 pb-3">
                <span className="text-muted-foreground uppercase tracking-widest">Consulente</span>
                <span className="text-white font-bold text-sm">{userFullName}</span>
              </div>
              
              <div className="flex justify-between items-end border-b border-white/5 pb-3">
                <span className="text-muted-foreground uppercase tracking-widest">Base Natal (Origem)</span>
                <span className="text-white text-right">{profile?.birth_city || "Não informada"}</span>
              </div>
              
              <div className="flex justify-between items-end border-b border-white/5 pb-3">
                <span className="text-muted-foreground uppercase tracking-widest">Ciclo Analisado</span>
                <span className="text-white uppercase">{mode} ({targetYear})</span>
              </div>
              
              <div className="flex justify-between items-end border-b border-white/5 pb-3">
                <span className="text-muted-foreground uppercase tracking-widest">Data do Retorno Solar</span>
                <span className="text-white">{returnDate}</span>
              </div>
              
              <div className="flex justify-between items-end border-b border-white/5 pb-3">
                <span className="text-muted-foreground uppercase tracking-widest">Hora Exata (UTC)</span>
                <span className="text-white">{returnTime}</span>
              </div>
              
              <div className="flex justify-between items-end border-b border-white/5 pb-3">
                <span className="text-muted-foreground uppercase tracking-widest">Coordenada Ancorada</span>
                <span className="text-white font-bold text-right">{cityName}</span>
              </div>

              <div className="flex justify-between items-end border-b border-white/5 pb-3 mt-6">
                <span className="text-muted-foreground uppercase tracking-widest">Foco de Ativação</span>
                <span className="text-primary font-bold text-sm">CASA {house}</span>
              </div>

              <div className="flex justify-between items-end pt-2">
                <span className="text-primary/70 uppercase tracking-widest font-bold">Nível de Compatibilidade</span>
                <span className="text-primary font-ps-display text-2xl drop-shadow-md">{matchScore}% MATCH</span>
              </div>
            </div>
          </div>
        </section>

        `;

const startIndex = content.indexOf(oldReceiptStart);
const endIndex = content.indexOf(oldReceiptEnd);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newReceipt + content.substring(endIndex);
  fs.writeFileSync(file, content);
  console.log("Protocol receipt updated to standard certificate layout.");
} else {
  console.log("Could not find receipt indices.");
}
