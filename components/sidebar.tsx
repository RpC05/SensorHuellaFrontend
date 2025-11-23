import { Home, Users, Fingerprint, CreditCard, FileText, Shield } from 'lucide-react';
import type { PageType } from '@/lib/types';

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as PageType, label: 'Dashboard', icon: Home },
    { id: 'users' as PageType, label: 'Usuarios', icon: Users },
    { id: 'fingerprints' as PageType, label: 'Huellas', icon: Fingerprint },
    { id: 'rfid-cards' as PageType, label: 'Tarjetas RFID', icon: CreditCard },
    { id: 'access-logs' as PageType, label: 'Registros de Acceso', icon: FileText },
    { id: 'verification' as PageType, label: 'Verificación en Vivo', icon: Shield },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Fingerprint className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              BioAuth
            </h1>
            <p className="text-xs text-muted-foreground">Control de Acceso</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-foreground border border-blue-500/30 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : ''}`} />
              <span className={`font-medium text-sm ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground text-center">
          v1.0.0 - Sistema de Control de Acceso
        </div>
      </div>
    </aside>
  );
}
