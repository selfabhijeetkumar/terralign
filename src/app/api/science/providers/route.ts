/**
 * TERRALIGN — Scientific Providers API Route
 * GET /api/science/providers
 */

import { NextResponse } from 'next/server';
import { SCIENTIFIC_PROVIDERS } from '@/lib/science/datasets';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    count: SCIENTIFIC_PROVIDERS.length,
    providers: SCIENTIFIC_PROVIDERS,
  });
}
