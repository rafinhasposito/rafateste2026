import sys
import re

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

pattern = r'(<span className="text-white font-ps-display text-sm font-bold drop-shadow-md">\{area\.score\}%</span>)'
replacement = r"""\1
                              {/* ROTATED TEXT SO THE USER KNOWS WHAT IT IS */}
                              <span className="text-white font-ps-display text-xs tracking-widest uppercase -rotate-90 mt-[120px] whitespace-nowrap drop-shadow-md opacity-70 group-hover:opacity-100 transition-opacity">
                                {area.label}
                              </span>"""

new_content = re.sub(pattern, replacement, content, count=1) # only replace the desktop one

with open("src/pages/HouseTrailer.tsx", "w") as f:
    f.write(new_content)
print("Fixed")
