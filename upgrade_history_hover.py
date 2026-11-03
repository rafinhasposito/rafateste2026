import re

file_path = "src/pages/History.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add a function to get hover styles
hover_styles_code = """  const getHoverStyles = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case "passado":
        return {
          border: "hover:border-white/20",
          glow: "bg-white/5 group-hover:bg-white/10"
        };
      case "presente":
        return {
          border: "hover:border-blue-400/30",
          glow: "bg-blue-400/5 group-hover:bg-blue-400/10"
        };
      case "futuro":
      default:
        return {
          border: "hover:border-ps-gold/30",
          glow: "bg-ps-gold/5 group-hover:bg-ps-gold/10"
        };
    }
  };
"""

if "const getHoverStyles" not in content:
    content = content.replace("  const getModeStyles = (mode: string) => {", hover_styles_code + "\n  const getModeStyles = (mode: string) => {")

# Apply the hover styles in the map
old_card_class = """              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group bg-ps-surface border border-white/5 hover:border-ps-gold/30 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-ps-gold/5 blur-3xl rounded-full pointer-events-none group-hover:bg-ps-gold/10 transition-colors duration-700"></div>"""

new_card_class = """              const hoverStyles = getHoverStyles(modeLabel);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`group bg-ps-surface border border-white/5 ${hoverStyles.border} rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full pointer-events-none transition-colors duration-700 ${hoverStyles.glow}`}></div>"""

content = content.replace(old_card_class, new_card_class)

with open(file_path, "w") as f:
    f.write(content)

