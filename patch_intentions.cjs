const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetPaywall = `{/* ══════════════════════════════════════════════════
         12. PAYWALL & FOOTER
         ══════════════════════════════════════════════════ */}`;

const lockedSection = `{/* ══════════════════════════════════════════════════
         11.5. OUTROS FOCOS (LOCKED)
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 border-t border-white/[0.02]">
        <Reveal className="mb-12 text-center md:text-left">
          <h2 className="font-ps-display text-3xl md:text-5xl font-bold tracking-tight mb-4">E os outros focos?</h2>
          <p className="text-white/50 text-lg md:text-xl font-light">
            Você descobriu seu destino ideal para <span className="text-[#3b82f6] font-semibold">{P.intention}</span>. Mas onde ficam as suas cidades perfeitas para as outras áreas da vida?
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            { id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#10b981" },
            { id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#f59e0b" },
            { id: "saude", icon: Leaf, label: "Saúde e Vitalidade", color: "#22c55e" },
            { id: "networking", icon: Users, label: "Networking", color: "#3b82f6" },
            { id: "rotina", icon: Calendar, label: "Rotina e Produtividade", color: "#a855f7" },
            { id: "espiritual", icon: Sparkles, label: "Espiritualidade", color: "#818cf8" },
            { id: "identidade", icon: Crown, label: "Identidade", color: "#c9a227" },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="relative group overflow-hidden bg-white/[0.02] border border-white/[0.05] hover:border-white/20 transition-all duration-300 rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer">
                {/* Efeito Blur e Lock por cima */}
                <div className="absolute inset-0 z-10 bg-[#0B1426]/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex flex-col items-center gap-2">
                    <Lock className="w-5 h-5 text-white/80" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Desbloquear</span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: \`\${item.color}15\` }}>
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <h4 className="text-white/90 font-semibold mb-2">{item.label}</h4>
                <div className="w-full h-8 flex items-center justify-center mt-2 relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/10 via-white/40 to-white/10 font-ps-display text-lg tracking-widest blur-[4px] select-none">
                    MISTÉRIO
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      `;

content = content.replace(targetPaywall, lockedSection + targetPaywall);
fs.writeFileSync(file, content);
