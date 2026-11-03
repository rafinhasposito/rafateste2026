import re

file_path = "src/pages/HouseTrailerApp.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add imports right below the existing imports
imports = """import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "@/lib/astro";
import { chargeConsultation } from "@/lib/credits";
import { saveConsultation } from "@/lib/consultations";
import { cityDatabase } from "@/data/houses";
import { toast } from "sonner";"""

content = content.replace('import { useNavigate, useSearchParams } from "react-router-dom";', 'import { useNavigate, useSearchParams } from "react-router-dom";\n' + imports)

with open(file_path, "w") as f:
    f.write(content)

print("Imports added")
