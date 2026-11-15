import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact & Collaboration — TERRALIGN',
  description:
    'Institutional contact and academic research inquiries for the TERRALIGN planetary intelligence platform.',
};

export default function ContactPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-12 space-y-12 text-[#F8FAFC]">
      <div className="space-y-3 border-b border-[#8B9CB5]/20 pb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D4AA] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
          <span>Inquiries</span>
          <span className="text-[#8B9CB5]">// Research Communications</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
          Contact &amp; Collaboration
        </h1>
        <p className="text-base sm:text-lg text-[#CBD5E1] font-light leading-relaxed">
          For scientific inquiries, analog field dataset submissions, and mission planning integration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#CBD5E1]">
        <div className="p-8 rounded-xl bg-[#0A192F]/60 border border-[#8B9CB5]/15 space-y-4">
          <h2 className="text-lg font-display font-bold text-white uppercase tracking-wider">
            NASA Space Apps Hackathon
          </h2>
          <p className="font-light leading-relaxed text-xs">
            TERRALIGN was engineered as an open-science platform for the NASA International Space Apps Challenge.
          </p>
          <div className="space-y-2 pt-2 text-xs font-mono text-[#8B9CB5]">
            <div>
              <span className="text-white block font-semibold">Repository Workspace:</span>
              <span>C:\NASA SPACE HACKATHON</span>
            </div>
            <div>
              <span className="text-white block font-semibold">Methodology:</span>
              <span className="text-[#00D4AA]">GSD v1.6.0 · Ponytail FULL Mode</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-xl bg-[#0A192F]/60 border border-[#8B9CB5]/15 space-y-4">
          <h2 className="text-lg font-display font-bold text-white uppercase tracking-wider">
            Data Provenance Contacts
          </h2>
          <p className="font-light leading-relaxed text-xs">
            For source LiDAR and digital elevation inquiries:
          </p>
          <div className="space-y-2 pt-2 text-xs font-mono text-[#8B9CB5]">
            <div>
              <span className="text-white block font-semibold">USGS Astrogeology Science Center:</span>
              <span>Flagstaff, Arizona 86001</span>
            </div>
            <div>
              <span className="text-white block font-semibold">NASA LRO LOLA Science Team:</span>
              <span>Goddard Space Flight Center, Greenbelt, MD</span>
            </div>
          </div>
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
          EXPLORE MISSION COMMAND →
        </Link>
      </div>
    </div>
  );
}

