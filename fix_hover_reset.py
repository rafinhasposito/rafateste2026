import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Find where useState for hoveredArea is
pattern = r"const \[hoveredArea, setHoveredArea\] = useState<string \| null>\(null\);"

replacement = """const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  // Force reset hovered focus when the house changes so it defaults to the highest score of the new house
  React.useEffect(() => {
    setHoveredArea(null);
  }, [P_DYNAMIC.house]);"""

content = re.sub(pattern, replacement, content)

with open(file_path, "w") as f:
    f.write(content)

print("Reset logic injected!")
