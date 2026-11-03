import re
with open("src/pages/History.tsx", "r") as f:
    content = f.read()

content = content.replace('.select("id, name, birth_date, created_at, mode, goal, origin, houses_unlocked")', '.select("*")')

with open("src/pages/History.tsx", "w") as f:
    f.write(content)
print("History fixed to select *")
