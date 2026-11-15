/**
 * TERRALIGN 2.0 — COSMIC ASCENSION
 * Isolated Visual State Store
 *
 * Exclusively tracks visual state: quality tier, active route profile,
 * heavyCanvasActive flag, reduced motion, and fine pointer status.
 * Render loops read state imperatively via getState() or subscribe()
 * to avoid React re-renders per frame, pointer move, or scroll event.
 */

import { create } from 'zustand';
import type { CosmicQualityTier, CosmicRouteProfileId } from '@/lib/cosmic/cosmicConfig';

export interface CosmicVisualState {
  qualityTier: CosmicQualityTier;
  profileId: CosmicRouteProfileId;
  heavyCanvasActive: boolean;
  reducedMotion: boolean;
  finePointer: boolean;
  scrollY: number;
  documentHeight: number;
  setQualityTier: (tier: CosmicQualityTier) => void;
  setProfileId: (id: CosmicRouteProfileId) => void;
  setHeavyCanvasActive: (active: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setFinePointer: (fine: boolean) => void;
  setScrollMetrics: (scrollY: number, documentHeight: number) => void;
}

export const useCosmicStore = create<CosmicVisualState>((set) => ({
  qualityTier: 'high',
  profileId: 'base',
  heavyCanvasActive: false,
  reducedMotion: false,
  finePointer: true,
  scrollY: 0,
  documentHeight: 1000,

  setQualityTier: (tier) => set({ qualityTier: tier }),
  setProfileId: (id) => set({ profileId: id }),
  setHeavyCanvasActive: (active) => set({ heavyCanvasActive: active }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
  setFinePointer: (fine) => set({ finePointer: fine }),
  setScrollMetrics: (scrollY, documentHeight) => set({ scrollY, documentHeight }),
}));
