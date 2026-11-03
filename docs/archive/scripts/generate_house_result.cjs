const fs = require('fs');

// We will copy V5 and refactor it into HouseResult.tsx that uses useParams!
let content = fs.readFileSync('src/pages/AppleResultPreviewV5.tsx', 'utf8');

// Replace the component names
content = content.replace(/AppleResultPreviewV5Wrapper/g, 'HouseResultWrapper');
content = content.replace(/AppleResultPreviewV5/g, 'HouseResult');

// Replace useSearchParams with useParams
content = content.replace(
  'import { useSearchParams } from "react-router-dom";',
  'import { useParams, useNavigate } from "react-router-dom";'
);

// Replace the state initialization to use useParams
const oldStateInit = `const [searchParams] = useSearchParams();
  const initialHouse = searchParams.get('house') ? parseInt(searchParams.get('house')) - 1 : 1;
  const [activeRouteIndex, setActiveRouteIndex] = useState(initialHouse >= 0 && initialHouse <= 11 ? initialHouse : 1); // Default Casa 2 ou via URL`;

const newStateInit = `const { houseId } = useParams();
  const navigate = useNavigate();
  // Se o houseId da URL for válido (1 a 12), usamos ele (-1 para index). Senão cai na Casa 2 (index 1)
  const parsedId = houseId ? parseInt(houseId) : 2;
  const urlHouseIndex = (parsedId >= 1 && parsedId <= 12) ? parsedId - 1 : 1;
  
  // Usamos useEffect para que, se a URL mudar, a página atualize o estado
  const [activeRouteIndex, setActiveRouteIndex] = useState(urlHouseIndex);
  React.useEffect(() => {
    setActiveRouteIndex(urlHouseIndex);
    window.scrollTo(0, 0);
  }, [urlHouseIndex]);`;

content = content.replace(oldStateInit, newStateInit);

// When clicking the Grid at the bottom, update the URL instead of just state
const oldGridClick = `setActiveRouteIndex(parseInt(id) - 1);
              setHoveredArea(ROUTES_MOCK_DATA[parseInt(id) - 1].focusId);
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);`;

const newGridClick = `navigate(\`/resultado/\${id}\`);
              setHoveredArea(ROUTES_MOCK_DATA[parseInt(id) - 1].focusId);`;

content = content.replace(oldGridClick, newGridClick);

// Also the first instance of grid click (the one in unlocked state)
const oldGridClick2 = `setActiveRouteIndex(num - 1);
                          setHoveredArea(ROUTES_MOCK_DATA[num - 1].focusId);
                          window.scrollTo({ top: 0, behavior: 'smooth' });`;

const newGridClick2 = `navigate(\`/resultado/\${num}\`);
                          setHoveredArea(ROUTES_MOCK_DATA[num - 1].focusId);`;

content = content.replace(oldGridClick2, newGridClick2);

fs.writeFileSync('src/pages/HouseResult.tsx', content);
console.log("Created HouseResult.tsx");
