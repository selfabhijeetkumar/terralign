/**
 * TERRALIGN — Point Elevation API Route
 * GET /api/science/elevation?lat=35.3071&lng=-111.5049&body=earth
 * POST /api/science/elevation { lat, lng, body, datasetId }
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryEarthElevation } from '@/lib/science/providers/earthProvider';
import { queryMoonElevation } from '@/lib/science/providers/moonProvider';
import { queryMarsElevation } from '@/lib/science/providers/marsProvider';
import type { PlanetaryBody } from '@/types/science';

export const dynamic = 'force-dynamic';

function validateParams(rawLat: string | null, rawLng: string | null, rawBody: string | null) {
  if (rawLat === null || rawLng === null) {
    return { error: 'Missing required query parameters: "lat" and "lng" are required.' };
  }

  const lat = parseFloat(rawLat);
  const lng = parseFloat(rawLng);

  if (isNaN(lat) || isNaN(lng)) {
    return { error: 'Parameters "lat" and "lng" must be valid numeric values.' };
  }

  if (lat < -90 || lat > 90) {
    return { error: 'Parameter "lat" must be between -90 and +90 degrees.' };
  }

  if (lng < -180 || lng > 360) {
    return { error: 'Parameter "lng" must be between -180 and +360 degrees.' };
  }

  const body: PlanetaryBody = (rawBody?.toLowerCase() as PlanetaryBody) || 'earth';
  if (!['earth', 'moon', 'mars'].includes(body)) {
    return { error: 'Parameter "body" must be one of: "earth", "moon", "mars".' };
  }

  return { lat, lng, body };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawLat = searchParams.get('lat');
  const rawLng = searchParams.get('lng') || searchParams.get('lon');
  const rawBody = searchParams.get('body');
  const datasetId = searchParams.get('datasetId') || undefined;

  const validated = validateParams(rawLat, rawLng, rawBody);
  if ('error' in validated) {
    return NextResponse.json({ status: 'error', message: validated.error }, { status: 400 });
  }

  const { lat, lng, body } = validated;

  try {
    let result;
    if (body === 'earth') {
      result = await queryEarthElevation(lat, lng, datasetId);
    } else if (body === 'moon') {
      result = await queryMoonElevation(lat, lng);
    } else {
      result = await queryMarsElevation(lat, lng);
    }

    return NextResponse.json({
      status: 'success',
      data: result,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        status: 'error',
        message: (err as Error)?.message || 'Failed to query elevation',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const bodyJson = await req.json();
    const rawLat = String(bodyJson.lat ?? '');
    const rawLng = String(bodyJson.lng ?? bodyJson.lon ?? '');
    const rawBody = bodyJson.body ? String(bodyJson.body) : 'earth';
    const datasetId = bodyJson.datasetId ? String(bodyJson.datasetId) : undefined;

    const validated = validateParams(rawLat, rawLng, rawBody);
    if ('error' in validated) {
      return NextResponse.json({ status: 'error', message: validated.error }, { status: 400 });
    }

    const { lat, lng, body } = validated;

    let result;
    if (body === 'earth') {
      result = await queryEarthElevation(lat, lng, datasetId);
    } else if (body === 'moon') {
      result = await queryMoonElevation(lat, lng);
    } else {
      result = await queryMarsElevation(lat, lng);
    }

    return NextResponse.json({
      status: 'success',
      data: result,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        status: 'error',
        message: (err as Error)?.message || 'Failed to parse JSON body or query elevation',
      },
      { status: 400 }
    );
  }
}
