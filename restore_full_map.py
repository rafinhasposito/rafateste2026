import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Fix handleUnlock 7 hardcoded
old_unlock = '''    const isUnlockAll = targetHouse === 0;
    const requiredCredits = isUnlockAll ? 7 : 1;'''
new_unlock = '''    const isUnlockAll = targetHouse === 0;
    const requiredCredits = isUnlockAll ? getCost("cost_full_map", 7) : getCost("cost_house_1", 1);'''
content = content.replace(old_unlock, new_unlock)

# Fix charge_credits 7 hardcoded
old_charge = '''            const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", {
               p_amount: 7,
               p_description: "Visão 360 Completa - Desbloqueio de 12 Casas",
               p_type: "deduction"
            });'''
new_charge = '''            const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", {
               p_amount: requiredCredits,
               p_description: "Visão 360 Completa - Desbloqueio de 12 Casas",
               p_type: "cost_full_map"
            });'''
content = content.replace(old_charge, new_charge)

# Fix Modal props
old_render = '''            unlockedCount={consultation.houses_unlocked}
          />
          <ConfirmCreditAction'''
new_render = '''            unlockedCount={consultation.houses_unlocked}
          />
          <ConfirmCreditAction
            fullMapCost={getCost("cost_full_map", 7)}
            houseCost={getCost("cost_house_1", 1)}'''
content = content.replace(old_render, new_render)

with open(file_path, "w") as f:
    f.write(content)

