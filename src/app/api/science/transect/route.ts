/**
 * TERRALIGN — Elevation Transect API Route
 * GET /api/science/transect?body=earth&startLat=...&startLng=...&endLat=...&endLng=...&samples=20
 * POST /api/science/transect { body, startLat, startLng, endLat, endLng, samples }
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryEarthTransect } from '@/lib/science/providers/earthProvider';
import { queryMoonTransect } from '@/lib/science/providers/moonProvider';
import { queryMarsTransect } from '@/lib/science/providers/marsProvider';
import type { PlanetaryBody } from '@/types/science';

export const dynamic = 'force-dynamic';

function validateTransectParams(
  bodyRaw: string | null,
  sLatRaw: string | null,
  sLngRaw: string | null,
  eLatRaw: string | null,
  eLngRaw: string | null,
  samplesRaw: string | null
) {
  if (!sLatRaw || !sLngRaw || !eLatRaw || !eLngRaw) {
    return { error: 'Missing required parameters: startLat, startLng, endLat, endLng are required.' };
  }

  const startLat = parseFloat(sLatRaw);
  const startLng = parseFloat(sLngRaw);
  const endLat = parseFloat(eLatRaw);
  const endLng = parseFloat(eLngRaw);
  const samples = samplesRaw ? parseInt(samplesRaw, 10) : 20;

  if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) {
    return { error: 'Coordinates must be valid floating-point numbers.' };
  }

  const body: PlanetaryBody = (bodyRaw?.toLowerCase() as PlanetaryBody) || 'earth';
  if (!['earth', 'moon', 'mars'].includes(body)) {
    return { error: 'Parameter "body" must be one of: "earth", "moon", "mars".' };
  }

  return { body, startLat, startLng, endLat, endLng, samples };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const validated = validateTransectParams(
    searchParams.get('body'),
    searchParams.get('startLat'),
    searchParams.get('startLng'),
    searchParams.get('endLat'),
    searchParams.get('endLng'),
    searchParams.get('samples')
  );

  if ('error' in validated) {
    return NextResponse.json({ status: 'error', message: validated.error }, { status: 400 });
  }

  const { body, startLat, startLng, endLat, endLng, samples } = validated;

  try {
    let result;
    if (body === 'earth') {
      result = await queryEarthTransect(startLat, startLng, endLat, endLng, samples);
    } else if (body === 'moon') {
      result = await queryMoonTransect(startLat, startLng, endLat, endLng, samples);
    } else {
      result = await queryMarsTransect(startLat, startLng, endLat, endLng, samples);
    }

    return NextResponse.json({
      status: 'success',
      data: result,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { status: 'error', message: (err as Error)?.message || 'Failed to compute transect' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = validateTransectParams(
      json.body ? String(json.body) : 'earth',
      String(json.startLat ?? ''),
      String(json.startLng ?? ''),
      String(json.endLat ?? ''),
      String(json.endLng ?? ''),
      json.samples ? String(json.samples) : '20'
    );

    if ('error' in validated) {
      return NextResponse.json({ status: 'error', message: validated.error }, { status: 400 });
    }

    const { body, startLat, startLng, endLat, endLng, samples } = validated;

    let result;
    if (body === 'earth') {
      result = await queryEarthTransect(startLat, startLng, endLat, endLng, samples);
    } else if (body === 'moon') {
      result = await queryMoonTransect(startLat, startLng, endLat, endLng, samples);
    } else {
      result = await queryMarsTransect(startLat, startLng, endLat, endLng, samples);
    }

    return NextResponse.json({
      status: 'success',
      data: result,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { status: 'error', message: (err as Error)?.message || 'Failed to compute transect' },
      { status: 400 }
    );
  }
}
