import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-sans uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-state-focus focus:ring-offset-2 focus:ring-offset-foundation-bg",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20",
        secondary: "border-transparent bg-brand-secondary text-brand-secondary-fg hover:bg-brand-secondary/80",
        destructive: "border-transparent bg-status-error/10 text-status-error hover:bg-status-error/20",
        outline: "text-foundation-fg border-surface-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
