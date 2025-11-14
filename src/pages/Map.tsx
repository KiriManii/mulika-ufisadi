import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, TrendingUp, AlertTriangle, X } from 'lucide-react';
import { CountyMap } from '@/components/map/CountyMap';
import { Heatmap, type HeatmapPoint } from '@/components/map/Heatmap';
import { MapControls } from '@/components/map/MapControls';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { CountyMapData, CountyGeoJSON } from '@/types/county';
import { COUNTIES } from '@/constants/counties';

// Sample county coordinates for map visualization
const COUNTY_COORDINATES: Record<number, { lat: number; lng: number }> = {
  1: { lat: -4.0435, lng: 39.6682 }, // Mombasa
  22: { lat: -1.1645, lng: 36.8347 }, // Kiambu
  32: { lat: -0.3031, lng: 36.08 }, // Nakuru
  42: { lat: -0.0917, lng: 34.7679 }, // Kisumu
  47: { lat: -1.2864, lng: 36.8172 }, // Nairobi
  27: { lat: 0.5143, lng: 35.2698 }, // Uasin Gishu
  16: { lat: -1.5177, lng: 37.2634 }, // Machakos
  12: { lat: 0.0524, lng: 37.6525 }, // Meru
  37: { lat: 0.2827, lng: 34.7519 }, // Kakamega
  3: { lat: -3.6309, lng: 39.8453 }, // Kilifi
};

// Generate sample county map data
function generateSampleCountyData(): CountyMapData[] {
  return COUNTIES.map((county) => ({
    countyCode: county.code,
    countyName: county.name,
    reportCount: Math.floor(Math.random() * 500) + 10,
    totalBribeAmount: Math.floor(Math.random() * 10000000) + 100000,
    topAgency: ['Police', 'Land Services', 'Motor Vehicle', 'Judiciary'][
      Math.floor(Math.random() * 4)
    ],
    riskScore: Math.random() * 100,
  }));
}

// Generate simplified GeoJSON for Kenya counties (demo version)
function generateSimplifiedGeoJSON(countyData: CountyMapData[]): CountyGeoJSON {
  return {
    type: 'FeatureCollection',
    features: countyData
      .filter((data) => COUNTY_COORDINATES[data.countyCode])
      .map((data) => {
        const coords = COUNTY_COORDINATES[data.countyCode];
        const offset = 0.5; // Approximate county size

        return {
          type: 'Feature',
          properties: {
            COUNTY: data.countyName,
            CODE: data.countyCode,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [coords.lng - offset, coords.lat - offset],
                [coords.lng + offset, coords.lat - offset],
                [coords.lng + offset, coords.lat + offset],
                [coords.lng - offset, coords.lat + offset],
                [coords.lng - offset, coords.lat - offset],
              ],
            ],
          },
        };
      }),
  };
}

// Generate heatmap data from county data
function generateHeatmapData(countyData: CountyMapData[]): HeatmapPoint[] {
  const points: HeatmapPoint[] = [];

  countyData.forEach((data) => {
    const coords = COUNTY_COORDINATES[data.countyCode];
    if (coords) {
      // Add multiple points based on report count for better heatmap effect
      const numPoints = Math.ceil(data.reportCount / 50);
      for (let i = 0; i < numPoints; i++) {
        points.push({
          lat: coords.lat + (Math.random() - 0.5) * 0.3,
          lng: coords.lng + (Math.random() - 0.5) * 0.3,
          weight: data.riskScore,
        });
      }
    }
  });

  return points;
}

