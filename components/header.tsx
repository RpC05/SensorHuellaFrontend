'use client';

import { User, Activity } from 'lucide-react';
import type { PageType } from '@/lib/types';

interface HeaderProps {
  currentPage: PageType;
  userCount?: number;
}

const PAGE_TITLES: Record<PageType, string> = {
  dashboard: 'Dashboard',
  users: 'Gestión de Usuarios',
  fingerprints: 'Gestión de Huellas',
  'rfid-cards': 'Gestión de Tarjetas RFID',
  'access-logs': 'Registros de Acceso',
  verification: 'Verificación en Vivo',
};

export function Header({ currentPage, userCount = 0 }: HeaderProps) {
  const pageTitle = PAGE_TITLES[currentPage];

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
        {userCount > 0 && (
          <div className="text-sm text-muted-foreground px-4 py-2 bg-muted/50 rounded-lg">
            <span className="font-semibold text-foreground">{userCount}</span> usuarios registrados
          </div>
        )}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </header>
  );
}
