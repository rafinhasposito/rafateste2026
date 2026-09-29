const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Import
if (!code.includes('UnlockPremiumModal')) {
    code = code.replace(
        'import { MapPin, Sparkles, ChevronDown, Lock, CreditCard, Play, Pause, ChevronRight, Briefcase, Heart, Flame, Activity, Users, Star, EyeOff, ShieldAlert, ArrowUpRight, Crown, Shield } from "lucide-react";',
        'import { MapPin, Sparkles, ChevronDown, Lock, CreditCard, Play, Pause, ChevronRight, Briefcase, Heart, Flame, Activity, Users, Star, EyeOff, ShieldAlert, ArrowUpRight, Crown, Shield } from "lucide-react";\nimport UnlockPremiumModal from "@/components/UnlockPremiumModal";'
    );
}

// 2. State
const stateInsert = `  const [openTimelinePhase, setOpenTimelinePhase] = useState<number | null>(0);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [targetLockedArea, setTargetLockedArea] = useState<{label: string, color: string, id: string} | null>(null);
  const userCredits = 9561;`;

if (!code.includes('isPaywallOpen')) {
    code = code.replace('  const [openTimelinePhase, setOpenTimelinePhase] = useState<number | null>(0);', stateInsert);
}

// 3. Update click handler in Block 2
const oldClick = `onClick={() => setHoveredArea(isActive ? null : area.id)}`;
const newClick = `onClick={() => {
                        if (!area.unlocked) {
                          setTargetLockedArea({ label: area.label, color: area.color, id: area.id });
                          setIsPaywallOpen(true);
                        } else {
                          setHoveredArea(isActive ? null : area.id);
                        }
                      }}`;

if (code.includes(oldClick)) {
    code = code.replace(oldClick, newClick);
}

// 4. Update "Desbloquear" button inside the blurred area just in case
const oldUnlockBtn = `onClick={() => setAreas(areas.map(a => a.id === activeArea.id ? { ...a, unlocked: true } : a))}`;
const newUnlockBtn = `onClick={() => {
                                  setTargetLockedArea({ label: activeArea.label, color: activeArea.color, id: activeArea.id });
                                  setIsPaywallOpen(true);
                                }}`;

if (code.includes(oldUnlockBtn)) {
    code = code.replace(oldUnlockBtn, newUnlockBtn);
}

// 5. Render Modal
const renderModal = `      <UnlockPremiumModal 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)} 
        targetAreaLabel={targetLockedArea?.label} 
        targetAreaColor={targetLockedArea?.color} 
        userCredits={userCredits}
        onUnlock={(option) => {
          if (option === 'single' && targetLockedArea) {
            setAreas(areas.map(a => a.id === targetLockedArea.id ? { ...a, unlocked: true } : a));
            setHoveredArea(targetLockedArea.id);
          } else if (option === 'all') {
            setAreas(areas.map(a => ({ ...a, unlocked: true })));
            if (targetLockedArea) setHoveredArea(targetLockedArea.id);
          }
          setIsPaywallOpen(false);
        }}
      />
    </div>
  );
}`;

if (code.includes('    </div>\n  );\n}')) {
    code = code.replace('    </div>\n  );\n}', renderModal);
}

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Paywall modal integrated into AppleResultPreview!");
