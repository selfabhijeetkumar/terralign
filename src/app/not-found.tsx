import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 min-h-[calc(100vh-6rem)]">
      <div className="flex items-center gap-2 text-xs font-mono text-[#FF4757] uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-[#FF4757] animate-pulse" />
        <span>NAVIGATION ERROR // COORDINATES UNRESOLVED</span>
      </div>

      <h1 className="text-6xl sm:text-8xl font-display font-bold text-white tracking-tight">
        404
      </h1>

      <div className="max-w-md space-y-2 text-[#CBD5E1] text-sm font-light">
        <p>The requested trajectory does not correspond to an active planetary viewport or telemetry channel.</p>
        <p className="text-xs font-mono text-[#8B9CB5]">ORBITAL STATUS: LOST IN DEEP SPACE</p>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/"
          className="px-5 py-2.5 rounded bg-[#112240] hover:bg-[#112240]/80 border border-[#8B9CB5]/30 text-white font-mono text-xs uppercase tracking-wider transition-colors"
        >
          RETURN TO HOME
        </Link>
        <Link
          href="/mission"
          className="px-5 py-2.5 rounded bg-[#00D4AA] hover:bg-[#00D4AA]/90 text-[#050811] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,212,170,0.3)]"
        >
          ENTER MISSION COMMAND →
        </Link>
      </div>
    </div>
  );
}

