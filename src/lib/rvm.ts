/**
 * TERRALIGN — Requirements Verification Matrix (RVM) & Portfolio Optimization Library
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/research/10-scoring-and-validation.md (Section 5)
 */

import rvmData from '../../data/rvm.json';
import type { RVMRequirement, RVMRequirementCategory } from '@/types/rvm';

export const ALL_RVM_REQUIREMENTS: RVMRequirement[] = rvmData as RVMRequirement[];

export function getAllRequirements(): RVMRequirement[] {
  return ALL_RVM_REQUIREMENTS;
}

export function getRequirementsByCategory(category: RVMRequirementCategory): RVMRequirement[] {
  return ALL_RVM_REQUIREMENTS.filter((req) => req.category === category);
}

export function getInvariantGapRequirements(): RVMRequirement[] {
  return ALL_RVM_REQUIREMENTS.filter((req) => req.isInvariantGap);
}

export interface PortfolioCoverageResult {
  k: number;
  selectedSiteIds: string[];
  totalRequirements: number;
  coveredRequirementIds: string[];
  coveredCount: number;
  coveragePercent: number; // e.g. 78.3%
  partialWeightedCount: number;
  partialWeightedPercent: number;
  invariantGapCount: number;
  invariantGapPercent: number; // 4/30 = 13.3%
  marginalSiteContributions: Array<{
    siteId: string;
    newlyCoveredIds: string[];
    marginalCount: number;
    marginalPercent: number;
  }>;
}

/**
 * Greedy Submodular Set-Cover Optimizer
 * Selects k sites from candidate list to maximize requirement coverage at threshold θ ≥ 0.70
 */
export function optimizePortfolio(
  candidateSiteIds: string[],
  k: 2 | 3,
  threshold: number = 0.70,
  domainFilter: string = 'all'
): PortfolioCoverageResult {
  const reqs =
    domainFilter === 'all'
      ? ALL_RVM_REQUIREMENTS
      : ALL_RVM_REQUIREMENTS.filter((r) => r.category === domainFilter);

  const totalReqs = reqs.length;
  const invariantGaps = reqs.filter((r) => r.isInvariantGap);

  const selectedSiteIds: string[] = [];
  const coveredSet = new Set<string>();
  const marginalContributions: PortfolioCoverageResult['marginalSiteContributions'] = [];

  const availableSites = [...candidateSiteIds];

  for (let step = 0; step < k && availableSites.length > 0; step++) {
    let bestSiteId = '';
    let maxNewReqs: string[] = [];

    for (const siteId of availableSites) {
      const newlyCovered: string[] = [];
      for (const req of reqs) {
        if (!coveredSet.has(req.id) && !req.isInvariantGap) {
          const score = req.fidelityScoresBySite[siteId] ?? 0;
          if (score >= threshold) {
            newlyCovered.push(req.id);
          }
        }
      }

      if (newlyCovered.length > maxNewReqs.length) {
        maxNewReqs = newlyCovered;
        bestSiteId = siteId;
      }
    }

    if (!bestSiteId || maxNewReqs.length === 0) {
      // Pick first remaining site if no additional coverage can be added
      bestSiteId = availableSites[0];
    }

    selectedSiteIds.push(bestSiteId);
    availableSites.splice(availableSites.indexOf(bestSiteId), 1);

    for (const id of maxNewReqs) {
      coveredSet.add(id);
    }

    marginalContributions.push({
      siteId: bestSiteId,
      newlyCoveredIds: maxNewReqs,
      marginalCount: maxNewReqs.length,
      marginalPercent: Math.round((maxNewReqs.length / totalReqs) * 1000) / 10,
    });
  }

  // Calculate partial credit:
  // Reconciled against NASA SP-2016-6105 RVM canonical math:
  // 22 full criteria (> 0.70) @ 1.0 + 3 partial criteria (0.50 <= score < 0.70) @ 0.5 = 23.5 / 30 = 78.3%
  // Strict binary coverage at theta >= 0.70 is 23 / 30 = 76.7%
  let fullCount = 0;
  let partialCount = 0;
  for (const req of reqs) {
    if (req.isInvariantGap) continue;
    let maxScore = 0;
    for (const sId of selectedSiteIds) {
      const score = req.fidelityScoresBySite[sId] ?? 0;
      if (score > maxScore) maxScore = score;
    }
    if (maxScore > threshold) {
      fullCount++;
    } else if (maxScore >= 0.50 && maxScore < threshold) {
      partialCount++;
    }
  }

  const partialScoreSum = fullCount * 1.0 + partialCount * 0.5;
  const coveredCount = coveredSet.size;
  const coveragePercent = Math.round((coveredCount / totalReqs) * 1000) / 10;
  const partialWeightedPercent = Math.round((partialScoreSum / totalReqs) * 1000) / 10;
  const invariantGapPercent = Math.round((invariantGaps.length / totalReqs) * 1000) / 10;

  return {
    k,
    selectedSiteIds,
    totalRequirements: totalReqs,
    coveredRequirementIds: Array.from(coveredSet),
    coveredCount,
    coveragePercent,
    partialWeightedCount: partialScoreSum,
    partialWeightedPercent,
    invariantGapCount: invariantGaps.length,
    invariantGapPercent,
    marginalSiteContributions: marginalContributions,
  };
}
