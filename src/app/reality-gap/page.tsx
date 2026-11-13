import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reality Gap Diagnostic — TERRALIGN",
  description:
    "Analog Reality Gap (ARG) 6-axis quantification engine comparing gravity, atmosphere, thermal, radiation, regolith, and illumination boundary deltas.",
};

export default function RealityGapPage() {
  return (
    <div className="flex-1 flex flex-col p-6 sm:p-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb & Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-space-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent-terrestrial tracking-widest uppercase mb-1">
            <span>SCREEN 03</span>
            <span>//</span>
            <span>ANALOG REALITY GAP (ARG) DIAGNOSTIC</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
            6-Axis Planetary Disparity Quantification
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-sans">
            Rigorous physical and operational delta characterization: Gravity, Atmosphere, Thermal, Radiation, Regolith & Illumination.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-accent-martian/30 bg-accent-martian/10 text-accent-martian font-mono text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-martian animate-pulse" />
            WAVE 3.4 TARGET
          </span>
        </div>
      </div>

      {/* Viewport Placeholder Frame */}
      <div className="mt-6 flex-1 min-h-[420px] rounded-card border border-space-border bg-space-surface/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Subtle metrics overlay */}
        <div className="absolute top-4 left-4 text-[10px] font-mono text-text-muted flex gap-4">
          <span>PAIR: CINDER LAKE / SHACKLETON</span>
          <span>COMPOSITE ARG: 0.72</span>
        </div>
        <div className="absolute top-4 right-4 text-[10px] font-mono text-status-warning flex gap-4">
          <span>INESCAPABLE GAPS: Δg = 8.19 m/s²</span>
        </div>

        <div className="max-w-md space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-space-elevated border border-accent-martian/30 flex items-center justify-center text-accent-martian shadow-[0_0_16px_rgba(255,107,53,0.2)]">
            <svg className="w-7 h-7" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 13H15M15 13L11 9M15 13L11 17" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 7H5M5 7L9 3M5 7L9 11" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-text-primary">
            ARG Diagnostic Matrix & Simulator Offsets
          </h2>
          <p className="text-xs font-sans text-text-secondary leading-relaxed">
            The 6-axis reality gap card grid and Bekker-Wong soil mechanics compensation engine will mount here in Wave 3.4.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-2">
            <Link
              href="/terrain"
              className="px-3 py-1.5 rounded text-xs font-sans text-text-muted hover:text-text-primary bg-space-elevated border border-space-border transition-colors"
            >
              ← Previous: Terrain Studio
            </Link>
            <Link
              href="/portfolio"
              className="px-3 py-1.5 rounded text-xs font-sans text-accent-terrestrial hover:bg-accent-terrestrial/10 border border-accent-terrestrial/30 transition-colors"
            >
              Next: Portfolio Optimizer →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

