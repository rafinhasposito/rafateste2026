const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

// The replacement logic
const newTop = `  // Always show content — access gating is handled by Dashboard's isHouseLocked
  const [unlocked] = useState(true);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [unlockTarget, setUnlockTarget] = useState<number | null>(null);

  const [videoFailed, setVideoFailed] = useState(false);
  const [wikiImage, setWikiImage] = useState<string | null>(null);

  const atlasData = ATLAS_DO_DESTINO[house] || ATLAS_DO_DESTINO[1];
  const houseDataFull = cityDatabase[house] || cityDatabase[1];
  const allCities = [...(cities.highticket || []), ...(cities.acessivel || []), ...(cities.nacional || [])];
  const secondaryCities = allCities.slice(1);
  const continentGroups = groupCitiesByContinent(secondaryCities);
  const masterCity = allCities[0];
  const egregoraText = mode === "passado" ? fallbackOraclesPast[house] : fallbackOraclesFuture[house];

  useEffect(() => {
    if (!masterCity) return;
    setVideoFailed(false);
    setWikiImage(null);
    
    const name = masterCity.city || masterCity.display_name || "";
    if (!name) return;

    const fetchWiki = async () => {
      try {
        const ptRes = await fetch(\`https://pt.wikipedia.org/api/rest_v1/page/summary/\${encodeURIComponent(name)}\`);
        if (ptRes.ok) {
          const data = await ptRes.json();
          if (data.type !== "disambiguation" && (data.originalimage?.source || data.thumbnail?.source)) {
            setWikiImage(data.originalimage?.source || data.thumbnail?.source);
            return;
          }
        }
        const enRes = await fetch(\`https://en.wikipedia.org/api/rest_v1/page/summary/\${encodeURIComponent(name)}\`);
        if (enRes.ok) {
          const data = await enRes.json();
          setWikiImage(data.originalimage?.source || data.thumbnail?.source || null);
        }
      } catch (e) {
        console.error("Wiki fetch error", e);
      }
    };
    fetchWiki();
  }, [masterCity]);

  if (!masterCity) {
    return (
      <div className="w-full mt-12 p-8 text-center border border-white/10 rounded-2xl">
        <p className="text-white/60 text-sm font-ps-ui">Nenhuma cidade calculada para esta Casa.</p>
      </div>
    );
  }

  const cityName = masterCity.city || masterCity.display_name || "Desconhecido";
  const safeCityName = typeof cityName === 'string' ? cityName : String(cityName || "desconhecido");
  const videoName = safeCityName.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/\\s+/g, "_");
  const fallbackImage = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mt-12 pb-24">

      {/* 1. HERO - DESTINO PRINCIPAL */}
      <section className="relative w-full h-[70vh] min-h-[500px] rounded-[2rem] overflow-hidden mb-16 flex flex-col justify-end group">
        {!videoFailed ? (
          <video 
            src={\`/assets/cities/\${videoName}.mp4\`} 
            autoPlay loop muted playsInline
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-60" 
          />
        ) : wikiImage ? (
          <img 
            src={wikiImage} alt={cityName} 
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[30s] ease-linear group-hover:scale-110 scale-105 origin-center" 
          />
        ) : (
          <img 
            src={fallbackImage} alt={cityName} 
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[30s] ease-linear group-hover:scale-110 scale-105 origin-center" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030306] via-[#030306]/60 to-transparent pointer-events-none" />

        <div className="relative z-10 p-8 md:p-14 w-full max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#C9A227]">
                  A Coordenada de Ativação
                </span>
                <div className="h-px w-12 bg-[#C9A227]/50" />
              </div>
              <h2 className="font-ps-display text-5xl md:text-7xl font-bold text-white mb-2 leading-none">
                {cityName}
              </h2>
              <div className="flex items-center gap-4 text-white/50 font-mono text-xs tracking-widest uppercase mt-4">
                <span className="text-xl -mt-1">{getCountryFlag(masterCity.country)}</span>
                <span>{masterCity.country}</span>
                <span>·</span>
                <span>{masterCity.lat ? masterCity.lat.toFixed(4) : "40.7128"}°, {masterCity.lon ? masterCity.lon.toFixed(4) : "-74.0060"}°</span>
                <span>·</span>
                <span className="text-[#C9A227]">{masterCity.score || 98}% MATCH</span>
              </div>
            </div>

            {/* Target House Badge inside Hero */}
            <div className="border border-white/10 bg-black/40 backdrop-blur-md p-6 rounded-2xl md:w-80 shrink-0">
               <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227] block mb-2">
                 Casa {house} em Destaque
               </span>
               <h3 className="font-ps-display text-2xl text-white mb-2">{atlasData.title}</h3>
               <p className="font-ps-ui text-xs text-white/60">"{houseDataFull.translation}"</p>
            </div>
          </div>
        </div>
      </section>`;

// Target specific block to replace
const startIndex = content.indexOf(`  // Always show content — access gating is handled by Dashboard's isHouseLocked`);
const endIndex = content.indexOf(`      {/* 2. THE EGREGORE (AI Insight) */}`);

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find boundaries");
  process.exit(1);
}

const finalContent = content.slice(0, startIndex) + newTop + "\n\n      <div className=\"max-w-4xl mx-auto px-4 md:px-0\">\n\n  " + content.slice(endIndex);
fs.writeFileSync(file, finalContent);
console.log("Success");
