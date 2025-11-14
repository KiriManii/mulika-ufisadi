/**
 * Machine Learning - Clustering Functions
 * Mulika Ufisadi - Corruption Reporting Platform
 * Uses TensorFlow.js for K-means clustering of corruption reports
 */

import * as tf from '@tensorflow/tfjs';
import type { Report, Agency } from '@/types/report';

export interface Cluster {
  id: number;
  centroid: number[];
  reports: Report[];
  characteristics: ClusterCharacteristics;
}

export interface ClusterCharacteristics {
  dominantAgency: Agency;
  averageAmount: number;
  reportCount: number;
  commonCounties: string[];
  timePattern: 'recent' | 'historical' | 'mixed';
}

/**
 * Converts a report to a numerical vector for ML processing
 * @param report - The report to vectorize
 * @param countyMap - Map of county names to indices
 * @returns Numerical vector representing the report
 */
function reportToVector(report: Report, countyMap: Map<string, number>): number[] {
  const countyIndex = countyMap.get(report.county) || 0;
  const agencyHash = hashAgency(report.agency);
  const amount = report.estimatedAmount || 0;
  const timestamp = report.incidentDate.getTime();
  const categoryCount = report.categories.length;

  // Normalize values
  const normalizedAmount = Math.log(amount + 1) / 20; // Log scale, normalized
  const normalizedTime = timestamp / 1e12; // Normalize timestamp
  const normalizedCounty = countyIndex / 47; // 47 counties
  const normalizedAgency = agencyHash / 11; // 11 agencies
  const normalizedCategories = categoryCount / 7; // Max 7 categories

  return [
    normalizedCounty,
    normalizedAgency,
    normalizedAmount,
    normalizedTime,
    normalizedCategories,
  ];
}

/**
 * Converts agency enum to a numerical hash
 * @param agency - The agency enum
 * @returns Numerical hash
 */
function hashAgency(agency: Agency): number {
  const agencies = [
    'police',
    'land_services',
    'civil_registration',
    'judiciary',
    'motor_vehicle',
    'business_licensing',
    'education',
    'health',
    'tax',
    'huduma_center',
    'other',
  ];

  return agencies.indexOf(agency) + 1;
}

/**
 * Creates a county name to index mapping
 * @param reports - Array of reports
 * @returns Map of county names to indices
 */
function createCountyMap(reports: Report[]): Map<string, number> {
  const counties = Array.from(new Set(reports.map((r) => r.county)));
  const countyMap = new Map<string, number>();

  counties.forEach((county, index) => {
    countyMap.set(county, index);
  });

  return countyMap;
}

/**
 * Performs K-means clustering on reports
 * @param reports - Array of reports to cluster
 * @param k - Number of clusters (default: 5)
 * @returns Array of clusters with characteristics
 */
export async function clusterReports(
  reports: Report[],
  k = 5
): Promise<Cluster[]> {
  try {
    if (reports.length < k) {
      throw new Error(`Not enough reports for ${k} clusters. Need at least ${k} reports.`);
    }

    // Create county mapping
    const countyMap = createCountyMap(reports);

    // Convert reports to vectors
    const vectors = reports.map((report) => reportToVector(report, countyMap));

    // Convert to tensor
    const data = tf.tensor2d(vectors);

    // Perform K-means clustering
    const { centroids, assignments } = await kMeans(data, k);

    // Get centroid values
    const centroidValues = await centroids.array();

    // Get cluster assignments
    const assignmentValues = await assignments.array();

    // Group reports by cluster
    const clusters: Cluster[] = [];

    for (let i = 0; i < k; i++) {
      const clusterReports = reports.filter((_, idx) => assignmentValues[idx] === i);

      if (clusterReports.length > 0) {
        const characteristics = analyzeCluster(clusterReports);

        clusters.push({
          id: i,
          centroid: centroidValues[i],
          reports: clusterReports,
          characteristics,
        });
      }
    }

    // Clean up tensors
    data.dispose();
    centroids.dispose();
    assignments.dispose();

    return clusters;
  } catch (error) {
    console.error('Error clustering reports:', error);
    throw new Error('Failed to cluster reports');
  }
}

/**
 * K-means clustering algorithm implementation
 * @param data - Tensor of data points
 * @param k - Number of clusters
 * @param maxIterations - Maximum iterations (default: 100)
 * @returns Centroids and cluster assignments
 */
async function kMeans(
  data: tf.Tensor2D,
  k: number,
  maxIterations = 100
): Promise<{ centroids: tf.Tensor2D; assignments: tf.Tensor1D }> {
  const numPoints = data.shape[0];
  const numFeatures = data.shape[1];

  // Initialize centroids randomly from data points
  const centroidIndices = tf.util.createShuffledIndices(numPoints).slice(0, k);
  let centroids = tf.gather(data, centroidIndices);

  let assignments = tf.zeros([numPoints], 'int32') as tf.Tensor1D;

  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign points to nearest centroid
    const newAssignments = assignToCentroids(data, centroids);

    // Check for convergence
    const assignmentValues = await assignments.array();
    const newAssignmentValues = await newAssignments.array();

    const hasChanged = assignmentValues.some(
      (val, idx) => val !== newAssignmentValues[idx]
    );

    assignments.dispose();
    assignments = newAssignments;

    if (!hasChanged) {
      break; // Converged
    }

    // Update centroids
    const newCentroids = updateCentroids(data, assignments, k, numFeatures);
    centroids.dispose();
    centroids = newCentroids;
  }

  return { centroids, assignments };
}

