import React from "react";

export const EditorialDivider = () => (
  <div className="flex items-center justify-center gap-2 my-2.5 pointer-events-none select-none">
    <div className="w-6 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
    <div className="w-6 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
  </div>
);
