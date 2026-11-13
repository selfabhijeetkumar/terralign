/**
 * TERRALIGN — Flagship Analog Landscape Knowledge Base & Query Engine
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/research/02-terrestrial-analog-landscapes.md & docs/research/03-mission-suitability.md
 */

import analogsData from '../../data/analogs.json';
import type { AnalogSite, MissionActivity } from '@/types/analogs';
import type { TargetBody, MissionFilters } from '@/types/store';

export const MISSION_ACTIVITIES: MissionActivity[] = [
  {
    id: 'rover_terramechanics',
    name: '1. Rover Terramechanics & Mobility',
    shortDescription: 'Traction, slip ratio & regolith bearing capacity',
    targetBody: 'both',
    keyFidelityMetrics: ['Wheel sinkage (z)', 'Cone penetration (qc)', 'Drawbar pull', 'Slip ratio'],
    optimalAnalogs: ['cinder-lake', 'askja-caldera'],
    realityGapPenaltyFactor: 0.12,
    tags: ['BASALTIC VOLCANIC', 'SLOPE >18°'],
  },
  {
    id: 'low_angle_lighting',
    name: '2. Lunar South Pole Low-Angle Lighting',
    shortDescription: 'Extreme shadow & glare simulation (0.0° - 5.0°)',
    targetBody: 'moon',
    keyFidelityMetrics: ['Slope aspect', 'Shadow persistence ratio', 'Forward-scatter albedo'],
    optimalAnalogs: ['cinder-lake', 'askja-caldera', 'hawaii-mauna-kea'],
    realityGapPenaltyFactor: 0.15,
    tags: ['POLAR SHADOWS', 'SOLAR GRAZING'],
  },
  {
    id: 'astronaut_eva',
    name: '3. EVA & Spacesuit Operations',
    shortDescription: 'Metabolic expenditure & terrain navigation',
    targetBody: 'both',
    keyFidelityMetrics: ['Met-rate energy (W)', 'Glove dexterity fatigue', 'Heart rate elevation'],
    optimalAnalogs: ['haughton-crater', 'hawaii-mauna-kea', 'askja-caldera'],
    realityGapPenaltyFactor: 0.18,
    tags: ['TRAVERSE DRILLS', 'ISOLATED TERRAIN'],
  },
  {
    id: 'cryo_drilling',
    name: '4. Cryogenic Volatile & Permafrost Drilling',
    shortDescription: 'Permanently shadowed region dry permafrost coring',
    targetBody: 'both',
    keyFidelityMetrics: ['Ground ice depth (10-30cm)', 'Sublimation rate', 'Shear strength'],
    optimalAnalogs: ['mcmurdo-dry-valleys', 'haughton-crater'],
    realityGapPenaltyFactor: 0.22,
    tags: ['DRY PERMAFROST', 'CRYOGENIC ICE'],
  },
  {
    id: 'lava_tubes',
    name: '5. Lava Tube Exploration',
    shortDescription: 'Subsurface morphology & comms attenuation',
    targetBody: 'both',
    keyFidelityMetrics: ['Cave diameter (5-20m)', 'Rock Mass Rating (RMR)', 'LiDAR reflectivity'],
    optimalAnalogs: ['hawaii-mauna-kea', 'askja-caldera'],
    realityGapPenaltyFactor: 0.08,
    tags: ['RADIATION SHELTER', 'VOLCANIC CONDUIT'],
  },
  {
    id: 'inverted_deltas',
    name: '6. Inverted Delta & Fluvial Science',
    shortDescription: 'Sedimentology & Jezero-like stratigraphy',
    targetBody: 'mars',
    keyFidelityMetrics: ['Channel curvature', 'Grain size distribution', 'Hematite concretions'],
    optimalAnalogs: ['utah-san-rafael'],
    realityGapPenaltyFactor: 0.10,
    tags: ['FLUVIAL CHANNELS', 'MOQUI MARBLES'],
  },
  {
    id: 'hyper_arid_astrobiology',
    name: '7. Hyper-Arid Astrobiology & Life Detection',
    shortDescription: 'Trace organics & perchlorate biomarker preservation',
    targetBody: 'mars',
    keyFidelityMetrics: ['TOC < 10 ppm', 'Perchlorate (wt%)', 'Water activity (aw < 0.6)'],
    optimalAnalogs: ['atacama-desert', 'mcmurdo-dry-valleys'],
    realityGapPenaltyFactor: 0.14,
    tags: ['PERCHLORATES', 'TOC <10 PPM'],
  },
  {
    id: 'landing_hazards',
    name: '8. Landing Hazard Detection',
    shortDescription: 'Slope distribution & cumulative boulder fields',
    targetBody: 'both',
    keyFidelityMetrics: ['Crater CSFD', 'Boulder fractional area (Cf)', 'Slope hazard >15°'],
    optimalAnalogs: ['cinder-lake', 'haughton-crater', 'askja-caldera'],
    realityGapPenaltyFactor: 0.11,
    tags: ['BOULDER FIELDS', 'CRATER DENSITY'],
  },
  {
    id: 'isru_sintering',
    name: '9. ISRU & Regolith Sintering',
    shortDescription: 'Feedstock extraction & microwave thermal processing',
    targetBody: 'both',
    keyFidelityMetrics: ['Glass-to-crystal ratio', 'TiO2 wt%', 'Grain size (D50 ~ 70μm)'],
    optimalAnalogs: ['hawaii-mauna-kea', 'askja-caldera', 'cinder-lake'],
    realityGapPenaltyFactor: 0.16,
    tags: ['BASALTIC GLASS', 'ILMENITE FEEDSTOCK'],
  },
];

export const ALL_ANALOG_SITES: AnalogSite[] = analogsData as AnalogSite[];

export function getAllAnalogs(): AnalogSite[] {
  return ALL_ANALOG_SITES;
}

export function getAnalogById(id: string): AnalogSite | undefined {
  return ALL_ANALOG_SITES.find((site) => site.id === id);
}

export function getAllActivities(): MissionActivity[] {
  return MISSION_ACTIVITIES;
}

export function getActivityById(id: string): MissionActivity | undefined {
  return MISSION_ACTIVITIES.find((act) => act.id === id);
}

/**
 * Filter and rank analog sites based on active planetary target, operational activity, and filters
 */
export function filterAndRankAnalogs(
  targetBody: TargetBody,
  activityId: string,
  filters?: MissionFilters
): Array<{ site: AnalogSite; score: number; confidence: number; isOptimal: boolean }> {
  return ALL_ANALOG_SITES.map((site) => {
    // Body relevance multiplier (1.0 if match or both; 0.6 if opposite)
    const bodyMatch = site.targetBody === 'both' || site.targetBody === targetBody;
    const bodyMultiplier = bodyMatch ? 1.0 : 0.65;

    // Base suitability score for activity
    const baseScore = site.suitabilityScores[activityId] ?? 0.5;
    const confidence = site.confidenceScores[activityId] ?? 0.7;

    let score = baseScore * bodyMultiplier;

    // Apply optional filters if specified
    if (filters?.minResolutionMeters && site.demResolutionMeters > filters.minResolutionMeters) {
      score *= 0.85; // Penalty for coarse resolution
    }

    const activity = getActivityById(activityId);
    const isOptimal = (activity?.optimalAnalogs.includes(site.id) ?? false) && bodyMatch;

    return {
      site,
      score: Math.round(score * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      isOptimal,
    };
  }).sort((a, b) => b.score - a.score);
}
