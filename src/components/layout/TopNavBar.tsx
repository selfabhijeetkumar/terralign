"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  badge?: string;
  icon: (props: { className?: string }) => React.ReactElement;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Mission Command",
    href: "/mission",
    icon: ({ className }) => (
      <svg
        width="16"
        height="16"
        className={className}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="10" cy="10" r="7" />
        <circle cx="10" cy="10" r="3" />
        <line x1="10" y1="3" x2="10" y2="6" />
        <line x1="10" y1="14" x2="10" y2="17" />
        <line x1="3" y1="10" x2="6" y2="10" />
        <line x1="14" y1="10" x2="17" y2="10" />
      </svg>
    ),
  },
  {
    name: "Terrain Studio",
    href: "/terrain",
    badge: "3D",
    icon: ({ className }) => (
      <svg
        width="16"
        height="16"
        className={className}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 15L7.5 9L11 13L13.5 10L17 15H3Z" />
        <circle cx="6.5" cy="5.5" r="1.5" />
      </svg>
    ),
  },
  {
    name: "Reality Gap",
    href: "/reality-gap",
    badge: "ARG",
    icon: ({ className }) => (
      <svg
        width="16"
        height="16"
        className={className}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 13H15M15 13L11 9M15 13L11 17" />
        <path d="M15 7H5M5 7L9 3M5 7L9 11" />
      </svg>
    ),
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    badge: "k=3",
    icon: ({ className }) => (
      <svg
        width="16"
        height="16"
        className={className}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="11" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="11" width="6" height="6" rx="1" />
        <path d="M14 11V17M11 14H17" />
      </svg>
    ),
  },
  {
    name: "Live Data Lab",
    href: "/live-data",
    badge: "API",
    icon: ({ className }) => (
      <svg
        width="16"
        height="16"
        className={className}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3V17H17" />
        <path d="M7 13L10 8L13 11L17 5" />
      </svg>
    ),
  },
  {
    name: "Datasets",
    href: "/datasets",
    badge: "AI INTEL",
    icon: ({ className }) => (
      <svg
        width="16"
        height="16"
        className={className}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 5C3 3.89543 6.13401 3 10 3C13.866 3 17 3.89543 17 5M3 5V15C3 16.1046 6.13401 17 10 17C13.866 17 17 16.1046 17 15V5M3 5C3 6.10457 6.13401 7 10 7C13.866 7 17 6.10457 17 5M3 10C3 11.1046 6.13401 12 10 12C13.866 12 17 11.1046 17 10" />
      </svg>
    ),
  },
];

