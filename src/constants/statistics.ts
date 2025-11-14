/**
 * Sample Statistics Data
 * Mulika Ufisadi - Corruption Reporting Platform
 * Sample data for development and demonstration purposes
 */

export const SAMPLE_STATS = {
  totalReports: 5847,
  totalBribesAmount: 127000000, // KES 127M
  verifiedCases: 1203,
  countyCount: 47,
};

export const AGENCY_RANKINGS = [
  { name: 'Police', score: 84.0, reportCount: 2341 },
  { name: 'Land Services', score: 45.0, reportCount: 987 },
  { name: 'Motor Vehicle', score: 43.7, reportCount: 654 },
  { name: 'Judiciary', score: 40.8, reportCount: 432 },
  { name: 'Civil Registration', score: 34.7, reportCount: 321 },
  { name: 'Health Services', score: 28.3, reportCount: 289 },
  { name: 'Education Services', score: 25.1, reportCount: 234 },
  { name: 'Business Licensing', score: 22.5, reportCount: 198 },
  { name: 'Huduma Centres', score: 18.9, reportCount: 176 },
  { name: 'Tax Services', score: 15.2, reportCount: 142 },
  { name: 'Other', score: 12.4, reportCount: 73 },
];

export const TREND_DATA = [
  { year: 2017, totalReports: 3200, averageBribe: 15000, reportingRate: 12.5 },
  { year: 2018, totalReports: 3800, averageBribe: 16200, reportingRate: 14.2 },
  { year: 2019, totalReports: 4200, averageBribe: 17500, reportingRate: 15.8 },
  { year: 2020, totalReports: 3900, averageBribe: 16800, reportingRate: 14.1 },
  { year: 2021, totalReports: 4500, averageBribe: 18200, reportingRate: 16.3 },
  { year: 2022, totalReports: 5100, averageBribe: 19500, reportingRate: 18.7 },
  { year: 2023, totalReports: 5600, averageBribe: 20100, reportingRate: 20.4 },
  { year: 2024, totalReports: 6200, averageBribe: 21300, reportingRate: 22.8 },
  { year: 2025, totalReports: 5847, averageBribe: 18800, reportingRate: 21.5 },
];

export const COUNTY_STATS = [
  { countyCode: 47, countyName: 'Nairobi', reportCount: 1247, totalBribeAmount: 28500000, topAgency: 'Police', riskScore: 89.2 },
  { countyCode: 1, countyName: 'Mombasa', reportCount: 543, totalBribeAmount: 12300000, topAgency: 'Police', riskScore: 76.5 },
  { countyCode: 42, countyName: 'Kisumu', reportCount: 412, totalBribeAmount: 9800000, topAgency: 'Land Services', riskScore: 71.3 },
  { countyCode: 32, countyName: 'Nakuru', reportCount: 398, totalBribeAmount: 8900000, topAgency: 'Motor Vehicle', riskScore: 68.7 },
  { countyCode: 22, countyName: 'Kiambu', reportCount: 367, totalBribeAmount: 8200000, topAgency: 'Land Services', riskScore: 65.4 },
  { countyCode: 27, countyName: 'Uasin Gishu', reportCount: 289, totalBribeAmount: 6500000, topAgency: 'Police', riskScore: 61.8 },
  { countyCode: 16, countyName: 'Machakos', reportCount: 256, totalBribeAmount: 5800000, topAgency: 'Land Services', riskScore: 58.2 },
  { countyCode: 3, countyName: 'Kilifi', reportCount: 234, totalBribeAmount: 5200000, topAgency: 'Police', riskScore: 55.6 },
  { countyCode: 37, countyName: 'Kakamega', reportCount: 221, totalBribeAmount: 4900000, topAgency: 'Health Services', riskScore: 53.1 },
  { countyCode: 12, countyName: 'Meru', reportCount: 198, totalBribeAmount: 4400000, topAgency: 'Education Services', riskScore: 50.3 },
];

export const CATEGORY_DISTRIBUTION = [
  { category: 'Bribery', count: 3421, percentage: 58.5 },
  { category: 'Extortion', count: 1054, percentage: 18.0 },
  { category: 'Embezzlement', count: 587, percentage: 10.0 },
  { category: 'Nepotism', count: 351, percentage: 6.0 },
  { category: 'Procurement Fraud', count: 263, percentage: 4.5 },
  { category: 'Land Grabbing', count: 117, percentage: 2.0 },
  { category: 'Other', count: 54, percentage: 1.0 },
];

export const MONTHLY_TRENDS = [
  { month: 'Jan', reports: 487, amount: 10500000 },
  { month: 'Feb', reports: 452, amount: 9800000 },
  { month: 'Mar', reports: 523, amount: 11200000 },
  { month: 'Apr', reports: 498, amount: 10700000 },
  { month: 'May', reports: 567, amount: 12100000 },
  { month: 'Jun', reports: 521, amount: 11400000 },
  { month: 'Jul', reports: 489, amount: 10600000 },
  { month: 'Aug', reports: 512, amount: 11000000 },
  { month: 'Sep', reports: 478, amount: 10300000 },
  { month: 'Oct', reports: 543, amount: 11700000 },
  { month: 'Nov', reports: 387, amount: 8300000 },
  { month: 'Dec', reports: 390, amount: 8400000 },
];
