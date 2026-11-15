/**
 * TERRALIGN — Scientific Datasets Catalog API Route
 * GET /api/science/datasets?body=earth|moon|mars
 */

import { NextRequest, NextResponse } from 'next/server';
import { SCIENTIFIC_DATASETS } from '@/lib/science/datasets';
import type { PlanetaryBody } from '@/types/science';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const body = searchParams.get('body') as PlanetaryBody | null;

  let datasets = SCIENTIFIC_DATASETS;
  if (body && ['earth', 'moon', 'mars'].includes(body)) {
    datasets = datasets.filter((d) => d.body === body);
  }

  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    filterBody: body || 'all',
    count: datasets.length,
    datasets,
  });
}
