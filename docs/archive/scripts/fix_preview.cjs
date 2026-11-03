const fs = require('fs');
let file = 'src/pages/AppleResultPreview.tsx';
let code = fs.readFileSync(file, 'utf8');

const insertTarget = 'A Casa {P.house} foi calculada sob medida para ser a chave exata que destrava o seu objetivo no novo ciclo.\n                  </p>';
const bpStart = '{/* ======================= BOARDING PASS SOLAR (HIGH-END) ======================= */}';
const bpEndString = '                   )}\n                 </AnimatePresence>\n               </div>\n            </div>';
if (code.includes(insertTarget) && code.includes(bpStart)) {
    const sbp = code.indexOf(bpStart);
    const ebp = code.indexOf(bpEndString, sbp) + bpEndString.length;
    const bpBlock = code.substring(sbp, ebp);
    code = code.substring(0, sbp) + code.substring(ebp);
    code = code.replace(insertTarget, insertTarget + '\n\n' + bpBlock);
}

const oldPreview = `<div className="px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                               <div className="flex items-center gap-3">
                                  <MapPin className="w-4 h-4 text-white/30" />
                                  <span className="text-white/60 text-sm font-medium">{P.origin}</span>
                                  <Plane className="w-4 h-4 text-[#10b981]/50" />
                                  <span className="text-[#10b981] font-bold text-sm uppercase">{P.city}</span>
                               </div>
                               <div className="flex flex-wrap items-center gap-3 text-sm">
                                  <span className="flex items-center gap-2 text-white/70">
                                    <Calendar className="w-4 h-4 text-[#10b981]/70" />
                                    09 Ago, 2027
                                  </span>
                                  <span className="text-white/20 hidden md:inline">|</span>
                                  <span className="text-[#10b981] font-bold flex items-center gap-2">
                                    <Star className="w-4 h-4" />
                                    {P.match}% MATCH
                                  </span>
                               </div>
                             </div>`;
const newPreview = `<div className="px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                               <div className="flex flex-wrap items-center gap-3 md:gap-6">
                                  <span className="text-white/90 font-medium text-sm flex items-center gap-2">
                                    <User className="w-4 h-4 text-white/40" />
                                    {P.firstName}
                                  </span>
                                  <span className="text-white/20 hidden md:inline">|</span>
                                  <span className="text-white/60 text-sm flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-white/40" />
                                    09/08/1985
                                  </span>
                                  <span className="text-white/20 hidden md:inline">|</span>
                                  <span className="text-white/80 text-sm flex items-center gap-2 font-medium">
                                    <Sun className="w-4 h-4 text-yellow-400" />
                                    Leão
                                  </span>
                               </div>
                               <div className="flex items-center gap-3 text-sm">
                                  <span className="text-[#10b981] font-bold flex items-center gap-2 bg-[#10b981]/10 px-3 py-1 rounded-full border border-[#10b981]/20">
                                    <Star className="w-4 h-4" />
                                    {P.match}% MATCH
                                  </span>
                               </div>
                             </div>`;
code = code.replace(oldPreview, newPreview);
if (!code.includes('User,')) code = code.replace('import { MapPin,', 'import { MapPin, User,');

const badgesBlock = `<div className="flex flex-wrap items-center justify-center gap-4 mb-10">
             <div className="flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                <span className="text-[#10b981] text-[10px] uppercase font-bold tracking-widest">STATUS: REGISTRADO</span>
             </div>
             <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <Clock className="w-3 h-3 text-white/60" />
                <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">JANELA: 24H NO DESTINO</span>
             </div>
          </div>`;
code = code.replace(badgesBlock, '');

const shareBtnBlock = `{/* 4. Botão Compartilhar */}
          <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors px-6 py-3 rounded-2xl text-white/80 font-medium text-sm group">
            <Camera className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
            Compartilhar Ancoragem nos Stories
          </button>`;
code = code.replace(shareBtnBlock, '');


