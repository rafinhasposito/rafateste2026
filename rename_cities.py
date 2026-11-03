import os
import shutil

cities_dir = "public/assets/cities"
if not os.path.exists(cities_dir):
    print("Folder not found.")
    exit(1)

# Mapping of original filenames to clean snake_case filenames
for filename in os.listdir(cities_dir):
    if not filename.endswith(".mp4"): continue
    
    clean_name = filename.lower().replace(" ", "_").replace("-", "_")
    # specific fixes
    clean_name = clean_name.replace("saopaulo", "sao_paulo")
    clean_name = clean_name.replace("riodejaneiro", "rio_de_janeiro")
    clean_name = clean_name.replace("fozdoiguacu", "foz_do_iguacu")
    clean_name = clean_name.replace("belohorizonte", "belo_horizonte")
    clean_name = clean_name.replace("cidadedomexico", "cidade_do_mexico")
    clean_name = clean_name.replace("pontadelgada", "ponta_delgada")
    clean_name = clean_name.replace("borabora", "bora_bora")
    clean_name = clean_name.replace("fernandodenoronha", "fernando_de_noronha")
    clean_name = clean_name.replace("panamacity", "panama_city")
    
    old_path = os.path.join(cities_dir, filename)
    new_path = os.path.join(cities_dir, clean_name)
    
    if old_path != new_path:
        os.rename(old_path, new_path)
        print(f"Renamed: {filename} -> {clean_name}")

