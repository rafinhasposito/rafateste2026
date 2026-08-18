import React from "react";
import { EARTH_STATES } from "./earthStates";

export const onboardingScreens = [
  // ── TELA 1/6 ────────────────────────────────────────────────────────────────
  {
    title: (
      <>
        O CÉU SE MOVE.<br />
        <span className="text-[#D4AF37]">E VOCÊ TAMBÉM.</span>
      </>
    ),
    subtitle: "A Astrologia de Relocalização mostra como os planetas ativam diferentes áreas da sua vida em cada lugar do mundo.",
    earthProps: EARTH_STATES[0],
  },

  // ── TELA 2/6 ────────────────────────────────────────────────────────────────
  {
    title: (
      <>
        CADA LUGAR<br />
        <span className="text-[#D4AF37]">ATIVA UMA ENERGIA.</span>
      </>
    ),
    subtitle: "Seu mapa muda conforme o lugar onde você está ou escolhe estar. E isso muda tudo.",
    earthProps: EARTH_STATES[1],
  },

  // ── TELA 3/6 ────────────────────────────────────────────────────────────────
  {
    title: (
      <>
        SEU CÉU.<br />
        <span className="text-[#D4AF37]">12 CASAS. 12 ÁREAS.</span>
      </>
    ),
    subtitle: "Cada casa astrológica governa uma área da sua vida. Ao mudar de lugar, o eixo das casas gira — e tudo muda.",
    earthProps: EARTH_STATES[2],
  },

  // ── TELA 4/6 ────────────────────────────────────────────────────────────────
  {
    title: (
      <>
        MESMO CÉU.<br />
        <span className="text-[#D4AF37]">ENERGIAS DIFERENTES.</span>
      </>
    ),
    subtitle: "São Paulo ou Nova York? Seu mapa mostra como cada lugar ativa áreas diferentes da sua vida.",
    earthProps: EARTH_STATES[3],
  },

  // ── TELA 5/6 ────────────────────────────────────────────────────────────────
  {
    title: (
      <>
        PASSADO, PRESENTE,<br />
        <span className="text-[#D4AF37]">FUTURO.</span>
      </>
    ),
    subtitle: "Entenda o que já viveu, o que está vivendo agora e o que pode criar a seguir.",
    earthProps: EARTH_STATES[4],
  },

  // ── TELA 6/6 ────────────────────────────────────────────────────────────────
  {
    title: (
      <>
        AGORA É<br />
        <span className="text-[#D4AF37]">SOBRE VOCÊ.</span>
      </>
    ),
    subtitle: "Use seus dados de nascimento para calcular sua Revolução Solar e explorar diferentes possibilidades pelo mundo.",
    earthProps: EARTH_STATES[5],
  },
];
