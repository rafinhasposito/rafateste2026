import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Fix handleUnlock hardcoded 7
content = content.replace(
    'const requiredCredits = isUnlockAll ? 7 : 1;',
    'const requiredCredits = isUnlockAll ? getCost("cost_full_map", 7) : getCost("cost_house_1", 1);'
)

# Fix charge_credits hardcoded 7
content = content.replace(
    '''            const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", {
               p_amount: 7,
               p_description: "Visão 360 Completa - Desbloqueio de 12 Casas",
               p_type: "deduction"
            });''',
    '''            const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", {
               p_amount: requiredCredits,
               p_description: "Visão 360 Completa - Desbloqueio de 12 Casas",
               p_type: "cost_full_map"
            });'''
)

# Fix ConfirmCreditAction hardcoded credits
content = content.replace(
    'credits={1}',
    'credits={getCost("cost_house_1", 1)}'
)

# Pass fullMapCost and houseCost to AppleResultPreviewV3
content = content.replace(
    'unlockedCount={consultation.houses_unlocked}\n          />',
    'unlockedCount={consultation.houses_unlocked}\n            fullMapCost={getCost("cost_full_map", 7)}\n            houseCost={getCost("cost_house_1", 1)}\n          />'
)

with open(file_path, "w") as f:
    f.write(content)

