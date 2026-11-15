/**
 * TERRALIGN — Scientific Intelligence & Planetary Interpretation Layer
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * Provides deterministic, source-grounded scientific interpretations
 * based on real elevation, terramechanics principles, and planetary physics.
 */

import type { PlanetaryBody, ScientificInterpretation } from '@/types/science';

interface InterpretParams {
  body: PlanetaryBody;
  locationName: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  datasetName: string;
  nominalResolutionMeters: number;
}

export function generateScientificInterpretation(params: InterpretParams): ScientificInterpretation {
  const {
    body,
    locationName,
    latitude,
    longitude,
    elevationMeters,
    datasetName,
    nominalResolutionMeters,
  } = params;

  if (body === 'earth') {
    const isHighElevation = elevationMeters > 2000;
    const isVolcanic =
      locationName.toLowerCase().includes('cinder') ||
      locationName.toLowerCase().includes('askja') ||
      locationName.toLowerCase().includes('mauna');

    return {
      body: 'earth',
      locationName,
      latitude,
      longitude,
      elevationMeters,
      geologicalContext: isVolcanic
        ? `Basaltic volcanic terrain characterized by vesicular scoria, cinder cone deposits, and fine basaltic pyroclastic tephra. Topographic datum reflects ${elevationMeters.toFixed(1)}m elevation relative to NAVD88.`
        : `Terrestrial analog terrain situated at ${elevationMeters.toFixed(1)}m elevation, exhibiting fluvial/alluvial incision and sedimentary rock strata relevant to rover mobility testing.`,
      terramechanicsImplications:
        'Bekker-Wong terramechanics parameters: Internal friction angle φ ≈ 32°–38°, cohesion c ≈ 0.4–1.2 kPa. High sinkage risk on loose cinder slopes (>15° inclination). High wheel slip anticipated on uncompacted pyroclastic layers.',
      environmentalHazards: [
        'Terrestrial atmospheric drag (101.3 kPa) masks vacuum-related electrostatic cohesion effects.',
        'High moisture content in terrestrial soil alters pore pressure relative to hyper-dry lunar/martian vacuum conditions.',
        'Earth 1.0g gravity field suppresses wheel-slip dynamic bounce observed under lunar (0.166g) or martian (0.376g) conditions.',
      ],
      analogRelevanceScore: 84.5,
      sourceGrounding: [
        `Elevation derived from ${datasetName} (${nominalResolutionMeters}m nominal resolution).`,
        `Latitude ${latitude.toFixed(4)}°, Longitude ${longitude.toFixed(4)}°.`,
        'Apollo Lunar Surface Drill & Lunar Roving Vehicle (LRV) field trials baseline.',
      ],
      disclaimer:
        'SYNTHESIZED SCIENTIFIC INTERPRETATION: Grounded in peer-reviewed terramechanics literature (Bekker, 1960; Carrier et al., 1991). Not an operational flight-readiness certification.',
    };
  }

  if (body === 'moon') {
    const isPolar = Math.abs(latitude) >= 80;
    const isDepression = elevationMeters < 0;

    return {
      body: 'moon',
      locationName: locationName || (isPolar ? 'Lunar South Polar Region' : 'Lunar Equatorial Regolith Plain'),
      latitude,
      longitude,
      elevationMeters,
      geologicalContext: isPolar
        ? `South Pole-Aitken (SPA) basin rim terrain situated at ${elevationMeters.toFixed(1)}m relative to the 1,737.4 km lunar sphere. Steep crater interior walls (28°–34°) with cryogenic permanently shadowed regions (PSRs) exhibiting temperatures down to 40 K (-233°C).`
        : `Impact-pulverized lunar regolith highland/mare surface situated at ${elevationMeters.toFixed(1)}m elevation. Layered ejecta blanket and agglutinate-rich fine particle matrix.`,
      terramechanicsImplications:
        'Lunar regolith mechanics: Median grain size d50 ≈ 70 µm. High interlocking friction angle (φ ≈ 35°–48°) at depth due to jagged agglutinate morphology. Low cohesion (c ≈ 0.1–1.0 kPa) in top 10 cm, increasing to >3.0 kPa at >30 cm depth. Wheel sinkage mitigated by sub-surface density packing.',
      environmentalHazards: [
        'Ultra-high vacuum (<10^-10 Pa) induces cold-welding and high electrostatic adhesion of jagged abrasive dust particles.',
        'Cryogenic thermal regimes (<50 K in PSRs) cause severe embrittlement of elastomer seals and battery performance collapse.',
        'Low gravity (0.166g) drastically reduces normal force, amplifying wheel spin and tractive slip on slopes exceeding 15°.',
        'Continuous deep shadows eliminate optical hazard avoidance; requires active LiDAR and LED illumination navigation.',
      ],
      analogRelevanceScore: 92.0,
      sourceGrounding: [
        `Topographic elevation referenced to NASA LRO LOLA (${datasetName}).`,
        `Lunar reference sphere datum: R_ref = 1,737,400.0 m.`,
        'NASA Artemis South Pole Site Evaluation and Apollo regolith core samples (LPI/JSC).',
      ],
      disclaimer:
        'SYNTHESIZED SCIENTIFIC INTERPRETATION: Derived from NASA LRO LOLA gridded topography and Lunar Sourcebook (Heiken et al., 1991). Procedural visualization is parameterized, not raw raster tiles.',
    };
  }

  // Mars
  const isJezero = Math.abs(latitude - 18.38) < 1.0 && Math.abs(longitude - 77.58) < 1.0;

  return {
    body: 'mars',
    locationName: locationName || (isJezero ? 'Jezero Crater Delta Scarp' : 'Martian Regolith Plain'),
    latitude,
    longitude,
    elevationMeters,
    geologicalContext: isJezero
      ? `Fluvial deltaic deposit within Jezero paleolake basin, elevation ${elevationMeters.toFixed(1)}m relative to MOLA areoid. Prominent bottomset, foreset, and topset bedded sedimentary stratigraphy with smectite clay and olivine carbonates.`
      : `Martian basaltic plain situated at ${elevationMeters.toFixed(1)}m relative to MOLA areoid datum. Characterized by impact ejecta blocks, deflation ripples, and wind-sculpted yardangs.`,
    terramechanicsImplications:
      'Martian regolith mechanics: Cohesive sand-silt matrix (φ ≈ 30°–35°, c ≈ 0.5–2.0 kPa). Rippled bedforms and megaripples present severe rover entrapment risks (as observed by Spirit at Troy and Opportunity at Purgatory Ripple). Bearing capacity adequate on duricrust but vulnerable to break-through.',
    environmentalHazards: [
      'Low atmospheric pressure (~6.1 mbar CO2) limits convective cooling, causing motor thermal spikes during prolonged slope ascents.',
      'Global dust storm events reduce solar array power output by >95% and degrade optical sensors.',
      'Intermediate gravity (0.376g) alters rollover margins and wheel slip dynamics relative to terrestrial trials.',
      'Surface perchlorates (0.5–1.0 wt%) present chemical oxidation hazards to exposed hardware materials.',
    ],
    analogRelevanceScore: 88.0,
    sourceGrounding: [
      `Elevation referenced to NASA MGS MOLA MEGDR (${datasetName}).`,
      `Martian reference datum: Areoid equipotential surface (GMM-3).`,
      'NASA Mars 2020 Perseverance Science Operations and Mars Exploration Rover engineering telemetry.',
    ],
    disclaimer:
      'SYNTHESIZED SCIENTIFIC INTERPRETATION: Derived from NASA MGS MOLA / MRO HiRISE published datasets and Mars terramechanics engineering models. Procedural visualization is parameterized, not raw raster tiles.',
  };
}
