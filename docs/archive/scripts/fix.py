with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

import re
pattern = r"const handleSelectIntention = \(id: string, e: React\.MouseEvent\) => \{"
replacement = """const handleSelectIntention = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIntention(id);
  };"""

new_content = re.sub(pattern, replacement, content)

with open("src/pages/HouseTrailer.tsx", "w") as f:
    f.write(new_content)
print("Fixed")
