import React from "react";
import TopNavBar from "./TopNavBar";

export interface ShellProps {
  children: React.ReactNode;
}

export default function ApplicationShell({ children }: ShellProps) {
  return (
    <div className="min-h-screen h-screen flex flex-col bg-space-bg text-text-primary antialiased selection:bg-accent-terrestrial selection:text-space-bg overflow-hidden">
      {/* WCAG 2.2 AA Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-terrestrial focus:text-space-bg focus:font-sans focus:font-bold focus:rounded-card focus:shadow-glow focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Global Top App Bar */}
      <TopNavBar />

      {/* Active Viewport Canvas */}
      <main
        id="main-content"
        className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative"
      >
        {children}
      </main>
    </div>
  );
}

