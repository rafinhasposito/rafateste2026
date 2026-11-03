import re

file_path = "src/pages/History.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add new imports
if "Compass" not in content:
    content = content.replace("ArrowLeft, Clock, Calendar, ArrowUpRight, CheckCircle2, Loader2, Fingerprint, MapPin, Search", "ArrowLeft, Clock, Calendar, ArrowUpRight, CheckCircle2, Loader2, Fingerprint, MapPin, Search, Compass, Scroll, Crown")

# Add the inference logic inside the map
old_map_start = """            {consultations.map((c, i) => {
              const modeLabel = c.mode?.toLowerCase() || "futuro";
              const hasIntent = !!c.intent;
              const hasHouse = c.goal !== null && c.goal !== undefined;
              const shortId = c.id.substring(0, 8);"""

new_map_start = """            {consultations.map((c, i) => {
              const modeLabel = c.mode?.toLowerCase() || "futuro";
              const hasIntent = !!c.intent;
              const hasHouse = c.goal !== null && c.goal !== undefined;
              const hasOrigin = !!c.origin;
              const shortId = c.id.substring(0, 8);
              
              let MethodIcon = Crown;
              let methodLabel = "BUSCA: POR CASA";
              if (hasOrigin) {
                MethodIcon = Compass;
                methodLabel = "BUSCA: POR CIDADE";
              } else if (hasIntent) {
                MethodIcon = Scroll;
                methodLabel = "BUSCA: POR INTENÇÃO";
              }"""

content = content.replace(old_map_start, new_map_start)

# Add the badge
old_badge = """                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${getModeStyles(modeLabel)}`}>
                        Tempo: {modeLabel.toUpperCase()}
                      </span>
                      
                      <div className="flex items-center gap-2 text-ps-muted text-[10px] uppercase tracking-widest">"""

new_badge = """                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${getModeStyles(modeLabel)}`}>
                          Tempo: {modeLabel.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 border border-white/10 text-white/40 text-[9px] uppercase tracking-widest rounded-full flex items-center gap-1.5 font-bold">
                          <MethodIcon className="w-3 h-3" />
                          {methodLabel}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-ps-muted text-[10px] uppercase tracking-widest">"""

content = content.replace(old_badge, new_badge)

with open(file_path, "w") as f:
    f.write(content)

