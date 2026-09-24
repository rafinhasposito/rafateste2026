const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure PlayCircle and Download are imported
if (!content.includes('PlayCircle')) {
  content = content.replace('import { ArrowRight } from "lucide-react";', 'import { ArrowRight, PlayCircle, Download } from "lucide-react";');
}

const masterclassSection = `
        {/* 3.1 MASTERCLASS & MATERIAIS */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <h3 className="font-ps-display text-3xl md:text-4xl text-white">Masterclass VIP</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#C9A227]/40 to-transparent" />
          </div>

          <div className="bg-[#030306]/80 border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl backdrop-blur-md">
            <div className="w-full aspect-video bg-black/60 rounded-xl border border-white/5 relative overflow-hidden group cursor-pointer flex items-center justify-center mb-8">
               <div className="absolute inset-0 bg-gradient-to-br from-[#C9A227]/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform">
                     <PlayCircle className="w-8 h-8 text-[#C9A227] ml-1" />
                  </div>
                  <span className="text-white/50 text-xs font-ps-ui uppercase tracking-widest">Masterclass da Casa {house} (Em Breve)</span>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                  <div className="text-left">
                     <h4 className="text-white font-ps-display tracking-wide mb-1">Guia de Revolução</h4>
                     <span className="text-[10px] text-[#C9A227] uppercase tracking-widest">Baixar PDF</span>
                  </div>
                  <Download className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
               </button>

               <button className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                  <div className="text-left">
                     <h4 className="text-white font-ps-display tracking-wide mb-1">Ritual das 24 Horas</h4>
                     <span className="text-[10px] text-[#C9A227] uppercase tracking-widest">Baixar PDF</span>
                  </div>
                  <Download className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
               </button>
            </div>
          </div>
        </section>
`;

const insertIndex = content.indexOf(`{/* 3.5 DESTINOS SECUNDÁRIOS */}`);
const finalContent = content.slice(0, insertIndex) + masterclassSection + "\n        " + content.slice(insertIndex);
fs.writeFileSync(file, finalContent);
console.log("Masterclass inserted");
