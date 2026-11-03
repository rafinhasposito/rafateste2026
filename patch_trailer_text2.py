import re

file_path = "src/pages/HouseTrailerApp.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_h2 = 'className="text-xl md:text-3xl font-ps-display font-light tracking-tight text-white/80 mt-[-10px] md:mt-[-20px]"'
new_h2 = 'className="text-xl md:text-3xl font-ps-display font-light tracking-tight text-white/80 mt-[-30px] md:mt-[-60px]"'

content = content.replace(old_h2, new_h2)

with open(file_path, "w") as f:
    f.write(content)

