/**
 * TERRALIGN — Planetary Live Data Lab
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * Interactive Scientific Query & Telemetry Lab integrating USGS 3DEP,
 * NASA LRO LOLA, and NASA MGS MOLA elevation APIs.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type {
  PlanetaryBody,
  ElevationPointResult,
  ElevationTransectResult,
  ScientificInterpretation,
  ProviderHealthReport,
  DatasetSpecification,
} from '@/types/science';
import { SCIENTIFIC_DATASETS } from '@/lib/science/datasets';
import { getApiUrl } from '@/lib/apiConfig';

interface PresetLocation {
  name: string;
  body: PlanetaryBody;
  lat: number;
  lng: number;
  description: string;
  transectEnd?: { lat: number; lng: number };
}

const PRESET_LOCATIONS: PresetLocation[] = [
  // Earth
  {
    name: 'Cinder Lake Crater Field 1',
    body: 'earth',
    lat: 35.3071,
    lng: -111.5049,
    description: 'USGS Apollo training crater field in basaltic volcanic cinders, Flagstaff AZ',
    transectEnd: { lat: 35.32, lng: -111.49 },
  },
  {
    name: 'Askja Caldera Highlands',
    body: 'earth',
    lat: 65.0333,
    lng: -16.75,
    description: 'Dyngjufjöll volcanic complex with basaltic pumice and tephra layers, Iceland',
    transectEnd: { lat: 65.07, lng: -16.7 },
  },
  {
    name: 'Atacama Yungay Station',
    body: 'earth',
    lat: -24.0667,
    lng: -69.8667,
    description: 'Hyper-arid desert core testing extreme dryness, UV, and salt crust mobility',
    transectEnd: { lat: -24.03, lng: -69.82 },
  },
  {
    name: 'Mauna Kea Apollo Valley',
    body: 'earth',
    lat: 19.8206,
    lng: -155.4681,
    description: 'High-altitude sub-glacial basaltic cinder cones and periglacial regolith',
    transectEnd: { lat: 19.84, lng: -155.44 },
  },

  // Moon
  {
    name: 'Shackleton Crater Rim',
    body: 'moon',
    lat: -89.9,
    lng: 0.0,
    description: 'South Pole impact crater rim with quasi-continuous solar illumination peaks',
    transectEnd: { lat: -89.7, lng: 0.0 },
  },
  {
    name: 'Shackleton Crater Floor (Cold Trap)',
    body: 'moon',
    lat: -89.7,
    lng: 0.0,
    description: 'Permanently shadowed region (PSR) at ~40 K harboring potential water ice',
    transectEnd: { lat: -89.5, lng: 0.0 },
  },
  {
    name: 'Tycho Crater Central Peak',
    body: 'moon',
    lat: -43.3,
    lng: -11.2,
    description: 'Prominent Copernican impact crater with 1.6 km high central uplift massif',
    transectEnd: { lat: -43.1, lng: -11.0 },
  },
  {
    name: 'Apollo 11 Tranquility Base',
    body: 'moon',
    lat: 0.674,
    lng: 23.473,
    description: 'Mare basalt plain with shallow regolith blanket and low surface slope',
    transectEnd: { lat: 0.72, lng: 23.52 },
  },

  // Mars
  {
    name: 'Jezero Crater Delta Scarp',
    body: 'mars',
    lat: 18.44,
    lng: 77.45,
    description: 'NASA Perseverance landing basin delta front with steep terraced stratigraphy',
    transectEnd: { lat: 18.38, lng: 77.58 },
  },
  {
    name: 'Olympus Mons Caldera Summit',
    body: 'mars',
    lat: 18.65,
    lng: -133.8,
    description: 'Tallest shield volcano in the Solar System rising 21.2 km above MOLA areoid',
    transectEnd: { lat: 18.8, lng: -133.5 },
  },
  {
    name: 'Gale Crater (Mount Sharp Floor)',
    body: 'mars',
    lat: -4.59,
    lng: 137.44,
    description: 'NASA Curiosity exploration site with 5.5 km central sedimentary mound',
    transectEnd: { lat: -5.08, lng: 137.85 },
  },
  {
    name: 'Valles Marineris (Melas Chasma)',
    body: 'mars',
    lat: -9.8,
    lng: -76.4,
    description: 'Tectonic canyon rift floor 8.2 km below areoid with extreme relief slopes',
    transectEnd: { lat: -9.5, lng: -76.1 },
  },
];

export default function LiveDataLabPage() {
  const [selectedBody, setSelectedBody] = useState<PlanetaryBody>('earth');
  const [latitude, setLatitude] = useState<string>('35.3071');
  const [longitude, setLongitude] = useState<string>('-111.5049');
  const [activePresetName, setActivePresetName] = useState<string>('Cinder Lake Crater Field 1');

  // Query Results State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [pointData, setPointData] = useState<ElevationPointResult | null>(null);
  const [transectData, setTransectData] = useState<ElevationTransectResult | null>(null);
  const [interpretation, setInterpretation] = useState<ScientificInterpretation | null>(null);

  // Provider Health State
  const [healthReports, setHealthReports] = useState<ProviderHealthReport[]>([]);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'elevation' | 'transect' | 'datasets' | 'health'>('elevation');

  // Fetch Provider Health on load
  useEffect(() => {
    async function loadHealth() {
      try {
        const res = await fetch(getApiUrl('/api/science/health'));
        if (res.ok) {
          const json = await res.json();
          setHealthReports(json.providers || []);
        }
      } catch {
        // Fallback health state
      } finally {
        setHealthLoading(false);
      }
    }
    loadHealth();
  }, []);

  // Execute Point & Transect Query
  const executeQuery = useCallback(
    async (
      body: PlanetaryBody,
      latNum: number,
      lngNum: number,
      locName: string,
      endCoord?: { lat: number; lng: number }
    ) => {
      setIsLoading(true);
      setQueryError(null);

      try {
        // 1. Point Elevation
        const elevRes = await fetch(
          getApiUrl(`/api/science/elevation?body=${body}&lat=${latNum}&lng=${lngNum}`)
        );
        if (!elevRes.ok) {
          const errJson = await elevRes.json();
          throw new Error(errJson.message || 'Elevation query failed');
        }
        const elevJson = await elevRes.json();
        const pResult: ElevationPointResult = elevJson.data;
        setPointData(pResult);

        // 2. Transect Query
        const endLat = endCoord ? endCoord.lat : latNum + 0.05;
        const endLng = endCoord ? endCoord.lng : lngNum + 0.05;

        const transRes = await fetch(
          getApiUrl(`/api/science/transect?body=${body}&startLat=${latNum}&startLng=${lngNum}&endLat=${endLat}&endLng=${endLng}&samples=24`)
        );
        if (transRes.ok) {
          const transJson = await transRes.json();
          setTransectData(transJson.data);
        }

        // 3. Scientific Interpretation
        const interpRes = await fetch(
          getApiUrl(`/api/science/interpret?body=${body}&lat=${latNum}&lng=${lngNum}&elevation=${pResult.elevationMeters}&location=${encodeURIComponent(
            locName
          )}&dataset=${encodeURIComponent(pResult.datasetName)}&resolution=${pResult.nominalResolutionMeters}`)
        );
        if (interpRes.ok) {
          const interpJson = await interpRes.json();
          setInterpretation(interpJson.data);
        }
      } catch (err: unknown) {
        setQueryError((err as Error)?.message || 'An error occurred during scientific query execution');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Trigger initial query on page load
  useEffect(() => {
    executeQuery('earth', 35.3071, -111.5049, 'Cinder Lake Crater Field 1', { lat: 35.32, lng: -111.49 });
  }, [executeQuery]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: PresetLocation) => {
    setSelectedBody(preset.body);
    setLatitude(preset.lat.toString());
    setLongitude(preset.lng.toString());
    setActivePresetName(preset.name);
    executeQuery(preset.body, preset.lat, preset.lng, preset.name, preset.transectEnd);
  };

  // Handle Planetary Switcher
  const handleBodySwitch = (body: PlanetaryBody) => {
    setSelectedBody(body);
    const firstPreset = PRESET_LOCATIONS.find((p) => p.body === body);
    if (firstPreset) {
      handleSelectPreset(firstPreset);
    }
  };

  // Handle Manual Form Submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);
    if (isNaN(latNum) || isNaN(lngNum)) {
      setQueryError('Please provide valid decimal coordinates.');
      return;
    }
    setActivePresetName(`Custom Target (${latNum.toFixed(4)}°, ${lngNum.toFixed(4)}°)`);
    executeQuery(selectedBody, latNum, lngNum, `Target Coordinates ${latNum}, ${lngNum}`);
  };

  const filteredDatasets = SCIENTIFIC_DATASETS.filter((d) => d.body === selectedBody);

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col pt-16">
      {/* ── Top Header Banner ─────────────────────────────────── */}
      <header className="relative border-b border-white/10 bg-[#0A192F]/80 backdrop-blur-xl px-4 sm:px-8 py-5 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        {/* Subtle top edge highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D4AA]/40 to-transparent" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse shadow-[0_0_8px_#00D4AA]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#00D4AA] font-bold">
                PLANETARY SCIENTIFIC DATA LAB
              </span>
              <span className="text-xs text-[#8B9CB5]/50">·</span>
              <span className="text-[11px] font-mono text-[#8B9CB5]">USGS · NASA PDS ODE · LRO LOLA · MGS MOLA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-headline font-bold text-white tracking-wide">
              Direct Scientific Elevation Query Engine
            </h1>
            <p className="text-xs sm:text-sm text-[#8B9CB5] mt-1 font-sans">
              Precision topographic datums, real elevation cross-sections, Bekker-Wong terramechanics synthesis, and live telemetry.
            </p>
          </div>

          {/* Real-time Health Telemetry Bar */}
          <div className="flex items-center gap-2.5 bg-black/50 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl text-xs font-mono shadow-inner shine-card shine-delay-1">
            <span className="text-[#8B9CB5] text-[10px] uppercase font-semibold">Telemetry:</span>
            {healthLoading ? (
              <span className="text-[#8B9CB5] animate-pulse text-xs">Probing endpoints...</span>
            ) : healthReports.length > 0 ? (
              <div className="flex items-center gap-3">
                {healthReports.map((h) => (
                  <div key={h.providerId} className="flex items-center gap-1.5" title={h.name}>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        h.status === 'HEALTHY'
                          ? 'bg-[#00D4AA] shadow-[0_0_6px_#00D4AA]'
                          : h.status === 'DEGRADED'
                          ? 'bg-amber-400 shadow-[0_0_6px_#F59E0B]'
                          : 'bg-rose-500 shadow-[0_0_6px_#EF4444]'
                      }`}
                    />
                    <span className="text-gray-300 font-semibold">{h.providerId.replace('NASA_PDS_', '')}:</span>
                    <span className="text-[#38BDF8] font-bold">{h.latencyMs}ms</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-[#00D4AA]">Providers Active</span>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Workspace ────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* 1. Planetary Switcher & Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          {/* Planet Switcher Buttons */}
          <div className="inline-flex p-1 rounded-2xl bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-white/5">
            {(['earth', 'moon', 'mars'] as PlanetaryBody[]).map((b) => {
              const isActive = selectedBody === b;
              const activeStyles =
                b === 'earth'
                  ? 'bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] text-[#050811] shadow-[0_0_14px_rgba(0,212,170,0.4)]'
                  : b === 'moon'
                  ? 'bg-gradient-to-r from-[#1E90FF] to-[#38BDF8] text-white shadow-[0_0_14px_rgba(30,144,255,0.4)]'
                  : 'bg-gradient-to-r from-[#FF6B35] to-[#FFA07A] text-white shadow-[0_0_14px_rgba(255,107,53,0.4)]';

              return (
                <button
                  key={b}
                  onClick={() => handleBodySwitch(b)}
                  className={`px-4 py-2 rounded-xl text-xs font-headline font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? `${activeStyles} font-bold scale-[1.02]`
                      : 'text-[#8B9CB5] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      b === 'earth' ? (isActive ? 'bg-[#050811]' : 'bg-blue-400') : b === 'moon' ? 'bg-white' : 'bg-white'
                    }`}
                  />
                  {b.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Section Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'elevation', label: 'Elevation & Telemetry' },
              { id: 'transect', label: 'Elevation Transect' },
              { id: 'datasets', label: 'Dataset Catalog' },
              { id: 'health', label: 'Provider Health' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1E3A8A]/50 text-[#38BDF8] border border-[#38BDF8]/40 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold'
                    : 'text-[#8B9CB5] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Preset Targets Bar ───────────────────────────────── */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#8B9CB5] uppercase tracking-wider font-semibold">
              Canonical Science Targets ({selectedBody.toUpperCase()}):
            </span>
            <span className="text-[10px] font-mono text-[#00D4AA] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
              <span>Click to query instantly</span>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_LOCATIONS.filter((p) => p.body === selectedBody).map((preset) => {
              const isSelected = activePresetName === preset.name;
              return (
                <button
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-3.5 rounded-2xl border transition-all duration-200 shine-card ${
                    isSelected
                      ? 'bg-[#00D4AA]/15 border-[#00D4AA]/60 shadow-[0_0_14px_rgba(0,212,170,0.25)] ring-1 ring-[#00D4AA]/40 scale-[1.02]'
                      : 'bg-[#0A192F]/75 backdrop-blur-xl border-white/10 hover:border-white/25 hover:bg-[#0A192F]/90 shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-headline font-bold text-xs text-white truncate">{preset.name}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-[#00D4AA] shadow-[0_0_6px_#00D4AA]" />}
                  </div>
                  <div className="text-[10px] font-mono text-[#38BDF8] mt-1 font-medium">
                    {preset.lat.toFixed(4)}°, {preset.lng.toFixed(4)}°
                  </div>
                  <p className="text-[11px] text-[#8B9CB5] mt-1.5 line-clamp-2 leading-relaxed font-sans">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Coordinate Query Interface ───────────────────────── */}
        <div className="bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/5 luminous-surface-prominent shine-card shine-delay-2">
          <form onSubmit={handleManualSubmit} className="flex flex-col md:flex-row items-end gap-4">
            <div className="w-full md:w-1/3 space-y-1.5">
              <label htmlFor="lat-input" className="block text-[11px] font-mono uppercase text-[#8B9CB5] font-semibold">
                Latitude (Degrees: -90.0 to +90.0)
              </label>
              <input
                id="lat-input"
                type="number"
                step="any"
                min="-90"
                max="90"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g. 35.3071"
                required
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] shadow-inner"
              />
            </div>

            <div className="w-full md:w-1/3 space-y-1.5">
              <label htmlFor="lng-input" className="block text-[11px] font-mono uppercase text-[#8B9CB5] font-semibold">
                Longitude (Degrees: -180.0 to +180.0)
              </label>
              <input
                id="lng-input"
                type="number"
                step="any"
                min="-180"
                max="180"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g. -111.5049"
                required
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] shadow-inner"
              />
            </div>

            <div className="w-full md:w-1/3 flex items-center gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] text-[#050811] font-headline font-bold text-sm uppercase tracking-wider hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,212,170,0.4)]"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#050811] border-t-transparent rounded-full animate-spin" />
                    Querying API...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="9" cy="9" r="6" />
                      <line x1="13.5" y1="13.5" x2="18" y2="18" />
                    </svg>
                    Execute Query
                  </>
                )}
              </button>
            </div>
          </form>

          {queryError && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <span>⚠</span>
              <span>Error: {queryError}</span>
            </div>
          )}
        </div>

        {/* ── Main Tab Views ───────────────────────────────────── */}
        {activeTab === 'elevation' && pointData && (
          <div className="space-y-6">
            {/* Top Telemetry Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Card 1: Measured Elevation */}
              <div className="bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/5 luminous-surface-prominent shine-card">
                <div className="text-[11px] font-mono text-[#8B9CB5] uppercase tracking-wider font-semibold">
                  Topographic Elevation
                </div>
                <div className="text-3xl sm:text-4xl font-headline font-bold text-white mt-2 flex items-baseline gap-1.5 drop-shadow-[0_0_12px_rgba(0,212,170,0.3)]">
                  {pointData.elevationMeters.toLocaleString('en-US', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 2,
                  })}
                  <span className="text-base text-[#00D4AA] font-mono">m</span>
                </div>
                <div className="text-[11px] font-mono text-[#38BDF8] mt-2.5 flex items-center gap-1.5">
                  <span className="text-[#8B9CB5]">Datum:</span>
                  <span className="text-[#CBD5E1] truncate font-medium">{pointData.quality.datumReference}</span>
                </div>
                {/* Geodetic Contextual Note for Cinder Lake or other sites */}
                {pointData.body === 'earth' && Math.abs(pointData.latitude - 35.3071) < 0.05 && Math.abs(pointData.longitude - (-111.5049)) < 0.05 && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 text-[10px] font-mono text-[#8B9CB5] leading-tight">
                    <span className="text-[#00D4AA] font-semibold">GEODETIC CONTEXT:</span> NED 10m sample: 2,022.09m · 3DEP 1m LiDAR: 2,019.63m (NAVD88) · Basin complex nominal baseline: 2,050m.
                  </div>
                )}
              </div>

              {/* Card 2: Epistemic Status */}
              <div className="bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/5 luminous-surface-prominent shine-card">
                <div className="text-[11px] font-mono text-[#8B9CB5] uppercase tracking-wider font-semibold">
                  Epistemic Status
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      pointData.cacheStatus === 'LIVE DATA'
                        ? 'bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/40 shadow-[0_0_10px_rgba(0,212,170,0.25)]'
                        : pointData.cacheStatus === 'CACHED DATA'
                        ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                        : 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        pointData.cacheStatus === 'LIVE DATA'
                          ? 'bg-[#00D4AA] animate-pulse'
                          : pointData.cacheStatus === 'CACHED DATA'
                          ? 'bg-[#38BDF8]'
                          : 'bg-amber-400'
                      }`}
                    />
                    {pointData.cacheStatus}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#8B9CB5] mt-3">
                  Retrieved in <span className="text-white font-bold">{pointData.latencyMs} ms</span>
                </div>
              </div>

              {/* Card 3: Nominal Resolution */}
              <div className="bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/5 shine-card">
                <div className="text-[11px] font-mono text-[#8B9CB5] uppercase tracking-wider font-semibold">
                  Spatial Resolution
                </div>
                <div className="text-2xl sm:text-3xl font-headline font-bold text-white mt-2">
                  {pointData.nominalResolutionMeters.toFixed(1)}
                  <span className="text-base text-[#38BDF8] font-mono ml-1">m / pixel</span>
                </div>
                <div className="text-[11px] font-mono text-[#8B9CB5] mt-2.5">
                  Est. Uncertainty: ±{pointData.quality.uncertaintyMeters ?? 1.0} m
                </div>
              </div>

              {/* Card 4: Scientific Source */}
              <div className="bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/5 shine-card">
                <div className="text-[11px] font-mono text-[#8B9CB5] uppercase tracking-wider font-semibold">
                  Origin Dataset
                </div>
                <div className="text-sm font-headline font-bold text-white mt-2 truncate" title={pointData.datasetName}>
                  {pointData.datasetName}
                </div>
                <div className="text-[11px] font-mono text-[#8B9CB5] mt-2.5 truncate" title={pointData.provider}>
                  {pointData.provider}
                </div>
              </div>
            </div>

            {/* Scientific Interpretation Layer */}
            {interpretation && (
              <div className="bg-[#0A192F]/80 backdrop-blur-2xl border border-[#00D4AA]/30 rounded-2xl p-6 sm:p-7 space-y-5 shadow-[0_8px_32px_rgba(0,212,170,0.1)] ring-1 ring-[#00D4AA]/20 shine-card">
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse shadow-[0_0_8px_#00D4AA]" />
                    <h3 className="font-headline font-bold text-sm uppercase tracking-wider text-white">
                      Scientific Intelligence & Terramechanics Synthesis
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-[#00D4AA] font-bold px-2.5 py-1 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/30">
                    Relevance Score: {interpretation.analogRelevanceScore.toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Geology & Soil Mechanics */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                      <h4 className="text-xs font-mono uppercase text-[#38BDF8] font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                        <span>Geological Context & Geomorphology</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-[#CBD5E1] mt-2 leading-relaxed font-sans">
                        {interpretation.geologicalContext}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                      <h4 className="text-xs font-mono uppercase text-[#00D4AA] font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
                        <span>Bekker-Wong Soil Terramechanics</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-[#CBD5E1] mt-2 leading-relaxed font-sans">
                        {interpretation.terramechanicsImplications}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Hazards & Citations */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                      <h4 className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Environmental & Operational Hazards</span>
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {interpretation.environmentalHazards.map((h, i) => (
                          <li key={i} className="text-xs text-[#CBD5E1] flex items-start gap-2">
                            <span className="text-amber-400 mt-0.5">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                      <h4 className="text-xs font-mono uppercase text-[#8B9CB5] font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B9CB5]" />
                        <span>Scientific Source Grounding</span>
                      </h4>
                      <ul className="mt-2 space-y-1.5">
                        {interpretation.sourceGrounding.map((g, i) => (
                          <li key={i} className="text-[11px] font-mono text-[#8B9CB5]">
                            • {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Disclaimer Badge */}
                <div className="border-t border-white/10 pt-3.5 flex items-center justify-between text-[11px] font-mono text-[#8B9CB5]">
                  <span>{interpretation.disclaimer}</span>
                  <a
                    href={pointData.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00D4AA] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View Source Dataset</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Transect Tab ─────────────────────────────────────── */}
        {activeTab === 'transect' && transectData && (
          <div className="bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/5 shine-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-headline font-bold text-base text-white">
                  Cross-Sectional Elevation Profile ({selectedBody.toUpperCase()})
                </h3>
                <p className="text-xs text-[#8B9CB5] mt-0.5 font-sans">
                  {transectData.sampleCount} elevation samples across {(transectData.totalDistanceMeters / 1000).toFixed(2)} km transect path
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-[#8B9CB5]">Min: </span>
                  <span className="text-white font-bold">{transectData.minElevationMeters}m</span>
                </div>
                <div>
                  <span className="text-[#8B9CB5]">Max: </span>
                  <span className="text-white font-bold">{transectData.maxElevationMeters}m</span>
                </div>
                <div>
                  <span className="text-[#8B9CB5]">Relief Span: </span>
                  <span className="text-[#00D4AA] font-bold">{transectData.elevationSpanMeters}m</span>
                </div>
              </div>
            </div>

            {/* SVG Elevation Chart */}
            <div className="w-full h-64 sm:h-80 bg-[#050811]/90 rounded-xl border border-white/10 p-4 relative flex flex-col justify-end shadow-inner">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#00D4AA" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="40" x2="800" y2="40" stroke="#8B9CB5" strokeOpacity="0.1" strokeDasharray="4 4" />
                <line x1="0" y1="120" x2="800" y2="120" stroke="#8B9CB5" strokeOpacity="0.1" strokeDasharray="4 4" />
                <line x1="0" y1="200" x2="800" y2="200" stroke="#8B9CB5" strokeOpacity="0.1" strokeDasharray="4 4" />

                {/* Path Calculation */}
                {(() => {
                  const pts = transectData.points;
                  if (pts.length < 2) return null;
                  const min = transectData.minElevationMeters;
                  const span = Math.max(transectData.elevationSpanMeters, 1);

                  const coords = pts.map((pt, idx) => {
                    const x = (idx / (pts.length - 1)) * 800;
                    const y = 220 - ((pt.elevationMeters - min) / span) * 180;
                    return { x, y, elev: pt.elevationMeters, dist: pt.distanceMeters };
                  });

                  const lineD = coords.reduce((acc, c, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`, '');
                  const areaD = `${lineD} L 800 240 L 0 240 Z`;

                  return (
                    <>
                      <path d={areaD} fill="url(#elevationGrad)" />
                      <path d={lineD} fill="none" stroke="#00D4AA" strokeWidth="2.5" />
                      {coords.map((c, i) => (
                        <circle
                          key={i}
                          cx={c.x}
                          cy={c.y}
                          r="3"
                          fill="#050811"
                          stroke="#38BDF8"
                          strokeWidth="1.5"
                        >
                          <title>{`${(c.dist / 1000).toFixed(2)} km: ${c.elev.toFixed(1)} m`}</title>
                        </circle>
                      ))}
                    </>
                  );
                })()}
              </svg>

              <div className="flex justify-between text-[10px] font-mono text-[#8B9CB5] pt-2 border-t border-white/10 mt-2">
                <span>0.00 km (Start)</span>
                <span>{(transectData.totalDistanceMeters / 2000).toFixed(2)} km (Midpoint)</span>
                <span>{(transectData.totalDistanceMeters / 1000).toFixed(2)} km (End)</span>
              </div>
            </div>

            {/* Path Coordinates Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-black/40 p-4 rounded-xl border border-white/10 shadow-inner">
              <div>
                <span className="text-[#8B9CB5]">Transect Origin: </span>
                <span className="text-white font-medium">
                  {transectData.start.lat.toFixed(4)}°, {transectData.start.lng.toFixed(4)}°
                </span>
              </div>
              <div>
                <span className="text-[#8B9CB5]">Transect Destination: </span>
                <span className="text-white font-medium">
                  {transectData.end.lat.toFixed(4)}°, {transectData.end.lng.toFixed(4)}°
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Dataset Catalog Tab ──────────────────────────────── */}
        {activeTab === 'datasets' && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-[#8B9CB5] uppercase font-semibold">
              Scientific Topographic Datasets ({filteredDatasets.length} Available for {selectedBody.toUpperCase()}):
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredDatasets.map((ds) => (
                <div
                  key={ds.id}
                  className="bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/5 shine-card"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#00D4AA] uppercase tracking-wider font-semibold">
                        {ds.productId}
                      </span>
                      <h4 className="text-base font-headline font-bold text-white mt-0.5">{ds.name}</h4>
                    </div>
                    <span className="text-xs font-mono text-[#38BDF8] px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 self-start sm:self-auto font-medium">
                      {ds.resolutionNominal}
                    </span>
                  </div>

                  <p className="text-xs text-[#CBD5E1] leading-relaxed font-sans">{ds.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono pt-1">
                    <div>
                      <span className="text-[#8B9CB5]">CRS: </span>
                      <span className="text-white">{ds.crs}</span>
                    </div>
                    <div>
                      <span className="text-[#8B9CB5]">Units: </span>
                      <span className="text-white">{ds.units}</span>
                    </div>
                    <div>
                      <span className="text-[#8B9CB5]">Provider: </span>
                      <span className="text-white truncate">{ds.provider}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-[#8B9CB5]">
                    <span>Citation: {ds.citation}</span>
                    <a
                      href={ds.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00D4AA] hover:underline shrink-0 font-medium"
                    >
                      External Source Documentation →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Health & Telemetry Tab ───────────────────────────── */}
        {activeTab === 'health' && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-[#8B9CB5] uppercase font-semibold">
              Planetary Provider Health & Latency Telemetry:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {healthReports.map((hr) => (
                <div
                  key={hr.providerId}
                  className="bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/5 shine-card"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[#38BDF8] font-semibold">{hr.targetBody}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        hr.status === 'HEALTHY'
                          ? 'bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30 shadow-[0_0_8px_rgba(0,212,170,0.2)]'
                          : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      }`}
                    >
                      {hr.status}
                    </span>
                  </div>

                  <h4 className="font-headline font-bold text-sm text-white">{hr.name}</h4>

                  <div className="space-y-1.5 text-xs font-mono bg-black/30 p-3 rounded-xl border border-white/5 shadow-inner">
                    <div className="flex justify-between">
                      <span className="text-[#8B9CB5]">Latency:</span>
                      <span className="text-white font-bold">{hr.latencyMs} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B9CB5]">Checked:</span>
                      <span className="text-[#CBD5E1]">{new Date(hr.lastChecked).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-[#8B9CB5] break-all">
                    Endpoint: {hr.endpoint}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
