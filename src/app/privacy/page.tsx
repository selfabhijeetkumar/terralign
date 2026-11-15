import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — TERRALIGN',
  description: 'Data governance and privacy standards for the TERRALIGN platform.',
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-12 space-y-12 text-[#F8FAFC]">
      <div className="space-y-3 border-b border-[#8B9CB5]/20 pb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D4AA] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
          <span>Governance</span>
          <span className="text-[#8B9CB5]">// Data Standards</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-base sm:text-lg text-[#CBD5E1] font-light leading-relaxed">
          TERRALIGN operates as an offline-first, client-rendered mission intelligence platform.
        </p>
      </div>

      <div className="space-y-6 text-sm text-[#CBD5E1] leading-relaxed font-light">
        <div className="space-y-3">
          <h2 className="text-lg font-display font-bold text-white uppercase">
            1. Zero Personal Data Collection
          </h2>
          <p>
            TERRALIGN does not collect, transmit, store, or sell personal information, user tracking data, advertising identifiers, or analytics telemetry. All mission planning parameters, candidate selections, and portfolio configurations execute entirely client-side in your browser via local Zustand state.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-display font-bold text-white uppercase">
            2. Local Dossier Generation
          </h2>
          <p>
            When you export a mission dossier or reality gap report, the JSON file is assembled locally in browser memory and delivered directly via a browser Blob URL. No server receives or logs your exported dossiers.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-display font-bold text-white uppercase">
            3. Open Scientific Provenance
          </h2>
          <p>
            All digital elevation models, planetary coordinates, and literature citations provided through the platform originate from public domain U.S. Geological Survey (USGS) and NASA open-science archives.
          </p>
        </div>
      </div>

      <div className="pt-8 border-t border-[#8B9CB5]/20 flex items-center justify-between text-xs font-mono">
        <Link href="/" className="text-[#8B9CB5] hover:text-white transition-colors">
          ← BACK TO HOME
        </Link>
        <Link href="/terms" className="text-[#00D4AA] hover:underline">
          TERMS OF USE →
        </Link>
      </div>
    </div>
  );
}

