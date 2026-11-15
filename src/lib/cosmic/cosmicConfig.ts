/**
 * TERRALIGN 2.0 — COSMIC ASCENSION
 * Configuration & Kill Switches Module
 *
 * Feature flags, tier thresholds, and route profiles for the cosmic visual systems.
 * All visual systems fail-open: if disabled or encountering an error, native UI/cursor persists.
 */

export type CosmicQualityTier = 'high' | 'medium' | 'low';

export type CosmicRouteProfileId =
  | 'mission'
  | 'terrain'
  | 'reality-gap'
  | 'portfolio'
  | 'live-data'
  | 'datasets'
  | 'base';

export interface CosmicRouteProfile {
  id: CosmicRouteProfileId;
  name: string;
  palette: {
    primary: string; // hex
    secondary: string;
    accent: string;
    fogColor: number; // Three.js hex
  };
  starDensityMultiplier: number;
  dustDensityMultiplier: number;
  planetVisibility: boolean;
  planetType: 'earth' | 'moon' | 'mars' | 'horizon';
  orbitDensity: number; // 0 to 3
  lightRays: boolean;
  readabilityDim: number; // 0 to 1 (higher = dimmer background for data density)
}

export interface CosmicConfig {
  enableCosmos: boolean;
  enableDragon: boolean;
  enableLuminous: boolean;
  devQualityOverride: CosmicQualityTier | null;
}

export const COSMIC_CONFIG: CosmicConfig = {
  enableCosmos: true,
  enableDragon: true,
  enableLuminous: true,
  devQualityOverride: null,
};

export const ROUTE_PROFILES: Record<CosmicRouteProfileId, CosmicRouteProfile> = {
  mission: {
    id: 'mission',
    name: 'Mission Command',
    palette: {
      primary: '#00D4AA',
      secondary: '#1E90FF',
      accent: '#FF6B35',
      fogColor: 0x050811,
    },
    starDensityMultiplier: 1.0,
    dustDensityMultiplier: 1.0,
    planetVisibility: true,
    planetType: 'horizon',
    orbitDensity: 2,
    lightRays: true,
    readabilityDim: 0.15,
  },
  terrain: {
    id: 'terrain',
    name: 'Terrain Studio',
    palette: {
      primary: '#1E90FF',
      secondary: '#00D4AA',
      accent: '#FFB800',
      fogColor: 0x050811,
    },
    starDensityMultiplier: 0.7,
    dustDensityMultiplier: 0.5,
    planetVisibility: false, // Yields visibility to 3D terrain viewports
    planetType: 'moon',
    orbitDensity: 1,
    lightRays: false,
    readabilityDim: 0.35,
  },
  'reality-gap': {
    id: 'reality-gap',
    name: 'Reality Gap Diagnostic',
    palette: {
      primary: '#1E90FF',
      secondary: '#FF6B35',
      accent: '#00D4AA',
      fogColor: 0x050811,
    },
    starDensityMultiplier: 1.0,
    dustDensityMultiplier: 0.8,
    planetVisibility: true,
    planetType: 'mars',
    orbitDensity: 2,
    lightRays: true,
    readabilityDim: 0.25,
  },
  portfolio: {
    id: 'portfolio',
    name: 'Portfolio Optimizer',
    palette: {
      primary: '#00D4AA',
      secondary: '#1E90FF',
      accent: '#38BDF8',
      fogColor: 0x050811,
    },
    starDensityMultiplier: 0.9,
    dustDensityMultiplier: 0.7,
    planetVisibility: true,
    planetType: 'earth',
    orbitDensity: 3,
    lightRays: true,
    readabilityDim: 0.3,
  },
  'live-data': {
    id: 'live-data',
    name: 'Live Data Lab',
    palette: {
      primary: '#38BDF8',
      secondary: '#00D4AA',
      accent: '#1E90FF',
      fogColor: 0x050811,
    },
    starDensityMultiplier: 0.85,
    dustDensityMultiplier: 1.0,
    planetVisibility: false,
    planetType: 'horizon',
    orbitDensity: 2,
    lightRays: true,
    readabilityDim: 0.3,
  },
  datasets: {
    id: 'datasets',
    name: 'Personal Datasets',
    palette: {
      primary: '#00D4AA',
      secondary: '#38BDF8',
      accent: '#FFB800',
      fogColor: 0x050811,
    },
    starDensityMultiplier: 0.8,
    dustDensityMultiplier: 0.6,
    planetVisibility: false,
    planetType: 'horizon',
    orbitDensity: 1,
    lightRays: false,
    readabilityDim: 0.35,
  },
  base: {
    id: 'base',
    name: 'Base Cosmic Space',
    palette: {
      primary: '#00D4AA',
      secondary: '#1E90FF',
      accent: '#FF6B35',
      fogColor: 0x050811,
    },
    starDensityMultiplier: 1.0,
    dustDensityMultiplier: 1.0,
    planetVisibility: true,
    planetType: 'horizon',
    orbitDensity: 2,
    lightRays: true,
    readabilityDim: 0.1,
  },
};

/** Map pathname to Route Profile */
export function getProfileForPathname(pathname: string): CosmicRouteProfileId {
  if (pathname === '/mission') return 'mission';
  if (pathname === '/terrain') return 'terrain';
  if (pathname === '/reality-gap') return 'reality-gap';
  if (pathname === '/portfolio') return 'portfolio';
  if (pathname === '/live-data') return 'live-data';
  if (pathname === '/datasets') return 'datasets';
  return 'base';
}
