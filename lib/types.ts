// DTOs matching backend Java models

export interface FingerPrintRequestDTO {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  fechaNacimiento?: string; // ISO date string
  tipoDocumento: string; // DNI, CE, Pasaporte
  numeroDocumento: string;
  description?: string;
}

export interface FingerPrintUpdateDTO {
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  fechaNacimiento?: string; // ISO date string
  tipoDocumento?: string;
  numeroDocumento?: string;
  description?: string;
}

export interface FingerPrintResponseDTO {
  id: number;
  fingerprintId: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  fechaNacimiento?: string; // ISO date string
  tipoDocumento: string;
  numeroDocumento: string;
  description?: string;
  enrolledAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  active: boolean;
}

export interface EnrollProgressDTO {
  status: 'PROCESSING' | 'SUCCESS' | 'ERROR';
  messages: string[];
  fingerprint?: FingerPrintResponseDTO;
  error?: string;
}

export interface FingerPrintVerifyResponseDTO {
  found: boolean;
  fingerprintId?: number;
  confidence?: number;
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  message: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  errors?: Record<string, string>;
}
