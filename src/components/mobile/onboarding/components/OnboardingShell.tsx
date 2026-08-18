import React from "react";

export const OnboardingShell = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-full h-[100svh] overflow-hidden bg-[#030306] text-white font-sans select-none flex flex-col">
    {children}
  </div>
);
