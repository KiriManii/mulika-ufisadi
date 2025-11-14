/**
 * Machine Learning - Anomaly Detection Functions
 * Mulika Ufisadi - Corruption Reporting Platform
 * Detects unusual patterns and outliers in corruption reports
 */

import type { Report, Agency } from '@/types/report';

export interface Anomaly {
  reportId: string;
  type: AnomalyType;
  severity: 'low' | 'medium' | 'high';
  reason: string;
  details: Record<string, unknown>;
  score: number; // 0-100, higher = more anomalous
}

export enum AnomalyType {
  UnusualAmount = 'unusual_amount',
  FrequencySpike = 'frequency_spike',
  GeographicOutlier = 'geographic_outlier',
  TimingAnomaly = 'timing_anomaly',
  PatternDeviation = 'pattern_deviation',
}

export interface AnomalyDetectionResult {
  anomalies: Anomaly[];
  normalReports: Report[];
  statistics: AnomalyStatistics;
}

export interface AnomalyStatistics {
  totalReports: number;
  anomalyCount: number;
  anomalyRate: number;
  avgAnomalyScore: number;
  typeDistribution: Record<AnomalyType, number>;
}

/**
 * Detects anomalies in a set of reports
 * @param reports - Array of reports to analyze
 * @returns Anomaly detection results
 */
export function detectAnomalies(reports: Report[]): AnomalyDetectionResult {
  try {
    if (reports.length === 0) {
      return {
        anomalies: [],
        normalReports: [],
        statistics: {
          totalReports: 0,
          anomalyCount: 0,
          anomalyRate: 0,
          avgAnomalyScore: 0,
          typeDistribution: {} as Record<AnomalyType, number>,
        },
      };
    }

    const anomalies: Anomaly[] = [];

    // Detect amount outliers
    anomalies.push(...detectAmountAnomalies(reports));

    // Detect frequency spikes
    anomalies.push(...detectFrequencySpikes(reports));

    // Detect geographic outliers
    anomalies.push(...detectGeographicAnomalies(reports));

    // Detect timing anomalies
    anomalies.push(...detectTimingAnomalies(reports));

    // Remove duplicates (same report flagged multiple times)
    const uniqueAnomalies = deduplicateAnomalies(anomalies);

    // Get anomaly report IDs
    const anomalyIds = new Set(uniqueAnomalies.map((a) => a.reportId));

    // Split reports into anomalous and normal
    const normalReports = reports.filter((r) => !anomalyIds.has(r.id));

    // Calculate statistics
    const statistics = calculateAnomalyStatistics(reports, uniqueAnomalies);

    return {
      anomalies: uniqueAnomalies,
      normalReports,
      statistics,
    };
  } catch (error) {
    console.error('Error detecting anomalies:', error);
    throw new Error('Failed to detect anomalies');
  }
}

/**
 * Detects reports with unusual amounts (outliers)
 * @param reports - Array of reports
 * @returns Array of anomalies
 */
function detectAmountAnomalies(reports: Report[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // Filter reports with amounts
  const reportsWithAmounts = reports.filter((r) => r.estimatedAmount && r.estimatedAmount > 0);

  if (reportsWithAmounts.length < 3) {
    return anomalies; // Not enough data
  }

  const amounts = reportsWithAmounts.map((r) => r.estimatedAmount!);
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const variance =
    amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) /
    amounts.length;
  const stdDev = Math.sqrt(variance);

  // Flag outliers (> 2 standard deviations from mean)
  reportsWithAmounts.forEach((report) => {
    const amount = report.estimatedAmount!;
    const zScore = Math.abs((amount - mean) / stdDev);

    if (zScore > 2) {
      const severity: 'low' | 'medium' | 'high' =
        zScore > 3 ? 'high' : zScore > 2.5 ? 'medium' : 'low';

      anomalies.push({
        reportId: report.id,
        type: AnomalyType.UnusualAmount,
        severity,
        reason: `Amount (KES ${amount.toLocaleString()}) is ${zScore.toFixed(1)} standard deviations from the mean`,
        details: {
          amount,
          mean,
          stdDev,
          zScore,
        },
        score: Math.min(100, zScore * 20),
      });
    }
  });

  return anomalies;
}

