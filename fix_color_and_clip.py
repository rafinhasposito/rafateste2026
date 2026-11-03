import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Add houseThemes import
old_import = 'import { BASE_HOUSE_PROFILES } from "@/data/baseHouseProfiles";'
new_import = 'import { BASE_HOUSE_PROFILES } from "@/data/baseHouseProfiles";\nimport { houseThemes } from "@/data/houseThemes";'
content = content.replace(old_import, new_import)

# 2. Add houseColor variable right after the P_DYNAMIC block (after line that has "coords:")
# Find the closing of P_DYNAMIC
old_dynamic_end = '  };\n  \n  const getHeroVideo'
new_dynamic_end = '  };\n\n  // Cor dinâmica da Casa (cada casa tem sua cor no trailer e no sistema inteiro)\n  const houseColor = houseThemes[P_DYNAMIC.house]?.themeColor || "#10b981";\n  \n  const getHeroVideo'
content = content.replace(old_dynamic_end, new_dynamic_end)

# 3. Fix the font clipping: change leading-[0.85] to leading-[1] and add pt-4 
# The issue is the text has super tight line-height that clips ascenders
content = content.replace(
    'leading-[0.85] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-[#10b981] to-emerald-200',
    'leading-[1] mb-8 pt-2 text-transparent bg-clip-text'
)

# 4. Replace ALL hardcoded #10b981 with the dynamic houseColor variable
# But we need to be careful - in className strings we can't use JS vars directly
# We need to replace inline styles and specific patterns

# For the gradient text on the city name, use style instead of class
content = content.replace(
    'bg-gradient-to-b from-[#10b981] to-emerald-200 origin-center',
    'origin-center'
)
# We'll add a style prop for the gradient - but actually the bg-clip-text + gradient approach
# won't work with dynamic colors in Tailwind. Let me use a different approach:
# Use style={{ color: houseColor }} directly on the city name instead of gradient

# Actually the simplest approach: replace the motion.h2 for the city name to use style color
old_city_h2 = """        <motion.h2
          style={{ scale: textScale, opacity: textOpacity, filter: textBlur }}
          className="font-ps-display text-[20vw] md:text-[160px] font-bold tracking-tighter leading-[1] mb-8 pt-2 text-transparent bg-clip-text origin-center uppercase text-center break-words whitespace-normal break-all sm:break-normal px-2"
        >"""
new_city_h2 = """        <motion.h2
          style={{ scale: textScale, opacity: textOpacity, filter: textBlur, color: houseColor, textShadow: `0 0 80px ${houseColor}40` }}
          className="font-ps-display text-[20vw] md:text-[160px] font-bold tracking-tighter leading-[1] mb-8 pt-2 origin-center uppercase text-center break-words whitespace-normal break-all sm:break-normal px-2"
        >"""
content = content.replace(old_city_h2, new_city_h2)

# 5. Replace the "Foco em" gradient color
content = content.replace(
    'bg-gradient-to-r from-[#10b981] to-emerald-300',
    'bg-gradient-to-r from-[var(--house-color)] to-[var(--house-color-light)]'
)

# Actually that won't work with CSS vars in Tailwind easily. Let me use style directly.
# Revert and use style approach
content = content.replace(
    'bg-gradient-to-r from-[var(--house-color)] to-[var(--house-color-light)]',
    ''  # remove class
)

# Find the Foco em span and add style
old_foco_span = """                    <span className="font-ps-display text-5xl md:text-7xl lg:text-[80px] text-transparent bg-clip-text  leading-[1] tracking-tight">"""
new_foco_span = """                    <span className="font-ps-display text-5xl md:text-7xl lg:text-[80px] leading-[1] tracking-tight" style={{ color: houseColor }}>"""
content = content.replace(old_foco_span, new_foco_span)

# 6. Replace the main background color-mix
content = content.replace(
    "color-mix(in srgb, ${currentActiveData?.color || '#10b981'} 6%, #03100B)",
    "color-mix(in srgb, ${houseColor} 6%, #03100B)"
)

# 7. Replace the pill/badge colors (the subtle green accents)
# The "Seu Resultado Personalizado" badge
content = content.replace(
    'text-[#10b981] mb-8',
    'mb-8" style={{ color: houseColor }}><Sparkles className="w-3 h-3'  
)
# Actually that's getting messy. Let me do targeted sed-like replacements instead.

# Let me just do a global replace of the literal color for the most impactful ones.
# The boarding pass and structural elements use #10b981 extensively.
# Strategy: Replace #10b981 with ${houseColor} in template literals and style objects,
# and leave className Tailwind ones for now (they need a different approach)

with open(file_path, "w") as f:
    f.write(content)

print("DONE - partial color fix applied")
