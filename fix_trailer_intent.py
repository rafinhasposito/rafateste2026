import re

file_path = "src/pages/HouseTrailerApp.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_intent = "intent: houseIntent,"
new_intent = "intent: selectedIntention || houseIntent,"

content = content.replace(old_intent, new_intent)

with open(file_path, "w") as f:
    f.write(content)

print("Trailer intent patched!")
