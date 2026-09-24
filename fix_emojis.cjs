const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import { ArrowRight, MapPin, Zap, ShieldAlert, Lock, Eye, PlayCircle, Download, Clock, Target, CheckCircle2, BookOpen } from "lucide-react";',
  'import { ArrowRight, MapPin, Zap, ShieldAlert, Lock, Eye, PlayCircle, Download, Clock, Target, CheckCircle2, BookOpen, Wallet, Heart, Briefcase } from "lucide-react";'
);

content = content.replace('<span className="text-xl">💰</span>', '<Wallet className="w-5 h-5 text-primary" />');
content = content.replace('<span className="text-xl">❤️</span>', '<Heart className="w-5 h-5 text-primary" />');
content = content.replace('<span className="text-xl">💼</span>', '<Briefcase className="w-5 h-5 text-primary" />');

fs.writeFileSync(file, content);
console.log("Emojis removed!");
