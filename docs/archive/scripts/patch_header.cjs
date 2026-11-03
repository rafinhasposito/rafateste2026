const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the hardcoded <nav> block
const navRegex = /      \{\/\* ── NAVBAR ── \*\/\}[\s\S]*?<\/nav>/;
const replacement = `      {/* ── NAVBAR PADRÃO (RESPONSIVA) ── */}
      <div className="hidden lg:block">
        <DesktopWebChrome />
      </div>
      <div className="block lg:hidden">
        <MobileAppChrome />
      </div>`;

content = content.replace(navRegex, replacement);

// Add imports
const importTarget = `import { MapPin, ChevronDown, ChevronRight, ChevronLeft, Lock, Sparkles, AlertTriangle, ArrowUpRight, Heart, Users, Briefcase, DollarSign, Leaf, Calendar, Crown, Star, Zap, Sun, Target, Shield, Eye, Clock, BookOpen, Plane, Hash, CreditCard, Compass, Plus } from "lucide-react";`;
const importReplacement = `import { MapPin, ChevronDown, ChevronRight, ChevronLeft, Lock, Sparkles, AlertTriangle, ArrowUpRight, Heart, Users, Briefcase, DollarSign, Leaf, Calendar, Crown, Star, Zap, Sun, Target, Shield, Eye, Clock, BookOpen, Plane, Hash, CreditCard, Compass, Plus } from "lucide-react";\nimport { DesktopWebChrome } from "@/layouts/DesktopWebChrome";\nimport { MobileAppChrome } from "@/layouts/MobileAppChrome";`;

if (!content.includes('DesktopWebChrome')) {
  content = content.replace(importTarget, importReplacement);
}

fs.writeFileSync(file, content);
console.log("Success!");
