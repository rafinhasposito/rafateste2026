const fs = require('fs');
let file = 'src/pages/AppleResultPreview.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. We need to ensure Shadcn Accordion imports are present.
const accordionImports = `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";\n`;
if (!code.includes('import { Accordion,')) {
    code = code.replace('import { MapPin,', accordionImports + 'import { MapPin,');
}

// 2. The new content block using DestinyResults.tsx styling logic
const dashboardStyleContent = `      {/* ══════════════════════════════════════════════════
         CONTEÚDO DESBLOQUEADO (A REVELAÇÃO COMPLETA PÓS-PAGAMENTO)
         ══════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 md:px-0 py-20 md:py-24 border-t border-white/[0.02]">
        
        {/* INTRODUÇÃO (Inspirado no "Science Enveloped in History") */}
        <Reveal>
          <div className="mb-16 bg-[#10b981]/5 border border-[#10b981]/20 rounded-3xl p-8 backdrop-blur-md shadow-xl text-center md:text-left">
            <h3 className="font-ps-display text-3xl text-white mb-6 flex items-center justify-center md:justify-start gap-3">
              <Sparkles className="w-6 h-6 text-[#10b981]" />
              A Revelação: O Seu Ano na Casa 2
            </h3>
            <p className="font-ps-ui text-lg text-white/80 leading-relaxed font-light">
              <strong className="text-white">{P.firstName}</strong>, ao desembarcar no seu destino de aniversário nas coordenadas <strong className="text-[#10b981]">[{P.coords}]</strong> em <strong className="text-white">{P.city}</strong> no dia <strong className="text-[#10b981]">09/08/2027 às 05:30 (UTC)</strong>, a rotação geográfica do seu Retorno Solar fixa a sua energia anual na <strong className="text-white">Casa 2</strong>.
              <br/><br/>
              Esta é a casa clássica da <strong className="text-white">Prosperidade, do Valor Pessoal e da Estabilidade Material</strong>. Para o seu momento de vida (41 anos, adulto) com a força do seu <strong className="text-white">Sol em Leão</strong> e a precisão do <strong className="text-white">Ascendente da Revolução em Virgem</strong>, este ciclo não se trata de "trabalhar mais no esforço cego", mas sim de <strong className="text-[#10b981]">sistematizar o seu talento para cobrar o valor justo e construir segurança sólida</strong>.
            </p>
          </div>
        </Reveal>

        {/* 3 PILARES (Estilo DestinyResults Cards) */}
        <Reveal delay={0.1}>
          <div className="mb-16">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#10b981]/70 block mb-3">
                A Estrutura
              </span>
              <h3 className="font-ps-display text-3xl md:text-4xl text-white">Os 3 Pilares da Sua Ativação Financeira</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-black/40 border border-[#10b981]/10 rounded-3xl p-8 backdrop-blur-sm hover:border-[#10b981]/30 transition-colors">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center font-mono text-sm font-bold text-[#10b981]">
                      01
                    </div>
                    <h3 className="font-ps-display text-xl text-white">Prosperidade & Aumento de Ganhos</h3>
                 </div>
                 <p className="text-base font-ps-ui text-white/80 leading-relaxed font-light">
                    O foco supremo do seu ano é aumentar a sua receita real. O ciclo facilita a atração de recursos, a criação de novas fontes de renda e a negociação de contratos mais lucrativos.
                 </p>
              </div>

              <div className="bg-black/40 border border-[#10b981]/10 rounded-3xl p-8 backdrop-blur-sm hover:border-[#10b981]/30 transition-colors">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center font-mono text-sm font-bold text-[#10b981]">
                      02
                    </div>
                    <h3 className="font-ps-display text-xl text-white">Valorização & Precificação</h3>
                 </div>
                 <p className="text-base font-ps-ui text-white/80 leading-relaxed font-light">
                    O seu Sol em Leão com o filtro analítico de Virgem exige que você perca a timidez de cobrar caro pelo que faz. Você é chamado a reconhecer o valor da sua entrega e renegociar seus preços.
                 </p>
              </div>

              <div className="bg-black/40 border border-[#10b981]/10 rounded-3xl p-8 backdrop-blur-sm hover:border-[#10b981]/30 transition-colors">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center font-mono text-sm font-bold text-[#10b981]">
                      03
                    </div>
                    <h3 className="font-ps-display text-xl text-white">Estabilidade Material & Organização</h3>
                 </div>
                 <p className="text-base font-ps-ui text-white/80 leading-relaxed font-light">
                    Ganhar bem só traz paz se o dinheiro for bem gerido. Este ano é o momento ideal para estancar vazamentos financeiros, organizar planilhas e criar uma reserva de segurança inabalável.
                 </p>
              </div>

            </div>
          </div>
        </Reveal>


        {/* ACCORDIONS (Usando componente UI Shadcn igual ao Dashboard) */}
        <Reveal delay={0.2}>
          <section className="mb-16">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#10b981]/70 block mb-3">
                A Jornada
              </span>
              <h3 className="font-ps-display text-3xl md:text-4xl text-white">O Mapa do Seu Ano</h3>
              <p className="font-ps-ui text-white/60 text-sm mt-4 max-w-lg mx-auto">
                As fases do seu ciclo, os alertas e o protocolo prático de ativação para ancorar sua energia.
              </p>
            </div>
            
            <Accordion type="single" collapsible className="w-full bg-black/40 border border-[#10b981]/10 rounded-3xl p-3 backdrop-blur-md shadow-xl">
                
                {/* 1. MAPA DO ANO */}
                <AccordionItem value="timeline" className="border-b border-[#10b981]/10 px-4">
                  <AccordionTrigger className="text-white hover:no-underline py-5 opacity-90 hover:opacity-100">
                    <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#10b981]" /> O Mapa do Seu Ano (Linha do Tempo em 3 Fases)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2 space-y-6">
                    <div className="border-l-2 border-[#10b981]/30 pl-4 py-1">
                      <h5 className="font-bold text-white text-lg mb-2">Fase 1 — Meses 1 a 3: Diagnóstico & Limpeza Financeira</h5>
                      <p className="text-[#10b981] text-sm font-semibold mb-2">O Foco: Organização e corte de ralos invisíveis.</p>
                      <p>Período excelente para listar todas as suas contas, renegociar contratos, tarifas ou dívidas antigas e reajustar a sua tabela de preços. É o momento de arrumar a casa para receber o fluxo financeiro maior que vem a seguir.</p>
                    </div>
                    <div className="border-l-2 border-[#10b981]/30 pl-4 py-1">
                      <h5 className="font-bold text-white text-lg mb-2">Fase 2 — Meses 4 a 8: Expansão de Receita & Pico de Atração</h5>
                      <p className="text-[#10b981] text-sm font-semibold mb-2">O Foco: Aumento de faturamento e prospecção de alto valor.</p>
                      <p>O pico da atração financeira do seu ciclo. Período perfeito para prospectar clientes melhores, apresentar propostas comerciais de maior valor, lançar novos serviços e fechar acordos onde o seu conhecimento é altamente remunerado.</p>
                    </div>
                    <div className="border-l-2 border-[#10b981]/30 pl-4 py-1">
                      <h5 className="font-bold text-white text-lg mb-2">Fase 3 — Meses 9 a 12: Consolidação & Ancoragem de Patrimônio</h5>
                      <p className="text-[#10b981] text-sm font-semibold mb-2">O Foco: Investimento seguro e planejamento de longo prazo.</p>
                      <p>Hora de consolidar o capital acumulado ao longo do ano. Você sente a satisfação de ter uma planilha equilibrada no verde e ganha fôlego para planejar compras maiores (como aquisições de bens, veículos ou investimentos imobiliários) com total tranquilidade.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* 2. IMPACTO SECUNDÁRIO */}
                <AccordionItem value="impact" className="border-b border-[#10b981]/10 px-4">
                  <AccordionTrigger className="text-white hover:no-underline py-5 opacity-90 hover:opacity-100">
                    <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                      <Target className="w-5 h-5 text-[#10b981]" /> Impacto Secundário nas Outras Áreas
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2 space-y-4">
                    <p><strong className="text-white">Trabalho & Carreira (88% Match):</strong> O seu trabalho ganha peso pelo retorno financeiro direto. Ao cobrar mais caro e selecionar clientes, o seu posicionamento de mercado sobe de nível.</p>
                    <p><strong className="text-white">Identidade & Imagem (80% Match):</strong> A previsibilidade financeira devolve a sua postura de liderança leonina. Você fala com mais firmeza e transmite a segurança de quem tem o controle da própria vida.</p>
                    <p><strong className="text-white">Rotina & Produtividade (72% Match):</strong> Sem a ansiedade de boletos e incertezas, a sua rotina diária se torna mais leve, previsível e altamente eficiente.</p>
                  </AccordionContent>
                </AccordionItem>

                {/* 3. PONTOS CEGOS */}
                <AccordionItem value="blindspots" className="border-b border-[#10b981]/10 px-4">
                  <AccordionTrigger className="text-white hover:no-underline py-5 opacity-90 hover:opacity-100">
                    <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" /> Pontos Cegos & Alertas do Ciclo
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2 space-y-4">
                    <ul className="list-disc pl-5 space-y-3">
                      <li><strong className="text-red-400">Medo de Escassez:</strong> Cuidado para não cair na armadilha de segurar dinheiro em excesso por medo e deixar de investir em ferramentas, cursos ou melhorias que acelerariam seu crescimento.</li>
                      <li><strong className="text-red-400">Compras de Compensação:</strong> Evite usar o dinheiro para fazer compras impulsivas ou luxos desnecessários apenas para compensar picos de estresse da rotina.</li>
                      <li><strong className="text-red-400">Confundir Saldo com Valor:</strong> O dinheiro é uma ferramenta de segurança e liberdade, não a única métrica do seu valor como ser humano.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* 4. PROTOCOLO PRÁTICO */}
                <AccordionItem value="protocol" className="border-b-0 px-4">
                  <AccordionTrigger className="text-white hover:no-underline py-5 opacity-90 hover:opacity-100">
                    <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                      <Compass className="w-5 h-5 text-[#10b981]" /> Protocolo Prático de Ativação
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2 space-y-8">
                    
                    <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-2xl p-6">
                      <h5 className="font-ps-display text-xl text-white mb-3">O Ritual das Primeiras 24 Horas</h5>
                      <p className="mb-4">No dia <strong>09/08/2027</strong>, no momento exato do seu Retorno Solar (05:30 UTC), dê um passo prático e consciente em direção à sua prosperidade:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Organize sua carteira física e limpe pendências digitais no celular.</li>
                        <li>Abra uma nova conta de investimento ou faça uma aplicação simbólica para ancorar a energia de acúmulo.</li>
                        <li>Evite compras por impulso ou parcelamentos desnecessários nas primeiras 24 horas para sintonizar a frequência de retenção e riqueza.</li>
                      </ol>
                    </div>

                    <div>
                      <h5 className="font-ps-display text-xl text-white mb-4">Plano de Ação em 4 Passos</h5>
                      <div className="space-y-3">
                        <p><strong className="text-[#10b981]">Passo 1:</strong> Recalcule o preço da sua hora/serviço e elimine descontos emocionais.</p>
                        <p><strong className="text-[#10b981]">Passo 2:</strong> Estanque 100% dos vazamentos e assinaturas que você não usa no dia a dia.</p>
                        <p><strong className="text-[#10b981]">Passo 3:</strong> Crie uma reserva de emergência correspondente a pelo menos 3 meses do seu custo de vida.</p>
                        <p><strong className="text-[#10b981]">Passo 4:</strong> Reinvista uma porcentagem fixa do lucro da Fase 2 na melhoria da sua estrutura de trabalho.</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-ps-display text-xl text-white mb-4">Sinais de Ativação no Cotidiano</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Você sente paz e firmeza ao passar um orçamento de alto valor sem hesitar.</li>
                        <li>Surgem novos clientes dispostos a pagar pelo seu serviço sem pedir desconto.</li>
                        <li>Sua planilha financeira fecha o mês com sobra de caixa consistente.</li>
                      </ul>
                    </div>

                    <div className="text-center p-6 bg-black/50 border border-white/10 rounded-2xl">
                      <span className="block text-xs uppercase tracking-widest text-white/50 mb-3">O Mantra do Seu Ano</span>
                      <p className="text-[#10b981] font-serif italic text-xl">"Eu reconheço o valor do meu trabalho, organizo minhas finanças e colho a estabilidade material que me pertence."</p>
                    </div>

                  </AccordionContent>
                </AccordionItem>

            </Accordion>
          </section>
        </Reveal>

      </section>
`;

const revRegex = /\{\/\* ══════════════════════════════════════════════════\n\s*(CONTEÚDO DESBLOQUEADO|5\. A REVELAÇÃO|ATO 2: POR QUE ESSE LUGAR MUDA TUDO)[\s\S]*$/;
if (revRegex.test(code)) {
    code = code.replace(revRegex, dashboardStyleContent + '\n      </div>\n  );\n}\n');
}

const missingIcons = ['Target', 'Compass', 'Calendar', 'User', 'Wallet', 'Briefcase', 'AlertTriangle', 'Sparkles', 'CheckCircle2'];
missingIcons.forEach(icon => {
    if (!code.includes(icon + ',')) {
        code = code.replace('import { MapPin,', 'import { MapPin, ' + icon + ',');
    }
});

// Since we are using Shadcn Accordion, we don't need the local AccordionCard anymore. We can remove it to clean up the code.
const localAccordionRegex = /const AccordionCard = \(\{ title, icon: Icon, children, defaultOpen = false \}[\s\S]*?\};\n/;
if (localAccordionRegex.test(code)) {
    code = code.replace(localAccordionRegex, '');
}

fs.writeFileSync(file, code);
console.log('Dashboard style content injected successfully.');
