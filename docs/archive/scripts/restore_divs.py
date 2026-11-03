import sys

def replace_line(filename, line_number, old_text, new_text):
    with open(filename, 'r') as file:
        lines = file.readlines()
    
    # 0-indexed
    idx = line_number - 1
    if old_text in lines[idx]:
        lines[idx] = lines[idx].replace(old_text, new_text)
    
    with open(filename, 'w') as file:
        file.writelines(lines)

replace_line('src/pages/HouseTrailer.tsx', 37, '<motion.div', '<div')
replace_line('src/pages/HouseTrailer.tsx', 40, '<motion.div', '<div')
replace_line('src/pages/HouseTrailer.tsx', 50, '<motion.div', '<div')
replace_line('src/pages/HouseTrailer.tsx', 59, '<motion.div', '<div')
replace_line('src/pages/HouseTrailer.tsx', 70, '<motion.div', '<div')
replace_line('src/pages/HouseTrailer.tsx', 73, '<motion.div', '<div')
replace_line('src/pages/HouseTrailer.tsx', 83, '<motion.div', '<div')
replace_line('src/pages/HouseTrailer.tsx', 120, '<motion.div', '<div')
replace_line('src/pages/HouseTrailer.tsx', 131, '<motion.div', '<div')
replace_line('src/pages/HouseTrailer.tsx', 133, '<motion.div', '<div')
print("Done")
