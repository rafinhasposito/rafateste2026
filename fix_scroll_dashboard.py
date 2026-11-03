import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add a useEffect to scroll to top on mount
old_effect = "  useEffect(() => {\n    if (!user) return;"
new_effect = "  useEffect(() => {\n    window.scrollTo(0, 0);\n  }, [consultationId]);\n\n  useEffect(() => {\n    if (!user) return;"

content = content.replace(old_effect, new_effect)

with open(file_path, "w") as f:
    f.write(content)

print("Dashboard scroll fixed!")
