// Common types shared between frontend and backend

export type KycStatus = 'PENDING' | 'PROCESSING' | 'NEEDS_INFO' | 'APPROVED' | 'REJECTED';

export type DocumentType = 'passport' | 'driver_license' | 'national_id';

export interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  address: Address;
  documentType: DocumentType;
  documentNumber: string;
}

export interface KycSubmission {
  id: string;
  userId: string;
  status: KycStatus;
  documentType: DocumentType;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Credential {
  id: string;
  userId: string;
  type: string;
  claims: Record<string, any>;
  proof: Record<string, any>;
  issuedAt: string;
  expiresAt: string;
  revoked: boolean;
}

export interface VerificationResult {
  verified: boolean;
  credentials: Credential[];
}

export interface User {
  id: string;
  stellarAccount: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Anchor {
  id: string;
  name: string;
  domain: string;
  publicKey: string;
  requiredClaims: string[];
  isActive: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ZkProof {
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
    protocol: string;
  };
  publicSignals: string[];
  verified: boolean;
}
