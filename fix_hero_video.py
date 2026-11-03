import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_get_video = """  const getHeroVideo = (cityName: string) => {
    const norm = (cityName||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const availableVideos = ["nova york", "tokyo", "dubai", "paris", "roma", "london", "bali"];
    if (availableVideos.some(v => norm.includes(v))) {
      const match = availableVideos.find(v => norm.includes(v));
      return `/assets/cities/${match?.replace('nova york', 'ny')}.mp4`;
    }
    return "/assets/particles.mp4"; // Fallback premium
  };"""

new_get_video = """  const getHeroVideo = (cityName: string) => {
    const norm = (cityName||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    
    // Mapeamento real dos vídeos contidos em public/assets/cities/
    if (norm.includes("atenas") || norm.includes("athens")) return "/assets/cities/athens.mp4";
    if (norm.includes("austin")) return "/assets/cities/austin.mp4";
    if (norm.includes("bali")) return "/assets/cities/bali.mp4";
    if (norm.includes("berlim") || norm.includes("berlin")) return "/assets/cities/berlin.mp4";
    if (norm.includes("cairo")) return "/assets/cities/cairo.mp4";
    if (norm.includes("dubai")) return "/assets/cities/dubai.mp4";
    if (norm.includes("florenca") || norm.includes("florence") || norm.includes("firenze")) return "/assets/cities/florence.mp4";
    if (norm.includes("genebra") || norm.includes("geneva")) return "/assets/cities/geneva.mp4";
    if (norm.includes("ibiza")) return "/assets/cities/ibiza.mp4";
    if (norm.includes("jerusalem") || norm.includes("jerusale")) return "/assets/cities/jerusalem.mp4";
    if (norm.includes("kyoto") || norm.includes("quioto")) return "/assets/cities/kyoto.mp4";
    if (norm.includes("las vegas")) return "/assets/cities/las_vegas.mp4";
    if (norm.includes("londres") || norm.includes("london")) return "/assets/cities/london.mp4";
    if (norm.includes("monaco")) return "/assets/cities/monaco.mp4";
    if (norm.includes("nova york") || norm.includes("new york")) return "/assets/cities/new_york.mp4";
    if (norm.includes("paris")) return "/assets/cities/paris.mp4";
    if (norm.includes("patagonia")) return "/assets/cities/patagonia.mp4";
    if (norm.includes("provence")) return "/assets/cities/provence.mp4";
    if (norm.includes("reykjavik")) return "/assets/cities/reykjavik.mp4";
    if (norm.includes("roma") || norm.includes("rome")) return "/assets/cities/roma.mov";
    if (norm.includes("san francisco") || norm.includes("sao francisco")) return "/assets/cities/san_francisco.mp4";
    if (norm.includes("santorini")) return "/assets/cities/santorini.mp4";
    if (norm.includes("seoul") || norm.includes("seul")) return "/assets/cities/seoul.mp4";
    if (norm.includes("singapur") || norm.includes("singapore")) return "/assets/cities/singapore.mp4";
    if (norm.includes("toquio") || norm.includes("tokyo")) return "/assets/cities/tokyo.mp4";
    if (norm.includes("veneza") || norm.includes("venice")) return "/assets/cities/venice.mp4";
    if (norm.includes("zurique") || norm.includes("zurich")) return "/assets/cities/zurich.mp4";

    return "/assets/particles.mp4"; // Fallback premium
  };"""

content = content.replace(old_get_video, new_get_video)

with open(file_path, "w") as f:
    f.write(content)

print("Video list mapped!")
