/**
 * PageContainer.tsx
 * Shell Global — Design System v2.0
 *
 * Define largura máxima, padding horizontal e vertical padrão.
 * Garante que nenhuma tela invente seu próprio layout.
 *
 * Tamanhos mapeados ao Design System:
 * sm  → 640px  (formulários estreitos, onboarding)
 * md  → 768px  (conteúdo principal mobile-first)
 * lg  → 1024px (layouts de duas colunas)
 * xl  → 1280px (dashboards, tabelas)
 * full→ sem restrição de largura
 */
import React from "react";

export type PageContainerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface PageContainerProps {
  size?: PageContainerSize;
  /** Remove padding horizontal (ex: grids que precisam sangrar) */
  noPaddingX?: boolean;
  /** Remove padding vertical (ex: quando AppShell já define) */
  noPaddingY?: boolean;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

const maxWidths: Record<PageContainerSize, string> = {
  sm:   "max-w-screen-sm",  // 640px
  md:   "max-w-screen-md",  // 768px
  lg:   "max-w-screen-lg",  // 1024px
  xl:   "max-w-screen-xl",  // 1280px
  full: "max-w-none",
};

export const PageContainer: React.FC<PageContainerProps> = ({
  size = "lg",
  noPaddingX = false,
  noPaddingY = false,
  children,
  className = "",
  as: Tag = "div",
}) => {
  const classes = [
    "w-full mx-auto",
    maxWidths[size],
    !noPaddingX && "px-4 sm:px-6 md:px-8",
    !noPaddingY && "py-8 md:py-12",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes}>{children}</Tag>;
};
