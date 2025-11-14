/**
 * County Types and Interfaces
 * Mulika Ufisadi - Corruption Reporting Platform
 */

export interface County {
  code: number;
  name: string;
  capital: string;
  region: string;
}

export interface CountyMapData {
  countyCode: number;
  countyName: string;
  reportCount: number;
  totalBribeAmount: number;
  topAgency: string;
  riskScore: number; // 0-100
}

export interface CountyGeoJSON {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: {
      COUNTY: string;
      CODE: number;
    };
    geometry: {
      type: 'Polygon' | 'MultiPolygon';
      coordinates: number[][][] | number[][][][];
    };
  }>;
}
