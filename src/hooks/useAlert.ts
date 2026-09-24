import { useState, useCallback } from "react";
import { toast } from "sonner";

interface AlertProps {
  message: string | null;
}

export function useAlert() {
  const showAlert = useCallback((msg: string) => {
    toast(msg, {
      className: "!bg-quantum-900/95 !border !border-primary/50 !text-foreground !font-bold !uppercase !tracking-widest !text-xs",
      duration: 4000,
    });
  }, []);

  return { showAlert };
}
