import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'chart' | 'map';
  count?: number;
  className?: string;
}

export function SkeletonLoader({
  variant = 'text',
  count = 1,
  className = ''
}: SkeletonLoaderProps) {
  const renderTextSkeleton = () => (
    <div className={`space-y-3 ${className}`}>
      <div className="h-4 bg-neutral-200 animate-pulse rounded w-full" />
      <div className="h-4 bg-neutral-200 animate-pulse rounded w-5/6" />
      <div className="h-4 bg-neutral-200 animate-pulse rounded w-4/6" />
    </div>
  );

  const renderCardSkeleton = () => (
    <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-neutral-200 animate-pulse rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-neutral-200 animate-pulse rounded w-3/4" />
            <div className="h-3 bg-neutral-200 animate-pulse rounded w-1/2" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="h-3 bg-neutral-200 animate-pulse rounded w-full" />
          <div className="h-3 bg-neutral-200 animate-pulse rounded w-5/6" />
          <div className="h-3 bg-neutral-200 animate-pulse rounded w-4/6" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="h-8 w-24 bg-neutral-200 animate-pulse rounded" />
          <div className="h-8 w-24 bg-neutral-200 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );

  const renderChartSkeleton = () => (
    <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      <div className="space-y-4">
        {/* Chart title */}
        <div className="h-6 bg-neutral-200 animate-pulse rounded w-1/3" />

        {/* Chart area */}
        <div className="h-64 bg-neutral-200 animate-pulse rounded" />

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-neutral-200 animate-pulse rounded" />
            <div className="h-3 w-16 bg-neutral-200 animate-pulse rounded" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-neutral-200 animate-pulse rounded" />
            <div className="h-3 w-16 bg-neutral-200 animate-pulse rounded" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-neutral-200 animate-pulse rounded" />
            <div className="h-3 w-16 bg-neutral-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMapSkeleton = () => (
    <div className={`relative w-full h-full min-h-[400px] bg-neutral-200 animate-pulse rounded-xl ${className}`}>
      {/* Map controls placeholder */}
      <div className="absolute top-4 right-4 space-y-2">
        <div className="w-10 h-10 bg-neutral-300 animate-pulse rounded shadow-lg" />
        <div className="w-10 h-10 bg-neutral-300 animate-pulse rounded shadow-lg" />
        <div className="w-10 h-10 bg-neutral-300 animate-pulse rounded shadow-lg" />
      </div>

      {/* Legend placeholder */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg space-y-2">
        <div className="h-3 w-24 bg-neutral-200 animate-pulse rounded" />
        <div className="flex items-center space-x-2">
          <div className="w-8 h-3 bg-neutral-200 animate-pulse rounded" />
          <div className="h-3 w-16 bg-neutral-200 animate-pulse rounded" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-3 bg-neutral-200 animate-pulse rounded" />
          <div className="h-3 w-16 bg-neutral-200 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return renderTextSkeleton();
      case 'card':
        return renderCardSkeleton();
      case 'chart':
        return renderChartSkeleton();
      case 'map':
        return renderMapSkeleton();
      default:
        return renderTextSkeleton();
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}
