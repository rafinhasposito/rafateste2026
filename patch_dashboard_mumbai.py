import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Find the spot to inject the hotfix
pattern = r"  const consultationCost = getCost\(\"cost_consultation\", 3\);"

hotfix_code = """  const consultationCost = getCost("cost_consultation", 3);

  // Hotfix: Filtra Mumbai no frontend até o backend (Render) ser atualizado com o último commit
  const safeResults = React.useMemo(() => {
    if (!consultation?.result?.results) return undefined;
    let str = JSON.stringify(consultation.result.results);
    str = str.replace(/Mumbai/g, "Nova York");
    str = str.replace(/mumbai.avif/g, "new_york.mp4");
    return JSON.parse(str);
  }, [consultation?.result?.results]);
"""

content = re.sub(pattern, hotfix_code, content)

# Now replace allResults={consultation.result?.results} with allResults={safeResults}
content = content.replace("allResults={consultation.result?.results}", "allResults={safeResults}")

with open(file_path, "w") as f:
    f.write(content)

