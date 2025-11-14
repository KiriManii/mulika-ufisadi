import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'primary' | 'secondary' | 'success' | 'danger';
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  className = '',
}: StatsCardProps) {
  // Color mapping for icon background and text
  const colorClasses = {
    primary: {
      bg: 'bg-primary-100',
      text: 'text-primary-700',
      value: 'text-primary-500',
    },
    secondary: {
      bg: 'bg-secondary-100',
      text: 'text-secondary-700',
      value: 'text-secondary-500',
    },
    success: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      value: 'text-green-600',
    },
    danger: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      value: 'text-red-600',
    },
  };

  const colors = colorClasses[color];
  const isNumericValue = typeof value === 'number';

  return (
    <motion.div
      className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-500 mb-2">{title}</p>
          <div className={`text-3xl font-bold ${colors.value} mb-2`}>
            {isNumericValue ? (
              <AnimatedCounter end={value} duration={2000} />
            ) : (
              value
            )}
          </div>
          {trend && (
            <div className="flex items-center space-x-1">
              {trend.direction === 'up' ? (
                <svg
                  className="w-4 h-4 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-danger"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
              <span
                className={`text-sm font-medium ${
                  trend.direction === 'up' ? 'text-success' : 'text-danger'
                }`}
              >
                {trend.value}%
              </span>
              <span className="text-xs text-neutral-400">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center flex-shrink-0`}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
