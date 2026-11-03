import re

file_path = "src/pages/HouseTrailerApp.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace('import { useState } from "react";\n\nimport { houseThemes }', 'import { houseThemes }')

with open(file_path, "w") as f:
    f.write(content)

print("Duplicate import removed")
