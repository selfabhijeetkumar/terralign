/**
 * TERRALIGN — Requirements Verification Matrix (RVM) Types
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/research/10-scoring-and-validation.md (Section 5) & prototype-data-register.md
 */

export type RVMRequirementCategory =
  | 'mechanical'
  | 'optical'
  | 'geochemical'
  | 'environmental'
  | 'operational';

export interface RVMRequirement {
  id: string; // e.g. "REQ-GEO-001"
  code: string;
  name: string;
  description: string;
  category: RVMRequirementCategory;
  standardReference: string; // e.g. "NASA SP-2016-6105 / Artemis CONOPS"
  targetMetric: string;
  targetTolerance: string;
  isInvariantGap: boolean; // e.g. vacuum, 1/6th gravity, extreme cryo PSR
  coveredBySiteIds: string[]; // Site IDs satisfying this requirement at θ ≥ 0.70
  fidelityScoresBySite: Record<string, number>; // Site ID -> score [0.0 - 1.0]
}
