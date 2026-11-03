import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add São Paulo and Rio to getHouseImageUrl
old_img_func = """  const getHouseImageUrl = (cityName: string, houseId: number, apiImg?: string) => {
    if (apiImg) return apiImg;
    const norm = (cityName||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (norm.includes("nova york") || norm.includes("new york")) return "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("toquio") || norm.includes("tokyo")) return "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("dubai")) return "https://images.unsplash.com/photo-1459787915554-b34915863013?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("paris")) return "https://images.unsplash.com/photo-1502602898657-3e907a5ea071?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("roma") || norm.includes("rome")) return "https://images.unsplash.com/photo-1516483638261-f40889eba30e?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("londres") || norm.includes("london")) return "https://images.unsplash.com/photo-1513635269975-59693e2d8400?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("bali")) return "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=80";
    
    return getAtmosphericFallback(houseId);
  };"""

new_img_func = """  const getHouseImageUrl = (cityName: string, houseId: number, apiImg?: string) => {
    if (apiImg) return apiImg;
    const norm = (cityName||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (norm.includes("nova york") || norm.includes("new york")) return "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("toquio") || norm.includes("tokyo")) return "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("dubai")) return "https://images.unsplash.com/photo-1459787915554-b34915863013?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("paris")) return "https://images.unsplash.com/photo-1502602898657-3e907a5ea071?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("roma") || norm.includes("rome")) return "https://images.unsplash.com/photo-1516483638261-f40889eba30e?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("londres") || norm.includes("london")) return "https://images.unsplash.com/photo-1513635269975-59693e2d8400?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("bali")) return "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("sao paulo") || norm.includes("são paulo")) return "https://images.unsplash.com/photo-1470160710819-b3bd5ec85c66?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("rio de janeiro")) return "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("santiago")) return "https://images.unsplash.com/photo-1689850543263-01a52ccc6943?auto=format&fit=crop&w=2000&q=80";
    
    return getAtmosphericFallback(houseId);
  };"""

content = content.replace(old_img_func, new_img_func)

# Also let's change the House 11 fallback to something that doesn't say "DESIGN" on a mug, which looks like a placeholder glitch
old_fallbacks = """      10: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
      11: "https://images.unsplash.com/photo-1511649475669-e288648b2339?auto=format&fit=crop&w=1000&q=80",
      12: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1000&q=80\""""

new_fallbacks = """      10: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
      11: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80", // Globe/Network
      12: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1000&q=80\""""

content = content.replace(old_fallbacks, new_fallbacks)

with open(file_path, "w") as f:
    f.write(content)
