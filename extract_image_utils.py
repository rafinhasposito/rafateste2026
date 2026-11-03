import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# I will write a script to define WikiCityImage that just uses the Wikipedia API and Unsplash fallback.
# If it needs getHouseImageUrl, I can pass the initial src as a prop!

wiki_component = '''
const WikiImage = ({ cityName, initialSrc, fallbackSrc, alt, className }: any) => {
  const [imgSrc, setImgSrc] = useState<string>(initialSrc || fallbackSrc);

  useEffect(() => {
    if (!cityName || cityName === "Bloqueado" || cityName === "Desconhecido") return;
    
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
};
'''

content = content.replace('export default function AppleResultPreviewV3(props: DestinyResultsProps) {', wiki_component + '\nexport default function AppleResultPreviewV3(props: DestinyResultsProps) {')

old_img_tag = '''<img src={isCurrent ? getHouseImageUrl(P_DYNAMIC.city, P_DYNAMIC.house, bestCity?.img) : imageForThisHouse} onError={(e) => { e.currentTarget.src = getAtmosphericFallback(num); }} alt={cityForThisHouse} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />'''
new_img_tag = '''<WikiImage 
                              cityName={cityForThisHouse} 
                              initialSrc={isCurrent ? getHouseImageUrl(P_DYNAMIC.city, P_DYNAMIC.house, bestCity?.img) : imageForThisHouse} 
                              fallbackSrc={getAtmosphericFallback(num)} 
                              alt={cityForThisHouse} 
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                            />'''

content = content.replace(old_img_tag, new_img_tag)

with open(file_path, "w") as f:
    f.write(content)

