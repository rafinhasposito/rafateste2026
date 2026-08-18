import React from "react";
import { MoreVertical, Download, Plus } from "lucide-react";

export const UsersTable = () => {
  const users = [
    { name: "Florence Shaw", email: "florence@exemplo.com", role: "Admin", lastActive: "Mar 4, 2024", dateAdded: "Jul 4, 2022", avatar: "FS" },
    { name: "Amélie Laurent", email: "amelie@exemplo.com", role: "Admin", lastActive: "Mar 4, 2024", dateAdded: "Jul 4, 2022", avatar: "AL" },
    { name: "Ammar Foley", email: "ammar@exemplo.com", role: "User", lastActive: "Mar 2, 2024", dateAdded: "Jul 4, 2022", avatar: "AF" },
    { name: "Caitlyn King", email: "caitlyn@exemplo.com", role: "User", lastActive: "Mar 6, 2024", dateAdded: "Jul 4, 2022", avatar: "CK" },
    { name: "Sienna Hewitt", email: "sienna@exemplo.com", role: "User", lastActive: "Mar 8, 2024", dateAdded: "Jul 4, 2022", avatar: "SH" },
  ];

  return (
    <div className="glass-panel border border-border rounded-xl overflow-hidden shadow-lg">
      <div className="p-5 border-b border-border flex items-center justify-between bg-card/50">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium text-foreground">Todos os usuários</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary text-xs font-medium text-foreground">44</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
            Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
            <Plus size={16} /> Add user
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-secondary/30 text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-3 font-medium">User name</th>
              <th className="px-6 py-3 font-medium">Access</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Last active</th>
              <th className="px-6 py-3 font-medium">Date added</th>
              <th className="px-6 py-3 font-medium w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user, idx) => (
              <tr key={idx} className="table-row-hover transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-semibold text-primary text-xs">
                      {user.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-muted-foreground text-xs">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                    user.role === 'Admin' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-secondary text-foreground border-border'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-blue-400 bg-blue-500/10 cursor-pointer">
                      Data Export
                    </span>
                    <span className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-purple-400 bg-purple-500/10 cursor-pointer">
                      Data Import
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{user.lastActive}</td>
                <td className="px-6 py-4 text-muted-foreground">{user.dateAdded}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-border flex items-center justify-between bg-card/30">
        <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50">
          Previous
        </button>
        <div className="flex gap-1 text-sm">
          {[1, 2, 3, 4, 5, 6].map(page => (
            <button key={page} className={`w-8 h-8 flex items-center justify-center rounded-lg ${page === 1 ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50'}`}>
              {page}
            </button>
          ))}
        </div>
        <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersTable;
