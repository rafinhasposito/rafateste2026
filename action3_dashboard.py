import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Import useIsAdmin
if "import { useIsAdmin }" not in content:
    content = content.replace('import { useAuth } from "@/hooks/useAuth";', 'import { useAuth } from "@/hooks/useAuth";\nimport { useIsAdmin } from "@/hooks/useIsAdmin";')

# Inject useIsAdmin into Dashboard component
if "const { isAdmin } = useIsAdmin();" not in content:
    content = content.replace("export default function Dashboard() {\n  const { user } = useAuth();", "export default function Dashboard() {\n  const { user } = useAuth();\n  const { isAdmin } = useIsAdmin();")

# Replace handleUnlock
old_handleUnlock = """  const handleUnlock = async (houseNum: number | string) => {
    if (!consultation || !user) return false;
    if (unlocking) return false;

    if (credits < 1) {
      showAlert("Você não tem créditos suficientes. Adquira mais no menu.");
      navigate("/credits");
      return false;
    }

    setUnlocking(true);
    try {
      const targetHouse = typeof houseNum === "string" ? parseInt(houseNum, 10) : houseNum;
      
      const { data: rpcData, error: rpcError } = await supabase.rpc("charge_and_unlock_house", {
        p_consultation_id: consultation.id,
        p_target_house: targetHouse
      });

      if (rpcError) throw rpcError;"""

new_handleUnlock = """  const handleUnlock = async (houseNum: number | string) => {
    if (!consultation || !user) return false;
    if (unlocking) return false;

    setUnlocking(true);
    try {
      const targetHouse = typeof houseNum === "string" ? parseInt(houseNum, 10) : houseNum;
      
      if (isAdmin) {
        // Admin bypass: just unlock the house without charging
        const newUnlocked = consultation.unlocked_houses ? [...consultation.unlocked_houses, targetHouse] : [targetHouse];
        const { error: updateError } = await supabase
          .from("consultations")
          .update({ unlocked_houses: Array.from(new Set(newUnlocked)) })
          .eq("id", consultation.id);
        if (updateError) throw updateError;
      } else {
        if (credits < 1) {
          showAlert("Você não tem créditos suficientes. Adquira mais no menu.");
          navigate("/credits");
          setUnlocking(false);
          return false;
        }

        const { data: rpcData, error: rpcError } = await supabase.rpc("charge_and_unlock_house", {
          p_consultation_id: consultation.id,
          p_target_house: targetHouse
        });

        if (rpcError) throw rpcError;
      }"""

content = content.replace(old_handleUnlock, new_handleUnlock)

with open(file_path, "w") as f:
    f.write(content)

print("Dashboard patched (Action 3)!")
