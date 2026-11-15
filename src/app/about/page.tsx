import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — TERRALIGN',
  description:
    'The engineering and scientific foundation behind TERRALIGN: connecting terrestrial analog research to deep space exploration.',
};

export default function AboutPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-12 space-y-12 text-[#F8FAFC]">
      <div className="space-y-3 border-b border-[#8B9CB5]/20 pb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D4AA] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
          <span>Mission Charter</span>
          <span className="text-[#8B9CB5]">// Technical Overview</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
          About TERRALIGN
        </h1>
        <p className="text-base sm:text-lg text-[#CBD5E1] font-light leading-relaxed">
          Where Earth meets other worlds: bridging terrestrial analog research, planetary topography, physical divergence quantification, and multi-site campaign optimization.
        </p>
      </div>

      <div className="space-y-8 text-sm sm:text-base font-light text-[#CBD5E1] leading-relaxed">
        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide">
            1. The Exploration Problem
          </h2>
          <p>
            Surface exploration of the Moon and Mars demands unprecedented hardware survivability, autonomous navigation reliability, and crew operational readiness. However, testing on extraterrestrial surfaces is impossible before launch. Flight projects rely on Earth analog environments—volcanic cinder plains, glacial calderas, and hyper-arid deserts—as ground-truth proxies.
          </p>
          <p>
            Historically, analog selection has suffered from subjective assessment, isolated field reports, and failure to account for invariant physical disparities like gravity, atmospheric vacuum, and cosmic radiation.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide">
            2. The TERRALIGN Architecture
          </h2>
          <p>
            TERRALIGN integrates three core intelligence capabilities:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-white">Ground-Truth Analog Knowledge Base:</strong> Seven rigorously documented flagship sites (Cinder Lake, Askja, Atacama, McMurdo Dry Valleys, Mauna Kea, San Rafael Swell, Haughton Crater) mapped with official USGS 3DEP LiDAR and peer-reviewed geological citations.
            </li>
            <li>
              <strong className="text-white">Low-Angle Solar Terrain Studio:</strong> Direct 3D hardware-accelerated comparison of terrestrial crater topography with NASA Lunar Reconnaissance Orbiter (LOLA) digital elevation models under grazing polar solar illumination (0.0° to 5.0°).
            </li>
            <li>
              <strong className="text-white">Analog Reality Gap (ARG) Diagnostic:</strong> A 6-axis divergence engine quantifying physical boundaries across Gravity, Pressure, Thermal Boundaries, Solar Irradiance, Surface Radiation, and Regolith Tribology.
            </li>
            <li>
              <strong className="text-white">Submodular Portfolio Optimizer:</strong> A greedy set-cover algorithm evaluating complementary site combinations against 30 NASA Requirements Verification Matrix (RVM) parameters, achieving 81.7% empirical coverage (76.7% binary) for optimal 3-site campaigns.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide">
            3. Provenance and Standards
          </h2>
          <p>
            All geospatial and topographic datasets derive from public domain scientific missions, including the U.S. Geological Survey (USGS 3DEP) and the NASA Planetary Data System (LRO LOLA). All 3D surface visualizations represent procedural morphometric models parameterized from published profiles rather than direct raw raster DEM tiles. Development follows the GSD v1.6.0 specification and Ponytail FULL engineering governance.
          </p>
        </div>
      </div>

      <div className="pt-8 border-t border-[#8B9CB5]/20 flex items-center justify-between text-xs font-mono">
        <Link href="/" className="text-[#8B9CB5] hover:text-white transition-colors">
          ← BACK TO HOME
        </Link>
        <Link
          href="/mission"
          className="px-4 py-2 rounded bg-[#00D4AA] text-[#050811] font-bold hover:bg-[#00D4AA]/90 transition-all shadow-[0_0_12px_rgba(0,212,170,0.3)]"
        >
          LAUNCH MISSION COMMAND →
        </Link>
      </div>
    </div>
  );
}
