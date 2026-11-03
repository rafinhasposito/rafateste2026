import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_code = '''          if (targetLockedArea?.type === 'foco') {
             if (purchaseType === 'single' && props.onUnlockFocus && targetLockedArea.houseNum) {
                props.onUnlockFocus(id, targetLockedArea.houseNum);
             } else if (purchaseType === 'full' && props.onUnlockAllFocuses && targetLockedArea.houseNum) {
                const allIds = LIFE_AREAS.map(a => a.id);
                props.onUnlockAllFocuses(allIds, targetLockedArea.houseNum);
             }
             return;
          }'''

new_code = '''          if (targetLockedArea?.type === 'foco') {
             if (purchaseType === 'single' && props.onUnlockFocus && targetLockedArea.houseNum) {
                setUnlockedItems(prev => [...prev, id]);
                setHoveredArea(id);
                props.onUnlockFocus(id, targetLockedArea.houseNum);
             } else if (purchaseType === 'full' && props.onUnlockAllFocuses && targetLockedArea.houseNum) {
                const allIds = LIFE_AREAS.map(a => a.id);
                setUnlockedItems(prev => [...new Set([...prev, ...allIds])]);
                setHoveredArea(id);
                props.onUnlockAllFocuses(allIds, targetLockedArea.houseNum);
             }
             return;
          }'''

content = content.replace(old_code, new_code)

with open(file_path, "w") as f:
    f.write(content)

