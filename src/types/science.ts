/**
 * TERRALIGN — Scientific Data & Planetary Provider Types
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 */

export type PlanetaryBody = 'earth' | 'moon' | 'mars';

export type EpistemicDataCategory =
  | 'LIVE DATA'
  | 'CACHED DATA'
  | 'STATIC REFERENCE'
  | 'CALIBRATED MODEL'
  | 'PROCEDURAL MODEL';

export interface ScientificProviderMetadata {
  id: string;
  name: string;
  agency: string;
  description: string;
  supportedBodies: PlanetaryBody[];
  primaryEndpoints: string[];
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  authRequired: boolean;
  termsUrl: string;
}

export interface DatasetSpecification {
  id: string;
  name: string;
  body: PlanetaryBody;
  provider: string;
  productId: string;
  description: string;
  resolutionNominal: string;
  spatialCoverage: string;
  units: string;
  crs: string;
  availability: 'ONLINE' | 'DEGRADED' | 'ARCHIVED';
  citation: string;
  sourceUrl: string;
}

export interface ElevationPointQuery {
  body: PlanetaryBody;
  latitude: number;
  longitude: number;
  datasetId?: string;
}

export interface ElevationPointResult {
  body: PlanetaryBody;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  nominalResolutionMeters: number;
  datasetId: string;
  datasetName: string;
  provider: string;
  sourceUrl: string;
  productUrl?: string;
  observationTime?: string;
  crs: string;
  retrievalTimestamp: string;
  cacheStatus: EpistemicDataCategory;
  latencyMs: number;
  quality: {
    uncertaintyMeters?: number;
    noDataValue?: number;
    datumReference: string;
    pdsProductDiscovered?: string;
    pdsProductLiveVerified?: boolean;
    observationTime?: string;
  };
}

export interface ElevationTransectPoint {
  index: number;
  distanceMeters: number;
  latitude: number;
  longitude: number;
  elevationMeters: number;
}

export interface ElevationTransectResult {
  body: PlanetaryBody;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  sampleCount: number;
  totalDistanceMeters: number;
  points: ElevationTransectPoint[];
  minElevationMeters: number;
  maxElevationMeters: number;
  meanElevationMeters: number;
  elevationSpanMeters: number;
  datasetId: string;
  provider: string;
  cacheStatus: EpistemicDataCategory;
  retrievalTimestamp: string;
}

export interface TerrainGridQuery {
  body: PlanetaryBody;
  centerLat: number;
  centerLng: number;
  gridSize?: number; // 32, 48, 64, or 128 (default 64)
  spanMeters?: number; // spatial extent in meters (default 2000m)
  datasetId?: string;
}

export interface TerrainGridResult {
  body: PlanetaryBody;
  centerLat: number;
  centerLng: number;
  gridSize: number;
  spanMeters: number;
  stepMeters: number;
  matrix: number[][]; // 2D array [row][col] of elevation in meters
  minElevationMeters: number;
  maxElevationMeters: number;
  meanElevationMeters: number;
  elevationSpanMeters: number;
  centerElevationMeters?: number; // Measured empirical point datum anchor
  elevationMethod?: 'CALIBRATED_MORPHOMETRIC_SYNTHESIS' | 'RAW_RASTER_DEM';
  datasetId: string;
  datasetName: string;
  provider: string;
  crs: string;
  cacheStatus: EpistemicDataCategory;
  retrievalTimestamp: string;
}

export interface ProviderHealthReport {
  providerId: string;
  name: string;
  targetBody: PlanetaryBody;
  status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  lastChecked: string;
  endpoint: string;
  details?: string;
}

export interface ScientificInterpretation {
  body: PlanetaryBody;
  locationName: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  geologicalContext: string;
  terramechanicsImplications: string;
  environmentalHazards: string[];
  analogRelevanceScore: number;
  sourceGrounding: string[];
  disclaimer: string;
}
