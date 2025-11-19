import { getApiUrl } from './config';
import type {
  FingerPrintRequestDTO,
  FingerPrintUpdateDTO,
  FingerPrintResponseDTO,
  EnrollProgressDTO,
  FingerPrintVerifyResponseDTO,
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

  async enrollFingerprint(data: FingerPrintRequestDTO): Promise<EnrollProgressDTO> {
    const response = await fetch(`${API_URL}/fingerprints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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

  async updateFingerprint(id: number, data: FingerPrintUpdateDTO): Promise<FingerPrintResponseDTO> {
    const response = await fetch(`${API_URL}/fingerprints/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<FingerPrintResponseDTO>(response);
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

  async getCount(): Promise<number> {
    const response = await fetch(`${API_URL}/fingerprints/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<number>(response);
  }

  async emptyDatabase(): Promise<void> {
    const response = await fetch(`${API_URL}/fingerprints/empty`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<void>(response);
  }

  async healthCheck(): Promise<string> {
    const response = await fetch(`${API_URL}/fingerprints/health`, {
      method: 'GET',
    });
    return response.text();
  }
}

export const api = new ApiService();
