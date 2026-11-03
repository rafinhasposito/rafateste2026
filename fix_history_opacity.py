import re

file_path = "src/pages/History.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Fix hover styles
old_hover = """  const getHoverStyles = (mode: string) => {
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
          border: "hover:border-[#C9A227]/30",
          glow: "bg-[#C9A227]/5 group-hover:bg-[#C9A227]/10"
        };
    }
  };"""

content = content.replace("hover:border-ps-gold/30", "hover:border-[#C9A227]/30")
content = content.replace("bg-ps-gold/5", "bg-[#C9A227]/5")
content = content.replace("group-hover:bg-ps-gold/10", "group-hover:bg-[#C9A227]/10")

# Fix the body tags text color
content = content.replace("text-ps-gold/60", "text-[#C9A227]/60")
content = content.replace("bg-ps-gold/40", "bg-[#C9A227]/40")
content = content.replace('<div className="w-1 h-1 rounded-full bg-[#C9A227]/40"></div>', '<span className="w-1 h-1 rounded-full bg-[#C9A227]/40 inline-block"></span>')

with open(file_path, "w") as f:
    f.write(content)

