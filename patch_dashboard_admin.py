import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_code = '''const Dashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { getCost, loading: pricingLoading } = usePricing();'''

new_code = '''const Dashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { getCost, loading: pricingLoading } = usePricing();'''

content = content.replace(old_code, new_code)

with open(file_path, "w") as f:
    f.write(content)

