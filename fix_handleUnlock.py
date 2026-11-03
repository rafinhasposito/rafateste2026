import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_unlock = """  const handleUnlock = async (targetHouse: number) => {
    if (!user || !profile || !consultation || unlocking) return;

    if (!isHouseLockedByConsultation(consultation, targetHouse)) {
      showAlert("Esta casa já está desbloqueada.");
      return;
    }

    setUnlocking(true);

    try {
      const { error: rpcError } = await supabase.rpc("unlock_consultation_houses", {
        p_consultation_id: consultation.id,
        p_target_house: targetHouse
      });

      if (rpcError) throw rpcError;"""

new_unlock = """  const handleUnlock = async (targetHouse: number) => {
    if (!user || !profile || !consultation || unlocking) return;

    if (!isHouseLockedByConsultation(consultation, targetHouse)) {
      showAlert("Esta casa já está desbloqueada.");
      return;
    }

    setUnlocking(true);

    try {
      if (isAdmin) {
        const newUnlocked = consultation.unlocked_houses ? [...consultation.unlocked_houses, targetHouse] : [targetHouse];
        const { error: updateError } = await supabase
          .from("consultations")
          .update({ unlocked_houses: Array.from(new Set(newUnlocked)) })
          .eq("id", consultation.id);
        if (updateError) throw updateError;
      } else {
        const { error: rpcError } = await supabase.rpc("unlock_consultation_houses", {
          p_consultation_id: consultation.id,
          p_target_house: targetHouse
        });
        if (rpcError) throw rpcError;
      }"""

content = content.replace(old_unlock, new_unlock)

with open(file_path, "w") as f:
    f.write(content)

print("Dashboard.tsx handleUnlock updated!")
