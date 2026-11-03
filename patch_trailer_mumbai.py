import re

file_path = "src/pages/HouseTrailerApp.tsx"
with open(file_path, "r") as f:
    content = f.read()

pattern = r"      const allResults: Record<string, any> = \{\};\n      if \(data\.results\) \{\n        for \(const \[key, val\] of Object\.entries\(data\.results\)\) \{"

hotfix_code = """      const allResults: Record<string, any> = {};
      if (data.results) {
        // Hotfix: Filtra Mumbai no frontend até o backend (Render) ser atualizado
        let safeData = JSON.stringify(data.results);
        safeData = safeData.replace(/Mumbai/g, "Nova York").replace(/mumbai.avif/g, "new_york.mp4");
        const parsedData = JSON.parse(safeData);

        for (const [key, val] of Object.entries(parsedData)) {"""

content = re.sub(pattern, hotfix_code, content)

with open(file_path, "w") as f:
    f.write(content)

