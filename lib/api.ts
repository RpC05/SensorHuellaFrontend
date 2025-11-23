import { getApiUrl } from './config';
import type {
  UserRequestDTO,
  UserResponseDTO,
  AssignFingerPrintDTO,
  AssignRfidCardDTO,
  FingerPrintRequestDTO,
  FingerPrintResponseDTO,
  EnrollProgressDTO,
  FingerPrintVerifyResponseDTO,
  RfidCardResponseDTO,
  AccessRegisterRequestDTO,
  AccessRegisterResponseDTO,
  AccessLogResponseDTO,
  ApiError,
} from './types';

const API_URL = getApiUrl();

class ApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = response.statusText;

      try {
        const error: ApiError = await response.json();
        errorMessage = error.error || error.errors
          ? JSON.stringify(error.errors)
          : response.statusText;
      } catch {
        // Si no puede parsear JSON, usa statusText
      }

      throw new Error(`${response.status}: ${errorMessage}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // ============================================
  // USER ENDPOINTS
  // ============================================

  async createUser(data: UserRequestDTO): Promise<UserResponseDTO> {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<UserResponseDTO>(response);
  }

  async getAllUsers(): Promise<UserResponseDTO[]> {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<UserResponseDTO[]>(response);
  }

  async getUserById(id: number): Promise<UserResponseDTO> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<UserResponseDTO>(response);
  }

  async updateUser(id: number, data: UserRequestDTO): Promise<UserResponseDTO> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<UserResponseDTO>(response);
  }

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<void>(response);
  }

  async assignFingerPrintToUser(userId: number, data: AssignFingerPrintDTO): Promise<UserResponseDTO> {
    const response = await fetch(`${API_URL}/users/${userId}/fingerprint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<UserResponseDTO>(response);
  }

  async assignRfidCardToUser(userId: number, data: AssignRfidCardDTO): Promise<UserResponseDTO> {
    const response = await fetch(`${API_URL}/users/${userId}/rfid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<UserResponseDTO>(response);
  }

  // ============================================
  // FINGERPRINT ENDPOINTS
  // ============================================

  async getAllFingerprints(): Promise<FingerPrintResponseDTO[]> {
    const response = await fetch(`${API_URL}/fingerprints`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<FingerPrintResponseDTO[]>(response);
  }

  async getFingerprintById(id: number): Promise<FingerPrintResponseDTO> {
    const response = await fetch(`${API_URL}/fingerprints/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<FingerPrintResponseDTO>(response);
  }

  async enrollFingerprint(data?: FingerPrintRequestDTO): Promise<EnrollProgressDTO> {
    const response = await fetch(`${API_URL}/fingerprints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data || {}),
    });
    return this.handleResponse<EnrollProgressDTO>(response);
  }

  async deleteFingerprint(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/fingerprints/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<void>(response);
  }

  async verifyFingerprint(): Promise<FingerPrintVerifyResponseDTO> {
    const response = await fetch(`${API_URL}/fingerprints/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<FingerPrintVerifyResponseDTO>(response);
  }

  async getFingerprintCount(): Promise<number> {
    const response = await fetch(`${API_URL}/fingerprints/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<number>(response);
  }

  async emptyFingerprintDatabase(): Promise<void> {
    const response = await fetch(`${API_URL}/fingerprints/empty`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<void>(response);
  }

  // ============================================
  // RFID CARD ENDPOINTS
  // ============================================

  async registerRfidCard(): Promise<RfidCardResponseDTO> {
    const response = await fetch(`${API_URL}/access/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<RfidCardResponseDTO>(response);
  }

  async getAllRfidCards(): Promise<RfidCardResponseDTO[]> {
    const response = await fetch(`${API_URL}/access/cards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<RfidCardResponseDTO[]>(response);
  }

  async getRfidCardByUid(cardUid: string): Promise<RfidCardResponseDTO> {
    const response = await fetch(`${API_URL}/access/cards/uid/${cardUid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<RfidCardResponseDTO>(response);
  }

  async deleteRfidCard(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/access/cards/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<void>(response);
  }

  async toggleCardAuthorization(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/access/cards/${id}/toggle-auth`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<void>(response);
  }

  // ============================================
  // ACCESS LOG ENDPOINTS
  // ============================================

  async registerAccess(data: AccessRegisterRequestDTO): Promise<AccessRegisterResponseDTO> {
    const response = await fetch(`${API_URL}/access/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<AccessRegisterResponseDTO>(response);
  }

  async getAccessLogs(start?: string, end?: string): Promise<AccessLogResponseDTO[]> {
    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);

    const url = `${API_URL}/access/logs${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<AccessLogResponseDTO[]>(response);
  }

  async getTodayAccesses(): Promise<AccessLogResponseDTO[]> {
    const response = await fetch(`${API_URL}/access/logs/today`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<AccessLogResponseDTO[]>(response);
  }

  async getAccessLogsByCard(cardUid: string): Promise<AccessLogResponseDTO[]> {
    const response = await fetch(`${API_URL}/access/logs/card/${cardUid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<AccessLogResponseDTO[]>(response);
  }

  // ============================================
  // LEGACY/COMPATIBILITY
  // ============================================

  async healthCheck(): Promise<string> {
    const response = await fetch(`${API_URL}/fingerprints/health`, {
      method: 'GET',
    });
    return response.text();
  }
}

export const api = new ApiService();

