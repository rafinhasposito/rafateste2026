file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_success = """        onSuccess={(id, purchaseType) => {
          if (props.onUnlock && targetLockedArea?.houseNum) {
             // In production Dashboard mode, we call the real backend unlock
             // (We only support single route unlocks via this API in V1)
             props.onUnlock(targetLockedArea.houseNum);
             window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {"""

new_success = """        onSuccess={(id, purchaseType) => {
          if (props.onUnlock && targetLockedArea?.houseNum) {
             // Se purchaseType for 'full', passamos 0 como flag de Unlock All
             props.onUnlock(purchaseType === 'full' ? 0 : targetLockedArea.houseNum);
             window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {"""

content = content.replace(old_success, new_success)
with open(file_path, "w") as f:
    f.write(content)
