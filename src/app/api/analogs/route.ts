/**
 * TERRALIGN — Flagship Analog Landscapes API Route
 * Endpoint: /api/analogs
 */

import { NextResponse } from 'next/server';
import { getAllAnalogs, getAnalogById, getAllActivities, filterAndRankAnalogs } from '@/lib/analogs';
import { getAllRequirements, optimizePortfolio } from '@/lib/rvm';
import type { TargetBody } from '@/types/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const siteId = searchParams.get('id');
  if (siteId) {
    const site = getAnalogById(siteId);
    if (!site) {
      return NextResponse.json({ error: `Site '${siteId}' not found` }, { status: 404 });
    }
    return NextResponse.json({ site });
  }

  const targetBody = (searchParams.get('body') as TargetBody) || 'moon';
  const activityId = searchParams.get('activity') || 'rover_terramechanics';
  const include = searchParams.get('include')?.split(',') || [];

  const rankedSites = filterAndRankAnalogs(targetBody, activityId);

  const response: Record<string, unknown> = {
    targetBody,
    activityId,
    totalSites: rankedSites.length,
    sites: rankedSites,
  };

  if (include.includes('activities')) {
    response.activities = getAllActivities();
  }

  if (include.includes('rvm')) {
    response.requirements = getAllRequirements();
  }

  if (include.includes('portfolio')) {
    const kParam = parseInt(searchParams.get('k') || '3', 10) as 2 | 3;
    const portfolio = optimizePortfolio(
      ['cinder-lake', 'askja-caldera', 'atacama-desert', 'mcmurdo-dry-valleys', 'hawaii-mauna-kea', 'utah-san-rafael', 'haughton-crater'],
      kParam
    );
    response.portfolio = portfolio;
  }

  return NextResponse.json(response);
}
