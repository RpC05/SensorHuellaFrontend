'use client';

import { useState } from 'react';
import { X, Calendar, FileText, Briefcase, Building2, Fingerprint, ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import type { UserRequestDTO } from '@/lib/types';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export function CreateUserModal({ isOpen, onClose, onCreated }: CreateUserModalProps) {
    const [step, setStep] = useState<1 | 2>(1); // 1: User Data, 2: Fingerprint Enrollment
    const [formData, setFormData] = useState<UserRequestDTO>({
        nombres: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        fechaNacimiento: '',
        tipoDocumento: 'DNI',
        numeroDocumento: '',
        cargo: '',
        areaDepartamento: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [enrolledFingerprintId, setEnrolledFingerprintId] = useState<number | null>(null);
    const [enrollmentMessages, setEnrollmentMessages] = useState<string[]>([]);
    const [enrollmentError, setEnrollmentError] = useState<string>('');

    if (!isOpen) return null;

    const handleNextStep = () => {
        if (!formData.nombres || !formData.apellidoPaterno || !formData.numeroDocumento) {
            toast.error('Campos requeridos', {
                description: 'Por favor completa todos los campos obligatorios'
            });
            return;
        }
        setStep(2);
    };

    const handleEnrollFingerprint = async () => {
        setIsEnrolling(true);
        setEnrollmentMessages(['Iniciando captura de huella...']);
        setEnrollmentError('');

        try {
            const result = await api.enrollFingerprint();

            // Mostrar los mensajes del proceso
            if (result.messages && result.messages.length > 0) {
                setEnrollmentMessages(result.messages);
            }

            if (result.status === 'SUCCESS' && result.fingerprint) {
                setEnrolledFingerprintId(result.fingerprint.fingerprintId);
                setEnrollmentMessages(prev => [...prev, '✓ Huella enrollada exitosamente']);
                toast.success('Huella enrollada correctamente');
            } else {
                setEnrollmentError(result.error || 'Error al enrollar huella');
                setEnrollmentMessages(prev => [...prev, `❌ ${result.error || 'Error'}`]);
                toast.error('Error al enrollar huella');
            }
        } catch (error: any) {
            setEnrollmentError(error.message || 'Error de comunicación');
            setEnrollmentMessages(prev => [...prev, `❌ ${error.message}`]);
            toast.error('Error al enrollar huella', { description: error.message });
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleSubmit = async () => {
        if (!enrolledFingerprintId) {
            toast.error('Enrolla una huella', { description: 'Debes enrollar una huella antes de continuar' });
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Crear usuario primero
            const createdUser = await api.createUser(formData);

            if (!createdUser || !createdUser.id) {
                throw new Error('Error al crear usuario: no se recibió ID');
            }

            // 2. Asignar la huella enrollada al usuario recién creado
            await api.assignFingerPrintToUser(createdUser.id, {
                fingerprintId: enrolledFingerprintId
            });

            toast.success(`Usuario ${createdUser.fullName} creado con huella asignada`);

            // Reset form
            setFormData({
                nombres: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                fechaNacimiento: '',
                tipoDocumento: 'DNI',
                numeroDocumento: '',
                cargo: '',
                areaDepartamento: '',
            });
            setStep(1);
            setEnrolledFingerprintId(null);
            setEnrollmentMessages([]);
            setEnrollmentError('');

            onCreated();
        } catch (error: any) {
            console.error('Error creating user:', error);
            toast.error('Error al crear usuario', { description: error.message || 'Error desconocido' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting && !isEnrolling) {
            setStep(1);
            setEnrolledFingerprintId(null);
            setEnrollmentMessages([]);
            setEnrollmentError('');
            setFormData({
                nombres: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                fechaNacimiento: '',
                tipoDocumento: 'DNI',
                numeroDocumento: '',
                cargo: '',
                areaDepartamento: '',
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            {step === 1 ? 'Crear Nuevo Usuario' : 'Enrollar Huella Dactilar'}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {step === 1 ? 'Paso 1 de 2: Información del usuario' : 'Paso 2 de 2: Registro de huella dactilar'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting || isEnrolling}
                        className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Indicator */}
                <div className="px-6 pt-4">
                    <div className="flex items-center gap-2">
                        <div className={`flex-1 h-2 rounded-full transition-all ${step >= 1 ? 'bg-blue-500' : 'bg-muted'}`}></div>
                        <div className={`flex-1 h-2 rounded-full transition-all ${step >= 2 ? 'bg-blue-500' : 'bg-muted'}`}></div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {step === 1 ? (
                        /* Step 1: User Data Form */
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Nombres <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombres}
                                    onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Juan Carlos"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Apellido Paterno <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.apellidoPaterno}
                                        onChange={(e) => setFormData({ ...formData, apellidoPaterno: e.target.value })}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="García"
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
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="López"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Fecha de Nacimiento
                                </label>
                                <input
                                    type="date"
                                    value={formData.fechaNacimiento}
                                    onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Tipo
                                    </label>
                                    <select
                                        value={formData.tipoDocumento}
                                        onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value })}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    >
                                        <option value="DNI">DNI</option>
                                        <option value="CE">CE</option>
                                        <option value="Pasaporte">Pasaporte</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">
                                        Número de Documento <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.numeroDocumento}
                                        onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                                        placeholder="12345678"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    Cargo
                                </label>
                                <input
                                    type="text"
                                    value={formData.cargo}
                                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Gerente de Ventas"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Área/Departamento
                                </label>
                                <input
                                    type="text"
                                    value={formData.areaDepartamento}
                                    onChange={(e) => setFormData({ ...formData, areaDepartamento: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Ventas"
                                />
                            </div>
                        </div>
                    ) : (
                        /* Step 2: Fingerprint Enrollment */
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${enrolledFingerprintId
                                        ? 'bg-green-500/20'
                                        : enrollmentError
                                            ? 'bg-red-500/20'
                                            : 'bg-blue-500/20'
                                    }`}>
                                    {enrolledFingerprintId ? (
                                        <Check className="w-12 h-12 text-green-400" />
                                    ) : enrollmentError ? (
                                        <AlertCircle className="w-12 h-12 text-red-400" />
                                    ) : (
                                        <Fingerprint className={`w-12 h-12 text-blue-400 ${isEnrolling ? 'animate-pulse' : ''}`} />
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {enrolledFingerprintId
                                        ? '✓ Huella Enrollada Correctamente'
                                        : enrollmentError
                                            ? '❌ Error al Enrollar'
                                            : 'Registra la Huella Dactilar'}
                                </h3>
                                <p className="text-muted-foreground">
                                    {enrolledFingerprintId
                                        ? `Huella ID: ${enrolledFingerprintId} - Lista para asignar al usuario`
                                        : enrollmentError
                                            ? enrollmentError
                                            : 'Sigue las instrucciones del sensor'}
                                </p>
                            </div>

                            {/* Enrollment Messages */}
                            {enrollmentMessages.length > 0 && (
                                <div className="bg-muted/30 border border-border rounded-lg p-4 max-h-48 overflow-y-auto">
                                    <div className="space-y-1 text-sm">
                                        {enrollmentMessages.map((msg, idx) => (
                                            <div key={idx} className="flex items-start gap-2">
                                                <span className="text-blue-400">•</span>
                                                <span>{msg}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!enrolledFingerprintId && !enrollmentError && (
                                <button
                                    onClick={handleEnrollFingerprint}
                                    disabled={isEnrolling}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    <Fingerprint className="w-5 h-5" />
                                    {isEnrolling ? 'Enrollando... Sigue las instrucciones' : 'Iniciar Enrollment de Huella'}
                                </button>
                            )}

                            {enrollmentError && (
                                <button
                                    onClick={handleEnrollFingerprint}
                                    disabled={isEnrolling}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    <Fingerprint className="w-5 h-5" />
                                    Reintentar Enrollment
                                </button>
                            )}

                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    <strong className="text-foreground">Instrucciones:</strong>
                                    <br />
                                    1. Presiona "Iniciar Enrollment"
                                    <br />
                                    2. <strong>Coloca</strong> el dedo en el sensor
                                    <br />
                                    3. <strong>Retira</strong> el dedo cuando se indique
                                    <br />
                                    4. <strong>Vuelve a colocar</strong> el dedo
                                    <br />
                                    5. La huella se asignará automáticamente al usuario
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between gap-3 p-6 border-t border-border bg-muted/30">
                    {step === 1 ? (
                        <>
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleNextStep}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                Siguiente: Enrollar Huella
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setEnrolledFingerprintId(null);
                                    setEnrollmentMessages([]);
                                    setEnrollmentError('');
                                }}
                                disabled={isSubmitting || isEnrolling}
                                className="flex items-center gap-2 px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Atrás
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!enrolledFingerprintId || isSubmitting || isEnrolling}
                                className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {isSubmitting ? 'Creando Usuario...' : 'Guardar Usuario con Huella'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
