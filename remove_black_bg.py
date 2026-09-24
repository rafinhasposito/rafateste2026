#!/usr/bin/env python3
"""
Remove black background from Earth globe JPEG and save as PNG with transparency.
"""
import sys, os

src = '/Users/rafaelgeorge/.gemini/antigravity-ide/brain/b5b89d61-7232-4d59-81bb-2edabaa7c6f5/earth_master_globe_1787082900783.png'
dst = '/Users/rafaelgeorge/rafateste2026/public/earth-master.png'

try:
    from PIL import Image
    print("Pillow available - using Pillow")
except ImportError:
    print("Pillow not found, installing...")
    os.system("pip3 install Pillow -q")
    from PIL import Image

img = Image.open(src).convert("RGBA")
data = img.getdata()
new_data = []
for r, g, b, a in data:
    # Make near-black pixels transparent (threshold 12 per channel)
    if r < 12 and g < 12 and b < 12:
        new_data.append((0, 0, 0, 0))
    else:
        new_data.append((r, g, b, a))

img.putdata(new_data)
img.save(dst, "PNG")
print(f"✓ Saved RGBA PNG: {dst}")
print(f"  Size: {img.size}")
