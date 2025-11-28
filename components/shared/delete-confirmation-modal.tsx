'use client';

import { AlertCircle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  userName,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-md p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">¿Eliminar Huella?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              ¿Estás seguro de que deseas eliminar permanentemente la huella de <span className="font-semibold">{userName}</span>? Esta acción también desactivará al usuario en el sistema.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium"
          >
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
