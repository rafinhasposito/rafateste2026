const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. We need to hoist MOCK_DATA outside of the grid so the whole page can use it.
const mockDataString = `
export const ROUTES_MOCK_DATA = [
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
];
`;

if (!content.includes('ROUTES_MOCK_DATA')) {
  content = content.replace('const P = {', mockDataString + '\nconst P = {');
}

// 2. Add state for activeRoute inside AppleResultPreviewV4
if (!content.includes('const [activeRouteIndex, setActiveRouteIndex]')) {
  content = content.replace(
    'const [hoveredArea, setHoveredArea] = useState<string | null>("dinheiro");',
    `const [hoveredArea, setHoveredArea] = useState<string | null>("dinheiro");\n  const [activeRouteIndex, setActiveRouteIndex] = useState(1); // Default Casa 2`
  );
}

// 3. Make P dynamic! 
// Find: const P = { name: "Rafael Sposito", ... };
// We need to move it inside the component or just create a dynamic variable inside.
// Actually, let's create dynamic variables inside the component based on activeRouteIndex.
const dynamicVars = `
  const activeRoute = ROUTES_MOCK_DATA[activeRouteIndex];
  
  // Substitui os dados fixos do P pela rota ativa
  const dynamicCity = activeRoute.city;
  const dynamicHouseNum = activeRoute.house;
  const dynamicHouseLabel = activeRoute.label;
  const dynamicHouseImg = \`https://images.unsplash.com/photo-\${activeRoute.img}?auto=format&fit=crop&w=2000&q=80\`;
`;

if (!content.includes('const dynamicCity = activeRoute.city;')) {
  content = content.replace(
    'const sortedAreas = [...areas].sort((a,b) => b.score - a.score);',
    dynamicVars + '\n  const sortedAreas = [...areas].sort((a,b) => b.score - a.score);'
  );
}

// 4. Update the Hero Image and title to use dynamic data
// Find: P.city -> dynamicCity
// Find: P.houseLabel -> dynamicHouseLabel
// Find: currentActiveData.image -> dynamicHouseImg (for Hero)
content = content.replace(/P\.city/g, 'dynamicCity');
content = content.replace(/P\.houseLabel/g, 'dynamicHouseLabel');

// Update Hero Image
// <img src={currentActiveData.image} alt={P.city} .../>
content = content.replace(/<img src=\{currentActiveData\.image\} alt=\{dynamicCity\}/g, '<img src={dynamicHouseImg} alt={dynamicCity}');

// Update The Notebook LM Ritual Image
content = content.replace(/<img src=\{currentActiveData\.image\} alt="City" className="w-full h-\[600px\] object-cover"/g, '<img src={dynamicHouseImg} alt="City" className="w-full h-[600px] object-cover"');

// 5. Update the Grid mapping to trigger the gamification transition!
const oldGridClick = `onClick={() => {
                        if (!isUnlocked) {
                          setTargetLockedArea({ label: label, color: areaColor, id: num.toString(), type: 'rota' });
                          setIsPaywallOpen(true);
                        }
                      }}`;
const newGridClick = `onClick={() => {
                        if (!isUnlocked) {
                          setTargetLockedArea({ label: label, color: areaColor, id: num.toString(), type: 'rota' });
                          setIsPaywallOpen(true);
                        } else {
                          // GAMEFICAÇÃO: Transição suave para a Rota Desbloqueada!
                          setActiveRouteIndex(num - 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}`;
content = content.replace(oldGridClick, newGridClick);

// 6. Update the Modal onSuccess to Gamify Unlocks
const oldOnSuccess = `if (targetLockedArea?.type === 'foco') {
                setActiveArea(LIFE_AREAS.find(a => a.id === id) || LIFE_AREAS[0]);
            }`;
const newOnSuccess = `if (targetLockedArea?.type === 'foco') {
                setActiveArea(LIFE_AREAS.find(a => a.id === id) || LIFE_AREAS[0]);
            } else if (targetLockedArea?.type === 'rota') {
                setActiveRouteIndex(parseInt(id) - 1);
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
            }`;
content = content.replace(oldOnSuccess, newOnSuccess);

// 7. Cleanup Grid inner logic to use ROUTES_MOCK_DATA instead of local array
content = content.replace(/const MOCK_DATA = \[[\s\S]*?\];/, '');
content = content.replace(/MOCK_DATA\[num - 1\]/g, 'ROUTES_MOCK_DATA[num - 1]');
content = content.replace(/const imageForThisHouse = \`https:\/\/images\.unsplash\.com\/photo-\$\{mockData\.img\}\?auto=format&fit=crop&w=800&q=80\`;/, 'const imageForThisHouse = `https://images.unsplash.com/photo-${mockData.img}?auto=format&fit=crop&w=800&q=80`;\n                  const areaColor = mockData.color;');

// Save it
fs.writeFileSync(file, content);
console.log("Updated V4 Gamification successfully.");
