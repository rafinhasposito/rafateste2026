import re

file_path = "src/components/HouseLookup.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_func = """  const handleSelect = (houseNum: number) => {
    setSelectedHouse(houseNum);
    setResult(null);
  };"""

new_func = """  const handleSelect = (houseNum: number) => {
    setSelectedHouse(houseNum);
    setResult(null);
    // Armazena no sessionStorage para o Trailer processar a API
    sessionStorage.setItem('ps_natal_name', name);
    sessionStorage.setItem('ps_natal_date', birthdate);
    sessionStorage.setItem('ps_natal_time', birthtime);
    sessionStorage.setItem('ps_natal_place', birthPlace);
    if (year) sessionStorage.setItem('ps_natal_year', year.toString());
    if (mode) sessionStorage.setItem('ps_natal_mode', mode);
  };"""

content = content.replace(old_func, new_func)

with open(file_path, "w") as f:
    f.write(content)

print("HouseLookup patched")
