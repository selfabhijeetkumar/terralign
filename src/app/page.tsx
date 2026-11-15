import type { Metadata } from 'next';
import Link from 'next/link';
import { EarthGlobe } from '@/components/globe/EarthGlobe';
import { getAllAnalogs } from '@/lib/analogs';

export const metadata: Metadata = {
  title: 'TERRALIGN — Where Earth Meets Other Worlds',
  description:
    'A mission-intelligence platform for understanding terrestrial analog environments, planetary terrain, physical disparities, and multi-site exploration strategies.',
};

export default function LandingPage() {
  const sites = getAllAnalogs();

  return (
    <div className="w-full min-h-screen bg-transparent text-[#F8FAFC] selection:bg-[#00D4AA] selection:text-[#050811] overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION — Full-Screen Planetary Presentation
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[calc(100vh-3rem)] min-h-[640px] flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-hidden">
        {/* Full-bleed 3D Earth Globe Canvas in Background */}
        <div className="absolute inset-0 z-0 opacity-85">
          <EarthGlobe
            className="w-full h-full"
            interactive={true}
            cameraDistance={7.8}
            showAllMarkers={true}
          />
        </div>

        {/* Cinematic Vignette Framing */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `
              radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(5,8,17,0.85) 90%),
              linear-gradient(to top, #050811 0%, transparent 25%),
              linear-gradient(to bottom, #050811 0%, transparent 15%)
            `,
          }}
          aria-hidden="true"
        />

        {/* Top Eyebrow Readout */}
        <div className="relative z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#00D4AA] shadow-[0_0_8px_#00D4AA]" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#8B9CB5]">
              Planetary Analog Intelligence System
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono text-[#8B9CB5]">
            <span>USGS 3DEP LiDAR</span>
            <span className="text-[#8B9CB5]/30">/</span>
            <span>NASA LOLA DEM</span>
            <span className="text-[#8B9CB5]/30">/</span>
            <span className="text-[#00D4AA]">7 FLAGSHIP SITES</span>
          </div>
        </div>

        {/* Hero Headline & Editorial Call-to-Action */}
        <div className="relative z-20 max-w-4xl space-y-6 my-auto pt-12 pb-6">
          <div className="space-y-2">
            <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl tracking-[-0.03em] uppercase leading-[0.95]">
              Where Earth Meets <br />
              <span className="text-[#00D4AA]">Other Worlds</span>
            </h1>
            <p className="font-sans text-base sm:text-lg text-[#CBD5E1] max-w-2xl font-light leading-relaxed pt-2">
              Before touching lunar regolith or Martian dust, exploration hardware and crew protocols must be validated across Earth’s most extreme planetary analog terrains.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/mission"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded bg-[#00D4AA] hover:bg-[#00D4AA]/90 text-[#050811] font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:scale-105 active:scale-95"
            >
              <span>ENTER MISSION COMMAND</span>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>

            <Link
              href="/terrain"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded bg-[#0A192F]/80 hover:bg-[#112240] border border-[#8B9CB5]/30 text-white font-mono text-xs uppercase tracking-wider transition-all backdrop-blur-md"
            >
              <span>EXPLORE 3D TERRAIN STUDIO</span>
            </Link>
          </div>
        </div>

        {/* Bottom Telemetry Bar */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#8B9CB5]/15 text-xs font-mono text-[#8B9CB5]">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[#8B9CB5]/60 text-[10px] block uppercase">Analog Database</span>
              <span className="text-white font-semibold">7 Verified Flagships</span>
            </div>
            <div>
              <span className="text-[#8B9CB5]/60 text-[10px] block uppercase">Verification Matrix</span>
              <span className="text-[#00D4AA] font-semibold">30 NASA RVM Criteria</span>
            </div>
            <div>
              <span className="text-[#8B9CB5]/60 text-[10px] block uppercase">Target Destinations</span>
              <span className="text-[#1E90FF] font-semibold">Moon (Shackleton) &amp; Mars</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-[#8B9CB5]">
            <span>SCROLL TO DISCOVER</span>
            <span className="animate-bounce">↓</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 01: PLANETARY PERSPECTIVE
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 border-t border-[#8B9CB5]/15 bg-gradient-to-b from-[#050811] to-[#0A192F]/40">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#8B9CB5]/15">
            <div>
              <span className="text-xs font-mono text-[#00D4AA] tracking-[0.2em] uppercase block mb-2">
                01 // Epistemic Foundation
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
                Earth is our only accessible laboratory.
              </h2>
            </div>
            <p className="text-sm font-sans text-[#CBD5E1] max-w-md font-light leading-relaxed">
              Every rover wheel, spacesuit joint, core drill, and autonomous landing algorithm destined for other worlds must first confront terrestrial geology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-[#0A192F]/60 border border-[#8B9CB5]/15 space-y-3 luminous-surface-prominent shine-card">
              <span className="text-3xl font-mono font-bold text-[#00D4AA]">01</span>
              <h3 className="text-lg font-display font-semibold text-white">Geological Fidelity</h3>
              <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
                Volcanic cinder fields, subglacial calderas, and hyper-arid deserts preserve regolith morphology and crater distributions identical to lunar and Martian landing sites.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-[#0A192F]/60 border border-[#8B9CB5]/15 space-y-3 luminous-surface-prominent shine-card">
              <span className="text-3xl font-mono font-bold text-[#1E90FF]">02</span>
              <h3 className="text-lg font-display font-semibold text-white">Hardware Survivability</h3>
              <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
                High-altitude basalt dust, extreme cold-soak environments, and abrasive cinder beds stress rover drivetrains and seal mechanics long before flight qualification.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-[#0A192F]/60 border border-[#8B9CB5]/15 space-y-3 luminous-surface-prominent shine-card">
              <span className="text-3xl font-mono font-bold text-[#FF6B35]">03</span>
              <h3 className="text-lg font-display font-semibold text-white">Physical Boundaries</h3>
              <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
                No single Earth site replicates all space conditions. TERRALIGN quantifies the exact physical &quot;Reality Gap&quot; to prevent costly flight failures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 02: 7 FLAGSHIP ANALOG SITES
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 border-t border-[#8B9CB5]/15 bg-[#050811]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#8B9CB5]/15">
            <div>
              <span className="text-xs font-mono text-[#00D4AA] tracking-[0.2em] uppercase block mb-2">
                02 // Ground-Truth Catalog
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
                Seven Flagship Planetary Analogs
              </h2>
            </div>
            <Link
              href="/mission"
              className="text-xs font-mono text-[#00D4AA] hover:underline flex items-center gap-1.5"
            >
              <span>EXPLORE ALL IN 3D MISSION COMMAND</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.slice(0, 6).map((s) => (
              <div
                key={s.id}
                className="p-6 rounded-xl bg-[#0A192F]/50 border border-[#8B9CB5]/15 hover:border-[#00D4AA]/40 transition-all space-y-4 group luminous-surface-prominent shine-card"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#8B9CB5]">
                  <span>{s.classification}</span>
                  <span className="text-[#00D4AA]">ELEV {s.elevationMeters}m</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-display font-bold text-white group-hover:text-[#00D4AA] transition-colors">
                    {s.name}
                  </h3>
                  <div className="text-[11px] font-mono text-[#8B9CB5]">
                    {s.region}, {s.country}
                  </div>
                </div>

                <p className="text-xs text-[#CBD5E1] line-clamp-3 leading-relaxed font-sans">
                  {s.primaryMissionRelevance}
                </p>

                <div className="pt-3 border-t border-[#8B9CB5]/15 flex items-center justify-between text-[10px] font-mono text-[#8B9CB5]">
                  <span>SOURCE REF DEM: {s.demResolutionMeters}m</span>
                  <Link
                    href={`/mission`}
                    className="text-[#00D4AA] font-bold group-hover:translate-x-0.5 transition-transform"
                  >
                    INSPECT SITE →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 03: 3D TERRAIN STUDIO CALLOUT
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 border-t border-[#8B9CB5]/15 bg-gradient-to-b from-[#0A192F]/40 to-[#050811]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono text-[#00D4AA] tracking-[0.2em] uppercase block">
              03 // Synchronized Terrain Comparison
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Extreme Low-Angle Solar Simulation
            </h2>
            <p className="text-sm font-sans text-[#CBD5E1] font-light leading-relaxed">
              At the Lunar South Pole (Shackleton Crater Rim), the Sun never rises more than 2.3° above the horizon. Deep craters cast tens of kilometers of pitch-black shadows where temperatures plummet to 40 Kelvin.
            </p>
            <p className="text-sm font-sans text-[#CBD5E1] font-light leading-relaxed">
              TERRALIGN’s Terrain Studio provides synchronized 3D morphometric comparison parameterized from published USGS 3DEP LiDAR (Cinder Lake, AZ) and NASA Lunar Reconnaissance Orbiter LOLA topography under identical grazing illumination.
            </p>
            <div>
              <Link
                href="/terrain"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#112240] hover:bg-[#1E90FF]/20 border border-[#1E90FF]/50 text-white font-mono text-xs uppercase tracking-wider transition-all"
              >
                <span>LAUNCH 3D TERRAIN STUDIO</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-[#050811] border border-[#8B9CB5]/20 shadow-2xl space-y-4 shine-card">
            <div className="flex items-center justify-between text-xs font-mono text-[#8B9CB5] pb-3 border-b border-[#8B9CB5]/15">
              <span>DUAL HARDWARE-ACCELERATED VIEWPORTS</span>
              <span className="text-[#00D4AA]">HARDWARE ACCELERATED WEBGL2</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
              <div className="p-4 rounded-lg bg-[#0A192F]/80 border border-[#8B9CB5]/15">
                <span className="text-[10px] text-[#8B9CB5] block mb-1">TERRESTRIAL</span>
                <span className="font-bold text-white">Cinder Lake 1</span>
                <span className="text-[10px] text-[#00D4AA] block mt-1">Published 1.0m USGS Ref</span>
              </div>
              <div className="p-4 rounded-lg bg-[#0A192F]/80 border border-[#8B9CB5]/15">
                <span className="text-[10px] text-[#8B9CB5] block mb-1">LUNAR POLAR</span>
                <span className="font-bold text-[#1E90FF]">Shackleton Rim</span>
                <span className="text-[10px] text-[#1E90FF] block mt-1">Published 5.0m LOLA Ref</span>
              </div>
            </div>
            <div className="p-3 rounded bg-[#112240]/40 text-[11px] font-mono text-[#CBD5E1]">
              <span className="text-[#00D4AA] font-bold">Solar Slider:</span> Real-time directional cast shadows computed dynamically from 0.0° to 5.0° elevation across 36,864 procedural terrain vertices (192×192 mesh).
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 04: REALITY GAP & PORTFOLIO OPTIMIZATION
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 border-t border-[#8B9CB5]/15 bg-[#050811]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#00D4AA] tracking-[0.2em] uppercase block">
              04 // Scientific Rigor
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Quantifying the Unreplicable
            </h2>
            <p className="text-sm font-sans text-[#CBD5E1] font-light leading-relaxed">
              Transparent mathematical characterization of where Earth ends and true space physics begins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Reality Gap Card */}
            <div className="p-8 rounded-2xl bg-[#0A192F]/50 border border-[#8B9CB5]/20 space-y-6 flex flex-col justify-between shine-card">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#00D4AA] font-bold">ARG DIAGNOSTIC</span>
                  <span className="text-[#8B9CB5]">SCREEN 03</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-white">
                  6-Axis Physical Divergence Matrix
                </h3>
                <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
                  Quantifies divergence across Gravity (Δg = 8.19 m/s²), Pressure (Δp = 100 kPa), Thermal range (polar 180°C span), Solar Irradiance, Surface Radiation, and Regolith Tribology.
                </p>
              </div>
              <div className="pt-4 border-t border-[#8B9CB5]/15">
                <Link
                  href="/reality-gap"
                  className="text-xs font-mono text-[#00D4AA] font-semibold hover:underline"
                >
                  INSPECT REALITY GAP MATRIX →
                </Link>
              </div>
            </div>

            {/* Portfolio Optimizer Card */}
            <div className="p-8 rounded-2xl bg-[#0A192F]/50 border border-[#8B9CB5]/20 space-y-6 flex flex-col justify-between shine-card">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#1E90FF] font-bold">PORTFOLIO OPTIMIZER</span>
                  <span className="text-[#8B9CB5]">SCREEN 04</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-white">
                  Greedy Submodular Set-Cover (k=3)
                </h3>
                <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
                  Calculates complementary analog test campaigns across 30 NASA Requirements Verification Matrix (RVM) parameters, reaching an empirical 81.7% partial-weighted / 76.7% binary coverage for optimal 3-site portfolios.
                </p>
              </div>
              <div className="pt-4 border-t border-[#8B9CB5]/15">
                <Link
                  href="/portfolio"
                  className="text-xs font-mono text-[#1E90FF] font-semibold hover:underline"
                >
                  LAUNCH PORTFOLIO OPTIMIZER →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 05: FINAL CALL TO ACTION
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full py-24 sm:py-32 px-6 sm:px-12 border-t border-[#8B9CB5]/15 bg-gradient-to-t from-[#0A192F]/80 to-[#050811] text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <span className="w-3 h-3 rounded-full bg-[#00D4AA] shadow-[0_0_12px_#00D4AA] inline-block" />
          <h2 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight uppercase">
            Launch Flight Operations
          </h2>
          <p className="text-sm sm:text-base text-[#CBD5E1] font-sans font-light leading-relaxed max-w-xl mx-auto">
            Experience the complete 3D planetary intelligence platform designed for the next era of lunar and Martian surface exploration.
          </p>
          <div>
            <Link
              href="/mission"
              className="inline-flex items-center gap-3 px-8 py-4 rounded bg-[#00D4AA] hover:bg-[#00D4AA]/90 text-[#050811] font-sans font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_24px_rgba(0,212,170,0.4)] hover:scale-105 active:scale-95"
            >
              <span>ENTER MISSION COMMAND</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER — Institutional Transparency
      ───────────────────────────────────────────────────────────── */}
      <footer className="w-full py-12 px-6 sm:px-12 lg:px-20 border-t border-[#8B9CB5]/15 bg-[#050811] text-xs font-mono text-[#8B9CB5]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-white font-bold tracking-widest uppercase">TERRALIGN</div>
            <div>Where Earth Meets Other Worlds. GSD v1.6.0.</div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">ABOUT</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-white transition-colors">CONTACT</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">PRIVACY</Link>
            <Link href="/terms" className="hover:text-white transition-colors">TERMS</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
