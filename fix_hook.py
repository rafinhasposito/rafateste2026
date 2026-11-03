import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace the bad hook with direct state
old_code = '''const useCityImage = (cityName: string, houseId: number) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!cityName) return;
    const cleanCity = cityName.split(',')[0].trim();
    
    // 1. Tenta imagens hardcoded de alta qualidade primeiro
    const localFallback = getHouseImageUrl(cleanCity, houseId);
    if (localFallback && !localFallback.includes("unsplash.com/photo-1542281286")) {
      setImgUrl(localFallback);
      return;
    }

    // 2. Busca na Wikipedia dinamicamente
    const fetchWikiImage = async () => {
      try {
        const res = await fetch(`https://pt.wikipedia.org/w/api.php?origin=*&action=query&titles=${encodeURIComponent(cleanCity)}&prop=pageimages&format=json&pithumbsize=1600`);
        const data = await res.json();
        const pages = data.query?.pages;
        if (pages) {
          const page = Object.values(pages)[0] as any;
          if (page && page.thumbnail && page.thumbnail.source) {
            // Remove o utm_source para a URL ficar limpa
            const cleanUrl = page.thumbnail.source.split('?')[0];
            setImgUrl(cleanUrl);
            return;
          }
        }
      } catch (e) {}
      // 3. Fallback atmosférico se nada funcionar
      setImgUrl(getAtmosphericFallback(houseId));
    };

    fetchWikiImage();
  }, [cityName, houseId]);

  return imgUrl;
};

  const heroVideoSrc = getHeroVideo(P_DYNAMIC.city);
  const heroCountry = P_DYNAMIC.city.split(', ')[1] || "Destino";

  const heroImageSrc = useCityImage(P_DYNAMIC.city, P_DYNAMIC.house) || bestCity?.img || getAtmosphericFallback(P_DYNAMIC.house);'''

new_code = '''  const [wikiHeroImage, setWikiHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const cityName = P_DYNAMIC.city;
    const houseId = P_DYNAMIC.house;
    if (!cityName) return;
    const cleanCity = cityName.split(',')[0].trim();
    
    const localFallback = getHouseImageUrl(cleanCity, houseId);
    if (localFallback && !localFallback.includes("unsplash.com/photo-1542281286")) {
      setWikiHeroImage(localFallback);
      return;
    }

    const fetchWikiImage = async () => {
      try {
        const res = await fetch(`https://pt.wikipedia.org/w/api.php?origin=*&action=query&titles=${encodeURIComponent(cleanCity)}&prop=pageimages&format=json&pithumbsize=1600`);
        const data = await res.json();
        const pages = data.query?.pages;
        if (pages) {
          const page = Object.values(pages)[0] as any;
          if (page && page.thumbnail && page.thumbnail.source) {
            const cleanUrl = page.thumbnail.source.split('?')[0];
            setWikiHeroImage(cleanUrl);
            return;
          }
        }
      } catch (e) {}
      setWikiHeroImage(getAtmosphericFallback(houseId));
    };

    fetchWikiImage();
  }, [P_DYNAMIC.city, P_DYNAMIC.house]);

  const heroVideoSrc = getHeroVideo(P_DYNAMIC.city);
  const heroCountry = P_DYNAMIC.city.split(', ')[1] || "Destino";
  const heroImageSrc = wikiHeroImage || bestCity?.img || getAtmosphericFallback(P_DYNAMIC.house);'''

content = content.replace(old_code, new_code)

with open(file_path, "w") as f:
    f.write(content)

