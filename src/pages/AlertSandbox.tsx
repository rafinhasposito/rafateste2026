import React from 'react';
import { AlertTriangle, EyeOff, ShieldAlert, Zap } from 'lucide-react';

export default function AlertSandbox() {
  const color = "#10b981"; // Casa Dinheiro
  
  const alertTitle = "O Ponto Cego: Autossabotagem";
  const alertText = "A euforia desta configuração astrológica atrai muitas oportunidades rápidas, mas também um impulso irresistível para o desperdício. O seu maior risco aqui é confundir 'alto fluxo financeiro' com 'patrimônio consolidado'. Não adianta faturar 3x mais se o seu custo de vida aumentar na mesma proporção apenas por vaidade e deslumbramento com a cidade.";
  const alertAction = "Ação de Blindagem: Congele 30% de todo lucro novo no momento em que ele tocar a sua conta, antes de tomar qualquer decisão de gasto.";

  return (
    <div className="min-h-screen bg-[#03100B] text-white font-sans overflow-x-hidden pb-40">
      
      <div className="max-w-4xl mx-auto px-5 pt-20 pb-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Sandbox: Bloco 6 (Alertas)</h1>
        <p className="text-white/60">Como a Apple mostraria uma vulnerabilidade ou risco de segurança no seu comportamento.</p>
      </div>

      {/* =========================================
          V1: O CARD DE PRIVACIDADE APPLE (Amber/Soft)
          ========================================= */}
      <section className="mb-40 border-b border-white/5 pb-20">
        <div className="max-w-6xl mx-auto px-5 text-center mb-10">
          <h2 className="text-2xl font-bold text-amber-500">V1: O Card "Privacy Apple"</h2>
          <p className="text-white/50 text-sm mt-2">Usa a estética de "Aviso de Privacidade/Segurança" do iOS. Vidro sutil, ícone de alerta âmbar, visual muito contido e oficial.</p>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6">
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-[32px] p-8 md:p-12 relative overflow-hidden backdrop-blur-xl">
            {/* Soft glow in corner */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 relative z-10">
              <div className="shrink-0 flex items-start">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <h3 className="font-ps-display text-2xl md:text-3xl font-medium text-white mb-4">
                  {alertTitle}
                </h3>
                <p className="text-white/70 text-lg font-light leading-relaxed mb-6">
                  {alertText}
                </p>
                
                <div className="bg-black/30 rounded-2xl p-5 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-4 h-4 text-amber-500/70" />
                    <span className="font-mono text-xs uppercase tracking-widest text-amber-500/70 font-bold">Protocolo de Defesa</span>
                  </div>
                  <p className="text-white/90 font-medium">
                    {alertAction}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          V2: O MODO AMEAÇA CRÍTICA (Dark Red / Monospace)
          ========================================= */}
      <section className="mb-40 border-b border-white/5 pb-20">
        <div className="max-w-6xl mx-auto px-5 text-center mb-10">
          <h2 className="text-2xl font-bold text-red-500">V2: O Modo Ameaça (Sombrio)</h2>
          <p className="text-white/50 text-sm mt-2">Muito mais agressivo e dramático. Lembra um painel detectando uma invasão no sistema. Cria senso de urgência absoluto.</p>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6">
          <div className="bg-black rounded-3xl border border-red-900/50 p-1 relative overflow-hidden shadow-[0_0_40px_rgba(239,68,68,0.1)]">
            
            <div className="bg-[#050505] rounded-[28px] p-8 md:p-14 relative z-10 flex flex-col items-center text-center border border-white/[0.02]">
              
              <div className="flex items-center gap-3 mb-8 px-4 py-1.5 bg-red-500/10 rounded-full border border-red-500/20">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                 <span className="font-mono text-xs tracking-widest uppercase text-red-400 font-bold">Risco Detectado</span>
              </div>
              
              <h3 className="font-ps-display text-4xl md:text-5xl font-bold text-white mb-8 tracking-tighter">
                O Ponto Cego.
              </h3>
              
              <p className="text-red-100/60 text-lg md:text-xl font-light leading-relaxed max-w-2xl mb-12">
                {alertText}
              </p>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent mb-12"></div>
              
              <div className="text-left w-full max-w-2xl">
                 <span className="font-mono text-xs tracking-[0.2em] uppercase text-red-500 block mb-3"> Override System_</span>
                 <p className="text-white text-xl font-serif italic">
                   "{alertAction}"
                 </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          V3: O MINIMALISMO CORTANTE (Editorial P&B com a Cor da Casa)
          ========================================= */}
      <section className="mb-40">
        <div className="max-w-6xl mx-auto px-5 text-center mb-10">
          <h2 className="text-2xl font-bold text-white">V3: O Minimalismo Cortante</h2>
          <p className="text-white/50 text-sm mt-2">Sem vermelho, sem drama excessivo. Foco em tipografia gigante e uma linha divisória dura. É a versão mais "madura" e sofisticada.</p>
        </div>

        <div className="w-full max-w-5xl mx-auto px-6 py-20 flex flex-col md:flex-row gap-16 border-t-[1px] border-white/20 pt-20">
          
          <div className="md:w-1/3 shrink-0">
            <div className="sticky top-32">
              <EyeOff className="w-12 h-12 mb-6 text-white/40" />
              <h3 className="font-ps-display text-4xl md:text-5xl font-bold text-white tracking-tighter leading-tight mb-4">
                A Sombra<br />da Casa.
              </h3>
              <p className="font-mono text-xs tracking-widest uppercase" style={{ color }}>
                Risco de Autossabotagem
              </p>
            </div>
          </div>

          <div className="md:w-2/3 flex flex-col gap-10">
            <p className="text-white/70 text-2xl font-light leading-relaxed">
              A euforia desta configuração atrai oportunidades rápidas, <strong className="text-white font-medium">mas também um impulso irresistível para o desperdício.</strong> O seu maior risco aqui é confundir fluxo financeiro com patrimônio consolidado.
            </p>
            
            <p className="text-white/70 text-xl font-light leading-relaxed">
              Não adianta faturar 3x mais se o seu custo de vida aumentar na mesma proporção apenas por vaidade e deslumbramento com a cidade.
            </p>

            <div className="mt-8 p-8 bg-white/5 rounded-2xl border-l-2" style={{ borderColor: color }}>
              <span className="font-mono text-[10px] tracking-widest uppercase text-white/40 block mb-3">A Regra de Ouro</span>
              <p className="text-white text-lg font-serif italic">
                Congele 30% de todo lucro novo no momento em que ele tocar a sua conta, antes de tomar qualquer decisão de gasto.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
