import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Action 2: Add useEffect for scroll to top on mount
old_apple_start = """export default function AppleResultPreviewV3(props: DestinyResultsProps) {"""
new_apple_start = """export default function AppleResultPreviewV3(props: DestinyResultsProps) {
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [props.house]);
"""
if "window.scrollTo({ top: 0, left: 0, behavior: 'instant' });" not in content:
    content = content.replace(old_apple_start, new_apple_start)

# Action 1: Intent synchronization
old_hovered = """  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  // Force reset hovered focus when the house changes so it defaults to the highest score of the new house
  React.useEffect(() => {
    setHoveredArea(null);
  }, [P_DYNAMIC.house]);"""

new_hovered = """  // Find the intended area based on props.intent
  const intendedAreaId = React.useMemo(() => {
    if (!props.intent) return null;
    const matched = [...LIFE_AREAS].find(a => a.id.toLowerCase() === props.intent?.toLowerCase() || a.label.toLowerCase().includes(props.intent?.toLowerCase() || ""));
    return matched ? matched.id : null;
  }, [props.intent]);

  const [hoveredArea, setHoveredArea] = useState<string | null>(intendedAreaId);

  // Force reset hovered focus when the house changes
  React.useEffect(() => {
    setHoveredArea(intendedAreaId);
  }, [P_DYNAMIC.house, intendedAreaId]);"""

content = content.replace(old_hovered, new_hovered)

# Modify sorting logic so intent goes to the top
old_sort = """  const sortedAreas = [...mergedAreas].sort((a,b) => b.score - a.score);"""
new_sort = """  const sortedAreas = [...mergedAreas].sort((a,b) => {
    const isA = a.id === intendedAreaId;
    const isB = b.id === intendedAreaId;
    if (isA && !isB) return -1;
    if (!isA && isB) return 1;
    return b.score - a.score;
  });"""

content = content.replace(old_sort, new_sort)

with open(file_path, "w") as f:
    f.write(content)

print("AppleResultPreviewV3 patched (Action 1 & 2)!")
