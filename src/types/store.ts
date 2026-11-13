/**
 * TERRALIGN — Mission State Type Definitions
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/architecture/data-flow.md (Section 2)
 */

export type TargetBody = 'moon' | 'mars';

export type ColorMode = 'hypsometric' | 'slope' | 'aspect' | 'raw';

export type DomainFilter = 'all' | 'mechanical' | 'optical' | 'geochemical' | 'environmental';

export interface MissionFilters {
  geologyType?: string;
  geomorphology?: string;
  climateZone?: string;
  minResolutionMeters?: number;
}

export interface MissionSlice {
  targetBody: TargetBody;
  activeActivity: string; // e.g. "rover_terramechanics"
  filters: MissionFilters;
}

export interface SelectionSlice {
  selectedSiteId: string; // default: "cinder-lake"
  comparisonSiteIds: string[]; // for portfolio k=2 or k=3
  activePlanetaryFeature: string; // default: "shackleton-rim"
}

export interface CameraTransform {
  position: [number, number, number];
  target: [number, number, number];
}

export interface TerrainSlice {
  syncCameras: boolean;
  syncRotation: boolean;
  linkZoom: boolean;
  colorMode: ColorMode;
  showHillshade: boolean;
  showContours: boolean;
  sunElevationDeg: number; // 0.0 to 5.0 (lunar south pole low-angle)
  sunAzimuthDeg: number; // 0 to 360
  cameraTransform: CameraTransform;
}

export interface PortfolioSlice {
  targetK: 2 | 3;
  fidelityThreshold: number; // default: 0.70
  activeDomainFilter: DomainFilter;
}

export interface MissionStoreActions {
  // Mission Actions
  setTargetBody: (body: TargetBody) => void;
  setActiveActivity: (activity: string) => void;
  setFilters: (filters: Partial<MissionFilters>) => void;
  resetFilters: () => void;

  // Selection Actions
  selectSite: (siteId: string) => void;
  setComparisonSiteIds: (siteIds: string[]) => void;
  toggleComparisonSite: (siteId: string) => void;
  setActivePlanetaryFeature: (feature: string) => void;

  // Terrain Actions
  setTerrainSync: (sync: Partial<Pick<TerrainSlice, 'syncCameras' | 'syncRotation' | 'linkZoom'>>) => void;
  setColorMode: (mode: ColorMode) => void;
  setShowHillshade: (show: boolean) => void;
  setShowContours: (show: boolean) => void;
  toggleHillshade: () => void;
  toggleContours: () => void;
  setSunLighting: (elevation: number, azimuth: number) => void;
  setSunElevation: (elevation: number) => void;
  setSunAzimuth: (azimuth: number) => void;
  setCameraTransform: (transform: CameraTransform) => void;

  // Portfolio Actions
  setPortfolioK: (k: 2 | 3) => void;
  setFidelityThreshold: (threshold: number) => void;
  setActiveDomainFilter: (filter: DomainFilter) => void;

  // Reset
  resetStore: () => void;
}

export interface TerralignAppState {
  mission: MissionSlice;
  selection: SelectionSlice;
  terrain: TerrainSlice;
  portfolio: PortfolioSlice;
}

export type MissionStore = TerralignAppState & MissionStoreActions;
