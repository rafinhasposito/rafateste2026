const fs = require('fs');

// 1. REVERT
fs.copyFileSync('src/pages/AppleResultPrototype.tsx', 'src/pages/AppleResultPreview.tsx');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');
code = code.replace(/AppleResultPrototype/g, 'AppleResultPreview');

// 2. MOVE BOARDING PASS SAFELY
const bpStart = '{/* ======================= BOARDING PASS SOLAR (HIGH-END) ======================= */}';
const bpEndString = '</AnimatePresence>\n               </div>\n            </div>';
const sbp = code.indexOf(bpStart);
const ebp = code.indexOf(bpEndString, sbp);

if (sbp !== -1 && ebp !== -1) {
    const endIdx = ebp + bpEndString.length;
    const bpBlock = code.substring(sbp, endIdx);
    
    // Remove it from current position
    code = code.substring(0, sbp) + code.substring(endIdx);
    
    // Insert it after "destrava o seu objetivo"
    const insertTarget = 'A Casa {P.house} foi calculada sob medida para ser a chave exata que destrava o seu objetivo no novo ciclo.\n                  </p>';
    if (code.includes(insertTarget)) {
        code = code.replace(insertTarget, insertTarget + '\n\n' + bpBlock);
        console.log('Boarding Pass moved');
    }
} else {
    console.log('Could not find Boarding Pass block');
}

// 3. CLEAN UP BOARDING PASS (Remove Badges & Share)
code = code.replace(/<div className="flex flex-wrap items-center justify-center gap-4 mb-10">[\s\S]*?<\/div>\s*<\/div>/, ''); // Rough regex for badges, safer to use exact strings if possible, let's use exact strings.
const badgesRegex = /<div className="flex flex-wrap items-center justify-center gap-4 mb-10">[\s\S]*?JANELA: 24H NO DESTINO<\/span>\s*<\/div>\s*<\/div>/;
code = code.replace(badgesRegex, '');

const shareRegex = /{\/\* 4\. Botão Compartilhar \*\/}s*<button[\s\S]*?Compartilhar Ancoragem nos Stories\s*<\/button>/;
code = code.replace(shareRegex, '');

// Clean closed state preview
const oldPreviewRegex = /<div className="px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white\/5 hover:bg-white\/\[0\.02\] transition-colors">[\s\S]*?<\/div>\s*<\/div>/;
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
code = code.replace(oldPreviewRegex, newPreview);

// 4. FIX INTRO TEXT TO CASA 2
code = code.replace(/Isso significa que este será um ano em que pessoas, amizades, grupos, internet e novos contatos terão um papel muito maior na realização dos seus objetivos práticos\. O universo pede que você pare de caminhar sozinho\./,
  'Esta é a casa clássica da <strong>Prosperidade, do Valor Pessoal e da Estabilidade Material</strong>. Para o seu momento de vida (41 anos) com a força do seu Sol em Leão e a precisão do Ascendente em Virgem, este ciclo não se trata de trabalhar mais no esforço cego, mas sim de <span className="text-[#10b981] border-b border-[#10b981]/20 pb-1">sistematizar o seu talento para cobrar o valor justo e construir segurança sólida.</span>'
);

