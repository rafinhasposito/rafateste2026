import re
import os

files = [
    "src/components/admin/MetricsDashboard.tsx",
    "src/components/admin/UsersTable.tsx",
    "src/components/admin/TransactionsTable.tsx"
]

for file_path in files:
    if not os.path.exists(file_path): continue
    with open(file_path, "r") as f:
        content = f.read()
    
    # Replace glass-panel with Apple style
    content = content.replace('glass-panel', 'border border-white/10 bg-white/[0.02] rounded-3xl backdrop-blur-md')
    # Text colors
    content = content.replace('text-muted-foreground/60', 'text-white/30')
    content = content.replace('text-muted-foreground', 'text-white/50')
    content = content.replace('text-foreground', 'text-white')
    content = content.replace('text-primary', 'text-amber-500')
    # Borders
    content = content.replace('border-border/10', 'border-white/5')
    content = content.replace('border-border', 'border-white/10')
    content = content.replace('bg-muted/10', 'bg-white/5')
    content = content.replace('bg-card', 'bg-[#0a0a0a]')
    
    with open(file_path, "w") as f:
        f.write(content)

