import re

file_path = "src/pages/HouseTrailerApp.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace import and destructure
if "import { useIsAdmin }" not in content:
    content = content.replace('import { useAuth } from "@/hooks/useAuth";', 'import { useAuth } from "@/hooks/useAuth";\nimport { useIsAdmin } from "@/hooks/useIsAdmin";')

content = content.replace("const { user, profile, isAdmin } = useAuth();", "const { user, profile } = useAuth();\n  const { isAdmin } = useIsAdmin();")
content = content.replace("const { user, profile } = useAuth();\n  const { user: userAlias, profile: profileAlias, isAdmin } = useAuth();", "const { user, profile } = useAuth();\n  const { isAdmin } = useIsAdmin();")

# Wait, let's just make sure we replace the EXACT line
with open(file_path, "w") as f:
    f.write(content)
