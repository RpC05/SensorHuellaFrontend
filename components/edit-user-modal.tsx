'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { FingerPrintResponseDTO } from '@/lib/types';

interface EditUserModalProps {
  isOpen: boolean;
  user: FingerPrintResponseDTO | null;
  onClose: () => void;
  onSave: (userData: Partial<FingerPrintResponseDTO>) => void;
}

export function EditUserModal({ isOpen, user, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    fechaNacimiento: '',
    description: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombres: user.nombres || '',
        apellidoPaterno: user.apellidoPaterno || '',
        apellidoMaterno: user.apellidoMaterno || '',
        tipoDocumento: user.tipoDocumento || 'DNI',
        numeroDocumento: user.numeroDocumento || '',
        fechaNacimiento: user.fechaNacimiento || '',
        description: user.description || '',
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombres || !formData.apellidoPaterno || !formData.numeroDocumento) {
      alert('Por favor completa los campos requeridos');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Editar Datos del Usuario</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Nombres *</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Apellido Paterno *</label>
              <input
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Apellido Materno</label>
              <input
                type="text"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Tipo de Documento *</label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1"
              >
                <option>DNI</option>
                <option>Pasaporte</option>
                <option>CE</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Número de Documento *</label>
              <input
                type="text"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary h-20 mt-1"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-6 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
