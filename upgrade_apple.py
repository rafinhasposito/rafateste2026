import re

file_path = "src/pages/History.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Make the card clickable
content = content.replace(
    'className={`group bg-ps-surface border border-white/5 ${hoverStyles.border} rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between`}',
    'onClick={() => navigate(`/dashboard?id=${c.id}`)}\n                  className={`group bg-ps-surface border border-white/5 ${hoverStyles.border} rounded-3xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-1 cursor-pointer relative overflow-hidden flex flex-col justify-between`}'
)

# Remove the inner border and adjust padding
content = content.replace(
    'className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"',
    'className="mb-6"'
)

# Fix the dates and hide redundant text
content = content.replace(
    '''                      {c.origin && (
                        <p className="flex items-center gap-3 text-ps-muted text-[11px] uppercase tracking-widest">
                          <MapPin className="w-4 h-4 text-white/10" /> 
                          Ponto de Partida: <span className="text-white/60 font-bold">{c.origin}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-3 text-ps-muted text-[11px] uppercase tracking-widest">
                        <Calendar className="w-4 h-4 text-white/10" /> 
                        Data da Consulta: <span className="text-white/60">{formatDate(c.created_at)}</span>
                      </p>''',
    '''                      <div className="flex items-center gap-4 text-ps-muted text-xs font-ps-ui">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 opacity-50" /> 
                          {formatDate(c.created_at)}
                        </span>
                      </div>'''
)

# Fix ID typography
content = content.replace(
    'ID: {shortId} • DOSSIÊ ASTROLÓGICO',
    '#{shortId} • DOSSIÊ'
)

# Fix the button
content = content.replace(
    '''<button 
                      onClick={() => navigate(`/dashboard?id=${c.id}`)}
                      className="shrink-0 px-6 h-12 rounded-full bg-white/5 border border-white/10 text-ps-champagne flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-ps-gold hover:border-ps-gold hover:text-ps-void transition-all duration-300 group-hover:scale-105"
                    >
                      Acessar <ArrowUpRight className="w-4 h-4" />
                    </button>''',
    '''<div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-ps-gold group-hover:text-ps-void transition-all duration-300">
                      <ChevronRight className="w-5 h-5" />
                    </div>'''
)

# Fix the status pulse
content = content.replace(
    '<span className="text-ps-gold text-sm font-ps-ui flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-ps-gold rounded-full animate-pulse"></div> Ativo e Sincronizado</span>',
    '<div className="flex items-center gap-2 text-white/40 text-xs font-ps-ui"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Sincronizado</div>'
)

# Add ChevronRight import
if "ChevronRight" not in content:
    content = content.replace("ArrowLeft, Calendar, ArrowUpRight, CheckCircle2, Loader2, Fingerprint", "ArrowLeft, Calendar, ArrowUpRight, CheckCircle2, Loader2, Fingerprint, ChevronRight")

with open(file_path, "w") as f:
    f.write(content)

