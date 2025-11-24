'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Fingerprint, CreditCard, Pencil, Trash2, Eye, Search, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import { toast as sonnerToast } from 'sonner';
import type { UserResponseDTO } from '@/lib/types';
import { CreateUserModal } from './create-user-modal';
import { EditUserModal } from './edit-user-modal';
import { AssignFingerprintModal } from './assign-fingerprint-modal';
import { AssignRfidModal } from './assign-rfid-modal';
import { UserDetailsModal } from './user-details-modal';
import { ConfirmDialog } from '../shared/confirm-dialog';

interface UsersManagementProps {
    onUserCountChange?: (count: number) => void;
}

export function UsersManagement({ onUserCountChange }: UsersManagementProps) {
    const [users, setUsers] = useState<UserResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAssignFingerprintModal, setShowAssignFingerprintModal] = useState(false);
    const [showAssignRfidModal, setShowAssignRfidModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(null);

    const loadUsers = async () => {
        const loadingToast = toast.loading('Cargando usuarios...');

        try {
            setIsLoading(true);
            const data = await api.getAllUsers();
            setUsers(data);
            onUserCountChange?.(data.length);
            sonnerToast.dismiss(loadingToast);
            toast.success('Usuarios cargados exitosamente');
        } catch (error: any) {
            sonnerToast.dismiss(loadingToast);
            toast.error('Error al cargar usuarios');
            console.error('Error loading users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load users on mount
    useEffect(() => {
        loadUsers();
    }, []);

    const handleCreateUser = async () => {
        setShowCreateModal(false);
        await loadUsers();
    };

    const handleEditUser = async () => {
        setShowEditModal(false);
        setSelectedUser(null);
        await loadUsers();
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        setShowDeleteConfirm(false);

        try {
            await toast.promise(
                api.deleteUser(selectedUser.id),
                {
                    loading: 'Eliminando usuario...',
                    success: 'Usuario eliminado correctamente',
                    error: 'Error al eliminar usuario',
                }
            );
            setSelectedUser(null);
            await loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleAssignFingerprint = () => {
        setShowAssignFingerprintModal(false);
        setSelectedUser(null);
        loadUsers();
    };

    const handleAssignRfid = () => {
        setShowAssignRfidModal(false);
        setSelectedUser(null);
        loadUsers();
    };

    // Filter users based on search
    const filteredUsers = users.filter(user => {
        const search = searchTerm.toLowerCase();
        return (
            user.fullName.toLowerCase().includes(search) ||
            user.numeroDocumento.includes(search) ||
            user.cargo?.toLowerCase().includes(search) ||
            user.areaDepartamento?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Gestión de Usuarios
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Administra los usuarios del sistema
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={loadUsers}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                        title="Refrescar datos"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <UserPlus className="w-5 h-5" />
                        Crear Usuario
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, documento, cargo o área..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="text-blue-400 text-sm font-medium">Total Usuarios</div>
                    <div className="text-3xl font-bold text-blue-500 mt-1">{users.length}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-4">
                    <div className="text-green-400 text-sm font-medium">Con Huella</div>
                    <div className="text-3xl font-bold text-green-500 mt-1">
                        {users.filter(u => u.hasFingerprint).length}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-4">
                    <div className="text-purple-400 text-sm font-medium">Con RFID</div>
                    <div className="text-3xl font-bold text-purple-500 mt-1">
                        {users.filter(u => u.hasRfidCard).length}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-4">
                    <div className="text-orange-400 text-sm font-medium">Activos</div>
                    <div className="text-3xl font-bold text-orange-500 mt-1">
                        {users.filter(u => u.active).length}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="text-muted-foreground mt-4">Cargando usuarios...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 bg-card border border-border rounded-lg">
                    <UserPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-medium text-muted-foreground">
                        {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
                    </p>
                    <p className="text-muted-foreground mt-2">
                        {searchTerm ? 'Intenta con otro término de búsqueda' : 'Crea tu primer usuario para comenzar'}
                    </p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Documento</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Cargo</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Área</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Huella</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">RFID</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{user.fullName}</div>
                                            <div className="text-sm text-muted-foreground">{user.tipoDocumento}</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm">{user.numeroDocumento}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm">{user.cargo || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm">{user.areaDepartamento || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {user.hasFingerprint ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                    <Fingerprint className="w-3 h-3" />
                                                    Asignada
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowAssignFingerprintModal(true);
                                                    }}
                                                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                                                >
                                                    Asignar
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {user.hasRfidCard ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                                                    <CreditCard className="w-3 h-3" />
                                                    Asignada
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowAssignRfidModal(true);
                                                    }}
                                                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                                                >
                                                    Asignar
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDeleteConfirm(true);
                                                    }}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modals */}
            <CreateUserModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={handleCreateUser}
            />

            {selectedUser && (
                <>
                    <EditUserModal
                        isOpen={showEditModal}
                        user={selectedUser}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedUser(null);
                        }}
                        onEdit={handleEditUser}
                    />

                    <UserDetailsModal
                        isOpen={showDetailsModal}
                        user={selectedUser}
                        onClose={() => {
                            setShowDetailsModal(false);
                            setSelectedUser(null);
                        }}
                        onEdit={() => {
                            setShowDetailsModal(false);
                            setShowEditModal(true);
                        }}
                    />

                    <AssignFingerprintModal
                        isOpen={showAssignFingerprintModal}
                        user={selectedUser}
                        onClose={() => {
                            setShowAssignFingerprintModal(false);
                            setSelectedUser(null);
                        }}
                        onAssigned={handleAssignFingerprint}
                    />

                    <AssignRfidModal
                        isOpen={showAssignRfidModal}
                        user={selectedUser}
                        onClose={() => {
                            setShowAssignRfidModal(false);
                            setSelectedUser(null);
                        }}
                        onAssigned={handleAssignRfid}
                    />

                    <ConfirmDialog
                        isOpen={showDeleteConfirm}
                        title="¿Eliminar Usuario?"
                        message={`¿Estás seguro de que deseas eliminar a ${selectedUser.fullName}? Esta acción no se puede deshacer.`}
                        confirmText="Sí, Eliminar"
                        cancelText="Cancelar"
                        onConfirm={handleDeleteUser}
                        onCancel={() => {
                            setShowDeleteConfirm(false);
                            setSelectedUser(null);
                        }}
                    />
                </>
            )}
        </div>
    );
}
