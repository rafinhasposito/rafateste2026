import re

file_path = "src/pages/HouseTrailerApp.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace year: year, with year: year.toString(), inside saveConsultation
old_year = "year,\n        mode,"
new_year = "year: year.toString(),\n        mode,"

content = content.replace(old_year, new_year)

with open(file_path, "w") as f:
    f.write(content)

print("Year cast to string!")
