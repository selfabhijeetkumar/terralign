/**
 * TERRALIGN — Provider Health & Telemetry Monitor
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 */

import type { ProviderHealthReport } from '@/types/science';

async function checkEndpoint(
  providerId: string,
  name: string,
  targetBody: 'earth' | 'moon' | 'mars',
  url: string,
  timeoutMs: number = 4000
): Promise<ProviderHealthReport> {
  const startTime = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'TERRALIGN-HealthProbe/2.0',
      },
    });

    const latencyMs = Date.now() - startTime;
    const isHealthy = res.ok;

    return {
      providerId,
      name,
      targetBody,
      status: isHealthy ? 'HEALTHY' : 'DEGRADED',
      latencyMs,
      lastChecked: new Date().toISOString(),
      endpoint: url,
      details: isHealthy ? `HTTP ${res.status} OK` : `HTTP ${res.status} ${res.statusText}`,
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const isTimeout = (err as Error)?.name === 'AbortError';

    return {
      providerId,
      name,
      targetBody,
      status: isTimeout ? 'DEGRADED' : 'OFFLINE',
      latencyMs,
      lastChecked: new Date().toISOString(),
      endpoint: url,
      details: isTimeout ? `Timeout after ${timeoutMs}ms (Fallback active)` : 'Unreachable (Fallback active)',
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function checkAllProvidersHealth(): Promise<ProviderHealthReport[]> {
  const checks = await Promise.all([
    // Earth provider: OpenTopoData USGS NED 10m
    checkEndpoint(
      'USGS_3DEP_NED',
      'USGS 3DEP / NED Elevation Provider',
      'earth',
      'https://api.opentopodata.org/v1/ned10m?locations=35.3071,-111.5049',
      4500
    ),
    // Moon provider: NASA PDS ODE LOLA
    checkEndpoint(
      'NASA_PDS_LOLA',
      'NASA Planetary Data System (LRO LOLA Science Team)',
      'moon',
      'https://oderest.rsl.wustl.edu/live2/?target=moon&query=product&ihid=LRO&iid=LOLA&pt=GDRDEM&results=m&maxresults=1&output=JSON',
      4500
    ),
    // Mars provider: NASA PDS ODE MOLA
    checkEndpoint(
      'NASA_PDS_MOLA',
      'NASA Planetary Data System (MGS MOLA Science Team)',
      'mars',
      'https://oderest.rsl.wustl.edu/live2/?target=mars&query=product&ihid=MGS&iid=MOLA&pt=MEGDR&results=m&maxresults=1&output=JSON',
      4500
    ),
  ]);

  return checks;
}
