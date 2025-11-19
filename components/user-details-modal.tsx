'use client';

import { X } from 'lucide-react';
import type { FingerPrintResponseDTO } from '@/lib/types';

interface UserDetailsModalProps {
  isOpen: boolean;
  user: FingerPrintResponseDTO | null;
  onClose: () => void;
  onEdit: () => void;
}

export function UserDetailsModal({ isOpen, user, onClose, onEdit }: UserDetailsModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Detalles del Usuario</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID Huella</label>
              <p className="text-lg font-semibold text-foreground mt-1">{user.fingerprintId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Estado</label>
              <div className="mt-1">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    user.active
                      ? 'bg-accent/20 text-accent'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {user.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Información Personal</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nombres</label>
                <p className="text-foreground mt-1">{user.nombres}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Apellido Paterno</label>
                <p className="text-foreground mt-1">{user.apellidoPaterno}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Apellido Materno</label>
                <p className="text-foreground mt-1">{user.apellidoMaterno || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</label>
                <p className="text-foreground mt-1">
                  {user.fechaNacimiento 
                    ? new Date(user.fechaNacimiento).toLocaleDateString('es-PE')
                    : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo de Documento</label>
                <p className="text-foreground mt-1">{user.tipoDocumento}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Número de Documento</label>
                <p className="text-foreground mt-1">{user.numeroDocumento}</p>
              </div>
            </div>
          </div>

          {user.description && (
            <div className="border-t border-border pt-6">
              <label className="text-sm font-medium text-muted-foreground">Descripción</label>
              <p className="text-foreground mt-1">{user.description}</p>
            </div>
          )}

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Información del Sistema</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fecha de Registro</label>
                <p className="text-foreground mt-1">
                  {new Date(user.enrolledAt).toLocaleString('es-PE')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                <p className="text-foreground mt-1">
                  {new Date(user.updatedAt).toLocaleString('es-PE')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Editar Datos
          </button>
        </div>
      </div>
    </div>
  );
}
