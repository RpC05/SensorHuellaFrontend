import { Home, Fingerprint } from 'lucide-react';

interface SidebarProps {
  currentPage: 'dashboard' | 'verification';
  onNavigate: (page: 'dashboard' | 'verification') => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Fingerprint className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-sidebar-foreground">BioAuth</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            currentPage === 'dashboard'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/10'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate('verification')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            currentPage === 'verification'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/10'
          }`}
        >
          <Fingerprint className="w-5 h-5" />
          <span className="font-medium">Verificación en Vivo</span>
        </button>
      </nav>
    </aside>
  );
}
