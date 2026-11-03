file_path = "src/components/UnlockPremiumModal.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_wrapper_start = """            {/* Opção 2 */}
            {!isEmbedded && (
            <div onClick={() => handleUnlock('full')}"""
new_wrapper_start = """            {/* Opção 2 */}
            <div onClick={() => handleUnlock('full')}"""

content = content.replace(old_wrapper_start, new_wrapper_start)

# I also need to remove the closing brace for the wrapper
old_wrapper_end = """              </button>
            </div>
            )}"""
new_wrapper_end = """              </button>
            </div>"""

content = content.replace(old_wrapper_end, new_wrapper_end)

with open(file_path, "w") as f:
    f.write(content)
print("Modal patched!")
