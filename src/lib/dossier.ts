/**
 * TERRALIGN — Mission Planning Dossier Export Service
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/design/screen-04-portfolio-optimizer.md & prototype-data-register.md
 */

import type { AnalogSite } from '@/types/analogs';
import type { PortfolioCoverageResult } from '@/lib/rvm';

export interface MissionDossierData {
  title: string;
  generatedAt: string;
  exportFormatVersion: string;
  classification: string;
  governance: {
    authorization: string;
    methodology: string;
    scientificAuditReference: string;
  };
  missionOverview: {
    targetBody: string;
    activeActivity: string;
    primarySelectedSite: AnalogSite;
  };
  portfolioOptimization: {
    k: number;
    fidelityThreshold: number;
    activeDomainFilter: string;
    totalRVMParameters: number;
    coveredCount: number;
    binaryCoveragePercent: number;
    partialWeightedScore: number;
    partialWeightedPercent: number;
    terrestrialCeilingPercent: number;
    invariantGaps: {
      count: number;
      percentage: number;
      parameters: string[];
    };
    sites: Array<{
      siteId: string;
      siteName: string;
      marginalCriteriaCovered: number;
      marginalPercentage: number;
      coordinates: { lat: number; lng: number };
      elevationMeters: number;
      operationalRole: string;
    }>;
  };
}

export function generateMissionDossier(
  targetBody: string,
  activityName: string,
  selectedSite: AnalogSite,
  portfolioResult: PortfolioCoverageResult,
  siteLookup: Record<string, AnalogSite>,
  threshold: number,
  domainFilter: string
): MissionDossierData {
  return {
    title: 'TERRALIGN Mission Architecture & Analog Rehearsal Dossier',
    generatedAt: new Date().toISOString(),
    exportFormatVersion: '1.0.0-MVP',
    classification: 'UNCLASSIFIED / SCIENTIFIC BENCHMARK',
    governance: {
      authorization: 'TERRALIGN-GOV-AUTH-002',
      methodology: 'GSD v1.6.0',
      scientificAuditReference: 'docs/research/final-scientific-integrity-register.md',
    },
    missionOverview: {
      targetBody: targetBody.toUpperCase(),
      activeActivity: activityName,
      primarySelectedSite: selectedSite,
    },
    portfolioOptimization: {
      k: portfolioResult.k,
      fidelityThreshold: threshold,
      activeDomainFilter: domainFilter,
      totalRVMParameters: portfolioResult.totalRequirements,
      coveredCount: portfolioResult.coveredCount,
      binaryCoveragePercent: portfolioResult.coveragePercent,
      partialWeightedScore: portfolioResult.partialWeightedCount,
      partialWeightedPercent: portfolioResult.partialWeightedPercent,
      terrestrialCeilingPercent: 86.7,
      invariantGaps: {
        count: portfolioResult.invariantGapCount,
        percentage: portfolioResult.invariantGapPercent,
        parameters: [
          'High Cosmic Radiation (GCR + SPE)',
          'Atmospheric Hard Vacuum Tribology (~0 Pa)',
          'Partial Gravity Dynamics (1/6g & 3/8g Inertia)',
          'Cryogenic Permanently Shadowed Region (<40K)',
        ],
      },
      sites: portfolioResult.marginalSiteContributions.map((c) => {
        const site = siteLookup[c.siteId];
        return {
          siteId: c.siteId,
          siteName: site?.name || c.siteId,
          marginalCriteriaCovered: c.marginalCount,
          marginalPercentage: c.marginalPercent,
          coordinates: site?.coordinates || { lat: 0, lng: 0 },
          elevationMeters: site?.elevationMeters || 0,
          operationalRole: site?.primaryMissionRelevance || 'Mission Analog Testing',
        };
      }),
    },
  };
}

export function downloadDossierJson(data: MissionDossierData, filename: string): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

