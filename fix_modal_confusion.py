import re

# 1. Update UnlockPremiumModal.tsx
file_path_modal = "src/components/UnlockPremiumModal.tsx"
with open(file_path_modal, "r") as f:
    content_modal = f.read()

# Add isEmbedded prop
content_modal = content_modal.replace(
    "targetArea?: { id: string; label: string; color: string; type: 'foco' | 'rota' } | null;",
    "targetArea?: { id: string; label: string; color: string; type: 'foco' | 'rota' } | null;\n  isEmbedded?: boolean;"
)

# Update component signature
content_modal = content_modal.replace(
    "export default function UnlockPremiumModal({ isOpen, onClose, onSuccess, targetArea }: Props) {",
    "export default function UnlockPremiumModal({ isOpen, onClose, onSuccess, targetArea, isEmbedded }: Props) {"
)

# Update handleUnlock to only show toasts if NOT embedded
old_handle = """  const handleUnlock = (purchaseType: 'single' | 'full') => {
    onClose();
    if (purchaseType === 'single') {
      toast.success(`${isFoco ? 'Intenção' : 'Rota'} de ${targetArea?.label || 'Destino'} desbloqueada com sucesso!`);
    } else {
      toast.success("Visão 360º desbloqueada! Todas as 12 Casas e Focos estão livres.");
    }
    if (onSuccess && targetArea) {
      onSuccess(targetArea.id, purchaseType);
    }
  };"""

new_handle = """  const handleUnlock = (purchaseType: 'single' | 'full') => {
    onClose();
    if (!isEmbedded) {
      if (purchaseType === 'single') {
        toast.success(`${isFoco ? 'Intenção' : 'Rota'} de ${targetArea?.label || 'Destino'} desbloqueada com sucesso!`);
      } else {
        toast.success("Visão 360º desbloqueada! Todas as 12 Casas e Focos estão livres.");
      }
    }
    if (onSuccess && targetArea) {
      onSuccess(targetArea.id, purchaseType);
    }
  };"""
content_modal = content_modal.replace(old_handle, new_handle)

# Conditionally hide Option 2 (Visão 360) if embedded
old_option2 = """            {/* Opção 2 */}
            <div onClick={() => handleUnlock('full')} className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border rounded-2xl p-6 hover:brightness-110 transition-all cursor-pointer group" style={{ borderColor: `${color}50` }}>"""
new_option2 = """            {/* Opção 2 */}
            {!isEmbedded && (
            <div onClick={() => handleUnlock('full')} className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border rounded-2xl p-6 hover:brightness-110 transition-all cursor-pointer group" style={{ borderColor: `${color}50` }}>"""

old_option2_close = """              <button className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white border transition-colors shadow-2xl pointer-events-none" style={{ backgroundColor: `${color}20`, borderColor: `${color}50` }}>
                <Compass className="w-4 h-4" /> Expandir Mapa Inteiro
              </button>
            </div>"""
new_option2_close = """              <button className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white border transition-colors shadow-2xl pointer-events-none" style={{ backgroundColor: `${color}20`, borderColor: `${color}50` }}>
                <Compass className="w-4 h-4" /> Expandir Mapa Inteiro
              </button>
            </div>
            )}"""
content_modal = content_modal.replace(old_option2, new_option2)
content_modal = content_modal.replace(old_option2_close, new_option2_close)

# Hide dynamic user credits if embedded (since we might not have it synced here, or we do?)
# Dashboard injects userCredits into V3, but V3 doesn't pass it to Modal!
# The modal has hardcoded "Você possui 12 Créditos"!
# Let's pass userCredits.
content_modal = content_modal.replace(
    "isEmbedded?: boolean;",
    "isEmbedded?: boolean;\n  userCredits?: number;"
)
content_modal = content_modal.replace(
    "targetArea, isEmbedded }: Props) {",
    "targetArea, isEmbedded, userCredits }: Props) {"
)
content_modal = content_modal.replace(
    "Você possui <span className=\"text-white/60 font-bold\">12 Créditos</span> na sua conta.",
    "Você possui <span className=\"text-white/60 font-bold\">{userCredits ?? 0} Créditos</span> na sua conta."
)

with open(file_path_modal, "w") as f:
    f.write(content_modal)


# 2. Update AppleResultPreviewV3.tsx
file_path_v3 = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path_v3, "r") as f:
    content_v3 = f.read()

# Pass isEmbedded and userCredits to UnlockPremiumModal
old_modal_call = """      <UnlockPremiumModal 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)} 
        onSuccess={(id, purchaseType) => {"""
new_modal_call = """      <UnlockPremiumModal 
        isOpen={isPaywallOpen} 
        isEmbedded={!!props.onUnlock}
        userCredits={props.userCredits}
        onClose={() => setIsPaywallOpen(false)} 
        onSuccess={(id, purchaseType) => {"""
content_v3 = content_v3.replace(old_modal_call, new_modal_call)

with open(file_path_v3, "w") as f:
    f.write(content_v3)

print("Modal confusion fixed!")
