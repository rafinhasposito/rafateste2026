import re

file_path = "../protocolo-solar-api/house_scanner.py"
with open(file_path, "r") as f:
    content = f.read()

# Find the line containing "Mumbai"
lines = content.split('\n')
new_lines = [line for line in lines if '"city": "Mumbai"' not in line]

with open(file_path, "w") as f:
    f.write('\n'.join(new_lines))

print(f"Removed {len(lines) - len(new_lines)} lines.")
