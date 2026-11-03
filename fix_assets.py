import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Fix getHeroVideo
old_hero_video = """  const getHeroVideo = (houseId: number) => {
    const vids: Record<number, string> = {
      1: "/assets/ny.mp4",
      2: "/assets/cities/tokyo.mp4",
      3: "/assets/cities/dubai.mp4",
      9: "/assets/cities/paris.mp4",
      10: "/assets/cities/roma.mov",
      11: "/assets/cities/london.mp4",
      12: "/assets/cities/bali.mp4"
    };
    return vids[houseId] || "/assets/particles.mp4";
  };
  const heroVideoSrc = getHeroVideo(P_DYNAMIC.house);"""

new_hero_video = """  const getHeroVideo = (cityName: string) => {
    if (!cityName) return "/assets/particles.mp4";
    const norm = cityName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (norm.includes("nova york") || norm.includes("new york")) return "/assets/ny.mp4";
    if (norm.includes("toquio") || norm.includes("tokyo")) return "/assets/cities/tokyo.mp4";
    if (norm.includes("dubai")) return "/assets/cities/dubai.mp4";
    if (norm.includes("paris")) return "/assets/cities/paris.mp4";
    if (norm.includes("roma") || norm.includes("rome")) return "/assets/cities/roma.mov";
    if (norm.includes("londres") || norm.includes("london")) return "/assets/cities/london.mp4";
    if (norm.includes("bali")) return "/assets/cities/bali.mp4";
    return "/assets/particles.mp4"; 
  };
  const heroVideoSrc = getHeroVideo(P_DYNAMIC.city);"""

content = content.replace(old_hero_video, new_hero_video)

# 2. Fix _mockCities fallbacks to be generic atmospheric instead of specific wrong cities
old_mock_cities = """  const _mockCities = {
    nacional: [ { city: "São Paulo, SP", country: "Brasil", score: 96, lat: -23.55, lon: -46.63, img: "https://images.unsplash.com/photo-1470160710819-b3bd5ec85c66?auto=format&fit=crop&w=1000&q=80" } ],
    acessivel: [ { city: "Santiago", country: "Chile", score: 94, lat: -33.45, lon: -70.67, img: "https://images.unsplash.com/photo-1689850543263-01a52ccc6943?auto=format&fit=crop&w=1000&q=80" } ],
    highticket: [ { city: "Dubai", country: "Emirados Árabes", score: 98, lat: 25.20, lon: 55.27, img: "https://images.unsplash.com/photo-1459787915554-b34915863013?auto=format&fit=crop&w=1000&q=80" } ]
  };"""

new_mock_cities = """  // Fallbacks genéricos e atmosféricos baseados no luxo e não em cidades específicas
  const getAtmosphericFallback = (house: number) => {
    const fallbacks: Record<number, string> = {
      1: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=1000&q=80",
      2: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1000&q=80",
      3: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80",
      4: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1000&q=80",
      5: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
      6: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d4?auto=format&fit=crop&w=1000&q=80",
      7: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80",
      8: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
      9: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1000&q=80",
      10: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
      11: "https://images.unsplash.com/photo-1511649475669-e288648b2339?auto=format&fit=crop&w=1000&q=80",
      12: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1000&q=80"
    };
    return fallbacks[house] || fallbacks[2];
  };

  const _mockCities = {
    nacional: [ { city: "Nacional", country: "Rota", score: 96, lat: 0, lon: 0, img: getAtmosphericFallback(P_DYNAMIC.house) } ],
    acessivel: [ { city: "Acessível", country: "Rota", score: 94, lat: 0, lon: 0, img: getAtmosphericFallback(P_DYNAMIC.house) } ],
    highticket: [ { city: "High-Ticket", country: "Rota", score: 98, lat: 0, lon: 0, img: getAtmosphericFallback(P_DYNAMIC.house) } ]
  };"""

content = content.replace(old_mock_cities, new_mock_cities)

# 3. Fix houseFixedImageUrl
old_fixed_img = """  const houseFixedImageUrl = `https://images.unsplash.com/photo-1459787915554-b34915863013?auto=format&fit=crop&w=2000&q=80`;"""
new_fixed_img = """  const getHouseImageUrl = (cityName: string, houseId: number, apiImg?: string) => {
    if (apiImg) return apiImg;
    const norm = (cityName||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (norm.includes("nova york")) return "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("toquio")) return "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("dubai")) return "https://images.unsplash.com/photo-1459787915554-b34915863013?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("paris")) return "https://images.unsplash.com/photo-1502602898657-3e907a5ea071?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("roma")) return "https://images.unsplash.com/photo-1516483638261-f40889eba30e?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("londres")) return "https://images.unsplash.com/photo-1513635269975-59693e2d8400?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("bali")) return "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=80";
    
    return getAtmosphericFallback(houseId);
  };
  const houseFixedImageUrl = getHouseImageUrl(P_DYNAMIC.city, P_DYNAMIC.house, bestCity?.img);"""

content = content.replace(old_fixed_img, new_fixed_img)

# 4. Fix Visão 360 grid (12 houses) images which are hardcoded in the map
old_grid_images = """                              <div className="absolute inset-0 z-0">
                                <img src={`https://images.unsplash.com/photo-${mockData.img}?auto=format&fit=crop&w=800&q=80`} alt={cityName} className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                                <div className="absolute inset-0 bg-[#030306]/80 group-hover:bg-[#030306]/60 transition-colors duration-500"></div>
                              </div>"""
new_grid_images = """                              <div className="absolute inset-0 z-0">
                                <img src={houseStatus.unlocked && cityObj?.options?.highticket?.img ? cityObj.options.highticket.img : getAtmosphericFallback(houseNum)} alt={cityName} className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                                <div className="absolute inset-0 bg-[#030306]/80 group-hover:bg-[#030306]/60 transition-colors duration-500"></div>
                              </div>"""

content = content.replace(old_grid_images, new_grid_images)

with open(file_path, "w") as f:
    f.write(content)