// 5. INJECT ACCORDIONS
const accordionsUI = `
      {/* ══════════════════════════════════════════════════
         9. O MAPA DO SEU ANO (LINHA DO TEMPO) - ACORDEÃO
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1000px] mx-auto px-6 py-20 border-t border-white/[0.02]">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <Calendar className="w-8 h-8 text-[#10b981]" />
            <h2 className="font-ps-display text-3xl font-bold tracking-tight">O Mapa do Seu Ano (Linha do Tempo)</h2>
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
         10. IMPACTO SECUNDÁRIO NAS OUTRAS ÁREAS DA VIDA - ACORDEÃO
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1000px] mx-auto px-6 py-10 border-t border-white/[0.02]">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <Activity className="w-8 h-8 text-[#10b981]" />
            <h2 className="font-ps-display text-3xl font-bold tracking-tight">Impacto Secundário nas Outras Áreas</h2>
          </div>
          <div className="space-y-4">
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                Trabalho & Carreira (88% Match)
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2">
                <p>É um bom momento para pedir aumento, selecionar clientes melhores e mudar a forma de gerir seu negócio. O trabalho torna-se mais estratégico e menos braçal.</p>
              </div>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                Identidade & Autoestima (80% Match)
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2">
                <p>Ter uma reserva financeira estruturada traz a calma mental necessária para você se posicionar com autoridade e liderar sua vida sem desespero.</p>
              </div>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                Rotina & Produtividade (72% Match)
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2">
                <p>A eficiência virgem entra em cena. O seu dia a dia passa a render mais porque você elimina tarefas não remuneradas e foca no que gera caixa.</p>
              </div>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                Amor & Relacionamentos (62% Match)
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
         11. PONTOS CEGOS & ALERTAS - ACORDEÃO
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1000px] mx-auto px-6 py-10 border-t border-white/[0.02]">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h2 className="font-ps-display text-3xl font-bold tracking-tight text-red-100">Alertas e Pontos Cegos do Ciclo</h2>
          </div>
          <div className="space-y-4">
            <details className="group bg-red-950/10 border border-red-900/20 rounded-2xl open:bg-red-950/20 transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-red-200 group-open:text-red-400">
                Medo de Escassez
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-red-900/20 mt-2">
                <p>Cuidado para o foco no acúmulo não virar pão-durismo ou medo de investir no próprio crescimento profissional.</p>
              </div>
            </details>
            <details className="group bg-red-950/10 border border-red-900/20 rounded-2xl open:bg-red-950/20 transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-red-200 group-open:text-red-400">
                Compras de Compensação
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-red-900/20 mt-2">
                <p>Cuidado com o oposto: gastar por impulso para compensar momentos de cansaço ou estresse da rotina.</p>
              </div>
            </details>
            <details className="group bg-red-950/10 border border-red-900/20 rounded-2xl open:bg-red-950/20 transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-red-200 group-open:text-red-400">
                Cobrança Desproporcional
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
         12. PROTOCOLO PRÁTICO DE ATIVAÇÃO - ACORDEÃO
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1000px] mx-auto px-6 py-10 border-t border-white/[0.02]">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <Clock className="w-8 h-8 text-[#10b981]" />
            <h2 className="font-ps-display text-3xl font-bold tracking-tight">Protocolo Prático de Ativação</h2>
          </div>
          <div className="space-y-4">
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors" open>
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                📍 O Ritual das Primeiras 24 Horas em Nova Iorque
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2 space-y-4">
                <p>No dia <strong>09/08/2027</strong>, no momento exato do seu Retorno Solar (<strong>05:30 UTC</strong>), dê um passo prático em direção à sua prosperidade:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Organize sua carteira física, limpe cartões e organize seus aplicativos financeiros no celular.</li>
                  <li>Abra uma nova conta de investimentos ou faça uma aplicação (mesmo de valor simbólico) para imantar a frequência de retenção de riqueza.</li>
                  <li>Evite compras fúteis, discussões financeiras ou parcelamentos impulsivos nas primeiras 24 horas.</li>
                </ol>
              </div>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                🗺️ Plano de Ação em 4 Passos
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2 space-y-2">
                <p><strong>Passo 1:</strong> Audite seus custos fixos e elimine 100% dos vazamentos silenciosos de dinheiro.</p>
                <p><strong>Passo 2:</strong> Aumente sua tabela de preços ou renegocie seu contrato principal logo na Fase 1.</p>
                <p><strong>Passo 3:</strong> Monte uma reserva de emergência equivalente a pelo menos 3 a 6 meses do seu custo de vida.</p>
                <p><strong>Passo 4:</strong> Reinvista parte do lucro em ferramentas que aumentem sua produtividade diária.</p>
              </div>
            </details>
            <details className="group bg-white/[0.02] border border-white/5 rounded-2xl open:bg-white/[0.04] transition-colors">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-white/90 group-open:text-[#10b981]">
                ✅ Sinais de Ativação no Cotidiano
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
                🔮 O Mantra do Seu Ano
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed border-t border-white/5 mt-2">
                <p className="font-serif italic text-xl text-[#10b981]">“Eu reconheço o valor do meu trabalho, organizo minhas contas e colho a estabilidade material que me pertence.”</p>
              </div>
            </details>
          </div>
        </Reveal>
      </section>

`;

const startIdx = code.indexOf('{/* ══════════════════════════════════════════════════\n         9. CRONOGRAMA');
const endIdx = code.indexOf('{/* ══════════════════════════════════════════════════\n         11. PLANO B');

if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + accordionsUI + '\n      ' + code.substring(endIdx);
    console.log('Accordions injected safely.');
}

const missingIcons = ['Activity', 'AlertTriangle', 'Clock'];
missingIcons.forEach(icon => {
    if (!code.includes(icon + ',')) {
        code = code.replace('import { MapPin,', 'import { MapPin, ' + icon + ',');
    }
});

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log('Done!');
