import { EARTH_STATES } from "./earthStates";

export const onboardingScreens = [
  {
    title: (
      <>
        O CÉU SE MOVE.<br />
        <span className="text-[#D4AF37]">E VOCÊ TAMBÉM.</span>
      </>
    ),
    subtitle: "A Astrologia de Relocalização mostra como os planetas ativam diferentes áreas da sua vida em cada lugar do mundo.",
    earthProps: EARTH_STATES[0]
  },
  {
    title: "CADA LUGAR\nATIVA UMA ENERGIA.",
    subtitle: "Seu mapa muda conforme o lugar onde você está ou escolhe estar. E isso muda tudo.",
    earthProps: EARTH_STATES[1]
  },
  {
    title: "SEU MAPA. QUALQUER LUGAR. QUALQUER POSSIBILIDADE.",
    subtitle: "Calculamos sua Revolução Solar para o lugar e data que você escolher e revelamos como será seu próximo ciclo.",
    earthProps: EARTH_STATES[2]
  },
  {
    title: "MESMO CÉU.\nENERGIAS DIFERENTES.",
    subtitle: "Veja como seu mapa muda de um lugar para outro.",
    earthProps: EARTH_STATES[3]
  },
  {
    title: "ESCOLHA SEU CAMINHO. EXPLORE SEU CICLO.",
    subtitle: "Você pode analisar o que já viveu, entender o que está vivendo agora ou projetar o que deseja viver.",
    earthProps: EARTH_STATES[4]
  },
  {
    title: "AGORA É\nSOBRE VOCÊ.",
    subtitle: "Use seus dados de nascimento para calcular sua Revolução Solar e explorar diferentes possibilidades pelo mundo.",
    earthProps: EARTH_STATES[5]
  }
];
