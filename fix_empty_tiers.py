import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_tier_map = """                    {tier.data.map((city, i) => (
                      <div key={i} className="bg-black border rounded-[28px] overflow-hidden transition-all group relative h-56 flex flex-col justify-end p-6 cursor-pointer" style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = currentActiveData?.color || '#10b981'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                      >
                        <div className="absolute inset-0">
                          <img src={city.img} alt={city.city} className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-90 transition-all duration-1000 ease-[0.19,1,0.22,1]" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent"></div>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                        </div>
                        <div className="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                          <div className="flex justify-between items-end mb-3">
                            <h5 className="font-ps-display text-2xl font-bold text-white transition-colors">{city.city}</h5>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
                              <MapPin className="w-4 h-4" style={{ color: currentActiveData?.color || '#10b981' }} />
                              <span className="uppercase tracking-widest text-[10px]">{city.country}</span>
                            </div>
                            <span className="font-sans text-[10px] font-bold px-3 py-1.5 rounded-full border" style={{ backgroundColor: `${currentActiveData?.color || '#10b981'}15`, color: currentActiveData?.color || '#10b981', borderColor: `${currentActiveData?.color || '#10b981'}30` }}>{city.score}% MATCH</span>
                          </div>
                        </div>
                      </div>
                    ))}"""

new_tier_map = """                    {tier.data.length > 0 ? tier.data.map((city, i) => (
                      <div key={i} className="bg-black border rounded-[28px] overflow-hidden transition-all group relative h-56 flex flex-col justify-end p-6 cursor-pointer" style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = currentActiveData?.color || '#10b981'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                      >
                        <div className="absolute inset-0">
                          <img src={city.img} alt={city.city} className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-90 transition-all duration-1000 ease-[0.19,1,0.22,1]" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent"></div>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                        </div>
                        <div className="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                          <div className="flex justify-between items-end mb-3">
                            <h5 className="font-ps-display text-2xl font-bold text-white transition-colors">{city.city}</h5>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
                              <MapPin className="w-4 h-4" style={{ color: currentActiveData?.color || '#10b981' }} />
                              <span className="uppercase tracking-widest text-[10px]">{city.country}</span>
                            </div>
                            <span className="font-sans text-[10px] font-bold px-3 py-1.5 rounded-full border" style={{ backgroundColor: `${currentActiveData?.color || '#10b981'}15`, color: currentActiveData?.color || '#10b981', borderColor: `${currentActiveData?.color || '#10b981'}30` }}>{city.score}% MATCH</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="bg-black/40 border border-white/5 rounded-[28px] h-56 flex flex-col items-center justify-center p-6 text-center">
                         <MapPin className="w-6 h-6 text-white/20 mb-3" />
                         <span className="font-sans text-xs uppercase tracking-widest text-white/40 font-bold mb-1">Rota Indisponível</span>
                         <span className="text-white/20 text-[10px]">A API não retornou destino para este tier.</span>
                      </div>
                    )}"""

content = content.replace(old_tier_map, new_tier_map)

# Also let's fix citiesObj mapping to explicitly clear out if missing, rather than falling back to props.cities which is for the initial house
old_cities_obj = """  const citiesObj = {
    nacional: naRoute ? [naRoute] : props.cities?.nacional || [],
    acessivel: acRoute ? [acRoute] : props.cities?.acessivel || [],
    highticket: htRoute ? [htRoute] : props.cities?.highticket || []
  };"""

new_cities_obj = """  // Somente usa o props.cities genérico se currentHouseResult não existir E estivermos na mesma casa inicial
  const isInitialHouse = !props.allResults || (props.consultationId && P_DYNAMIC.house === props.house);
  const fallbackNa = isInitialHouse ? props.cities?.nacional : [];
  const fallbackAc = isInitialHouse ? props.cities?.acessivel : [];
  const fallbackHt = isInitialHouse ? props.cities?.highticket : [];
  
  const citiesObj = {
    nacional: naRoute ? [naRoute] : fallbackNa || [],
    acessivel: acRoute ? [acRoute] : fallbackAc || [],
    highticket: htRoute ? [htRoute] : fallbackHt || []
  };"""

content = content.replace(old_cities_obj, new_cities_obj)

with open(file_path, "w") as f:
    f.write(content)
