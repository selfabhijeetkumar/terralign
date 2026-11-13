/**
 * TERRALIGN — Mission Command View (Screen 01 Main Composite)
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/design/screen-01-mission-command.md & stitch prototype
 */

'use client';

import React from 'react';
import { ActivitySelector } from './ActivitySelector';
import { DiscoveryMap } from './DiscoveryMap';
import { CandidateSummaryDrawer } from './CandidateSummaryDrawer';

export function MissionCommandView() {
  return (
    <div className="flex-1 flex flex-col w-full h-[calc(100vh-4rem)] overflow-hidden select-none">
      {/* Top Main Workspace: Sidebar (Left) + Cartographic Discovery Map (Right) */}
      <div className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden relative">
        <ActivitySelector />
        <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
          <DiscoveryMap />
        </div>
      </div>

      {/* Bottom Dock: Candidate Summary Drawer */}
      <CandidateSummaryDrawer />
    </div>
  );
}
