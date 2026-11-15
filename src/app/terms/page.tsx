import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use — TERRALIGN',
  description: 'Scientific disclaimers, epistemic boundaries, and terms of use for TERRALIGN.',
};

export default function TermsPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-12 space-y-12 text-[#F8FAFC]">
      <div className="space-y-3 border-b border-[#8B9CB5]/20 pb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D4AA] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
          <span>Legal &amp; Epistemic</span>
          <span className="text-[#8B9CB5]">// Platform Terms</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
          Terms of Use
        </h1>
        <p className="text-base sm:text-lg text-[#CBD5E1] font-light leading-relaxed">
          Open-source scientific exploration prototype under GSD v1.6.0 governance.
        </p>
      </div>

      <div className="space-y-6 text-sm text-[#CBD5E1] leading-relaxed font-light">
        <div className="space-y-3">
          <h2 className="text-lg font-display font-bold text-white uppercase">
            1. Epistemic Classification and Disclaimers
          </h2>
          <p>
            TERRALIGN is an engineering prototype and decision-support framework built for educational and mission planning research. Suitability scores, confidence metrics, and composite Analog Reality Gap (ARG) indices represent mathematical models derived from public research; they do not constitute official flight certification by NASA, ESA, or any space agency.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-display font-bold text-white uppercase">
            2. Intellectual Property and Open Access
          </h2>
          <p>
            Topographic datasets (USGS 3DEP, NASA LOLA) remain in the public domain. Code components are licensed for open-source exploration research under hackathon guidelines. Reference designs inspired by locomotive.ca, obsidianassembly.com, and museum.unesco.org are adapted under original design synthesis without copying proprietary source code or branding.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-display font-bold text-white uppercase">
            3. Limitation of Liability
          </h2>
          <p>
            Field researchers and engineers must independently verify localized physical, weather, and safety conditions before conducting outdoor field expedition campaigns.
          </p>
        </div>
      </div>

      <div className="pt-8 border-t border-[#8B9CB5]/20 flex items-center justify-between text-xs font-mono">
        <Link href="/" className="text-[#8B9CB5] hover:text-white transition-colors">
          ← BACK TO HOME
        </Link>
        <Link href="/privacy" className="text-[#00D4AA] hover:underline">
          PRIVACY POLICY →
        </Link>
      </div>
    </div>
  );
}

