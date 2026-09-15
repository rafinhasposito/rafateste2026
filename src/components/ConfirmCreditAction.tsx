import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreditCard, AlertTriangle } from "lucide-react";

interface ConfirmCreditActionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  credits: number;
  currentBalance: number;
  irreversible?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

/**
 * Modal padrão de confirmação para ações que consomem créditos.
 * Mostra: custo, saldo atual, saldo após, e aviso de irreversibilidade.
 */
const ConfirmCreditAction = ({
  open,
  onOpenChange,
  onConfirm,
  title = "Confirmar consumo de créditos",
  description,
  credits,
  currentBalance,
  irreversible = true,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,
}: ConfirmCreditActionProps) => {
  const insufficient = currentBalance < credits;
  const afterBalance = Math.max(0, currentBalance - credits);
  const plural = credits > 1 ? "s" : "";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <AlertDialogTitle className="font-ps-display uppercase tracking-wider text-base">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-left">
              {description && (
                <p className="text-sm text-foreground/80">{description}</p>
              )}
              <div className="rounded-lg border border-border/60 bg-card/40 p-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Custo desta ação</span>
                  <span className="font-semibold text-foreground">
                    {credits} crédito{plural}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saldo atual</span>
                  <span className="font-semibold text-foreground">
                    {currentBalance} crédito{currentBalance === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/50 pt-1.5">
                  <span className="text-muted-foreground">Saldo após</span>
                  <span
                    className={`font-semibold ${
                      insufficient ? "text-destructive" : "text-primary"
                    }`}
                  >
                    {insufficient ? "insuficiente" : `${afterBalance} crédito${afterBalance === 1 ? "" : "s"}`}
                  </span>
                </div>
              </div>
              {irreversible && (
                <p className="flex items-start gap-2 text-[11px] text-amber-500/90">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    Os créditos serão debitados imediatamente ao confirmar. Esta
                    ação não pode ser desfeita.
                  </span>
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading || insufficient}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading
              ? "Processando..."
              : insufficient
                ? "Saldo insuficiente"
                : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmCreditAction;
