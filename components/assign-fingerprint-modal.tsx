'use client';

import { useState, useEffect } from 'react';
import { X, Fingerprint, Plus, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import type { UserResponseDTO, FingerPrintResponseDTO, AssignFingerPrintDTO } from '@/lib/types';

interface AssignFingerprintModalProps {
    isOpen: boolean;
    user: UserResponseDTO;
    onClose: () => void;
    onAssigned: () => void;
}

export function AssignFingerprintModal({ isOpen, user, onClose, onAssigned }: AssignFingerprintModalProps) {
    const [fingerprints, setFingerprints] = useState<FingerPrintResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [selectedFingerprintId, setSelectedFingerprintId] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadFingerprints();
        }
    }, [isOpen]);

    const loadFingerprints = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAllFingerprints();
            // Filter only unassigned fingerprints
            const unassigned = data.filter(fp => !fp.user);
            setFingerprints(unassigned);
        } catch (error: any) {
            toast.error('Error al cargar huellas', { description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnrollNew = async () => {
        setIsEnrolling(true);
        try {
            const result = await api.enrollFingerprint();

            if (result.status === 'SUCCESS' && result.fingerprint) {
                toast.success('Huella enrollada exitosamente');
                // Auto-select the newly enrolled fingerprint
                setSelectedFingerprintId(result.fingerprint.fingerprintId);
                await loadFingerprints();
            } else {
                toast.error('Error al enrollar huella');
            }
        } catch (error: any) {
            toast.error('Error al enrollar huella', { description: error.message });
            console.error('Error enrolling fingerprint:', error);
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedFingerprintId) {
            toast.error('Selecciona una huella');
            return;
        }

        try {
            const assignData: AssignFingerPrintDTO = { fingerprintId: selectedFingerprintId };

            await toast.promise(
                api.assignFingerPrintToUser(user.id, assignData),
                {
                    loading: 'Asignando huella...',
                    success: `Huella asignada a ${user.fullName}`,
                    error: (err: any) => `Error: ${err.message}`,
                }
            );

            onAssigned();
        } catch (error) {
            console.error('Error assigning fingerprint:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-green-500/10 to-teal-500/10">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
                            Asignar Huella Dactilar
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Asignar huella a {user.fullName}
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
                    {/* Enroll New Button */}
                    <div className="mb-6">
                        <button
                            onClick={handleEnrollNew}
                            disabled={isEnrolling}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-5 h-5" />
                            {isEnrolling ? 'Enrollando huella...' : 'Enrollar Nueva Huella'}
                        </button>
                    </div>

                    {/* Available Fingerprints */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Huellas Disponibles</h3>

                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                                <p className="text-muted-foreground mt-2">Cargando...</p>
                            </div>
                        ) : fingerprints.length === 0 ? (
                            <div className="text-center py-8 bg-muted/30 rounded-lg border border-border">
                                <Fingerprint className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <p className="text-muted-foreground">
                                    No hay huellas sin asignar
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Enrolla una nueva huella para continuar
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {fingerprints.map((fp) => (
                                    <button
                                        key={fp.fingerprintId}
                                        onClick={() => setSelectedFingerprintId(fp.fingerprintId)}
                                        className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${selectedFingerprintId === fp.fingerprintId
                                                ? 'border-green-500 bg-green-500/10'
                                                : 'border-border hover:border-green-500/50 hover:bg-muted/50'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedFingerprintId === fp.fingerprintId
                                                ? 'bg-green-500 text-white'
                                                : 'bg-muted text-muted-foreground'
                                            }`}>
                                            <Fingerprint className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="font-medium">Huella ID: {fp.fingerprintId}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Enrollada: {new Date(fp.enrolledAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {selectedFingerprintId === fp.fingerprintId && (
                                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
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
                                <li>Enrolla una nueva huella o selecciona una existente</li>
                                <li>La huella quedará vinculada al usuario</li>
                                <li>Solo se muestran huellas sin asignar</li>
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
                        disabled={!selectedFingerprintId}
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        Asignar Huella
                    </button>
                </div>
            </div>
        </div>
    );
}
