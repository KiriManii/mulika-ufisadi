/**
 * General Utility Functions
 * Mulika Ufisadi - Corruption Reporting Platform
 */

import type { Agency, Category } from '@/types/report';

/**
 * Formats a number as Kenyan Shillings currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "KES 1,000,000")
 */
export function formatCurrency(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Formats a number with appropriate suffix (K, M, B)
 * @param num - The number to format
 * @returns Formatted string (e.g., "1.5M")
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Formats a date to a human-readable string
 * @param date - The date to format
 * @param includeTime - Whether to include time
 * @returns Formatted date string
 */
export function formatDate(date: Date, includeTime = false): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return date.toLocaleDateString('en-KE', options);
}

/**
 * Formats a date to relative time (e.g., "2 days ago")
 * @param date - The date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
}

/**
 * Converts an agency enum value to a readable label
 * @param agency - The agency enum value
 * @returns Human-readable agency name
 */
export function getAgencyLabel(agency: Agency): string {
  const labels: Record<Agency, string> = {
    [Agency.Police]: 'Police',
    [Agency.LandServices]: 'Land Services',
    [Agency.CivilRegistration]: 'Civil Registration',
    [Agency.Judiciary]: 'Judiciary',
    [Agency.MotorVehicle]: 'Motor Vehicle Licensing',
    [Agency.BusinessLicensing]: 'Business Licensing',
    [Agency.Education]: 'Education Services',
    [Agency.Health]: 'Health Services',
    [Agency.Tax]: 'Tax Services',
    [Agency.HudumaCenter]: 'Huduma Centres',
    [Agency.Other]: 'Other',
  };

  return labels[agency] || agency;
}

/**
 * Converts a category enum value to a readable label
 * @param category - The category enum value
 * @returns Human-readable category name
 */
export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    [Category.Bribery]: 'Bribery',
    [Category.Extortion]: 'Extortion',
    [Category.Embezzlement]: 'Embezzlement',
    [Category.Nepotism]: 'Nepotism',
    [Category.ProcurementFraud]: 'Procurement Fraud',
    [Category.LandGrabbing]: 'Land Grabbing',
    [Category.Other]: 'Other',
  };

  return labels[category] || category;
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Debounces a function call
 * @param func - The function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Validates an email address
 * @param email - The email to validate
 * @returns True if valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a Kenyan phone number
 * @param phone - The phone number to validate
 * @returns True if valid
 */
export function isValidKenyanPhone(phone: string): boolean {
  // Accepts formats: +254712345678, 0712345678, 712345678
  const phoneRegex = /^(\+254|254|0)?([17]\d{8})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Formats a Kenyan phone number to international format
 * @param phone - The phone number to format
 * @returns Formatted phone number (+254...)
 */
export function formatKenyanPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '');
  const match = cleaned.match(/^(\+254|254|0)?([17]\d{8})$/);

  if (!match) return phone;

  return `+254${match[2]}`;
}

/**
 * Generates a random color based on a string (for charts/avatars)
 * @param str - The input string
 * @returns Hex color code
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const color = Math.abs(hash).toString(16).substring(0, 6);
  return `#${'0'.repeat(6 - color.length)}${color}`;
}

/**
 * Calculates percentage
 * @param value - The value
 * @param total - The total
 * @returns Percentage value
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Clamps a number between min and max
 * @param value - The value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generates initials from a name
 * @param name - The name
 * @returns Initials (e.g., "John Doe" -> "JD")
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Downloads data as a file
 * @param data - The data to download
 * @param filename - The filename
 * @param type - MIME type
 */
export function downloadFile(data: string, filename: string, type = 'text/plain'): void {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies text to clipboard
 * @param text - The text to copy
 * @returns Promise that resolves when copied
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

/**
 * Sleep/delay function
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Checks if code is running in browser
 * @returns True if in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Gets user's browser locale
 * @returns Locale string
 */
export function getUserLocale(): string {
  if (!isBrowser()) return 'en-KE';
  return navigator.language || 'en-KE';
}

/**
 * Safely parses JSON with fallback
 * @param json - JSON string
 * @param fallback - Fallback value
 * @returns Parsed object or fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
