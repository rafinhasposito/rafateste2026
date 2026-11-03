file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add intent prop to DestinyResults
old_destiny = """          <DestinyResults
            house={selectedHouse}"""
new_destiny = """          <DestinyResults
            intent={consultation.intent}
            house={selectedHouse}"""
content = content.replace(old_destiny, new_destiny)

with open(file_path, "w") as f:
    f.write(content)
print("Dashboard.tsx DestinyResults updated!")
