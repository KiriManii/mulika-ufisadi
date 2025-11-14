/**
 * Dashboard Page - Corruption Statistics Dashboard
 * Mulika Ufisadi - Corruption Reporting Platform
 *
 * Comprehensive dashboard showing corruption statistics, trends, and analysis
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  TrendingUp,
  CheckCircle,
  MapPin,
  AlertTriangle,
  DollarSign,
  Calendar,
  Filter,
} from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { AgencyRanking } from '../components/dashboard/AgencyRanking';
import { TrendChart } from '../components/dashboard/TrendChart';
import { CountyBreakdown } from '../components/dashboard/CountyBreakdown';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { useReportStore } from '../store/reportStore';
import {
  SAMPLE_STATS,
  AGENCY_RANKINGS,
  TREND_DATA,
  COUNTY_STATS,
  CATEGORY_DISTRIBUTION,
} from '../constants/statistics';

/**
 * Dashboard Page Component
 */
export function Dashboard() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const isLoading = false;

  // Get reports from store
  const { reports, getReportStats } = useReportStore();

  // Calculate stats (use sample data if no real reports)
  const stats = useMemo(() => {
    if (reports.length > 0) {
      const reportStats = getReportStats();
      return {
        ...reportStats,
        countyCount: Object.keys(reportStats.byCounty).length,
      };
    }
    return {
      total: SAMPLE_STATS.totalReports,
      totalAmount: SAMPLE_STATS.totalBribesAmount,
      verifiedCases: SAMPLE_STATS.verifiedCases,
      countyCount: SAMPLE_STATS.countyCount,
    };
  }, [reports, getReportStats]);

  // Year options for filter
  const yearOptions = [
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: 'all', label: 'All Years' },
  ];

  // Category options for filter
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'bribery', label: 'Bribery' },
    { value: 'extortion', label: 'Extortion' },
    { value: 'embezzlement', label: 'Embezzlement' },
    { value: 'nepotism', label: 'Nepotism' },
    { value: 'procurement_fraud', label: 'Procurement Fraud' },
    { value: 'land_grabbing', label: 'Land Grabbing' },
    { value: 'other', label: 'Other' },
  ];

  // Calculate verification rate
  const verificationRate = Math.round(
    (SAMPLE_STATS.verifiedCases / SAMPLE_STATS.totalReports) * 100
  );

  // Calculate average bribe amount
  const averageBribe = Math.round(
    SAMPLE_STATS.totalBribesAmount / SAMPLE_STATS.totalReports
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Corruption Statistics
            </h1>
            <p className="text-xl text-primary-50">
              Real-time data and analysis of corruption reports across Kenya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-neutral-600" />
                <span className="font-medium text-neutral-900">Filter Data:</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  options={yearOptions}
                  value={selectedYear}
                  onChange={setSelectedYear}
                  placeholder="Select Year"
                  className="w-full sm:w-40"
                />
                <Select
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="Select Category"
                  className="w-full sm:w-48"
                />
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setSelectedYear('2025');
                    setSelectedCategory('all');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Reports"
                  value={stats.total || SAMPLE_STATS.totalReports}
                  icon={<FileText className="w-6 h-6" />}
                  color="primary"
                  trend={{
                    value: 12.5,
                    direction: 'up',
                  }}
                />
                <StatsCard
                  title="Total Amount"
                  value={`KES ${((stats.totalAmount || SAMPLE_STATS.totalBribesAmount) / 1000000).toFixed(1)}M`}
                  icon={<DollarSign className="w-6 h-6" />}
                  color="secondary"
                  trend={{
                    value: 8.3,
                    direction: 'up',
                  }}
                />
                <StatsCard
                  title="Verified Cases"
                  value={SAMPLE_STATS.verifiedCases}
                  icon={<CheckCircle className="w-6 h-6" />}
                  color="success"
                  trend={{
                    value: verificationRate,
                    direction: 'up',
                  }}
                />
                <StatsCard
                  title="Counties Covered"
                  value={stats.countyCount || SAMPLE_STATS.countyCount}
                  icon={<MapPin className="w-6 h-6" />}
                  color="primary"
                />
              </div>
            </motion.div>

            {/* Key Metrics Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card>
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-warning" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-neutral-600 mb-2">
                    Average Bribe Amount
                  </h3>
                  <p className="text-2xl font-bold text-neutral-900">
                    KES {averageBribe.toLocaleString()}
                  </p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary-700" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-neutral-600 mb-2">
                    Monthly Average
                  </h3>
                  <p className="text-2xl font-bold text-neutral-900">
                    {Math.round(SAMPLE_STATS.totalReports / 12).toLocaleString()} reports
                  </p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-success" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-neutral-600 mb-2">
                    Most Recent Report
                  </h3>
                  <p className="text-2xl font-bold text-neutral-900">
                    Today
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Agency Rankings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card
                title="Corruption by Government Agency"
                subtitle="Ranked by corruption score (based on report frequency and severity)"
              >
                {isLoading ? (
                  <SkeletonLoader variant="chart" />
                ) : (
                  <AgencyRanking data={AGENCY_RANKINGS} />
                )}
              </Card>
            </motion.div>

            {/* Trend Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card
                title="Corruption Trends Over Time"
                subtitle="Historical data showing reporting patterns and average bribe amounts"
              >
                {isLoading ? (
                  <SkeletonLoader variant="chart" />
                ) : (
                  <TrendChart data={TREND_DATA} />
                )}
              </Card>
            </motion.div>

            {/* Monthly Trends - TODO: Add separate monthly chart component */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card
                title="Monthly Report Distribution (2025)"
                subtitle="Number of reports and total bribe amounts per month"
              >
                {isLoading ? (
                  <SkeletonLoader variant="chart" />
                ) : (
                  <TrendChart data={MONTHLY_TRENDS} type="monthly" />
                )}
              </Card>
            </motion.div> */}

            {/* County Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card
                title="Reports by County"
                subtitle="Top 10 counties with highest corruption reports"
              >
                {isLoading ? (
                  <SkeletonLoader variant="chart" />
                ) : (
                  <CountyBreakdown data={COUNTY_STATS} />
                )}
              </Card>
            </motion.div>

            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card
                title="Corruption Categories"
                subtitle="Distribution of corruption types across all reports"
              >
                <div className="space-y-4">
                  {CATEGORY_DISTRIBUTION.map((category, index) => (
                    <div key={category.category}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-neutral-700">
                          {category.category}
                        </span>
                        <span className="text-sm font-semibold text-neutral-900">
                          {category.count.toLocaleString()} ({category.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${category.percentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Data Notes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-primary-50 border border-primary-200 rounded-lg p-6"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-primary-700 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    About This Data
                  </h3>
                  <ul className="text-sm text-neutral-700 space-y-1">
                    <li>• All data is anonymized and aggregated to protect reporter identities</li>
                    <li>• Statistics are updated in real-time as new reports are submitted</li>
                    <li>• Corruption scores are calculated using ML algorithms based on multiple factors</li>
                    <li>• Verified reports are forwarded to EACC for investigation</li>
                    <li>• Data accuracy improves with more reports - help us by reporting corruption</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
