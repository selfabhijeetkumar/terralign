/**
 * TERRALIGN — 3D Terrain Studio Control Sidebar
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/design/screen-02-terrain-comparison.md
 */

'use client';

import React from 'react';
import {
  useMissionStore,
  useSunElevation,
  useSunAzimuth,
  useTerrainSyncCameras,
  useTerrainSyncRotation,
  useTerrainLinkZoom,
  useTerrainDataMode,
} from '@/store/useMissionStore';
import type { ColorMode } from '@/types/store';

export function TerrainControls() {
  const elevation = useSunElevation();
  const azimuth = useSunAzimuth();
  const syncCameras = useTerrainSyncCameras();
  const syncRotation = useTerrainSyncRotation();
  const linkZoom = useTerrainLinkZoom();
  const dataMode = useTerrainDataMode();
  const colorMode = useMissionStore((s) => s.terrain.colorMode);
  const showHillshade = useMissionStore((s) => s.terrain.showHillshade);
  const showContours = useMissionStore((s) => s.terrain.showContours);

  const setSunLighting = useMissionStore((s) => s.setSunLighting);
  const setSunElevation = useMissionStore((s) => s.setSunElevation);
  const setSunAzimuth = useMissionStore((s) => s.setSunAzimuth);
  const setTerrainSync = useMissionStore((s) => s.setTerrainSync);
  const setTerrainDataMode = useMissionStore((s) => s.setTerrainDataMode);
  const setColorMode = useMissionStore((s) => s.setColorMode);
  const toggleHillshade = useMissionStore((s) => s.toggleHillshade);
  const toggleContours = useMissionStore((s) => s.toggleContours);

  return (
    <aside className="w-full lg:w-80 xl:w-96 h-auto lg:h-full flex flex-col bg-[#0A192F]/85 border-t lg:border-t-0 lg:border-l border-white/10 backdrop-blur-2xl p-4 sm:p-5 select-none shrink-0 z-20 overflow-y-auto custom-scrollbar space-y-5 shadow-[-8px_0_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5 luminous-surface">
      {/* Sidebar Header */}
      <div className="pb-3.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse shadow-[0_0_8px_#00D4AA]" />
          <h3 className="font-headline font-bold text-sm text-white uppercase tracking-wider">
            Terrain Controls
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#00D4AA] font-bold px-2 py-0.5 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/30">
          3D STUDIO
        </span>
      </div>

      {/* 0. Scientific Elevation Data Mode Selector */}
      <div className="space-y-2.5 bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-[#00D4AA]/30 shadow-[0_0_16px_rgba(0,212,170,0.08)] ring-1 ring-[#00D4AA]/20 shine-card">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase text-[#00D4AA] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
            <span>Terrain Pipeline Mode</span>
          </span>
          <span className="text-[9px] font-mono text-[#8B9CB5]">ELEVATION SOURCE</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0A192F]/90 rounded-xl border border-white/10 text-[11px] font-mono shadow-inner">
          <button
            type="button"
            onClick={() => setTerrainDataMode('procedural')}
            className={`py-2 px-2.5 rounded-lg text-center transition-all ${
              dataMode === 'procedural'
                ? 'bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] text-[#050811] font-bold shadow-[0_0_12px_rgba(0,212,170,0.4)]'
                : 'text-[#8B9CB5] hover:text-white'
            }`}
          >
            Procedural Model
          </button>
          <button
            type="button"
            onClick={() => setTerrainDataMode('scientific_grid')}
            className={`py-2 px-2.5 rounded-lg text-center transition-all ${
              dataMode === 'scientific_grid'
                ? 'bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] text-[#050811] font-bold shadow-[0_0_12px_rgba(0,212,170,0.4)]'
                : 'text-[#8B9CB5] hover:text-white'
            }`}
          >
            Scientific Grid
          </button>
        </div>
        <p className="text-[10px] text-[#8B9CB5] font-mono leading-relaxed">
          {dataMode === 'procedural'
            ? 'Procedural morphometric model parameterized from published USGS/NASA profiles.'
            : 'Calibrated morphometric elevation matrix anchored to USGS/NASA datum references.'}
        </p>
      </div>

      {/* 1. Camera & Viewport Synchronization */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-label uppercase tracking-wider text-[#8B9CB5] font-semibold">
          Dual Viewport Sync
        </div>
        <div className="space-y-2.5 bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-xs shadow-inner shine-card">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white font-medium group-hover:text-[#00D4AA] transition-colors">Synchronize Orbit Cameras</span>
            <input
              type="checkbox"
              checked={syncCameras}
              onChange={(e) => setTerrainSync({ syncCameras: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 text-[#00D4AA] focus:ring-[#00D4AA] bg-[#112240] cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white font-medium group-hover:text-[#00D4AA] transition-colors">Link 1:1 Scale Zoom</span>
            <input
              type="checkbox"
              checked={linkZoom}
              onChange={(e) => setTerrainSync({ linkZoom: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 text-[#00D4AA] focus:ring-[#00D4AA] bg-[#112240] cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white font-medium group-hover:text-[#00D4AA] transition-colors">Sync Azimuth Orientation</span>
            <input
              type="checkbox"
              checked={syncRotation}
              onChange={(e) => setTerrainSync({ syncRotation: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 text-[#00D4AA] focus:ring-[#00D4AA] bg-[#112240] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 2. Extreme Low-Angle Solar Illumination Slider (0.0° - 5.0°) */}
      <div className="space-y-3.5 bg-black/40 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/10 shadow-inner shine-card">
        <div className="flex items-center justify-between">
          <span className="text-xs font-headline font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse shadow-[0_0_6px_#00D4AA]" />
            Solar Illumination
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#00D4AA]/20 text-[#00D4AA] font-mono text-[10px] font-bold border border-[#00D4AA]/30 shadow-[0_0_8px_rgba(0,212,170,0.2)]">
            {elevation.toFixed(1)}° ELEVATION
          </span>
        </div>

        {/* Sun Elevation Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono text-[#8B9CB5]">
            <span>Horizon (0.0°)</span>
            <span className="text-white font-semibold">Sun Angle</span>
            <span>Max Grazing (5.0°)</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="5.0"
            step="0.1"
            value={elevation}
            onChange={(e) => setSunElevation(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#112240] rounded-lg appearance-none cursor-pointer accent-[#00D4AA] border border-white/5"
          />
        </div>

        {/* Sun Azimuth Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono text-[#8B9CB5]">
            <span>Azimuth (0°-360°)</span>
            <span className="text-[#38BDF8] font-semibold">{azimuth.toFixed(0)}° CW</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={azimuth}
            onChange={(e) => setSunAzimuth(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#112240] rounded-lg appearance-none cursor-pointer accent-[#1E90FF] border border-white/5"
          />
        </div>

        {/* Presets */}
        <div className="pt-2.5 border-t border-white/10 grid grid-cols-2 gap-2 text-[9px] font-mono">
          <button
            type="button"
            onClick={() => setSunLighting(2.3, 135)}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#112240] to-[#1E3A8A]/40 hover:from-[#1E3A8A]/60 hover:to-[#1E90FF]/30 text-white hover:text-white transition-all border border-white/10 text-left shadow-sm"
          >
            Artemis III (2.3°)
          </button>
          <button
            type="button"
            onClick={() => setSunLighting(0.5, 45)}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#112240] to-[#0D9488]/30 hover:from-[#0D9488]/50 hover:to-[#00D4AA]/30 text-white hover:text-white transition-all border border-white/10 text-left shadow-sm"
          >
            Extreme Rim (0.5°)
          </button>
        </div>
      </div>

      {/* 3. Terrain Shading & Visualization Modes */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-label uppercase tracking-wider text-[#8B9CB5] font-semibold">
          Visualization Layers
        </div>

        <div className="space-y-3 bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-xs shadow-inner shine-card">
          <div>
            <span className="text-[10px] font-mono text-[#8B9CB5] block mb-1.5 font-medium">Color Palette</span>
            <select
              value={colorMode}
              onChange={(e) => setColorMode(e.target.value as ColorMode)}
              className="w-full px-3 py-2 rounded-xl bg-[#112240] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] cursor-pointer shadow-inner"
            >
              <option value="hypsometric">Hypsometric Elevation</option>
              <option value="slope">Slope Gradient (Degrees)</option>
              <option value="aspect">Aspect (Orientation)</option>
              <option value="raw">Raw Monochrome Grayscale</option>
            </select>
          </div>

          <label className="flex items-center justify-between cursor-pointer pt-1 group">
            <span className="text-white font-medium group-hover:text-[#00D4AA] transition-colors">Contour Wireframe Grid</span>
            <input
              type="checkbox"
              checked={showContours}
              onChange={() => toggleContours()}
              className="w-4 h-4 rounded border-white/20 text-[#00D4AA] focus:ring-[#00D4AA] bg-[#112240] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white font-medium group-hover:text-[#00D4AA] transition-colors">PCF Directional Hillshade</span>
            <input
              type="checkbox"
              checked={showHillshade}
              onChange={() => toggleHillshade()}
              className="w-4 h-4 rounded border-white/20 text-[#00D4AA] focus:ring-[#00D4AA] bg-[#112240] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 4. Topographic Quantitative Metrics (Scientific / Illustrative) */}
      <div className="space-y-2.5 bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-xs shadow-inner shine-card">
        <div className="text-[10px] font-mono text-[#8B9CB5] uppercase flex justify-between font-semibold">
          <span>Terrain Metrics</span>
          <span className="text-[#00D4AA] px-1.5 py-0.5 rounded bg-[#00D4AA]/10 border border-[#00D4AA]/30">ILLUSTRATIVE</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 text-[11px] font-mono pt-1">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[#8B9CB5] text-[10px] block font-semibold">Mean Slope</span>
            <span className="text-white font-bold text-sm mt-0.5 block">12.4°</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[#8B9CB5] text-[10px] block font-semibold">RMS Roughness</span>
            <span className="text-white font-bold text-sm mt-0.5 block">0.34m</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[#8B9CB5] text-[10px] block font-semibold">Crater Density</span>
            <span className="text-white font-bold text-sm mt-0.5 block">4.2 / km²</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[#8B9CB5] text-[10px] block font-semibold">Disparity</span>
            <span className="text-[#FF6B35] font-bold text-sm mt-0.5 block">5.0× (1m vs 5m)</span>
          </div>
        </div>
      </div>

      {/* 5. Resolution Disparity Advisory Card */}
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-[10px] font-mono text-[#CBD5E1] space-y-1.5 shadow-inner shine-card">
        <div className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
          <span>⚠</span>
          <span>RESOLUTION & PROVENANCE ADVISORY</span>
        </div>
        <p className="leading-relaxed text-[#8B9CB5] font-sans text-[11px]">
          Source references: Published USGS 3DEP specifies 1.0m grid; NASA LOLA specifies 5.0m DEM.
          Rendered viewports display procedural morphometric models (192×192 mesh) parameterized from published profiles rather than direct raw raster DEM tiles.
        </p>
      </div>
    </aside>
  );
}
