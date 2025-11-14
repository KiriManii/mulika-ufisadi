import React from 'react';
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

interface AgencyData {
  name: string;
  score: number; // 0-100
  reportCount: number;
}

interface AgencyRankingProps {
  data: AgencyData[];
  className?: string;
}

export function AgencyRanking({ data, className = '' }: AgencyRankingProps) {
  // Function to determine bar color based on score
  const getBarColor = (score: number): string => {
    if (score >= 70) return '#EF4444'; // danger - high corruption
    if (score >= 50) return '#F59E0B'; // warning - medium corruption
    if (score >= 30) return '#FF9F66'; // secondary - moderate
    return '#10B981'; // success - low corruption
  };

  // Sort data by score in descending order
  const sortedData = [...data].sort((a, b) => b.score - a.score);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-neutral-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-neutral-900 mb-1">{data.name}</p>
          <p className="text-sm text-neutral-600">
            Corruption Score: <span className="font-bold">{data.score}</span>
          </p>
          <p className="text-sm text-neutral-600">
            Reports: <span className="font-bold">{data.reportCount.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: '#64748B', fontSize: 12 }}
            axisLine={{ stroke: '#CBD5E1' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#334155', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={{ stroke: '#CBD5E1' }}
            width={90}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
          <Bar
            dataKey="score"
            radius={[0, 8, 8, 0]}
            animationDuration={1000}
            animationBegin={200}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-danger"></div>
          <span className="text-xs text-neutral-600">High (&ge;70)</span>
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
