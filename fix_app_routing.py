import re

file_path = "src/App.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Remove dashboard from ConsumerShell
old_routing = """            <Route element={<ConsumerShell />}>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/credits" element={<Credits />} />
            </Route>"""

new_routing = """            <Route element={<ConsumerShell />}>
              <Route path="/" element={<Index />} />
              <Route path="/history" element={<History />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/credits" element={<Credits />} />
            </Route>
            
            {/* O Dashboard / Resultados é uma experiência cinematográfica full-bleed 
                e controla suas próprias barras de navegação internamente (V3). */}
            <Route path="/dashboard" element={<Dashboard />} />"""

content = content.replace(old_routing, new_routing)

with open(file_path, "w") as f:
    f.write(content)
