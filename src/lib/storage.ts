/**
 * LocalStorage Utilities
 * Mulika Ufisadi - Corruption Reporting Platform
 */

import type { Report } from '../types/report';
import type { RewardToken } from '../types/reward';
import { encryptReport, decryptReport, generateAnonymousId } from './encryption';

export const STORAGE_KEYS = {
  REPORTS: 'mulika_reports',
  ANONYMOUS_ID: 'mulika_anonymous_id',
  REWARDS_TOKENS: 'mulika_rewards_tokens',
  SETTINGS: 'mulika_settings',
} as const;

interface StoredReport {
  id: string;
  encrypted: string;
  timestamp: number;
}

/**
 * Saves a report to localStorage (encrypted)
 * @param report - The report to save
 */
export function saveReport(report: Report): void {
  try {
    const encrypted = encryptReport(report);
    const existing = getStoredReportsRaw();

    const newEntry: StoredReport = {
      id: report.id,
      encrypted,
      timestamp: Date.now(),
    };

    existing.push(newEntry);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(existing));
  } catch (error) {
    console.error('Error saving report:', error);
    throw new Error('Failed to save report to storage');
  }
}

/**
 * Gets all reports from localStorage (decrypted)
 * @returns Array of reports
 */
export function getReports(): Report[] {
  try {
    const stored = getStoredReportsRaw();
    return stored.map((item) => {
      try {
        return decryptReport(item.encrypted);
      } catch (error) {
        console.error('Error decrypting report:', item.id, error);
        return null;
      }
    }).filter((report): report is Report => report !== null);
  } catch (error) {
    console.error('Error getting reports:', error);
    return [];
  }
}

/**
 * Gets raw stored reports (still encrypted)
 * @returns Array of stored report entries
 */
function getStoredReportsRaw(): StoredReport[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing stored reports:', error);
    return [];
  }
}

/**
 * Gets a single report by ID
 * @param id - The report ID
 * @returns The report or undefined
 */
export function getReportById(id: string): Report | undefined {
  const reports = getReports();
  return reports.find((r) => r.id === id);
}

/**
 * Deletes a report from localStorage
 * @param id - The report ID to delete
 */
export function deleteReport(id: string): void {
  try {
    const existing = getStoredReportsRaw();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting report:', error);
    throw new Error('Failed to delete report');
  }
}

/**
 * Gets or creates an anonymous ID for the user
 * @returns Anonymous ID string
 */
export function getAnonymousId(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEYS.ANONYMOUS_ID);
    if (!id) {
      id = generateAnonymousId();
      localStorage.setItem(STORAGE_KEYS.ANONYMOUS_ID, id);
    }
    return id;
  } catch (error) {
    console.error('Error getting anonymous ID:', error);
    return generateAnonymousId();
  }
}

/**
 * Saves a reward token to localStorage
 * @param token - The reward token to save
 */
export function saveRewardToken(token: RewardToken): void {
  try {
    const existing = getRewardTokens();
    existing.push(token);
    localStorage.setItem(STORAGE_KEYS.REWARDS_TOKENS, JSON.stringify(existing));
  } catch (error) {
    console.error('Error saving reward token:', error);
    throw new Error('Failed to save reward token');
  }
}

/**
 * Gets all reward tokens from localStorage
 * @returns Array of reward tokens
 */
export function getRewardTokens(): RewardToken[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REWARDS_TOKENS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting reward tokens:', error);
    return [];
  }
}

/**
 * Gets a reward token by ID
 * @param tokenId - The token ID
 * @returns The reward token or undefined
 */
export function getRewardTokenById(tokenId: string): RewardToken | undefined {
  const tokens = getRewardTokens();
  return tokens.find((t) => t.id === tokenId);
}

/**
 * Updates a reward token
 * @param tokenId - The token ID
 * @param updates - Partial token updates
 */
export function updateRewardToken(tokenId: string, updates: Partial<RewardToken>): void {
  try {
    const tokens = getRewardTokens();
    const index = tokens.findIndex((t) => t.id === tokenId);

    if (index === -1) {
      throw new Error('Token not found');
    }

    tokens[index] = { ...tokens[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.REWARDS_TOKENS, JSON.stringify(tokens));
  } catch (error) {
    console.error('Error updating reward token:', error);
    throw new Error('Failed to update reward token');
  }
}

/**
 * Clears all data from localStorage (for testing/debugging)
 */
export function clearAllData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

/**
 * Gets storage statistics
 * @returns Object with storage stats
 */
export function getStorageStats() {
  return {
    totalReports: getReports().length,
    totalTokens: getRewardTokens().length,
    anonymousId: getAnonymousId(),
  };
}
