const fs = require('fs');

// 1. Get original clean V2 (from Checkpoint 6.9)
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 2. Change name
code = code.replace(/export default function AppleResultPreview\(\)/g, 'export default function AppleResultPreviewV3()');

// 3. Add imports and vars
code = code.replace(
    /import \{ cityDatabase \} from "@\/data\/houses";/,
    "import { cityDatabase } from \"@/data/houses\";\nimport UnlockPremiumModal from \"@/components/UnlockPremiumModal\";\nimport { MapPin, Unlock } from \"lucide-react\";"
);
code = code.replace(
    /const \[openArea, setOpenArea\] = useState<string>\("dinheiro"\);/,
    `const [openArea, setOpenArea] = useState<string>("dinheiro");
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [targetLockedArea, setTargetLockedArea] = useState<{ id: string; label: string; color: string } | null>(null);
  const citiesObj = {
    nacional: [
      { city: "São Paulo, SP", country: "Brasil", score: 96, lat: -23.55, lon: -46.63, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" },
      { city: "Florianópolis", country: "Brasil", score: 93, lat: -27.59, lon: -48.55, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" }
    ],
    acessivel: [
      { city: "Santiago", country: "Chile", score: 94, lat: -33.45, lon: -70.67, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" },
      { city: "Buenos Aires", country: "Argentina", score: 92, lat: -34.60, lon: -58.38, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" }
    ],
    highticket: [
      { city: "Dubai", country: "Emirados Árabes", score: 98, lat: 25.20, lon: 55.27, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" },
      { city: "Tóquio", country: "Japão", score: 97, lat: 35.68, lon: 139.69, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" }
    ]
  };`
);

// 4. Update the Ritual text
const ritualOld = `<div className="bg-white/5 rounded-3xl p-8 border border-white/10 relative overflow-hidden group shrink-0">
                            <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10 transition-opacity group-hover:opacity-30" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                            
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block mb-4" style={{ color: currentActiveData?.color || '#10b981' }}>O Ritual de 24 Horas</span>
                            
                            <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed relative z-10 mb-6">
                              {currentActiveData?.ritual}
                            </p>
                            
                          </div>`;

const ritualNew = `<div className="bg-white/5 rounded-3xl p-8 md:p-10 border border-white/10 relative overflow-hidden group shrink-0 mt-8">
                            <div className="absolute top-0 right-0 w-64 h-64 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                            
                            {/* O Tema */}
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block mb-3" style={{ color: currentActiveData?.color || '#10b981' }}>O Tema do Seu Ano</span>
                            <p className="text-white/90 text-xl md:text-2xl font-medium leading-relaxed relative z-10 mb-8">
                              Consolidação e Crescimento Material
                            </p>

                            <div className="w-full h-px bg-white/10 my-8"></div>

                            {/* O Segredo */}
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block mb-3" style={{ color: currentActiveData?.color || '#10b981' }}>O Segredo Deste Ano</span>
                            <p className="text-white/70 text-base md:text-lg font-light leading-relaxed relative z-10 mb-8">
                              A verdadeira prosperidade neste ciclo não virá do esforço exaustivo, mas do posicionamento estratégico. O universo pede que você pare de trocar tempo por dinheiro e comece a ancorar o seu valor. A cidade destino ativa a frequência da abundância: o dinheiro que trabalha para você.
                            </p>

                            <div className="w-full h-px bg-white/10 my-8"></div>

                            {/* Os Gestos que Ancoram */}
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block mb-4" style={{ color: currentActiveData?.color || '#10b981' }}>Os Gestos que Ancoram (Ritual 24h)</span>
                            <div className="space-y-5 relative z-10">
                              <div className="flex items-start gap-4">
                                <span className="font-mono text-sm font-bold mt-1" style={{ color: currentActiveData?.color || '#10b981' }}>1.</span>
                                <p className="text-white/80 text-base md:text-lg font-light leading-relaxed">
                                  Compre um item simbólico de alto valor (mesmo que pequeno) usando dinheiro físico. Este objeto será o seu amuleto financeiro.
                                </p>
                              </div>
                              <div className="flex items-start gap-4">
                                <span className="font-mono text-sm font-bold mt-1" style={{ color: currentActiveData?.color || '#10b981' }}>2.</span>
                                <p className="text-white/80 text-base md:text-lg font-light leading-relaxed">
                                  Durante a transação, afirme mentalmente: "Este é o último investimento do meu antigo ciclo de escassez".
                                </p>
                              </div>
                              <div className="flex items-start gap-4">
                                <span className="font-mono text-sm font-bold mt-1" style={{ color: currentActiveData?.color || '#10b981' }}>3.</span>
                                <p className="text-white/80 text-base md:text-lg font-light leading-relaxed">
                                  Ancore na cidade caminhando pelos distritos financeiros sentindo que aquele é o seu habitat natural.
                                </p>
                              </div>
                            </div>
                          </div>`;
                          
code = code.replace(ritualOld, ritualNew);

// 5. Add UnlockPremiumModal at the end just before the last </div>
const modalText = `
      <UnlockPremiumModal 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)} 
        targetArea={targetLockedArea} 
      />
      <style dangerouslySetInnerHTML={{__html: \`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}\`}} />
    </div>
  );
}`;
code = code.replace(/\n\s*<style dangerouslySetInnerHTML.*<\/div>\n\s*\);\n}/s, modalText);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', code);
console.log("Safe rewrite completed.");
