'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { UsersTable } from './users-table';
import { EnrollmentModal } from './enrollment-modal';
import { ConfirmDialog } from './confirm-dialog';
import { api } from '@/lib/api';
import type { FingerPrintResponseDTO } from '@/lib/types';

interface DashboardProps {
  onCountChange?: (count: number) => void;
}

export function Dashboard({ onCountChange }: DashboardProps) {
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [enrolledUsers, setEnrolledUsers] = useState<FingerPrintResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const users = await api.getAllFingerprints();
      setEnrolledUsers(users);
      onCountChange?.(users.length);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEnrollUser = async () => {
    setShowEnrollModal(false);
    // Esperar un momento antes de recargar para que el backend procese
    setTimeout(() => {
      loadUsers();
    }, 1000);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await api.deleteFingerprint(userId);
      // Esperar un momento antes de recargar
      setTimeout(() => {
        loadUsers();
      }, 500);
    } catch (err: any) {
      console.error('Error deleting user:', err);
      alert('Error al eliminar usuario: ' + err.message);
    }
  };

  const handleUpdateUser = async (userId: number, userData: Partial<FingerPrintResponseDTO>) => {
    try {
      await api.updateFingerprint(userId, userData);
      setTimeout(() => {
        loadUsers();
      }, 500);
    } catch (err: any) {
      console.error('Error updating user:', err);
      alert('Error al actualizar usuario: ' + err.message);
    }
  };

  const handleEmptyDatabase = async () => {
    setShowEmptyConfirm(false);
    
    try {
      setIsLoading(true);
      await api.emptyDatabase();
      setTimeout(() => {
        loadUsers();
      }, 1000);
    } catch (err: any) {
      console.error('Error emptying database:', err);
      alert('Error al vaciar la base de datos: ' + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <button
            onClick={loadUsers}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            <svg 
              className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refrescar
          </button>

          <button
            onClick={() => setShowEmptyConfirm(true)}
            disabled={isLoading || enrolledUsers.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-5 h-5" />
            Vaciar Base de Datos
          </button>
        </div>
        
        <button
          onClick={() => setShowEnrollModal(true)}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Enrolar Nuevo Usuario
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          Cargando usuarios...
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <UsersTable
            users={enrolledUsers}
            onDelete={handleDeleteUser}
            onUpdate={handleUpdateUser}
          />
        </div>
      )}

      <EnrollmentModal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        onEnroll={handleEnrollUser}
      />

      <ConfirmDialog
        isOpen={showEmptyConfirm}
        title="¿Vaciar Base de Datos?"
        message="Esta acción eliminará TODAS las huellas registradas del sensor y la base de datos. Esta operación no se puede deshacer."
        confirmText="Sí, Vaciar Todo"
        cancelText="Cancelar"
        onConfirm={handleEmptyDatabase}
        onCancel={() => setShowEmptyConfirm(false)}
      />
    </div>
  );
}
