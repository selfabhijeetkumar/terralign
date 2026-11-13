/**
 * TERRALIGN — Analog Site & Scientific Dataset Types
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/research/02-terrestrial-analog-landscapes.md & docs/design/prototype-data-register.md
 */

import type { TargetBody } from './store';

export type EpistemicClassification =
  | 'VERIFIED SOURCE DATA'
  | 'DERIVED FROM VERIFIED DATA'
  | 'ILLUSTRATIVE DEMO DATA'
  | 'UNVALIDATED HYPOTHESIS'
  | 'UNCHARACTERIZED';

export interface RealityGapAxes {
  gravityDisparityPercent: number; // e.g. 83.5% for Moon
  pressureDivergencePercent: number; // e.g. 100% for Moon
  thermalSpreadC: number; // e.g. 218°C
  solarFluxGainPercent: number; // e.g. 26.5%
  radiationFluxMSvPerYear: number; // e.g. 380 mSv/yr
  regolithCohesionKPa: number; // e.g. 0.5 - 2.0 kPa
}

export interface AnalogSite {
  id: string;
  name: string;
  shortName: string;
  region: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  elevationMeters: number;
  elevationDescription: string;
  targetBody: 'moon' | 'mars' | 'both';
  primaryMissionRelevance: string;
  geologicalSetting: string;
  geomorphology: string;
  environmentalRegime: string;
  operationalHeritage: string;
  demResolutionMeters: number;
  demSource: string;
  literatureCitations: Array<{
    title: string;
    authors: string;
    year: number;
    citation: string;
    doiOrReport: string;
  }>;
  suitabilityScores: Record<string, number>; // Activity ID -> score [0.0 - 1.0]
  confidenceScores: Record<string, number>; // Activity ID -> coverage [0.0 - 1.0]
  dimensions: {
    geological: number;
    geomorphological: number;
    environmental: number;
    operational: number;
    taskSpecific: number;
  };
  realityGaps: RealityGapAxes;
  classification: EpistemicClassification;
}

export interface MissionActivity {
  id: string;
  name: string;
  shortDescription: string;
  targetBody: TargetBody | 'both';
  keyFidelityMetrics: string[];
  optimalAnalogs: string[]; // Site IDs
  realityGapPenaltyFactor: number;
  tags: string[];
}
