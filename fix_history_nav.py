file_path = "src/pages/History.tsx"

with open("src/pages/History.tsx", "r") as f:
    content = f.read()

content = content.replace('import { Navbar } from "@/components/layout/Navbar";\n', '')
content = content.replace('<Navbar />', '')

with open(file_path, "w") as f:
    f.write(content)
