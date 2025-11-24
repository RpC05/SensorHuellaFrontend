'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Users, Fingerprint, CreditCard, FileText, TrendingUp, Activity } from 'lucide-react';
import { api } from '@/lib/api';
import type { DashboardStats } from '@/lib/types';

interface DashboardProps {
  onCountChange?: (count: number) => void;
}

export function Dashboard({ onCountChange }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalFingerprints: 0,
    totalCards: 0,
    todayAccess: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const [users, fingerprints, cards, todayLogs] = await Promise.all([
        api.getAllUsers(),
        api.getAllFingerprints(),
        api.getAllRfidCards(),
        api.getTodayAccesses(),
      ]);

      const newStats = {
        totalUsers: users.length,
        totalFingerprints: fingerprints.length,
        totalCards: cards.length,
        todayAccess: todayLogs.length,
      };

      setStats(newStats);
      onCountChange?.(users.length);
    } catch (error: any) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Dashboard General
        </h2>
        <p className="text-muted-foreground mt-1">
          Vista general del sistema de control de acceso
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-4xl font-bold text-blue-500 mb-1">
            {isLoading ? '...' : stats.totalUsers}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            Usuarios Registrados
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Fingerprint className="w-6 h-6 text-green-400" />
            </div>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-green-500 mb-1">
            {isLoading ? '...' : stats.totalFingerprints}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            Huellas Enrolladas
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-400" />
            </div>
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-4xl font-bold text-purple-500 mb-1">
            {isLoading ? '...' : stats.totalCards}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            Tarjetas RFID
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-4xl font-bold text-orange-500 mb-1">
            {isLoading ? '...' : stats.todayAccess}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            Accesos Hoy
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Estado del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <div>
              <div className="font-medium">Sistema en Línea</div>
              <div className="text-sm text-muted-foreground">Todos los servicios operativos</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <div>
              <div className="font-medium">Sensor ESP32 Conectado</div>
              <div className="text-sm text-muted-foreground">Listo para enrollar y verificar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/users"
            className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left group block"
          >
            <Users className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-medium">Gestión de Usuarios</div>
            <div className="text-sm text-muted-foreground">Crear y administrar usuarios</div>
          </Link>

          <Link
            href="/fingerprints"
            className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left group block"
          >
            <Fingerprint className="w-8 h-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-medium">Huellas Dactilares</div>
            <div className="text-sm text-muted-foreground">Enrollar y gestionar huellas</div>
          </Link>

          <Link
            href="/rfid-cards"
            className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left group block"
          >
            <CreditCard className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-medium">Tarjetas RFID</div>
            <div className="text-sm text-muted-foreground">Registrar y autorizar tarjetas</div>
          </Link>

          <Link
            href="/access-logs"
            className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left group block"
          >
            <FileText className="w-8 h-8 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-medium">Registros de Acceso</div>
            <div className="text-sm text-muted-foreground">Ver historial de accesos</div>
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Información del Sistema</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Versión:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Última Actualización:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Modo:</span>
              <span className="font-medium">Producción</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Resumen de Seguridad</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm">
                {stats.totalFingerprints} huellas activas en el sistema
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm">
                {stats.totalCards} tarjetas RFID registradas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-sm">
                {stats.todayAccess} accesos registrados hoy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
