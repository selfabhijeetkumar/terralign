/**
 * TERRALIGN — Scientific Providers Health API Route
 * GET /api/science/health
 */

import { NextResponse } from 'next/server';
import { checkAllProvidersHealth } from '@/lib/science/providers/healthProvider';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reports = await checkAllProvidersHealth();
    const allHealthy = reports.every((r) => r.status === 'HEALTHY');
    const anyDegraded = reports.some((r) => r.status === 'DEGRADED');

    return NextResponse.json({
      status: allHealthy ? 'HEALTHY' : anyDegraded ? 'DEGRADED' : 'OFFLINE',
      timestamp: new Date().toISOString(),
      providers: reports,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        status: 'ERROR',
        error: (err as Error)?.message || 'Health check failure',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
