import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Import usePricing
content = content.replace(
    'import { useIsAdmin } from "@/hooks/useIsAdmin";',
    'import { useIsAdmin } from "@/hooks/useIsAdmin";\nimport { usePricing } from "@/hooks/usePricing";'
)

# 2. Add usePricing hook inside Dashboard component
content = content.replace(
    '  const { user, profile, refreshProfile } = useAuth();',
    '  const { user, profile, refreshProfile } = useAuth();\n  const { getCost, loading: pricingLoading } = usePricing();'
)

# 3. Fix handleUnlock hardcoded costs
old_unlock = '''    const isUnlockAll = pendingUnlock === "all";
    const requiredCredits = isUnlockAll ? 7 : 1;'''
new_unlock = '''    const isUnlockAll = pendingUnlock === "all";
    const requiredCredits = isUnlockAll ? getCost("cost_full_map", 7) : getCost("cost_house_1", 1);'''
content = content.replace(old_unlock, new_unlock)

# 4. Fix handleUnlockFocus hardcoded costs
old_focus = '''    const requiredCredits = 1;
    if (!isAdmin && credits < requiredCredits) {'''
new_focus = '''    const requiredCredits = getCost("cost_focus", 1);
    if (!isAdmin && credits < requiredCredits) {'''
content = content.replace(old_focus, new_focus)

# 5. Fix handleUnlock API call
old_rpc_unlock = '    const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", { p_amount: requiredCredits, p_reason: isUnlockAll ? "unlock_all" : "unlock_house" });'
new_rpc_unlock = '    const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", { p_amount: requiredCredits, p_reason: isUnlockAll ? "cost_full_map" : "cost_house_1" });'
content = content.replace(old_rpc_unlock, new_rpc_unlock)

# 6. Fix handleUnlockFocus API call
old_rpc_focus = '    const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", { p_amount: requiredCredits, p_reason: "unlock_focus" });'
new_rpc_focus = '    const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", { p_amount: requiredCredits, p_reason: "cost_focus" });'
content = content.replace(old_rpc_focus, new_rpc_focus)

with open(file_path, "w") as f:
    f.write(content)

