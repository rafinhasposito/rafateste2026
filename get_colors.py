import re

with open('src/data/houseThemes.ts', 'r') as f:
    content = f.read()

colors = {}
for match in re.finditer(r'"(\d+)":\s*\{[^}]*?"themeColor":\s*"([^"]+)"', content, re.DOTALL):
    colors[match.group(1)] = match.group(2)
print(colors)
