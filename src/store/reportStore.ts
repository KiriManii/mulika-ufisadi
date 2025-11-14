/**
 * Report Store - Zustand State Management
 * Mulika Ufisadi - Corruption Reporting Platform
 *
 * Manages corruption reports with localStorage persistence and encryption
 */

import { create } from 'zustand';
import type { Report } from '../types/report';
import {
  getReports,
  saveReport as saveReportToStorage,
  getReportById as getReportByIdFromStorage,
  deleteReport as deleteReportFromStorage,
} from '../lib/storage';

interface ReportStore {
  // State
  reports: Report[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadReports: () => void;
  addReport: (report: Report) => void;
  getReportById: (id: string) => Report | undefined;
  updateReport: (id: string, updates: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  clearError: () => void;

  // Statistics
  getReportStats: () => {
    total: number;
    byAgency: Record<string, number>;
    byCounty: Record<string, number>;
    byStatus: Record<string, number>;
    totalAmount: number;
  };

  // Filters
  getReportsByCounty: (county: string) => Report[];
  getReportsByAgency: (agency: string) => Report[];
  getReportsByStatus: (status: string) => Report[];
}

export const useReportStore = create<ReportStore>((set, get) => ({
  // Initial state
  reports: getReports(),
  isLoading: false,
  error: null,

  // Load reports from localStorage
  loadReports: () => {
    try {
      set({ isLoading: true, error: null });
      const reports = getReports();
      set({ reports, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load reports';
      set({ error: errorMessage, isLoading: false });
      console.error('Error loading reports:', error);
    }
  },

  // Add a new report
  addReport: (report) => {
    try {
      set({ isLoading: true, error: null });
      saveReportToStorage(report);
      set((state) => ({
        reports: [...state.reports, report],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add report';
      set({ error: errorMessage, isLoading: false });
      console.error('Error adding report:', error);
      throw error;
    }
  },

  // Get a report by ID
  getReportById: (id) => {
    const report = get().reports.find((r) => r.id === id);
    if (report) {
      return report;
    }

    // Fallback to storage if not in state
    try {
      return getReportByIdFromStorage(id);
    } catch (error) {
      console.error('Error getting report by ID:', error);
      return undefined;
    }
  },

  // Update a report
  updateReport: (id, updates) => {
    try {
      set({ isLoading: true, error: null });

      const reports = get().reports;
      const reportIndex = reports.findIndex((r) => r.id === id);

      if (reportIndex === -1) {
        throw new Error('Report not found');
      }

      const updatedReport = { ...reports[reportIndex], ...updates };

      // Update in localStorage
      deleteReportFromStorage(id);
      saveReportToStorage(updatedReport);

      // Update in state
      set((state) => ({
        reports: state.reports.map((r) =>
          r.id === id ? updatedReport : r
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update report';
      set({ error: errorMessage, isLoading: false });
      console.error('Error updating report:', error);
      throw error;
    }
  },

  // Delete a report
  deleteReport: (id) => {
    try {
      set({ isLoading: true, error: null });
      deleteReportFromStorage(id);
      set((state) => ({
        reports: state.reports.filter((r) => r.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete report';
      set({ error: errorMessage, isLoading: false });
      console.error('Error deleting report:', error);
      throw error;
    }
  },

  // Clear error state
  clearError: () => {
    set({ error: null });
  },

  // Get report statistics
  getReportStats: () => {
    const reports = get().reports;

    const stats = {
      total: reports.length,
      byAgency: {} as Record<string, number>,
      byCounty: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      totalAmount: 0,
    };

    reports.forEach((report) => {
      // Count by agency
      const agency = report.agency;
      stats.byAgency[agency] = (stats.byAgency[agency] || 0) + 1;

      // Count by county
      const county = report.county;
      stats.byCounty[county] = (stats.byCounty[county] || 0) + 1;

      // Count by status
      const status = report.status;
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

      // Sum total amount
      if (report.estimatedAmount) {
        stats.totalAmount += report.estimatedAmount;
      }
    });

    return stats;
  },

  // Get reports filtered by county
  getReportsByCounty: (county) => {
    return get().reports.filter((r) => r.county === county);
  },

  // Get reports filtered by agency
  getReportsByAgency: (agency) => {
    return get().reports.filter((r) => r.agency === agency);
  },

  // Get reports filtered by status
  getReportsByStatus: (status) => {
    return get().reports.filter((r) => r.status === status);
  },
}));
