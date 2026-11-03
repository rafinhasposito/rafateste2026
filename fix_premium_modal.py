import re

# 1. Update AppleResultPreviewV3.tsx
file_path_v3 = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path_v3, "r") as f:
    content_v3 = f.read()

# Update the state definition to include houseNum
old_state = "const [targetLockedArea, setTargetLockedArea] = useState<{ id: string; label: string; color: string; type: 'foco' | 'rota' } | null>(null);"
new_state = "const [targetLockedArea, setTargetLockedArea] = useState<{ id: string; label: string; color: string; type: 'foco' | 'rota', houseNum?: number } | null>(null);"
content_v3 = content_v3.replace(old_state, new_state)

# Replace the onClick handler for Foco
old_foco_click = "if (props.onUnlock) { props.onUnlock(P_DYNAMIC.house); } else { setTargetLockedArea({ id: area.id, label: area.label, color: area.color, type: 'foco' }); setIsPaywallOpen(true); }"
new_foco_click = "setTargetLockedArea({ id: area.id, label: area.label, color: area.color, type: 'foco', houseNum: P_DYNAMIC.house }); setIsPaywallOpen(true);"
content_v3 = content_v3.replace(old_foco_click, new_foco_click)

# Replace the onClick handler for Rota
old_rota_click = "if (props.onUnlock) { props.onUnlock(num); } else { setTargetLockedArea({ label: label, color: areaColor, id: num.toString(), type: 'rota' }); setIsPaywallOpen(true); }"
new_rota_click = "setTargetLockedArea({ label: label, color: areaColor, id: num.toString(), type: 'rota', houseNum: num }); setIsPaywallOpen(true);"
content_v3 = content_v3.replace(old_rota_click, new_rota_click)

# Update onSuccess to call props.onUnlock if it exists
old_on_success = """        onSuccess={(id, purchaseType) => {
          if (purchaseType === 'single') {
            setUnlockedItems(prev => [...prev, id]);
            if (targetLockedArea?.type === 'foco') {
              setHoveredArea(id);
            }
          } else {
            // Full unlock (all 12 houses and focuses)
            const allIds = [
              ...LIFE_AREAS.map(a => a.id),
              ..."1,2,3,4,5,6,7,8,9,10,11,12".split(',')
            ];
            setUnlockedItems(allIds);
            if (targetLockedArea?.type === 'foco') {
              setHoveredArea(id);
            }
          }
        }}"""

new_on_success = """        onSuccess={(id, purchaseType) => {
          if (props.onUnlock && targetLockedArea?.houseNum) {
             // In production Dashboard mode, we call the real backend unlock
             // (We only support single route unlocks via this API in V1)
             props.onUnlock(targetLockedArea.houseNum);
          } else {
             // Sandbox / Preview mode behavior
             if (purchaseType === 'single') {
               setUnlockedItems(prev => [...prev, id]);
               if (targetLockedArea?.type === 'foco') {
                 setHoveredArea(id);
               }
             } else {
               // Full unlock (all 12 houses and focuses)
               const allIds = [
                 ...LIFE_AREAS.map(a => a.id),
                 ..."1,2,3,4,5,6,7,8,9,10,11,12".split(',')
               ];
               setUnlockedItems(allIds);
               if (targetLockedArea?.type === 'foco') {
                 setHoveredArea(id);
               }
             }
          }
        }}"""
content_v3 = content_v3.replace(old_on_success, new_on_success)

with open(file_path_v3, "w") as f:
    f.write(content_v3)


# 2. Update Dashboard.tsx
file_path_dash = "src/pages/Dashboard.tsx"
with open(file_path_dash, "r") as f:
    content_dash = f.read()

# Change onUnlock in Dashboard to skip the pending modal
old_dash_unlock = "onUnlock={(n) => setPendingUnlock(n)}"
new_dash_unlock = "onUnlock={(n) => handleUnlock(n)}"
content_dash = content_dash.replace(old_dash_unlock, new_dash_unlock)

# But wait, there are two instances of DestinyResults in Dashboard! One for mobile, one for desktop? 
# Actually let's check
if old_dash_unlock in content_dash:
    content_dash = content_dash.replace(old_dash_unlock, new_dash_unlock)

with open(file_path_dash, "w") as f:
    f.write(content_dash)

print("Modal Premium restored!")
