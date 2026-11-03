const fs = require('fs');
let file = 'src/pages/AppleResultPreview.tsx';
let code = fs.readFileSync(file, 'utf8');

const unlockedAppleGradeUI = `
      {/* ══════════════════════════════════════════════════
          MANCHETE DE IMPACTO
          ══════════════════════════════════════════════════ */}
      <section className="py-24 max-w-5xl mx-auto px-6 text-center border-t border-white/10 mt-12">
        <Reveal>
          <div className="w-px h-24 bg-gradient-to-b from-[#10b981]/50 to-transparent mx-auto mb-12" />
          <p className="font-serif italic text-3xl md:text-5xl text-white/90 leading-relaxed md:leading-[1.4] drop-shadow-2xl">
            "O destino exato para destravar o seu dinheiro, valorizar seu trabalho e construir estabilidade no seu novo ciclo."
          </p>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
          PERFIL CRUZADO (DNA ASTROLÓGICO)
          ══════════════════════════════════════════════════ */}
      <section className="py-24 max-w-[1200px] mx-auto px-6 border-t border-white/10">
        <Reveal>
          <h2 className="text-sm font-bold tracking-widest uppercase text-[#10b981] mb-12 text-center">Seu Perfil Cruzado</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Reveal delay={0.1} className="bg-white/[0.02] border border-white/5 p-10 rounded-[32px] hover:bg-white/[0.04] transition-colors">
            <Sun className="w-10 h-10 text-yellow-500 mb-6" />
            <h4 className="text-xl font-bold text-white mb-4">O Brilho do Sol em Leão</h4>
            <p className="text-white/60 text-base leading-relaxed">
              Como leonino, seu valor pessoal está diretamente ligado à sua autonomia e ao orgulho do que você constrói. Na Casa 2, seu magnetismo deixa de ser apenas imagem e passa a se traduzir em <strong>valor monetário real</strong>. Você sente a necessidade e o direito de ser bem remunerado pela sua autoridade.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="bg-white/[0.02] border border-white/5 p-10 rounded-[32px] hover:bg-white/[0.04] transition-colors">
            <Zap className="w-10 h-10 text-white/80 mb-6" />
            <h4 className="text-xl font-bold text-white mb-4">O Rigor do Ascendente em Virgem</h4>
            <p className="text-white/60 text-base leading-relaxed">
              O Ascendente do seu ano em Virgem traz a mente analítica, o foco na eficiência e a disciplina diária. Ele impede os excessos leoninos e força você a olhar para planilhas, custos, processos e otimização da sua rotina de trabalho.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="bg-white/[0.02] border border-white/5 p-10 rounded-[32px] hover:bg-white/[0.04] transition-colors">
            <User className="w-10 h-10 text-[#10b981] mb-6" />
            <h4 className="text-xl font-bold text-white mb-4">A Maturidade (41 Anos)</h4>
            <p className="text-white/60 text-base leading-relaxed">
              Aos 41 anos, o objetivo financeiro não é a ostentação superficial, mas a <strong>construção de um porto seguro</strong>. O foco é criar previsibilidade de caixa, estabilidade para os próximos anos e tranquilidade mental para não depender de incertezas.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          DIAGNÓSTICO DO FOCO (O QUE ESPERAR)
          ══════════════════════════════════════════════════ */}
      <section className="py-24 max-w-[1200px] mx-auto px-6 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Diagnóstico.</h2>
              <p className="text-[#10b981] text-2xl font-light mb-8">98% Match — Dinheiro e Recursos</p>
              <p className="text-white/50 text-lg leading-relaxed">
                A Casa 2 é o regente natural dos bens, do faturamento e da segurança material. Na tradição astrológica, ativações fortes na Casa 2 marcam o ano da <strong>colheita do trabalho individual</strong>.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Reveal delay={0.1}>
              <h5 className="text-white font-bold mb-3 border-b border-white/10 pb-2">1. Como vai ser o seu ano?</h5>
              <p className="text-white/60 text-sm leading-relaxed">Seu ano gira em torno de dinheiro, valor pessoal, segurança material, produtividade e consolidação de bens. O trabalho ganha peso pelo retorno financeiro direto que ele traz.</p>
            </Reveal>
            <Reveal delay={0.2}>
              <h5 className="text-white font-bold mb-3 border-b border-white/10 pb-2">2. O que você ganha com isso?</h5>
              <p className="text-white/60 text-sm leading-relaxed">Mais clareza para gerir o que ganha, capacidade de planejar compras importantes de forma segura, poder de negociação e uma rotina profissional muito mais rentável.</p>
            </Reveal>
            <Reveal delay={0.3}>
              <h5 className="text-white font-bold mb-3 border-b border-white/10 pb-2">3. Como essa energia aparece?</h5>
              <p className="text-white/60 text-sm leading-relaxed">Você sentirá necessidade de rever seus preços, buscar novas formas de rentabilizar suas habilidades, organizar seu orçamento e focar em projetos práticos imediatos.</p>
            </Reveal>
            <Reveal delay={0.4}>
              <h5 className="text-white font-bold mb-3 border-b border-white/10 pb-2">4. De onde vem o dinheiro?</h5>
              <p className="text-white/60 text-sm leading-relaxed">Das suas habilidades diretas, aumento da sua tabela de preços, encerramento de descontos e trabalho focado. Vem do seu valor reconhecido e bem cobrado.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          OS 3 PILARES (Pro Design Showcase)
          ══════════════════════════════════════════════════ */}
      <section className="py-32 max-w-[1400px] mx-auto px-6 border-t border-white/10">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight mb-16 text-center">Os 3 Pilares da Casa 2.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            <div className="flex flex-col items-start bg-[#02160F]/30 p-10 rounded-[32px] border border-[#10b981]/10">
              <div className="w-14 h-14 mb-8 text-[#10b981] bg-[#10b981]/10 rounded-2xl flex items-center justify-center">
                <Activity strokeWidth={1.5} className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">01. Prosperidade e Ganhos</h4>
              <p className="text-white/60 text-base leading-relaxed font-light">
                Este é um ano focado em melhorar sua relação com o dinheiro, organizar suas contas, aumentar seus ganhos de trabalho e criar novas fontes de receita de forma tangível.
              </p>
            </div>
            <div className="flex flex-col items-start bg-[#02160F]/30 p-10 rounded-[32px] border border-[#10b981]/10">
              <div className="w-14 h-14 mb-8 text-[#10b981] bg-[#10b981]/10 rounded-2xl flex items-center justify-center">
                <Target strokeWidth={1.5} className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">02. Valorização e Preço</h4>
              <p className="text-white/60 text-base leading-relaxed font-light">
                O seu Sol em Leão exige reconhecimento, mas com o filtro de Virgem na Revolução Solar, a ordem é perder a timidez de cobrar caro e renegociar contratos pelo seu verdadeiro valor de mercado.
              </p>
            </div>
            <div className="flex flex-col items-start bg-[#02160F]/30 p-10 rounded-[32px] border border-[#10b981]/10">
              <div className="w-14 h-14 mb-8 text-[#10b981] bg-[#10b981]/10 rounded-2xl flex items-center justify-center">
                <Shield strokeWidth={1.5} className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">03. Estabilidade e Segurança</h4>
              <p className="text-white/60 text-base leading-relaxed font-light">
                Ganhar dinheiro só traz paz se for acompanhado de gestão consciente. Este ciclo facilita a eliminação de dívidas, o estancamento de ralos financeiros e a criação de um patrimônio seguro.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
          O BENTO GRID DE IMPACTO SECUNDÁRIO
          ══════════════════════════════════════════════════ */}
      <section className="py-24 max-w-6xl mx-auto px-6 border-t border-white/10">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-center">Impacto Secundário.</h2>
          <p className="text-white/50 text-center mb-16 max-w-2xl mx-auto">Como a ancoragem do seu foco principal (Dinheiro) impulsiona colateralmente outras áreas da sua vida.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          <Reveal delay={0.1} className="lg:col-span-7 bg-[#111] rounded-[32px] p-8 md:p-12 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-2xl font-bold text-white">Trabalho & Carreira</h4>
              <span className="text-3xl font-ps-display font-bold text-white/80">88%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-8">
              <motion.div initial={{ width: 0 }} whileInView={{ width: '88%' }} transition={{ duration: 1.5, delay: 0.2 }} className="h-full bg-white/40 rounded-full" />
            </div>
            <p className="text-white/60 text-base leading-relaxed">
              É um bom momento para pedir aumento, selecionar clientes melhores e mudar a forma de gerir seu negócio. O trabalho torna-se mais estratégico e menos braçal.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="lg:col-span-5 bg-[#111] rounded-[32px] p-8 md:p-12 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-2xl font-bold text-white">Identidade</h4>
              <span className="text-3xl font-ps-display font-bold text-white/60">80%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-8">
              <motion.div initial={{ width: 0 }} whileInView={{ width: '80%' }} transition={{ duration: 1.5, delay: 0.3 }} className="h-full bg-white/30 rounded-full" />
            </div>
            <p className="text-white/60 text-base leading-relaxed">
              Ter uma reserva financeira estruturada traz a calma mental necessária para você se posicionar com autoridade e liderar sua vida sem desespero.
            </p>
          </Reveal>

          <Reveal delay={0.3} className="lg:col-span-6 bg-[#111] rounded-[32px] p-8 md:p-10 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-bold text-white">Rotina & Produtividade</h4>
              <span className="text-2xl font-ps-display font-bold text-white/40">72%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-6">
              <motion.div initial={{ width: 0 }} whileInView={{ width: '72%' }} transition={{ duration: 1.5, delay: 0.4 }} className="h-full bg-white/20 rounded-full" />
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              A eficiência virgem entra em cena. O seu dia a dia passa a render mais porque você elimina tarefas não remuneradas e foca no que gera caixa.
            </p>
          </Reveal>
          
          <Reveal delay={0.4} className="lg:col-span-6 bg-[#111] rounded-[32px] p-8 md:p-10 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-bold text-white">Amor & Relacionamentos</h4>
              <span className="text-2xl font-ps-display font-bold text-white/40">62%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-6">
              <motion.div initial={{ width: 0 }} whileInView={{ width: '62%' }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-white/20 rounded-full" />
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Não é um ano focado em paixões avassaladoras. No relacionamento, você buscará estabilidade material, conforto, projetos de patrimônio a dois e apoio mútuo.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          A LINHA DO TEMPO (Interactive Stage Slider)
          ══════════════════════════════════════════════════ */}
      <section className="py-32 bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="mb-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">A Linha do Tempo do Seu Ano.</h2>
            <p className="text-white/50 font-light text-lg">As três fases da sua evolução financeira.</p>
          </Reveal>
          
          <div className="relative border-l-2 border-white/10 ml-4 md:ml-0 md:border-l-0 md:border-t-2 md:flex md:pt-16">
             <Reveal delay={0.1} className="md:flex-1 relative pl-10 pb-16 md:pl-0 md:pb-0 md:pr-10">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#10b981] md:top-[-73px] md:left-0 ring-4 ring-[#0a0a0a]"></div>
                <span className="text-[#10b981] font-mono text-sm uppercase tracking-widest block mb-4">Fase 1 (Mês 1 a 3)</span>
                <h4 className="text-2xl font-bold text-white mb-4">Diagnóstico & Limpeza.</h4>
                <p className="text-white/60 text-base leading-relaxed">
                  Período excelente para listar todas as suas contas, renegociar tarifas ou juros, cortar ralos invisíveis de despesas e readequar sua tabela de preços. É a fase de arrumar a casa para receber o fluxo de capital.
                </p>
             </Reveal>

             <Reveal delay={0.2} className="md:flex-1 relative pl-10 pb-16 md:pl-0 md:pb-0 md:pr-10">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white/20 md:top-[-73px] md:left-0 ring-4 ring-[#0a0a0a]"></div>
                <span className="text-white/40 font-mono text-sm uppercase tracking-widest block mb-4">Fase 2 (Mês 4 a 8)</span>
                <h4 className="text-2xl font-bold text-white mb-4">Aumento de Receita.</h4>
                <p className="text-white/60 text-base leading-relaxed">
                  O momento mais forte do ano para prospectar novos clientes, apresentar propostas de alto valor, pedir reajustes e precificar melhor seus serviços. O mercado responde com prontidão à sua cobrança.
                </p>
             </Reveal>

             <Reveal delay={0.3} className="md:flex-1 relative pl-10 md:pl-0 md:pb-0">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white/20 md:top-[-73px] md:left-0 ring-4 ring-[#0a0a0a]"></div>
                <span className="text-white/40 font-mono text-sm uppercase tracking-widest block mb-4">Fase 3 (Mês 9 a 12)</span>
                <h4 className="text-2xl font-bold text-white mb-4">Consolidação & Investimento.</h4>
                <p className="text-white/60 text-base leading-relaxed">
                  Hora de aplicar o dinheiro acumulado ao longo do ano de forma segura. Você sente a satisfação de ter uma reserva financeira equilibrada e pode planejar compras de médio e longo prazo (bens duráveis, veículos ou imóveis).
                </p>
             </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ALERTAS E PONTOS CEGOS
          ══════════════════════════════════════════════════ */}
      <section className="py-24 max-w-5xl mx-auto px-6 border-t border-white/10">
        <Reveal>
          <div className="flex items-center justify-center gap-4 mb-12">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-bold text-white">Alertas & Pontos Cegos</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Reveal delay={0.1} className="bg-red-950/20 border border-red-900/30 p-8 rounded-[24px]">
            <h4 className="text-red-400 font-bold mb-3">Medo de Escassez</h4>
            <p className="text-white/60 text-sm leading-relaxed">Cuidado para o foco no acúmulo não virar pão-durismo ou medo de investir no próprio crescimento profissional.</p>
          </Reveal>
          <Reveal delay={0.2} className="bg-red-950/20 border border-red-900/30 p-8 rounded-[24px]">
            <h4 className="text-red-400 font-bold mb-3">Compras de Compensação</h4>
            <p className="text-white/60 text-sm leading-relaxed">Cuidado com o oposto: gastar por impulso para compensar momentos de cansaço ou estresse da rotina.</p>
          </Reveal>
          <Reveal delay={0.3} className="bg-red-950/20 border border-red-900/30 p-8 rounded-[24px]">
            <h4 className="text-red-400 font-bold mb-3">Cobrança Desproporcional</h4>
            <p className="text-white/60 text-sm leading-relaxed">Lembre-se de alinhar o aumento de preço com a qualidade rigorosa da sua entrega técnica.</p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          O PROTOCOLO DE 24 HORAS & PLANO DE AÇÃO
          ══════════════════════════════════════════════════ */}
      <section className="py-32 max-w-6xl mx-auto px-6 border-t border-white/10">
        <Reveal className="mb-20 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Protocolo Prático de Ativação.</h2>
          <p className="text-white/50 text-lg">As ações exatas no momento do Retorno Solar em NYC e o plano dos próximos meses.</p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Ritual 24h */}
          <Reveal delay={0.1}>
            <div className="flex items-center gap-4 mb-8">
              <Clock className="w-8 h-8 text-[#10b981]" />
              <h3 className="text-2xl font-bold text-white">Ritual das 24 Horas</h3>
            </div>
            <p className="text-white/70 mb-8 leading-relaxed">
              No dia <strong>09/08/2027</strong>, no momento exato do seu Retorno Solar (<strong>05:30 UTC</strong>), dê um passo prático em direção à sua prosperidade:
            </p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1"><span className="text-[#10b981] font-bold text-sm">1</span></div>
                <p className="text-white/80 text-base leading-relaxed">Organize sua carteira física, limpe cartões e organize seus aplicativos financeiros no celular.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1"><span className="text-[#10b981] font-bold text-sm">2</span></div>
                <p className="text-white/80 text-base leading-relaxed">Abra uma nova conta de investimentos ou faça uma aplicação (mesmo de valor simbólico) para imantar a frequência de retenção de riqueza.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1"><span className="text-[#10b981] font-bold text-sm">3</span></div>
                <p className="text-white/80 text-base leading-relaxed">Evite compras fúteis, discussões financeiras ou parcelamentos impulsivos nas primeiras 24 horas.</p>
              </div>
            </div>
          </Reveal>

          {/* Plano 4 Passos */}
          <Reveal delay={0.2} className="bg-white/[0.02] border border-white/5 rounded-[32px] p-10">
            <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-6">Plano de Ação em 4 Passos</h3>
            <ul className="space-y-8">
              <li>
                <h5 className="text-[#10b981] font-bold mb-2">Passo 1:</h5>
                <p className="text-white/70 leading-relaxed">Audite seus custos fixos e elimine 100% dos vazamentos silenciosos de dinheiro.</p>
              </li>
              <li>
                <h5 className="text-[#10b981] font-bold mb-2">Passo 2:</h5>
                <p className="text-white/70 leading-relaxed">Aumente sua tabela de preços ou renegocie seu contrato principal logo na Fase 1.</p>
              </li>
              <li>
                <h5 className="text-[#10b981] font-bold mb-2">Passo 3:</h5>
                <p className="text-white/70 leading-relaxed">Monte uma reserva de emergência equivalente a pelo menos 3 a 6 meses do seu custo de vida.</p>
              </li>
              <li>
                <h5 className="text-[#10b981] font-bold mb-2">Passo 4:</h5>
                <p className="text-white/70 leading-relaxed">Reinvista parte do lucro em ferramentas que aumentem sua produtividade diária.</p>
              </li>
            </ul>
          </Reveal>
        </div>

        {/* Sinais de Ativação */}
        <Reveal delay={0.3} className="mt-20">
          <h3 className="text-xl font-bold text-white mb-8 text-center">Sinais de Ativação no Cotidiano</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-2xl p-6 flex gap-4 items-start">
              <CheckCircle2 className="w-6 h-6 text-[#10b981] shrink-0" />
              <p className="text-white/80 text-sm leading-relaxed">Você começa a se sentir seguro e confiante ao falar de dinheiro e passar orçamentos.</p>
            </div>
            <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-2xl p-6 flex gap-4 items-start">
              <CheckCircle2 className="w-6 h-6 text-[#10b981] shrink-0" />
              <p className="text-white/80 text-sm leading-relaxed">Surgem oportunidades de trabalhos extras, bônus ou clientes dispostos a pagar seu valor cheio.</p>
            </div>
            <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-2xl p-6 flex gap-4 items-start">
              <CheckCircle2 className="w-6 h-6 text-[#10b981] shrink-0" />
              <p className="text-white/80 text-sm leading-relaxed">Sua planilha financeira fecha o mês no verde de forma constante e previsível.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
          MANTRA DO ANO
          ══════════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-24 md:py-40 border-t border-white/[0.02] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.05)_0%,transparent_60%)] pointer-events-none" />
        <Reveal className="max-w-5xl mx-auto text-center relative z-10">
          <span className="text-[#10b981] font-bold tracking-[0.3em] uppercase text-sm mb-10 block">O Mantra do Seu Ano</span>
          <p className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-white/90 leading-[1.4] md:leading-[1.4] drop-shadow-2xl">
            "Eu reconheço o valor do meu trabalho, organizo minhas contas e colho a estabilidade material que me pertence."
          </p>
        </Reveal>
      </section>
`;

const startIdx = code.indexOf('{/* ══════════════════════════════════════════════════\n          A REVELAÇÃO (Intro)');
const endIdx = code.indexOf('{/* ══════════════════════════════════════════════════\n          O RODAPÉ DE AÇÃO (The Bottom Bar)');

if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + unlockedAppleGradeUI + '\n      ' + code.substring(endIdx);
    
    // Add missing icons
    const missingIcons = ['User', 'Sun', 'Star', 'Target', 'Activity', 'AlertTriangle', 'RefreshCw', 'Zap', 'Clock', 'CheckCircle2'];
    missingIcons.forEach(icon => {
        if (!code.includes(icon + ',')) {
            code = code.replace('import { MapPin,', 'import { MapPin, ' + icon + ',');
        }
    });

    fs.writeFileSync(file, code);
    console.log('Restoration and injection complete! Dense text is now beautifully integrated.');
} else {
    console.log('Could not find split points.');
}
