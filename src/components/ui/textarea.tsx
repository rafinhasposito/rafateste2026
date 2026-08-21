import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-[var(--radius-md)] border border-surface-border bg-surface px-4 py-3 text-sm text-foundation-fg ring-offset-foundation-bg placeholder:text-foundation-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)] transition-all duration-200 font-sans",
          className,
        )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
