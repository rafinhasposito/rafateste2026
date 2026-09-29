const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Encontrar o ponto de corte correto.
// Em AppleResultPreview, o top approved acaba logo após o componente <section ref={casaRef} ...>
// O comentário é: {/* ======================= BOARDING PASS SOLAR (HIGH-END) ======================= */}
// Ou {/* ══════════════════════════════════════════════════ 3. PERSONALIZAÇÃO (ACORDEÃO)
const cutIndex = code.indexOf('{/* ══════════════════════════════════════════════════\n         3. PERSONALIZAÇÃO (ACORDEÃO)');

if (cutIndex === -1) {
    console.log("CRITICAL ERROR: Could not find cutIndex. Aborting.");
    process.exit(1);
}

const topCode = code.substring(0, cutIndex);

const the7Blocks = `
      {/* ══════════════════════════════════════════════════
         BLOCO 1: A ANCORAGEM DA CIDADE (Boarding Pass & Manchete)
         ══════════════════════════════════════════════════ */}
      <section className="relative pt-8 pb-20 max-w-[1000px] mx-auto px-6 z-10">
        <Reveal>
          <div className="bg-[#02160F]/80 border border-[#10b981]/30 rounded-[32px] overflow-hidden shadow-[0_30px_80px_rgba(16,185,129,0.15)] backdrop-blur-xl flex flex-col mb-16">
            <div className="bg-gradient-to-r from-[#10b981]/20 via-[#10b981]/5 to-transparent px-8 py-6 flex justify-between items-center border-b border-[#10b981]/20">
              <div className="flex items-center gap-3">
                <Plane className="w-5 h-5 text-[#10b981]" />
                <h3 className="font-bold text-white uppercase tracking-widest text-sm">Boarding Pass de Ancoragem</h3>
              </div>
              <span className="text-[#10b981] font-mono text-xs border border-[#10b981]/30 px-3 py-1 rounded-full">#CC59F4F6 • ATIVO</span>
            </div>
            
            <div className="p-8 md:p-10 flex flex-col gap-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <p className="text-white font-bold text-2xl md:text-3xl uppercase tracking-tight flex items-center justify-center md:justify-start gap-2">
                    <MapPin className="w-5 h-5 text-white/50 shrink-0"/> Surubim <span className="text-white/30 text-sm ml-1">(BR)</span>
                  </p>
                  <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">Origem Natal</p>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center px-4 w-1/3">
                  <Plane className="w-6 h-6 text-[#10b981] opacity-80" />
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent mt-3"></div>
                </div>
                <div className="flex-1 text-center md:text-right">
                  <p className="text-[#10b981] font-bold text-2xl md:text-3xl uppercase tracking-tight flex items-center justify-center md:justify-end gap-2">
                    Nova Iorque <MapPin className="w-6 h-6 shrink-0"/>
                  </p>
                  <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">Destino do Aniversário</p>
                </div>
              </div>

              <div>
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-4">Momento Exato da Ativação (Retorno Solar)</p>
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white text-lg font-medium">
                  <span className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10"><Calendar className="w-5 h-5 text-[#10b981]"/> 09 de Agosto, 2027</span>
                  <span className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10"><Clock className="w-5 h-5 text-[#10b981]"/> 05:30 (UTC)</span>
                  <span className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 font-mono text-[#10b981] text-sm"><Compass className="w-5 h-5 text-[#10b981]"/> [40.71° N, 74.01° W]</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-white/10 pt-8 gap-4">
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Compatibilidade da Escolha</p>
                <div className="flex items-center gap-3 bg-[#10b981]/20 px-6 py-3 rounded-full border border-[#10b981]/30">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></div>
                  <span className="text-[#10b981] font-bold tracking-widest text-lg">98% MATCH (Casa 2)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-black/60 px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[#10b981]/20">
              <div className="font-barcode text-5xl text-[#10b981]/70 scale-y-150 py-2">||| || ||| | || || |||</div>
              <span className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase text-center bg-black/40 px-4 py-2 rounded-lg border border-white/5">Protocolo Solar</span>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-ps-display font-bold mb-8">
              O foco é <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-emerald-300">Dinheiro</span>.
            </h2>
            <p className="font-serif italic text-2xl md:text-4xl text-[#10b981] leading-relaxed max-w-4xl mx-auto border-l-4 border-[#10b981] pl-6 text-left">
              "O destino exato para destravar o seu dinheiro, valorizar seu trabalho e construir estabilidade no seu novo ciclo."
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
         BLOCO 2: OS 3 PILARES DA CASA 2
         ══════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/10 bg-[#02160F]">
        <Reveal className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-full bg-[#10b981]/20 border border-[#10b981]/50 flex items-center justify-center text-[#10b981] font-bold">2</div>
            <h2 className="text-3xl md:text-4xl font-bold font-ps-display tracking-tight text-white">Os 3 Pilares da Casa 2</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors">
              <Activity className="w-8 h-8 text-[#10b981] mb-6" />
              <h4 className="text-xl font-bold text-white mb-4">01 | Prosperidade & Aumento de Ganhos</h4>
              <p className="text-white/70 leading-relaxed text-sm">Este é um ano focado em melhorar sua relação com o dinheiro, organizar suas contas, aumentar seus ganhos de trabalho e criar novas fontes de receita de forma tangível.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors">
              <Target className="w-8 h-8 text-[#10b981] mb-6" />
              <h4 className="text-xl font-bold text-white mb-4">02 | Valorização & Precificação do Trabalho</h4>
              <p className="text-white/70 leading-relaxed text-sm">O seu Sol em Leão exige reconhecimento, mas com o filtro de Virgem na Revolução Solar, a ordem é perder a timidez de cobrar caro e renegociar contratos pelo seu verdadeiro valor de mercado.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors">
              <Shield className="w-8 h-8 text-[#10b981] mb-6" />
              <h4 className="text-xl font-bold text-white mb-4">03 | Estabilidade Material & Organização</h4>
              <p className="text-white/70 leading-relaxed text-sm">Ganhar dinheiro só traz paz se for acompanhado de gestão consciente. Este ciclo facilita a eliminação de dívidas, o estancamento de ralos financeiros e a criação de um patrimônio seguro.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
         BLOCO 3: ANÁLISE DO PERFIL CRUZADO (DNA Pessoal)
         ══════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/10 bg-[#02160F]">
        <Reveal className="max-w-[1000px] mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 font-bold">3</div>
            <h2 className="text-3xl md:text-4xl font-bold font-ps-display tracking-tight text-white">Seu Perfil Cruzado</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                <Sun className="w-8 h-8 text-yellow-500" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-3">O Brilho do Sol em Leão na Casa 2</h4>
                <p className="text-white/70 leading-relaxed">Como leonino, seu valor pessoal está diretamente ligado à sua autonomia e ao orgulho do que você constrói. Na Casa 2, seu magnetismo deixa de ser apenas imagem e passa a se traduzir em <strong>valor monetário real</strong>. Você sente a necessidade e o direito de ser bem remunerado pela sua autoridade.</p>
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                <ArrowUpCircle className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-3">O Rigor do Ascendente em Virgem</h4>
                <p className="text-white/70 leading-relaxed">O Ascendente do seu ano em Virgem traz a mente analítica, o foco na eficiência e a disciplina diária. Ele impede os excessos leoninos e força você a olhar para planilhas, custos, processos e otimização da sua rotina de trabalho.</p>
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-full bg-[#10b981]/20 flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-[#10b981]" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-3">A Maturidade da Fase Adulta (41 Anos)</h4>
                <p className="text-white/70 leading-relaxed">Aos 41 anos, o objetivo financeiro não é a ostentação superficial, mas a <strong>construção de um porto seguro</strong>. O foco é criar previsibilidade de caixa, estabilidade para os próximos anos e tranquilidade mental para não depender de incertezas.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
         BLOCO 4: O CRONOGRAMA DO ANO (LINHA DO TEMPO) - Acordeão como pedido
         ══════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/10 bg-[#02160F]">
        <Reveal className="max-w-[1000px] mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-full bg-[#10b981]/20 border border-[#10b981]/50 flex items-center justify-center text-[#10b981] font-bold">4</div>
            <h2 className="text-3xl md:text-4xl font-bold font-ps-display tracking-tight text-white">Linha do Tempo em 3 Fases</h2>
          </div>
          
          <div className="space-y-4">
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                Fase 1 — Meses 1 a 3: Diagnóstico & Limpeza Financeira
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2">
                <p>Período excelente para listar todas as suas contas, renegociar tarifas ou juros, cortar ralos invisíveis de despesas e readequar sua tabela de preços. É a fase de arrumar a casa para receber o fluxo de capital.</p>
              </div>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                Fase 2 — Meses 4 a 8: Aumento de Receita & Pico de Atração
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2">
                <p>O momento mais forte do ano para prospectar novos clientes, apresentar propostas de alto valor, pedir reajustes e precificar melhor seus serviços. O mercado responde com prontidão à sua cobrança.</p>
              </div>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                Fase 3 — Meses 9 a 12: Consolidação & Investimento Seguro
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2">
                <p>Hora de aplicar o dinheiro acumulado ao longo do ano de forma segura. Você sente a satisfação de ter uma reserva financeira equilibrada e pode planejar compras de médio e longo prazo (bens duráveis, veículos ou imóveis).</p>
              </div>
            </details>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
         BLOCO 5: IMPACTO SECUNDÁRIO (Acordeão)
         ══════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/10 bg-[#02160F]">
        <Reveal className="max-w-[1000px] mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-full bg-[#10b981]/20 border border-[#10b981]/50 flex items-center justify-center text-[#10b981] font-bold">5</div>
            <h2 className="text-3xl md:text-4xl font-bold font-ps-display tracking-tight text-white">Impacto Secundário (Radar 360°)</h2>
          </div>
          
          <div className="space-y-4">
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                <div className="flex items-center gap-4">
                  <Briefcase className="w-5 h-5" /> Trabalho & Carreira <span className="ml-2 px-3 py-1 bg-[#10b981]/20 text-[#10b981] text-xs rounded-full">88% Match</span>
                </div>
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2">
                <p>É um bom momento para pedir aumento, selecionar clientes melhores e mudar a forma de gerir seu negócio. O trabalho torna-se mais estratégico e menos braçal.</p>
              </div>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                <div className="flex items-center gap-4">
                  <Crown className="w-5 h-5" /> Identidade & Autoestima <span className="ml-2 px-3 py-1 bg-[#10b981]/20 text-[#10b981] text-xs rounded-full">80% Match</span>
                </div>
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2">
                <p>Ter uma reserva financeira estruturada traz a calma mental necessária para você se posicionar com autoridade e liderar sua vida sem desespero.</p>
              </div>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                <div className="flex items-center gap-4">
                  <Activity className="w-5 h-5" /> Rotina & Produtividade <span className="ml-2 px-3 py-1 bg-white/10 text-white/60 text-xs rounded-full">72% Match</span>
                </div>
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2">
                <p>A eficiência virgem entra em cena. O seu dia a dia passa a render mais porque você elimina tarefas não remuneradas e foca no que gera caixa.</p>
              </div>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                <div className="flex items-center gap-4">
                  <Heart className="w-5 h-5" /> Amor & Relacionamentos <span className="ml-2 px-3 py-1 bg-white/10 text-white/60 text-xs rounded-full">62% Match</span>
                </div>
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2">
                <p>Não é um ano focado em paixões avassaladoras. No relacionamento, você buscará estabilidade material, conforto, projetos de patrimônio a dois e apoio mútuo.</p>
              </div>
            </details>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
         BLOCO 6: ALERTAS, RISCOS E PONTOS CEGOS (Acordeão)
         ══════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/10 bg-[#02160F]">
        <Reveal className="max-w-[1000px] mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-500 font-bold">6</div>
            <h2 className="text-3xl md:text-4xl font-bold font-ps-display tracking-tight text-red-400">Alertas e Pontos Cegos do Ciclo</h2>
          </div>
          
          <div className="space-y-4">
            <details className="group bg-red-950/10 border border-red-900/20 rounded-2xl open:bg-red-950/20 transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-red-200 group-open:text-red-400">
                <div className="flex items-center gap-3"><AlertTriangle className="w-5 h-5"/> Medo de Escassez</div>
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-red-900/20 mt-2">
                <p>Cuidado para o foco no acúmulo não virar pão-durismo ou medo de investir no próprio crescimento profissional.</p>
              </div>
            </details>
            <details className="group bg-red-950/10 border border-red-900/20 rounded-2xl open:bg-red-950/20 transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-red-200 group-open:text-red-400">
                <div className="flex items-center gap-3"><AlertTriangle className="w-5 h-5"/> Compras de Compensação</div>
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-red-900/20 mt-2">
                <p>Cuidado com o oposto: gastar por impulso para compensar momentos de cansaço ou estresse da rotina.</p>
              </div>
            </details>
            <details className="group bg-red-950/10 border border-red-900/20 rounded-2xl open:bg-red-950/20 transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-red-200 group-open:text-red-400">
                <div className="flex items-center gap-3"><AlertTriangle className="w-5 h-5"/> Cobrança Desproporcional</div>
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-red-900/20 mt-2">
                <p>Lembre-se de alinhar o aumento de preço com a qualidade rigorosa da sua entrega técnica.</p>
              </div>
            </details>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
         BLOCO 7: PROTOCOLO PRÁTICO DE ATIVAÇÃO (Acordeão)
         ══════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/10 bg-[#02160F] pb-40">
        <Reveal className="max-w-[1000px] mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-full bg-[#10b981]/20 border border-[#10b981]/50 flex items-center justify-center text-[#10b981] font-bold">7</div>
            <h2 className="text-3xl md:text-4xl font-bold font-ps-display tracking-tight text-white">Protocolo Prático de Ativação</h2>
          </div>
          
          <div className="space-y-4">
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors" open>
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                <div className="flex items-center gap-3"><MapPin className="w-5 h-5"/> O Ritual das Primeiras 24 Horas em Nova Iorque</div>
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2 space-y-4">
                <p>No dia <strong>09/08/2027</strong>, no momento exato do seu Retorno Solar (<strong>05:30 UTC</strong>), dê um passo prático em direção à sua prosperidade:</p>
                <ol className="list-decimal pl-5 space-y-3 mt-4 text-white/80">
                  <li>Organize sua carteira física, limpe cartões e organize seus aplicativos financeiros no celular.</li>
                  <li>Abra uma nova conta de investimentos ou faça uma aplicação (mesmo de valor simbólico) para imantar a frequência de retenção de riqueza.</li>
                  <li>Evite compras fúteis, discussões financeiras ou parcelamentos impulsivos nas primeiras 24 horas.</li>
                </ol>
              </div>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                <div className="flex items-center gap-3"><Clock className="w-5 h-5"/> Plano de Ação em 4 Passos</div>
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2 space-y-4">
                <p><strong>Passo 1:</strong> Audite seus custos fixos e elimine 100% dos vazamentos silenciosos de dinheiro.</p>
                <p><strong>Passo 2:</strong> Aumente sua tabela de preços ou renegocie seu contrato principal logo na Fase 1.</p>
                <p><strong>Passo 3:</strong> Monte uma reserva de emergência equivalente a pelo menos 3 a 6 meses do seu custo de vida.</p>
                <p><strong>Passo 4:</strong> Reinvista parte do lucro em ferramentas que aumentem sua produtividade diária.</p>
              </div>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                <div className="flex items-center gap-3"><Eye className="w-5 h-5"/> Sinais de Ativação no Cotidiano</div>
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2 space-y-2">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Você começa a se sentir seguro e confiante ao falar de dinheiro e passar orçamentos.</li>
                  <li>Surgem oportunidades de trabalhos extras, bônus ou clientes dispostos a pagar seu valor cheio.</li>
                  <li>Sua planilha financeira fecha o mês no verde de forma constante e previsível.</li>
                </ul>
              </div>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                <div className="flex items-center gap-3"><Sparkles className="w-5 h-5"/> O Mantra do Seu Ano</div>
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2">
                <p className="font-serif italic text-2xl text-[#10b981] leading-relaxed">“Eu reconheço o valor do meu trabalho, organizo minhas contas e colho a estabilidade material que me pertence.”</p>
              </div>
            </details>
          </div>
        </Reveal>
      </section>

      <style dangerouslySetInnerHTML={{__html: \`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}\`}} />
    </div>
  );
}
`;

const newCode = topCode + the7Blocks;
fs.writeFileSync('src/pages/AppleResultPreview.tsx', newCode);
console.log("Written exactly the 7 blocks requested.");
