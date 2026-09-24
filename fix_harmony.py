import sys
import re

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

# 1. Update the parent wrapper to have a fixed height on Desktop
# From: <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col-reverse lg:flex-row gap-6 lg:gap-8 relative z-10 pb-20">
parent_pattern = r'<div className="w-full max-w-\[1400px\] mx-auto px-4 flex flex-col-reverse lg:flex-row gap-6 lg:gap-8 relative z-10 pb-20">'
parent_replacement = '<div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col-reverse lg:flex-row gap-6 lg:gap-8 relative z-10 pb-20 lg:h-[700px] xl:h-[760px] items-stretch">'
content = re.sub(parent_pattern, parent_replacement, content)

# 2. Update the left column wrapper to be h-full
left_pattern = r'<div className="w-full lg:w-\[320px\] shrink-0 flex flex-col gap-3 items-start">'
left_replacement = '<div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-3 items-stretch h-full">'
content = re.sub(left_pattern, left_replacement, content)

# 3. Update the left menu items to flex-1 instead of fixed height
# Remove style={{ height: '72px' }}
item_pattern = r"style=\{\{\s*height:\s*'72px'\s*\}\}"
content = re.sub(item_pattern, "style={{ height: '100%' }}", content)

# Add flex-1 to the className
# From: className={`relative flex items-center p-3 rounded-2xl border overflow-hidden text-left cursor-pointer shadow-sm ${
class_pattern = r'className=\{`relative flex items-center p-3 rounded-2xl border overflow-hidden text-left cursor-pointer shadow-sm \$\{'
class_replacement = 'className={`relative flex items-center p-3 rounded-2xl border overflow-hidden text-left cursor-pointer shadow-sm flex-1 ${'
content = re.sub(class_pattern, class_replacement, content)

# 4. Update the right panel to be h-full instead of fixed min-height
# From: className="flex-1 h-[600px] lg:h-auto lg:min-h-[750px] relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-[#0B1426] z-10"
right_pattern = r'className="flex-1 h-\[600px\] lg:h-auto lg:min-h-\[750px\] relative rounded-\[32px\] overflow-hidden border border-white/10 shadow-\[0_0_100px_rgba\(0,0,0,0\.8\)\] bg-\[#0B1426\] z-10"'
right_replacement = 'className="flex-1 h-[600px] lg:h-full relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-[#0B1426] z-10"'
content = re.sub(right_pattern, right_replacement, content)

with open("src/pages/HouseTrailer.tsx", "w") as f:
    f.write(content)
print("Success")
