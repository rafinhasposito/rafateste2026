import re

file_path = "src/pages/HouseTrailerApp.tsx"
with open(file_path, "r") as f:
    content = f.read()

# I need to extract handleRevelarCidades and the two state/hooks I added
start_marker = "  const [isProcessing, setIsProcessing] = useState(false);"
end_marker = "    }\n  };\n"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx) + len(end_marker)

if start_idx != -1 and end_idx != -1:
    extracted_block = content[start_idx:end_idx]
    # Remove it from the top
    content = content[:start_idx] + content[end_idx:]
    
    # Insert it right before the return statement of HouseTrailerApp
    insert_marker = "  return ("
    insert_idx = content.find(insert_marker)
    
    if insert_idx != -1:
        content = content[:insert_idx] + extracted_block + "\n" + content[insert_idx:]
        
        with open(file_path, "w") as f:
            f.write(content)
        print("Moved successfully!")
    else:
        print("Could not find return statement")
else:
    print("Could not find block")
