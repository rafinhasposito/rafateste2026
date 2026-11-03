const fs = require('fs');
let file = 'src/pages/AppleResultPreview.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Inject AccordionCard component if not exists
const accordionComponent = `
const AccordionCard = ({ title, icon: Icon, children, defaultOpen = false }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden mb-4 transition-colors hover:bg-white/[0.04]">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-6 py-5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <Icon className="w-5 h-5 text-[#10b981]" />
          <span className="font-bold text-white/90 uppercase tracking-widest text-sm">{title}</span>
        </div>
        <ChevronDown className={"w-5 h-5 text-white/40 transition-transform duration-300 " + (isOpen ? "rotate-180" : "")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 pt-2 border-t border-white/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
`;

if (!code.includes('const AccordionCard =')) {
    const componentTarget = 'export default function AppleResultPreview() {';
    code = code.replace(componentTarget, accordionComponent + '\n' + componentTarget);
}

if (!code.includes('ChevronDown,')) {
    code = code.replace('import { MapPin,', 'import { MapPin, ChevronDown,');
}

// 2. Build the final block
const finalBlock = `      {/* ══════════════════════════════════════════════════
         CONTEÚDO DESBLOQUEADO (A REVELAÇÃO COMPLETA PÓS-PAGAMENTO)
         ══════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-24 border-t border-white/[0.02]">
        
        {/* A REVELAÇÃO */}
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#10b981]" />
            </div>
            <h2 className="font-ps-display text-4xl md:text-5xl font-bold tracking-tight">A Revelação. O Seu Ano na Casa 2</h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-6 text-white/70 text-lg md:text-xl font-light leading-[1.8] mb-20">
            <p>
              <strong className="text-white font-semibold">{P.firstName}</strong>, ao desembarcar no seu destino de aniversário nas coordenadas <span className="font-mono text-sm text-[#10b981]">[{P.coords}]</span> em <strong>{P.city}</strong> no dia <strong>09/08/2027 às 05:30 (UTC)</strong>, a rotação geográfica do seu Retorno Solar fixa a sua energia anual na <strong>Casa {P.house}</strong>.
            </p>
            
            <p>
              Esta é a casa clássica da <strong>Prosperidade, do Valor Pessoal e da Estabilidade Material</strong>. Para o seu momento de vida (41 anos, adulto) com a força do seu <strong>Sol em Leão</strong> e a precisão do <strong>Ascendente da Revolução em Virgem</strong>, este ciclo não se trata de "trabalhar mais no esforço cego", mas sim de <span className="text-[#10b981] font-medium">sistematizar o seu talento para cobrar o valor justo e construir segurança sólida</span>.
            </p>
          </div>
        </Reveal>

        {/* OS 3 PILARES */}
        <Reveal delay={0.2}>
          <h3 className="font-ps-display text-2xl font-bold mb-8 text-white/90">Os 3 Pilares da Sua Ativação Financeira</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {/* Pilar 1 */}
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] transition-colors group">
              <span className="text-[#10b981]/40 font-mono text-sm font-bold tracking-widest mb-4 block group-hover:text-[#10b981] transition-colors">01</span>
              <h4 className="text-xl font-bold text-white mb-4">Prosperidade & Aumento de Ganhos</h4>
              <p className="text-white/50 text-sm leading-relaxed">
                O foco supremo do seu ano é aumentar a sua receita real. O ciclo facilita a atração de recursos, a criação de novas fontes de renda e a negociação de contratos mais lucrativos.
              </p>
            </div>
            {/* Pilar 2 */}
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] transition-colors group">
              <span className="text-[#10b981]/40 font-mono text-sm font-bold tracking-widest mb-4 block group-hover:text-[#10b981] transition-colors">02</span>
              <h4 className="text-xl font-bold text-white mb-4">Valorização & Precificação</h4>
              <p className="text-white/50 text-sm leading-relaxed">
                O seu Sol em Leão com o filtro analítico de Virgem exige que você perca a timidez de cobrar caro pelo que faz. Você é chamado a reconhecer o valor da sua entrega e renegociar seus preços.
              </p>
            </div>
            {/* Pilar 3 */}
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] transition-colors group">
              <span className="text-[#10b981]/40 font-mono text-sm font-bold tracking-widest mb-4 block group-hover:text-[#10b981] transition-colors">03</span>
              <h4 className="text-xl font-bold text-white mb-4">Estabilidade & Organização</h4>
              <p className="text-white/50 text-sm leading-relaxed">
                Ganhar bem só traz paz se o dinheiro for bem gerido. Este ano é o momento ideal para estancar vazamentos financeiros, organizar planilhas e criar uma reserva de segurança inabalável.
              </p>
            </div>
          </div>
        </Reveal>

        {/* ACCORDIONS DE APROFUNDAMENTO */}
        <Reveal delay={0.3}>
          <div className="mb-20">
            <AccordionCard title="O Mapa do Seu Ano (3 Fases)" icon={Calendar} defaultOpen={true}>
               <div className="space-y-6 pt-4">
                 <div className="pl-4 border-l-2 border-[#10b981]/30">
                   <h5 className="font-bold text-white text-lg mb-2">Fase 1 — Meses 1 a 3: Diagnóstico & Limpeza Financeira</h5>
                   <p className="text-white/50 text-sm mb-3"><strong className="text-[#10b981]">O Foco:</strong> Organização e corte de ralos invisíveis.</p>
                   <p className="text-white/70 text-sm leading-relaxed">Período excelente para listar todas as suas contas, renegociar contratos, tarifas ou dívidas antigas e reajustar a sua tabela de preços. É o momento de arrumar a casa para receber o fluxo financeiro maior que vem a seguir.</p>
                 </div>
                 <div className="pl-4 border-l-2 border-[#10b981]/30">
                   <h5 className="font-bold text-white text-lg mb-2">Fase 2 — Meses 4 a 8: Expansão de Receita & Pico</h5>
                   <p className="text-white/50 text-sm mb-3"><strong className="text-[#10b981]">O Foco:</strong> Aumento de faturamento e prospecção de alto valor.</p>
                   <p className="text-white/70 text-sm leading-relaxed">O pico da atração financeira do seu ciclo. Período perfeito para prospectar clientes melhores, apresentar propostas comerciais de maior valor, lançar novos serviços e fechar acordos onde o seu conhecimento é altamente remunerado.</p>
                 </div>
                 <div className="pl-4 border-l-2 border-[#10b981]/30">
                   <h5 className="font-bold text-white text-lg mb-2">Fase 3 — Meses 9 a 12: Consolidação & Ancoragem</h5>
                   <p className="text-white/50 text-sm mb-3"><strong className="text-[#10b981]">O Foco:</strong> Investimento seguro e planejamento de longo prazo.</p>
                   <p className="text-white/70 text-sm leading-relaxed">Hora de consolidar o capital acumulado ao longo do ano. Você sente a satisfação de ter uma planilha equilibrada no verde e ganha fôlego para planear compras maiores (como aquisições de bens, veículos ou investimentos imobiliários) com total tranquilidade.</p>
                 </div>
               </div>
            </AccordionCard>

            <AccordionCard title="Impacto Secundário (Outras Áreas)" icon={Target}>
              <div className="space-y-4 pt-4">
                 <div className="bg-white/[0.02] p-4 rounded-xl">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-[#10b981] text-xs font-bold uppercase tracking-widest">Trabalho & Carreira (88% Match)</span>
                   </div>
                   <p className="text-white/70 text-sm leading-relaxed">O seu trabalho ganha peso pelo retorno financeiro direto. Ao cobrar mais caro e selecionar clientes, o seu posicionamento de mercado sobe de nível.</p>
                 </div>
                 <div className="bg-white/[0.02] p-4 rounded-xl">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-[#10b981] text-xs font-bold uppercase tracking-widest">Identidade & Imagem (80% Match)</span>
                   </div>
                   <p className="text-white/70 text-sm leading-relaxed">A previsibilidade financeira devolve a sua postura de liderança leonina. Você fala com mais firmeza e transmite a segurança de quem tem o controle da própria vida.</p>
                 </div>
                 <div className="bg-white/[0.02] p-4 rounded-xl">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-[#10b981] text-xs font-bold uppercase tracking-widest">Rotina & Produtividade (72% Match)</span>
                   </div>
                   <p className="text-white/70 text-sm leading-relaxed">Sem a ansiedade de boletos e incertezas, a sua rotina diária se torna mais leve, previsível e altamente eficiente.</p>
                 </div>
              </div>
            </AccordionCard>

            <AccordionCard title="Pontos Cegos & Alertas" icon={AlertTriangle}>
              <ul className="space-y-4 pt-4">
                <li className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                  <div>
                    <h5 className="font-bold text-white mb-1">Medo de Escassez</h5>
                    <p className="text-white/70 text-sm leading-relaxed">Cuidado para não cair na armadilha de segurar dinheiro em excesso por medo e deixar de investir em ferramentas, cursos ou melhorias que acelerariam seu crescimento.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                  <div>
                    <h5 className="font-bold text-white mb-1">Compras de Compensação</h5>
                    <p className="text-white/70 text-sm leading-relaxed">Evite usar o dinheiro para fazer compras impulsivas ou luxos desnecessários apenas para compensar picos de estresse da rotina.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                  <div>
                    <h5 className="font-bold text-white mb-1">Confundir Saldo com Valor</h5>
                    <p className="text-white/70 text-sm leading-relaxed">O dinheiro é uma ferramenta de segurança e liberdade, não a única métrica do seu valor como ser humano.</p>
                  </div>
                </li>
              </ul>
            </AccordionCard>

            <AccordionCard title="Protocolo Prático de Ativação" icon={Compass}>
              <div className="space-y-8 pt-4">
                {/* Ritual */}
                <div>
                  <h5 className="font-bold text-[#10b981] mb-2 uppercase text-xs tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3"/> O Ritual das Primeiras 24 Horas</h5>
                  <div className="bg-[#10b981]/5 border border-[#10b981]/10 p-5 rounded-xl">
                    <p className="text-white/80 text-sm leading-relaxed mb-4">No dia <strong>09/08/2027</strong>, no momento exato do seu Retorno Solar (05:30 UTC), dê um passo prático e consciente em direção à sua prosperidade:</p>
                    <ol className="list-decimal pl-4 space-y-2 text-sm text-white/70">
                      <li>Organize sua carteira física e limpe pendências digitais no celular.</li>
                      <li>Abra uma nova conta de investimento ou faça uma aplicação simbólica para ancorar a energia de acúmulo.</li>
                      <li>Evite compras por impulso ou parcelamentos desnecessários nas primeiras 24 horas para sintonizar a frequência de retenção e riqueza.</li>
                    </ol>
                  </div>
                </div>

                {/* Plano de Ação */}
                <div>
                  <h5 className="font-bold text-[#10b981] mb-3 uppercase text-xs tracking-widest flex items-center gap-2"><ListTodo className="w-3 h-3"/> Plano de Ação em 4 Passos</h5>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                      <span className="text-white/30 font-mono text-xs">01</span>
                      <p className="text-white/80 text-sm">Recalcule o preço da sua hora/serviço e elimine descontos emocionais.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                      <span className="text-white/30 font-mono text-xs">02</span>
                      <p className="text-white/80 text-sm">Estanque 100% dos vazamentos e assinaturas que você não usa no dia a dia.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                      <span className="text-white/30 font-mono text-xs">03</span>
                      <p className="text-white/80 text-sm">Crie uma reserva de emergência correspondente a pelo menos 3 meses do seu custo de vida.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                      <span className="text-white/30 font-mono text-xs">04</span>
                      <p className="text-white/80 text-sm">Reinvista uma porcentagem fixa do lucro da Fase 2 na melhoria da sua estrutura de trabalho.</p>
                    </div>
                  </div>
                </div>

                {/* Sinais */}
                <div>
                  <h5 className="font-bold text-[#10b981] mb-3 uppercase text-xs tracking-widest flex items-center gap-2"><CheckCircle2 className="w-3 h-3"/> Sinais de Ativação no Cotidiano</h5>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2"><div className="text-[#10b981] mt-0.5">✓</div> Você sente paz e firmeza ao passar um orçamento de alto valor sem hesitar.</li>
                    <li className="flex items-start gap-2"><div className="text-[#10b981] mt-0.5">✓</div> Surgem novos clientes dispostos a pagar pelo seu serviço sem pedir desconto.</li>
                    <li className="flex items-start gap-2"><div className="text-[#10b981] mt-0.5">✓</div> Sua planilha financeira fecha o mês com sobra de caixa consistente.</li>
                  </ul>
                </div>

                {/* Mantra */}
                <div>
                  <h5 className="font-bold text-white mb-2 uppercase text-xs tracking-widest flex items-center gap-2"><Sparkles className="w-3 h-3"/> O Mantra do Seu Ano</h5>
                  <div className="bg-black/40 border border-white/10 p-5 rounded-xl text-center italic text-[#10b981] text-lg font-serif">
                    "Eu reconheço o valor do meu trabalho, organizo minhas finanças e colho a estabilidade material que me pertence."
                  </div>
                </div>
              </div>
            </AccordionCard>
          </div>
          
          {/* Card de Suporte no Rodapé */}
          <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer">
            <div className="flex items-center gap-4">
              <Plane className="w-6 h-6 text-white/40" />
              <div>
                <h5 className="font-bold text-white mb-1">Não consegue viajar para Nova Iorque este ano?</h5>
                <p className="text-white/50 text-sm">Veja como ancorar essa mesma energia mais próxima de você.</p>
              </div>
            </div>
            <button className="whitespace-nowrap px-6 py-3 bg-white/10 rounded-full text-white text-sm font-bold uppercase tracking-widest hover:bg-white/20 transition-colors">
              Calcular Plano B
            </button>
          </div>
        </Reveal>
      </section>
      </div>
  );
}
`;

const revRegex = /\{\/\* ══════════════════════════════════════════════════\n\s*(5\. A REVELAÇÃO|ATO 2: POR QUE ESSE LUGAR MUDA TUDO)[\s\S]*$/;
if (revRegex.test(code)) {
    code = code.replace(revRegex, finalBlock);
} else {
    const fallbackIndex = code.indexOf('A Revelação.');
    if (fallbackIndex !== -1) {
        const sectionStart = code.lastIndexOf('<section', fallbackIndex);
        if (sectionStart !== -1) {
            code = code.substring(0, sectionStart) + finalBlock;
        }
    }
}

// Ensure icon imports
['Target', 'Compass', 'ListTodo', 'CheckCircle2'].forEach(icon => {
    if (!code.includes(icon + ',')) {
        code = code.replace('import { MapPin,', 'import { MapPin, ' + icon + ',');
    }
});
if (!code.includes('import React')) {
    // using React.useState, don't strictly need import if using global or can just import { useState }
}

fs.writeFileSync(file, code);
console.log('Final content injected successfully.');
