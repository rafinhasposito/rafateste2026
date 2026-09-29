const fs = require('fs');
let file = 'src/pages/AppleResultPreview.tsx';
let code = fs.readFileSync(file, 'utf8');

const majesticSections = `
      {/* ══════════════════════════════════════════════════
         NOVO: PLANO DE AÇÃO EM 4 PASSOS
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 border-t border-white/[0.02]">
        <Reveal className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <ListTodo className="w-8 h-8 text-[#10b981]" />
            <h2 className="font-ps-display text-4xl md:text-5xl font-bold tracking-tight">Plano de Ação.</h2>
          </div>
          <p className="text-white/50 text-xl font-light">Seu roteiro prático para materializar o ciclo da Casa {P.house}.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reveal delay={0.1} className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 text-9xl font-ps-display font-bold text-white/[0.02] group-hover:text-[#10b981]/5 transition-colors pointer-events-none">01</div>
            <h4 className="text-[#10b981] font-bold tracking-widest text-sm uppercase mb-4">Precificação</h4>
            <p className="text-white/80 text-lg leading-relaxed relative z-10">Recalcule o preço da sua hora/serviço e elimine descontos emocionais.</p>
          </Reveal>
          <Reveal delay={0.2} className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 text-9xl font-ps-display font-bold text-white/[0.02] group-hover:text-[#10b981]/5 transition-colors pointer-events-none">02</div>
            <h4 className="text-[#10b981] font-bold tracking-widest text-sm uppercase mb-4">Estancamento</h4>
            <p className="text-white/80 text-lg leading-relaxed relative z-10">Estanque 100% dos vazamentos e assinaturas que você não usa no dia a dia.</p>
          </Reveal>
          <Reveal delay={0.3} className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 text-9xl font-ps-display font-bold text-white/[0.02] group-hover:text-[#10b981]/5 transition-colors pointer-events-none">03</div>
            <h4 className="text-[#10b981] font-bold tracking-widest text-sm uppercase mb-4">Segurança</h4>
            <p className="text-white/80 text-lg leading-relaxed relative z-10">Crie uma reserva de emergência correspondente a pelo menos 3 meses do seu custo de vida.</p>
          </Reveal>
          <Reveal delay={0.4} className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 text-9xl font-ps-display font-bold text-white/[0.02] group-hover:text-[#10b981]/5 transition-colors pointer-events-none">04</div>
            <h4 className="text-[#10b981] font-bold tracking-widest text-sm uppercase mb-4">Reinvestimento</h4>
            <p className="text-white/80 text-lg leading-relaxed relative z-10">Reinvista uma porcentagem fixa do lucro na melhoria da sua estrutura de trabalho.</p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         NOVO: SINAIS DE ATIVAÇÃO
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 border-t border-white/[0.02]">
        <Reveal className="mb-16 text-center">
          <h2 className="font-ps-display text-4xl md:text-5xl font-bold tracking-tight mb-4">Sinais de Ativação.</h2>
          <p className="text-white/50 text-xl font-light">Como saber se você já está vibrando na frequência do seu ciclo.</p>
        </Reveal>
        <div className="max-w-4xl mx-auto space-y-6">
          <Reveal delay={0.1} className="flex items-center gap-6 bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[24px]">
            <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center shrink-0 border border-[#10b981]/20">
              <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
            </div>
            <p className="text-white/80 text-lg leading-relaxed">Você sente paz e firmeza ao passar um orçamento de alto valor sem hesitar.</p>
          </Reveal>
          <Reveal delay={0.2} className="flex items-center gap-6 bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[24px]">
            <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center shrink-0 border border-[#10b981]/20">
              <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
            </div>
            <p className="text-white/80 text-lg leading-relaxed">Surgem novos clientes dispostos a pagar pelo seu serviço sem pedir desconto.</p>
          </Reveal>
          <Reveal delay={0.3} className="flex items-center gap-6 bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[24px]">
            <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center shrink-0 border border-[#10b981]/20">
              <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
            </div>
            <p className="text-white/80 text-lg leading-relaxed">Sua planilha financeira fecha o mês com sobra de caixa consistente.</p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         NOVO: MANTRA
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-24 md:py-40 border-t border-white/[0.02] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.05)_0%,transparent_60%)] pointer-events-none" />
        <Reveal className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[#10b981] font-bold tracking-[0.3em] uppercase text-sm mb-10 block">O Mantra do Seu Ano</span>
          <p className="font-serif italic text-4xl md:text-6xl text-white/90 leading-[1.4] md:leading-[1.4] drop-shadow-2xl">
            "Eu reconheço o valor do meu trabalho, organizo minhas finanças e colho a estabilidade material que me pertence."
          </p>
        </Reveal>
      </section>

`;

const splitStr = '{/* ══════════════════════════════════════════════════\n         11. PLANO B';
if (code.includes(splitStr)) {
    code = code.replace(splitStr, majesticSections + splitStr);
    
    // Add missing icons
    const missingIcons = ['ListTodo', 'CheckCircle2'];
    missingIcons.forEach(icon => {
        if (!code.includes(icon + ',')) {
            code = code.replace('import { MapPin,', 'import { MapPin, ' + icon + ',');
        }
    });

    fs.writeFileSync(file, code);
    console.log('Majestic sections injected!');
} else {
    console.log('Could not find insert target (Plan B)');
}
