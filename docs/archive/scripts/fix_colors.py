import re

with open('src/data/houseThemes.ts', 'r') as f:
    content = f.read()

colors = [
    "#E11D48", # Casa 1
    "#10B981", # Casa 2
    "#F59E0B", # Casa 3
    "#38BDF8", # Casa 4
    "#F97316", # Casa 5
    "#14B8A6", # Casa 6
    "#EC4899", # Casa 7
    "#A21CAF", # Casa 8
    "#6366F1", # Casa 9
    "#64748B", # Casa 10
    "#3B82F6", # Casa 11
    "#8B5CF6", # Casa 12
]

def replacer(match):
    replacer.counter += 1
    if replacer.counter <= len(colors):
        return f'"themeColor": "{colors[replacer.counter - 1]}"'
    return match.group(0)

replacer.counter = 0

new_content = re.sub(r'"themeColor":\s*"#[0-9A-Fa-f]+"', replacer, content)

with open('src/data/houseThemes.ts', 'w') as f:
    f.write(new_content)
print("Updated successfully")
