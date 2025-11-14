/**
 * Encryption and Token Generation Utilities
 * Mulika Ufisadi - Corruption Reporting Platform
 */

import CryptoJS from 'crypto-js';
import type { Report } from '../types/report';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'mulika-ufisadi-2025';

/**
 * Encrypts a report object using AES encryption
 * @param report - The report object to encrypt
 * @returns Encrypted string
 */
export function encryptReport(report: Report): string {
  try {
    const jsonString = JSON.stringify(report);
    return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Error encrypting report:', error);
    throw new Error('Failed to encrypt report');
  }
}

/**
 * Decrypts an encrypted report string
 * @param encrypted - The encrypted string
 * @returns Decrypted report object
 */
export function decryptReport(encrypted: string): Report {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    const jsonString = bytes.toString(CryptoJS.enc.Utf8);

    if (!jsonString) {
      throw new Error('Decryption failed - invalid key or corrupted data');
    }

    const report = JSON.parse(jsonString);

    // Convert date strings back to Date objects
    if (report.incidentDate) {
      report.incidentDate = new Date(report.incidentDate);
    }
    if (report.submittedAt) {
      report.submittedAt = new Date(report.submittedAt);
    }

    return report;
  } catch (error) {
    console.error('Error decrypting report:', error);
    throw new Error('Failed to decrypt report');
  }
}

/**
 * Encrypts generic data (string or object)
 * @param data - Data to encrypt
 * @returns Encrypted string
 */
export function encryptData(data: string | object): string {
  try {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(dataString, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts generic encrypted data
 * @param encrypted - Encrypted string
 * @returns Decrypted string
 */
export function decryptData(encrypted: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error('Decryption failed - invalid key or corrupted data');
    }

    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Generates a SHA-256 hash of the provided data
 * @param data - The data to hash
 * @returns Hashed string
 */
export function generateHash(data: string): string {
  try {
    return CryptoJS.SHA256(data.toLowerCase().trim()).toString();
  } catch (error) {
    console.error('Error generating hash:', error);
    throw new Error('Failed to generate hash');
  }
}

/**
 * Verifies if a hash matches the original data
 * @param data - Original data
 * @param hash - Hash to verify against
 * @returns True if hash matches
 */
export function verifyHash(data: string, hash: string): boolean {
  try {
    const computedHash = generateHash(data);
    return computedHash === hash;
  } catch (error) {
    console.error('Error verifying hash:', error);
    return false;
  }
}

/**
 * Generates a unique anonymous ID for a user
 * Format: anon_[timestamp]_[random]
 * @returns Anonymous ID string
 */
export function generateAnonymousId(): string {
  try {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 11);
    return `anon_${timestamp}_${random}`;
  } catch (error) {
    console.error('Error generating anonymous ID:', error);
    throw new Error('Failed to generate anonymous ID');
  }
}

/**
 * Generates a unique report tracking token
 * Format: MLK-[YEAR]-[RANDOM]
 * @returns Report token string
 */
export function generateReportToken(): string {
  try {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `MLK-${year}-${random}`;
  } catch (error) {
    console.error('Error generating report token:', error);
    throw new Error('Failed to generate report token');
  }
}

/**
 * Generates a secure encryption key for report tokens
 * @returns Random encryption key
 */
export function generateEncryptionKey(): string {
  try {
    const length = 32;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = '';

    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return key;
  } catch (error) {
    console.error('Error generating encryption key:', error);
    throw new Error('Failed to generate encryption key');
  }
}

/**
 * Encrypts contact method information
 * @param contactValue - The contact value (email, phone, etc.)
 * @returns Encrypted contact value
 */
export function encryptContactMethod(contactValue: string): string {
  try {
    return CryptoJS.AES.encrypt(contactValue, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Error encrypting contact method:', error);
    throw new Error('Failed to encrypt contact method');
  }
}

/**
 * Decrypts contact method information
 * @param encrypted - The encrypted contact value
 * @returns Decrypted contact value
 */
export function decryptContactMethod(encrypted: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error('Decryption failed - invalid key or corrupted data');
    }

    return decrypted;
  } catch (error) {
    console.error('Error decrypting contact method:', error);
    throw new Error('Failed to decrypt contact method');
  }
}

/**
 * Generates a deterministic hash for contact method
 * @param contactValue - Contact method value
 * @param salt - Optional salt value
 * @returns Hashed contact method
 */
export function hashContactMethod(contactValue: string, salt?: string): string {
  try {
    const data = salt ? `${contactValue}:${salt}` : contactValue;
    return CryptoJS.SHA256(data.toLowerCase().trim()).toString();
  } catch (error) {
    console.error('Error hashing contact method:', error);
    throw new Error('Failed to hash contact method');
  }
}
