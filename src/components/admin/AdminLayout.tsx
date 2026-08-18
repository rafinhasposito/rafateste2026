import React from "react";
import { 
  LayoutDashboard, Users, Settings, Database, 
  CreditCard, LogOut, Search, Bell
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, description }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-inter">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 border-r border-border bg-card/30 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 font-cinzel font-bold text-xl tracking-wider text-foreground">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center">
              PS
            </div>
            Protocolo Solar
          </div>
        </div>

        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground tracking-wider mb-2 mt-4">
          ADMINISTRAÇÃO
        </div>
        <nav className="flex-1 px-3 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarItem icon={<Users size={18} />} label="Usuários" active />
          <SidebarItem icon={<Database size={18} />} label="Relatórios" />
          <SidebarItem icon={<CreditCard size={18} />} label="Faturamento" />
          <SidebarItem icon={<Settings size={18} />} label="Configurações" />
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-sm">
              AD
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Admin Root</p>
              <p className="text-xs text-muted-foreground">admin@protocolo.com</p>
            </div>
            <LogOut size={16} className="ml-auto text-muted-foreground hover:text-foreground cursor-pointer" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center text-sm text-muted-foreground">
            Protocolo Solar <span className="mx-2">/</span> <span className="text-foreground font-medium">{title}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Buscar..."
                className="pl-9 pr-4 py-1.5 rounded-md bg-secondary border border-border text-sm focus:outline-none focus:border-gold/50 transition-colors w-64"
              />
            </div>
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full" />
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          
          {children}
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => {
  return (
    <button 
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active 
          ? "bg-secondary text-foreground" 
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};
