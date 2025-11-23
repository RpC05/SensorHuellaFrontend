'use client';

import { X, User, Calendar, FileText, Fingerprint, CreditCard } from 'lucide-react';
import type { UserResponseDTO } from '@/lib/types';

interface UserDetailsModalProps {
  isOpen: boolean;
  user: UserResponseDTO | null;
  onClose: () => void;
  onEdit: () => void;
}

export function UserDetailsModal({ isOpen, user, onClose, onEdit }: UserDetailsModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Detalles del Usuario
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{user.fullName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Información Personal */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Información Personal
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <label className="text-sm font-medium text-muted-foreground">Nombres</label>
                  <p className="text-foreground mt-1 font-medium">{user.nombres}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <label className="text-sm font-medium text-muted-foreground">Apellido Paterno</label>
                  <p className="text-foreground mt-1 font-medium">{user.apellidoPaterno}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <label className="text-sm font-medium text-muted-foreground">Apellido Materno</label>
                  <p className="text-foreground mt-1 font-medium">{user.apellidoMaterno || '-'}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Fecha de Nacimiento
                  </label>
                  <p className="text-foreground mt-1 font-medium">
                    {user.fechaNacimiento
                      ? new Date(user.fechaNacimiento).toLocaleDateString('es-PE')
                      : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Documento */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                Documento de Identidad
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Documento</label>
                  <p className="text-foreground mt-1 font-medium">{user.tipoDocumento}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <label className="text-sm font-medium text-muted-foreground">Número de Documento</label>
                  <p className="text-foreground mt-1 font-mono font-semibold">{user.numeroDocumento}</p>
                </div>
              </div>
            </div>

            {/* Información Laboral */}
            {(user.cargo || user.areaDepartamento) && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-500" />
                  Información Laboral
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-4 rounded-lg border border-border">
                    <label className="text-sm font-medium text-muted-foreground">Cargo</label>
                    <p className="text-foreground mt-1 font-medium">{user.cargo || '-'}</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg border border-border">
                    <label className="text-sm font-medium text-muted-foreground">Área/Departamento</label>
                    <p className="text-foreground mt-1 font-medium">{user.areaDepartamento || '-'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Biometría */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Estado de Biometría</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border-2 ${user.hasFingerprint ? 'border-green-500/50 bg-green-500/10' : 'border-border bg-muted/30'}`}>
                  <div className="flex items-center gap-2">
                    <Fingerprint className={`w-5 h-5 ${user.hasFingerprint ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <label className="text-sm font-medium text-muted-foreground">Huella Dactilar</label>
                  </div>
                  <p className={`mt-2 font-semibold ${user.hasFingerprint ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {user.hasFingerprint ? '✓ Registrada' : '✗ No registrada'}
                  </p>
                </div>
                <div className={`p-4 rounded-lg border-2 ${user.hasRfidCard ? 'border-purple-500/50 bg-purple-500/10' : 'border-border bg-muted/30'}`}>
                  <div className="flex items-center gap-2">
                    <CreditCard className={`w-5 h-5 ${user.hasRfidCard ? 'text-purple-500' : 'text-muted-foreground'}`} />
                    <label className="text-sm font-medium text-muted-foreground">Tarjeta RFID</label>
                  </div>
                  <p className={`mt-2 font-semibold ${user.hasRfidCard ? 'text-purple-500' : 'text-muted-foreground'}`}>
                    {user.hasRfidCard ? '✓ Registrada' : '✗ No registrada'}
                  </p>
                </div>
              </div>
            </div>

            {/* Información del Sistema */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Información del Sistema</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <label className="text-sm font-medium text-muted-foreground">ID Usuario</label>
                  <p className="text-foreground mt-1 font-mono font-semibold">{user.id}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Registro</label>
                  <p className="text-foreground mt-1 text-sm">
                    {new Date(user.createdAt).toLocaleString('es-PE')}
                  </p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                  <p className="text-foreground mt-1 text-sm">
                    {new Date(user.updatedAt).toLocaleString('es-PE')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border bg-muted/30 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Editar Datos
          </button>
        </div>
      </div>
    </div>
  );
}
