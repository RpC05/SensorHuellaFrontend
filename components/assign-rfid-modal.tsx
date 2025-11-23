'use client';

import { useState, useEffect } from 'react';
import { X, CreditCard, Scan, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import type { UserResponseDTO, RfidCardResponseDTO, AssignRfidCardDTO } from '@/lib/types';

interface AssignRfidModalProps {
    isOpen: boolean;
    user: UserResponseDTO;
    onClose: () => void;
    onAssigned: () => void;
}

export function AssignRfidModal({ isOpen, user, onClose, onAssigned }: AssignRfidModalProps) {
    const [cards, setCards] = useState<RfidCardResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [selectedCardUid, setSelectedCardUid] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadCards();
        }
    }, [isOpen]);

    const loadCards = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAllRfidCards();
            // Filter only unassigned cards
            const unassigned = data.filter(card => !card.user);
            setCards(unassigned);
        } catch (error: any) {
            toast.error('Error al cargar tarjetas', { description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleScanNew = async () => {
        setIsScanning(true);
        try {
            const result = await api.registerRfidCard();
            toast.success('Tarjeta registrada exitosamente');
            // Auto-select the newly scanned card
            setSelectedCardUid(result.cardUid);
            await loadCards();
        } catch (error: any) {
            toast.error('Error al escanear tarjeta', { description: error.message });
            console.error('Error scanning card:', error);
        } finally {
            setIsScanning(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedCardUid) {
            toast.error('Selecciona una tarjeta');
            return;
        }

        try {
            const assignData: AssignRfidCardDTO = { cardUid: selectedCardUid };

            await toast.promise(
                api.assignRfidCardToUser(user.id, assignData),
                {
                    loading: 'Asignando tarjeta...',
                    success: `Tarjeta asignada a ${user.fullName}`,
                    error: (err: any) => `Error: ${err?.message || 'Error desconocido'}`,
                }
            );

            onAssigned();
        } catch (error) {
            console.error('Error assigning card:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                            Asignar Tarjeta RFID
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Asignar tarjeta a {user.fullName}
                        </p>
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
                    {/* Scan New Button */}
                    <div className="mb-6">
                        <button
                            onClick={handleScanNew}
                            disabled={isScanning}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            <Scan className={`w-5 h-5 ${isScanning ? 'animate-pulse' : ''}`} />
                            {isScanning ? 'Escaneando tarjeta...' : 'Escanear Nueva Tarjeta'}
                        </button>
                    </div>

                    {/* Available Cards */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Tarjetas Disponibles</h3>

                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                                <p className="text-muted-foreground mt-2">Cargando...</p>
                            </div>
                        ) : cards.length === 0 ? (
                            <div className="text-center py-8 bg-muted/30 rounded-lg border border-border">
                                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <p className="text-muted-foreground">
                                    No hay tarjetas sin asignar
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Escanea una nueva tarjeta para continuar
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {cards.map((card) => (
                                    <button
                                        key={card.id}
                                        onClick={() => setSelectedCardUid(card.cardUid)}
                                        className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${selectedCardUid === card.cardUid
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-border hover:border-purple-500/50 hover:bg-muted/50'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCardUid === card.cardUid
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-muted text-muted-foreground'
                                            }`}>
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="font-medium font-mono">{card.cardUid}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Registrada: {new Date(card.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {card.authorized && (
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                Autorizada
                                            </span>
                                        )}
                                        {selectedCardUid === card.cardUid && (
                                            <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Alert */}
                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium text-foreground mb-1">Instrucciones:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Escanea una nueva tarjeta o selecciona una existente</li>
                                <li>La tarjeta quedará vinculada al usuario</li>
                                <li>Solo se muestran tarjetas sin asignar</li>
                                <li>Las tarjetas deben ser autorizadas por separado</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted/30">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedCardUid}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        Asignar Tarjeta
                    </button>
                </div>
            </div>
        </div>
    );
}
