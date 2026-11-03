import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_wiki_image = '''const WikiImage = ({ cityName, initialSrc, fallbackSrc, localFallback, alt, className }: any) => {
  const [imgSrc, setImgSrc] = useState<string>(initialSrc || fallbackSrc);

  useEffect(() => {
    if (!cityName || cityName === "Bloqueado" || cityName === "Desconhecido") return;
    
    if (localFallback && !localFallback.includes("unsplash.com/photo-1542281286")) {
      setImgSrc(localFallback);
      return;
    }

    // If the initialSrc is already a generic atmospheric fallback, try to get a real city image from Wikipedia
    if (imgSrc.includes("unsplash.com/photo-") && ('''

new_wiki_image = '''const WikiImage = ({ cityName, initialSrc, fallbackSrc, localFallback, alt, className }: any) => {
  const [imgSrc, setImgSrc] = useState<string>(initialSrc || fallbackSrc);

  useEffect(() => {
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
    if (imgSrc.includes("unsplash.com/photo-") && ('''

content = content.replace(old_wiki_image, new_wiki_image)

with open(file_path, "w") as f:
    f.write(content)

