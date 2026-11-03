file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_img = "img: cityData.img || getAtmosphericFallback(P_DYNAMIC.house)"
new_img = "img: (cityData.img && cityData.img.startsWith('http')) ? cityData.img : getAtmosphericFallback(P_DYNAMIC.house)"

if old_img in content:
    content = content.replace(old_img, new_img)
    with open(file_path, "w") as f:
        f.write(content)
    print("Action 1 applied!")
else:
    print("Could not find exact string for img replacement.")
