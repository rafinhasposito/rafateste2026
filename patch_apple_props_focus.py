import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add unlockedFocuses to interface
old_interface = '''export interface DestinyResultsProps {
  house?: number | null;
  houseName?: string;
  houseData?: any;
  cities?: {
    highticket: CityOption[];
    acessivel: CityOption[];
    nacional: CityOption[];
  };
  allResults?: Record<string, HouseResult> | undefined;
  userCredits?: number;'''

new_interface = '''export interface DestinyResultsProps {
  house?: number | null;
  houseName?: string;
  houseData?: any;
  cities?: {
    highticket: CityOption[];
    acessivel: CityOption[];
    nacional: CityOption[];
  };
  allResults?: Record<string, HouseResult> | undefined;
  unlockedFocuses?: Record<string, string[]>;
  userCredits?: number;'''

content = content.replace(old_interface, new_interface)

# Read unlockedFocuses correctly in useState
old_state = '''  const [unlockedItems, setUnlockedItems] = useState<string[]>(() => {
    // Start with the user's intended focus as unlocked, or the first focus if no intention was passed
    const defaultFocus = intendedAreaId ? intendedAreaId : Object.keys(LIFE_AREAS)[0];
    
    // Also include any focuses that were explicitly unlocked in the DB
    const saved = P.unlockedFocuses?.[String(P_DYNAMIC.house)] || [];
    
    return [defaultFocus, ...saved];
  });'''

new_state = '''  const [unlockedItems, setUnlockedItems] = useState<string[]>(() => {
    // Start with the user's intended focus as unlocked, or the first focus if no intention was passed
    const defaultFocus = intendedAreaId ? intendedAreaId : Object.keys(LIFE_AREAS)[0];
    
    // Also include any focuses that were explicitly unlocked in the DB
    const saved = props.unlockedFocuses?.[String(props.house)] || [];
    
    return [defaultFocus, ...saved];
  });'''

content = content.replace(old_state, new_state)

# React to changes in props.unlockedFocuses
use_effect_code = '''
  useEffect(() => {
    if (props.unlockedFocuses?.[String(props.house)]) {
      setUnlockedItems(prev => {
        const saved = props.unlockedFocuses![String(props.house)] || [];
        const combined = [...new Set([...prev, ...saved])];
        return combined;
      });
    }
  }, [props.unlockedFocuses, props.house]);
'''

# Find the place right after the useState to insert useEffect
pattern = r"const \[unlockedItems, setUnlockedItems\] = useState<string\[\]>\(\(\) => \{.*?\n  \}\);"
content = re.sub(pattern, lambda m: m.group(0) + use_effect_code, content, flags=re.DOTALL)

with open(file_path, "w") as f:
    f.write(content)

