import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_props = '''            cities={{ highticket, acessivel, nacional }}
            allResults={consultation.result?.results}
            userCredits={credits}'''

new_props = '''            cities={{ highticket, acessivel, nacional }}
            allResults={consultation.result?.results}
            unlockedFocuses={consultation.result?.unlocked_focuses}
            userCredits={credits}'''

content = content.replace(old_props, new_props)

with open(file_path, "w") as f:
    f.write(content)

