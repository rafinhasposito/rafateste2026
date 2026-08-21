import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-[var(--radius-md)] border border-surface-border bg-surface px-4 py-2 text-base text-foundation-fg ring-offset-foundation-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foundation-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)] transition-all duration-200 md:text-sm font-sans",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
