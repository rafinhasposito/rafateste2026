import React from "react";
import { cn } from "@/lib/utils";

export const StepProgress = ({ current, total }: { current: number, total: number }) => (
  <div className="flex gap-2 items-center">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={cn(
          "h-[2px] rounded-full transition-all duration-500",
          i === current ? "w-8 bg-[#D4AF37]" : "w-3 bg-white/20"
        )}
      />
    ))}
  </div>
);
