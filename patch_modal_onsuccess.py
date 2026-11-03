import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_on_success = '''        onSuccess={(id, purchaseType) => {
          if (props.onUnlock && targetLockedArea?.houseNum) {
             // Se purchaseType for 'full', passamos 0 como flag de Unlock All
             props.onUnlock(purchaseType === 'full' ? 0 : targetLockedArea.houseNum);
             window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
             // Sandbox / Preview mode behavior'''

new_on_success = '''        onSuccess={(id, purchaseType) => {
          if (targetLockedArea?.type === 'foco') {
             if (purchaseType === 'single' && props.onUnlockFocus && targetLockedArea.houseNum) {
                props.onUnlockFocus(id, targetLockedArea.houseNum);
             } else if (purchaseType === 'full' && props.onUnlockAllFocuses && targetLockedArea.houseNum) {
                const allIds = LIFE_AREAS.map(a => a.id);
                props.onUnlockAllFocuses(allIds, targetLockedArea.houseNum);
             }
             return;
          }
          
          if (targetLockedArea?.type === 'rota' && props.onUnlock && targetLockedArea?.houseNum) {
             props.onUnlock(purchaseType === 'full' ? 0 : targetLockedArea.houseNum);
             window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (!props.onUnlock) {
             // Sandbox / Preview mode behavior'''

content = content.replace(old_on_success, new_on_success)

with open(file_path, "w") as f:
    f.write(content)

