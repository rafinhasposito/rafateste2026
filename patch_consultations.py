import re

file_path = "src/lib/consultations.ts"
with open(file_path, "r") as f:
    content = f.read()

# Add import toast if not present
if "import { toast }" not in content:
    content = 'import { toast } from "sonner";\n' + content

# Replace the error handling block
old_error = """  if (error) {
    console.error("[saveConsultation] failed:", error);
    return null;
  }"""

new_error = """  if (error) {
    console.error("[saveConsultation] failed:", error);
    toast.error("DB Error: " + error.message);
    return null;
  }"""

content = content.replace(old_error, new_error)

with open(file_path, "w") as f:
    f.write(content)

print("Patched consultations.ts")
