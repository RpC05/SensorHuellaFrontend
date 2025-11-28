'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Scan, Trash2, ToggleLeft, ToggleRight, Shield, ShieldOff, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import type { RfidCardResponseDTO } from '@/lib/types';
import { ConfirmDialog } from '../shared/confirm-dialog';

export function RfidCardsManagement() {
    const [cards, setCards] = useState<RfidCardResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [selectedCard, setSelectedCard] = useState<RfidCardResponseDTO | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAllRfidCards();
            setCards(data);
            // No mostramos toast aquí para evitar spam de notificaciones
        } catch (error: any) {
            toast.error('Error al cargar tarjetas', { description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleScanNew = async () => {
        setIsScanning(true);
        try {
            await toast.promise(
                api.registerRfidCard(),
                {
                    loading: 'Esperando tarjeta... Acerca la tarjeta al lector',
                    success: 'Tarjeta registrada exitosamente',
                    error: (err: any) => `Error: ${err.message}`,
                }
            );
            await loadCards();
        } catch (error) {
            console.error('Error scanning card:', error);
        } finally {
            setIsScanning(false);
        }
    };

    const handleToggleAuthorization = async (card: RfidCardResponseDTO) => {
        try {
            await toast.promise(
                api.toggleCardAuthorization(card.id),
                {
                    loading: 'Actualizando autorización...',
                    success: card.authorized ? 'Tarjeta desautorizada' : 'Tarjeta autorizada',
                    error: 'Error al actualizar autorización',
                }
            );
            await loadCards();
        } catch (error) {
            console.error('Error toggling authorization:', error);
        }
    };

    const handleToggleActiveState = async (card: RfidCardResponseDTO) => {
        try {
            await toast.promise(
                api.toggleCardActiveState(card.id),
                {
                    loading: 'Actualizando estado...',
                    success: card.active ? 'Tarjeta desactivada' : 'Tarjeta activada',
                    error: 'Error al actualizar estado',
                }
            );
            await loadCards();
        } catch (error) {
            console.error('Error toggling active state:', error);
        }
    };

    const handleDelete = async () => {
        if (!selectedCard) return;

        setShowDeleteConfirm(false);

        try {
            await toast.promise(
                api.deleteRfidCard(selectedCard.id),
                {
                    loading: 'Eliminando tarjeta...',
                    success: 'Tarjeta eliminada correctamente',
                    error: 'Error al eliminar tarjeta',
                }
            );
            setSelectedCard(null);
            await loadCards();
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        Gestión de Tarjetas RFID
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Administra las tarjetas de acceso RFID
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={loadCards}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                        title="Refrescar datos"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={handleScanNew}
                        disabled={isScanning}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Scan className={`w-5 h-5 ${isScanning ? 'animate-pulse' : ''}`} />
                        {isScanning ? 'Escaneando...' : 'Registrar Nueva Tarjeta'}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-4">
                    <div className="text-purple-400 text-sm font-medium">Total Tarjetas</div>
                    <div className="text-3xl font-bold text-purple-500 mt-1">{cards.length}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-4">
                    <div className="text-green-400 text-sm font-medium">Activas</div>
                    <div className="text-3xl font-bold text-green-500 mt-1">
                        {cards.filter(c => c.active).length}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="text-blue-400 text-sm font-medium">Autorizadas</div>
                    <div className="text-3xl font-bold text-blue-500 mt-1">
                        {cards.filter(c => c.authorized).length}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-lg p-4">
                    <div className="text-amber-400 text-sm font-medium">Asignadas</div>
                    <div className="text-3xl font-bold text-amber-500 mt-1">
                        {cards.filter(c => c.user).length}
                    </div>
                </div>
            </div>

            {/* Cards List */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    <p className="text-muted-foreground mt-4">Cargando tarjetas...</p>
                </div>
            ) : cards.length === 0 ? (
                <div className="text-center py-12 bg-card border border-border rounded-lg">
                    <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-medium text-muted-foreground">
                        No hay tarjetas registradas
                    </p>
                    <p className="text-muted-foreground mt-2">
                        Registra tu primera tarjeta para comenzar
                    </p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">UID Tarjeta</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Usuario Asignado</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Fecha Registro</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Estado</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Autorización</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {cards.map((card) => (
                                    <tr key={card.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                    <CreditCard className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <span className="font-mono font-semibold">{card.cardUid}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {card.user ? (
                                                <div>
                                                    <div className="font-medium">{card.user.fullName}</div>
                                                    <div className="text-sm text-muted-foreground">{card.user.cargo || '-'}</div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">Sin asignar</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {new Date(card.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleActiveState(card)}
                                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${card.active
                                                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                    : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                                                    }`}
                                            >
                                                {card.active ? (
                                                    <>
                                                        <ToggleRight className="w-4 h-4" />
                                                        <span className="text-xs font-medium">Activa</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ToggleLeft className="w-4 h-4" />
                                                        <span className="text-xs font-medium">Inactiva</span>
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleAuthorization(card)}
                                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${card.authorized
                                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                    }`}
                                            >
                                                {card.authorized ? (
                                                    <>
                                                        <Shield className="w-4 h-4" />
                                                        <span className="text-xs font-medium">Autorizada</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShieldOff className="w-4 h-4" />
                                                        <span className="text-xs font-medium">No Autorizada</span>
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCard(card);
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
            {selectedCard && (
                <ConfirmDialog
                    isOpen={showDeleteConfirm}
                    title="¿Eliminar Tarjeta?"
                    message={`¿Estás seguro de que deseas eliminar la tarjeta ${selectedCard.cardUid}${selectedCard.user ? ` de ${selectedCard.user.fullName}` : ''}? Esta acción no se puede deshacer.`}
                    confirmText="Sí, Eliminar"
                    cancelText="Cancelar"
                    onConfirm={handleDelete}
                    onCancel={() => {
                        setShowDeleteConfirm(false);
                        setSelectedCard(null);
                    }}
                />
            )}
        </div>
    );
}
