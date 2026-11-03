import re
file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_unlock = """  const handleUnlock = async (targetHouse: number) => {
    if (!user || !profile || !consultation || unlocking) return;

    const isUnlockAll = targetHouse === 0;

    if (!isUnlockAll && !isHouseLockedByConsultation(consultation, targetHouse)) {
      showAlert("Esta casa já está desbloqueada.");
      return;
    }

    setUnlocking(true);"""

new_unlock = """  const handleUnlock = async (targetHouse: number) => {
    if (!user || !profile || !consultation || unlocking) return;

    const isUnlockAll = targetHouse === 0;
    const requiredCredits = isUnlockAll ? 7 : 1;

    if (!isAdmin && credits < requiredCredits) {
      showAlert(`Você não tem créditos suficientes. Adquira mais no menu.`);
      navigate("/credits");
      return;
    }

    if (!isUnlockAll && !isHouseLockedByConsultation(consultation, targetHouse)) {
      showAlert("Esta casa já está desbloqueada.");
      return;
    }

    setUnlocking(true);"""

content = content.replace(old_unlock, new_unlock)
with open(file_path, "w") as f:
    f.write(content)
