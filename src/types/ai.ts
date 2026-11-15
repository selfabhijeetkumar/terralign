/**
 * TERRALIGN 2.0 — Multi-Model AI Types & Contracts
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * Supports Google Gemini, xAI Grok, and Dual Consensus Synthesis
 */

import type { PlanetaryBody } from './science';

export type AIProviderId = 'gemini' | 'groq' | 'grok' | 'dual' | 'deterministic';

export type AIExecutionStatus =
  | 'LIVE AI RESPONSE'
  | 'DETERMINISTIC FALLBACK'
  | 'API KEY MISSING'
  | 'INVALID CREDENTIALS'
  | 'RATE LIMITED / QUOTA EXHAUSTED'
  | 'PROVIDER UNAVAILABLE'
  | 'MOCKED TEST RESPONSE';

export type QualitativeConsensusLevel =
  | 'HIGH MODEL-ASSESSED / HEURISTIC ALIGNMENT'
  | 'HIGH MODEL-ASSESSED ALIGNMENT'
  | 'MODERATE PERSPECTIVE CONVERGENCE'
  | 'ANALYTICAL DIVERGENCE'
  | 'INSUFFICIENT COMPARATIVE EVIDENCE'
  | 'DETERMINISTIC SCIENTIFIC SYNTHESIS';

export interface DimensionAlignmentScore {
  dimension: 'terramechanics' | 'geomorphology' | 'environmental_hazards' | 'mission_suitability';
  scorePercent: number;
  basis: string;
}

export interface TerramechanicsAssessment {
  internalFrictionAngle?: string;
  cohesionKPa?: string;
  slipRiskPercent?: number;
  sinkageEstimateCm?: string;
  recommendedTractiveTirePressure?: string;
}

export interface ActiveDatasetAIContext {
  id: string;
  filename: string;
  format: string;
  rowCount: number;
  validCoordinateRows: number;
  planetaryBody: string;
  elevationStats: { min: number; max: number; mean: number; span: number };
  spatialBounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  qualityCompletenessPercent: number;
  detectedChannels: string[];
  sampleRecordsSummary?: string;
}

export interface AIModelContext {
  body?: PlanetaryBody;
  locationName?: string;
  coordinates?: { lat: number; lng: number };
  elevationMeters?: number;
  rvmDimensions?: {
    geological?: number;
    environmental?: number;
    physical?: number;
    operational?: number;
    temporal?: number;
  };
  currentRoute?: string;
  datasetContext?: {
    filename?: string;
    rowCount?: number;
    elevationRange?: { min: number; max: number };
    spatialBounds?: { minLat: number; maxLat: number; minLng: number; maxLng: number };
    completenessScore?: number;
    userNotes?: string;
  };
  activeDataset?: ActiveDatasetAIContext;
}

export interface AIModelQuery {
  prompt: string;
  mode?: AIProviderId;
  context?: AIModelContext;
  temperature?: number;
  maxTokens?: number;
}

export interface AIModelResponse {
  provider: AIProviderId;
  requestedProvider?: AIProviderId;
  actualProvider?: AIProviderId;
  crossProviderFallbackUsed?: boolean;
  fallbackRationale?: string;
  modelName: string;
  content: string;
  confidenceScore: number;
  executionStatus: AIExecutionStatus;
  errorMessage?: string;
  terramechanicsAssessment?: TerramechanicsAssessment;
  citations: string[];
  epistemicTag: string;
  processingTimeMs: number;
  timestamp: string;
  isFallback: boolean;
}

export interface AIComparisonResult {
  gemini: AIModelResponse;
  groq: AIModelResponse;
  grok?: AIModelResponse; // legacy compatibility alias
  consensusScore: number | null; // null if one or both are in fallback / missing credentials
  qualitativeConsensus: QualitativeConsensusLevel;
  scoringMethodology: string;
  dimensionScores: DimensionAlignmentScore[];
  commonConclusions: string[];
  contradictoryConclusions: string[];
  uncertainClaims: string[];
  missingEvidence: string[];
  consensusPoints: string[];
  divergencePoints: string[];
  synthesisRecommendation: string;
  timestamp: string;
  processingTimeMs: number;
  epistemicTag: string;
  bothModelsLive: boolean;
  requestedProvider?: AIProviderId;
  actualProvider?: AIProviderId;
  crossProviderFallbackUsed?: boolean;
  fallbackRationale?: string;
}
