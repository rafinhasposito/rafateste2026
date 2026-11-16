---
name: mobile-first
description: Validação e desenvolvimento Mobile-First (equivalente ao simulador Mobile FIRST para iPhone SE, iPhone 15/16 Pro, Galaxy S24 e iPad) para o Protocolo Solar.
---

# Mobile-First Simulator Skill — Protocolo Solar

Use esta skill sempre que criar, ajustar ou auditar telas do **Protocolo Solar** (React/Vite ou HTML de prévias do Onboarding/Guia Rápido).

## 1. Checklist Técnico antes de Entregar
- **Viewport e Altura Real**: use `100svh` e `env(safe-area-inset-bottom)` / `env(safe-area-inset-top)`.
- **Zero Overflow Horizontal**: confira `document.documentElement.scrollWidth <= window.innerWidth` em `320px`, `360px`, `390px`, `430px` e `768px`.
- **Botões e Cards Nunca Cortados**: qualquer grupo de botões horizontais deve empilhar em `< 768px` (`width: 100%`).
- **Inputs sem Auto-Zoom no iOS**: `font-size: 16px` no mínimo em todos os campos (`input`, `select`, `textarea`).
- **Touch Targets**: mínimo `44×44px` em botões secundários e `48×56px` no CTA principal na zona do polegar.
- **Vídeos no Mobile**: usar vídeo vertical (`9:16`) quando disponível, com `playsinline` e transição por clique/etapa clara (sem misturar duas telas no meio do scroll).

## 2. Como Rodar o Simulador Automatizado (Playwright)
Para validar os dispositivos do **Mobile FIRST** via código e gerar evidências:
```bash
npx playwright test e2e/mobile-first-simulator.spec.ts
```
