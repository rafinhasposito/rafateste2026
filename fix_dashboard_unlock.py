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

new_unlock = """  const handleUnlock = async (targetHouse: number) => {
    if (!user || !profile || !consultation || unlocking) return;

    const isUnlockAll = targetHouse === 0;

    if (!isUnlockAll && !isHouseLockedByConsultation(consultation, targetHouse)) {
      showAlert("Esta casa já está desbloqueada.");
      return;
    }

    setUnlocking(true);

    try {
      if (isUnlockAll) {
         if (!isAdmin) {
            // Debit 7 credits manually
            const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", {
               p_amount: 7,
               p_description: "Visão 360 Completa - Desbloqueio de 12 Casas",
               p_type: "deduction"
            });
            if (chargeErr || !chargeSuccess) throw new Error(chargeErr?.message || "Erro ao debitar créditos");
         }
         
         // Update all 12 houses
         const allHouses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
         const { error: updateError } = await supabase
          .from("consultations")
          .update({ unlocked_houses: allHouses })
          .eq("id", consultation.id);
         if (updateError) throw updateError;
      } else {
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
        }
      }"""

content = content.replace(old_unlock, new_unlock)

# Also update the success alert
old_alert = """      showAlert(`Casa ${targetHouse} desbloqueada com sucesso.`);
      setSelectedHouse(targetHouse);"""
new_alert = """      if (isUnlockAll) {
        showAlert(`Visão 360 desbloqueada com sucesso!`);
      } else {
        showAlert(`Casa ${targetHouse} desbloqueada com sucesso.`);
        setSelectedHouse(targetHouse);
      }"""

content = content.replace(old_alert, new_alert)

with open(file_path, "w") as f:
    f.write(content)
