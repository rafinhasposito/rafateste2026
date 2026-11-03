import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add props to interface
content = content.replace(
    '  intent?: string | null;\n}',
    '  intent?: string | null;\n  houseCost?: number;\n  fullMapCost?: number;\n}'
)

# Pass props to UnlockPremiumModal
content = content.replace(
    '''      <UnlockPremiumModal 
        isOpen={isPaywallOpen} 
        isEmbedded={!!props.onUnlock}
        userCredits={props.userCredits}
        onClose={() => setIsPaywallOpen(false)}''',
    '''      <UnlockPremiumModal 
        isOpen={isPaywallOpen} 
        isEmbedded={!!props.onUnlock}
        userCredits={props.userCredits}
        houseCost={props.houseCost}
        fullMapCost={props.fullMapCost}
        onClose={() => setIsPaywallOpen(false)}'''
)

with open(file_path, "w") as f:
    f.write(content)

