'use client';

import { usePathname } from 'next/navigation';
import { User, Activity } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/users': 'Gestión de Usuarios',
  '/fingerprints': 'Gestión de Huellas',
  '/rfid-cards': 'Gestión de Tarjetas RFID',
  '/access-logs': 'Registros de Acceso',
  '/verification': 'Verificación en Vivo',
};

export function Header() {
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname] || 'Dashboard';

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{pageTitle}</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <Activity className="w-3 h-3" />
          <span>Sistema en línea</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </header>
  );
}
