export const EARTH_STATES = [
  { scale: 0.9, y: 0, opacity: 1, showHorizonGlow: true },     // Tela 1: globo na base, ~40-45% inferiores da telaem ~55-60%
  { scale: 0.8, y: 0, opacity: 1, showHorizonGlow: false },    // Tela 2: Terra menor, globo completo (Referência)
  { scale: 0.6, y: "20%", opacity: 0.15, showHorizonGlow: false }, // Tela 3: Distante e sutil, para gráfico orbital
  { scale: 1.6, y: "20%", opacity: 0.7, showHorizonGlow: false },  // Tela 4: Média, pinos comparativos
  { scale: 0.5, y: "25%", opacity: 0.15, showHorizonGlow: false }, // Tela 5: Discreta, foco na timeline
  { scale: 2.6, y: "15%", opacity: 1, showHorizonGlow: true },     // Tela 6: Câmera volta a aproximar (Desfecho)
];
