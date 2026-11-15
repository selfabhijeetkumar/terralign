'use client';

/**
 * TERRALIGN — Screen 03: Analog Reality Gap (ARG) Diagnostic View
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE → SIMPLIFY → IMPLEMENT)
 * Design Ref: docs/design/screen-03-analog-reality-gap.md
 *
 * Epistemic Guardrail:
 *   ARG Index is an ILLUSTRATIVE COMPOSITE INDEX — NOT an empirically certified flight metric.
 *   Physics axes are based on VERIFIED SOURCE DATA or DERIVED FROM VERIFIED DATA.
 */

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useMissionStore } from '@/store/useMissionStore';
import { getAllAnalogs, getAnalogById } from '@/lib/analogs';

interface ArgAxis {
  id: string;
  label: string;
  earthValue: string;
  targetValue: string;
  divergencePercent: number;
  divergenceLabel: string;
  confidence: 'EXACT' | 'HIGH' | 'MODERATE' | 'LOW';
  provenanceType: 'MEASURED DATUM' | 'DERIVED FORMULA' | 'COMPUTATIONAL MODEL' | 'QUALITATIVE PROXY';
  source: string;
  caveat: string;
  severity: 'critical' | 'high' | 'moderate';
}

interface CompensationRow {
  axis: string;
  protocol: string;
  facility: string;
  status: string;
  statusClass: 'validated' | 'partial' | 'theoretical';
}

const COMPENSATION_TABLE: CompensationRow[] = [
  {
    axis: '1. Gravity',
    protocol: 'Partial gravity offload harness (1/6g wheel ground load)',
    facility: 'NASA JSC ARGOS Rig',
    status: 'PARTIAL LOAD ONLY',
    statusClass: 'partial',
  },
  {
    axis: '2. Pressure',
    protocol: 'Thermal-vacuum chamber cycling & sealing qualification',
    facility: 'NASA Chamber A (TVAC)',
    status: 'VALIDATED (LAB SCALE)',
    statusClass: 'validated',
  },
  {
    axis: '3. Thermal',
    protocol: 'Cryogenic cold-soak & solar thermal cycling',
    facility: 'Cryo Test Facility / Thermal Vac',
    status: 'VALIDATED (COMPONENT)',
    statusClass: 'validated',
  },
  {
    axis: '4. Irradiance',
    protocol: 'High Dynamic Range (HDR) collimated solar beam simulator',
    facility: 'Solar Simulator Rig',
    status: 'GEOMETRIC MATCH ONLY',
    statusClass: 'partial',
  },
  {
    axis: '5. Radiation',
    protocol: 'Monte Carlo transport modeling (FLUKA / GEANT4)',
    facility: 'Computational Shielding Lab',
    status: 'THEORETICAL MODEL ONLY',
    statusClass: 'theoretical',
  },
  {
    axis: '6. Regolith',
    protocol: 'LHS-1 / JSC-1A simulant mobility testbed',
    facility: 'NASA GRC SLOPE Facility',
    status: 'MECHANICAL PROXY ONLY',
    statusClass: 'partial',
  },
];

