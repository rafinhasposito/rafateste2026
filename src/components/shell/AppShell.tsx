/**
 * AppShell.tsx
 * Shell Global — Design System v2.0
 *
 * Wrapper global de telas. Responsabilidades:
 * - Aplicar safe areas (notch/home indicator)
 * - Orquestrar camadas de z-index (bg / conteúdo / nav / modais)
 * - Aplicar o CinematicBackground como fundo da tela
 *
 * NÃO contém: lógica de produto, routing, autenticação, estado de usuário.
 */
import React from "react";
import { CinematicBackground, type CinematicBackgroundProps } from "./CinematicBackground";

export interface AppShellProps
  extends Pick<CinematicBackgroundProps, "mode" | "intensity" | "globe" | "image"> {
  children: React.ReactNode;
  /** Remover o padding do safe-area (ex: telas full-bleed) */
  noSafeArea?: boolean;
  className?: string;
  /** Acessibilidade: id da região principal */
  mainId?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  mode = "discovery",
  intensity = "medium",
  globe = false,
  image,
  children,
  noSafeArea = false,
  className = "",
  mainId = "main-content",
}) => {
  return (
    <CinematicBackground
      mode={mode}
      intensity={intensity}
      globe={globe}
      image={image}
      className={className}
    >
      {/*
        Estrutura de camadas:
        z-[10]  → conteúdo (herdado do CinematicBackground)
        z-[20]  → navegação global (bottom nav, header fixo)
        z-[30]  → modais / drawers / toasts
        z-[40]  → popovers / tooltips
        z-[50]  → critical overlays (loading fullscreen, scanning)
      */}
      <main
        id={mainId}
        role="main"
        className={[
          "flex flex-col min-h-[100dvh] w-full",
          !noSafeArea && [
            "pt-[env(safe-area-inset-top)]",
            "pb-[env(safe-area-inset-bottom)]",
            "pl-[env(safe-area-inset-left)]",
            "pr-[env(safe-area-inset-right)]",
          ].join(" "),
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </main>
    </CinematicBackground>
  );
};
