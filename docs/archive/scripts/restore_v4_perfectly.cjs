const fs = require('fs');

// 1. Restore from AppleResultPreviewV4
let content = fs.readFileSync('src/pages/AppleResultPreviewV4.tsx', 'utf8');

// 2. Rename component to HouseResult
content = content.replace(/AppleResultPreviewV4Wrapper/g, 'HouseResultWrapper');
content = content.replace(/AppleResultPreviewV4/g, 'HouseResult');

// 3. Add Router imports
content = content.replace(
  'import { useSearchParams } from "react-router-dom";',
  'import { useParams, useNavigate } from "react-router-dom";'
);
content = content.replace(
  'import { HOUSE_RESULTS } from "@/data/houseResults";',
  'import { HOUSE_RESULTS } from "@/data/houseResults";\nimport { houseThemes } from "@/data/houseThemes";'
);

// 4. Update the state to use URL Params + Fix Initial Hovered Area
const oldStateBlock = `const [searchParams] = useSearchParams();
  const initialHouse = searchParams.get('house') ? parseInt(searchParams.get('house')) - 1 : 1;
  const [activeRouteIndex, setActiveRouteIndex] = useState(initialHouse >= 0 && initialHouse <= 11 ? initialHouse : 1); // Default Casa 2 ou via URL
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const [areas, setAreas] = useState(LIFE_AREAS);
  const [activeDnaTab, setActiveDnaTab] = useState('essencia');
  const [openTimelinePhase, setOpenTimelinePhase] = useState<number | null>(0);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  
  // Clean Architecture: Single Source of Truth
  const houseModel = HOUSE_RESULTS[activeRouteIndex + 1] || HOUSE_RESULTS[1];
  const dynamicCity = houseModel.city + ", " + houseModel.country;
  const dynamicHouseNum = houseModel.id;
  const dynamicHouseLabel = houseModel.focusLabel;
  const dynamicHouseImg = houseModel.img;
  const themeColor = houseModel.themeColor;`;

const newStateBlock = `const { houseId } = useParams();
  const navigate = useNavigate();
  const parsedId = houseId ? parseInt(houseId) : 2;
  const urlHouseIndex = (parsedId >= 1 && parsedId <= 12) ? parsedId - 1 : 1;
  
  const [activeRouteIndex, setActiveRouteIndex] = useState(urlHouseIndex);
  
  // VITAL: hoveredArea MUST start as the House's primary focus, not hardcoded "dinheiro"!
  const [hoveredArea, setHoveredArea] = useState<string | null>(ROUTES_MOCK_DATA[urlHouseIndex].focusId);
  
  React.useEffect(() => {
    setActiveRouteIndex(urlHouseIndex);
    setHoveredArea(ROUTES_MOCK_DATA[urlHouseIndex].focusId);
    window.scrollTo(0, 0);
  }, [urlHouseIndex]);

  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const [areas, setAreas] = useState(LIFE_AREAS);
  const [activeDnaTab, setActiveDnaTab] = useState('essencia');
  const [openTimelinePhase, setOpenTimelinePhase] = useState<number | null>(0);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  
  // Clean Architecture: Single Source of Truth
  const houseModel = HOUSE_RESULTS[activeRouteIndex + 1] || HOUSE_RESULTS[1];
  const dynamicCity = houseModel.city + ", " + houseModel.country;
  const dynamicHouseNum = houseModel.id;
  const dynamicHouseLabel = houseModel.focusLabel;
  const dynamicHouseImg = houseModel.img;
  const themeColor = houseThemes[houseModel.id]?.themeColor || houseModel.themeColor;`;

content = content.replace(oldStateBlock, newStateBlock);

// 5. Also replace the OLD hoveredArea definition that might be floating around before searchParams
content = content.replace(
  'const [hoveredArea, setHoveredArea] = useState<string | null>("dinheiro");\n  const [searchParams]',
  '// hoveredArea moved down to use urlHouseIndex\n  const [searchParams]'
);

// 6. Fix Hardcoded Green Boarding Pass / Glowing elements from V4
content = content.replace(
  '<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-[#10b981]/5 blur-[120px] rounded-full pointer-events-none"></div>',
  '<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] blur-[120px] rounded-full pointer-events-none" style={{ backgroundColor: `${themeColor}0D` }}></div>'
);
content = content.replace(
  '<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#10b981] mb-8">',
  '<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest mb-8" style={{ color: themeColor }}>'
);
content = content.replace(
  '<div className="bg-black/40 border border-[#10b981]/30 rounded-[32px] overflow-hidden shadow-[0_30px_80px_rgba(16,185,129,0.15)] backdrop-blur-xl flex flex-col">',
  '<div className="bg-black/40 border rounded-[32px] overflow-hidden backdrop-blur-xl flex flex-col transition-all duration-1000" style={{ borderColor: `${themeColor}4D`, boxShadow: `0 30px 80px -20px ${themeColor}26` }}>'
);

// 7. Fix P.house and P.match that caused Casa 1 to show Casa 2's texts
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

// 8. Add Floating Test Menu
const menuCode = `
      {/* ── FLOATING DEBUG MENU FOR USER TO TEST 12 HOUSES ── */}
      <div className="fixed bottom-6 left-6 z-50 group">
        <div className="absolute bottom-full left-0 mb-4 bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-2xl w-[320px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 scale-95 group-hover:scale-100 origin-bottom-left shadow-2xl">
          <h4 className="text-white font-bold mb-3 text-sm tracking-widest uppercase opacity-80">Testar Casas Dinâmicas</h4>
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
              <button 
                key={num}
                onClick={() => navigate(\`/resultado/\${num}\`)}
                className="py-2 rounded-lg text-xs font-bold transition-all duration-300 border border-white/10 hover:border-white/50 hover:bg-white/10"
                style={{ 
                  backgroundColor: parsedId === num ? themeColor : 'transparent',
                  color: parsedId === num ? '#000' : '#fff'
                }}
              >
                CASA {num}
              </button>
            ))}
          </div>
        </div>
        <button className="h-14 px-6 rounded-full bg-white text-black font-bold tracking-widest uppercase text-sm flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform">
          <Compass className="w-5 h-5" />
          Testar Modelo
        </button>
      </div>
`;
content = content.replace(
  '{/* ── NAVBAR PADRÃO (RESPONSIVA) ── */}',
  menuCode + '\n      {/* ── NAVBAR PADRÃO (RESPONSIVA) ── */}'
);

// 9. Fix bottom grid navigation
const oldGridClick = `setActiveRouteIndex(parseInt(id) - 1);
              setHoveredArea(ROUTES_MOCK_DATA[parseInt(id) - 1].focusId);
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);`;
const newGridClick = `navigate(\`/resultado/\${id}\`);`;
content = content.replace(oldGridClick, newGridClick);

const oldGridClick2 = `setActiveRouteIndex(num - 1);
                          setHoveredArea(ROUTES_MOCK_DATA[num - 1].focusId);
                          window.scrollTo({ top: 0, behavior: 'smooth' });`;
const newGridClick2 = `navigate(\`/resultado/\${num}\`);`;
content = content.replace(oldGridClick2, newGridClick2);

fs.writeFileSync('src/pages/HouseResult.tsx', content);
console.log("Restored HouseResult.tsx directly from V4, keeping accordion, only fixing data bindings!");
