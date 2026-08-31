/**
 * src/components/shell/index.ts
 * Shell Global — Design System v2.0
 *
 * Barrel export de todos os componentes do shell.
 * Importe sempre daqui:
 *   import { AppShell, PremiumCard, PremiumButton } from "@/components/shell";
 */
export { CinematicBackground } from "./CinematicBackground";
export type { CinematicBackgroundProps, BackgroundMode, BackgroundIntensity } from "./CinematicBackground";

export { AppShell } from "./AppShell";
export type { AppShellProps } from "./AppShell";

export { PageContainer } from "./PageContainer";
export type { PageContainerProps, PageContainerSize } from "./PageContainer";

export { PremiumCard } from "./PremiumCard";
export type { PremiumCardProps, PremiumCardVariant } from "./PremiumCard";

export { PremiumButton } from "./PremiumButton";
export type { PremiumButtonProps, PremiumButtonVariant, PremiumButtonSize } from "./PremiumButton";

export { SectionHeader } from "./SectionHeader";
export type { SectionHeaderProps, SectionHeaderAlign } from "./SectionHeader";
