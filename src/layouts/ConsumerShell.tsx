import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MobileAppChrome } from "./MobileAppChrome";
import { DesktopWebChrome } from "./DesktopWebChrome";
import StarryBackground from "@/components/StarryBackground";

export function ConsumerShell() {
  // O breakpoint operacional aprovado é 1024px (lg no Tailwind)
  // Abaixo de 1024px = MobileAppChrome (Phone & Tablet adaptação)
  // Acima de 1024px = DesktopWebChrome
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="relative min-h-screen bg-foundation-bg font-sans selection:bg-brand-primary/30">
      {/* Background Universal */}
      <StarryBackground />

      {/* 
        A árvore principal é montada garantindo a preservação do estado local das rotas filhas.
        O Outlet nunca é envolvido condicionalmente por componentes diferentes.
      */}
      {isDesktop ? <DesktopWebChrome /> : <MobileAppChrome />}

      {/* Wrapper de conteúdo */}
      {/* 
        No Mobile, a navegação de baixo precisa de padding-bottom.
        No Desktop, a navegação de cima precisa de padding-top.
      */}
      <main 
        className={`relative z-10 w-full h-full min-h-screen flex flex-col
          ${isDesktop ? "pt-14 pb-0" : "pt-0 pb-16"}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}
