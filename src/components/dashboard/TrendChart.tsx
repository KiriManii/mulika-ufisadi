import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TrendData {
  year: number;
  totalReports: number;
  averageBribe: number;
  reportingRate?: number;
}

interface TrendChartProps {
  data: TrendData[];
  className?: string;
}

export function TrendChart({ data, className = '' }: TrendChartProps) {
  const [visibleLines, setVisibleLines] = useState({
    totalReports: true,
    averageBribe: true,
    reportingRate: false,
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-neutral-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4 mb-1">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-neutral-600">{entry.name}:</span>
              </div>
              <span className="text-sm font-bold text-neutral-900">
                {entry.dataKey === 'averageBribe'
                  ? `KES ${entry.value.toLocaleString()}`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Toggle line visibility
  const toggleLine = (lineKey: keyof typeof visibleLines) => {
    setVisibleLines((prev) => ({
      ...prev,
      [lineKey]: !prev[lineKey],
    }));
  };

  return (
    <motion.div
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* Toggle Controls */}
      <div className="flex items-center justify-end space-x-4 mb-4">
        <button
          onClick={() => toggleLine('totalReports')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
            visibleLines.totalReports
              ? 'bg-primary-50 text-primary-700 border border-primary-200'
              : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
          }`}
          aria-label="Toggle Total Reports line"
        >
          <div className="w-3 h-3 rounded-full bg-primary-500"></div>
          <span>Total Reports</span>
        </button>
        <button
          onClick={() => toggleLine('averageBribe')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
            visibleLines.averageBribe
              ? 'bg-secondary-50 text-secondary-700 border border-secondary-200'
              : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
          }`}
          aria-label="Toggle Average Bribe line"
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF9F66' }}></div>
          <span>Average Bribe</span>
        </button>
        {data.some((d) => d.reportingRate !== undefined) && (
          <button
            onClick={() => toggleLine('reportingRate')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
              visibleLines.reportingRate
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
            }`}
            aria-label="Toggle Reporting Rate line"
          >
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span>Reporting Rate</span>
          </button>
        )}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="year"
            tick={{ fill: '#64748B', fontSize: 12 }}
            axisLine={{ stroke: '#CBD5E1' }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: '#64748B', fontSize: 12 }}
            axisLine={{ stroke: '#CBD5E1' }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#64748B', fontSize: 12 }}
            axisLine={{ stroke: '#CBD5E1' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-neutral-700">{value}</span>
            )}
          />

          {visibleLines.totalReports && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="totalReports"
              stroke="#4A90E2"
              strokeWidth={3}
              dot={{ r: 4, fill: '#4A90E2' }}
              activeDot={{ r: 6 }}
              name="Total Reports"
              animationDuration={1000}
              animationBegin={300}
            />
          )}

          {visibleLines.averageBribe && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="averageBribe"
              stroke="#FF9F66"
              strokeWidth={3}
              dot={{ r: 4, fill: '#FF9F66' }}
              activeDot={{ r: 6 }}
              name="Average Bribe (KES)"
              animationDuration={1000}
              animationBegin={400}
            />
          )}

          {visibleLines.reportingRate &&
            data.some((d) => d.reportingRate !== undefined) && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="reportingRate"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10B981' }}
                activeDot={{ r: 6 }}
                name="Reporting Rate"
                animationDuration={1000}
                animationBegin={500}
              />
            )}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
