const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Rewrite ROUTES_MOCK_DATA to include focusId
const oldMockData = `export const ROUTES_MOCK_DATA = [
  { house: 1, city: "Nova York, EUA", img: "1496442226666-8d4d0e62e6e9", label: "Protagonismo e Novas Iniciativas", color: "#f43f5e" }, // Casa 1 (Aries/Fogo)
  { house: 2, city: "Tóquio, Japão", img: "1498036882173-b41c28a8ba34", label: "Dinheiro, Valor e Segurança", color: "#10b981" }, // Casa 2 (Touro/Terra)
  { house: 3, city: "Dubai, EAU", img: "1459787915554-b34915863013", label: "Comunicação, Estudos e Contatos", color: "#3b82f6" }, // Casa 3 (Gemeos/Ar)
  { house: 4, city: "Buenos Aires, ARG", img: "1495317823589-e67efe1524b0", label: "Lar, Família e Vida Privada", color: "#a855f7" }, // Casa 4 (Cancer/Agua)
  { house: 5, city: "Santiago, Chile", img: "1689850543263-01a52ccc6943", label: "Criatividade, Lazer e Autoestima", color: "#eab308" }, // Casa 5 (Leao/Fogo)
  { house: 6, city: "Florianópolis, BRA", img: "1565574337618-b08146e94992", label: "Organização, Rotina e Saúde", color: "#22c55e" }, // Casa 6 (Virgem/Terra)
  { house: 7, city: "São Paulo, SP", img: "1470160710819-b3bd5ec85c66", label: "Casamento, Sociedades e Contratos", color: "#ec4899" }, // Casa 7 (Libra/Ar)
  { house: 8, city: "Los Angeles, EUA", img: "1444723121867-7a241cacace9", label: "Transformação, Crises e Finanças Compartilhadas", color: "#6366f1" }, // Casa 8 (Escorpiao/Agua)
  { house: 9, city: "Paris, França", img: "1431274172761-fca41d930114", label: "Expansão, Viagens e Estudos Superiores", color: "#f97316" }, // Casa 9 (Sagitario/Fogo)
  { house: 10, city: "Roma, Itália", img: "1491566102020-21838225c3c8", label: "Carreira, Propósito e Visibilidade", color: "#14b8a6" }, // Casa 10 (Capricornio/Terra)
  { house: 11, city: "Londres, UK", img: "1448906654166-444d494666b3", label: "Grupos, Projetos Futuros e Amizades", color: "#0ea5e9" }, // Casa 11 (Aquario/Ar)
  { house: 12, city: "Bali, Indonésia", img: "1501179691627-eeaa65ea017c", label: "Espiritualidade, Inconsciente e Fechamentos", color: "#8b5cf6" } // Casa 12 (Peixes/Agua)
];`;

const newMockData = `export const ROUTES_MOCK_DATA = [
  { house: 1, city: "Nova York, EUA", img: "1496442226666-8d4d0e62e6e9", label: "Protagonismo e Novas Iniciativas", color: "#c9a227", focusId: "identidade" },
  { house: 2, city: "Tóquio, Japão", img: "1498036882173-b41c28a8ba34", label: "Dinheiro, Valor e Segurança", color: "#10b981", focusId: "dinheiro" },
  { house: 3, city: "Dubai, EAU", img: "1459787915554-b34915863013", label: "Comunicação, Estudos e Contatos", color: "#14b8a6", focusId: "networking" },
  { house: 4, city: "Buenos Aires, ARG", img: "1495317823589-e67efe1524b0", label: "Lar, Família e Vida Privada", color: "#f43f5e", focusId: "amor" },
  { house: 5, city: "Santiago, Chile", img: "1689850543263-01a52ccc6943", label: "Criatividade, Lazer e Autoestima", color: "#c9a227", focusId: "identidade" },
  { house: 6, city: "Florianópolis, BRA", img: "1565574337618-b08146e94992", label: "Organização, Rotina e Saúde", color: "#22c55e", focusId: "saude" },
  { house: 7, city: "São Paulo, SP", img: "1470160710819-b3bd5ec85c66", label: "Casamento, Sociedades e Contratos", color: "#f43f5e", focusId: "amor" },
  { house: 8, city: "Los Angeles, EUA", img: "1444723121867-7a241cacace9", label: "Transformação, Crises e Finanças Compartilhadas", color: "#10b981", focusId: "dinheiro" },
  { house: 9, city: "Paris, França", img: "1431274172761-fca41d930114", label: "Expansão, Viagens e Estudos Superiores", color: "#6366f1", focusId: "espiritual" },
  { house: 10, city: "Roma, Itália", img: "1491566102020-21838225c3c8", label: "Carreira, Propósito e Visibilidade", color: "#3b82f6", focusId: "trabalho" },
  { house: 11, city: "Londres, UK", img: "1448906654166-444d494666b3", label: "Grupos, Projetos Futuros e Amizades", color: "#14b8a6", focusId: "networking" },
  { house: 12, city: "Bali, Indonésia", img: "1501179691627-eeaa65ea017c", label: "Espiritualidade, Inconsciente e Fechamentos", color: "#6366f1", focusId: "espiritual" }
];`;

content = content.replace(oldMockData, newMockData);

// 2. Update Grid Click
const oldGridClick = `setActiveRouteIndex(num - 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });`;
const newGridClick = `setActiveRouteIndex(num - 1);
                          setHoveredArea(ROUTES_MOCK_DATA[num - 1].focusId);
                          window.scrollTo({ top: 0, behavior: 'smooth' });`;
content = content.replace(oldGridClick, newGridClick);

// 3. Update Modal onSuccess
const oldModalClick = `setActiveRouteIndex(parseInt(id) - 1);
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);`;
const newModalClick = `setActiveRouteIndex(parseInt(id) - 1);
              setHoveredArea(ROUTES_MOCK_DATA[parseInt(id) - 1].focusId);
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);`;
content = content.replace(oldModalClick, newModalClick);

fs.writeFileSync(file, content);
console.log("Fixed Color Sync!");
