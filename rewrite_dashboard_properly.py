import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# We need to find the entire main return block starting at `  return (` (around line 293).
# The easiest way is to split by `  return (\n    <>\n      <StarryBackground />\n\n      <div className="min-h-[100dvh] px-4 py-8 max-w-7xl mx-auto relative z-10">`

split_marker = '  return (\n    <>\n      <StarryBackground />\n\n      <div className="min-h-[100dvh] px-4 py-8 max-w-7xl mx-auto relative z-10">'

parts = content.split(split_marker)
if len(parts) == 2:
    prefix = parts[0]
    suffix = parts[1]
    
    # We remove the AnimatePresence block inside the suffix that renders DestinyResults,
    # because we are moving it UP, outside the wrapper.
    
    # Let's use regex to remove `{/* Selected House Detail — unified DestinyResults layout */}` up to `</AnimatePresence>`
    suffix = re.sub(
        r'\{/\* Selected House Detail — unified DestinyResults layout \*/\}.*?</AnimatePresence>',
        '',
        suffix,
        flags=re.DOTALL
    )

    injection = """  // Se existe uma casa selecionada, o componente V3 (DestinyResults) assume 100% da tela.
  if (selectedHouse) {
    const house = cityDatabase[selectedHouse];
    const result = getHouseResult(selectedHouse);
    if (house && result) {
      const toArr = (v: any): CityOption[] => {
        if (!v) return [];
        if (Array.isArray(v)) return v.filter(Boolean);
        return [v];
      };
      const htArr = toArr(result.options?.highticket);
      const acArr = toArr(result.options?.acessivel);
      const naArr = toArr(result.options?.nacional);
      const masterCity = result.city || htArr[0] || acArr[0] || naArr[0] || null;
      const seen = new Set<string>();
      const dedup = (arr: CityOption[]): CityOption[] => arr.filter(c => {
        if (!c) return false;
        const k = `${c.city}|${c.country}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      if (masterCity) seen.add(`${masterCity.city}|${masterCity.country}`);
      const highticket: CityOption[] = masterCity ? [masterCity, ...dedup(htArr)] : dedup(htArr);
      const acessivel: CityOption[] = dedup(acArr);
      const nacional: CityOption[] = dedup(naArr);

      return (
        <>
          <DestinyResults
            house={selectedHouse}
            houseName={house.label}
            houseData={house}
            cities={{ highticket, acessivel, nacional }}
            allResults={consultation.result?.results}
            userCredits={credits}
            isAuthenticated={!!user}
            consultationId={consultation.id}
            autoUnlocked={true}
            onUnlock={(n) => setPendingUnlock(n)}
            embedded={false}
            isHouseUnlocked={isHouseLocked ? (h) => !isHouseLocked(h) : undefined}
            onSelectHouse={(h) => setSelectedHouse(h)}
            mode={currentMode}
            unlockedCount={consultation.houses_unlocked}
          />
          <ConfirmCreditAction
            open={pendingUnlock !== null}
            onOpenChange={(o) => { if (!o) setPendingUnlock(null); }}
            onConfirm={() => {
              const n = pendingUnlock;
              setPendingUnlock(null);
              if (n) handleUnlock(n);
            }}
            title={pendingUnlock ? `Desbloquear Casa ${pendingUnlock}` : ""}
            description={pendingUnlock ? `Você está prestes a desbloquear a Casa ${pendingUnlock} desta consulta.` : undefined}
            credits={1}
            currentBalance={credits}
            confirmLabel="Desbloquear agora"
            loading={unlocking}
          />
        </>
      );
    }
  }

"""
    new_content = prefix + injection + split_marker + suffix
    with open(file_path, "w") as f:
        f.write(new_content)
    print("SUCCESS")
else:
    print("FAILED TO FIND MARKER")