/**
 * Detects frequency spikes (many reports in short time)
 * @param reports - Array of reports
 * @returns Array of anomalies
 */
function detectFrequencySpikes(reports: Report[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // Group reports by county and agency
  const groups = new Map<string, Report[]>();

  reports.forEach((report) => {
    const key = `${report.county}:${report.agency}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(report);
  });

  // Check each group for frequency spikes
  groups.forEach((groupReports, key) => {
    if (groupReports.length < 5) return; // Need minimum reports

    // Sort by date
    const sorted = groupReports.sort(
      (a, b) => a.submittedAt.getTime() - b.submittedAt.getTime()
    );

    // Check for spikes (5+ reports within 24 hours)
    const windowMs = 24 * 60 * 60 * 1000; // 24 hours

    for (let i = 0; i < sorted.length - 4; i++) {
      const windowEnd = sorted[i].submittedAt.getTime() + windowMs;
      let count = 1;
      const reportsInWindow = [sorted[i]];

      for (let j = i + 1; j < sorted.length; j++) {
        if (sorted[j].submittedAt.getTime() <= windowEnd) {
          count++;
          reportsInWindow.push(sorted[j]);
        } else {
          break;
        }
      }

      if (count >= 5) {
        // Flag all reports in the spike
        reportsInWindow.forEach((report) => {
          anomalies.push({
            reportId: report.id,
            type: AnomalyType.FrequencySpike,
            severity: count >= 10 ? 'high' : count >= 7 ? 'medium' : 'low',
            reason: `Part of ${count} reports submitted within 24 hours for ${key}`,
            details: {
              count,
              timeWindow: '24h',
              groupKey: key,
            },
            score: Math.min(100, count * 10),
          });
        });

        i += count - 1; // Skip processed reports
      }
    }
  });

  return anomalies;
}

/**
 * Detects geographic outliers (unusual counties for specific agencies)
 * @param reports - Array of reports
 * @returns Array of anomalies
 */
function detectGeographicAnomalies(reports: Report[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // Build agency-county distribution
  const agencyCounties = new Map<Agency, Map<string, number>>();

  reports.forEach((report) => {
    if (!agencyCounties.has(report.agency)) {
      agencyCounties.set(report.agency, new Map());
    }

    const countyMap = agencyCounties.get(report.agency)!;
    const count = countyMap.get(report.county) || 0;
    countyMap.set(report.county, count + 1);
  });

  // Flag counties with very low frequency for an agency
  agencyCounties.forEach((countyMap, agency) => {
    const totalReports = Array.from(countyMap.values()).reduce((a, b) => a + b, 0);

    if (totalReports < 10) return; // Need enough data

    countyMap.forEach((count, county) => {
      const percentage = (count / totalReports) * 100;

      // Flag if county represents < 2% of reports for this agency
      if (percentage < 2 && count <= 2) {
        const matchingReports = reports.filter(
          (r) => r.agency === agency && r.county === county
        );

        matchingReports.forEach((report) => {
          anomalies.push({
            reportId: report.id,
            type: AnomalyType.GeographicOutlier,
            severity: 'low',
            reason: `Unusual county for ${agency} (only ${percentage.toFixed(1)}% of reports)`,
            details: {
              county,
              agency,
              percentage,
              count,
              totalReports,
            },
            score: Math.max(10, 100 - percentage * 10),
          });
        });
      }
    });
  });

  return anomalies;
}

/**
 * Detects timing anomalies (reports at unusual times)
 * @param reports - Array of reports
 * @returns Array of anomalies
 */
function detectTimingAnomalies(reports: Report[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // Check for reports submitted at unusual hours (2 AM - 5 AM)
  reports.forEach((report) => {
    const hour = report.submittedAt.getHours();

    if (hour >= 2 && hour < 5) {
      anomalies.push({
        reportId: report.id,
        type: AnomalyType.TimingAnomaly,
        severity: 'low',
        reason: `Report submitted at unusual hour (${hour}:00)`,
        details: {
          hour,
          date: report.submittedAt,
        },
        score: 30,
      });
    }
  });

  // Check for very old incident dates (> 2 years old)
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  reports.forEach((report) => {
    if (report.incidentDate < twoYearsAgo) {
      const yearsDiff =
        (Date.now() - report.incidentDate.getTime()) / (365 * 24 * 60 * 60 * 1000);

      anomalies.push({
        reportId: report.id,
        type: AnomalyType.TimingAnomaly,
        severity: yearsDiff > 5 ? 'medium' : 'low',
        reason: `Incident occurred ${yearsDiff.toFixed(1)} years ago`,
        details: {
          incidentDate: report.incidentDate,
          yearsDiff,
        },
        score: Math.min(70, yearsDiff * 15),
      });
    }
  });

  return anomalies;
}

/**
 * Removes duplicate anomalies (keeps highest severity)
 * @param anomalies - Array of anomalies
 * @returns Deduplicated anomalies
 */
function deduplicateAnomalies(anomalies: Anomaly[]): Anomaly[] {
  const anomalyMap = new Map<string, Anomaly>();

  anomalies.forEach((anomaly) => {
    const existing = anomalyMap.get(anomaly.reportId);

    if (!existing || anomaly.score > existing.score) {
      anomalyMap.set(anomaly.reportId, anomaly);
    }
  });

  return Array.from(anomalyMap.values()).sort((a, b) => b.score - a.score);
}

/**
 * Calculates statistics about detected anomalies
 * @param allReports - All reports
 * @param anomalies - Detected anomalies
 * @returns Anomaly statistics
 */
function calculateAnomalyStatistics(
  allReports: Report[],
  anomalies: Anomaly[]
): AnomalyStatistics {
  const totalReports = allReports.length;
  const anomalyCount = anomalies.length;
  const anomalyRate = totalReports > 0 ? (anomalyCount / totalReports) * 100 : 0;

  const avgAnomalyScore =
    anomalies.length > 0
      ? anomalies.reduce((sum, a) => sum + a.score, 0) / anomalies.length
      : 0;

  const typeDistribution: Record<AnomalyType, number> = {
    [AnomalyType.UnusualAmount]: 0,
    [AnomalyType.FrequencySpike]: 0,
    [AnomalyType.GeographicOutlier]: 0,
    [AnomalyType.TimingAnomaly]: 0,
    [AnomalyType.PatternDeviation]: 0,
  };

  anomalies.forEach((anomaly) => {
    typeDistribution[anomaly.type]++;
  });

  return {
    totalReports,
    anomalyCount,
    anomalyRate,
    avgAnomalyScore,
    typeDistribution,
  };
}

/**
 * Checks if a specific report is anomalous
 * @param report - The report to check
 * @param allReports - All reports for context
 * @returns Anomaly if detected, null otherwise
 */
export function isReportAnomalous(
  report: Report,
  allReports: Report[]
): Anomaly | null {
  const result = detectAnomalies([...allReports, report]);
  return result.anomalies.find((a) => a.reportId === report.id) || null;
}

/**
 * Gets anomaly severity distribution
 * @param anomalies - Array of anomalies
 * @returns Distribution by severity
 */
export function getAnomalySeverityDistribution(anomalies: Anomaly[]): {
  low: number;
  medium: number;
  high: number;
} {
  const distribution = { low: 0, medium: 0, high: 0 };

  anomalies.forEach((anomaly) => {
    distribution[anomaly.severity]++;
  });

  return distribution;
}
