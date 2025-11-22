'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '../api';
import type { PersonalInfo, KycSubmission } from '@spectra/shared';

export function useKyc(stellarAccount: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<KycSubmission | null>(null);

  const submitKyc = useCallback(
    async (kycData: PersonalInfo, files: { document: string; selfie: string }) => {
      if (!stellarAccount) {
        throw new Error('No wallet connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.submitKyc(stellarAccount, kycData, files);

        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.error || 'Failed to submit KYC');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to submit KYC';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [stellarAccount]
  );

  const checkStatus = useCallback(async () => {
    if (!stellarAccount) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getKycStatus(stellarAccount);

      if (response.success && response.data) {
        setKycStatus(response.data as KycSubmission);
        return response.data;
      }

      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to check status';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [stellarAccount]);

  const getCredentials = useCallback(async () => {
    if (!stellarAccount) {
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getUserCredentials(stellarAccount);

      if (response.success && response.data) {
        return response.data.credentials;
      }

      return [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get credentials';
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [stellarAccount]);

  return {
    isLoading,
    error,
    kycStatus,
    submitKyc,
    checkStatus,
    getCredentials,
  };
}
