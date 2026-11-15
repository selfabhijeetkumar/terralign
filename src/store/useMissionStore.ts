/**
 * TERRALIGN — Unified Reactive Mission State Store
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/architecture/data-flow.md (Section 2)
 */

import { create } from 'zustand';
import type {
  MissionStore,
  TerralignAppState,
  TargetBody,
  ColorMode,
  DomainFilter,
  MissionFilters,
  CameraTransform,
  TerrainSlice,
  TerrainDataMode,
} from '@/types/store';

export const INITIAL_MISSION_STATE: TerralignAppState = {
  mission: {
    targetBody: 'moon',
    activeActivity: 'rover_terramechanics',
    filters: {},
  },
  selection: {
    selectedSiteId: 'cinder-lake',
    comparisonSiteIds: ['cinder-lake', 'askja-caldera', 'mcmurdo-dry-valleys'],
    activePlanetaryFeature: 'shackleton-rim',
  },
  terrain: {
    syncCameras: true,
    syncRotation: true,
    linkZoom: true,
    colorMode: 'hypsometric',
    showHillshade: true,
    showContours: false,
    sunElevationDeg: 2.3, // Canonical low-angle solar elevation for Lunar South Pole
    sunAzimuthDeg: 45.0,
    cameraTransform: {
      position: [0, 1080, 1680],
      target: [0, -50, 0],
    },
    dataMode: 'procedural',
  },
  portfolio: {
    targetK: 3,
    fidelityThreshold: 0.70,
    activeDomainFilter: 'all',
  },
};

export const useMissionStore = create<MissionStore>((set) => ({
  ...INITIAL_MISSION_STATE,

  // --- Mission Actions ---
  setTargetBody: (body: TargetBody) =>
    set((state) => ({
      mission: { ...state.mission, targetBody: body },
    })),

  setActiveActivity: (activity: string) =>
    set((state) => ({
      mission: { ...state.mission, activeActivity: activity },
    })),

  setFilters: (filters: Partial<MissionFilters>) =>
    set((state) => ({
      mission: {
        ...state.mission,
        filters: { ...state.mission.filters, ...filters },
      },
    })),

  resetFilters: () =>
    set((state) => ({
      mission: { ...state.mission, filters: {} },
    })),

  // --- Selection Actions ---
  selectSite: (siteId: string) =>
    set((state) => ({
      selection: { ...state.selection, selectedSiteId: siteId },
    })),

  setComparisonSiteIds: (siteIds: string[]) =>
    set((state) => ({
      selection: { ...state.selection, comparisonSiteIds: siteIds },
    })),

  toggleComparisonSite: (siteId: string) =>
    set((state) => {
      const exists = state.selection.comparisonSiteIds.includes(siteId);
      const updated = exists
        ? state.selection.comparisonSiteIds.filter((id) => id !== siteId)
        : [...state.selection.comparisonSiteIds, siteId];
      return {
        selection: { ...state.selection, comparisonSiteIds: updated },
      };
    }),

  setActivePlanetaryFeature: (feature: string) =>
    set((state) => ({
      selection: { ...state.selection, activePlanetaryFeature: feature },
    })),

  // --- Terrain Actions ---
  setTerrainSync: (sync: Partial<Pick<TerrainSlice, 'syncCameras' | 'syncRotation' | 'linkZoom'>>) =>
    set((state) => ({
      terrain: { ...state.terrain, ...sync },
    })),

  setColorMode: (mode: ColorMode) =>
    set((state) => ({
      terrain: { ...state.terrain, colorMode: mode },
    })),

  setShowHillshade: (show: boolean) =>
    set((state) => ({
      terrain: { ...state.terrain, showHillshade: show },
    })),

  setShowContours: (show: boolean) =>
    set((state) => ({
      terrain: { ...state.terrain, showContours: show },
    })),

  toggleHillshade: () =>
    set((state) => ({
      terrain: { ...state.terrain, showHillshade: !state.terrain.showHillshade },
    })),

  toggleContours: () =>
    set((state) => ({
      terrain: { ...state.terrain, showContours: !state.terrain.showContours },
    })),

  setSunLighting: (elevation: number, azimuth: number) =>
    set((state) => ({
      terrain: {
        ...state.terrain,
        sunElevationDeg: Math.max(0.0, Math.min(5.0, elevation)),
        sunAzimuthDeg: ((azimuth % 360) + 360) % 360,
      },
    })),

  setSunElevation: (elevation: number) =>
    set((state) => ({
      terrain: {
        ...state.terrain,
        sunElevationDeg: Math.max(0.0, Math.min(5.0, elevation)),
      },
    })),

  setSunAzimuth: (azimuth: number) =>
    set((state) => ({
      terrain: {
        ...state.terrain,
        sunAzimuthDeg: ((azimuth % 360) + 360) % 360,
      },
    })),

  setCameraTransform: (transform: CameraTransform) =>
    set((state) => ({
      terrain: { ...state.terrain, cameraTransform: transform },
    })),

  setTerrainDataMode: (mode: TerrainDataMode) =>
    set((state) => ({
      terrain: { ...state.terrain, dataMode: mode },
    })),

  // --- Portfolio Actions ---
  setPortfolioK: (k: 2 | 3) =>
    set((state) => ({
      portfolio: { ...state.portfolio, targetK: k },
    })),

  setFidelityThreshold: (threshold: number) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        fidelityThreshold: Math.max(0.0, Math.min(1.0, threshold)),
      },
    })),

  setActiveDomainFilter: (filter: DomainFilter) =>
    set((state) => ({
      portfolio: { ...state.portfolio, activeDomainFilter: filter },
    })),

  // --- Global Reset ---
  resetStore: () => set(INITIAL_MISSION_STATE),
}));

// --- Optimized Granular Selectors ---
export const useTargetBody = () => useMissionStore((state) => state.mission.targetBody);
export const useActiveActivity = () => useMissionStore((state) => state.mission.activeActivity);
export const useSelectedSiteId = () => useMissionStore((state) => state.selection.selectedSiteId);
export const useComparisonSiteIds = () => useMissionStore((state) => state.selection.comparisonSiteIds);
// IMPORTANT: Zustand v5 selectors must return referentially stable values.
// Returning new object literals causes infinite re-render loops with useSyncExternalStore.
// Use separate primitive selectors instead.
export const useSunElevation = () =>
  useMissionStore((state) => state.terrain.sunElevationDeg);
export const useSunAzimuth = () =>
  useMissionStore((state) => state.terrain.sunAzimuthDeg);
export const useTerrainSyncCameras = () =>
  useMissionStore((state) => state.terrain.syncCameras);
export const useTerrainSyncRotation = () =>
  useMissionStore((state) => state.terrain.syncRotation);
export const useTerrainLinkZoom = () =>
  useMissionStore((state) => state.terrain.linkZoom);
export const usePortfolioTargetK = () =>
  useMissionStore((state) => state.portfolio.targetK);
export const usePortfolioThreshold = () =>
  useMissionStore((state) => state.portfolio.fidelityThreshold);
export const usePortfolioDomain = () =>
  useMissionStore((state) => state.portfolio.activeDomainFilter);
export const useTerrainDataMode = () =>
  useMissionStore((state) => state.terrain.dataMode ?? 'procedural');
