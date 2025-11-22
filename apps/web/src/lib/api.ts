import type { ApiResponse, KycSubmission, Credential, PersonalInfo } from '@spectra/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // KYC Endpoints
  async submitKyc(stellarAccount: string, kycData: PersonalInfo, files: {
    document: string;
    selfie: string;
  }) {
    return this.request<{ submissionId: string; status: string }>('/kyc/submit', {
      method: 'POST',
      body: JSON.stringify({ stellarAccount, kycData, files }),
    });
  }

  async getKycStatus(stellarAccount: string) {
    return this.request<KycSubmission>(`/kyc/status/${stellarAccount}`);
  }

  async getUserCredentials(stellarAccount: string) {
    return this.request<{ credentials: Credential[] }>(`/kyc/credentials/${stellarAccount}`);
  }

  async verifyCredentials(stellarAccount: string, anchorId: string) {
    return this.request<{ verified: boolean; credentials: Credential[] }>('/kyc/verify', {
      method: 'POST',
      body: JSON.stringify({ stellarAccount, anchorId }),
    });
  }

  // Anchor Endpoints
  async getAnchors() {
    return this.request<{ anchors: any[] }>('/anchor');
  }

  async getAnchor(id: string) {
    return this.request<{ anchor: any }>(`/anchor/${id}`);
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiClient = new ApiClient(API_URL);
