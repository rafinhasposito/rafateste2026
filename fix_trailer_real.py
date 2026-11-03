file_path = "src/pages/HouseTrailerApp.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("const { user, profile, refreshProfile, isAdmin } = useAuth();", "const { user, profile, refreshProfile } = useAuth();\\n  const { isAdmin } = useIsAdmin();")

with open(file_path, "w") as f:
    f.write(content.replace("\\n", "\n"))