export function Map() {
  const mapRef = useRef<any>(null);
  const [countyData, setCountyData] = useState<CountyMapData[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<CountyGeoJSON | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [selectedCountyDetails, setSelectedCountyDetails] =
    useState<CountyMapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const sampleCountyData = generateSampleCountyData();
        const geoJson = generateSimplifiedGeoJSON(sampleCountyData);
        const heatmap = generateHeatmapData(sampleCountyData);

        setCountyData(sampleCountyData);
        setGeoJsonData(geoJson);
        setHeatmapData(heatmap);
      } catch (error) {
        console.error('Error loading map data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle county click
  const handleCountyClick = (countyCode: number) => {
    const county = countyData.find((c) => c.countyCode === countyCode);
    if (county) {
      setSelectedCountyDetails(county);
    }
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    // Zoom in logic would be handled by map instance
    console.log('Zoom in');
  };

  const handleZoomOut = () => {
    // Zoom out logic would be handled by map instance
    console.log('Zoom out');
  };

  const handleResetView = () => {
    // Reset view logic
    console.log('Reset view');
  };

  const handleSearch = (location: string) => {
    // Search logic - could use Mapbox geocoding API
    console.log('Search for:', location);
  };

  // Calculate statistics
  const totalReports = countyData.reduce(
    (sum, county) => sum + county.reportCount,
    0
  );
  const totalAmount = countyData.reduce(
    (sum, county) => sum + county.totalBribeAmount,
    0
  );
  const averageRisk =
    countyData.reduce((sum, county) => sum + county.riskScore, 0) /
    countyData.length;
  const highRiskCounties = countyData.filter(
    (county) => county.riskScore >= 70
  ).length;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `KES ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `KES ${(amount / 1000).toFixed(0)}K`;
    }
    return `KES ${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
          <p className="text-neutral-700">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Stats */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-primary-700 mb-4 font-primary">
            Corruption Map of Kenya
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-neutral-700">Total Reports</span>
              </div>
              <p className="text-2xl font-bold text-primary-700 font-secondary">
                {totalReports.toLocaleString()}
              </p>
            </div>

            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-secondary-600" />
                <span className="text-sm text-neutral-700">Total Amount</span>
              </div>
              <p className="text-2xl font-bold text-secondary-700 font-secondary">
                {formatCurrency(totalAmount)}
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-neutral-700">Average Risk</span>
              </div>
              <p className="text-2xl font-bold text-yellow-700 font-secondary">
                {averageRisk.toFixed(1)}
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-neutral-700">High Risk</span>
              </div>
              <p className="text-2xl font-bold text-red-700 font-secondary">
                {highRiskCounties} Counties
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative" style={{ height: 'calc(100vh - 240px)' }}>
        <CountyMap
          ref={mapRef}
          countyData={countyData}
          geoJsonData={showBoundaries ? geoJsonData || undefined : undefined}
          showHeatmap={showHeatmap}
          onCountyClick={handleCountyClick}
          className="w-full h-full"
        />

        {showHeatmap && heatmapData.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Heatmap would be rendered as a layer in the map */}
          </div>
        )}

        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
          onToggleBoundaries={() => setShowBoundaries(!showBoundaries)}
          onSearch={handleSearch}
          showHeatmap={showHeatmap}
          showBoundaries={showBoundaries}
        />

        {/* County Details Sidebar */}
        <AnimatePresence>
          {selectedCountyDetails && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-20 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-primary-700 font-primary">
                    {selectedCountyDetails.countyName}
                  </h2>
                  <button
                    onClick={() => setSelectedCountyDetails(null)}
                    className="p-1 hover:bg-neutral-100 rounded"
                    aria-label="Close details"
                  >
                    <X className="w-5 h-5 text-neutral-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  <Card className="bg-primary-50 border border-primary-200">
                    <div className="text-sm text-neutral-700 mb-1">
                      Total Reports
                    </div>
                    <div className="text-3xl font-bold text-primary-700 font-secondary">
                      {selectedCountyDetails.reportCount.toLocaleString()}
                    </div>
                  </Card>

                  <Card className="bg-secondary-50 border border-secondary-200">
                    <div className="text-sm text-neutral-700 mb-1">
                      Total Bribe Amount
                    </div>
                    <div className="text-3xl font-bold text-secondary-700 font-secondary">
                      {formatCurrency(selectedCountyDetails.totalBribeAmount)}
                    </div>
                  </Card>

                  <Card
                    className={`border ${
                      selectedCountyDetails.riskScore >= 70
                        ? 'bg-red-50 border-red-200'
                        : selectedCountyDetails.riskScore >= 40
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="text-sm text-neutral-700 mb-1">
                      Risk Score
                    </div>
                    <div
                      className={`text-3xl font-bold font-secondary ${
                        selectedCountyDetails.riskScore >= 70
                          ? 'text-red-700'
                          : selectedCountyDetails.riskScore >= 40
                          ? 'text-yellow-700'
                          : 'text-green-700'
                      }`}
                    >
                      {selectedCountyDetails.riskScore.toFixed(1)}
                    </div>
                    <div className="mt-2 text-xs text-neutral-600">
                      {selectedCountyDetails.riskScore >= 70
                        ? 'Critical - Immediate attention required'
                        : selectedCountyDetails.riskScore >= 40
                        ? 'High - Monitoring recommended'
                        : 'Low - Within acceptable range'}
                    </div>
                  </Card>

                  <Card>
                    <div className="text-sm text-neutral-700 mb-2">
                      Most Corrupt Agency
                    </div>
                    <div className="text-xl font-bold text-neutral-900">
                      {selectedCountyDetails.topAgency}
                    </div>
                  </Card>

                  <Button variant="primary" size="lg" fullWidth>
                    View Detailed Reports
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Footer */}
      <div className="bg-white border-t border-neutral-200 px-6 py-4">
        <div className="container mx-auto">
          <p className="text-sm text-neutral-600 text-center">
            This map shows corruption reports and risk levels across Kenya's 47
            counties. Click on any county for detailed statistics.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Map;
