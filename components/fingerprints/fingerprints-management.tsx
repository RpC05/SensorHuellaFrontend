'use client';

import { useState, useEffect } from 'react';
import { Fingerprint, Trash2, UserPlus, AlertTriangle, Search, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import type { FingerPrintResponseDTO, UserResponseDTO } from '@/lib/types';
import { ConfirmDialog } from '../shared/confirm-dialog';

export function FingerprintsManagement() {
    const [fingerprints, setFingerprints] = useState<FingerPrintResponseDTO[]>([]);
    const [users, setUsers] = useState<UserResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
    const [selectedFingerprint, setSelectedFingerprint] = useState<FingerPrintResponseDTO | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [userSearch, setUserSearch] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [fps, usrs] = await Promise.all([
                api.getAllFingerprints(),
                api.getAllUsers(),
            ]);
            setFingerprints(fps);
            setUsers(usrs);
            toast.success(`${fps.length} huellas cargadas`);
        } catch (error: any) {
            toast.error('Error al cargar datos', { description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedFingerprint) return;

        setShowDeleteConfirm(false);

        try {
            await toast.promise(
                api.deleteFingerprint(selectedFingerprint.fingerprintId),
                {
                    loading: 'Eliminando huella...',
                    success: 'Huella eliminada correctamente',
                    error: 'Error al eliminar huella',
                }
            );
            setSelectedFingerprint(null);
            await loadData();
        } catch (error) {
            console.error('Error deleting fingerprint:', error);
        }
    };

    const handleEmptyDatabase = async () => {
        setShowEmptyConfirm(false);

        try {
            await toast.promise(
                api.emptyFingerprintDatabase(),
                {
                    loading: 'Vaciando base de datos del sensor...',
                    success: 'Base de datos vaciada correctamente',
                    error: 'Error al vaciar la base de datos',
                }
            );
            await loadData();
        } catch (error) {
            console.error('Error emptying database:', error);
        }
    };

    const handleAssignToUser = async () => {
        if (!selectedFingerprint || !selectedUser) return;

        try {
            await toast.promise(
                api.assignFingerPrintToUser(selectedUser, { fingerprintId: selectedFingerprint.fingerprintId }),
                {
                    loading: 'Asignando huella...',
                    success: 'Huella asignada correctamente',
                    error: 'Error al asignar huella',
                }
            );

            setShowAssignModal(false);
            setSelectedFingerprint(null);
            setSelectedUser(null);
            setUserSearch('');
            await loadData();
        } catch (error) {
            console.error('Error assigning fingerprint:', error);
        }
    };

    // Filter users without fingerprints and by search term
    const availableUsers = users
        .filter(u => !u.hasFingerprint)
        .filter(u => {
            if (!userSearch) return true;
            const search = userSearch.toLowerCase();
            return (
                u.fullName.toLowerCase().includes(search) ||
                u.numeroDocumento.includes(search)
            );
        });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
                        Gestión de Huellas Dactilares
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Administra las huellas enrolladas y asígnalas a usuarios
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={loadData}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                        title="Refrescar datos"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setShowEmptyConfirm(true)}
                        disabled={isLoading || fingerprints.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash2 className="w-5 h-5" />
                        Vaciar Base de Datos
                    </button>
                </div>
            </div> 

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-4">
                    <div className="text-green-400 text-sm font-medium">Total Huellas</div>
                    <div className="text-3xl font-bold text-green-500 mt-1">{fingerprints.length}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="text-blue-400 text-sm font-medium">Asignadas</div>
                    <div className="text-3xl font-bold text-blue-500 mt-1">
                        {fingerprints.filter(fp => fp.user).length}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-4">
                    <div className="text-orange-400 text-sm font-medium">Sin Asignar</div>
                    <div className="text-3xl font-bold text-orange-500 mt-1">
                        {fingerprints.filter(fp => !fp.user).length}
                    </div>
                </div>
            </div>

            {/* Fingerprints List */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    <p className="text-muted-foreground mt-4">Cargando huellas...</p>
                </div>
            ) : fingerprints.length === 0 ? (
                <div className="text-center py-12 bg-card border border-border rounded-lg">
                    <Fingerprint className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-medium text-muted-foreground">
                        No hay huellas enrolladas
                    </p>
                    <p className="text-muted-foreground mt-2">
                        Las huellas se enrollan al crear usuarios en la sección "Usuarios"
                    </p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">ID Huella</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Usuario Asignado</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Fecha Enrollment</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Estado</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {fingerprints.map((fp) => (
                                    <tr key={fp.fingerprintId} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                                    <Fingerprint className="w-5 h-5 text-green-400" />
                                                </div>
                                                <span className="font-mono font-semibold">{fp.fingerprintId}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {fp.user ? (
                                                <div>
                                                    <div className="font-medium">{fp.user.fullName}</div>
                                                    <div className="text-sm text-muted-foreground">{fp.user.numeroDocumento}</div>
                                                </div>
                                            ) : (
                                                <span className="text-orange-500 italic font-medium">Sin asignar</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {new Date(fp.enrolledAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {fp.user ? (
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                    Asignada
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                                                    Disponible
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {!fp.user && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedFingerprint(fp);
                                                            setShowAssignModal(true);
                                                        }}
                                                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                        title="Asignar a usuario"
                                                    >
                                                        <UserPlus className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setSelectedFingerprint(fp);
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

            {/* Assign to User Modal */}
            {showAssignModal && selectedFingerprint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-green-500/10 to-teal-500/10">
                            <h3 className="text-xl font-bold">Asignar Huella a Usuario</h3>
                            <button onClick={() => { setShowAssignModal(false); setSelectedFingerprint(null); setSelectedUser(null); setUserSearch(''); }}>
                                <Fingerprint className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Buscar Usuario</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        placeholder="Nombre o documento..."
                                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {availableUsers.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-4">
                                        {userSearch ? 'No se encontraron usuarios' : 'No hay usuarios sin huella'}
                                    </p>
                                ) : (
                                    availableUsers.map(user => (
                                        <button
                                            key={user.id}
                                            onClick={() => setSelectedUser(user.id)}
                                            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${selectedUser === user.id
                                                ? 'border-green-500 bg-green-500/10'
                                                : 'border-border hover:border-green-500/50 hover:bg-muted/50'
                                                }`}
                                        >
                                            <div className="font-medium">{user.fullName}</div>
                                            <div className="text-sm text-muted-foreground">{user.numeroDocumento} - {user.cargo || 'Sin cargo'}</div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-6 border-t border-border">
                            <button
                                onClick={() => { setShowAssignModal(false); setSelectedFingerprint(null); setSelectedUser(null); setUserSearch(''); }}
                                className="px-4 py-2 border border-border rounded-lg hover:bg-muted"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAssignToUser}
                                disabled={!selectedUser}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Asignar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <ConfirmDialog
                isOpen={showEmptyConfirm}
                title="¿Vaciar Base de Datos del Sensor?"
                message="Esta acción eliminará TODAS las huellas registradas del sensor físico. Las asignaciones en la base de datos se mantendrán pero las huellas deberán ser re-enrolladas. Esta operación no se puede deshacer."
                confirmText="Sí, Vaciar Sensor"
                cancelText="Cancelar"
                onConfirm={handleEmptyDatabase}
                onCancel={() => setShowEmptyConfirm(false)}
            />

            {selectedFingerprint && (
                <ConfirmDialog
                    isOpen={showDeleteConfirm}
                    title="¿Eliminar Huella?"
                    message={
                        selectedFingerprint.user 
                            ? `⚠️ ADVERTENCIA: Esta huella está asignada a ${selectedFingerprint.user.fullName}.\n\nAl eliminar esta huella, el usuario también será DESACTIVADO automáticamente.\n\n¿Estás seguro de que deseas continuar?`
                            : `¿Estás seguro de que deseas eliminar la huella ID ${selectedFingerprint.fingerprintId}? Esta acción no se puede deshacer.`
                    }
                    confirmText="Sí, Eliminar"
                    cancelText="Cancelar"
                    onConfirm={handleDelete}
                    onCancel={() => {
                        setShowDeleteConfirm(false);
                        setSelectedFingerprint(null);
                    }}
                />
            )}
        </div>
    );
}
