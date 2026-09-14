import re

with open('src/pages/Index.tsx', 'r') as f:
    content = f.read()

effect_code = """
  // Hide top header from shell when in step 1
  useEffect(() => {
    const topHeader = document.querySelector('header');
    if (topHeader) {
      if (step === 1) {
        topHeader.style.display = 'none';
      } else {
        topHeader.style.display = '';
      }
    }
    return () => {
      if (topHeader) topHeader.style.display = '';
    }
  }, [step]);
"""

# Insert right after const [step, setStep] = useState<1 | 2 | 3>(1);
content = content.replace(
    "const [step, setStep] = useState<1 | 2 | 3>(1);",
    "const [step, setStep] = useState<1 | 2 | 3>(1);\n" + effect_code
)

with open('src/pages/Index.tsx', 'w') as f:
    f.write(content)
