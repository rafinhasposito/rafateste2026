import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_click = """                      onClick={() => {
                        if (!isUnlocked) {
                          setTargetLockedArea({ label: label, color: areaColor, id: num.toString(), type: 'rota', houseNum: num }); setIsPaywallOpen(true);
                        }
                      }}"""

new_click = """                      onClick={() => {
                        if (!isUnlocked) {
                          setTargetLockedArea({ label: label, color: areaColor, id: num.toString(), type: 'rota', houseNum: num }); setIsPaywallOpen(true);
                        } else if (!isCurrent && props.onSelectHouse) {
                          props.onSelectHouse(num);
                        }
                      }}"""

content = content.replace(old_click, new_click)

# Also fix "cursor-default" when unlocked but not current, should be "cursor-pointer hover:border-white/20"
old_class = """                          : isUnlocked 
                            ? 'bg-[#050505] cursor-default'"""
new_class = """                          : isUnlocked 
                            ? 'bg-[#050505] cursor-pointer hover:border-white/20'"""
content = content.replace(old_class, new_class)

with open(file_path, "w") as f:
    f.write(content)

print("Footer navigation fixed!")
