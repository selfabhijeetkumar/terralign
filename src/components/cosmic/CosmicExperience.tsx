/**
 * TERRALIGN 2.0 — COSMIC ASCENSION
 * Root Visual Integration Boundary
 *
 * Mounts once at the root layout/shell level.
 * - Persistent 3D cosmic background
 * - Celestial dragon cursor (fine-pointer devices)
 * - Dynamic route profile selection via usePathname()
 * - Updates data-feature attribute on documentElement for universal CSS tokens
 */

'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CosmicCanvas from './CosmicCanvas';
import CelestialDragonCursor from './CelestialDragonCursor';
import { getProfileForPathname } from '@/lib/cosmic/cosmicConfig';

export default function CosmicExperience() {
  const pathname = usePathname();

  useEffect(() => {
    const profileId = getProfileForPathname(pathname);
    document.documentElement.setAttribute('data-feature', profileId);
  }, [pathname]);

  return (
    <>
      <CosmicCanvas />
      <CelestialDragonCursor />
    </>
  );
}
