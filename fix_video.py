import re

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

# Replace the AURA / BACKGROUND block
old_bg = """                    {/* AURA / BACKGROUND */}
                    <div className="absolute inset-0 bg-black/60" />
                    {isActive && (
                      <>
                        <div className="absolute inset-0 opacity-40 pointer-events-none transition-colors duration-1000" style={{ backgroundImage: `radial-gradient(circle at top right, ${area.color} 0%, transparent 70%)` }} />
                        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-50 pointer-events-none" src="/videos/aura-loop.mp4" />
                        <div className="absolute inset-0 mix-blend-color opacity-70 pointer-events-none transition-colors duration-1000" style={{ backgroundColor: area.color }} />
                      </>
                    )}"""

new_bg = """                    {/* AURA / BACKGROUND SEMPRE PRESENTE (FLUIDEZ) */}
                    <div className="absolute inset-0 bg-[#030306]" />
                    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isActive ? 'opacity-40' : 'opacity-10'}`} style={{ backgroundImage: `radial-gradient(circle at top right, ${area.color} 0%, transparent 70%)` }} />
                    <video autoPlay loop muted playsInline className={`absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none transition-opacity duration-700 ${isActive ? 'opacity-50' : 'opacity-20'}`} src="/videos/aura-loop.mp4" />
                    <div className={`absolute inset-0 mix-blend-color pointer-events-none transition-opacity duration-700 ${isActive ? 'opacity-70' : 'opacity-30'}`} style={{ backgroundColor: area.color }} />"""

content = content.replace(old_bg, new_bg)

with open("src/pages/HouseTrailer.tsx", "w") as f:
    f.write(content)
print("Video fixed")
