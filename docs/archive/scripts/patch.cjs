const fs = require('fs');
const file = 'src/pages/Index.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `            {/* ── Fundo Imersivo em Cor (Sem Vídeo, Sem Sombras Laterais) ── */}
            {(() => {
              const theme = mode ? modeThemes[mode] : null;
              if (!theme) return null;
              return (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen">
                  {/* Luz principal superior uniforme — OPACIDADE ALTA e SCREEN para a cor não virar marrom no fundo preto */}
                  <div className="absolute top-0 left-0 w-full h-[60vh] transition-colors duration-1000"
                    style={{ background: \`linear-gradient(to bottom, rgba(\${theme.rgb}, 0.35) 0%, rgba(\${theme.rgb}, 0.1) 60%, transparent 100%)\` }} />
                  
                  {/* Aura vibrante central */}
                  <div className="absolute top-1/4 left-0 w-full h-[70vh] opacity-[0.35] blur-[140px] transition-colors duration-1000"
                    style={{ backgroundColor: \`rgb(\${theme.rgb})\` }} />
                </div>
              );
            })()}

            <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10 pt-6 md:pt-10">

              {/* ── Voltar ── */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                className="w-full flex justify-start mb-8">
                <button onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-white/60 hover:text-white text-[10px] tracking-[0.2em] uppercase font-semibold">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </button>
              </motion.div>

              {/* ── Dados Natais — Card com cor do Tempo ── */}
              {isNatalProfileComplete(profile) && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
                  className="w-full flex flex-wrap items-center justify-between gap-4 px-6 py-4 rounded-2xl border mb-10 backdrop-blur-md"
                  style={{
                    borderColor: activeTheme ? \`rgba(\${activeTheme.rgb}, 0.15)\` : 'rgba(255,255,255,0.08)',
                    background: activeTheme ? \`color-mix(in srgb, rgb(\${activeTheme.rgb}) 6%, rgba(10,10,12,0.7))\` : 'rgba(10,10,12,0.7)'
                  }}>
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/30 mb-0.5">Passageiro</p>
                      <p className="font-ps-display text-white text-base tracking-wide">{profile?.full_name}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/30 mb-0.5">Cidade Natal</p>
                      <p className="font-ps-ui text-white/70 text-sm">{profile?.birth_city}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/30 mb-0.5">Data / Hora</p>
                      <p className="font-ps-ui text-white/70 text-sm">{profile?.birth_date?.split('-').reverse().join('/')} às {profile?.birth_time?.slice(0,5)}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate(\`/perfil?returnTo=\${encodeURIComponent(\`/?mode=\${mode}&path=\${searchPath}\`)}\`)}
                    className="text-[9px] uppercase tracking-[0.2em] font-semibold underline underline-offset-4 transition-colors"
                    style={{ color: activeTheme ? \`rgba(\${activeTheme.rgb}, 0.5)\` : 'rgba(255,255,255,0.3)' }}>
                    Editar
                  </button>
                </motion.div>
              )}

              {/* ── ANO HERO — Centralizado e gigante ── */}
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col items-center mb-6">
                <p className="text-[9px] uppercase tracking-[0.4em] font-bold mb-2"
                  style={{ color: activeTheme ? \`rgba(\${activeTheme.rgb}, 0.7)\` : '#C9A227' }}>
                  Ano do Destino
                </p>
                <div className="relative">
                  <input
                    type="number"
                    className="text-center text-8xl md:text-9xl font-ps-display bg-transparent border-none outline-none font-bold tracking-tighter leading-none"
                    style={{
                      color: activeTheme ? \`rgb(\${activeTheme.rgb})\` : '#C9A227',
                      textShadow: activeTheme ? \`0 0 60px rgba(\${activeTheme.rgb}, 0.4), 0 0 120px rgba(\${activeTheme.rgb}, 0.15)\` : 'none'
                    }}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    disabled={mode === "presente"}
                  />
                  {mode === "presente" && <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-widest text-white/20">ciclo atual</span>}
                </div>
              </motion.div>

              {/* ── Pergunta — Centralizada ── */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full text-center mb-10 max-w-2xl">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-ps-display text-white leading-tight tracking-tight">
                  {searchPath === 'cidade' ? 'Onde você vai passar o seu aniversário?'
                    : searchPath === 'casa' ? 'Qual energia você quer ativar?'
                    : 'O que você quer destravar no seu ano?'}
                </h1>
              </motion.div>`;

const replacement = `            {/* ── Fundo Imersivo Apple Spatial ── */}
            {(() => {
              const theme = mode ? modeThemes[mode] : null;
              if (!theme) return null;
              return (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center">
                  {/* Orbe de luz principal: Gigante, super suave (blur-[150px]), centralizado.
                      O mix-blend-screen garante que a cor some com o preto e fique pura/neon. */}
                  <div className="absolute top-[-5%] w-[120vw] max-w-[1400px] h-[70vh] opacity-[0.25] blur-[150px] transition-colors duration-1000 rounded-full mix-blend-screen"
                    style={{ backgroundColor: \`rgb(\${theme.rgb})\` }} />
                </div>
              );
            })()}

            <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10 pt-6 md:pt-10">

              {/* ── Nav Row — Voltar ── */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                className="w-full flex justify-start mb-8 md:mb-12">
                <button onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-xl transition-all duration-300 text-white/70 hover:text-white text-[10px] tracking-[0.2em] uppercase font-semibold">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </button>
              </motion.div>

              {/* ── Dados Natais — Apple Glass Card ── */}
              {isNatalProfileComplete(profile) && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full max-w-3xl flex flex-wrap items-center justify-between gap-6 px-8 py-5 rounded-3xl border mb-16 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                  style={{
                    borderColor: activeTheme ? \`rgba(\${activeTheme.rgb}, 0.15)\` : 'rgba(255,255,255,0.08)',
                    background: activeTheme ? \`color-mix(in srgb, rgb(\${activeTheme.rgb}) 4%, rgba(10,10,12,0.6))\` : 'rgba(10,10,12,0.6)'
                  }}>
                  <div className="flex flex-wrap gap-10">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/40">Passageiro</span>
                      <span className="font-ps-display text-white/90 text-lg tracking-wide">{profile?.full_name}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/40">Origem</span>
                      <span className="font-ps-ui text-white/70 text-sm">{profile?.birth_city}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/40">Momento</span>
                      <span className="font-ps-ui text-white/70 text-sm">{profile?.birth_date?.split('-').reverse().join('/')} às {profile?.birth_time?.slice(0,5)}</span>
                    </div>
                  </div>
                  <button onClick={() => navigate(\`/perfil?returnTo=\${encodeURIComponent(\`/?mode=\${mode}&path=\${searchPath}\`)}\`)}
                    className="text-[10px] uppercase tracking-[0.2em] font-bold hover:scale-105 transition-transform"
                    style={{ color: activeTheme ? \`rgb(\${activeTheme.rgb})\` : '#fff' }}>
                    Editar
                  </button>
                </motion.div>
              )}

              {/* ── ANO HERO — Design Apple Vision Pro ── */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                className="flex flex-col items-center mb-12 relative w-full">
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold mb-4 opacity-80"
                  style={{ color: activeTheme ? \`rgb(\${activeTheme.rgb})\` : '#C9A227' }}>
                  Ano do Destino
                </span>
                <div className="relative flex justify-center w-full">
                  <input
                    type="number"
                    className="text-center text-8xl md:text-[140px] font-ps-display bg-transparent border-none outline-none font-bold tracking-tighter leading-none w-full"
                    style={{
                      color: activeTheme ? \`rgb(\${activeTheme.rgb})\` : '#C9A227',
                      textShadow: activeTheme ? \`0 0 80px rgba(\${activeTheme.rgb}, 0.5)\` : 'none',
                      caretColor: 'transparent'
                    }}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    disabled={mode === "presente"}
                  />
                  {mode === "presente" && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                      <span className="text-[9px] uppercase tracking-widest text-white/60">Ciclo Atual Fixado</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* ── Pergunta ── */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="w-full text-center mb-12 max-w-3xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-ps-display text-white leading-tight tracking-tight drop-shadow-2xl">
                  {searchPath === 'cidade' ? 'Onde você vai passar o seu aniversário?'
                    : searchPath === 'casa' ? 'Qual energia você quer ativar?'
                    : 'O que você quer destravar no seu ano?'}
                </h1>
              </motion.div>`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
console.log('patched');
