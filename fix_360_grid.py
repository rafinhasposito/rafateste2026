import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Fix currentActiveData.image usage and imageForThisHouse
old_360_mock = """                  const fallbackCity = "Desconhecido";
                  const mappedCityName = resultForHouse && resultForHouse.city ? resultForHouse.city.city : fallbackCity;
                  const mockData = { city: mappedCityName, img: "1459787915554-b34915863013" };

                  const cityForThisHouse = isCurrent ? P_DYNAMIC.city.split(", ")[0] : (isUnlocked ? mockData.city.split(", ")[0] : "Bloqueado");
                  const imageForThisHouse = `https://images.unsplash.com/photo-${mockData.img}?auto=format&fit=crop&w=800&q=80`;"""

new_360_mock = """                  const fallbackCity = "Desconhecido";
                  const mappedCityName = resultForHouse && resultForHouse.city ? resultForHouse.city.city : fallbackCity;
                  
                  const cityForThisHouse = isCurrent ? P_DYNAMIC.city.split(", ")[0] : (isUnlocked ? mappedCityName.split(", ")[0] : "Bloqueado");
                  const imageForThisHouse = resultForHouse?.options?.highticket?.img 
                    ? resultForHouse.options.highticket.img 
                    : getAtmosphericFallback(houseNum);"""

content = content.replace(old_360_mock, new_360_mock)

# Also fix the currentActiveData.image usage (which relies on LIFE_AREAS fallback)
old_img_usage = """                            <img src={isCurrent ? currentActiveData.image : imageForThisHouse} alt={cityForThisHouse} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />"""
new_img_usage = """                            <img src={isCurrent ? getHouseImageUrl(P_DYNAMIC.city, P_DYNAMIC.house, bestCity?.img) : imageForThisHouse} alt={cityForThisHouse} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />"""

content = content.replace(old_img_usage, new_img_usage)

with open(file_path, "w") as f:
    f.write(content)
