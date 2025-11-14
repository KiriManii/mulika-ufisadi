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
  const jsonString = JSON.stringify(report);
  return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
}

/**
 * Decrypts an encrypted report string
 * @param encrypted - The encrypted string
 * @returns Decrypted report object
 */
export function decryptReport(encrypted: string): Report {
  const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
  const jsonString = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(jsonString);
}

/**
 * Generates a SHA-256 hash of the provided data
 * @param data - The data to hash
 * @returns Hashed string
 */
export function generateHash(data: string): string {
  return CryptoJS.SHA256(data).toString();
}

/**
 * Generates a unique anonymous ID for a user
 * Format: anon_[timestamp]_[random]
 * @returns Anonymous ID string
 */
export function generateAnonymousId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `anon_${timestamp}_${random}`;
}

/**
 * Generates a unique report tracking token
 * Format: MLK-[YEAR]-[RANDOM]
 * @returns Report token string
 */
export function generateReportToken(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `MLK-${year}-${random}`;
}

/**
 * Generates a secure encryption key for report tokens
 * @returns Random encryption key
 */
export function generateEncryptionKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Encrypts contact method information
 * @param contactValue - The contact value (email, phone, etc.)
 * @returns Encrypted contact value
 */
export function encryptContactMethod(contactValue: string): string {
  return CryptoJS.AES.encrypt(contactValue, ENCRYPTION_KEY).toString();
}

/**
 * Decrypts contact method information
 * @param encrypted - The encrypted contact value
 * @returns Decrypted contact value
 */
export function decryptContactMethod(encrypted: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
