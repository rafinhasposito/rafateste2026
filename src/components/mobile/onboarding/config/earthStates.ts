/**
 * EARTH_STATES — Define o comportamento visual da Terra em cada tela.
 *
 * mode: "orbital" = bg-cover posicionado na base (horizonte curvo, visão de órbita)
 *       "globe"   = globo flutuante com transparência (PNG com alpha)
 *       "none"    = sem Terra (cosmos puro)
 *
 * src: qual asset usar (dentro de /public)
 */
export const EARTH_STATES = [
  // Tela 1: Vista orbital — Terra dominante, horizonte ~55%, Americas em destaque
  {
    mode: "orbital",
    src: "/earth-orbital.png",
    scale: 1.0,
    y: 0,
    opacity: 1,
    showHorizonGlow: true,
    maskStart: "28%",
    maskMid: "48%",
    maskEnd: "62%",
  },
  // Tela 2: Globo flutuante — pequeno, centrado no lower-mid, cosmos visível
  {
    mode: "globe",
    src: "/earth-master.png",
    scale: 0.55,
    y: 60,
    opacity: 1,
    showHorizonGlow: false,
    maskStart: null,
    maskMid: null,
    maskEnd: null,
  },
  // Tela 3: Cosmos puro — Terra ausente, anel orbital como VisualSlot
  {
    mode: "none",
    src: null,
    scale: 1,
    y: 0,
    opacity: 0,
    showHorizonGlow: false,
    maskStart: null,
    maskMid: null,
    maskEnd: null,
  },
  // Tela 4: Vista orbital + pins de localização (São Paulo / Nova York)
  {
    mode: "orbital",
    src: "/earth-orbital.png",
    scale: 1.0,
    y: 0,
    opacity: 1,
    showHorizonGlow: false,
    maskStart: "35%",
    maskMid: "55%",
    maskEnd: "68%",
  },
  // Tela 5: Cosmos puro — Timeline com 3 ícones, sem Terra
  {
    mode: "none",
    src: null,
    scale: 1,
    y: 0,
    opacity: 0,
    showHorizonGlow: false,
    maskStart: null,
    maskMid: null,
    maskEnd: null,
  },
  // Tela 6: Vista orbital — Terra grande, CTA button sobreposto
  {
    mode: "orbital",
    src: "/earth-orbital.png",
    scale: 1.0,
    y: 0,
    opacity: 1,
    showHorizonGlow: true,
    maskStart: "28%",
    maskMid: "48%",
    maskEnd: "62%",
  },
];
