/**
 * TERRALIGN — Terrain Grid Elevation Matrix API Route
 * GET /api/science/terrain?body=earth&lat=35.3071&lng=-111.5049&gridSize=64&spanMeters=2000
 * POST /api/science/terrain { body, centerLat, centerLng, gridSize, spanMeters }
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateTerrainGrid } from '@/lib/science/providers/terrainGridProvider';
import type { PlanetaryBody, TerrainGridQuery } from '@/types/science';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawBody = searchParams.get('body') || 'earth';
  const rawLat = searchParams.get('lat') || searchParams.get('centerLat');
  const rawLng = searchParams.get('lng') || searchParams.get('lon') || searchParams.get('centerLng');
  const rawGridSize = searchParams.get('gridSize');
  const rawSpan = searchParams.get('spanMeters') || searchParams.get('span');

  if (!rawLat || !rawLng) {
    return NextResponse.json(
      { status: 'error', message: 'Parameters "lat" and "lng" are required.' },
      { status: 400 }
    );
  }

  const lat = parseFloat(rawLat);
  const lng = parseFloat(rawLng);
  const body = rawBody.toLowerCase() as PlanetaryBody;

  if (isNaN(lat) || isNaN(lng) || !['earth', 'moon', 'mars'].includes(body)) {
    return NextResponse.json({ status: 'error', message: 'Invalid coordinates or body parameter.' }, { status: 400 });
  }

  const query: TerrainGridQuery = {
    body,
    centerLat: lat,
    centerLng: lng,
    gridSize: rawGridSize ? parseInt(rawGridSize, 10) : 64,
    spanMeters: rawSpan ? parseFloat(rawSpan) : 2000,
  };

  try {
    const result = await generateTerrainGrid(query);
    return NextResponse.json({
      status: 'success',
      data: result,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { status: 'error', message: (err as Error)?.message || 'Failed to generate terrain grid' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const rawBody = json.body || 'earth';
    const rawLat = json.centerLat ?? json.lat;
    const rawLng = json.centerLng ?? json.lng ?? json.lon;

    if (rawLat === undefined || rawLng === undefined) {
      return NextResponse.json(
        { status: 'error', message: 'Parameters "centerLat" and "centerLng" are required.' },
        { status: 400 }
      );
    }

    const lat = parseFloat(String(rawLat));
    const lng = parseFloat(String(rawLng));
    const body = String(rawBody).toLowerCase() as PlanetaryBody;

    if (isNaN(lat) || isNaN(lng) || !['earth', 'moon', 'mars'].includes(body)) {
      return NextResponse.json({ status: 'error', message: 'Invalid coordinates or body parameter.' }, { status: 400 });
    }

    const query: TerrainGridQuery = {
      body,
      centerLat: lat,
      centerLng: lng,
      gridSize: json.gridSize ? parseInt(String(json.gridSize), 10) : 64,
      spanMeters: json.spanMeters ? parseFloat(String(json.spanMeters)) : 2000,
      datasetId: json.datasetId,
    };

    const result = await generateTerrainGrid(query);
    return NextResponse.json({
      status: 'success',
      data: result,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { status: 'error', message: (err as Error)?.message || 'Failed to generate terrain grid' },
      { status: 400 }
    );
  }
}
