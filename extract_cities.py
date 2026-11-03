import re

with open("../protocolo-solar-api/house_scanner.py", "r") as f:
    content = f.read()

# Find all "city": "Name"
cities = re.findall(r'"city": "([^"]+)"', content)

# Remove duplicates while preserving order
seen = set()
unique_cities = [x for x in cities if not (x in seen or seen.add(x))]

video_cities = {"Nova York", "New York", "Tóquio", "Tokyo", "Dubai", "Paris", "Roma", "Rome", "Londres", "London", "Bali", "Santiago", "Buenos Aires", "Los Angeles"}

missing_videos = [c for c in unique_cities if c not in video_cities]

with open("cidades_sem_video.md", "w") as f:
    f.write("# Lista de Cidades que ainda NÃO possuem vídeo (Total: {})\n\n".format(len(missing_videos)))
    for c in missing_videos:
        f.write("- {}\n".format(c))

print(f"Encontradas {len(unique_cities)} cidades. {len(missing_videos)} sem video.")
