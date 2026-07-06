import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Estado vazio padronizado. Usado em listas, históricos, resultados vazios.
 */
const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="text-center py-16 md:py-20 px-4">
      {Icon && (
        <Icon
          className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4"
          aria-hidden="true"
        />
      )}
      <h2 className="font-cinzel text-lg md:text-xl font-bold text-foreground mb-2 uppercase tracking-wider">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-8 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)] transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
