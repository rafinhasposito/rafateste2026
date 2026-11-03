import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add the hook at the top or inside the component
hook_code = '''
const useCityImage = (cityName: string, houseId: number) => {
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
'''

content = content.replace('const heroVideoSrc = getHeroVideo(P_DYNAMIC.city);', hook_code + '\n  const heroVideoSrc = getHeroVideo(P_DYNAMIC.city);')

content = content.replace(
'''  const getHeroImage = (cityName: string, houseId: number, apiImg?: string): string => {
    if (apiImg && apiImg.startsWith("http")) return apiImg;
    const img = getHouseImageUrl(cityName, houseId);
    if (img && !img.includes("unsplash.com/photo-1542281286")) return img;
    const cleanCity = cityName.split(',')[0].trim();
    return `https://images.unsplash.com/1600x900/?${encodeURIComponent(cleanCity)}+city+travel&auto=format&fit=crop&w=2000&q=80`;
  };
  const heroImageSrc = getHeroImage(P_DYNAMIC.city, P_DYNAMIC.house, bestCity?.img);''',
'  const heroImageSrc = useCityImage(P_DYNAMIC.city, P_DYNAMIC.house) || bestCity?.img || getAtmosphericFallback(P_DYNAMIC.house);'
)


with open(file_path, "w") as f:
    f.write(content)

