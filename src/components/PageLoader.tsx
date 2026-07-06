import StarryBackground from "@/components/StarryBackground";

interface PageLoaderProps {
  label?: string;
}

/**
 * Loader de página inteira, padronizado.
 * Usado em rotas que carregam dados críticos antes de renderizar conteúdo.
 */
const PageLoader = ({ label = "Carregando..." }: PageLoaderProps) => {
  return (
    <>
      <StarryBackground />
      <div className="min-h-dvh flex items-center justify-center px-4">
        <p
          className="text-primary font-cinzel text-lg md:text-xl uppercase tracking-[0.2em] animate-pulse"
          role="status"
          aria-live="polite"
        >
          {label}
        </p>
      </div>
    </>
  );
};

export default PageLoader;
