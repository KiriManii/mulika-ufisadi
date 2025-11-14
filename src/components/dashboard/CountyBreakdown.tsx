import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface CountyData {
  countyCode: number;
  countyName: string;
  reportCount: number;
  totalBribeAmount: number;
  topAgency: string;
  riskScore: number; // 0-100
}

interface CountyBreakdownProps {
  data: CountyData[];
  onCountyClick?: (county: CountyData) => void;
  className?: string;
}

type SortKey = 'countyName' | 'reportCount' | 'totalBribeAmount' | 'riskScore';
type SortDirection = 'asc' | 'desc';

export function CountyBreakdown({
  data,
  onCountyClick,
  className = '',
}: CountyBreakdownProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('reportCount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  // Function to determine color based on risk score
  const getRiskColor = (score: number): string => {
    if (score >= 70) return '#EF4444'; // danger - high risk
    if (score >= 50) return '#F59E0B'; // warning - medium risk
    if (score >= 30) return '#FF9F66'; // secondary - moderate risk
    return '#10B981'; // success - low risk
  };

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchQuery) {
      filtered = data.filter((county) =>
        county.countyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  }, [data, searchQuery, sortKey, sortDirection]);

  // Handle sort
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const county = payload[0].payload;
      return (
        <div className="bg-white border border-neutral-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-neutral-900 mb-2">{county.countyName}</p>
          <p className="text-sm text-neutral-600">
            Reports: <span className="font-bold">{county.reportCount.toLocaleString()}</span>
          </p>
          <p className="text-sm text-neutral-600">
            Total Amount:{' '}
            <span className="font-bold">KES {(county.totalBribeAmount / 1000000).toFixed(1)}M</span>
          </p>
          <p className="text-sm text-neutral-600">
            Top Agency: <span className="font-bold">{county.topAgency}</span>
          </p>
          <p className="text-sm text-neutral-600">
            Risk Score: <span className="font-bold">{county.riskScore}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Sort indicator icon
  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return (
        <svg
          className="w-4 h-4 text-neutral-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg
        className="w-4 h-4 text-primary-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-primary-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <motion.div
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search counties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-sm"
            aria-label="Search counties"
          />
          <svg
            className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2 bg-neutral-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'chart'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            aria-label="Chart view"
          >
            Chart
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            aria-label="Table view"
          >
            Table
          </button>
        </div>
      </div>

      {/* Chart View */}
      {viewMode === 'chart' && (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={processedData.slice(0, 15)} // Show top 15
            margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="countyName"
              tick={{ fill: '#64748B', fontSize: 11, angle: -45, textAnchor: 'end' }}
              axisLine={{ stroke: '#CBD5E1' }}
              height={120}
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 12 }}
              axisLine={{ stroke: '#CBD5E1' }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
            <Bar
              dataKey="reportCount"
              radius={[8, 8, 0, 0]}
              onClick={(data) => onCountyClick && onCountyClick(data)}
              className={onCountyClick ? 'cursor-pointer' : ''}
              animationDuration={1000}
              animationBegin={400}
            >
              {processedData.slice(0, 15).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRiskColor(entry.riskScore)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors"
                  onClick={() => handleSort('countyName')}
                >
                  <div className="flex items-center space-x-2">
                    <span>County</span>
                    <SortIcon columnKey="countyName" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors"
                  onClick={() => handleSort('reportCount')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Reports</span>
                    <SortIcon columnKey="reportCount" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors"
                  onClick={() => handleSort('totalBribeAmount')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Total Amount</span>
                    <SortIcon columnKey="totalBribeAmount" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Top Agency
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors"
                  onClick={() => handleSort('riskScore')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Risk Score</span>
                    <SortIcon columnKey="riskScore" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {processedData.map((county, index) => (
                <motion.tr
                  key={county.countyCode}
                  className={`border-b border-neutral-100 transition-colors ${
                    onCountyClick
                      ? 'cursor-pointer hover:bg-primary-50'
                      : 'hover:bg-neutral-50'
                  }`}
                  onClick={() => onCountyClick && onCountyClick(county)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                >
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900">
                    {county.countyName}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 font-secondary">
                    {county.reportCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 font-secondary">
                    KES {(county.totalBribeAmount / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700">
                    {county.topAgency}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getRiskColor(county.riskScore) }}
                      ></div>
                      <span className="text-sm font-semibold text-neutral-900 font-secondary">
                        {county.riskScore}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {processedData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500">No counties found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-danger"></div>
          <span className="text-xs text-neutral-600">High Risk (&ge;70)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-warning"></div>
          <span className="text-xs text-neutral-600">Medium (50-69)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF9F66' }}></div>
          <span className="text-xs text-neutral-600">Moderate (30-49)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <span className="text-xs text-neutral-600">Low (&lt;30)</span>
        </div>
      </div>
    </motion.div>
  );
}
