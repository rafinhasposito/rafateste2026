import re

file_path = "src/components/admin/TransactionsTable.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Fix the JSX
old_jsx = '''        ))}
      <div className="space-y-1.5">'''
new_jsx = '''        ))}
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar email ou transação..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 rounded-2xl focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all shadow-inner text-xs placeholder:text-white/20"
          />
        </div>
      </div>
      <div className="space-y-1.5">'''

content = content.replace(old_jsx, new_jsx)

with open(file_path, "w") as f:
    f.write(content)

