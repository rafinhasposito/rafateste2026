import sys
import re

with open("src/pages/HouseTrailer.tsx", "r") as f:
    content = f.read()

# First, fix the closing tags.
# If an opening tag is <motion.div, its closing is </motion.div>.
# Currently, since I replaced ALL <div with <motion.div, 
# there are many <motion.div> that are closed with </div>!
# Let's just fix the closing tags to match the opening tags.
# Actually, the easiest way to fix this file is to restore it from the Git history of another branch? 
# Wait, it's an untracked file. It was never in git!

# Let's fix the opening tags first.
def replace_tag(match):
    tag_content = match.group(0)
    if 'animate=' in tag_content or 'initial=' in tag_content or 'transition=' in tag_content or 'exit=' in tag_content or 'layoutId=' in tag_content or 'layout ' in tag_content:
        return tag_content
    else:
        return tag_content.replace('<motion.div', '<div')

# Find all <motion.div ... >
content = re.sub(r'<motion\.div[^>]*>', replace_tag, content)

# Now, we have a mix of <div and <motion.div.
# We also have a mix of </div> and </motion.div>.
# This is a nightmare to parse with regex.
