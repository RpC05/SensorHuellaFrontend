'use client';

import { useState } from 'react';
import { X, Fingerprint, Check, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import type { FingerPrintRequestDTO } from '@/lib/types';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (userData: any) => void;
}

type Step = 'form' | 'capturing' | 'success' | 'error';

export function EnrollmentModal({ isOpen, onClose, onEnroll }: EnrollmentModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState({
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    fechaNacimiento: '',
    description: '',
  });
  const [captureMessages, setCaptureMessages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (!formData.nombres || !formData.apellidoPaterno || !formData.numeroDocumento) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    setIsLoading(true);
    setStep('capturing');
    setCaptureMessages(['Iniciando captura...']);
    setError('');

    try {
      const requestData: FingerPrintRequestDTO = {
        nombres: formData.nombres,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno || undefined,
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento,
        fechaNacimiento: formData.fechaNacimiento || undefined,
        description: formData.description || undefined,
      };

      const result = await api.enrollFingerprint(requestData);

      if (result.status === 'SUCCESS') {
        setCaptureMessages(result.messages);
        setStep('success');
        setTimeout(() => {
          handleComplete();
        }, 2000);
      } else {
        setCaptureMessages(result.messages);
        setError(result.error || 'Error en el proceso de enrolamiento');
        setStep('error');
      }
    } catch (err: any) {
      setError(err.message || 'Error de comunicación con el servidor');
      setCaptureMessages(['Error al conectar con el sensor']);
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setStep('form');
    setError('');
    setCaptureMessages([]);
  };

  const handleComplete = () => {
    onEnroll(formData);
    setStep('form');
    setFormData({
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      tipoDocumento: 'DNI',
      numeroDocumento: '',
      fechaNacimiento: '',
      description: '',
    });
    setCaptureMessages([]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            {step === 'form' && 'Enrolar Nuevo Usuario'}
            {step === 'capturing' && '2. Capturando Huella...'}
            {step === 'success' && '✓ ¡Éxito!'}
            {step === 'error' && 'Error de Captura'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'form' && (
            <div className="space-y-4">
              <input
                type="text"
                name="nombres"
                placeholder="Nombres"
                value={formData.nombres}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                name="apellidoPaterno"
                placeholder="Apellido Paterno"
                value={formData.apellidoPaterno}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                name="apellidoMaterno"
                placeholder="Apellido Materno"
                value={formData.apellidoMaterno}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>DNI</option>
                <option>Pasaporte</option>
                <option>CE</option>
              </select>
              <input
                type="text"
                name="numeroDocumento"
                placeholder="Número de Documento"
                value={formData.numeroDocumento}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                name="description"
                placeholder="Descripción (opcional)"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary h-20"
              />
            </div>
          )}

          {step === 'capturing' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <div className="pulse-ring w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                <Fingerprint className="w-12 h-12 text-primary animate-pulse" />
              </div>
              <p className="text-xl font-semibold text-foreground">Por favor, coloque el dedo en el sensor.</p>
              <div className="text-sm text-muted-foreground min-h-20 max-h-40 overflow-y-auto w-full">
                {captureMessages.map((msg, idx) => (
                  <p key={idx} className="mb-1">{msg}</p>
                ))}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-accent" />
              </div>
              <p className="text-lg font-semibold text-foreground text-center">
                ¡Huella enrolada con éxito!
              </p>
              <p className="text-sm text-muted-foreground text-center">
                El usuario ha sido registrado correctamente en el sistema.
              </p>
            </div>
          )}

          {step === 'error' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <p className="text-lg font-semibold text-foreground text-center">
                No se pudo enrolar la huella.
              </p>
              <p className="text-sm text-muted-foreground text-center">
                {error || 'Ha ocurrido un error en el proceso de captura.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border justify-end">
          {step === 'form' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Siguiente: Capturar Huella
              </button>
            </>
          )}

          {step === 'success' && (
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Finalizar
            </button>
          )}

          {step === 'error' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Reintentar Captura
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
