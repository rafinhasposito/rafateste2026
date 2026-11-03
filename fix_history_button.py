import re

file_path = "src/pages/History.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Remove import
content = re.sub(r'import BackButton from "@/components/BackButton";\n', '', content)

# Replace <BackButton ... /> with an inline element
old_button = """<BackButton label="Voltar ao Início" to="/" className="mb-12 hover:text-[#10b981] transition-colors" />"""
new_button = """<button onClick={() => navigate("/")} className="mb-12 flex items-center gap-2 text-white/50 hover:text-[#10b981] transition-colors font-sans text-xs uppercase tracking-widest font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Voltar ao Início
        </button>"""

content = content.replace(old_button, new_button)

with open(file_path, "w") as f:
    f.write(content)
