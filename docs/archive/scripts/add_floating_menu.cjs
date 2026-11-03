const fs = require('fs');
let content = fs.readFileSync('src/pages/HouseResult.tsx', 'utf8');

// Insert a Floating Menu for the user to easily change houses!
const menuCode = `
      {/* ── FLOATING DEBUG MENU FOR USER TO TEST 12 HOUSES ── */}
      <div className="fixed bottom-6 left-6 z-50 group">
        <div className="absolute bottom-full left-0 mb-4 bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-2xl w-[320px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 scale-95 group-hover:scale-100 origin-bottom-left shadow-2xl">
          <h4 className="text-white font-bold mb-3 text-sm tracking-widest uppercase opacity-80">Testar Casas Dinâmicas</h4>
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
              <button 
                key={num}
                onClick={() => navigate(\`/resultado/\${num}\`)}
                className="py-2 rounded-lg text-xs font-bold transition-all duration-300 border border-white/10 hover:border-white/50 hover:bg-white/10"
                style={{ 
                  backgroundColor: parsedId === num ? houseModel.themeColor : 'transparent',
                  color: parsedId === num ? '#000' : '#fff'
                }}
              >
                CASA {num}
              </button>
            ))}
          </div>
          <p className="text-white/40 text-[10px] mt-4 leading-tight">
            Este modelo de 1 arquivo renderiza dinamicamente as 12 casas perfeitamente baseadas na URL. Clique nos botões para transacionar.
          </p>
        </div>
        <button className="h-14 px-6 rounded-full bg-white text-black font-bold tracking-widest uppercase text-sm flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform">
          <Compass className="w-5 h-5" />
          Testar Modelo
        </button>
      </div>
`;

// Insert it right after the outermost wrapper div inside AppleResultPreviewV4
content = content.replace(
  '{/* ── NAVBAR PADRÃO (RESPONSIVA) ── */}',
  menuCode + '\n      {/* ── NAVBAR PADRÃO (RESPONSIVA) ── */}'
);

fs.writeFileSync('src/pages/HouseResult.tsx', content);
console.log("Added Floating Menu!");
