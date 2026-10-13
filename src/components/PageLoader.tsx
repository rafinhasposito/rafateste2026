import ScanningOverlay from "@/components/ScanningOverlay";

interface PageLoaderProps {
  label?: string;
}

/**
 * Loader de página inteira, padronizado com anéis orbitais e estética cósmica Apple.
 * Usado em rotas que carregam dados críticos antes de renderizar conteúdo.
 */
const PageLoader = ({ label = "Carregando mapa estelar..." }: PageLoaderProps) => {
  return (
    <ScanningOverlay
      visible={true}
      title={label}
      mode="futuro"
    />
  );
};

export default PageLoader;
