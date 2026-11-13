import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terrain Studio — TERRALIGN",
  description:
    "Dual-view 3D terrain comparison studio with synchronized orbital camera and low-angle lunar solar illumination.",
};

export default function TerrainStudioPage() {
  return (
    <div className="flex-1 flex flex-col p-6 sm:p-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb & Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-space-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent-terrestrial tracking-widest uppercase mb-1">
            <span>SCREEN 02</span>
            <span>//</span>
            <span>DUAL-VIEW 3D TERRAIN STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
            Cinder Lake Crater Field ↔ Shackleton Crater Rim
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-sans">
            Synchronized 3D terrain comparison across USGS 3DEP (1m) and NASA LRO LOLA (5m) elevation grids.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-accent-lunar/30 bg-accent-lunar/10 text-accent-lunar font-mono text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-lunar animate-pulse" />
            WAVE 3.3 TARGET
          </span>
        </div>
      </div>

      {/* Viewport Placeholder Frame */}
      <div className="mt-6 flex-1 min-h-[420px] rounded-card border border-space-border bg-space-surface/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Subtle coordinate overlay */}
        <div className="absolute top-4 left-4 text-[10px] font-mono text-text-muted flex gap-4">
          <span>LAT: 35°19&apos;14&quot; N</span>
          <span>LON: 111°31&apos;08&quot; W</span>
          <span>ELEV: 2,108m</span>
        </div>
        <div className="absolute top-4 right-4 text-[10px] font-mono text-accent-lunar flex gap-4">
          <span>TARGET: MOON (SOUTH POLE)</span>
          <span>SUN ELEV: 2.3°</span>
        </div>

        <div className="max-w-md space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-space-elevated border border-accent-terrestrial/30 flex items-center justify-center text-accent-terrestrial shadow-[0_0_16px_rgba(0,212,170,0.2)]">
            <svg className="w-7 h-7" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 15L7.5 9L11 13L13.5 10L17 15H3Z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6.5" cy="5.5" r="1.5" />
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-text-primary">
            Synchronized 3D Canvas
          </h2>
          <p className="text-xs font-sans text-text-secondary leading-relaxed">
            Side-by-side WebGL canvas powered by Three.js / React Three Fiber with raytraced low-angle shadow casting will mount here in Wave 3.3.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-2">
            <Link
              href="/"
              className="px-3 py-1.5 rounded text-xs font-sans text-text-muted hover:text-text-primary bg-space-elevated border border-space-border transition-colors"
            >
              ← Return to Mission Command
            </Link>
            <Link
              href="/reality-gap"
              className="px-3 py-1.5 rounded text-xs font-sans text-accent-terrestrial hover:bg-accent-terrestrial/10 border border-accent-terrestrial/30 transition-colors"
            >
              Next: Reality Gap Panel →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

