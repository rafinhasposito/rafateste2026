const fs = require('fs');
let file = 'src/pages/AppleResultPreview.tsx';
let code = fs.readFileSync(file, 'utf8');

// The new HIGH END content
const premiumContent = `      {/* ══════════════════════════════════════════════════
         CONTEÚDO DESBLOQUEADO (A REVELAÇÃO COMPLETA PÓS-PAGAMENTO)
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1000px] mx-auto px-6 py-20 md:py-24 border-t border-white/[0.02]">
        
        {/* ======================================= 
            ATO 2: POR QUE ESSE LUGAR MUDA TUDO 
            ======================================= */}
        
        {/* INTRODUÇÃO */}
        <Reveal>
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-16 h-16 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <Sparkles className="w-8 h-8 text-[#10b981]" />
            </div>
            <h2 className="font-ps-display text-4xl md:text-6xl font-bold tracking-tight mb-6">A Revelação. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">O Seu Ano na Casa {P.house}</span></h2>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl font-light leading-relaxed">
              Ao desembarcar nas coordenadas <span className="font-mono text-[#10b981]">[{P.coords}]</span> em <strong>{P.city}</strong> no dia <strong>09/08/2027 às 05:30 (UTC)</strong>, a rotação geográfica do seu Retorno Solar fixa a sua energia anual na <strong>Casa {P.house}</strong>.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="bg-gradient-to-br from-[#10b981]/5 to-transparent border border-[#10b981]/10 rounded-[32px] p-8 md:p-12 mb-20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/10 blur-[100px] rounded-full pointer-events-none"></div>
             <p className="text-white/80 text-lg md:text-xl font-light leading-[1.8] relative z-10">
               Esta é a casa clássica da <strong className="text-white">Prosperidade, do Valor Pessoal e da Estabilidade Material</strong>. Para o seu momento de vida (41 anos) com a força do seu <strong>Sol em Leão</strong> e a precisão do <strong>Ascendente em Virgem</strong>, este ciclo não se trata de "trabalhar mais no esforço cego", mas sim de <span className="text-[#10b981] font-medium border-b border-[#10b981]/30 pb-1">sistematizar o seu talento para cobrar o valor justo e construir segurança sólida</span>.
             </p>
          </div>
        </Reveal>

        {/* 3 PILARES (UI PREMIUM) */}
        <Reveal delay={0.2}>
          <div className="mb-24">
            <h3 className="font-ps-display text-2xl md:text-3xl font-bold mb-10 text-center text-white/90">Os 3 Pilares da Sua Ativação Financeira</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] transition-all hover:-translate-y-1 duration-500 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10b981]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-6">
                  <span className="text-[#10b981] font-mono text-sm font-bold">01</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Prosperidade & Ganhos</h4>
                <p className="text-white/50 text-sm leading-relaxed">O foco supremo do seu ano é aumentar a receita real. Facilita atração de recursos, novas fontes de renda e contratos lucrativos.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] transition-all hover:-translate-y-1 duration-500 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10b981]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-6">
                  <span className="text-[#10b981] font-mono text-sm font-bold">02</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Valorização & Precificação</h4>
                <p className="text-white/50 text-sm leading-relaxed">O seu Sol em Leão com Virgem exige que perca a timidez de cobrar caro. Reconheça o valor da sua entrega e renegocie preços.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] transition-all hover:-translate-y-1 duration-500 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10b981]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-6">
                  <span className="text-[#10b981] font-mono text-sm font-bold">03</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Estabilidade & Organização</h4>
                <p className="text-white/50 text-sm leading-relaxed">Ganhar bem só traz paz se bem gerido. Estanque vazamentos financeiros, organize planilhas e crie uma reserva inabalável.</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* PERFIL ASTROLÓGICO CRUZADO (UI PREMIUM) */}
        <Reveal delay={0.3}>
          <div className="mb-24 relative">
            <h3 className="font-ps-display text-2xl md:text-3xl font-bold mb-10 text-center text-white/90">Seu Perfil de Destino</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#02160F] border border-white/10 rounded-[32px] p-10 relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sun className="w-32 h-32 text-yellow-400" />
                </div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-widest">
                    Sol em Leão × Casa 2
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-white mb-4 relative z-10">Magnetismo e Alto Valor</h4>
                <p className="text-white/60 text-sm leading-relaxed mb-8 relative z-10">
                  Como leonino, você monetiza seus talentos autorais e sua marca pessoal com alto valor percebido. A Casa 2 transforma sua criatividade e prestígio em patrimônio real e tangível.
                </p>
                <div className="bg-yellow-500/5 rounded-xl p-5 border border-yellow-500/10 relative z-10">
                  <span className="block text-yellow-500/50 text-[10px] uppercase font-bold tracking-widest mb-2">Mantra do Signo</span>
                  <p className="text-yellow-400/90 text-sm italic font-serif">"O meu talento e a minha imagem geram prosperidade."</p>
                </div>
              </div>

              <div className="bg-[#02160F] border border-white/10 rounded-[32px] p-10 relative overflow-hidden group hover:border-[#10b981]/30 transition-colors">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Shield className="w-32 h-32 text-[#10b981]" />
                </div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-[10px] font-bold uppercase tracking-widest">
                    Fase Adulta (41) × Casa 2
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-white mb-4 relative z-10">Consolidação de Bases</h4>
                <p className="text-white/60 text-sm leading-relaxed mb-8 relative z-10">
                  A maturidade exige segurança sólida para sustentar as escolhas de vida. Não é mais sobre arriscar tudo, mas sim sobre organizar o caixa e proteger o patrimônio que você construiu.
                </p>
                <div className="bg-[#10b981]/5 rounded-xl p-5 border border-[#10b981]/10 relative z-10">
                  <span className="block text-[#10b981]/50 text-[10px] uppercase font-bold tracking-widest mb-2">Conselho Estratégico</span>
                  <p className="text-[#10b981]/90 text-sm italic font-serif">Proteja sua base, otimize a gestão e evite riscos desnecessários.</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* DIAGNÓSTICO DO FOCO (98% MATCH) - UI PREMIUM */}
        <Reveal delay={0.4}>
          <div className="mb-24">
            <h3 className="font-ps-display text-2xl md:text-3xl font-bold mb-10 text-center text-white/90">Diagnóstico da Ancoragem</h3>
            <div className="bg-gradient-to-b from-[#10b981]/10 to-[#02160F] border border-[#10b981]/20 rounded-[40px] p-10 md:p-14 relative overflow-hidden">
              {/* Marca d'água 98% */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[250px] font-ps-display font-bold text-[#10b981] opacity-5 pointer-events-none tracking-tighter">
                98%
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center mb-12">
                <div className="inline-flex items-center justify-center gap-3 bg-[#10b981]/20 border border-[#10b981]/40 px-6 py-3 rounded-full mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></div>
                  <span className="text-[#10b981] font-bold tracking-widest text-lg">98% MATCH GLOBAL</span>
                </div>
                <p className="text-xl text-white/80 max-w-2xl font-light leading-relaxed">
                  A estratégia perfeita para quem quer organizar a vida financeira. A Casa 2 tende a facilitar a precificação justa do seu tempo e o crescimento dos rendimentos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 pt-10 border-t border-white/10">
                <div className="text-center px-4">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#10b981]/10 flex items-center justify-center mb-4">
                    <CircleDollarSign className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <h5 className="text-white font-bold text-sm uppercase tracking-widest mb-3">A Origem da Renda</h5>
                  <p className="text-white/50 text-sm">Sua habilidade de rentabilizar competências. Cobranças justas e novos clientes.</p>
                </div>
                <div className="text-center px-4 md:border-l md:border-r border-white/10">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#10b981]/10 flex items-center justify-center mb-4">
                    <Briefcase className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <h5 className="text-white font-bold text-sm uppercase tracking-widest mb-3">Impacto Profissional</h5>
                  <p className="text-white/50 text-sm">Ideal para pedir aumento, buscar clientes premium e melhorar a gestão do negócio.</p>
                </div>
                <div className="text-center px-4">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#10b981]/10 flex items-center justify-center mb-4">
                    <Heart className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <h5 className="text-white font-bold text-sm uppercase tracking-widest mb-3">Impacto Íntimo</h5>
                  <p className="text-white/50 text-sm">Busca por estabilidade. Conforto e planos de patrimônio ganham foco na relação.</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>


        {/* ======================================= 
            ATOS 3 E 4: ACORDEÕES PREMIUM 
            ======================================= */}
        
        <Reveal delay={0.5}>
          <div className="space-y-6">
            
            {/* ACORDEÃO 1: LINHA DO TEMPO */}
            <AccordionCard title="O Mapa do Seu Ano (3 Fases)" icon={Calendar} defaultOpen={true}>
               <div className="pt-8 pb-4 relative">
                 <div className="absolute left-[27px] top-10 bottom-10 w-px bg-gradient-to-b from-[#10b981] via-[#10b981]/30 to-transparent"></div>
                 
                 <div className="relative pl-16 mb-12">
                   <div className="absolute left-5 top-1 w-4 h-4 rounded-full bg-[#10b981] shadow-[0_0_15px_#10b981]"></div>
                   <span className="text-[#10b981] text-xs font-bold uppercase tracking-widest mb-2 block">Fase 1 — Meses 1 a 3</span>
                   <h5 className="font-ps-display font-bold text-white text-2xl mb-3">Diagnóstico & Limpeza Financeira</h5>
                   <p className="text-white/70 text-sm leading-relaxed mb-4">Período excelente para listar todas as suas contas, renegociar contratos, tarifas ou dívidas antigas e reajustar a sua tabela de preços. É o momento de arrumar a casa para receber o fluxo financeiro.</p>
                   <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                     <Target className="w-3.5 h-3.5 text-[#10b981]" />
                     <span className="text-white/60 text-xs font-medium">Foco: Organização e corte de ralos invisíveis.</span>
                   </div>
                 </div>

                 <div className="relative pl-16 mb-12">
                   <div className="absolute left-5 top-1 w-4 h-4 rounded-full bg-[#10b981]/50 border-2 border-[#10b981]"></div>
                   <span className="text-[#10b981] text-xs font-bold uppercase tracking-widest mb-2 block">Fase 2 — Meses 4 a 8</span>
                   <h5 className="font-ps-display font-bold text-white text-2xl mb-3">Expansão de Receita & Pico</h5>
                   <p className="text-white/70 text-sm leading-relaxed mb-4">O pico da atração financeira. Perfeito para prospectar clientes melhores, apresentar propostas de maior valor, lançar novos serviços e fechar acordos altamente remunerados.</p>
                   <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                     <Target className="w-3.5 h-3.5 text-[#10b981]" />
                     <span className="text-white/60 text-xs font-medium">Foco: Aumento de faturamento e prospecção de alto valor.</span>
                   </div>
                 </div>

                 <div className="relative pl-16">
                   <div className="absolute left-5 top-1 w-4 h-4 rounded-full bg-[#10b981]/20 border-2 border-[#10b981]/50"></div>
                   <span className="text-[#10b981] text-xs font-bold uppercase tracking-widest mb-2 block">Fase 3 — Meses 9 a 12</span>
                   <h5 className="font-ps-display font-bold text-white text-2xl mb-3">Consolidação & Ancoragem</h5>
                   <p className="text-white/70 text-sm leading-relaxed mb-4">Hora de consolidar o capital acumulado ao longo do ano. Você sente a satisfação de ter uma planilha equilibrada no verde e ganha fôlego para planejar compras maiores com tranquilidade.</p>
                   <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                     <Target className="w-3.5 h-3.5 text-[#10b981]" />
                     <span className="text-white/60 text-xs font-medium">Foco: Investimento seguro e planejamento de longo prazo.</span>
                   </div>
                 </div>
               </div>
            </AccordionCard>

            {/* ACORDEÃO 2: IMPACTO SECUNDÁRIO */}
            <AccordionCard title="Impacto Secundário (Radar 360°)" icon={Activity}>
              <div className="pt-6 pb-2 space-y-8">
                 <div>
                   <div className="flex justify-between items-end mb-3">
                     <h5 className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#10b981]" /> Trabalho & Carreira</h5>
                     <span className="text-[#10b981] font-bold text-sm">88% MATCH</span>
                   </div>
                   <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                     <div className="h-full bg-[#10b981] rounded-full w-[88%]"></div>
                   </div>
                   <p className="text-white/60 text-sm leading-relaxed">O seu trabalho ganha peso pelo retorno financeiro direto. Ao cobrar mais caro e selecionar clientes, o seu posicionamento de mercado sobe de nível.</p>
                 </div>

                 <div>
                   <div className="flex justify-between items-end mb-3">
                     <h5 className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-2"><User className="w-4 h-4 text-[#10b981]" /> Identidade & Imagem</h5>
                     <span className="text-[#10b981] font-bold text-sm">80% MATCH</span>
                   </div>
                   <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                     <div className="h-full bg-[#10b981] rounded-full w-[80%]"></div>
                   </div>
                   <p className="text-white/60 text-sm leading-relaxed">A previsibilidade financeira devolve a sua postura de liderança leonina. Você fala com mais firmeza e transmite a segurança de quem tem o controle.</p>
                 </div>

                 <div>
                   <div className="flex justify-between items-end mb-3">
                     <h5 className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-[#10b981]" /> Rotina & Produtividade</h5>
                     <span className="text-[#10b981] font-bold text-sm">72% MATCH</span>
                   </div>
                   <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                     <div className="h-full bg-[#10b981] rounded-full w-[72%]"></div>
                   </div>
                   <p className="text-white/60 text-sm leading-relaxed">Sem a ansiedade de boletos e incertezas, a sua rotina diária se torna mais leve, previsível e altamente eficiente.</p>
                 </div>
              </div>
            </AccordionCard>

            {/* ACORDEÃO 3: PONTOS CEGOS */}
            <AccordionCard title="Pontos Cegos & Alertas" icon={AlertTriangle}>
              <div className="pt-6 pb-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <h5 className="font-bold text-red-400 mb-3 text-lg">Medo de Escassez</h5>
                  <p className="text-white/60 text-sm leading-relaxed">Cuidado para não cair na armadilha de segurar dinheiro em excesso por medo e deixar de investir em ferramentas que acelerariam seu crescimento.</p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <h5 className="font-bold text-red-400 mb-3 text-lg">Compras de Compensação</h5>
                  <p className="text-white/60 text-sm leading-relaxed">Evite usar o dinheiro para fazer compras impulsivas ou luxos desnecessários apenas para compensar picos de estresse da rotina.</p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <h5 className="font-bold text-red-400 mb-3 text-lg">Saldo não é Valor</h5>
                  <p className="text-white/60 text-sm leading-relaxed">O dinheiro é uma ferramenta de segurança e liberdade, não a única métrica do seu valor como ser humano.</p>
                </div>
              </div>
            </AccordionCard>

            {/* ACORDEÃO 4: PROTOCOLO PRÁTICO */}
            <AccordionCard title="Protocolo Prático de Ativação" icon={Compass}>
              <div className="pt-6 pb-2 space-y-12">
                
                {/* Ritual */}
                <div className="bg-gradient-to-r from-[#10b981]/10 to-transparent border border-[#10b981]/20 rounded-[24px] p-8 md:p-10 relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10">
                    <MapPin className="w-64 h-64 text-[#10b981] -mt-10 -mr-10" />
                  </div>
                  <div className="relative z-10">
                    <h5 className="font-ps-display font-bold text-3xl text-white mb-6">O Ritual das 24 Horas</h5>
                    <p className="text-white/80 text-base leading-relaxed mb-8 max-w-2xl">
                      No dia <strong>09/08/2027</strong>, no momento exato do seu Retorno Solar <span className="font-mono text-[#10b981]">(05:30 UTC)</span>, dê um passo prático e consciente em direção à sua prosperidade:
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 bg-black/30 p-4 rounded-xl border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-[#10b981] text-black font-bold flex items-center justify-center shrink-0">1</div>
                        <p className="text-white/70 text-sm">Organize sua carteira física e limpe pendências digitais no celular.</p>
                      </div>
                      <div className="flex items-center gap-4 bg-black/30 p-4 rounded-xl border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-[#10b981] text-black font-bold flex items-center justify-center shrink-0">2</div>
                        <p className="text-white/70 text-sm">Abra uma nova conta de investimento ou faça uma aplicação simbólica.</p>
                      </div>
                      <div className="flex items-center gap-4 bg-black/30 p-4 rounded-xl border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-[#10b981] text-black font-bold flex items-center justify-center shrink-0">3</div>
                        <p className="text-white/70 text-sm">Evite compras por impulso ou parcelamentos nas primeiras 24 horas.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plano de Ação */}
                <div>
                  <h5 className="font-ps-display font-bold text-2xl text-white mb-8">Plano de Ação (4 Passos)</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl flex gap-5">
                      <span className="font-mono text-3xl font-bold text-[#10b981]/30">01</span>
                      <p className="text-white/70 text-sm leading-relaxed mt-1">Recalcule o preço da sua hora/serviço e elimine descontos emocionais.</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl flex gap-5">
                      <span className="font-mono text-3xl font-bold text-[#10b981]/30">02</span>
                      <p className="text-white/70 text-sm leading-relaxed mt-1">Estanque 100% dos vazamentos e assinaturas que você não usa no dia a dia.</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl flex gap-5">
                      <span className="font-mono text-3xl font-bold text-[#10b981]/30">03</span>
                      <p className="text-white/70 text-sm leading-relaxed mt-1">Crie uma reserva de emergência correspondente a pelo menos 3 meses do seu custo de vida.</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl flex gap-5">
                      <span className="font-mono text-3xl font-bold text-[#10b981]/30">04</span>
                      <p className="text-white/70 text-sm leading-relaxed mt-1">Reinvista uma porcentagem fixa do lucro da Fase 2 na melhoria da sua estrutura de trabalho.</p>
                    </div>
                  </div>
                </div>

                {/* Sinais */}
                <div>
                  <h5 className="font-ps-display font-bold text-2xl text-white mb-8">Sinais de Ativação no Cotidiano</h5>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                      <CheckCircle2 className="w-6 h-6 text-[#10b981] shrink-0" />
                      <p className="text-white/80">Você sente paz e firmeza ao passar um orçamento de alto valor sem hesitar.</p>
                    </div>
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                      <CheckCircle2 className="w-6 h-6 text-[#10b981] shrink-0" />
                      <p className="text-white/80">Surgem novos clientes dispostos a pagar pelo seu serviço sem pedir desconto.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="w-6 h-6 text-[#10b981] shrink-0" />
                      <p className="text-white/80">Sua planilha financeira fecha o mês com sobra de caixa consistente.</p>
                    </div>
                  </div>
                </div>

                {/* Mantra */}
                <div className="bg-[#02160F] border border-[#10b981]/30 p-10 md:p-16 rounded-[32px] text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                  <span className="text-[#10b981] uppercase tracking-[0.3em] font-bold text-xs mb-6 block">Mantra do Seu Ano</span>
                  <p className="font-serif italic text-2xl md:text-4xl text-white/90 leading-relaxed">
                    "Eu reconheço o valor do meu trabalho, organizo minhas finanças e colho a estabilidade material que me pertence."
                  </p>
                </div>
              </div>
            </AccordionCard>
          </div>
          
          {/* Card de Suporte no Rodapé */}
          <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer mt-12 mb-32 group">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Plane className="w-8 h-8 text-white/40" />
              </div>
              <div>
                <h5 className="font-bold text-white text-xl mb-2">Não consegue viajar para Nova Iorque este ano?</h5>
                <p className="text-white/50 text-base">Veja como ancorar essa mesma energia mais próxima de você.</p>
              </div>
            </div>
            <button className="w-full md:w-auto whitespace-nowrap px-8 py-4 bg-white/10 rounded-full text-white text-sm font-bold uppercase tracking-widest hover:bg-white/20 transition-colors">
              Calcular Plano B
            </button>
          </div>
        </Reveal>
      </section>
`;

const revRegex = /\{\/\* ══════════════════════════════════════════════════\n\s*(CONTEÚDO DESBLOQUEADO|5\. A REVELAÇÃO|ATO 2: POR QUE ESSE LUGAR MUDA TUDO)[\s\S]*$/;
if (revRegex.test(code)) {
    code = code.replace(revRegex, premiumContent + '\n      </div>\n  );\n}\n');
}

const missingIcons = ['Target', 'Compass', 'ListTodo', 'CheckCircle2', 'Activity', 'CircleDollarSign', 'Briefcase', 'Heart'];
missingIcons.forEach(icon => {
    if (!code.includes(icon + ',')) {
        code = code.replace('import { MapPin,', 'import { MapPin, ' + icon + ',');
    }
});

fs.writeFileSync(file, code);
console.log('High End Content injected.');
