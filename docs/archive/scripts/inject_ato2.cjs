const fs = require('fs');
const file = 'src/pages/AppleResultPreview.tsx';
let code = fs.readFileSync(file, 'utf8');

const startMarker = '{/* ══════════════════════════════════════════════════\\n         5. A REVELAÇÃO';

const newContent = `      {/* ══════════════════════════════════════════════════
         ATO 2: POR QUE ESSE LUGAR MUDA TUDO
         ══════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-24 border-t border-white/[0.02]">
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#10b981]" />
            </div>
            <h2 className="font-ps-display text-4xl md:text-5xl font-bold tracking-tight">A Revelação.</h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-6 text-white/70 text-lg md:text-xl font-light leading-[1.8] mb-20">
            <p>
              <strong className="text-white font-semibold">{P.firstName}</strong>, o mapa revela que o seu próximo ciclo é regido pela energia da <strong className="text-white font-semibold">Casa {P.house} — Dinheiro, Valor e Segurança</strong>.
            </p>
            
            <div className="pl-6 border-l-2 border-white/10 py-2 my-8">
              <p>
                No dia <strong>09/08/2027</strong>, exatamente às <strong>05:30 (UTC)</strong>, o seu Sol retorna à posição exata do seu nascimento. Ao passar este momento milimétrico nas coordenadas <span className="font-mono text-sm text-[#10b981]">[{P.coords}]</span> em <strong>{P.city}</strong>, a rotação da Terra ativará a sua Casa {P.house} para os próximos 365 dias.
              </p>
            </div>

            <p>
              Isso significa que este será um ano focado em melhorar sua relação com o dinheiro, organizar suas contas, aumentar seus ganhos de trabalho e construir estabilidade material.
            </p>
          </div>
        </Reveal>

        {/* OS 3 PILARES */}
        <Reveal delay={0.2}>
          <h3 className="font-ps-display text-2xl font-bold mb-8 text-white/90">Os 3 Pilares do Seu Ciclo.</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {/* Pilar 1 */}
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] transition-colors group">
              <span className="text-[#10b981]/40 font-mono text-sm font-bold tracking-widest mb-4 block group-hover:text-[#10b981] transition-colors">01</span>
              <h4 className="text-xl font-bold text-white mb-4">Fazer o Dinheiro Render</h4>
              <p className="text-white/50 text-sm leading-relaxed">
                Seu ano gira em torno de dinheiro, valor pessoal e segurança material. Mais clareza para gerir o que ganha, capacidade de planejar compras importantes e uma rotina muito mais produtiva.
              </p>
            </div>
            {/* Pilar 2 */}
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] transition-colors group">
              <span className="text-[#10b981]/40 font-mono text-sm font-bold tracking-widest mb-4 block group-hover:text-[#10b981] transition-colors">02</span>
              <h4 className="text-xl font-bold text-white mb-4">Cobrar o Valor Justo</h4>
              <p className="text-white/50 text-sm leading-relaxed">
                Você sentirá necessidade de rever seus preços, buscar formas de rentabilizar suas habilidades e focar em projetos que tragam resultados práticos e tangíveis.
              </p>
            </div>
            {/* Pilar 3 */}
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] transition-colors group">
              <span className="text-[#10b981]/40 font-mono text-sm font-bold tracking-widest mb-4 block group-hover:text-[#10b981] transition-colors">03</span>
              <h4 className="text-xl font-bold text-white mb-4">Construir Estabilidade</h4>
              <p className="text-white/50 text-sm leading-relaxed">
                Ter uma reserva financeira estruturada trará a calma mental necessária para você render e viver melhor. Foco em acumulação inteligente e investimento seguro.
              </p>
            </div>
          </div>
        </Reveal>

        {/* PERFIL ASTROLÓGICO CRUZADO */}
        <Reveal delay={0.3}>
          <div className="bg-gradient-to-br from-[#10b981]/10 to-transparent border border-[#10b981]/20 rounded-[32px] p-8 md:p-12 mb-20">
            <h3 className="font-ps-display text-2xl font-bold mb-8 text-white/90">Seu Perfil no Ciclo.</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Sun className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-bold tracking-widest uppercase text-xs">Sol em Leão × Casa 2</span>
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">Generoso e Ambicioso</h4>
                <p className="text-white/60 mb-6 leading-relaxed text-sm">
                  Como leonino, você monetiza seus talentos autorais e sua marca pessoal com alto valor percebido. A Casa 2 transforma criatividade e prestígio em patrimônio real.
                </p>
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <span className="block text-white/30 text-[10px] uppercase tracking-widest mb-2">Mantra do Signo</span>
                  <p className="text-[#10b981] text-sm italic">"O meu talento e a minha imagem geram prosperidade e valorização do meu trabalho."</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-[#10b981]" />
                  <span className="text-[#10b981] font-bold tracking-widest uppercase text-xs">Fase Adulto × Casa 2</span>
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">Consolidação de Bases</h4>
                <p className="text-white/60 mb-6 leading-relaxed text-sm">
                  Ano de consolidação de bases materiais e reavaliação de prioridades. Você busca segurança sólida para sustentar suas escolhas de vida com responsabilidade.
                </p>
                <div className="bg-[#10b981]/5 rounded-xl p-4 border border-[#10b981]/10">
                  <span className="block text-white/30 text-[10px] uppercase tracking-widest mb-2">Conselho Financeiro</span>
                  <p className="text-white/80 text-sm">Proteja seu patrimônio, otimize sua gestão orçamentária e evite assumir riscos financeiros desnecessários.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <span className="block text-amber-500 text-xs font-bold uppercase tracking-widest mb-1">Alerta do Perfil</span>
                  <p className="text-white/50 text-sm">Cuidado para não medir seu valor pessoal ou o sucesso de uma relação apenas por métricas financeiras. Sua estabilidade atrai parceiros de projetos dispostos a somar recursos para construção conjunta.</p>
                </div>
            </div>
          </div>
        </Reveal>

        {/* DIAGNÓSTICO DO FOCO */}
        <Reveal delay={0.4}>
          <h3 className="font-ps-display text-2xl font-bold mb-8 text-white/90">Diagnóstico do Foco.</h3>
          <div className="bg-[#02160F] border border-white/10 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
              <div className="text-9xl font-ps-display font-bold text-[#10b981] tracking-tighter">98%</div>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10b981]/20 border border-[#10b981]/30 rounded-full text-[#10b981] text-[10px] font-bold tracking-widest mb-6">
                <Star className="w-3 h-3" />
                98% MATCH — DINHEIRO & RECURSOS
              </div>
              <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
                A estratégia perfeita para quem quer organizar a vida financeira e acumular patrimônio. A energia da Casa 2 tende a facilitar a precificação justa do seu tempo e o crescimento dos seus rendimentos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h5 className="text-[#10b981] font-bold text-sm uppercase tracking-widest mb-3">De Onde Vem o Dinheiro</h5>
                  <p className="text-white/50 text-sm">A renda vem da sua habilidade de rentabilizar suas competências. Cobranças justas, novos clientes e precificação inteligente estão muito favorecidos.</p>
                </div>
                <div>
                  <h5 className="text-[#10b981] font-bold text-sm uppercase tracking-widest mb-3">Impacto no Trabalho</h5>
                  <p className="text-white/50 text-sm">Momento ideal para pedir aumento, procurar clientes melhores, cobrar de forma justa e mudar a sua forma de gerir o seu negócio.</p>
                </div>
                <div>
                  <h5 className="text-[#10b981] font-bold text-sm uppercase tracking-widest mb-3">Impacto no Amor</h5>
                  <p className="text-white/50 text-sm">Você buscará estabilidade. Dinheiro, conforto, compras para a casa e planos futuros de patrimônio ganham importância no relacionamento.</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
         RESTO DA PÁGINA OCULTADA (ATO 3 E ATO 4 SERÃO ACORDEÕES AQUI DEPOIS)
         ══════════════════════════════════════════════════ */}
      </div>
    </main>
  );
};
export default AppleResultPreview;`;

// Let's use regex to replace everything from "5. A REVELAÇÃO" to the end of the file.
const regex = /\{\/\* ══════════════════════════════════════════════════\n\s*5\. A REVELAÇÃO[\s\S]*$/;
if (regex.test(code)) {
  code = code.replace(regex, newContent);
  fs.writeFileSync(file, code);
  console.log("Act 2 successfully injected.");
} else {
  console.log("Regex failed.");
}
