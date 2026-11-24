---
version: "3.0"
name: "Protocolo Solar — Celestial Obsidian & Warm Solar Gold"
description: "Unified brand system across Landing, 12 Solar Houses, Past Report, and Checkout."
colors:
  background: "#060911"
  surface: "#0B111E"
  surface_elevated: "#111A2E"
  foreground: "#F8FAFC"
  muted: "#B0BCCF"
  primary: "#EAB344"
  primary_foreground: "#070A12"
  champagne: "#F3DC9B"
typography:
  display: "Playfair Display"
  sans: "Plus Jakarta Sans"
  mono: "JetBrains Mono"
rounded:
  sm: "10px"
  md: "14px"
  lg: "20px"
  full: "9999px"
spacing:
  grid: "8px"
  subgrid: "4px"
---

# Overview

Protocolo Solar unifies astronomical precision (Swiss Ephemeris) with luxury birthday destination curation under a single cohesive visual world: **Celestial Obsidian (`#060911`) & Warm Solar Gold (`#EAB344`)**.

# Colors

- **Void Canvas (`#060911`)**: Deep midnight obsidian preventing OLED astigmatic halation while framing golden-hour destination films.
- **Midnight Surface (`#0B111E`) & Elevated (`#111A2E`)**: +4% lightness steps for cards and inputs.
- **Primary Action Gold (`#EAB344` / `#F6D36B` → `#E6AB3B`)**: Reserved for the #1 CTA per viewport (Von Restorff isolation), paired with `#070A12` ink (`11.4:1` contrast, WCAG AAA).
- **Text Alabaster (`#F8FAFC`, `17.8:1`) & Secondary Slate (`#B0BCCF`, `9.6:1`)**: High-legibility reading across mobile and desktop.

# Typography

- **Display (`Playfair Display`)**: Editorial headings with warm champagne italic (`#F3DC9B`) highlights matching the official cinema master.
- **UI & Body (`Plus Jakarta Sans`)**: Clean geometric grotesque (`>= 16px` on form inputs).
- **Data & Coordinates (`JetBrains Mono`)**: Tabular numerals for coordinates, prices, and House badges.

# Layout

- Strict `1200px` (`max-w-6xl`) container with symmetric grids (`6/6` Hero, `3-col` Reels & Passes, `4x3` / `3x4` 12-Houses Video Showcase) and equal-height cards (`items-stretch`).

# Elevation & Depth

- Stepped surface luminance (`#060911` → `#0B111E` → `#111A2E`) with `1px solid rgba(255,255,255,0.09)` borders rather than heavy black shadows.

# Shapes

- `rounded-full` pills for primary conversion CTAs and navigation badges; `rounded-2xl` (`20px`) for symmetric content cards.

# Components

- **`.ps-btn-gold`**: Primary action button (`min-h: 50px`, `11.4:1` contrast, tactile `scale(0.985)` press).
- **`.ps-btn-glass`**: Secondary translucent action button (`rgba(255,255,255,0.05)`, `1px` border).
- **`<HouseVideoPreview />`**: Viewport-aware (`IntersectionObserver`) 6-second cinema loops for all 12 Solar Houses with `prefers-reduced-motion` static poster fallback.
- **`<LanguageSwitcher />` & `I18nProvider`**: Instant browser/timezone + Geo-IP localization across `PT`, `ES`, `EN`, `FR`, and `IT`.

# Do's and Don'ts

- **Do** keep cards equal-height in every multi-column row and cap pricing cards at 3 short, plain-language bullets.
- **Don't** mix cream/light patchwork backgrounds inside the Celestial Obsidian shell or use AI-generated English placeholder mockups.
