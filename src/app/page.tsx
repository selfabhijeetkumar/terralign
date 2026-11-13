export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-space-bg text-center">
      <div className="max-w-2xl border border-space-border bg-space-surface rounded-card p-8 shadow-glow">
        <div className="text-xs font-mono tracking-widest text-accent-terrestrial mb-2">
          TERRALIGN // MISSION CONTROL
        </div>
        <h1 className="text-3xl font-display font-bold text-text-primary mb-3">
          Where Earth Meets Other Worlds
        </h1>
        <p className="text-sm font-sans text-text-secondary mb-6">
          Discovery and Characterization of Terrestrial Analogs for Lunar and
          Martian Exploration.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-card border border-status-success/30 bg-status-success/10 text-status-success font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
          WAVE 3.1 FOUNDATION INITIALIZED · TASK 3.1.1 VERIFIED
        </div>
      </div>
    </main>
  );
}

