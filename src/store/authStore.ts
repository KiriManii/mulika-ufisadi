/**
 * Auth Store - Zustand State Management
 * Mulika Ufisadi - Corruption Reporting Platform
 *
 * Manages anonymous user identity and reward tokens
 */

import { create } from 'zustand';
import type { RewardToken } from '../types/reward';
import {
  getAnonymousId,
  getRewardTokens,
  saveRewardToken,
  getRewardTokenById as getTokenByIdFromStorage,
  updateRewardToken as updateTokenInStorage,
} from '../lib/storage';
import { generateAnonymousId } from '../lib/encryption';

interface AuthStore {
  // State
  anonymousId: string | null;
  rewardTokens: RewardToken[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeAuth: () => void;
  getOrCreateAnonymousId: () => string;
  resetAnonymousId: () => void;

  // Reward Token Management
  loadRewardTokens: () => void;
  addRewardToken: (token: RewardToken) => void;
  getRewardTokenById: (tokenId: string) => RewardToken | undefined;
  updateRewardToken: (tokenId: string, updates: Partial<RewardToken>) => void;
  markTokenAsClaimed: (tokenId: string) => void;

  // Statistics
  getTokenStats: () => {
    total: number;
    claimed: number;
    unclaimed: number;
  };

  // Utility
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  anonymousId: null,
  rewardTokens: [],
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Initialize authentication (get or create anonymous ID)
  initializeAuth: () => {
    try {
      set({ isLoading: true, error: null });
      const anonymousId = getAnonymousId();
      const rewardTokens = getRewardTokens();

      set({
        anonymousId,
        rewardTokens,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize auth';
      set({ error: errorMessage, isLoading: false, isAuthenticated: false });
      console.error('Error initializing auth:', error);
    }
  },

  // Get or create anonymous ID
  getOrCreateAnonymousId: () => {
    try {
      let anonymousId = get().anonymousId;

      if (!anonymousId) {
        anonymousId = getAnonymousId();
        set({ anonymousId, isAuthenticated: true });
      }

      return anonymousId;
    } catch (error) {
      console.error('Error getting anonymous ID:', error);
      const newId = generateAnonymousId();
      set({ anonymousId: newId, isAuthenticated: true });
      return newId;
    }
  },

  // Reset anonymous ID (creates a new one)
  resetAnonymousId: () => {
    try {
      set({ isLoading: true, error: null });
      const newId = generateAnonymousId();
      localStorage.setItem('mulika_anonymous_id', newId);

      set({
        anonymousId: newId,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset anonymous ID';
      set({ error: errorMessage, isLoading: false });
      console.error('Error resetting anonymous ID:', error);
      throw error;
    }
  },

  // Load reward tokens from localStorage
  loadRewardTokens: () => {
    try {
      set({ isLoading: true, error: null });
      const rewardTokens = getRewardTokens();
      set({ rewardTokens, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load reward tokens';
      set({ error: errorMessage, isLoading: false });
      console.error('Error loading reward tokens:', error);
    }
  },

  // Add a new reward token
  addRewardToken: (token) => {
    try {
      set({ isLoading: true, error: null });
      saveRewardToken(token);

      set((state) => ({
        rewardTokens: [...state.rewardTokens, token],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add reward token';
      set({ error: errorMessage, isLoading: false });
      console.error('Error adding reward token:', error);
      throw error;
    }
  },

  // Get a reward token by ID
  getRewardTokenById: (tokenId) => {
    const token = get().rewardTokens.find((t) => t.id === tokenId);
    if (token) {
      return token;
    }

    // Fallback to storage if not in state
    try {
      return getTokenByIdFromStorage(tokenId);
    } catch (error) {
      console.error('Error getting reward token by ID:', error);
      return undefined;
    }
  },

  // Update a reward token
  updateRewardToken: (tokenId, updates) => {
    try {
      set({ isLoading: true, error: null });

      const tokens = get().rewardTokens;
      const tokenIndex = tokens.findIndex((t) => t.id === tokenId);

      if (tokenIndex === -1) {
        throw new Error('Token not found');
      }

      const updatedToken = { ...tokens[tokenIndex], ...updates };

      // Update in localStorage
      updateTokenInStorage(tokenId, updates);

      // Update in state
      set((state) => ({
        rewardTokens: state.rewardTokens.map((t) =>
          t.id === tokenId ? updatedToken : t
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update reward token';
      set({ error: errorMessage, isLoading: false });
      console.error('Error updating reward token:', error);
      throw error;
    }
  },

  // Mark a token as claimed
  markTokenAsClaimed: (tokenId) => {
    try {
      get().updateRewardToken(tokenId, { claimed: true });
    } catch (error) {
      console.error('Error marking token as claimed:', error);
      throw error;
    }
  },

  // Get token statistics
  getTokenStats: () => {
    const tokens = get().rewardTokens;

    return {
      total: tokens.length,
      claimed: tokens.filter((t) => t.claimed).length,
      unclaimed: tokens.filter((t) => !t.claimed).length,
    };
  },

  // Clear error state
  clearError: () => {
    set({ error: null });
  },
}));
