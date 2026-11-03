import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace getHeroVideo
old_func_regex = r"const getHeroVideo = \(cityName: string\) => \{.*?\};\n  const heroVideoSrc = getHeroVideo\(P_DYNAMIC\.city\);"

new_func = """const getHeroVideo = (cityName: string) => {
    if (!cityName) return "/assets/particles.mp4";
    
    // Pega só o nome da cidade (antes da vírgula)
    const baseCity = cityName.split(',')[0].trim().toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
    
    // Mapeamento direto e blindado para evitar problemas de nomeação
    const map: Record<string, string> = {
      "nova york": "new_york.mp4",
      "new york": "new_york.mp4",
      "toquio": "tokyo.mp4",
      "tokyo": "tokyo.mp4",
      "dubai": "dubai.mp4",
      "paris": "paris.mp4",
      "roma": "roma.mov",
      "rome": "roma.mov",
      "londres": "london.mp4",
      "london": "london.mp4",
      "bali": "bali.mp4",
      "amsterda": "amsterdam.mov",
      "amsterdam": "amsterdam.mov",
      "barcelona": "barcelona.mp4",
      "buenos aires": "buenosaires.mp4",
      "atenas": "athens.mp4",
      "athens": "athens.mp4",
      "cairo": "cairo.mp4",
      "florenca": "florence.mp4",
      "florence": "florence.mp4",
      "genebra": "geneva.mp4",
      "geneva": "geneva.mp4",
      "ibiza": "ibiza.mp4",
      "jerusalem": "jerusalem.mp4",
      "kyoto": "kyoto.mp4",
      "quiotto": "kyoto.mp4",
      "las vegas": "las_vegas.mp4",
      "monaco": "monaco.mp4",
      "patagonia": "patagonia.mp4",
      "provence": "provence.mp4",
      "reykjavik": "reykjavik.mp4",
      "santorini": "santorini.mp4",
      "seul": "seoul.mp4",
      "seoul": "seoul.mp4",
      "singapura": "singapore.mp4",
      "singapore": "singapore.mp4",
      "veneza": "venice.mp4",
      "venice": "venice.mp4",
      "zurique": "zurich.mp4",
      "zurich": "zurich.mp4"
    };

    if (map[baseCity]) {
      return `/assets/cities/${map[baseCity]}`;
    }
    
    // Fallback global de estrelas premium
    return "/assets/particles.mp4"; 
  };
  const heroVideoSrc = getHeroVideo(P_DYNAMIC.city);"""

# using DOTALL
content = re.sub(old_func_regex, new_func, content, flags=re.DOTALL)

# Fix <source type="video/mp4" /> which breaks .mov files
old_video = """<video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover">
              <source src={heroVideoSrc} type="video/mp4" />
            </video>"""
new_video = """<video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover">
              <source src={heroVideoSrc} type={heroVideoSrc?.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
            </video>"""
content = content.replace(old_video, new_video)

with open(file_path, "w") as f:
    f.write(content)

print("Video fixed!")
