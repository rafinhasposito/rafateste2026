const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf8');

// 1. Add UnlockPremiumModal import
if (!code.includes('import UnlockPremiumModal')) {
  code = code.replace(
    /import \{ cityDatabase \} from "@\/data\/houses";/,
    "import { cityDatabase } from \"@/data/houses\";\nimport UnlockPremiumModal from \"@/components/UnlockPremiumModal\";"
  );
}

// 2. Add state and citiesObj inside component
if (!code.includes('const [isPaywallOpen')) {
  code = code.replace(
    /const \[openArea, setOpenArea\] = useState<string>\("dinheiro"\);/,
    `const [openArea, setOpenArea] = useState<string>("dinheiro");
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [targetLockedArea, setTargetLockedArea] = useState<{ id: string; label: string; color: string } | null>(null);
  const citiesObj = {
    nacional: [
      { city: "São Paulo, SP", country: "Brasil", score: 96, lat: -23.55, lon: -46.63, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" },
      { city: "Florianópolis", country: "Brasil", score: 93, lat: -27.59, lon: -48.55, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" }
    ],
    acessivel: [
      { city: "Santiago", country: "Chile", score: 94, lat: -33.45, lon: -70.67, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" },
      { city: "Buenos Aires", country: "Argentina", score: 92, lat: -34.60, lon: -58.38, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" }
    ],
    highticket: [
      { city: "Dubai", country: "Emirados Árabes", score: 98, lat: 25.20, lon: 55.27, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" },
      { city: "Tóquio", country: "Japão", score: 97, lat: 35.68, lon: 139.69, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" }
    ]
  };`
  );
}

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', code);
console.log("Vars and imports configured.");
