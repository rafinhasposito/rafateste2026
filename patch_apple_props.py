import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_props = '''  houseCost?: number;
  fullMapCost?: number;'''

new_props = '''  houseCost?: number;
  fullMapCost?: number;
  focusCost?: number;
  allFocusesCost?: number;'''

content = content.replace(old_props, new_props)

old_modal = '''      <UnlockPremiumModal 
        isOpen={isPaywallOpen} 
        isEmbedded={!!props.onUnlock}
        userCredits={props.userCredits}
        houseCost={props.houseCost}
        fullMapCost={props.fullMapCost}'''

new_modal = '''      <UnlockPremiumModal 
        isOpen={isPaywallOpen} 
        isEmbedded={!!props.onUnlock}
        userCredits={props.userCredits}
        houseCost={props.houseCost}
        fullMapCost={props.fullMapCost}
        focusCost={props.focusCost}
        allFocusesCost={props.allFocusesCost}'''

content = content.replace(old_modal, new_modal)

with open(file_path, "w") as f:
    f.write(content)

