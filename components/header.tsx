'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { api } from '@/lib/api';

interface HeaderProps {
  currentPage: 'dashboard' | 'verification';
  userCount?: number;
}

export function Header({ currentPage, userCount = 0 }: HeaderProps) {
  const pageTitle = currentPage === 'dashboard' ? 'Gestión de Usuarios' : 'Verificación en Vivo';

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <h2 className="text-2xl font-bold text-foreground">{pageTitle}</h2>
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{userCount}</span> huellas registradas
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
      </div>
    </header>
  );
}
