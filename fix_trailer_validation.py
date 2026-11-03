import re

file_path = "src/pages/HouseTrailerApp.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_validation = """    if (!name || !birthdate || !birthtime || !birthPlace) {
      navigate('/dashboard');
      return;
    }"""

new_validation = """    if (!name || !birthdate || !birthtime || !birthPlace) {
      toast.error("Faltam dados natais! Volte à tela anterior e preencha tudo.");
      navigate('/dashboard');
      return;
    }"""

content = content.replace(old_validation, new_validation)

with open(file_path, "w") as f:
    f.write(content)

print("Validation patched!")
