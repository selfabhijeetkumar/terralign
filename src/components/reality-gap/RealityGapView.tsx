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
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-space-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent-terrestrial tracking-widest uppercase mb-1">
            <span>SCREEN 03</span>
            <span>//</span>
            <span>ANALOG REALITY GAP (ARG) DIAGNOSTIC</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary tracking-tight">
            Planetary Disparity Quantification
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-sans">
            Characterizing the inescapable physical boundary divergence between terrestrial analog testing and extraterrestrial surface environments.
          </p>
        </div>

        {/* Site & Body Selector Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Target Body Toggle */}
          <div className="inline-flex rounded-card border border-space-border bg-space-surface p-1">
            <button
              onClick={() => setTargetBody('moon')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                isMoon
                  ? 'bg-accent-lunar text-space-bg font-bold shadow-glow-lunar'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              MOON (Shackleton)
            </button>
            <button
              onClick={() => setTargetBody('mars')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                !isMoon
                  ? 'bg-accent-martian text-space-bg font-bold shadow-glow-martian'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              MARS (Jezero)
            </button>
          </div>

          {/* Analog Site Picker */}
          <select
            value={currentSite.id}
            onChange={(e) => selectSite(e.target.value)}
            className="bg-space-surface border border-space-border text-text-primary text-xs font-mono rounded-card px-3 py-1.5 focus:outline-none focus:border-accent-terrestrial cursor-pointer"
          >
            {allSites.map((s) => (
              <option key={s.id} value={s.id} className="bg-space-surface text-text-primary">
                {s.shortName}
              </option>
            ))}
          </select>

          {/* Export JSON Dossier */}
          <button
            onClick={downloadDossier}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-card bg-accent-terrestrial/10 border border-accent-terrestrial/40 text-accent-terrestrial text-xs font-mono hover:bg-accent-terrestrial/20 transition-all shadow-glow"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>EXPORT DOSSIER</span>
          </button>
        </div>
      </div>

      {/* Hero Metric Banner: ARG Composite Index */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Metric Card */}
        <div className="lg:col-span-5 rounded-card border border-space-border bg-space-surface p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-muted tracking-wider uppercase">
              COMPOSITE REALITY GAP
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${argBadgeBg}`}>
              {argZone}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className={`text-5xl font-mono font-bold tracking-tight ${argZoneColor}`}>
              {argIndex.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-text-muted">
              INDEX SCALE: 0.00 (Identical) → 1.00 (Total Disparity)
            </span>
          </div>

          {/* Formula Demarcation */}
          <div className="p-2.5 rounded bg-space-bg/80 border border-space-border/60 text-[11px] font-mono text-text-secondary leading-relaxed">
            <div className="text-accent-terrestrial font-bold">ARG(L, B) = √( 1/6 · Σ [ ΔPⱼ / Pⱼ_max ]² )</div>
            <div className="text-[10px] text-text-muted mt-1">
              Active Pair: <span className="text-text-primary">{currentSite.shortName}</span> ➔{' '}
              <span className="text-accent-lunar">{isMoon ? 'Lunar South Pole Rim' : 'Martian Jezero Delta'}</span>
            </div>
          </div>

          {/* Epistemic Guardrail Notice */}
          <div className="text-[10px] font-mono text-status-warning flex items-center gap-1.5 pt-1 border-t border-space-border">
            <span>⚠</span>
            <span>ILLUSTRATIVE COMPOSITE INDEX — NOT AN EMPIRICALLY CERTIFIED FLIGHT METRIC</span>
          </div>
        </div>

        {/* Narrative & Operational Context */}
        <div className="lg:col-span-7 rounded-card border border-space-border bg-space-surface/60 p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent-terrestrial uppercase mb-1">
              <span>EXPLORATION OPERATIONAL IMPLICATION</span>
            </div>
            <h3 className="text-base font-display font-semibold text-text-primary">
              Where Physics Cannot Be Replicated On Earth
            </h3>
            <p className="text-xs font-sans text-text-secondary leading-relaxed mt-2">
              Terrestrial analogs provide exceptional fidelity for geomorphology, rover wheel traction, and astronaut ergonomics. However, fundamental physical invariants like vacuum tribology, partial gravity kinematics, and unattenuated cosmic radiation cannot be simulated outdoors on Earth.
            </p>
          </div>

          {/* Invariant Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="p-2.5 rounded bg-space-elevated border border-space-border">
              <div className="text-[10px] font-mono text-text-muted">GRAVITY DELTA</div>
              <div className="text-sm font-mono font-bold text-status-danger">{isMoon ? '83.5% REDUCTION' : '62.2% REDUCTION'}</div>
              <div className="text-[10px] text-text-muted mt-0.5">Offload rig required</div>
            </div>
            <div className="p-2.5 rounded bg-space-elevated border border-space-border">
              <div className="text-[10px] font-mono text-text-muted">ATMOSPHERE DELTA</div>
              <div className="text-sm font-mono font-bold text-status-danger">{isMoon ? '100% VACUUM' : '99.3% RAREFIED'}</div>
              <div className="text-[10px] text-text-muted mt-0.5">TVAC testing needed</div>
            </div>
            <div className="p-2.5 rounded bg-space-elevated border border-space-border">
              <div className="text-[10px] font-mono text-text-muted">RADIATION DELTA</div>
              <div className="text-sm font-mono font-bold text-status-danger">{isMoon ? '>100× SURF DOSE' : '~78× SURF DOSE'}</div>
              <div className="text-[10px] text-text-muted mt-0.5">FLUKA model required</div>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Axis Physical Divergence Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-wider text-text-muted flex items-center gap-2">
            <span>6-Axis Reality Gap Quantification Grid</span>
            <span className="text-[10px] text-accent-terrestrial font-normal">// VERIFIED SOURCE METRICS</span>
          </h2>
          <span className="text-xs font-mono text-text-muted">6 Parameters Evaluated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {axes.map((ax) => {
            const barBg =
              ax.severity === 'critical'
                ? 'bg-status-danger'
                : ax.severity === 'high'
                  ? 'bg-status-warning'
                  : 'bg-accent-terrestrial';

            const confBadge =
              ax.confidence === 'EXACT'
                ? 'bg-status-exact/10 text-status-exact border-status-exact/30'
                : ax.confidence === 'HIGH'
                  ? 'bg-accent-terrestrial/10 text-accent-terrestrial border-accent-terrestrial/30'
                  : ax.confidence === 'MODERATE'
                    ? 'bg-status-warning/10 text-status-warning border-status-warning/30'
                    : 'bg-status-danger/10 text-status-danger border-status-danger/30';

            return (
              <div
                key={ax.id}
                className="rounded-card border border-space-border bg-space-surface p-4 flex flex-col justify-between space-y-3 hover:border-space-border/80 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-display font-bold text-text-primary uppercase tracking-wide">
                    {ax.label}
                  </h3>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${confBadge}`}>
                    CONF: {ax.confidence}
                  </span>
                </div>

                {/* Values Comparison */}
                <div className="space-y-1 bg-space-bg/60 p-2.5 rounded border border-space-border/40 text-xs font-mono">
                  <div className="flex justify-between items-center text-text-muted">
                    <span>TERRESTRIAL:</span>
                    <span className="text-text-primary">{ax.earthValue}</span>
                  </div>
                  <div className="flex justify-between items-center text-text-muted">
                    <span>DESTINATION:</span>
                    <span className="text-accent-lunar font-semibold">{ax.targetValue}</span>
                  </div>
                </div>

                {/* Progress Divergence Bar */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                    <span className="text-text-secondary">{ax.divergenceLabel}</span>
                    <span className="font-bold text-text-primary">{ax.divergencePercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-space-elevated overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                      style={{ width: `${Math.min(100, ax.divergencePercent)}%` }}
                    />
                  </div>
                </div>

                {/* Source & Caveat */}
                <div className="space-y-1.5 pt-2 border-t border-space-border text-[10px] font-mono leading-relaxed">
                  <div className="text-text-muted">
                    <span className="text-text-disabled">REF: </span>
                    {ax.source}
                  </div>
                  <div className="text-status-warning/90 flex items-start gap-1">
                    <span className="flex-shrink-0">⚠</span>
                    <span>{ax.caveat}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulator Compensation Protocols Table */}
      <div className="rounded-card border border-space-border bg-space-surface p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-space-border">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider">
                Proposed Experimental Compensation Protocols
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-warning/10 text-status-warning border border-status-warning/30">
                ENGINEERING PROPOSALS — NOT VALIDATED SIMULATIONS
              </span>
            </div>
            <p className="text-xs font-sans text-text-muted mt-0.5">
              Laboratory-scale facilities recommended to bridge the physical gaps that cannot be satisfied at {currentSite.shortName}.
            </p>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-space-border text-text-muted uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Gap Axis</th>
                <th className="py-2.5 px-3">Proposed Compensation Protocol</th>
                <th className="py-2.5 px-3">Test Facility / Rig</th>
                <th className="py-2.5 px-3 text-right">Validation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-border/50 text-text-secondary">
              {COMPENSATION_TABLE.map((row) => {
                const statusPill =
                  row.statusClass === 'validated'
                    ? 'bg-status-success/10 text-status-success border-status-success/30'
                    : row.statusClass === 'partial'
                      ? 'bg-status-warning/10 text-status-warning border-status-warning/30'
                      : 'bg-space-elevated text-text-muted border-space-border';

                return (
                  <tr key={row.axis} className="hover:bg-space-elevated/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-text-primary whitespace-nowrap">{row.axis}</td>
                    <td className="py-3 px-3 font-sans text-xs">{row.protocol}</td>
                    <td className="py-3 px-3 text-accent-terrestrial whitespace-nowrap">{row.facility}</td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusPill}`}>
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-space-border">
        <Link
          href="/terrain"
          className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-text-primary transition-colors"
        >
          <span>← PREVIOUS: 3D TERRAIN STUDIO</span>
        </Link>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-card bg-accent-terrestrial text-space-bg font-mono text-xs font-bold hover:bg-accent-terrestrial/90 transition-all shadow-glow"
        >
          <span>PROCEED TO SCREEN 04: PORTFOLIO OPTIMIZER →</span>
        </Link>
      </div>
    </div>
  );
}
