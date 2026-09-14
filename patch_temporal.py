import re

with open('src/components/TemporalSelection.tsx', 'r') as f:
    content = f.read()

# We need to replace the entire MobileTimeline function.
mobile_func_pattern = re.compile(r"function MobileTimeline\(\{ onSelectMode \}: Props\) \{.*?(?=// ─── Main Export ─────────────────────────────────────────────────────────────)", re.DOTALL)

new_mobile_func = """function MobileTimeline({ onSelectMode }: Props) {
  return (
    <div className="relative w-full min-h-[100svh] overflow-y-auto overflow-x-hidden flex flex-col bg-ps-void">
      {/* Background image — Terra */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/temporal-mobile-bg-v3.png"
          alt=""
          className="w-full h-[85%] object-cover object-bottom absolute bottom-0"
          style={{ objectPosition: "center bottom" }}
          draggable={false}
        />
        {/* Dark transition from top to bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-ps-void via-ps-void/80 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col w-full min-h-[100svh] px-5 pb-24"
        style={{ paddingTop: "max(env(safe-area-inset-top, 16px), 16px)" }}
      >
        {/* ── Brand header ── */}
        <div className="flex justify-center w-full mt-4 mb-10">
          <img
            src="/brand/protocolo-solar-logo-horizontal-4096.png"
            alt="Protocolo Solar"
            className="w-[250px] max-w-[70vw] h-auto drop-shadow-md"
            draggable={false}
          />
        </div>

        {/* ── Main Promise ── */}
        <div className="text-center mb-10">
          <h1 className="font-ps-display text-[36px] text-ps-champagne mb-4 leading-[1.1] drop-shadow-md max-w-[320px] mx-auto">
            Descubra onde passar seu próximo aniversário.
          </h1>
          <p className="font-ps-ui text-[16px] text-ps-text opacity-90 max-w-[300px] mx-auto leading-relaxed drop-shadow">
            Sua Revolução Solar revela os destinos mais alinhados ao ciclo que você deseja viver.
          </p>
        </div>

        {/* ── Main Action ── */}
        <div className="w-full max-w-[320px] mx-auto mb-12">
          <button
            onClick={() => onSelectMode("futuro")}
            className="w-full h-[56px] rounded-full bg-ps-gold text-ps-void font-ps-display text-lg tracking-wide flex items-center justify-center hover:bg-ps-gold-deep active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(201,162,39,0.4)]"
          >
            DESCOBRIR MEU DESTINO
          </button>
        </div>

        {/* ── Secondary Paths ── */}
        <div className="w-full max-w-[320px] mx-auto flex-1 flex flex-col justify-end">
          <h3 className="font-ps-ui text-[11px] text-ps-muted uppercase tracking-[0.2em] text-center mb-5">
            Explorar Outros Ciclos
          </h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => onSelectMode("presente")}
              className="w-full min-h-[64px] rounded-xl bg-ps-surface border border-white/5 flex items-center px-5 focus:outline-none active:scale-[0.98] transition-transform"
            >
              <div className="flex-1 text-left">
                <span className="block font-ps-display text-white text-[17px] mb-0.5">Presente</span>
                <span className="block font-ps-ui text-ps-muted text-[13px]">Entender meu ciclo atual</span>
              </div>
              <div className="text-ps-gold text-xl opacity-80">→</div>
            </button>
            <button
              onClick={() => onSelectMode("passado")}
              className="w-full min-h-[64px] rounded-xl bg-ps-surface border border-white/5 flex items-center px-5 focus:outline-none active:scale-[0.98] transition-transform"
            >
              <div className="flex-1 text-left">
                <span className="block font-ps-display text-white text-[17px] mb-0.5">Passado</span>
                <span className="block font-ps-ui text-ps-muted text-[13px]">Revisar meu ciclo anterior</span>
              </div>
              <div className="text-ps-gold text-xl opacity-80">→</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"""

content = mobile_func_pattern.sub(new_mobile_func, content)

with open('src/components/TemporalSelection.tsx', 'w') as f:
    f.write(content)
