'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Fingerprint, CreditCard, FileText, Shield } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/users', label: 'Usuarios', icon: Users },
    { href: '/fingerprints', label: 'Huellas', icon: Fingerprint },
    { href: '/rfid-cards', label: 'Tarjetas RFID', icon: CreditCard },
    { href: '/access-logs', label: 'Registros de Acceso', icon: FileText },
    { href: '/verification', label: 'Verificación en Vivo', icon: Shield },
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
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-foreground border border-blue-500/30 shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : ''}`} />
              <span className={`font-medium text-sm ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
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
