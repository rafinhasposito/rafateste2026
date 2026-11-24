import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-sans font-semibold transition-all duration-200 ease-[var(--ease-out)] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB344] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060911] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[#F6D36B] to-[#E6AB3B] text-[#070A12] font-bold shadow-[0_8px_24px_rgba(234,179,68,0.25),inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105",
        destructive: "bg-status-error text-white hover:opacity-90",
        outline:
          "border border-white/15 bg-white/[0.04] hover:bg-white/[0.09] hover:border-[#EAB344]/45 text-[#F8FAFC]",
        secondary:
          "bg-[#111A2E] border border-white/10 text-[#F8FAFC] hover:bg-[#17233D]",
        ghost: "hover:bg-white/[0.06] text-[#F8FAFC]",
        link: "text-[#EAB344] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-[var(--radius-sm)] px-3.5 text-xs",
        lg: "h-12 rounded-full px-7 text-[15px]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
