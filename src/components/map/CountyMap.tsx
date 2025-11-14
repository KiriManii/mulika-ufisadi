import { useState, useCallback } from 'react';
import Map, { Source, Layer, Popup, NavigationControl } from 'react-map-gl';
import type { MapLayerMouseEvent, ViewState } from 'react-map-gl';
import { motion } from 'framer-motion';
import type { CountyMapData, CountyGeoJSON } from '@/types/county';
import { Button } from '@/components/ui/Button';
import 'mapbox-gl/dist/mapbox-gl.css';

interface CountyMapProps {
  countyData: CountyMapData[];
  geoJsonData?: CountyGeoJSON;
  showHeatmap?: boolean;
  onCountyClick?: (countyCode: number) => void;
  className?: string;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const initialViewState: Partial<ViewState> = {
  longitude: 37.9062,
  latitude: 0.0236,
  zoom: 5.5,
  pitch: 0,
  bearing: 0,
};

export function CountyMap({
  countyData,
  geoJsonData,
  onCountyClick,
  className = '',
}: CountyMapProps) {
  const [viewState, setViewState] = useState<Partial<ViewState>>(initialViewState);
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    county: CountyMapData;
  } | null>(null);

  // Create a map of county code to data for quick lookup
  const countyDataMap = countyData.reduce((acc, county) => {
    acc[county.countyCode] = county;
    return acc;
  }, {} as Record<number, CountyMapData>);

  // County fill layer
  const countyFillLayer = {
    id: 'county-fills',
    type: 'fill' as const,
    source: 'counties',
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#4A90E2',
        [
          'interpolate',
          ['linear'],
          ['get', 'riskScore'],
          0,
          '#10B981',
          30,
          '#F59E0B',
          60,
          '#FF9F66',
          100,
          '#EF4444',
        ],
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.7,
        0.5,
      ],
    },
  };

  // County border layer
  const countyLineLayer = {
    id: 'county-borders',
    type: 'line' as const,
    source: 'counties',
    paint: {
      'line-color': '#334155',
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        3,
        1,
      ],
      'line-opacity': 0.8,
    },
  };

  // Handle county hover
  const onHover = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (feature && feature.properties) {
      // Change cursor to pointer
      if (event.target) {
        event.target.getCanvas().style.cursor = 'pointer';
      }
    }
  }, []);

  // Handle county leave
  const onLeave = useCallback((event: MapLayerMouseEvent) => {
    if (event.target) {
      event.target.getCanvas().style.cursor = '';
    }
  }, []);

  // Handle county click
  const onClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (feature && feature.properties) {
        const countyCode = feature.properties.CODE;
        const countyInfo = countyDataMap[countyCode];

        if (countyInfo) {
          // Set popup at click location
          setPopupInfo({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            county: countyInfo,
          });

          // Call parent callback
          if (onCountyClick) {
            onCountyClick(countyCode);
          }
        }
      }
    },
    [countyDataMap, onCountyClick]
  );

  // Enhance GeoJSON with county data
  const enhancedGeoJson = geoJsonData
    ? {
        ...geoJsonData,
        features: geoJsonData.features.map((feature) => {
          const countyCode = feature.properties.CODE;
          const data = countyDataMap[countyCode] || {
            reportCount: 0,
            totalBribeAmount: 0,
            riskScore: 0,
            topAgency: 'Unknown',
          };

          return {
            ...feature,
            properties: {
              ...feature.properties,
              ...data,
              riskScore: data.riskScore,
            },
          };
        }),
      }
    : null;

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `KES ${(amount / 1000000).toFixed(2)}M`;
    }
    if (amount >= 1000) {
      return `KES ${(amount / 1000).toFixed(0)}K`;
    }
    return `KES ${amount.toLocaleString()}`;
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={['county-fills']}
        onMouseMove={onHover}
        onMouseLeave={onLeave}
        onClick={onClick}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-left" />

        {enhancedGeoJson && (
          <Source id="counties" type="geojson" data={enhancedGeoJson}>
            <Layer {...(countyFillLayer as any)} />
            <Layer {...(countyLineLayer as any)} />
          </Source>
        )}

        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="county-popup"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 min-w-[250px]"
            >
              <h3 className="text-lg font-bold text-primary-700 mb-3 font-primary">
                {popupInfo.county.countyName}
              </h3>

              <div className="space-y-2 text-sm text-neutral-700">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Reports:</span>
                  <span className="font-semibold text-primary-600 font-secondary">
                    {popupInfo.county.reportCount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-semibold text-secondary-600 font-secondary">
                    {formatCurrency(popupInfo.county.totalBribeAmount)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Top Agency:</span>
                  <span className="font-semibold text-neutral-900">
                    {popupInfo.county.topAgency}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Risk Score:</span>
                  <span
                    className={`font-bold font-secondary ${
                      popupInfo.county.riskScore >= 70
                        ? 'text-red-600'
                        : popupInfo.county.riskScore >= 40
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {popupInfo.county.riskScore.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    if (onCountyClick) {
                      onCountyClick(popupInfo.county.countyCode);
                    }
                  }}
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          </Popup>
        )}
      </Map>

      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-4 z-10">
        <h4 className="text-sm font-semibold text-neutral-900 mb-3 font-primary">
          Risk Level
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded bg-green-500" />
            <span className="text-xs text-neutral-700">Low (0-30)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded bg-yellow-500" />
            <span className="text-xs text-neutral-700">Medium (30-60)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded bg-orange-500" />
            <span className="text-xs text-neutral-700">High (60-90)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded bg-red-500" />
            <span className="text-xs text-neutral-700">Critical (90-100)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
