import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

pattern = r"const isUnlockedLocally = props.isHouseUnlocked \? props.isHouseUnlocked\(P_DYNAMIC.house\) : \(area.unlocked \|\| unlockedItems.includes\(area.id\)\);"
replacement = r"const isUnlockedLocally = unlockedItems.includes(area.id);"

content = re.sub(pattern, replacement, content)

with open(file_path, "w") as f:
    f.write(content)

