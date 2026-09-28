const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the color of "O foco é Dinheiro"
content = content.replace(
  '<h3 className="text-4xl md:text-6xl font-ps-display font-bold text-center mb-4">O foco é <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">{P.intention}</span>.</h3>',
  '<h3 className="text-4xl md:text-6xl font-ps-display font-bold text-center mb-4">O foco é <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-emerald-300">{P.intention}</span>.</h3>'
);

// 2. Replace "Destino Ideal" with Cosmic Signature in the Boarding Pass
const oldDestino = `                             <div>
                               <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Destino Ideal</p>
                               <p className="text-[#10b981] font-bold text-2xl uppercase tracking-wider">{P.city}</p>
                               <p className="text-white/40 font-mono text-xs mt-1">{P.coords}</p>
                             </div>`;

const newDestino = `                             <div>
                               <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Assinatura Astrológica</p>
                               <p className="text-[#10b981] font-bold text-xl uppercase tracking-wider">Sol em {P.sign}</p>
                               <p className="text-white/60 font-mono text-[11px] mt-1 tracking-wider">ASC {P.ascendant} • {P.phase}</p>
                             </div>`;

content = content.replace(oldDestino, newDestino);

fs.writeFileSync(file, content);
console.log("Fixed text color and Boarding Pass data!");
