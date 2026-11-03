import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add handleUnlockFocus
if "const handleUnlockFocus = async" not in content:
    unlock_func = """  const handleUnlockFocus = async (focusId: string, houseNum: number) => {
    if (!user || !profile || !consultation || unlocking) return;

    if (!isAdmin && credits < 1) {
      showAlert(`Você não tem créditos suficientes. Adquira mais no menu.`);
      navigate("/credits");
      throw new Error("Sem créditos");
    }

    setUnlocking(true);
    try {
      if (!isAdmin) {
        const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", {
          p_amount: 1,
          p_description: `Desbloqueio de Foco: ${focusId} (Casa ${houseNum})`,
          p_type: "deduction"
        });
        if (chargeErr || !chargeSuccess) throw new Error(chargeErr?.message || "Erro ao debitar créditos");
      }

      // Save to database
      const currentResult = consultation.result || {};
      const currentUnlockedFocuses = currentResult.unlocked_focuses || {};
      const houseFocuses = currentUnlockedFocuses[String(houseNum)] || [];
      
      if (!houseFocuses.includes(focusId)) {
        houseFocuses.push(focusId);
      }
      currentUnlockedFocuses[String(houseNum)] = houseFocuses;
      
      const newResult = { ...currentResult, unlocked_focuses: currentUnlockedFocuses };
      
      const { error: updateErr } = await supabase
        .from("consultations")
        .update({ result: newResult })
        .eq("id", consultation.id);
        
      if (updateErr) throw new Error("Erro ao salvar desbloqueio.");
      
      // Update local state
      setConsultation(prev => prev ? { ...prev, result: newResult } : null);
      if (!isAdmin) {
         setProfile(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);
      }
      showAlert("Foco ativado com sucesso!", "success");
    } catch (err: any) {
      showAlert(err.message || "Erro ao desbloquear.");
      throw err;
    } finally {
      setUnlocking(false);
    }
  };

  const isHouseLocked ="""
    
    content = content.replace("  const isHouseLocked =", unlock_func)

# Pass to AppleResultPreviewV3
content = content.replace(
    'onUnlock={(n) => handleUnlock(n)}',
    'onUnlock={(n) => handleUnlock(n)}\n            onUnlockFocus={(fid, hNum) => handleUnlockFocus(fid, hNum)}\n            unlockedFocuses={consultation.result?.unlocked_focuses || {}}'
)

with open(file_path, "w") as f:
    f.write(content)


file_path2 = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path2, "r") as f:
    content2 = f.read()

# Update DestinyResultsProps
if "unlockedFocuses?: Record" not in content2:
    content2 = content2.replace(
        'onUnlock?: (n: number) => void;',
        'onUnlock?: (n: number) => void;\n  onUnlockFocus?: (focusId: string, houseNum: number) => Promise<void>;\n  unlockedFocuses?: Record<string, string[]>;'
    )

# Update unlockedItems state logic
if "const [unlockingFocus, setUnlockingFocus]" not in content2:
    content2 = content2.replace(
        'const [unlockedItems, setUnlockedItems] = useState<string[]>(',
        'const [unlockingFocus, setUnlockingFocus] = useState<string | null>(null);\n  const [unlockedItems, setUnlockedItems] = useState<string[]>(['
    )
    # We'll just manually rewrite the state initialization to include props
    content2 = re.sub(
        r'const \[unlockedItems, setUnlockedItems\] = useState<string\[\]>\([\s\S]*?\);',
        '''const [unlockedItems, setUnlockedItems] = useState<string[]>(() => {
    const defaultFocus = intendedAreaId ? intendedAreaId : Object.keys(LIFE_AREAS)[0];
    const saved = P.unlockedFocuses?.[String(P_DYNAMIC.house)] || [];
    return [defaultFocus, ...saved];
  });
  
  useEffect(() => {
    const defaultFocus = intendedAreaId ? intendedAreaId : Object.keys(LIFE_AREAS)[0];
    const saved = P.unlockedFocuses?.[String(P_DYNAMIC.house)] || [];
    setUnlockedItems([defaultFocus, ...saved]);
  }, [P.unlockedFocuses, P_DYNAMIC.house, intendedAreaId]);''',
        content2
    )

# Update the unlock button logic
old_btn = '''onClick={(e) => { e.stopPropagation(); setUnlockedItems(prev => [...prev, activeArea.id]); }}'''
new_btn = '''onClick={async (e) => { 
                                  e.stopPropagation(); 
                                  if (P.onUnlockFocus) {
                                    setUnlockingFocus(activeArea.id);
                                    try {
                                      await P.onUnlockFocus(activeArea.id, P_DYNAMIC.house);
                                    } catch(err) {}
                                    finally { setUnlockingFocus(null); }
                                  } else {
                                    setUnlockedItems(prev => [...prev, activeArea.id]); 
                                  }
                                }}
                                disabled={unlockingFocus === activeArea.id}'''
content2 = content2.replace(old_btn, new_btn)

# Add spinner to button text if unlocking
content2 = content2.replace(
    'Desbloquear com 1 Crédito',
    '{unlockingFocus === activeArea.id ? "Desbloqueando..." : "Desbloquear com 1 Crédito"}'
)

with open(file_path2, "w") as f:
    f.write(content2)

