import sys
import re

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

# backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
# borderColor: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
bg_pattern = r"backgroundColor: isActive \? 'rgba\(255,255,255,0\.05\)' : 'rgba\(255,255,255,0\.02\)',"
bg_replacement = "backgroundColor: isActive ? `${area.color}22` : `${area.color}08`,"
content = re.sub(bg_pattern, bg_replacement, content)

border_pattern = r"borderColor: isActive \? 'rgba\(255,255,255,0\.15\)' : 'rgba\(255,255,255,0\.05\)',"
border_replacement = "borderColor: isActive ? `${area.color}44` : `${area.color}15`,"
content = re.sub(border_pattern, border_replacement, content)

with open("src/pages/HouseTrailer.tsx", "w") as f:
    f.write(content)
print("Colors updated")
