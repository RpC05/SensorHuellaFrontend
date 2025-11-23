// ============================================
// USER DTOs
// ============================================

export interface UserRequestDTO {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  fechaNacimiento?: string; // ISO date string (YYYY-MM-DD)
  tipoDocumento: string; // DNI, CE, Pasaporte
  numeroDocumento: string;
  cargo?: string;
  areaDepartamento?: string;
}

export interface UserResponseDTO {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  fullName: string;
  fechaNacimiento?: string; // ISO date string
  tipoDocumento: string;
  numeroDocumento: string;
  cargo?: string;
  areaDepartamento?: string;
  active: boolean;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  // Assignment indicators
  hasFingerprint: boolean;
  hasRfidCard: boolean;
}

// ============================================
// FINGERPRINT DTOs
// ============================================

export interface FingerPrintRequestDTO {
  // Empty for now - enrollment doesn't require user data
}

export interface FingerPrintResponseDTO {
  fingerprintId: number;
  active: boolean;
  enrolledAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  // Associated user info (if assigned)
  user?: UserResponseDTO;
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
  message: string;
  // User info if fingerprint is assigned
  user?: UserResponseDTO;
}

export interface AssignFingerPrintDTO {
  fingerprintId: number;
}

// ============================================
// RFID CARD DTOs
// ============================================

export interface RfidCardResponseDTO {
  id: number;
  cardUid: string;
  active: boolean;
  authorized: boolean;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  // Associated user info (if assigned)
  user?: UserResponseDTO;
}

export interface AssignRfidCardDTO {
  cardUid: string;
}

// ============================================
// ACCESS CONTROL DTOs
// ============================================

export interface AccessRegisterRequestDTO {
  cardUid: string;
  location?: string;
  deviceId?: string;
}

export interface AccessRegisterResponseDTO {
  authorized: boolean;
  message: string;
  personName?: string;
  cargo?: string;
  accessTime: string;
}

export interface AccessLogResponseDTO {
  id: number;
  cardUid: string;
  cardId?: number;
  personName?: string;
  cargo?: string;
  accessType: string;
  authorized: boolean;
  accessTime: string; // ISO datetime string
  location?: string;
  deviceId?: string;
  notes?: string;
}

// ============================================
// COMMON / ERROR DTOs
// ============================================

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  errors?: Record<string, string>;
}

// ============================================
// UI-SPECIFIC TYPES
// ============================================

export type PageType = 'dashboard' | 'users' | 'fingerprints' | 'rfid-cards' | 'access-logs' | 'verification';

export interface DashboardStats {
  totalUsers: number;
  totalFingerprints: number;
  totalCards: number;
  todayAccess: number;
}
