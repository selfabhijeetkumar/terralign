/**
 * TERRALIGN — Scientific Intelligence Interpretation API Route
 * GET /api/science/interpret?body=moon&lat=-89.9&lng=0.0&elevation=1240&location=Shackleton+Rim
 * POST /api/science/interpret { body, locationName, lat, lng, elevationMeters, datasetName, nominalResolutionMeters }
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateScientificInterpretation } from '@/lib/science/aiInterpreter';
import type { PlanetaryBody } from '@/types/science';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawBody = searchParams.get('body') || 'earth';
  const locationName = searchParams.get('location') || searchParams.get('name') || 'Planetary Surface Target';
  const rawLat = searchParams.get('lat') || '0';
  const rawLng = searchParams.get('lng') || searchParams.get('lon') || '0';
  const rawElev = searchParams.get('elevation') || '0';
  const datasetName = searchParams.get('dataset') || 'Planetary Scientific Topography';
  const rawRes = searchParams.get('resolution') || '10.0';

  const body = rawBody.toLowerCase() as PlanetaryBody;
  const latitude = parseFloat(rawLat);
  const longitude = parseFloat(rawLng);
  const elevationMeters = parseFloat(rawElev);
  const nominalResolutionMeters = parseFloat(rawRes);

  const interpretation = generateScientificInterpretation({
    body,
    locationName,
    latitude,
    longitude,
    elevationMeters,
    datasetName,
    nominalResolutionMeters,
  });

  return NextResponse.json({
    status: 'success',
    data: interpretation,
  });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const interpretation = generateScientificInterpretation({
      body: (json.body || 'earth') as PlanetaryBody,
      locationName: json.locationName || 'Planetary Surface Target',
      latitude: Number(json.latitude ?? json.lat ?? 0),
      longitude: Number(json.longitude ?? json.lng ?? json.lon ?? 0),
      elevationMeters: Number(json.elevationMeters ?? json.elevation ?? 0),
      datasetName: json.datasetName || 'Planetary Topographic Reference',
      nominalResolutionMeters: Number(json.nominalResolutionMeters ?? json.resolution ?? 10),
    });

    return NextResponse.json({
      status: 'success',
      data: interpretation,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { status: 'error', message: (err as Error)?.message || 'Failed to generate scientific interpretation' },
      { status: 400 }
    );
  }
}
