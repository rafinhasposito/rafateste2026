import sys
import re

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

# In the left menu, we have:
# initial={{ width: 0 }}
# animate={{ width: `${area.score}%` }}
# transition={{ duration: 1, delay: 0.1 }}
pattern = r'initial=\{\{\s*width:\s*0\s*\}\}\s*animate=\{\{\s*width:\s*`\$\{area\.score\}%`\s*\}\}\s*transition=\{\{\s*duration:\s*1,\s*delay:\s*0\.1\s*\}\}'
replacement = r'animate={{ width: showDetails ? `${area.score}%` : "0%" }}\n                              transition={{ duration: 0.8, type: "spring", bounce: 0.3, delay: showDetails ? 0.2 : 0 }}'

content = re.sub(pattern, replacement, content)

with open("src/pages/HouseTrailer.tsx", "w") as f:
    f.write(content)
print("Success")
