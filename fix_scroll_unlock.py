import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add scroll to top inside onSuccess
old_success = """        onSuccess={(id, purchaseType) => {
          if (props.onUnlock && targetLockedArea?.houseNum) {
             // In production Dashboard mode, we call the real backend unlock
             // (We only support single route unlocks via this API in V1)
             props.onUnlock(targetLockedArea.houseNum);
          } else {"""

new_success = """        onSuccess={(id, purchaseType) => {
          if (props.onUnlock && targetLockedArea?.houseNum) {
             // In production Dashboard mode, we call the real backend unlock
             // (We only support single route unlocks via this API in V1)
             props.onUnlock(targetLockedArea.houseNum);
             window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {"""

content = content.replace(old_success, new_success)

with open(file_path, "w") as f:
    f.write(content)

print("Scroll to top added!")
