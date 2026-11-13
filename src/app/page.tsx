import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mission Command — TERRALIGN",
  description:
    "Global Mission Command and Planetary Activity Selector for Lunar and Martian Analog Discovery.",
};

export default function Home() {
  return (
    <div className="flex-1 flex flex-col p-6 sm:p-8 max-w-7xl mx-auto w-full">
      {/* Top HUD Breadcrumb & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-space-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent-terrestrial tracking-widest uppercase mb-1">
            <span>SCREEN 01</span>
            <span>//</span>
            <span>GLOBAL MISSION COMMAND</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
            Planetary Analog Intelligence Flight Deck
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-sans">
            Where Earth Meets Other Worlds — Characterize terrestrial analogs across 10 evaluation domains.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-status-success/30 bg-status-success/10 text-status-success font-mono text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
            WAVE 3.1 ACTIVE · TASK 3.1.2 VERIFIED
          </span>
        </div>
      </div>

      {/* Main Command Center Overview Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Screen 1 */}
        <div className="rounded-card border border-accent-terrestrial/40 bg-space-surface/90 p-5 shadow-[0_0_16px_rgba(0,212,170,0.15)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-accent-terrestrial font-semibold">SCREEN 01</span>
              <span className="px-1.5 py-0.5 rounded bg-accent-terrestrial/10 text-accent-terrestrial border border-accent-terrestrial/30 text-[10px]">
                ACTIVE
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-text-primary mb-1">
              Mission Command
            </h3>
            <p className="text-xs text-text-muted font-sans leading-relaxed">
              Target body selection (Moon vs Mars), 9 surface tasks, and global 2D cartographic catalog across 7 flagship analog sites.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-space-border flex items-center justify-between text-[11px] font-mono text-accent-terrestrial">
            <span>Route: /</span>
            <span className="text-text-muted">Wave 3.2 Target</span>
          </div>
        </div>

        {/* Card 2: Screen 2 */}
        <Link
          href="/terrain"
          className="group rounded-card border border-space-border hover:border-accent-lunar/50 bg-space-surface/60 hover:bg-space-surface/90 p-5 transition-all flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-accent-lunar"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-accent-lunar font-semibold">SCREEN 02</span>
              <span className="px-1.5 py-0.5 rounded bg-space-elevated text-text-muted border border-space-border text-[10px]">
                READY
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-text-primary group-hover:text-accent-lunar transition-colors mb-1">
              Terrain Studio
            </h3>
            <p className="text-xs text-text-muted font-sans leading-relaxed">
              Synchronized 3D dual-canvas with orbital camera lock, USGS 3DEP LiDAR (1m), LOLA DEM (5m), and 0°-5° low-angle lighting.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-space-border flex items-center justify-between text-[11px] font-mono text-text-muted group-hover:text-accent-lunar">
            <span>Route: /terrain</span>
            <span>Launch →</span>
          </div>
        </Link>

        {/* Card 3: Screen 3 */}
        <Link
          href="/reality-gap"
          className="group rounded-card border border-space-border hover:border-accent-martian/50 bg-space-surface/60 hover:bg-space-surface/90 p-5 transition-all flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-accent-martian"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-accent-martian font-semibold">SCREEN 03</span>
              <span className="px-1.5 py-0.5 rounded bg-space-elevated text-text-muted border border-space-border text-[10px]">
                READY
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-text-primary group-hover:text-accent-martian transition-colors mb-1">
              Reality Gap
            </h3>
            <p className="text-xs text-text-muted font-sans leading-relaxed">
              Quantified 6-axis Analog Reality Gap (ARG = 0.72) and simulator compensation matrix for gravity, thermal, and vacuum deltas.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-space-border flex items-center justify-between text-[11px] font-mono text-text-muted group-hover:text-accent-martian">
            <span>Route: /reality-gap</span>
            <span>Launch →</span>
          </div>
        </Link>

        {/* Card 4: Screen 4 */}
        <Link
          href="/portfolio"
          className="group rounded-card border border-space-border hover:border-accent-terrestrial/50 bg-space-surface/60 hover:bg-space-surface/90 p-5 transition-all flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-accent-terrestrial"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-accent-terrestrial font-semibold">SCREEN 04</span>
              <span className="px-1.5 py-0.5 rounded bg-space-elevated text-text-muted border border-space-border text-[10px]">
                READY
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-text-primary group-hover:text-accent-terrestrial transition-colors mb-1">
              Portfolio Optimizer
            </h3>
            <p className="text-xs text-text-muted font-sans leading-relaxed">
              Greedy submodular optimization across 30 RVM requirements, achieving 78.3% coverage for k=3 multi-site campaigns.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-space-border flex items-center justify-between text-[11px] font-mono text-text-muted group-hover:text-accent-terrestrial">
            <span>Route: /portfolio</span>
            <span>Launch →</span>
          </div>
        </Link>
      </div>

      {/* Telemetry & Architecture Specifications Ribbon */}
      <div className="mt-6 rounded-card border border-space-border bg-space-surface/40 p-5">
        <div className="text-xs font-mono text-accent-terrestrial uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-terrestrial" />
          <span>Application Shell & Dark Space Navigation Infrastructure</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-text-muted block text-[10px]">NAVIGATION TOPOLOGY</span>
            <span className="text-text-primary font-semibold">4 Synchronized Viewports</span>
          </div>
          <div>
            <span className="text-text-muted block text-[10px]">ACCESSIBILITY STANDARD</span>
            <span className="text-status-success font-semibold">WCAG 2.2 Level AA</span>
          </div>
          <div>
            <span className="text-text-muted block text-[10px]">RESPONSIVE MATRIX</span>
            <span className="text-text-primary font-semibold">sm, md, lg, xl, 2xl</span>
          </div>
          <div>
            <span className="text-text-muted block text-[10px]">UI TOKENS COMPILED</span>
            <span className="text-accent-terrestrial font-semibold">Dark Space Aerospace</span>
          </div>
        </div>
      </div>
    </div>
  );
}
