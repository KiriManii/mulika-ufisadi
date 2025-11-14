import { Source, Layer } from 'react-map-gl';
import type { HeatmapLayer } from 'mapbox-gl';

export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
}

interface HeatmapProps {
  data: HeatmapPoint[];
  intensity?: number;
  radius?: number;
  opacity?: number;
}

export function Heatmap({
  data,
  intensity = 1,
  radius = 30,
  opacity = 0.6,
}: HeatmapProps) {
  // Convert data to GeoJSON format
  const geoJsonData = {
    type: 'FeatureCollection' as const,
    features: data.map((point) => ({
      type: 'Feature' as const,
      properties: {
        weight: point.weight,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [point.lng, point.lat],
      },
    })),
  };

  // Heatmap layer configuration
  const heatmapLayer: HeatmapLayer = {
    id: 'heatmap-layer',
    type: 'heatmap',
    source: 'heatmap-source',
    maxzoom: 15,
    paint: {
      // Increase weight as zoom level increases
      'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['get', 'weight'],
        0,
        0,
        100,
        1,
      ],

      // Increase intensity as zoom level increases
      'heatmap-intensity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        intensity * 0.5,
        9,
        intensity,
      ],

      // Color gradient from blue (low) → yellow → orange → red (high)
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(33, 102, 172, 0)',
        0.2,
        'rgb(103, 169, 207)',
        0.4,
        'rgb(209, 229, 240)',
        0.6,
        'rgb(253, 219, 199)',
        0.8,
        'rgb(239, 138, 98)',
        0.9,
        'rgb(239, 59, 44)',
        1,
        'rgb(178, 24, 43)',
      ],

      // Adjust radius based on zoom level
      'heatmap-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        radius * 0.5,
        9,
        radius,
      ],

      // Adjust opacity based on zoom level
      'heatmap-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        7,
        opacity,
        15,
        opacity * 0.3,
      ],
    },
  };

  // Circle layer for individual points at high zoom levels
  const circleLayer = {
    id: 'heatmap-point',
    type: 'circle' as const,
    source: 'heatmap-source',
    minzoom: 14,
    paint: {
      // Size circle radius by weight
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', 'weight'],
        1,
        4,
        100,
        20,
      ],
      // Color circle by weight
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'weight'],
        1,
        'rgba(33, 102, 172, 0.7)',
        50,
        'rgba(253, 219, 199, 0.7)',
        100,
        'rgba(178, 24, 43, 0.7)',
      ],
      'circle-stroke-color': 'white',
      'circle-stroke-width': 1,
      'circle-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        14,
        0,
        15,
        0.8,
      ],
    },
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <Source id="heatmap-source" type="geojson" data={geoJsonData}>
      <Layer {...(heatmapLayer as any)} />
      <Layer {...(circleLayer as any)} />
    </Source>
  );
}
