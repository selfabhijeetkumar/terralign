/**
 * TERRALIGN 2.0 — User Dataset Intelligence Types
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * Supports CSV, TSV, JSON, GeoJSON, XLSX, and GeoTIFF formats.
 */

import type { PlanetaryBody } from './science';

export type SupportedDatasetFormat = 'csv' | 'tsv' | 'json' | 'geojson' | 'xlsx' | 'geotiff';

export interface SpatialBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  centerLat: number;
  centerLng: number;
}

export interface ElevationMetrics {
  minMeters: number;
  maxMeters: number;
  meanMeters: number;
  spanMeters: number;
}

export interface DatasetQualityMetrics {
  totalRows: number;
  validCoordinateRows: number;
  nullPercentage: number;
  elevationCoveragePercentage: number;
  completenessScore: number; // 0 - 100
  outlierCount: number;
  densityPointsPerKm2?: number;
}

export interface DetectedColumns {
  latitudeCol?: string;
  longitudeCol?: string;
  elevationCol?: string;
  timestampCol?: string;
  slipCol?: string;
  penetrometerCol?: string;
  otherCols: string[];
}

export interface GeoTIFFRasterMetadata {
  width: number;
  height: number;
  bandsCount: number;
  bitsPerSample: number[];
  crs: string;
  pixelScale?: [number, number, number];
  origin?: [number, number];
  noDataValue?: number;
  isProjectedCRS: boolean;
  elevationUnits: string;
}

export interface UserDatasetRecord {
  id: string;
  lat: number;
  lng: number;
  elevation?: number;
  timestamp?: string;
  slipRatio?: number;
  penetrometerPsi?: number;
  raw: Record<string, string | number | boolean | null>;
}

export interface UserDataset {
  id: string;
  filename: string;
  format: SupportedDatasetFormat;
  fileSizeBytes: number;
  uploadedAt: string;
  planetaryBody: PlanetaryBody | 'unspecified';
  columns: DetectedColumns;
  bounds: SpatialBounds;
  elevation: ElevationMetrics;
  quality: DatasetQualityMetrics;
  records: UserDatasetRecord[];
  availableSheets?: string[];
  activeSheet?: string;
  rasterMetadata?: GeoTIFFRasterMetadata;
  epistemicClassification: 'USER PROVIDED DATA';
}

export interface DatasetAIAnalysis {
  datasetId: string;
  recommendedAnalogSiteId: string;
  recommendedAnalogSiteName: string;
  matchScore: number; // 0 - 100
  terramechanicsRisk: {
    slipRiskPercent: number;
    soilTypeAssessment: string;
    sinkageHazard: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    frictionAngleDeg: number;
  };
  rvmDimensionalCorrelation: {
    geological: number;
    mechanical: number;
    environmental: number;
    operational: number;
  };
  observations: string[];
  operationalConstraints: string[];
  epistemicDisclaimer: string;
  generatedAt: string;
}
