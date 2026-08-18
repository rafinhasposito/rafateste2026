#!/usr/bin/env python3
"""
Extrai transparência de um globo terrestre com fundo branco usando flood-fill pelos cantos.
DIFERENTE do threshold simples: apenas pixels CONECTADOS ao fundo (a partir dos cantos)
se tornam transparentes. Pixels escuros INTERNOS do planeta (oceanos, lado noturno)
são preservados.
"""
import sys, os

src = '/Users/rafaelgeorge/.gemini/antigravity-ide/brain/b5b89d61-7232-4d59-81bb-2edabaa7c6f5/earth_globe_brazil_white_bg_1787084307988.png'
dst = '/Users/rafaelgeorge/rafateste2026/public/earth-master.png'

try:
    from PIL import Image
except ImportError:
    os.system("pip3 install Pillow -q")
    from PIL import Image

import numpy as np
from collections import deque

img = Image.open(src).convert("RGBA")
width, height = img.size
data = np.array(img)

print(f"Image size: {width}x{height}")

# Canal alpha: 0 = transparente, 255 = opaco
alpha = np.ones((height, width), dtype=np.uint8) * 255  # começa tudo opaco

# Threshold do fundo branco: pixel é "fundo" se R,G,B são todos > 230
def is_background(r, g, b):
    return int(r) > 230 and int(g) > 230 and int(b) > 230

# Flood fill BFS a partir dos 4 cantos + bordas
visited = np.zeros((height, width), dtype=bool)
queue = deque()

# Semear pelas bordas
for x in range(width):
    for y in [0, height - 1]:
        r, g, b = data[y, x, :3]
        if is_background(r, g, b) and not visited[y, x]:
            visited[y, x] = True
            queue.append((y, x))

for y in range(height):
    for x in [0, width - 1]:
        r, g, b = data[y, x, :3]
        if is_background(r, g, b) and not visited[y, x]:
            visited[y, x] = True
            queue.append((y, x))

print(f"Seeds: {len(queue)}")

# BFS
neighbors = [(-1,0),(1,0),(0,-1),(0,1)]
count = 0
while queue:
    y, x = queue.popleft()
    alpha[y, x] = 0  # tornar transparente
    count += 1
    for dy, dx in neighbors:
        ny, nx = y + dy, x + dx
        if 0 <= ny < height and 0 <= nx < width and not visited[ny, nx]:
            r, g, b = data[ny, nx, :3]
            if is_background(r, g, b):
                visited[ny, nx] = True
                queue.append((ny, nx))

print(f"Pixels removidos (fundo): {count}")
print(f"Pixels preservados (planeta): {width*height - count}")

# Aplicar alpha
data[:, :, 3] = alpha

result = Image.fromarray(data, 'RGBA')
result.save(dst, 'PNG')
print(f"✓ Salvo: {dst}")

# Verificar
from PIL import Image as PILImage
check = PILImage.open(dst)
print(f"  Mode: {check.mode}")
print(f"  Size: {check.size}")
