const fs = require('fs');
let file = 'src/pages/AppleResultPreview.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Move Boarding Pass
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

// 2. Fix Boarding Pass Closed Preview
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

// 3. Remove Badges
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


// 4. Update A REVELAÇÃO
const oldRevelacaoText = 'Isso significa que este será um ano em que pessoas, amizades, grupos, internet e novos contatos terão um papel muito maior na realização dos seus objetivos práticos. <span className="text-white border-b border-white/20 pb-0.5">O universo pede que você pare de caminhar sozinho.</span>';
const newRevelacaoText = 'Esta é a casa clássica da <strong>Prosperidade, do Valor Pessoal e da Estabilidade Material</strong>. Para o seu momento de vida com a força do seu Sol em Leão e a precisão do Ascendente em Virgem, este ciclo não se trata de trabalhar mais no esforço cego, mas sim de <span className="text-[#10b981] font-medium border-b border-[#10b981]/30 pb-0.5">sistematizar o seu talento para cobrar o valor justo e construir segurança sólida.</span>';
code = code.replace(oldRevelacaoText, newRevelacaoText);


// 5. Update DNA CÓSMICO (Wait, there are two cards: "Visionário" and "Colaborativo". We change to "Prosperidade" and "Valorização")
code = code.replace('Visionário Pragmático', 'Prosperidade & Ganhos');
code = code.replace('O Sol em Leão e o Ascendente Virgem focam suas ideias (Casa 11) em resultados úteis e aplicáveis.', 'O ciclo facilita a atração de recursos, a criação de novas fontes de renda e a negociação de contratos mais lucrativos.');

code = code.replace('Líder Colaborativo', 'Valorização & Precificação');
code = code.replace('Você naturalmente assume a frente de projetos coletivos, mas seu lado adulto pede para delegar sem perder o controle de qualidade.', 'O seu Sol em Leão com Virgem exige que perca a timidez de cobrar caro. Reconheça o valor da sua entrega e renegocie preços.');

code = code.replace('Cuidado para não carregar pessoas nas costas. Sua rede deve ser uma alavanca, não uma âncora.', 'Ganhar bem só traz paz se bem gerido. Estanque vazamentos financeiros, organize planilhas e crie uma reserva inabalável.');

code = code.replace('"Minha autenticidade atrai as pessoas certas e meus grupos multiplicam meus resultados."', '"O meu talento e a minha imagem geram prosperidade, organizam minhas finanças e multiplicam meus resultados."');


// 6. Update CRONOGRAMA
code = code.replace('Fase 1: Conexão', 'Fase 1: Diagnóstico & Limpeza');
code = code.replace('Meses 1 a 4', 'Meses 1 a 3');
code = code.replace('Sincronização', 'Organização');
code = code.replace('Aproxime-se de pessoas alinhadas ao seu novo momento.', 'Listar todas as suas contas, renegociar contratos, e reajustar a sua tabela de preços. Arrume a casa.');

code = code.replace('Fase 2: Expansão', 'Fase 2: Pico de Receita');
code = code.replace('Meses 5 a 8', 'Meses 4 a 8');
code = code.replace('Liderança', 'Prospecção de alto valor');
code = code.replace('Assuma a frente de projetos. Coloque sua voz no mundo.', 'Prospecte clientes melhores, apresente propostas de maior valor, lance novos serviços.');

code = code.replace('Fase 3: Colheita', 'Fase 3: Consolidação');
// Meses 9 a 12 is same
code = code.replace('Filtro', 'Investimento seguro');
code = code.replace('Selecione quem realmente fica para o próximo ciclo.', 'Consolide o capital acumulado ao longo do ano, garantindo fôlego para planejar compras maiores com total tranquilidade.');


// 7. Update PONTOS CEGOS & RITUAL
code = code.replace('A Arrogância Intelectual', 'O Medo de Escassez');
code = code.replace('Achar que a sua ideia é sempre a melhor e não ouvir o feedback do grupo.', 'Segurar dinheiro em excesso por medo e deixar de investir em ferramentas que acelerariam seu crescimento.');

code = code.replace('A Exaustão Social', 'Compras de Compensação');
code = code.replace('Dizer sim para todos os eventos e esvaziar sua própria energia vital.', 'Usar o dinheiro para compras impulsivas ou luxos apenas para compensar picos de estresse da rotina.');

code = code.replace('Falsos Aliados', 'Saldo não é Valor');
code = code.replace('Pessoas que se aproximam pelo seu brilho, mas não somam na construção.', 'O dinheiro é uma ferramenta de segurança e liberdade, não a única métrica do seu valor.');


// 8. Update RITUAL 
code = code.replace('No dia 09/08/2027, exatamente às 05:30 (UTC), na cidade de Nova Iorque:', 'No dia 09/08/2027, exatamente às 05:30 (UTC), dê um passo prático em direção à prosperidade:');
code = code.replace('Faça um post, um áudio ou mande uma mensagem marcando presença na sua rede.', 'Organize sua carteira física e limpe pendências digitais no celular.');
code = code.replace('Liste 3 pessoas-chave que você quer trazer para perto este ano e mande um "oi".', 'Abra uma nova conta de investimento ou faça uma aplicação simbólica de acúmulo.');
code = code.replace('Evite ficar 100% isolado nas primeiras 24 horas.', 'Evite compras por impulso ou parcelamentos desnecessários nas primeiras 24 horas.');

fs.writeFileSync(file, code);
console.log('Text injected in original layout.');
