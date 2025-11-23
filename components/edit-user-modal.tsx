'use client';

import { useState } from 'react';
import { X, Calendar, FileText, Briefcase, Building2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import type { UserRequestDTO, UserResponseDTO } from '@/lib/types';

interface EditUserModalProps {
  isOpen: boolean;
  user: UserResponseDTO;
  onClose: () => void;
  onEdit: () => void;
}

export function EditUserModal({ isOpen, user, onClose, onEdit }: EditUserModalProps) {
  const [formData, setFormData] = useState<UserRequestDTO>({
    nombres: user.nombres,
    apellidoPaterno: user.apellidoPaterno,
    apellidoMaterno: user.apellidoMaterno || '',
    fechaNacimiento: user.fechaNacimiento || '',
    tipoDocumento: user.tipoDocumento,
    numeroDocumento: user.numeroDocumento,
    cargo: user.cargo || '',
    areaDepartamento: user.areaDepartamento || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombres || !formData.apellidoPaterno || !formData.numeroDocumento) {
      toast.error('Campos requeridos', {
        description: 'Por favor completa todos los campos obligatorios'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await toast.promise(
        api.updateUser(user.id, formData),
        {
          loading: 'Actualizando usuario...',
          success: 'Usuario actualizado exitosamente',
          error: (err: any) => `Error: ${err.message}`,
        }
      );

      onEdit();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Editar Usuario
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Actualiza la información de {user.fullName}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            {/* Nombres */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombres <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                required
              />
            </div>

            {/* Apellidos */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Apellido Paterno <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.apellidoPaterno}
                  onChange={(e) => setFormData({ ...formData, apellidoPaterno: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Apellido Materno
                </label>
                <input
                  type="text"
                  value={formData.apellidoMaterno}
                  onChange={(e) => setFormData({ ...formData, apellidoMaterno: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                />
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              />
            </div>

            {/* Documento */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Tipo
                </label>
                <select
                  value={formData.tipoDocumento}
                  onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">CE</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Número <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.numeroDocumento}
                  onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Cargo */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Cargo
              </label>
              <input
                type="text"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              />
            </div>

            {/* Área/Departamento */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Área/Departamento
              </label>
              <input
                type="text"
                value={formData.areaDepartamento}
                onChange={(e) => setFormData({ ...formData, areaDepartamento: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted/30">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? 'Actualizando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
