/**
 * Encryption Hook
 * Mulika Ufisadi - Corruption Reporting Platform
 */

import { useCallback, useState } from 'react';
import {
  encryptReport,
  decryptReport,
  encryptData,
  decryptData,
  generateHash,
  verifyHash,
  generateAnonymousId,
  generateReportToken,
  generateEncryptionKey,
  encryptContactMethod,
  decryptContactMethod,
  hashContactMethod,
} from '../lib/encryption';
import type { Report } from '../types/report';

interface EncryptionState {
  error: string | null;
  loading: boolean;
}

interface UseEncryptionReturn {
  // State
  error: string | null;
  loading: boolean;

  // Report encryption
  encryptReport: (report: Report) => Promise<string | null>;
  decryptReport: (encrypted: string) => Promise<Report | null>;

  // Generic data encryption
  encryptData: (data: string | object) => Promise<string | null>;
  decryptData: (encrypted: string) => Promise<string | null>;

  // Hashing
  generateHash: (data: string) => string;
  verifyHash: (data: string, hash: string) => boolean;

  // ID and token generation
  generateAnonymousId: () => string;
  generateReportToken: () => string;
  generateEncryptionKey: () => string;

  // Contact method encryption
  encryptContactMethod: (value: string) => Promise<string | null>;
  decryptContactMethod: (encrypted: string) => Promise<string | null>;
  hashContactMethod: (value: string, salt?: string) => string;

  // Utilities
  clearError: () => void;
}

/**
 * Custom hook for encryption operations with error handling
 * @returns Encryption methods and state
 */
export function useEncryption(): UseEncryptionReturn {
  const [state, setState] = useState<EncryptionState>({
    error: null,
    loading: false,
  });

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Wrap async encryption operations with error handling
  const handleEncryptReport = useCallback(async (report: Report): Promise<string | null> => {
    setState({ error: null, loading: true });
    try {
      const encrypted = encryptReport(report);
      setState({ error: null, loading: false });
      return encrypted;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to encrypt report';
      setState({ error: errorMessage, loading: false });
      return null;
    }
  }, []);

  const handleDecryptReport = useCallback(async (encrypted: string): Promise<Report | null> => {
    setState({ error: null, loading: true });
    try {
      const decrypted = decryptReport(encrypted);
      setState({ error: null, loading: false });
      return decrypted;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to decrypt report';
      setState({ error: errorMessage, loading: false });
      return null;
    }
  }, []);

  const handleEncryptData = useCallback(async (data: string | object): Promise<string | null> => {
    setState({ error: null, loading: true });
    try {
      const encrypted = encryptData(data);
      setState({ error: null, loading: false });
      return encrypted;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to encrypt data';
      setState({ error: errorMessage, loading: false });
      return null;
    }
  }, []);

  const handleDecryptData = useCallback(async (encrypted: string): Promise<string | null> => {
    setState({ error: null, loading: true });
    try {
      const decrypted = decryptData(encrypted);
      setState({ error: null, loading: false });
      return decrypted;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to decrypt data';
      setState({ error: errorMessage, loading: false });
      return null;
    }
  }, []);

  const handleEncryptContactMethod = useCallback(async (value: string): Promise<string | null> => {
    setState({ error: null, loading: true });
    try {
      const encrypted = encryptContactMethod(value);
      setState({ error: null, loading: false });
      return encrypted;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to encrypt contact method';
      setState({ error: errorMessage, loading: false });
      return null;
    }
  }, []);

  const handleDecryptContactMethod = useCallback(async (encrypted: string): Promise<string | null> => {
    setState({ error: null, loading: true });
    try {
      const decrypted = decryptContactMethod(encrypted);
      setState({ error: null, loading: false });
      return decrypted;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to decrypt contact method';
      setState({ error: errorMessage, loading: false });
      return null;
    }
  }, []);

  return {
    // State
    error: state.error,
    loading: state.loading,

    // Report encryption
    encryptReport: handleEncryptReport,
    decryptReport: handleDecryptReport,

    // Generic data encryption
    encryptData: handleEncryptData,
    decryptData: handleDecryptData,

    // Hashing (synchronous, no error handling needed)
    generateHash,
    verifyHash,

    // ID and token generation (synchronous)
    generateAnonymousId,
    generateReportToken,
    generateEncryptionKey,

    // Contact method encryption
    encryptContactMethod: handleEncryptContactMethod,
    decryptContactMethod: handleDecryptContactMethod,
    hashContactMethod,

    // Utilities
    clearError,
  };
}
