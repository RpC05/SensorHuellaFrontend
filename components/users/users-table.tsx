'use client';

import { useState } from 'react';
import { Eye, Trash2, Edit2 } from 'lucide-react';
import { DeleteConfirmationModal } from '../shared/delete-confirmation-modal';
import { UserDetailsModal } from './user-details-modal';
import { EditUserModal } from './edit-user-modal';
import type { UserResponseDTO } from '@/lib/types';

interface UsersTableProps {
  users: UserResponseDTO[];
  onDelete: (userId: number) => void;
  onUpdate: (userId: number, userData: Partial<UserResponseDTO>) => void;
}

export function UsersTable({ users, onDelete, onUpdate }: UsersTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; userId: number; userName: string }>({
    show: false,
    userId: 0,
    userName: '',
  });
  const [detailsModal, setDetailsModal] = useState<{ show: boolean; user: UserResponseDTO | null }>({
    show: false,
    user: null,
  });
  const [editModal, setEditModal] = useState<{ show: boolean; user: UserResponseDTO | null }>({
    show: false,
    user: null,
  });

  const handleDeleteClick = (userId: number, userName: string) => {
    setDeleteConfirm({ show: true, userId, userName });
  };

  const handleConfirmDelete = () => {
    onDelete(deleteConfirm.userId);
    setDeleteConfirm({ show: false, userId: 0, userName: '' });
  };

  const handleViewDetails = (user: UserResponseDTO) => {
    setDetailsModal({ show: true, user });
  };

  const handleEditClick = (user: UserResponseDTO) => {
    setEditModal({ show: true, user });
  };

  const handleSaveEdit = (userData: Partial<UserResponseDTO>) => {
    if (editModal.user) {
      onUpdate(editModal.user.id, userData);
      setEditModal({ show: false, user: null });
    }
  };

  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nombre Completo</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Documento</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Fecha de Enrolamiento</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estado</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border hover:bg-muted/10 transition-colors">
              <td className="px-6 py-4 text-sm text-foreground">
                {user.fullName}
              </td>
              <td className="px-6 py-4 text-sm text-foreground">
                <span className="text-muted-foreground">{user.tipoDocumento}:</span> {user.numeroDocumento}
              </td>
              <td className="px-6 py-4 text-sm text-foreground">
                {new Date(user.createdAt).toLocaleDateString('es-PE')}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.active
                    ? 'bg-accent/20 text-accent'
                    : 'bg-muted text-muted-foreground'
                    }`}
                >
                  {user.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewDetails(user)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-5 h-5 text-primary" />
                  </button>
                  <button
                    onClick={() => handleEditClick(user)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Editar datos"
                  >
                    <Edit2 className="w-5 h-5 text-foreground" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user.id, user.fullName)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Eliminar huella"
                  >
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteConfirmationModal
        isOpen={deleteConfirm.show}
        userName={deleteConfirm.userName}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ show: false, userId: 0, userName: '' })}
      />

      <UserDetailsModal
        isOpen={detailsModal.show}
        user={detailsModal.user}
        onClose={() => setDetailsModal({ show: false, user: null })}
        onEdit={() => {
          if (detailsModal.user) {
            setDetailsModal({ show: false, user: null });
            setEditModal({ show: true, user: detailsModal.user });
          }
        }}
      />

      <EditUserModal
        isOpen={editModal.show}
        user={editModal.user!}
        onClose={() => setEditModal({ show: false, user: null })}
        onEdit={() => {
          setEditModal({ show: false, user: null });
        }}
      />
    </>
  );
}
