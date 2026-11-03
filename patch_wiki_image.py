import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_wiki_component = '''const WikiImage = ({ cityName, initialSrc, fallbackSrc, localFallback, alt, className }: any) => {
  const [imgSrc, setImgSrc] = useState<string>(initialSrc || fallbackSrc);

  useEffect(() => {
    console.log("WikiImage rendered for:", cityName, "imgSrc:", imgSrc, "localFallback:", localFallback);
    if (!cityName || cityName === "Bloqueado" || cityName === "Desconhecido") return;
    
    const isGenericFallback = localFallback && localFallback.includes("unsplash.com/photo-") && (
        localFallback.includes("1542281286") || localFallback.includes("1579532537") || 
        localFallback.includes("1519389950") || localFallback.includes("1449844908") ||
        localFallback.includes("1492684223") || localFallback.includes("1494500764") ||
        localFallback.includes("1511895426") || localFallback.includes("1518709268") ||
        localFallback.includes("1454496522") || localFallback.includes("1486406146") ||
        localFallback.includes("1511649475") || localFallback.includes("1490730141")
    );

    if (localFallback && !isGenericFallback) {
      setImgSrc(localFallback);
      return;
    }

    // If the initialSrc is already a generic atmospheric fallback, try to get a real city image from Wikipedia
    if (imgSrc.includes("unsplash.com/photo-") && (
        imgSrc.includes("1542281286") || imgSrc.includes("1579532537") || 
        imgSrc.includes("1519389950") || imgSrc.includes("1449844908") ||
        imgSrc.includes("1492684223") || imgSrc.includes("1494500764") ||
        imgSrc.includes("1511895426") || imgSrc.includes("1518709268") ||
        imgSrc.includes("1454496522") || imgSrc.includes("1486406146") ||
        imgSrc.includes("1511649475") || imgSrc.includes("1490730141")
    )) {
      const cleanCity = cityName.split(',')[0].trim();
      fetch(`https://pt.wikipedia.org/w/api.php?origin=*&action=query&titles=${encodeURIComponent(cleanCity)}&prop=pageimages&format=json&pithumbsize=1000`)
        .then(res => res.json())
        .then(data => {
          const pages = data.query?.pages;
          if (pages) {
            const page = Object.values(pages)[0] as any;
            if (page?.thumbnail?.source) {
              setImgSrc(page.thumbnail.source.split('?')[0]);
            }
          }
        }).catch(() => {});
    }
  }, [cityName, imgSrc]);

  return <img src={imgSrc} alt={alt} className={className} onError={(e) => { e.currentTarget.src = fallbackSrc; }} />;
};'''

new_wiki_component = '''const WikiImage = ({ cityName, initialSrc, fallbackSrc, localFallback, alt, className }: any) => {
  const [imgSrc, setImgSrc] = useState<string>(initialSrc || fallbackSrc);

  useEffect(() => {
    let currentSrc = initialSrc || fallbackSrc;
    setImgSrc(currentSrc);
    
    if (!cityName || cityName === "Bloqueado" || cityName === "Desconhecido") return;
    
    const isGenericFallback = localFallback && localFallback.includes("unsplash.com/photo-") && (
        localFallback.includes("1542281286") || localFallback.includes("1579532537") || 
        localFallback.includes("1519389950") || localFallback.includes("1449844908") ||
        localFallback.includes("1492684223") || localFallback.includes("1494500764") ||
        localFallback.includes("1511895426") || localFallback.includes("1518709268") ||
        localFallback.includes("1454496522") || localFallback.includes("1486406146") ||
        localFallback.includes("1511649475") || localFallback.includes("1490730141")
    );

    if (localFallback && !isGenericFallback) {
      setImgSrc(localFallback);
      return;
    }

    if (currentSrc.includes("unsplash.com/photo-") && (
        currentSrc.includes("1542281286") || currentSrc.includes("1579532537") || 
        currentSrc.includes("1519389950") || currentSrc.includes("1449844908") ||
        currentSrc.includes("1492684223") || currentSrc.includes("1494500764") ||
        currentSrc.includes("1511895426") || currentSrc.includes("1518709268") ||
        currentSrc.includes("1454496522") || currentSrc.includes("1486406146") ||
        currentSrc.includes("1511649475") || currentSrc.includes("1490730141")
    )) {
      const cleanCity = cityName.split(',')[0].trim();
      let isSubscribed = true;
      fetch(`https://pt.wikipedia.org/w/api.php?origin=*&action=query&titles=${encodeURIComponent(cleanCity)}&prop=pageimages&format=json&pithumbsize=1000`)
        .then(res => res.json())
        .then(data => {
          if (!isSubscribed) return;
          const pages = data.query?.pages;
          if (pages) {
            const page = Object.values(pages)[0] as any;
            if (page?.thumbnail?.source) {
              setImgSrc(page.thumbnail.source.split('?')[0]);
            }
          }
        }).catch(() => {});
      return () => { isSubscribed = false; };
    }
  }, [cityName, initialSrc, fallbackSrc, localFallback]);

  return <img src={imgSrc} alt={alt} className={className} onError={(e) => { e.currentTarget.src = fallbackSrc; }} />;
};'''

content = content.replace(old_wiki_component, new_wiki_component)

with open(file_path, "w") as f:
    f.write(content)

