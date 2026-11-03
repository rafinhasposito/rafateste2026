const fs = require('fs');
const file = 'src/pages/HouseResult.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the initial state of hoveredArea and the useEffect hook
content = content.replace(
  'const [hoveredArea, setHoveredArea] = useState<string | null>("dinheiro");',
  'const [hoveredArea, setHoveredArea] = useState<string | null>(null);' // We'll compute it dynamically below
);

const oldUseEffect = `const [activeRouteIndex, setActiveRouteIndex] = useState(urlHouseIndex);
  React.useEffect(() => {
    setActiveRouteIndex(urlHouseIndex);
    window.scrollTo(0, 0);
  }, [urlHouseIndex]);`;

const newUseEffect = `const [activeRouteIndex, setActiveRouteIndex] = useState(urlHouseIndex);
  const [hoveredArea, setHoveredArea] = useState(ROUTES_MOCK_DATA[urlHouseIndex].focusId);
  
  React.useEffect(() => {
    setActiveRouteIndex(urlHouseIndex);
    setHoveredArea(ROUTES_MOCK_DATA[urlHouseIndex].focusId);
    window.scrollTo(0, 0);
  }, [urlHouseIndex]);`;

// Just to be safe, replace the full block including the hoveredArea definition
const oldStateBlock = `const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);
  const [hoveredArea, setHoveredArea] = useState<string | null>("dinheiro");
  const { houseId } = useParams();
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

const newStateBlock = `const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);
  const { houseId } = useParams();
  const navigate = useNavigate();
  // Se o houseId da URL for válido (1 a 12), usamos ele (-1 para index). Senão cai na Casa 2 (index 1)
  const parsedId = houseId ? parseInt(houseId) : 2;
  const urlHouseIndex = (parsedId >= 1 && parsedId <= 12) ? parsedId - 1 : 1;
  
  // Usamos useEffect para que, se a URL mudar, a página atualize o estado
  const [activeRouteIndex, setActiveRouteIndex] = useState(urlHouseIndex);
  const [hoveredArea, setHoveredArea] = useState<string | null>(ROUTES_MOCK_DATA[urlHouseIndex].focusId);
  
  React.useEffect(() => {
    setActiveRouteIndex(urlHouseIndex);
    setHoveredArea(ROUTES_MOCK_DATA[urlHouseIndex].focusId);
    window.scrollTo(0, 0);
  }, [urlHouseIndex]);`;

content = content.replace(oldStateBlock, newStateBlock);

// 2. Fix the hardcoded P.house, green colors, and P.match
content = content.replace(
  '<span className="text-[#10b981] font-medium block mt-1 md:inline md:mt-0">{HOUSE_CINEMATIC_TEXTS[P.house]}</span>',
  '<span className="font-medium block mt-1 md:inline md:mt-0" style={{ color: themeColor }}>{HOUSE_CINEMATIC_TEXTS[houseModel.id]}</span>'
);

content = content.replace(
  'A Casa {P.house} foi calculada',
  'A Casa {houseModel.id} foi calculada'
);

content = content.replace(
  '{P.match}% MATCH',
  '{houseModel.score}% MATCH'
);

content = content.replace(
  'const isCurrent = num === P.house;',
  'const isCurrent = num === houseModel.id;'
);

fs.writeFileSync(file, content);
console.log("Fixed Frankenstein mixing of Data!");
