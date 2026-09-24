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

# Looking at the original file (the one that had 10 errors), the errors were at:
# 45 (closing for 40) - Fixed
# 54 (closing for 50) - Fixed
# 62 (closing for 59) - Fixed
# 75 (closing for 73) - Fixed
# 77 (closing for 70? Or maybe 64?) Wait! 64 is `<motion.div initial=...>`! 
# No, let's fix the opening tags that correspond to 77, 94, 249, 250.

# 77 closes a tag. What tag does it close?
# Let's search for <motion.div backwards from 77.
# 76 is </motion.div>
# 75 is </div>
# 73 is <div (I fixed this one)
# 64 is <motion.div initial=... (this is a legit motion.div, it shouldn't be touched)
# 59 is <div (I fixed this one)
# Wait, if 64 is a legit motion.div, then 76 closes it!
# Then 77 closes something else!
