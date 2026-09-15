import React from "react";

export const BrandHeader = ({ step = 0, totalSteps = 6 }: { step?: number; totalSteps?: number }) => (
  <header className="w-full flex flex-col items-center pt-8 pb-2 shrink-0 pointer-events-none z-40 relative">
    {/* Step counter */}
    <div className="absolute top-8 right-6 font-ps-ui text-[11px] font-semibold tracking-widest text-ps-gold/80">
      {step + 1}/{totalSteps}
    </div>

    {/* Official logo */}
    <img
      src="/brand/protocolo-solar-logo-horizontal-4096.png"
      alt="Protocolo Solar"
      className="h-8 w-auto drop-shadow-lg"
      draggable={false}
    />
  </header>
);
