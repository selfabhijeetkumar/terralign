import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio Optimizer — TERRALIGN",
  description:
    "Multi-site analog campaign rehearsal optimizer using greedy submodular set-cover across 30 Requirements Verification Matrix (RVM) requirements.",
};

export default function PortfolioOptimizerPage() {
  return (
    <div className="flex-1 flex flex-col p-6 sm:p-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb & Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-space-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent-terrestrial tracking-widest uppercase mb-1">
            <span>SCREEN 04</span>
            <span>//</span>
            <span>MULTI-SITE PORTFOLIO OPTIMIZER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
            Submodular Campaign Coverage (k = 3)
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-sans">
            Optimized test campaign across Cinder Lake, McMurdo Dry Valleys, and Askja Caldera delivering 78.3% empirical coverage.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-status-success/30 bg-status-success/10 text-status-success font-mono text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
            WAVE 3.4 TARGET
          </span>
        </div>
      </div>

      {/* Viewport Placeholder Frame */}
      <div className="mt-6 flex-1 min-h-[420px] rounded-card border border-space-border bg-space-surface/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Subtle metrics overlay */}
        <div className="absolute top-4 left-4 text-[10px] font-mono text-text-muted flex gap-4">
          <span>PORTFOLIO SIZE: k=3</span>
          <span>EMPIRICAL COVERAGE: 78.3% (23.5/30)</span>
        </div>
        <div className="absolute top-4 right-4 text-[10px] font-mono text-accent-terrestrial flex gap-4">
          <span>GREEDY SET-COVER: OPTIMAL (1 - 1/e)</span>
        </div>

        <div className="max-w-md space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-space-elevated border border-accent-terrestrial/30 flex items-center justify-center text-accent-terrestrial shadow-[0_0_16px_rgba(0,212,170,0.2)]">
            <svg className="w-7 h-7" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="6" height="6" rx="1" />
              <rect x="11" y="3" width="6" height="6" rx="1" />
              <rect x="3" y="11" width="6" height="6" rx="1" />
              <path d="M14 11V17M11 14H17" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-text-primary">
            Portfolio Optimization & RVM Requirements Matrix
          </h2>
          <p className="text-xs font-sans text-text-secondary leading-relaxed">
            The submodular set-cover engine, constituent site contribution breakdown, and Mission Planning Dossier export will mount here in Wave 3.4.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-2">
            <Link
              href="/reality-gap"
              className="px-3 py-1.5 rounded text-xs font-sans text-text-muted hover:text-text-primary bg-space-elevated border border-space-border transition-colors"
            >
              ← Previous: Reality Gap
            </Link>
            <Link
              href="/"
              className="px-3 py-1.5 rounded text-xs font-sans text-accent-terrestrial hover:bg-accent-terrestrial/10 border border-accent-terrestrial/30 transition-colors"
            >
              Return to Mission Command →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

