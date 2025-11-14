/**
 * Store Exports
 * Mulika Ufisadi - Corruption Reporting Platform
 *
 * Centralized exports for all Zustand stores
 */

// Report Store
export { useReportStore } from './reportStore';
export type { default as ReportStore } from './reportStore';

// Auth Store
export { useAuthStore } from './authStore';
export type { default as AuthStore } from './authStore';

// UI Store
export {
  useUIStore,
  useNotifications,
  useLoading,
  useModal,
} from './uiStore';
export type { Notification, NotificationType } from './uiStore';
export type { default as UIStore } from './uiStore';
