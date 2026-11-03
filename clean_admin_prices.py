import re

file_path = "src/components/admin/PricingEditor.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Filter obsolete keys
old_costs_filter = 'const costs = items.filter(i => i.category === "cost");'
new_costs_filter = 'const costs = items.filter(i => i.category === "cost" && !["cost_house_3", "cost_full_map"].includes(i.key));'
content = content.replace(old_costs_filter, new_costs_filter)

with open(file_path, "w") as f:
    f.write(content)

