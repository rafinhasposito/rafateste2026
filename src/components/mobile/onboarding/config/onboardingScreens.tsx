import { EARTH_STATES } from "./earthStates";

export const onboardingScreens = [
  {
    title: (
      <>
        O CÉU SE MOVE.<br />
        <span className="text-[#D4AF37]">E O SEU MAPA TAMBÉM.</span>
      </>
    ),
    subtitle: "O lugar onde você passa o seu aniversário ativa focos diferentes para o seu ano pessoal.",
    earthProps: EARTH_STATES[0]
  },
  {
    title: "CADA CIDADE,\nUMA NOVA ENERGIA.",
    subtitle: "Descubra como mudar de localização pode abrir novas oportunidades para a sua carreira, finanças ou amor.",
    earthProps: EARTH_STATES[1]
  },
  {
    title: "ESCOLHA O SEU CAMINHO.",
    subtitle: "Analise o ano que passou, entenda o seu momento atual ou planeje o destino ideal para o seu próximo aniversário.",
    earthProps: EARTH_STATES[4]
  },
  {
    title: "AGORA É\nSOBRE VOCÊ.",
    subtitle: "Insira seus dados de nascimento para calcular sua Revolução Solar e explorar as coordenadas pelo mundo.",
    earthProps: EARTH_STATES[5]
  }
];
