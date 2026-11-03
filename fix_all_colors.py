file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# The hardcoded #10b981 appears in:
# 1. Tailwind classes like text-[#10b981], bg-[#10b981], border-[#10b981]
# 2. Style objects like color: '#10b981'  
# 3. Template literals like `${...}#10b981...`
# 4. CSS color-mix strings

# Strategy: Since Tailwind can't use JS vars in class names at build time,
# we need to convert all Tailwind color references to inline styles.
# BUT that's 49 changes and very error-prone.

# Simpler approach: Add a CSS custom property at the root div level,
# then replace Tailwind classes with ones that reference the CSS var.

# Actually the SIMPLEST working approach for V1:
# Just set a CSS variable on the root div and use it.

# Step 1: The root div already has a style prop. Add the CSS var there.
old_root = """style={{ backgroundColor: `color-mix(in srgb, ${houseColor} 6%, #03100B)` }}"""
new_root = """style={{ backgroundColor: `color-mix(in srgb, ${houseColor} 6%, #03100B)`, '--hc': houseColor, '--hc15': `${houseColor}15`, '--hc20': `${houseColor}20`, '--hc30': `${houseColor}30` } as React.CSSProperties}"""
content = content.replace(old_root, new_root)

# Step 2: Now do a GLOBAL replace of the literal hex in className and style contexts
# For Tailwind classes: text-[#10b981] -> [style with houseColor]
# This is too complex for a regex. Let me just do the style objects first.

# Replace in style objects: color: '#10b981' or color: "#10b981"  
import re
# For inline styles, replace '#10b981' with houseColor (the JS variable)
# But only inside style={{ ... }} blocks, not in className strings
# This is hard to do perfectly with regex. Let me be targeted.

# The boarding pass section (lines 668-830) is the most visible. Let me replace the color there.
# Replace all `#10b981` with `houseColor` in style props
# And `[#10b981]` with inline styles where possible

# For now, the most impactful changes:
# Replace the boarding pass border color
content = content.replace(
    'border-[#10b981]/30 rounded-[32px] overflow-hidden shadow-[0_30px_80px_rgba(16,185,129,0.15)]',
    'rounded-[32px] overflow-hidden" style={{ borderColor: `${houseColor}4D`, boxShadow: `0 30px 80px ${houseColor}26` }}><div className="'
)
# That's getting too hacky. Let me use a cleaner approach.

# CLEAN APPROACH: Just do sed-style replacements
# Replace color literals in style={{ }} contexts
content = content.replace("color: '#10b981'", "color: houseColor")
content = content.replace('color: "#10b981"', 'color: houseColor')

# Replace rgba values
content = content.replace('rgba(16,185,129,', 'rgba(from houseColor r g b / ') 
# No that won't work in CSS

# Let me just replace ALL #10b981 with a CSS var reference
# In className: text-[#10b981] -> text-[var(--hc)]
# This works in Tailwind JIT!
content = content.replace('text-[#10b981]', 'text-[var(--hc)]')
content = content.replace('bg-[#10b981]', 'bg-[var(--hc)]')
content = content.replace('border-[#10b981]', 'border-[var(--hc)]')
content = content.replace('shadow-[0_0_10px_#10b981]', 'shadow-[0_0_10px_var(--hc)]')
content = content.replace('shadow-[0_0_30px_rgba(16,185,129,0.2)]', 'shadow-[0_0_30px_var(--hc20)]')

# For opacity variants like text-[#10b981]/90, bg-[#10b981]/10, etc.
import re
content = re.sub(r'text-\[#10b981\]/(\d+)', r'text-[var(--hc)]/\1', content)
content = re.sub(r'bg-\[#10b981\]/(\d+)', r'bg-[var(--hc)]/\1', content)
content = re.sub(r'border-\[#10b981\]/(\d+)', r'border-[var(--hc)]/\1', content)

# For from-[#10b981] in gradients
content = content.replace('from-[#10b981]', 'from-[var(--hc)]')
content = content.replace('via-[#10b981]', 'via-[var(--hc)]')
content = content.replace('to-[#10b981]', 'to-[var(--hc)]')

# For shadow with rgba
content = content.replace('shadow-[0_30px_80px_rgba(16,185,129,0.15)]', 'shadow-[0_30px_80px_var(--hc15)]')

# For style objects with template literals
content = content.replace("backgroundColor: '#10b981'", "backgroundColor: houseColor")

# Fix the "Seu Resultado Personalizado" badge - undo the broken replacement
content = content.replace(
    'mb-8" style={{ color: houseColor }}><Sparkles className="w-3 h-3',
    'text-[var(--hc)] mb-8'
)

with open(file_path, "w") as f:
    f.write(content)

# Count remaining
remaining = content.count('#10b981')
print(f"DONE. Remaining #10b981 occurrences: {remaining}")
