import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_props = '''            unlockedCount={consultation.houses_unlocked}
            fullMapCost={getCost("cost_full_map", 7)}
            houseCost={getCost("cost_house_1", 1)}'''

new_props = '''            unlockedCount={consultation.houses_unlocked}
            fullMapCost={getCost("cost_full_map", 7)}
            houseCost={getCost("cost_house_1", 1)}
            focusCost={getCost("cost_focus", 1)}
            allFocusesCost={getCost("cost_all_focuses", 3)}'''

content = content.replace(old_props, new_props)

with open(file_path, "w") as f:
    f.write(content)

