import re

file_path = "src/pages/HouseTrailerApp.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_h1 = 'className="text-[140px] md:text-[220px] font-ps-display font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 uppercase"'
new_h1 = 'className="text-[140px] md:text-[220px] font-ps-display font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 uppercase pb-6 md:pb-12"'

content = content.replace(old_h1, new_h1)

with open(file_path, "w") as f:
    f.write(content)

