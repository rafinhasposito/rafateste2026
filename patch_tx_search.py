import re

file_path = "src/components/admin/TransactionsTable.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add search state
content = content.replace(
    '  const [typeFilter, setTypeFilter] = useState<string>("all");',
    '  const [typeFilter, setTypeFilter] = useState<string>("all");\n  const [searchQuery, setSearchQuery] = useState("");'
)

# Add search filtering
content = content.replace(
    '  const filtered = txs.filter(t => {',
    '''  const filtered = txs.filter(t => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = (t.user_email || "").toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q);
      if (!match) return false;
    }'''
)

# Add Search UI before filters
content = content.replace(
    '      <div className="flex gap-3 mb-6 flex-wrap">',
    '''      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div className="flex gap-3 flex-wrap">'''
)

# Close the new div and add the search input
content = content.replace(
    '        ))}      </div>',
    '''        ))}
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar por e-mail ou descrição..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/10 text-white pl-4 pr-10 py-3 rounded-2xl focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all shadow-inner text-xs"
          />
        </div>
      </div>'''
)

# Fix the extra div end
content = content.replace(
    '      </div>\n      <div className="space-y-1.5">',
    '      <div className="space-y-1.5">'
)


with open(file_path, "w") as f:
    f.write(content)

