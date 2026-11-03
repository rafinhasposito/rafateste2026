import re

file_path = "src/components/UnlockPremiumModal.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_signature = '''export default function UnlockPremiumModal({ isOpen, onClose, onSuccess, targetArea, isEmbedded, userCredits, houseCost = 1, fullMapCost = 7 }: Props & { houseCost?: number; fullMapCost?: number }) {'''

new_signature = '''export default function UnlockPremiumModal({ isOpen, onClose, onSuccess, targetArea, isEmbedded, userCredits, houseCost = 1, fullMapCost = 7, focusCost = 1, allFocusesCost = 3 }: Props & { houseCost?: number; fullMapCost?: number, focusCost?: number, allFocusesCost?: number }) {'''

content = content.replace(old_signature, new_signature)

old_opcao2 = '''            {/* Opção 2 */}
            <div onClick={() => handleUnlock('full')} className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border rounded-2xl p-6 hover:brightness-110 transition-all cursor-pointer group" style={{ borderColor: `${color}50` }}>
              <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                <span className="font-mono text-[9px] uppercase font-bold text-black tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Melhor Custo-Benefício
                </span>
              </div>
              <div className="flex justify-between items-start mb-2 mt-2">
                <h4 className="text-white font-bold text-xl">Visão 360º Completa</h4>
                <div className="font-mono font-bold" style={{ color }}>{fullMapCost} Créditos</div>
              </div>
              <p className="text-white/50 text-sm mb-6">Desbloqueia as 11 Rotas restantes do seu mapa de uma só vez.</p>
              <button className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white border transition-colors shadow-2xl pointer-events-none" style={{ backgroundColor: `${color}20`, borderColor: `${color}50` }}>
                <Compass className="w-4 h-4" /> Expandir Mapa Inteiro
              </button>
            </div>'''

new_opcao2 = '''            {/* Opção 2 */}
            <div onClick={() => handleUnlock('full')} className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border rounded-2xl p-6 hover:brightness-110 transition-all cursor-pointer group" style={{ borderColor: `${color}50` }}>
              <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                <span className="font-mono text-[9px] uppercase font-bold text-black tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Melhor Custo-Benefício
                </span>
              </div>
              <div className="flex justify-between items-start mb-2 mt-2">
                <h4 className="text-white font-bold text-xl">{isFoco ? 'Todas as Intenções' : 'Visão 360º Completa'}</h4>
                <div className="font-mono font-bold" style={{ color }}>{isFoco ? allFocusesCost : fullMapCost} Créditos</div>
              </div>
              <p className="text-white/50 text-sm mb-6">{isFoco ? 'Desbloqueia todas as Intenções desta mesma Casa de uma vez.' : 'Desbloqueia as 11 Rotas restantes do seu mapa de uma só vez.'}</p>
              <button className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white border transition-colors shadow-2xl pointer-events-none" style={{ backgroundColor: `${color}20`, borderColor: `${color}50` }}>
                <Compass className="w-4 h-4" /> {isFoco ? 'Expandir Todas' : 'Expandir Mapa Inteiro'}
              </button>
            </div>'''

content = content.replace(old_opcao2, new_opcao2)

old_opcao1 = '''              <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-bold text-xl">Passe Único</h4>
                <div className="font-mono font-bold text-white/50 group-hover:text-white transition-colors">{houseCost} Crédito{houseCost > 1 ? "s" : ""}</div>
              </div>'''

new_opcao1 = '''              <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-bold text-xl">Passe Único</h4>
                <div className="font-mono font-bold text-white/50 group-hover:text-white transition-colors">{isFoco ? focusCost : houseCost} Crédito{(isFoco ? focusCost : houseCost) > 1 ? "s" : ""}</div>
              </div>'''

content = content.replace(old_opcao1, new_opcao1)

old_toast = '''      if (purchaseType === 'single') {
        toast.success(`${isFoco ? 'Intenção' : 'Rota'} de ${targetArea?.label || 'Destino'} desbloqueada com sucesso!`);
      } else {
        toast.success("Visão 360º desbloqueada! Todas as 12 Casas e Focos estão livres.");
      }'''

new_toast = '''      if (purchaseType === 'single') {
        toast.success(`${isFoco ? 'Intenção' : 'Rota'} de ${targetArea?.label || 'Destino'} desbloqueada com sucesso!`);
      } else {
        toast.success(isFoco ? "Todas as Intenções desbloqueadas com sucesso!" : "Visão 360º desbloqueada! Todas as 12 Casas e Focos estão livres.");
      }'''

content = content.replace(old_toast, new_toast)

with open(file_path, "w") as f:
    f.write(content)

