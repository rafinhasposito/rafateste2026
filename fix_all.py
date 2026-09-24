import sys

def replace_line(filename, line_number, old_text, new_text):
    with open(filename, 'r') as file:
        lines = file.readlines()
    
    idx = line_number - 1
    if old_text in lines[idx]:
        lines[idx] = lines[idx].replace(old_text, new_text)
    
    with open(filename, 'w') as file:
        file.writelines(lines)

replace_line('src/pages/HouseTrailer.tsx', 77, '</div>', '</motion.div>')
replace_line('src/pages/HouseTrailer.tsx', 94, '</div>', '</motion.div>')
replace_line('src/pages/HouseTrailer.tsx', 249, '</div>', '</motion.div>')
replace_line('src/pages/HouseTrailer.tsx', 250, '</div>', '</motion.div>')

print("Fixed")
