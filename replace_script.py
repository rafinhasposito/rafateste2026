import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Card 1 Beneficios
content = content.replace(
    "{beneficios}",
    "<AppleHighlightText text={beneficios} activeColor={activeColor} />"
)

# Card 1 Para Quem
content = content.replace(
    "{paraQuem}",
    "<AppleHighlightText text={paraQuem} activeColor={activeColor} />"
)

# Card 2 Dynamics
content = content.replace(
    "{houseBaseData?.realDynamics || \"O cotidiano se alinha perfeitamente com a energia do local.\"}",
    "<AppleHighlightText text={houseBaseData?.realDynamics || \"O cotidiano se alinha perfeitamente com a energia do local.\"} activeColor={activeColor} gradientParent={true} />"
)

# Card 3 Theme
content = content.replace(
    "{currentActiveData.themeData || \"Consolidação e Crescimento\"}",
    "<AppleHighlightText text={currentActiveData.themeData || \"Consolidação e Crescimento\"} activeColor={activeColor} />"
)

# Card 3 Secret
content = content.replace(
    "{currentActiveData.secretData || \"A verdadeira prosperidade neste ciclo não virá do esforço exaustivo, mas do posicionamento estratégico.\"}",
    "<AppleHighlightText text={currentActiveData.secretData || \"A verdadeira prosperidade neste ciclo não virá do esforço exaustivo, mas do posicionamento estratégico.\"} activeColor={activeColor} />"
)

# Card 4 Steps
content = content.replace(
    "{step}",
    "<AppleHighlightText text={step} activeColor={activeColor} />"
)

with open(file_path, "w") as f:
    f.write(content)