export function RealityGapView() {
  const selectedSiteId = useMissionStore((s) => s.selection.selectedSiteId);
  const selectSite = useMissionStore((s) => s.selectSite);
  const targetBody = useMissionStore((s) => s.mission.targetBody);
  const setTargetBody = useMissionStore((s) => s.setTargetBody);

  const allSites = getAllAnalogs();
  const currentSite = getAnalogById(selectedSiteId) || allSites[0];

  const isMoon = targetBody === 'moon';

  // Compute 6-axis parameters dynamically based on selected site and target body
  const axes: ArgAxis[] = useMemo(() => {
    const elevation = currentSite.elevationMeters || 2050;
    // Barometric formula approximation for local atmospheric pressure in kPa
    const localPressureKPa = Math.round(101.325 * Math.exp(-elevation / 8400) * 10) / 10;

    if (isMoon) {
      return [
        {
          id: 'gravity',
          label: '1. Gravity Disparity (Δg)',
          earthValue: 'Earth: 9.81 m/s²',
          targetValue: 'Moon: 1.62 m/s²',
          divergencePercent: 83.5,
          divergenceLabel: 'Δg = 8.19 m/s² (83.5% reduction)',
          confidence: 'EXACT',
          provenanceType: 'MEASURED DATUM',
          source: 'IAU Standard Gravity (9.80665 vs 1.622 m/s²)',
          caveat: 'Physical invariant. ARGOS offload reduces wheel load but cannot replicate particle ballistics or wheel slip inertia.',
          severity: 'critical',
        },
        {
          id: 'pressure',
          label: '2. Atmospheric Pressure (Δp)',
          earthValue: `Earth (${currentSite.shortName}): ${localPressureKPa} kPa`,
          targetValue: 'Moon: ~10⁻¹⁰ Pa (Lunar Exosphere)',
          divergencePercent: 100.0,
          divergenceLabel: `Δp = ${localPressureKPa} kPa (100% divergence)`,
          confidence: 'HIGH',
          provenanceType: 'DERIVED FORMULA',
          source: 'US Standard Atmosphere at local elevation vs Apollo SBE',
          caveat: 'Inescapable on Earth surface; eliminates convective motor cooling and aerodynamic dust suspension.',
          severity: 'critical',
        },
        {
          id: 'thermal',
          label: '3. Thermal Boundary Delta (ΔT)',
          earthValue: 'Earth: −15°C to +38°C (air ambient)',
          targetValue: 'Moon: −233°C (PSR) to −53°C (Rim) [+123°C eq max]',
          divergencePercent: 75.0,
          divergenceLabel: 'Polar span 180°C vs Earth 53°C (75% normalized)',
          confidence: 'MODERATE',
          provenanceType: 'DERIVED FORMULA',
          source: 'LRO Diviner orbital radiometer brightness temp vs terrestrial weather',
          caveat: 'Diviner records regolith skin temperature, not atmospheric air temperature.',
          severity: 'high',
        },
        {
          id: 'solar',
          label: '4. Solar Irradiance Variance (ΔI)',
          earthValue: 'Earth DNI: ~1,076 W/m² (mountain clear-sky)',
          targetValue: 'Moon TOA: 1,361 W/m² (SORCE/TSIS-1)',
          divergencePercent: 26.5,
          divergenceLabel: 'ΔI = +285 W/m² (+26.5% direct normal beam gain)',
          confidence: 'HIGH',
          provenanceType: 'MEASURED DATUM',
          source: 'NASA SORCE/TSIS-1 Total Solar Irradiance (1 AU)',
          caveat: 'Lunar lighting has 0 W/m² diffuse skylight; extreme contrast between sunlit surface and pitch-black shadows.',
          severity: 'moderate',
        },
        {
          id: 'radiation',
          label: '5. Radiation Flux Delta (ΔR)',
          earthValue: 'Earth: ~3.2 mSv/yr (surface background)',
          targetValue: 'Moon: ~380 mSv/yr (GCR + SPE, 0.22 g/cm² suit)',
          divergencePercent: 100.0,
          divergenceLabel: 'ΔR = ~377 mSv/yr (>100× biological dose factor)',
          confidence: 'MODERATE',
          provenanceType: 'COMPUTATIONAL MODEL',
          source: 'LRO CRaTER (Schwadron et al.) & Chang\'e-4 LND (Zhang et al. 2020)',
          caveat: 'Unshielded spacesuit exposure. Quality factor Q≈4.3 for heavy ions. Does not account for storm shelter shielding.',
          severity: 'critical',
        },
        {
          id: 'regolith',
          label: '6. Regolith Morphology & Cohesion (ΔC)',
          earthValue: 'Earth: Weathered basalt cinder / alluvial sediments',
          targetValue: 'Moon: Unweathered jagged agglutinates (nanophase Fe⁰)',
          divergencePercent: 70.0,
          divergenceLabel: '~70% morphological divergence (qualitative proxy)',
          confidence: 'LOW',
          provenanceType: 'QUALITATIVE PROXY',
          source: 'Apollo Lunar Sample Compendium & USGS OFR 68-24',
          caveat: 'Terrestrial soils lack vacuum adhesion and solar wind nanophase iron coatings.',
          severity: 'high',
        },
      ];
    } else {
      // Mars Destination
      return [
        {
          id: 'gravity',
          label: '1. Gravity Disparity (Δg)',
          earthValue: 'Earth: 9.81 m/s²',
          targetValue: 'Mars: 3.71 m/s²',
          divergencePercent: 62.2,
          divergenceLabel: 'Δg = 6.10 m/s² (62.2% reduction)',
          confidence: 'EXACT',
          provenanceType: 'MEASURED DATUM',
          source: 'Standard Gravitational Parameter (GM_Mars / R²)',
          caveat: 'Reduced ground contact traction; rover traverse slip mechanics intermediate between Moon and Earth.',
          severity: 'high',
        },
        {
          id: 'pressure',
          label: '2. Atmospheric Pressure (Δp)',
          earthValue: `Earth (${currentSite.shortName}): ${localPressureKPa} kPa`,
          targetValue: 'Mars: 0.636 kPa (~6.36 mbar CO₂)',
          divergencePercent: 99.3,
          divergenceLabel: `Δp = ${(localPressureKPa - 0.636).toFixed(1)} kPa (99.3% divergence)`,
          confidence: 'HIGH',
          provenanceType: 'DERIVED FORMULA',
          source: 'Curiosity REMS surface barometric pressure logs',
          caveat: 'Rarefied CO₂ atmosphere allows aeolian dust storms but offers minimal aerodynamic braking or convective cooling.',
          severity: 'critical',
        },
        {
          id: 'thermal',
          label: '3. Thermal Boundary Delta (ΔT)',
          earthValue: 'Earth: −15°C to +38°C',
          targetValue: 'Mars: −125°C to +20°C (diurnal span ~145°C)',
          divergencePercent: 65.0,
          divergenceLabel: 'Martian diurnal span 145°C vs Earth 53°C',
          confidence: 'HIGH',
          provenanceType: 'DERIVED FORMULA',
          source: 'Perseverance MEDA meteorological suite',
          caveat: 'Diurnal thermal shock stresses rover battery chemistry and mechanical joints.',
          severity: 'high',
        },
        {
          id: 'solar',
          label: '4. Solar Irradiance Variance (ΔI)',
          earthValue: 'Earth: 1,000 W/m² (AM1.5)',
          targetValue: 'Mars: ~590 W/m² (at 1.52 AU mean)',
          divergencePercent: 41.0,
          divergenceLabel: 'ΔI = −410 W/m² (41% solar flux loss)',
          confidence: 'HIGH',
          provenanceType: 'MEASURED DATUM',
          source: 'Inverse square solar flux attenuation at Mars orbital radius',
          caveat: 'Solar array sizing requires >2.5× surface area compared to lunar equator.',
          severity: 'moderate',
        },
        {
          id: 'radiation',
          label: '5. Radiation Flux Delta (ΔR)',
          earthValue: 'Earth: ~3.2 mSv/yr',
          targetValue: 'Mars: ~250 mSv/yr (RAD Curiosity surface dose)',
          divergencePercent: 98.7,
          divergenceLabel: 'ΔR = ~247 mSv/yr (~78× Earth background)',
          confidence: 'HIGH',
          provenanceType: 'COMPUTATIONAL MODEL',
          source: 'MSL RAD instrument (Hassler et al. 2014)',
          caveat: 'Atmospheric column provides ~20 g/cm² shielding; less severe than lunar surface but far exceeds OSHA limits.',
          severity: 'critical',
        },
        {
          id: 'regolith',
          label: '6. Regolith Chemistry & Perchlorates (ΔC)',
          earthValue: 'Earth: Non-toxic basaltic dust / clays',
          targetValue: 'Mars: 0.5–1.0 wt% Toxic Perchlorates (ClO₄⁻)',
          divergencePercent: 80.0,
          divergenceLabel: 'Astrobiological oxidizer barrier & toxic dust',
          confidence: 'HIGH',
          provenanceType: 'QUALITATIVE PROXY',
          source: 'Phoenix Wet Chemistry Lab & Curiosity SAM',
          caveat: 'Perchlorates attack spacesuit elastomers and pose toxic inhalation risk to crews.',
          severity: 'high',
        },
      ];
    }
  }, [currentSite, isMoon]);

  // Compute ARG Index: sqrt( 1/6 * sum( (div% / 100)^2 ) )
  const argIndex = useMemo(() => {
    const sumSq = axes.reduce((acc, ax) => acc + Math.pow(ax.divergencePercent / 100, 2), 0);
    return Math.sqrt(sumSq / axes.length);
  }, [axes]);

  const argZone = argIndex >= 0.70 ? 'HIGH DIVERGENCE' : argIndex >= 0.40 ? 'MODERATE DIVERGENCE' : 'LOW DIVERGENCE';
  const argZoneColor = argIndex >= 0.70 ? 'text-status-danger' : argIndex >= 0.40 ? 'text-status-warning' : 'text-accent-terrestrial';
  const argBadgeBg = argIndex >= 0.70 ? 'border-status-danger/40 bg-status-danger/10 text-status-danger' : 'border-status-warning/40 bg-status-warning/10 text-status-warning';

  const downloadDossier = () => {
    const data = {
      title: 'TERRALIGN Analog Reality Gap (ARG) Diagnostic Dossier',
      generatedAt: new Date().toISOString(),
      governance: {
        methodology: 'GSD v1.6.0',
        epistemicClassification: 'ILLUSTRATIVE COMPOSITE INDEX — NOT EMPIRICALLY CERTIFIED',
        formula: 'ARG(L,B) = sqrt( 1/6 * sum( (ΔPj / Pj_max)^2 ) )',
      },
      evaluationContext: {
        site: {
          id: currentSite.id,
          name: currentSite.name,
          region: currentSite.region,
          elevationMeters: currentSite.elevationMeters,
          coordinates: currentSite.coordinates,
        },
        destination: isMoon ? 'Lunar South Pole (Shackleton Crater Rim)' : 'Martian Jezero Crater Basin',
        compositeArgIndex: Number(argIndex.toFixed(2)),
        divergenceZone: argZone,
      },
      sixAxisBreakdown: axes.map((ax) => ({
        axis: ax.label,
        earthValue: ax.earthValue,
        destinationValue: ax.targetValue,
        divergencePercent: ax.divergencePercent,
        confidenceLevel: ax.confidence,
        source: ax.source,
        operationalCaveat: ax.caveat,
      })),
      compensationProtocols: COMPENSATION_TABLE,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TERRALIGN-ARG-${currentSite.id}-${targetBody}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* ── Cinematic Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#00D4AA] tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse shadow-[0_0_8px_#00D4AA]" />
            <span className="font-semibold">Screen 03</span>
            <span className="text-white/20">//</span>
            <span>Analog Reality Gap Diagnostic</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight leading-tight">
            Planetary Disparity<br className="sm:hidden" /> Quantification
          </h1>
          <p className="text-xs sm:text-sm text-[#8B9CB5] mt-2 font-sans max-w-2xl leading-relaxed">
            Characterizing the inescapable physical boundary divergence between terrestrial analog testing and extraterrestrial surface environments.
          </p>
        </div>

        {/* Site & Body Selector Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Target Body Toggle */}
          <div className="inline-flex rounded-xl border border-white/10 bg-[#0A192F]/80 backdrop-blur-xl p-1 shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-white/5">
            <button
              onClick={() => setTargetBody('moon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                isMoon
                  ? 'bg-gradient-to-r from-[#1E90FF]/30 to-[#1E90FF]/15 text-white font-bold border border-[#1E90FF]/60 shadow-[0_0_12px_rgba(30,144,255,0.35)]'
                  : 'text-[#8B9CB5] hover:text-white border border-transparent'
              }`}
            >
              <span className="text-[#38BDF8]">☽</span>
              <span>MOON (Shackleton)</span>
            </button>
            <button
              onClick={() => setTargetBody('mars')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                !isMoon
                  ? 'bg-gradient-to-r from-[#FF6B35]/30 to-[#FF6B35]/15 text-white font-bold border border-[#FF6B35]/60 shadow-[0_0_12px_rgba(255,107,53,0.35)]'
                  : 'text-[#8B9CB5] hover:text-white border border-transparent'
              }`}
            >
              <span className="text-[#FF6B35]">♂</span>
              <span>MARS (Jezero)</span>
            </button>
          </div>

          {/* Analog Site Picker */}
          <select
            value={currentSite.id}
            onChange={(e) => selectSite(e.target.value)}
            className="bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 text-white text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] shadow-[0_4px_20px_rgba(0,0,0,0.4)] cursor-pointer"
          >
            {allSites.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#0A192F] text-white">
                {s.shortName}
              </option>
            ))}
          </select>

          {/* Export JSON Dossier */}
          <button
            onClick={downloadDossier}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00D4AA]/20 to-[#00D4AA]/10 border border-[#00D4AA]/40 text-[#00D4AA] text-xs font-mono hover:bg-[#00D4AA]/25 transition-all shadow-[0_0_12px_rgba(0,212,170,0.2)] hover:shadow-[0_0_16px_rgba(0,212,170,0.35)]"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>EXPORT DOSSIER</span>
          </button>
        </div>
      </div>

      {/* Hero Metric Banner: ARG Composite Index & 6-Axis Spatial Radar Centerpiece */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Metric Card & Formula Demarcation (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0A192F]/80 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/5 luminous-surface-prominent shine-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#8B9CB5] tracking-wider uppercase font-semibold">
                COMPOSITE REALITY GAP
              </span>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border uppercase ${argBadgeBg} shadow-[0_0_8px_rgba(255,107,53,0.15)]`}>
                {argZone}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className={`text-5xl sm:text-6xl font-mono font-bold tracking-tight ${argZoneColor} drop-shadow-[0_0_16px_rgba(255,107,53,0.3)]`}>
                {argIndex.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-[#8B9CB5]">
                INDEX SCALE: 0.00 (Identical) → 1.00 (Total Disparity)
              </span>
            </div>

            {/* Formula Demarcation */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-[#CBD5E1] leading-relaxed space-y-1.5 shadow-inner">
              <div className="text-[#00D4AA] font-bold text-xs">ARG(L, B) = √( 1/6 · Σ [ ΔPⱼ / Pⱼ_max ]² )</div>
              <div className="text-[10px] text-[#8B9CB5]">
                Active Pair: <span className="text-white font-medium">{currentSite.shortName}</span> ➔{' '}
                <span className={isMoon ? 'text-[#38BDF8] font-medium' : 'text-[#FF6B35] font-medium'}>
                  {isMoon ? 'Lunar South Pole Rim' : 'Martian Jezero Delta'}
                </span>
              </div>
              <div className="text-[9.5px] text-[#8B9CB5]/80 pt-1 border-t border-white/5">
                Calculated RMS Euclidean divergence across 6 normalized physical boundaries.
              </div>
            </div>

            {/* Invariant Highlights */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-[#112240]/50 border border-white/10 text-center shadow-inner">
                <div className="text-[9px] font-mono text-[#8B9CB5] uppercase font-semibold">GRAVITY Δ</div>
                <div className="text-sm font-mono font-bold text-[#FF4D4D] mt-0.5">{isMoon ? '-83.5%' : '-62.2%'}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#112240]/50 border border-white/10 text-center shadow-inner">
                <div className="text-[9px] font-mono text-[#8B9CB5] uppercase font-semibold">PRESSURE Δ</div>
                <div className="text-sm font-mono font-bold text-[#FF4D4D] mt-0.5">{isMoon ? '100%' : '99.3%'}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#112240]/50 border border-white/10 text-center shadow-inner">
                <div className="text-[9px] font-mono text-[#8B9CB5] uppercase font-semibold">RADIATION Δ</div>
                <div className="text-sm font-mono font-bold text-[#FF4D4D] mt-0.5">{isMoon ? '>100×' : '~78×'}</div>
              </div>
            </div>
          </div>

          {/* Epistemic Guardrail Notice */}
          <div className="text-[10px] font-mono text-[#F59E0B] flex items-center gap-1.5 pt-2 border-t border-white/10">
            <span>⚠</span>
            <span>ILLUSTRATIVE COMPOSITE INDEX — NOT AN EMPIRICALLY CERTIFIED FLIGHT METRIC</span>
          </div>
        </div>

        {/* 6-Axis Spatial Radar Visualizer Centerpiece (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0A192F]/80 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/5 shine-card">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isMoon ? 'bg-[#1E90FF] shadow-[0_0_8px_#1E90FF]' : 'bg-[#FF6B35] shadow-[0_0_8px_#FF6B35]'}`} />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Six-Axis Spatial Disparity Radar
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#8B9CB5]">
              TARGET: {isMoon ? 'LUNAR SOUTH POLE' : 'MARS SURFACE'}
            </span>
          </div>

          {/* SVG Radar Diagram */}
          <div className="relative w-full h-64 sm:h-72 flex items-center justify-center bg-[#050811]/90 rounded-xl border border-white/10 p-2 overflow-hidden shadow-inner">
            <svg className="w-full h-full max-w-md" viewBox="0 0 360 280">
              <defs>
                <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={isMoon ? "rgba(30,144,255,0.25)" : "rgba(255,107,53,0.25)"} />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              {/* Concentric Hexagonal Reference Rings: 25%, 50%, 75%, 100% */}
              {[0.25, 0.5, 0.75, 1.0].map((scale) => {
                const r = scale * 95;
                const points = Array.from({ length: 6 }).map((_, i) => {
                  const angle = -Math.PI / 2 + (i * Math.PI) / 3;
                  return `${180 + r * Math.cos(angle)},${140 + r * Math.sin(angle)}`;
                }).join(' ');

                return (
                  <polygon
                    key={scale}
                    points={points}
                    fill="none"
                    stroke="rgba(139,156,181,0.18)"
                    strokeWidth="1"
                    strokeDasharray={scale === 1.0 ? undefined : "3 3"}
                  />
                );
              })}

              {/* Radiating 6 Axis Spokes */}
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = -Math.PI / 2 + (i * Math.PI) / 3;
                const x2 = 180 + 95 * Math.cos(angle);
                const y2 = 140 + 95 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1="180"
                    y1="140"
                    x2={x2}
                    y2={y2}
                    stroke="rgba(139,156,181,0.25)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Plotted Reality Gap Polygon */}
              {(() => {
                const polygonPoints = axes.map((ax, i) => {
                  const angle = -Math.PI / 2 + (i * Math.PI) / 3;
                  const dist = (Math.min(100, ax.divergencePercent) / 100) * 95;
                  return `${180 + dist * Math.cos(angle)},${140 + dist * Math.sin(angle)}`;
                }).join(' ');

                return (
                  <>
                    <polygon
                      points={polygonPoints}
                      fill={isMoon ? "rgba(30,144,255,0.25)" : "rgba(255,107,53,0.25)"}
                      stroke={isMoon ? "#1E90FF" : "#FF6B35"}
                      strokeWidth="2"
                    />

                    {/* Vertex Nodes */}
                    {axes.map((ax, i) => {
                      const angle = -Math.PI / 2 + (i * Math.PI) / 3;
                      const dist = (Math.min(100, ax.divergencePercent) / 100) * 95;
                      const vx = 180 + dist * Math.cos(angle);
                      const vy = 140 + dist * Math.sin(angle);
                      return (
                        <g key={ax.id}>
                          <circle
                            cx={vx}
                            cy={vy}
                            r="4.5"
                            fill={isMoon ? "#38BDF8" : "#FF6B35"}
                            stroke="#050811"
                            strokeWidth="1.5"
                          />
                        </g>
                      );
                    })}
                  </>
                );
              })()}

              {/* Axis Peripheral Labels */}
              {axes.map((ax, i) => {
                const angle = -Math.PI / 2 + (i * Math.PI) / 3;
                const labelDist = 120;
                const lx = 180 + labelDist * Math.cos(angle);
                const ly = 140 + labelDist * Math.sin(angle);
                const shortNames = ['1. Gravity', '2. Pressure', '3. Thermal', '4. Solar', '5. Radiation', '6. Regolith'];

                return (
                  <text
                    key={ax.id}
                    x={lx}
                    y={ly + 3}
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {shortNames[i]}
                    <tspan x={lx} dy="11" fill={isMoon ? "#38BDF8" : "#FF6B35"} fontSize="8">
                      {ax.divergencePercent.toFixed(1)}%
                    </tspan>
                  </text>
                );
              })}

              {/* Center Baseline Earth Dot */}
              <circle cx="180" cy="140" r="3.5" fill="#00D4AA" />
              <text x="180" y="153" textAnchor="middle" fill="#00D4AA" fontSize="7.5" fontFamily="monospace" fontWeight="bold">
                EARTH BASE
              </text>
            </svg>
          </div>

          {/* Radar Legend and Footnote */}
          <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-[#8B9CB5] pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00D4AA]" />
                <span>Center = Earth Baseline (0%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isMoon ? 'bg-[#1E90FF]' : 'bg-[#FF6B35]'}`} />
                <span>Perimeter = Total Disparity (100%)</span>
              </span>
            </div>
            <span className="text-[#8B9CB5]/80">RMS Euclidean Metric Space</span>
          </div>
        </div>
      </div>

      {/* 6-Axis Physical Divergence Cards Grid */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#8B9CB5] flex items-center gap-2">
            <span>SIX-AXIS PHYSICAL DISPARITY COMPARISON</span>
            <span className="text-[10px] text-[#00D4AA] font-normal">// MIXED EVIDENCE CLASSES</span>
          </h2>
          <span className="text-xs font-mono text-[#8B9CB5]">6 Parameters Evaluated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {axes.map((ax) => {
            const barBg =
              ax.severity === 'critical'
                ? 'bg-gradient-to-r from-red-500 to-rose-400'
                : ax.severity === 'high'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-emerald-400 to-[#00D4AA]';

            const confBadge =
              ax.confidence === 'EXACT'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : ax.confidence === 'HIGH'
                  ? 'bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/30'
                  : ax.confidence === 'MODERATE'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30';

            return (
              <div
                key={ax.id}
                className="rounded-2xl border border-white/10 bg-[#0A192F]/80 backdrop-blur-xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 hover:border-white/20 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/5 shine-card"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-display font-bold text-white uppercase tracking-wide">
                      {ax.label}
                    </h3>
                    <span className="text-[8.5px] font-mono text-[#00D4AA] tracking-wider block mt-0.5 font-semibold">
                      [{ax.provenanceType}]
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${confBadge}`}>
                    CONF: {ax.confidence}
                  </span>
                </div>

                {/* Values Comparison */}
                <div className="space-y-1.5 bg-black/40 p-3 rounded-xl border border-white/10 text-xs font-mono shadow-inner">
                  <div className="flex justify-between items-center text-[#8B9CB5]">
                    <span>TERRESTRIAL:</span>
                    <span className="text-white font-medium">{ax.earthValue}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#8B9CB5]">
                    <span>DESTINATION:</span>
                    <span className="text-[#38BDF8] font-semibold">{ax.targetValue}</span>
                  </div>
                </div>

                {/* Progress Divergence Bar */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-mono mb-1.5">
                    <span className="text-[#CBD5E1] text-[10.5px]">{ax.divergenceLabel}</span>
                    <span className="font-bold text-white">{ax.divergencePercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                      style={{ width: `${Math.min(100, ax.divergencePercent)}%` }}
                    />
                  </div>
                </div>

                {/* Source & Caveat */}
                <div className="space-y-1.5 pt-2.5 border-t border-white/10 text-[10px] font-mono leading-relaxed">
                  <div className="text-[#8B9CB5]">
                    <span className="text-[#8B9CB5]/60 font-semibold">REF: </span>
                    {ax.source}
                  </div>
                  <div className="text-amber-400/90 flex items-start gap-1.5 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                    <span className="flex-shrink-0 text-amber-400">⚠</span>
                    <span>{ax.caveat}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulator Compensation Protocols Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0A192F]/80 backdrop-blur-xl p-5 sm:p-6 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/5 shine-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                Proposed Experimental Compensation Protocols
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                ENGINEERING PROPOSALS — NOT VALIDATED SIMULATIONS
              </span>
            </div>
            <p className="text-xs font-sans text-[#8B9CB5] mt-1">
              Laboratory-scale facilities recommended to bridge the physical gaps that cannot be satisfied at {currentSite.shortName}.
            </p>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-[#8B9CB5] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3.5">Gap Axis</th>
                <th className="py-3 px-3.5">Proposed Compensation Protocol</th>
                <th className="py-3 px-3.5">Test Facility / Rig</th>
                <th className="py-3 px-3.5 text-right">Validation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#CBD5E1]">
              {COMPENSATION_TABLE.map((row) => {
                const statusPill =
                  row.statusClass === 'validated'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : row.statusClass === 'partial'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-white/5 text-[#8B9CB5] border-white/10';

                return (
                  <tr key={row.axis} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-3.5 font-semibold text-white whitespace-nowrap">{row.axis}</td>
                    <td className="py-3.5 px-3.5 font-sans text-xs text-[#E2E8F0]">{row.protocol}</td>
                    <td className="py-3.5 px-3.5 text-[#00D4AA] whitespace-nowrap">{row.facility}</td>
                    <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${statusPill}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screen Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        <Link
          href="/terrain"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#8B9CB5] hover:text-white transition-colors"
        >
          <span>← PREVIOUS: 3D TERRAIN STUDIO</span>
        </Link>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] text-[#050811] font-mono text-xs font-bold hover:brightness-110 transition-all shadow-[0_0_16px_rgba(0,212,170,0.4)]"
        >
          <span>PROCEED TO SCREEN 04: PORTFOLIO OPTIMIZER →</span>
        </Link>
      </div>
    </div>
  );
}
