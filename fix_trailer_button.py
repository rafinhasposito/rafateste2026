import re

file_path = "src/pages/HouseTrailerApp.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_button_pattern = r"<button\s*onClick=\{\(\) => navigate\('/map'\)\}\s*className=\"w-full md:w-auto px-10 py-4 font-bold uppercase tracking-widest text-sm rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-white\"\s*style=\{\{\s*backgroundColor: color,\s*boxShadow: `0 0 40px \$\{color\}60`,\s*\}\}\s*>\s*<Globe className=\"w-4 h-4\" />\s*Revelar Cidades\s*</button>"

new_button = """<button 
                    onClick={handleRevelarCidades}
                    disabled={isProcessing}
                    className="w-full md:w-auto px-10 py-4 font-bold uppercase tracking-widest text-sm rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-white"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 40px ${color}60`,
                    }}
                  >
                    <Globe className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                    {isProcessing ? 'Calculando...' : 'Revelar Cidades'}
                  </button>"""

content = re.sub(old_button_pattern, new_button, content)

with open(file_path, "w") as f:
    f.write(content)

print("Button fixed!")