const unlockedAppleGradeUI = `
      {/* ══════════════════════════════════════════════════
          A REVELAÇÃO (Intro)
          ══════════════════════════════════════════════════ */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center border-t border-white/10">
        <Reveal>
          <p className="text-2xl md:text-3xl font-light text-white/80 leading-relaxed">
            <strong className="text-white">Rafael</strong>, ao desembarcar no seu destino de aniversário nas coordenadas <span className="font-mono text-[#10b981]">[40.71° N, 74.01° W]</span>, a rotação geográfica do seu Retorno Solar fixa a sua energia anual na <strong className="text-[#10b981]">Casa 2</strong>.
          </p>
          <div className="w-px h-24 bg-gradient-to-b from-[#10b981]/50 to-transparent mx-auto my-12" />
          <p className="text-xl text-white/60 font-light leading-relaxed">
            Esta é a casa clássica da <strong className="text-white">Prosperidade, do Valor Pessoal e da Estabilidade Material</strong>. Para o seu momento de vida (41 anos) com a força do seu Sol em Leão e a precisão do Ascendente em Virgem, este ciclo não se trata de trabalhar mais no esforço cego, mas sim de <span className="text-white border-b border-white/20 pb-1">sistematizar o seu talento para cobrar o valor justo e construir segurança sólida.</span>
          </p>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
          O BENTO GRID DE COMPATIBILIDADE (The Match Matrix)
          ══════════════════════════════════════════════════ */}
      <section className="py-24 max-w-5xl mx-auto px-6 border-t border-white/10">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">The Match Matrix.</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Hero Card */}
          <Reveal className="md:col-span-12 bg-[#02160F]/80 rounded-[32px] p-8 md:p-12 border border-[#10b981]/30 shadow-[0_30px_80px_rgba(16,185,129,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#10b981]/10 via-[#10b981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
              <div>
                <span className="text-[#10b981]/80 font-bold uppercase tracking-widest text-xs mb-2 block">Prioridade Absoluta</span>
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">Dinheiro & Recursos</h3>
                <p className="text-white/50 max-w-md">O alinhamento perfeito para multiplicar o seu patrimônio e estruturar a sua receita.</p>
              </div>
              <div className="text-6xl md:text-8xl font-ps-display font-bold text-[#10b981]">
                98%
              </div>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full mt-8 overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: '98%' }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-[#10b981] rounded-full" />
            </div>
          </Reveal>

          {/* Secondary Cards */}
          <Reveal delay={0.1} className="md:col-span-7 bg-white/[0.02] rounded-[32px] p-8 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-bold text-white">Trabalho & Carreira</h4>
              <span className="text-2xl font-ps-display font-bold text-white/80">88%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-6">
              <motion.div initial={{ width: 0 }} whileInView={{ width: '88%' }} transition={{ duration: 1.5, delay: 0.6 }} className="h-full bg-white/40 rounded-full" />
            </div>
            <p className="text-white/50 text-sm">O seu trabalho ganha peso pelo retorno financeiro direto e posicionamento premium.</p>
          </Reveal>

          <Reveal delay={0.2} className="md:col-span-5 bg-white/[0.02] rounded-[32px] p-8 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-bold text-white">Identidade</h4>
              <span className="text-2xl font-ps-display font-bold text-white/60">80%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-6">
              <motion.div initial={{ width: 0 }} whileInView={{ width: '80%' }} transition={{ duration: 1.5, delay: 0.7 }} className="h-full bg-white/30 rounded-full" />
            </div>
            <p className="text-white/50 text-sm">Previsibilidade financeira devolve a sua postura de liderança.</p>
          </Reveal>
          
          <Reveal delay={0.3} className="md:col-span-12 flex flex-wrap gap-4 md:gap-8 justify-center mt-4">
             <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white/20"/><span className="text-white/40 text-sm">Rotina (72%)</span></div>
             <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white/20"/><span className="text-white/40 text-sm">Networking (65%)</span></div>
             <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white/20"/><span className="text-white/40 text-sm">Amor (62%)</span></div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          OS 3 PILARES (Pro Design Showcase)
          ══════════════════════════════════════════════════ */}
      <section className="py-32 max-w-[1400px] mx-auto px-6 border-t border-white/10">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            <div className="flex flex-col items-start pr-8">
              <div className="w-12 h-12 mb-8 text-[#10b981]">
                <Activity strokeWidth={1} className="w-full h-full" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-widest text-xs">01. Prosperidade</h4>
              <p className="text-white/50 text-lg leading-relaxed font-light">
                Não apenas ganhar dinheiro. Multiplicar o resultado do seu trabalho. O ciclo facilita a criação de novas fontes de renda.
              </p>
            </div>
            <div className="flex flex-col items-start pr-8">
              <div className="w-12 h-12 mb-8 text-[#10b981]">
                <Target strokeWidth={1} className="w-full h-full" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-widest text-xs">02. Valorização</h4>
              <p className="text-white/50 text-lg leading-relaxed font-light">
                Cobrar pelo seu verdadeiro impacto. Sem hesitar, sem pedir licença. Renegocie seus preços e elimine descontos.
              </p>
            </div>
            <div className="flex flex-col items-start pr-8">
              <div className="w-12 h-12 mb-8 text-[#10b981]">
                <Shield strokeWidth={1} className="w-full h-full" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-widest text-xs">03. Estabilidade</h4>
              <p className="text-white/50 text-lg leading-relaxed font-light">
                A tranquilidade absoluta de um patrimônio construído com precisão. Estanque vazamentos e crie reservas seguras.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
          A LINHA DO TEMPO (Interactive Stage Slider)
          ══════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">O Cronograma do Ano.</h2>
            <p className="text-white/50 font-light text-lg">As três fases da sua evolução financeira.</p>
          </Reveal>
          
          <div className="relative border-l border-white/10 ml-4 md:ml-0 md:border-l-0 md:border-t md:flex md:pt-12">
             <Reveal delay={0.1} className="md:flex-1 relative pl-8 pb-12 md:pl-0 md:pb-0 md:pr-8">
                <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-[#10b981] md:top-[-49px] md:left-0"></div>
                <span className="text-[#10b981] font-mono text-xs uppercase tracking-widest block mb-4">Mês 1 a 3</span>
                <h4 className="text-2xl font-bold text-white mb-3">Diagnóstico.</h4>
                <p className="text-white/50 text-sm leading-relaxed">Corte ralos invisíveis. Reajuste tabelas. Prepare a estrutura da casa para receber o fluxo financeiro maior.</p>
             </Reveal>

             <Reveal delay={0.2} className="md:flex-1 relative pl-8 pb-12 md:pl-0 md:pb-0 md:pr-8">
                <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-white/20 md:top-[-49px] md:left-0"></div>
                <span className="text-white/40 font-mono text-xs uppercase tracking-widest block mb-4">Mês 4 a 8</span>
                <h4 className="text-2xl font-bold text-white mb-3">Aceleração.</h4>
                <p className="text-white/50 text-sm leading-relaxed">Pico de atração. Apresente propostas de alto valor. Colha contratos maiores e prospecte clientes de elite.</p>
             </Reveal>

             <Reveal delay={0.3} className="md:flex-1 relative pl-8 md:pl-0 md:pb-0">
                <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-white/20 md:top-[-49px] md:left-0"></div>
                <span className="text-white/40 font-mono text-xs uppercase tracking-widest block mb-4">Mês 9 a 12</span>
                <h4 className="text-2xl font-bold text-white mb-3">Consolidação.</h4>
                <p className="text-white/50 text-sm leading-relaxed">Aplique o caixa acumulado. Crie reservas blindadas. Adquira bens duráveis com total tranquilidade.</p>
             </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          O PROTOCOLO DE 24 HORAS (The Activity Ring & Alertas)
          ══════════════════════════════════════════════════ */}
      <section className="py-32 max-w-5xl mx-auto px-6 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <Reveal>
              <div className="relative w-full max-w-[300px] aspect-square mx-auto flex items-center justify-center">
                 <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset="70" strokeLinecap="round" className="animate-[spin_4s_ease-out]" />
                 </svg>
                 <div className="absolute flex flex-col items-center justify-center text-center">
                   <Clock className="w-8 h-8 text-[#10b981] mb-2" />
                   <span className="text-white font-bold text-xl">24 Horas</span>
                   <span className="text-white/40 text-xs uppercase tracking-widest">Protocolo</span>
                 </div>
              </div>
           </Reveal>
           <Reveal delay={0.2} className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Protocolo de Ativação.</h2>
              <p className="text-white/50 font-light text-lg mb-8">As ações exatas no momento do Retorno Solar em NYC.</p>
              
              <div className="space-y-6">
                 <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                       <span className="text-[#10b981] text-xs font-bold">00h</span>
                    </div>
                    <div>
                       <h5 className="text-white font-bold mb-1">05:30 UTC — Limpeza</h5>
                       <p className="text-white/50 text-sm">Organize sua carteira física e limpe pendências digitais.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                       <span className="text-[#10b981] text-xs font-bold">08h</span>
                    </div>
                    <div>
                       <h5 className="text-white font-bold mb-1">Ancoragem Financeira</h5>
                       <p className="text-white/50 text-sm">Abra uma nova aplicação ou conta de investimento simbólica.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                       <span className="text-red-500 text-xs font-bold">24h</span>
                    </div>
                    <div>
                       <h5 className="text-white font-bold mb-1">Bloqueio de Fuga</h5>
                       <p className="text-white/50 text-sm">Cerre o dia sem compras impulsivas. A egrégora está travada.</p>
                    </div>
                 </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl mt-8">
                <h5 className="text-red-400 font-bold mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Ponto Cego (Alerta)</h5>
                <p className="text-white/60 text-sm">Cuidado com o <strong>Medo de Escassez</strong> e <strong>Compras de Compensação</strong>. O dinheiro é ferramenta de segurança, não a métrica do seu valor.</p>
              </div>
           </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MANTRA DO ANO
          ══════════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-24 md:py-40 border-t border-white/[0.02] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.05)_0%,transparent_60%)] pointer-events-none" />
        <Reveal className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[#10b981] font-bold tracking-[0.3em] uppercase text-sm mb-10 block">O Mantra do Seu Ano</span>
          <p className="font-serif italic text-4xl md:text-5xl text-white/90 leading-[1.4] md:leading-[1.4] drop-shadow-2xl">
            "Eu reconheço o valor do meu trabalho, organizo minhas finanças e colho a estabilidade material que me pertence."
          </p>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
          O RODAPÉ DE AÇÃO (The Bottom Bar)
          ══════════════════════════════════════════════════ */}
      <section className="pb-32 px-6 border-t border-white/[0.02] pt-24">
        <Reveal>
           <div className="max-w-4xl mx-auto bg-white/[0.02] border border-white/10 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left transition-all hover:bg-white/[0.04] hover:border-white/20">
              <div>
                 <h4 className="text-xl font-bold text-white mb-2">Não pode viajar para Nova Iorque este ano?</h4>
                 <p className="text-white/50 text-sm">O sistema recalcula a cidade mais próxima do seu radar com até 92% de eficiência para a Casa 2.</p>
              </div>
              <button className="whitespace-nowrap px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-sm uppercase tracking-widest transition-colors flex items-center gap-2">
                 <RefreshCw className="w-4 h-4" />
                 Recalcular Rota
              </button>
           </div>
        </Reveal>
      </section>
`;

const startIdx = code.indexOf('{/* ══════════════════════════════════════════════════\n         5. A REVELAÇÃO');
const endIdx = code.indexOf('{/* ══════════════════════════════════════════════════\n         12. PAYWALL & FOOTER');

if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + unlockedAppleGradeUI + '\n      ' + code.substring(endIdx);
    
    // Add missing icons
    const missingIcons = ['User', 'Sun', 'Star', 'Target', 'Activity', 'AlertTriangle', 'RefreshCw'];
    missingIcons.forEach(icon => {
        if (!code.includes(icon + ',')) {
            code = code.replace('import { MapPin,', 'import { MapPin, ' + icon + ',');
        }
    });

    fs.writeFileSync(file, code);
    console.log('Restoration and injection complete!');
} else {
    console.log('Could not find split points.');
}
