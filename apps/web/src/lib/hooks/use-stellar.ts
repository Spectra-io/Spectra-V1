'use client';

import { useState, useEffect, useCallback } from 'react';
import { stellarService } from '../stellar';

export function useStellar() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved public key from session storage
  useEffect(() => {
    const savedKey = sessionStorage.getItem('stellarPublicKey');
    if (savedKey) {
      setPublicKey(savedKey);
    }
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const key = await stellarService.connectWallet();
      setPublicKey(key);
      sessionStorage.setItem('stellarPublicKey', key);
      return key;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect';
      setError(message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    sessionStorage.removeItem('stellarPublicKey');
  }, []);

  const signMessage = useCallback(
    async (message: string) => {
      if (!publicKey) {
        throw new Error('No wallet connected');
      }
      return stellarService.signMessage(message, publicKey);
    },
    [publicKey]
  );

  const loadAccount = useCallback(async () => {
    if (!publicKey) {
      throw new Error('No wallet connected');
    }
    return stellarService.loadAccount(publicKey);
  }, [publicKey]);

  return {
    publicKey,
    isConnected: !!publicKey,
    isConnecting,
    error,
    connect,
    disconnect,
    signMessage,
    loadAccount,
    service: stellarService,
  };
}
