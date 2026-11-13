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
    href: "/",
    icon: ({ className }) => (
      <svg
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
    name: "Portfolio Optimizer",
    href: "/portfolio",
    badge: "k=3",
    icon: ({ className }) => (
      <svg
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
];

export default function TopNavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="w-full bg-space-surface border-b border-space-border px-4 sm:px-6 py-2.5 flex items-center justify-between z-50 shrink-0 sticky top-0 shadow-md">
      {/* --- Left Section: Brand & Telemetry --- */}
      <div className="flex items-center gap-4 lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-accent-terrestrial focus:ring-offset-2 focus:ring-offset-space-surface rounded-sm"
          aria-label="TERRALIGN Home - Global Mission Command"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-terrestrial shadow-[0_0_8px_#00D4AA] animate-pulse" />
            <span className="w-5 h-5 rounded-full border border-accent-terrestrial/30 absolute animate-ping opacity-50" />
          </div>
          <div>
            <span className="font-display font-bold text-lg sm:text-xl tracking-wider text-accent-terrestrial uppercase block leading-none">
              TERRALIGN
            </span>
          </div>
        </Link>

        {/* Tagline Divider */}
        <div className="hidden lg:flex items-center text-[11px] font-sans tracking-wide text-text-muted border-l border-space-border pl-4 py-0.5">
          Where Earth Meets Other Worlds.
        </div>
      </div>

      {/* --- Center Section: Desktop / Tablet Navigation --- */}
      <nav
        className="hidden md:flex items-center gap-5 lg:gap-8 font-sans text-xs uppercase tracking-wider"
        aria-label="Primary Application Navigation"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-1.5 py-1 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent-terrestrial rounded-sm ${
                active
                  ? "text-accent-terrestrial border-b-2 border-accent-terrestrial font-semibold shadow-[0_2px_0_0_#00D4AA]"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <item.icon className={`w-4 h-4 ${active ? "text-accent-terrestrial" : "text-text-muted"}`} />
              <span>{item.name}</span>
              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1 py-0.2 rounded border ${
                    active
                      ? "bg-accent-terrestrial/10 border-accent-terrestrial/40 text-accent-terrestrial"
                      : "bg-space-elevated border-space-border text-text-muted"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* --- Right Section: Quick Status, Actions & Mobile Toggle --- */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dataset Sync Status Pill (Hidden on smaller viewports) */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-space-elevated rounded border border-space-border text-[11px] font-mono text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-terrestrial animate-pulse" />
          <span className="text-text-secondary">USGS-ASTRO:</span>
          <span className="text-accent-terrestrial font-semibold">SYNCED</span>
        </div>

        {/* Quick Utility Icon Cluster */}
        <div className="hidden sm:flex items-center bg-space-elevated/80 rounded border border-space-border p-0.5">
          <button
            type="button"
            className="p-1.5 text-text-muted hover:text-accent-terrestrial hover:bg-space-elevated rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-terrestrial"
            title="Sensor Array Tuning"
            aria-label="Sensor Array Tuning"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 6H16M4 10H16M4 14H16M7 4V8M13 8V12M9 12V16" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            className="p-1.5 text-text-muted hover:text-accent-terrestrial hover:bg-space-elevated rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-terrestrial"
            title="Satellite Uplink Active"
            aria-label="Satellite Uplink Active"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="10" cy="10" r="2" />
              <path d="M4 10A6 6 0 0 1 16 10" strokeLinecap="round" />
              <path d="M2 10A8 8 0 0 1 18 10" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            className="p-1.5 text-text-muted hover:text-accent-terrestrial hover:bg-space-elevated rounded transition-colors relative focus:outline-none focus:ring-1 focus:ring-accent-terrestrial"
            title="Mission Alerts (1 Active)"
            aria-label="Mission Alerts"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 3A5 5 0 0 0 5 8C5 12 3 13 3 14H17C17 13 15 12 15 8A5 5 0 0 0 10 3Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.5 16A1.5 1.5 0 0 0 11.5 16" strokeLinecap="round" />
            </svg>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent-martian rounded-full" />
          </button>
        </div>

        {/* Secondary Export Action */}
        <button
          type="button"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded bg-space-elevated hover:bg-space-elevated/80 border border-space-border text-xs font-sans uppercase tracking-wider text-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-accent-terrestrial"
          title="Export Active Dataset"
        >
          <svg className="w-3.5 h-3.5 text-text-muted" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 3V13M10 13L6 9M10 13L14 9M4 17H16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Export</span>
        </button>

        {/* Primary Launch Action CTA */}
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded bg-accent-terrestrial hover:bg-accent-terrestrial/90 text-space-bg text-xs font-sans font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(0,212,170,0.3)] transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-terrestrial focus:ring-offset-2 focus:ring-offset-space-surface"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
          <span className="hidden sm:inline">Launch Activity</span>
          <span className="sm:hidden">Launch</span>
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded text-text-muted hover:text-text-primary hover:bg-space-elevated transition-colors focus:outline-none focus:ring-2 focus:ring-accent-terrestrial"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 5L15 15M5 15L15 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 6H16M4 10H16M4 14H16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* --- Mobile Slide-Down Navigation Drawer --- */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 w-full bg-space-surface/98 backdrop-blur-xl border-b border-space-border shadow-2xl p-4 flex flex-col gap-2 transition-all duration-200"
          role="dialog"
          aria-label="Mobile Navigation Menu"
        >
          <div className="text-[10px] font-mono text-accent-terrestrial uppercase tracking-widest px-2 py-1 border-b border-space-border/40 mb-1 flex items-center justify-between">
            <span>Mission Control Viewports</span>
            <span className="text-text-muted">v1.0 MVP</span>
          </div>

          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-card text-xs font-sans tracking-wide uppercase transition-colors min-h-[44px] ${
                  active
                    ? "bg-accent-terrestrial/10 text-accent-terrestrial border border-accent-terrestrial/30 font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-space-elevated"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 ${active ? "text-accent-terrestrial" : "text-text-muted"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-space-elevated border border-space-border text-text-muted">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-space-border flex items-center justify-between text-xs font-mono text-text-muted px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-terrestrial" />
              USGS-ASTRO: SYNCED
            </span>
            <span className="text-[10px] text-text-muted">WCAG 2.2 AA</span>
          </div>
        </div>
      )}
    </header>
  );
}

