/**
 * UI Store - Zustand State Management
 * Mulika Ufisadi - Corruption Reporting Platform
 *
 * Manages global UI state including modals, notifications, and navigation
 */

import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface UIStore {
  // Navigation State
  isMobileMenuOpen: boolean;
  isSidebarOpen: boolean;

  // Loading State
  isLoading: boolean;
  loadingMessage?: string;

  // Notification State
  notifications: Notification[];

  // Modal State
  activeModal: string | null;
  modalData: Record<string, unknown> | null;

  // Actions - Navigation
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openMobileMenu: () => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;

  // Actions - Loading
  setLoading: (loading: boolean, message?: string) => void;
  clearLoading: () => void;

  // Actions - Notifications
  showNotification: (message: string, type: NotificationType, duration?: number) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Actions - Modals
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Utility
  resetUI: () => void;
}

let notificationCounter = 0;

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state - Navigation
  isMobileMenuOpen: false,
  isSidebarOpen: true,

  // Initial state - Loading
  isLoading: false,
  loadingMessage: undefined,

  // Initial state - Notifications
  notifications: [],

  // Initial state - Modals
  activeModal: null,
  modalData: null,

  // Navigation Actions
  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  closeMobileMenu: () => {
    set({ isMobileMenuOpen: false });
  },

  openMobileMenu: () => {
    set({ isMobileMenuOpen: true });
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  closeSidebar: () => {
    set({ isSidebarOpen: false });
  },

  openSidebar: () => {
    set({ isSidebarOpen: true });
  },

  // Loading Actions
  setLoading: (loading, message) => {
    set({ isLoading: loading, loadingMessage: message });
  },

  clearLoading: () => {
    set({ isLoading: false, loadingMessage: undefined });
  },

  // Notification Actions
  showNotification: (message, type, duration = 5000) => {
    const id = `notification-${++notificationCounter}-${Date.now()}`;

    const notification: Notification = {
      id,
      message,
      type,
      duration,
    };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // Modal Actions
  openModal: (modalId, data) => {
    set({ activeModal: modalId, modalData: data || null });
  },

  closeModal: () => {
    set({ activeModal: null, modalData: null });
  },

  // Reset all UI state
  resetUI: () => {
    set({
      isMobileMenuOpen: false,
      isSidebarOpen: true,
      isLoading: false,
      loadingMessage: undefined,
      notifications: [],
      activeModal: null,
      modalData: null,
    });
  },
}));

// Convenience hooks for common notification patterns
export const useNotifications = () => {
  const { showNotification } = useUIStore();

  return {
    success: (message: string, duration?: number) =>
      showNotification(message, 'success', duration),
    error: (message: string, duration?: number) =>
      showNotification(message, 'error', duration),
    info: (message: string, duration?: number) =>
      showNotification(message, 'info', duration),
    warning: (message: string, duration?: number) =>
      showNotification(message, 'warning', duration),
  };
};

// Convenience hook for loading state
export const useLoading = () => {
  const { setLoading, clearLoading } = useUIStore();

  return {
    start: (message?: string) => setLoading(true, message),
    stop: () => clearLoading(),
  };
};

// Convenience hook for modals
export const useModal = () => {
  const { openModal, closeModal, activeModal, modalData } = useUIStore();

  return {
    open: (modalId: string, data?: Record<string, unknown>) => openModal(modalId, data),
    close: () => closeModal(),
    isOpen: (modalId: string) => activeModal === modalId,
    data: modalData,
  };
};
