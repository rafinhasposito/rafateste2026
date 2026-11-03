import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace the entire return statement
old_return = content[content.find("  return ("):content.find("export default Dashboard;")]

# We want to keep ConfirmCreditAction at the root, and if selectedHouse is not null, we render DestinyResults at the root.
# If selectedHouse IS null, we render the fallback stuff (which shouldn't happen anyway since selectedHouse is always set).

new_return = """  if (selectedHouse) {
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

  return (
    <>
      <StarryBackground />
      <div className="min-h-[100dvh] px-4 py-8 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate("/")} className="text-muted-foreground text-xs uppercase tracking-widest hover:text-primary transition-colors">
            ← Nova Consulta
          </button>
          <button onClick={() => navigate("/credits")} className="text-xs uppercase tracking-widest text-primary hover:text-primary/80 transition-colors font-semibold">
            {credits} Créditos
          </button>
        </div>
        <div className="text-center py-20">
          <h2 className="text-2xl font-ps-display text-white">Nenhuma casa selecionada</h2>
          <p className="text-white/50 text-sm mt-2">Os dados da consulta podem estar incompletos.</p>
        </div>
      </div>
    </>
  );
};
"""

content = content.replace(old_return, new_return)

with open(file_path, "w") as f:
    f.write(content)