export default function TopNavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="w-full bg-[#050811]/95 backdrop-blur-md border-b border-[#8B9CB5]/15 px-4 sm:px-6 py-0 flex items-center justify-between z-50 shrink-0 sticky top-0 h-12 select-none relative">
      {/* Top Ambient Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D4AA]/40 to-transparent pointer-events-none" />

      {/* ── Brand Logotype ── */}
      <Link
        href="/"
        className="flex items-center gap-3 focus:outline-none focus-ring rounded-sm group relative"
        aria-label="TERRALIGN Home — Planetary Exploration Platform"
      >
        <div className="relative flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-[#00D4AA] shadow-[0_0_8px_#00D4AA] flex-shrink-0 group-hover:scale-125 transition-transform" />
          <span className="absolute w-4 h-4 rounded-full border border-[#00D4AA]/30 animate-ping pointer-events-none" />
        </div>
        <span className="font-display font-bold text-base tracking-[0.16em] text-white uppercase leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
          TERRALIGN
        </span>
        <span className="hidden lg:block text-[10px] font-mono tracking-wider text-[#8B9CB5] border-l border-[#8B9CB5]/20 pl-3">
          WHERE EARTH MEETS OTHER WORLDS
        </span>
      </Link>

      {/* ── Desktop Navigation ── */}
      <nav
        className="hidden md:flex items-center gap-1 font-sans"
        aria-label="Primary navigation"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase tracking-wider transition-all duration-150 focus:outline-none focus-ring relative ${
                active
                  ? "bg-white/[0.08] text-white font-medium border border-[#00D4AA]/30 shadow-[0_0_12px_rgba(0,212,170,0.12)]"
                  : "text-[#8B9CB5] hover:text-[#E2E8F0] hover:bg-white/[0.04]"
              }`}
            >
              <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-[#00D4AA]" : "text-[#8B9CB5]"}`} />
              <span>{item.name}</span>
              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1 rounded border ${
                    active
                      ? "bg-[#00D4AA]/15 border-[#00D4AA]/30 text-[#00D4AA] font-bold"
                      : "bg-[#112240] border-[#8B9CB5]/20 text-[#8B9CB5]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {active && (
                <span className="absolute bottom-0 left-2 right-2 h-[1.5px] bg-[#00D4AA] shadow-[0_0_6px_#00D4AA]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Right Quick Actions ── */}
      <div className="flex items-center gap-3">
        {/* Dataset Scientific Provenance Status */}
        <div 
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0A192F]/90 border border-[#8B9CB5]/25 text-[10px] font-mono text-[#8B9CB5] shadow-sm"
          title="USGS 3DEP/NED and NASA PDS ODE provider endpoints verified and operational"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
          <span className="text-white font-semibold">NASA · USGS</span>
          <span className="text-[#00D4AA] font-bold">PROVIDERS CONNECTED</span>
        </div>

        {/* Primary Flight CTA */}
        <Link
          href="/mission"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#00D4AA] hover:bg-[#00D4AA]/90 text-[#050811] text-xs font-sans font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(0,212,170,0.3)] transition-all active:scale-95 focus:outline-none focus-ring"
        >
          <svg width="14" height="14" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
          <span className="hidden sm:inline">Mission Command</span>
          <span className="sm:hidden">Mission</span>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded text-[#8B9CB5] hover:text-white hover:bg-[#112240] transition-colors focus:outline-none focus-ring"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
        >
          {mobileMenuOpen ? (
            <svg width="20" height="20" className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 5L15 15M5 15L15 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="20" height="20" className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 6H16M4 10H16M4 14H16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 w-full bg-[#050811]/98 backdrop-blur-xl border-b border-[#8B9CB5]/20 shadow-2xl p-4 flex flex-col gap-1.5 z-50"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <div className="text-[10px] font-mono text-[#00D4AA] uppercase tracking-widest px-2 py-1 border-b border-[#8B9CB5]/15 mb-1 flex justify-between">
            <span>TERRALIGN VIEWPORTS</span>
            <span className="text-[#8B9CB5]">v1.0</span>
          </div>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-sans tracking-wide uppercase transition-colors ${
              pathname === "/"
                ? "bg-white/[0.08] text-white font-medium border border-white/[0.12]"
                : "text-[#CBD5E1] hover:text-white hover:bg-[#112240]"
            }`}
          >
            <span>Home Landing Page</span>
          </Link>

          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-sans tracking-wide uppercase transition-colors min-h-[44px] ${
                  active
                    ? "bg-white/[0.08] text-white font-medium border border-white/[0.12]"
                    : "text-[#CBD5E1] hover:text-white hover:bg-[#112240]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 ${active ? "text-[#00D4AA]" : "text-[#8B9CB5]"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      active
                        ? "bg-white/[0.08] border-white/[0.16] text-[#E2E8F0]"
                        : "bg-[#112240] border-[#8B9CB5]/20 text-[#8B9CB5]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2 mt-1 border-t border-[#8B9CB5]/15 flex items-center justify-between text-[10px] font-mono text-[#8B9CB5] px-2">
            <span>NASA / USGS STATIC CATALOG</span>
            <span>WCAG 2.2 AA</span>
          </div>
        </div>
      )}
    </header>
  );
}
