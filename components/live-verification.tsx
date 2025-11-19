'use client';

import { useState } from 'react';
import { Fingerprint, Check, X } from 'lucide-react';
import { api } from '@/lib/api';

type VerificationState = 'idle' | 'scanning' | 'success' | 'failed';

interface VerificationResult {
  name: string;
  document: string;
  confidence?: number;
}

export function LiveVerification() {
  const [state, setState] = useState<VerificationState>('idle');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleStartVerification = async () => {
    setState('scanning');
    setErrorMessage('');
    setResult(null);

    try {
      const response = await api.verifyFingerprint();

      if (response.found) {
        const fullName = [
          response.nombres,
          response.apellidoPaterno,
          response.apellidoMaterno,
        ]
          .filter(Boolean)
          .join(' ');

        setResult({
          name: fullName,
          document: `ID: ${response.fingerprintId}`,
          confidence: response.confidence,
        });
        setState('success');
      } else {
        setErrorMessage(response.message || 'Huella no encontrada en la base de datos.');
        setState('failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al verificar huella');
      setState('failed');
    }
  };

  const handleReset = () => {
    setState('idle');
    setResult(null);
    setErrorMessage('');
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Left Column - Action */}
      <div className="flex flex-col items-center justify-center space-y-6 bg-card rounded-lg border border-border p-8">
        <button
          onClick={handleStartVerification}
          disabled={state !== 'idle'}
          className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Iniciar Verificación
        </button>

        {state === 'scanning' && (
          <div className="pulse-ring w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
            <Fingerprint className="w-16 h-16 text-primary" />
          </div>
        )}

        {state === 'idle' && (
          <Fingerprint className="w-16 h-16 text-muted-foreground/50" />
        )}

        {state === 'success' && (
          <div className="w-32 h-32 rounded-full bg-accent/20 flex items-center justify-center">
            <Fingerprint className="w-16 h-16 text-accent" />
          </div>
        )}

        {state === 'failed' && (
          <div className="w-32 h-32 rounded-full bg-destructive/20 flex items-center justify-center">
            <Fingerprint className="w-16 h-16 text-destructive" />
          </div>
        )}

        <p className="text-center text-muted-foreground">
          Presione el botón e indique al usuario que coloque su dedo.
        </p>
      </div>

      {/* Right Column - Result */}
      <div className="flex items-center justify-center">
        {state === 'idle' && (
          <div className="text-center space-y-2">
            <p className="text-lg text-muted-foreground">Esperando verificación...</p>
          </div>
        )}

        {state === 'scanning' && (
          <div className="text-center space-y-2">
            <p className="text-lg text-muted-foreground">Escaneando huella...</p>
          </div>
        )}

        {state === 'success' && result && (
          <div className="w-full max-w-sm space-y-4">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-accent" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-foreground">{result.name}</h3>
                <p className="text-sm text-muted-foreground">Documento: {result.document}</p>
                {result.confidence !== undefined && (
                  <p className="text-xs text-muted-foreground">Confianza: {result.confidence}</p>
                )}
              </div>
              <div className="bg-accent/20 text-accent py-3 rounded-lg text-center font-semibold text-lg">
                Acceso Concedido
              </div>
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Nueva Verificación
              </button>
            </div>
          </div>
        )}

        {state === 'failed' && (
          <div className="w-full max-w-sm space-y-4">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                  <X className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold text-destructive">Acceso Denegado</h3>
                <p className="text-sm text-muted-foreground">
                  {errorMessage || 'Huella no encontrada en la base de datos.'}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Intentar de Nuevo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
