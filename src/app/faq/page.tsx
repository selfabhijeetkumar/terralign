import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — TERRALIGN',
  description:
    'Common questions regarding planetary analog fidelity, terrain comparison math, and reality gap diagnostic metrics.',
};

const FAQS = [
  {
    q: 'What is a planetary analog site?',
    a: 'A planetary analog is a terrestrial geological, atmospheric, or operational environment that exhibits physical, geochemical, or morphological similarities to lunar, Martian, or extreme extraterrestrial planetary bodies.',
  },
  {
    q: 'How are the 7 flagship sites selected?',
    a: 'The 7 flagship sites (Cinder Lake Crater Field 1, Askja Caldera, Atacama Desert, McMurdo Dry Valleys, Mauna Kea, San Rafael Swell, Haughton Impact Crater) are selected based on extensive NASA Apollo and Artemis training heritage, published USGS literature, and the availability of 1.0m or higher resolution digital elevation models.',
  },
  {
    q: 'What is the Analog Reality Gap (ARG)?',
    a: 'The ARG is an illustrative composite diagnostic that quantifies the inescapable physical divergence between Earth surface testing and deep space conditions across six physical dimensions: Gravity (Δg = 8.19 m/s²), Pressure (Δp = 100 kPa), Thermal range, Solar Irradiance, Surface Radiation, and Regolith Tribology.',
  },
  {
    q: 'Why can terrestrial portfolios not achieve 100% mission coverage?',
    a: 'Four physical conditions cannot be simulated in outdoor terrestrial field tests: hard vacuum (<10⁻¹⁰ Pa), lunar surface gravity (1/6g), galactic cosmic radiation flux (>300 mSv/yr), and permanently shadowed cryogenic temperatures (40K). This creates an inescapable mathematical ceiling of 86.7% (26/30 criteria). A k=3 optimal portfolio achieves 81.7% partial-weighted empirical coverage (76.7% binary coverage).',
  },
  {
    q: 'Can I export data for mission planning?',
    a: 'Yes. Full mission dossiers, reality gap diagnostics, and optimized portfolio allocations can be exported as structured JSON datasets from Mission Command, Reality Gap, and Portfolio Optimizer.',
  },
];

export default function FAQPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-12 space-y-12 text-[#F8FAFC]">
      <div className="space-y-3 border-b border-[#8B9CB5]/20 pb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D4AA] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
          <span>Knowledge Base</span>
          <span className="text-[#8B9CB5]">// Questions & Answers</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-base sm:text-lg text-[#CBD5E1] font-light leading-relaxed">
          Technical, scientific, and mathematical clarifications for TERRALIGN mission intelligence.
        </p>
      </div>

      <div className="space-y-6">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className="p-6 rounded-xl bg-[#0A192F]/60 border border-[#8B9CB5]/15 space-y-3"
          >
            <h2 className="text-base sm:text-lg font-display font-semibold text-white">
              {faq.q}
            </h2>
            <p className="text-xs sm:text-sm text-[#CBD5E1] font-light leading-relaxed font-sans">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-[#8B9CB5]/20 flex items-center justify-between text-xs font-mono">
        <Link href="/" className="text-[#8B9CB5] hover:text-white transition-colors">
          ← BACK TO HOME
        </Link>
        <Link
          href="/mission"
          className="px-4 py-2 rounded bg-[#00D4AA] text-[#050811] font-bold hover:bg-[#00D4AA]/90 transition-all shadow-[0_0_12px_rgba(0,212,170,0.3)]"
        >
          OPEN MISSION COMMAND →
        </Link>
      </div>
    </div>
  );
}

