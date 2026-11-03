import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Pass intent to DestinyResults
old_jsx = """          <DestinyResults
            house={selectedHouse}
            houseName={house.label}
            houseData={house}
            cities={{ highticket, acessivel, nacional }}
            allResults={consultation.result?.results}
            isHouseUnlocked={(h) => !isHouseLocked(h)}
            onSelectHouse={(h) => setSelectedHouse(h)}
          />"""
new_jsx = """          <DestinyResults
            house={selectedHouse}
            houseName={house.label}
            houseData={house}
            cities={{ highticket, acessivel, nacional }}
            allResults={consultation.result?.results}
            isHouseUnlocked={(h) => !isHouseLocked(h)}
            onSelectHouse={(h) => setSelectedHouse(h)}
            intent={consultation.intent}
          />"""
content = content.replace(old_jsx, new_jsx)

with open(file_path, "w") as f:
    f.write(content)
print("Dashboard.tsx updated to pass intent!")
