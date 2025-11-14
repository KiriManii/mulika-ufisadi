import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  MapPin,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  onToggleHeatmap?: () => void;
  onToggleBoundaries?: () => void;
  onSearch?: (location: string) => void;
  showHeatmap?: boolean;
  showBoundaries?: boolean;
  className?: string;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleHeatmap,
  onToggleBoundaries,
  onSearch,
  showHeatmap = true,
  showBoundaries = true,
  className = '',
}: MapControlsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const controlButtonClass =
    'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 shadow-md w-10 h-10 p-0 flex items-center justify-center';

  return (
    <div
      className={`absolute top-4 right-4 z-10 flex flex-col gap-3 ${className}`}
    >
      {/* Search Box */}
      <motion.div
        initial={false}
        animate={{
          width: isSearchOpen ? 280 : 40,
        }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {isSearchOpen ? (
          <form onSubmit={handleSearch} className="p-2">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm"
                icon={<Search className="w-4 h-4" />}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="px-2"
              >
                ✕
              </Button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`${controlButtonClass} rounded-lg`}
            aria-label="Search location"
          >
            <Search className="w-5 h-5" />
          </button>
        )}
      </motion.div>

      {/* Zoom Controls */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={onZoomIn}
          className={`${controlButtonClass} rounded-t-lg border-b-0`}
          aria-label="Zoom in"
          title="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={onZoomOut}
          className={controlButtonClass}
          aria-label="Zoom out"
          title="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={onResetView}
          className={`${controlButtonClass} rounded-b-lg border-t-0`}
          aria-label="Reset view"
          title="Reset view"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Layer Controls */}
      <div className="bg-white rounded-lg shadow-lg p-3 space-y-2">
        <h4 className="text-xs font-semibold text-neutral-700 mb-2 font-primary">
          Layers
        </h4>

        {/* Heatmap Toggle */}
        <button
          onClick={onToggleHeatmap}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            showHeatmap
              ? 'bg-primary-50 text-primary-700 border border-primary-200'
              : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
          }`}
          aria-label="Toggle heatmap"
          aria-pressed={showHeatmap}
        >
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
              showHeatmap ? 'bg-primary-500' : 'bg-neutral-300'
            }`}
          >
            {showHeatmap && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
          <Layers className="w-4 h-4" />
          <span className="flex-1 text-left font-medium">Heatmap</span>
        </button>

        {/* Boundaries Toggle */}
        <button
          onClick={onToggleBoundaries}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            showBoundaries
              ? 'bg-primary-50 text-primary-700 border border-primary-200'
              : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
          }`}
          aria-label="Toggle county boundaries"
          aria-pressed={showBoundaries}
        >
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
              showBoundaries ? 'bg-primary-500' : 'bg-neutral-300'
            }`}
          >
            {showBoundaries && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
          <MapPin className="w-4 h-4" />
          <span className="flex-1 text-left font-medium">Boundaries</span>
        </button>
      </div>

      {/* Help Text */}
      <div className="bg-white rounded-lg shadow-lg p-3">
        <p className="text-xs text-neutral-600">
          Click on a county to view detailed corruption statistics and reports.
        </p>
      </div>
    </div>
  );
}