/**
 * Assigns each data point to the nearest centroid
 * @param data - Data points
 * @param centroids - Current centroids
 * @returns Tensor of cluster assignments
 */
function assignToCentroids(
  data: tf.Tensor2D,
  centroids: tf.Tensor2D
): tf.Tensor1D {
  return tf.tidy(() => {
    // Calculate distances from each point to each centroid
    const expandedData = data.expandDims(1); // [numPoints, 1, numFeatures]
    const expandedCentroids = centroids.expandDims(0); // [1, k, numFeatures]

    const distances = tf.sum(
      tf.square(tf.sub(expandedData, expandedCentroids)),
      2
    ); // [numPoints, k]

    // Find nearest centroid for each point
    return tf.argMin(distances, 1) as tf.Tensor1D;
  });
}

/**
 * Updates centroids based on current cluster assignments
 * @param data - Data points
 * @param assignments - Current cluster assignments
 * @param k - Number of clusters
 * @param numFeatures - Number of features
 * @returns Updated centroids
 */
function updateCentroids(
  data: tf.Tensor2D,
  assignments: tf.Tensor1D,
  k: number,
  numFeatures: number
): tf.Tensor2D {
  return tf.tidy(() => {
    const newCentroids: tf.Tensor1D[] = [];

    for (let i = 0; i < k; i++) {
      // Get all points assigned to this cluster
      const mask = tf.equal(assignments, i);
      const clusterPoints = tf.booleanMaskAsync(data, mask);

      // Calculate mean of cluster points
      clusterPoints.then((points) => {
        if (points.shape[0] > 0) {
          const centroid = tf.mean(points, 0);
          newCentroids.push(centroid as tf.Tensor1D);
        } else {
          // If no points assigned, keep previous centroid or random
          const randomCentroid = tf.randomUniform([numFeatures]);
          newCentroids.push(randomCentroid);
        }
        points.dispose();
      });
    }

    return tf.stack(newCentroids) as tf.Tensor2D;
  });
}

/**
 * Analyzes a cluster to extract characteristics
 * @param reports - Reports in the cluster
 * @returns Cluster characteristics
 */
function analyzeCluster(reports: Report[]): ClusterCharacteristics {
  // Find dominant agency
  const agencyCounts = new Map<Agency, number>();
  reports.forEach((report) => {
    const count = agencyCounts.get(report.agency) || 0;
    agencyCounts.set(report.agency, count + 1);
  });

  const dominantAgency = Array.from(agencyCounts.entries()).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  // Calculate average amount
  const amounts = reports.map((r) => r.estimatedAmount || 0).filter((a) => a > 0);
  const averageAmount =
    amounts.length > 0 ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;

  // Find common counties
  const countyCounts = new Map<string, number>();
  reports.forEach((report) => {
    const count = countyCounts.get(report.county) || 0;
    countyCounts.set(report.county, count + 1);
  });

  const commonCounties = Array.from(countyCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((entry) => entry[0]);

  // Determine time pattern
  const now = Date.now();
  const sixMonthsAgo = now - 6 * 30 * 24 * 60 * 60 * 1000;
  const recentCount = reports.filter(
    (r) => r.incidentDate.getTime() > sixMonthsAgo
  ).length;

  const recentPercentage = (recentCount / reports.length) * 100;

  let timePattern: 'recent' | 'historical' | 'mixed';
  if (recentPercentage > 70) {
    timePattern = 'recent';
  } else if (recentPercentage < 30) {
    timePattern = 'historical';
  } else {
    timePattern = 'mixed';
  }

  return {
    dominantAgency,
    averageAmount,
    reportCount: reports.length,
    commonCounties,
    timePattern,
  };
}

/**
 * Finds similar reports based on clustering
 * @param targetReport - The report to find similar reports for
 * @param allReports - All available reports
 * @param limit - Maximum number of similar reports to return
 * @returns Array of similar reports
 */
export async function findSimilarReports(
  targetReport: Report,
  allReports: Report[],
  limit = 5
): Promise<Report[]> {
  try {
    // Cluster all reports
    const clusters = await clusterReports(allReports, Math.min(10, allReports.length));

    // Find which cluster the target report belongs to
    const targetCluster = clusters.find((cluster) =>
      cluster.reports.some((r) => r.id === targetReport.id)
    );

    if (!targetCluster) {
      return [];
    }

    // Return other reports from the same cluster
    return targetCluster.reports
      .filter((r) => r.id !== targetReport.id)
      .slice(0, limit);
  } catch (error) {
    console.error('Error finding similar reports:', error);
    return [];
  }
}
