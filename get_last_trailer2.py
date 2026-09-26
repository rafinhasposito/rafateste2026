import json

lines = open('/Users/rafaelsposito/.gemini/antigravity/brain/9771de37-2812-4cf9-b2e3-4088bee738af/.system_generated/logs/transcript.jsonl').readlines()

for line in reversed(lines):
    try:
        data = json.loads(line)
        if "tool_calls" in data:
            for call in data["tool_calls"]:
                if call["name"] == "replace_file_content":
                    if "HouseTrailer.tsx" in call["args"].get("TargetFile", ""):
                        print("FOUND A REPLACE_FILE_CONTENT FOR HOUSETRAILER:")
                        print("Instruction:", call["args"].get("Instruction"))
                        print("Replacement Content:", call["args"].get("ReplacementContent")[:500] + "...")
                        print("---")
    except:
        pass
