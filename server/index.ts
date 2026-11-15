/**
 * TERRALIGN 2.0 — Standalone Node.js / Express Backend Service for Render
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 *
 * Provides all 11 scientific & AI API endpoints independently of Next.js:
 * 1.  GET  /health
 * 2.  POST /api/ai/query
 * 3.  POST /api/test/ai-harness
 * 4.  GET  /api/analogs
 * 5.  POST /api/datasets/upload
 * 6.  GET  /api/science/datasets
 * 7.  GET  /api/science/elevation
 * 8.  POST /api/science/elevation
 * 9.  GET  /api/science/health
 * 10. GET  /api/science/interpret
 * 11. POST /api/science/interpret
 * 12. GET  /api/science/providers
 * 13. GET  /api/science/terrain
 * 14. POST /api/science/terrain
 * 15. GET  /api/science/transect
 * 16. POST /api/science/transect
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';

import { handleAIQuery } from '../src/lib/ai/aiQueryHandler';
import {
  getAllAnalogs,
  getAnalogById,
  getAllActivities,
  filterAndRankAnalogs,
} from '../src/lib/analogs';
import { getAllRequirements, optimizePortfolio } from '../src/lib/rvm';
import {
  MAX_FILE_SIZE_BYTES,
  parseGeoTIFFBuffer,
  parseXLSXBuffer,
  processDatasetContent,
} from '../src/lib/datasets/parser';
import { SCIENTIFIC_DATASETS, SCIENTIFIC_PROVIDERS } from '../src/lib/science/datasets';
import {
  queryEarthElevation,
  queryEarthTransect,
} from '../src/lib/science/providers/earthProvider';
import {
  queryMoonElevation,
  queryMoonTransect,
} from '../src/lib/science/providers/moonProvider';
import {
  queryMarsElevation,
  queryMarsTransect,
} from '../src/lib/science/providers/marsProvider';
import { checkAllProvidersHealth } from '../src/lib/science/providers/healthProvider';
import { generateScientificInterpretation } from '../src/lib/science/aiInterpreter';
import { generateTerrainGrid } from '../src/lib/science/providers/terrainGridProvider';

import type { PlanetaryBody, TerrainGridQuery } from '../src/types/science';
import type { AIModelQuery } from '../src/types/ai';
import type { TargetBody } from '../src/types/store';

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

// -------------------------------------------------------------
// CORS Configuration
// -------------------------------------------------------------
const rawAllowed = process.env.ALLOWED_ORIGINS || '*';
const allowedOrigins = rawAllowed.split(',').map((s) => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// -------------------------------------------------------------
// 1. Health Endpoint
// -------------------------------------------------------------
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'terralign-backend',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'production',
  });
});

// -------------------------------------------------------------
// 2. Multi-Model AI Query Endpoint
// -------------------------------------------------------------
app.post('/api/ai/query', async (req: Request, res: Response) => {
  try {
    const rawBody = req.body as Record<string, unknown>;

    if (!rawBody || typeof rawBody.prompt !== 'string' || !rawBody.prompt.trim()) {
      res.status(400).json({ error: 'Invalid inquiry: prompt string is required' });
      return;
    }

    const sanitizedQuery: AIModelQuery = {
      prompt: String(rawBody.prompt).trim().slice(0, 4000),
      mode:
        rawBody.mode === 'gemini' ||
        rawBody.mode === 'groq' ||
        rawBody.mode === 'grok' ||
        rawBody.mode === 'dual'
          ? rawBody.mode === 'grok'
            ? 'groq'
            : rawBody.mode
          : 'dual',
      context:
        rawBody.context && typeof rawBody.context === 'object'
          ? (rawBody.context as AIModelQuery['context'])
          : undefined,
      temperature:
        typeof rawBody.temperature === 'number'
          ? Math.max(0, Math.min(1, rawBody.temperature))
          : undefined,
      maxTokens:
        typeof rawBody.maxTokens === 'number'
          ? Math.max(100, Math.min(2048, rawBody.maxTokens))
          : undefined,
    };

    const result = await handleAIQuery(sanitizedQuery);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      error: 'AI query processing failed',
      message: error?.message || 'Unknown error occurred',
    });
  }
});

// -------------------------------------------------------------
// 3. AI Test Harness Endpoint (Non-production test simulation)
// -------------------------------------------------------------
app.post('/api/test/ai-harness', async (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction && !process.env.ENABLE_TEST_HARNESS) {
    res.status(404).json({ error: 'Not Found' });
    return;
  }

  try {
    const body = req.body;
    const query: AIModelQuery = {
      prompt: body.prompt || 'Evaluate terramechanic parameters.',
      mode: body.mode || 'dual',
      context: body.context,
      temperature: body.temperature,
      maxTokens: body.maxTokens,
    };
    const result = await handleAIQuery(query);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Harness query failed' });
  }
});

// -------------------------------------------------------------
// 4. Analogs & Portfolio Optimization Endpoint
// -------------------------------------------------------------
app.get('/api/analogs', (req: Request, res: Response) => {
  const siteId = req.query.id as string | undefined;
  if (siteId) {
    const site = getAnalogById(siteId);
    if (!site) {
      res.status(404).json({ error: `Site '${siteId}' not found` });
      return;
    }
    res.json({ site });
    return;
  }

  const targetBody = ((req.query.body as string) as TargetBody) || 'moon';
  const activityId = (req.query.activity as string) || 'rover_terramechanics';
  const include = typeof req.query.include === 'string' ? req.query.include.split(',') : [];

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
    const kParam = parseInt((req.query.k as string) || '3', 10) as 2 | 3;
    const portfolio = optimizePortfolio(
      [
        'cinder-lake',
        'askja-caldera',
        'atacama-desert',
        'mcmurdo-dry-valleys',
        'hawaii-mauna-kea',
        'utah-san-rafael',
        'haughton-crater',
      ],
      kParam
    );
    response.portfolio = portfolio;
  }

  res.json(response);
});

// -------------------------------------------------------------
// 5. Dataset Upload & Processing Endpoint
// -------------------------------------------------------------
app.post('/api/datasets/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (file) {
      const filename = file.originalname;
      const sizeBytes = file.size;
      const lowerName = filename.toLowerCase();

      if (lowerName.endsWith('.xlsm')) {
        res.status(400).json({
          error:
            'Security Policy: Macro-enabled spreadsheets (.xlsm) are prohibited. Please provide a standard .xlsx or .csv dataset.',
        });
        return;
      }

      if (lowerName.endsWith('.tif') || lowerName.endsWith('.tiff')) {
        const dataset = await parseGeoTIFFBuffer(file.buffer.buffer as ArrayBuffer, filename);
        res.json({ success: true, dataset });
        return;
      }

      if (lowerName.endsWith('.xlsx')) {
        const sheetName = (req.body.sheet as string) || undefined;
        const dataset = parseXLSXBuffer(file.buffer, filename, sheetName);
        res.json({ success: true, dataset });
        return;
      }

      const fileContent = file.buffer.toString('utf-8');
      const dataset = processDatasetContent(filename, fileContent, sizeBytes);
      res.json({ success: true, dataset });
      return;
    }

    // JSON upload fallback
    const body = req.body;
    const filename = body.filename || 'dataset.csv';
    const lowerName = filename.toLowerCase();

    if (lowerName.endsWith('.xlsm')) {
      res.status(400).json({
        error: 'Security Policy: Macro-enabled spreadsheets (.xlsm) are prohibited.',
      });
      return;
    }

    if (body.base64Content) {
      const buffer = Buffer.from(body.base64Content, 'base64');
      if (buffer.length > MAX_FILE_SIZE_BYTES) {
        res.status(413).json({ error: 'Payload exceeds 5MB limit' });
        return;
      }

      if (lowerName.endsWith('.tif') || lowerName.endsWith('.tiff')) {
        const dataset = await parseGeoTIFFBuffer(buffer.buffer as ArrayBuffer, filename);
        res.json({ success: true, dataset });
        return;
      }

      if (lowerName.endsWith('.xlsx')) {
        const dataset = parseXLSXBuffer(buffer, filename, body.sheet);
        res.json({ success: true, dataset });
        return;
      }

      const dataset = processDatasetContent(filename, buffer.toString('utf-8'), buffer.length);
      res.json({ success: true, dataset });
      return;
    }

    if (body.rawContent) {
      const dataset = processDatasetContent(filename, body.rawContent, Buffer.byteLength(body.rawContent));
      res.json({ success: true, dataset });
      return;
    }

    res.status(400).json({ error: 'No file or valid content provided' });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Dataset processing failed' });
  }
});

// -------------------------------------------------------------
// 6. Scientific Datasets Catalog Endpoint
// -------------------------------------------------------------
app.get('/api/science/datasets', (req: Request, res: Response) => {
  const body = req.query.body as PlanetaryBody | undefined;
  let datasets = SCIENTIFIC_DATASETS;
  if (body && ['earth', 'moon', 'mars'].includes(body)) {
    datasets = datasets.filter((d) => d.body === body);
  }

  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    filterBody: body || 'all',
    count: datasets.length,
    datasets,
  });
});

// -------------------------------------------------------------
// 7. Point Elevation Query Endpoint
// -------------------------------------------------------------
async function handleElevation(
  rawLat: string | number | undefined,
  rawLng: string | number | undefined,
  rawBody: string | undefined,
  datasetId: string | undefined,
  res: Response
) {
  if (rawLat === undefined || rawLng === undefined) {
    res.status(400).json({ status: 'error', message: 'Parameters "lat" and "lng" are required.' });
    return;
  }

  const lat = typeof rawLat === 'number' ? rawLat : parseFloat(rawLat);
  const lng = typeof rawLng === 'number' ? rawLng : parseFloat(rawLng);

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 360) {
    res.status(400).json({ status: 'error', message: 'Coordinates are out of valid range.' });
    return;
  }

  const body: PlanetaryBody = (rawBody?.toLowerCase() as PlanetaryBody) || 'earth';
  if (!['earth', 'moon', 'mars'].includes(body)) {
    res.status(400).json({ status: 'error', message: 'Parameter "body" must be earth, moon, or mars.' });
    return;
  }

  try {
    let result;
    if (body === 'earth') {
      result = await queryEarthElevation(lat, lng, datasetId);
    } else if (body === 'moon') {
      result = await queryMoonElevation(lat, lng);
    } else {
      result = await queryMarsElevation(lat, lng);
    }

    res.json({ status: 'success', data: result });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err?.message || 'Elevation query failed' });
  }
}

app.get('/api/science/elevation', (req: Request, res: Response) => {
  const { lat, lng, lon, body, datasetId } = req.query;
  handleElevation(
    (lat as string) || undefined,
    ((lng || lon) as string) || undefined,
    (body as string) || undefined,
    (datasetId as string) || undefined,
    res
  );
});

app.post('/api/science/elevation', (req: Request, res: Response) => {
  const { lat, lng, lon, body, datasetId } = req.body;
  handleElevation(lat, lng || lon, body, datasetId, res);
});

// -------------------------------------------------------------
// 8. Scientific Providers Health Endpoint
// -------------------------------------------------------------
app.get('/api/science/health', async (_req: Request, res: Response) => {
  try {
    const reports = await checkAllProvidersHealth();
    const allHealthy = reports.every((r) => r.status === 'HEALTHY');
    const anyDegraded = reports.some((r) => r.status === 'DEGRADED');

    res.json({
      status: allHealthy ? 'HEALTHY' : anyDegraded ? 'DEGRADED' : 'OFFLINE',
      timestamp: new Date().toISOString(),
      providers: reports,
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'ERROR',
      error: err?.message || 'Health check failure',
      timestamp: new Date().toISOString(),
    });
  }
});

// -------------------------------------------------------------
// 9. Scientific AI / Heuristic Terrain Interpretation
// -------------------------------------------------------------
function handleInterpret(
  rawBody: string | undefined,
  locationName: string | undefined,
  lat: number,
  lng: number,
  elevation: number,
  datasetName: string | undefined,
  resolution: number,
  res: Response
) {
  const body = (rawBody?.toLowerCase() as PlanetaryBody) || 'earth';
  const interpretation = generateScientificInterpretation({
    body,
    locationName: locationName || 'Planetary Surface Target',
    latitude: lat,
    longitude: lng,
    elevationMeters: elevation,
    datasetName: datasetName || 'Planetary Topographic Reference',
    nominalResolutionMeters: resolution,
  });

  res.json({
    status: 'success',
    data: interpretation,
  });
}

app.get('/api/science/interpret', (req: Request, res: Response) => {
  const { body, location, name, lat, lng, lon, elevation, dataset, resolution } = req.query;
  handleInterpret(
    body as string,
    (location || name) as string,
    parseFloat((lat as string) || '0'),
    parseFloat(((lng || lon) as string) || '0'),
    parseFloat((elevation as string) || '0'),
    dataset as string,
    parseFloat((resolution as string) || '10.0'),
    res
  );
});

app.post('/api/science/interpret', (req: Request, res: Response) => {
  const b = req.body;
  handleInterpret(
    b.body,
    b.locationName || b.location,
    Number(b.latitude ?? b.lat ?? 0),
    Number(b.longitude ?? b.lng ?? b.lon ?? 0),
    Number(b.elevationMeters ?? b.elevation ?? 0),
    b.datasetName || b.dataset,
    Number(b.nominalResolutionMeters ?? b.resolution ?? 10),
    res
  );
});

// -------------------------------------------------------------
// 10. Scientific Providers Catalog Endpoint
// -------------------------------------------------------------
app.get('/api/science/providers', (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    count: SCIENTIFIC_PROVIDERS.length,
    providers: SCIENTIFIC_PROVIDERS,
  });
});

// -------------------------------------------------------------
// 11. Terrain Grid Elevation Matrix Endpoint
// -------------------------------------------------------------
async function handleTerrain(
  rawBody: string | undefined,
  rawLat: string | number | undefined,
  rawLng: string | number | undefined,
  rawGridSize: string | number | undefined,
  rawSpan: string | number | undefined,
  res: Response
) {
  if (rawLat === undefined || rawLng === undefined) {
    res.status(400).json({ status: 'error', message: 'Parameters "lat" and "lng" are required.' });
    return;
  }

  const lat = typeof rawLat === 'number' ? rawLat : parseFloat(rawLat);
  const lng = typeof rawLng === 'number' ? rawLng : parseFloat(rawLng);
  const body = (rawBody?.toLowerCase() as PlanetaryBody) || 'earth';

  if (isNaN(lat) || isNaN(lng) || !['earth', 'moon', 'mars'].includes(body)) {
    res.status(400).json({ status: 'error', message: 'Invalid coordinates or body parameter.' });
    return;
  }

  const query: TerrainGridQuery = {
    body,
    centerLat: lat,
    centerLng: lng,
    gridSize: rawGridSize ? (typeof rawGridSize === 'number' ? rawGridSize : parseInt(rawGridSize, 10)) : 64,
    spanMeters: rawSpan ? (typeof rawSpan === 'number' ? rawSpan : parseFloat(rawSpan)) : 2000,
  };

  try {
    const result = await generateTerrainGrid(query);
    res.json({ status: 'success', data: result });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err?.message || 'Terrain grid failed' });
  }
}

app.get('/api/science/terrain', (req: Request, res: Response) => {
  const { body, lat, centerLat, lng, lon, centerLng, gridSize, spanMeters, span } = req.query;
  handleTerrain(
    body as string,
    (lat || centerLat) as string,
    (lng || lon || centerLng) as string,
    gridSize as string,
    (spanMeters || span) as string,
    res
  );
});

app.post('/api/science/terrain', (req: Request, res: Response) => {
  const b = req.body;
  handleTerrain(b.body, b.centerLat ?? b.lat, b.centerLng ?? b.lng ?? b.lon, b.gridSize, b.spanMeters ?? b.span, res);
});

// -------------------------------------------------------------
// 12. Elevation Transect Endpoint
// -------------------------------------------------------------
async function handleTransect(
  bodyRaw: string | undefined,
  sLatRaw: string | number | undefined,
  sLngRaw: string | number | undefined,
  eLatRaw: string | number | undefined,
  eLngRaw: string | number | undefined,
  samplesRaw: string | number | undefined,
  datasetId: string | undefined,
  res: Response
) {
  if (sLatRaw === undefined || sLngRaw === undefined || eLatRaw === undefined || eLngRaw === undefined) {
    res.status(400).json({ status: 'error', message: 'Missing start/end coordinates.' });
    return;
  }

  const startLat = typeof sLatRaw === 'number' ? sLatRaw : parseFloat(sLatRaw);
  const startLng = typeof sLngRaw === 'number' ? sLngRaw : parseFloat(sLngRaw);
  const endLat = typeof eLatRaw === 'number' ? eLatRaw : parseFloat(eLatRaw);
  const endLng = typeof eLngRaw === 'number' ? eLngRaw : parseFloat(eLngRaw);
  const samples = samplesRaw ? (typeof samplesRaw === 'number' ? samplesRaw : parseInt(samplesRaw, 10)) : 20;

  const body = (bodyRaw?.toLowerCase() as PlanetaryBody) || 'earth';
  if (!['earth', 'moon', 'mars'].includes(body)) {
    res.status(400).json({ status: 'error', message: 'Invalid planetary body.' });
    return;
  }

  try {
    let result;
    if (body === 'earth') {
      result = await queryEarthTransect(startLat, startLng, endLat, endLng, samples);
    } else if (body === 'moon') {
      result = await queryMoonTransect(startLat, startLng, endLat, endLng, samples);
    } else {
      result = await queryMarsTransect(startLat, startLng, endLat, endLng, samples);
    }

    res.json({ status: 'success', data: result });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err?.message || 'Transect failed' });
  }
}

app.get('/api/science/transect', (req: Request, res: Response) => {
  const { body, startLat, startLng, startLon, endLat, endLng, endLon, samples, datasetId } = req.query;
  handleTransect(
    body as string,
    startLat as string,
    (startLng || startLon) as string,
    endLat as string,
    (endLng || endLon) as string,
    samples as string,
    datasetId as string,
    res
  );
});

app.post('/api/science/transect', (req: Request, res: Response) => {
  const b = req.body;
  handleTransect(
    b.body,
    b.startLat,
    b.startLng ?? b.startLon,
    b.endLat,
    b.endLng ?? b.endLon,
    b.samples,
    b.datasetId,
    res
  );
});

// -------------------------------------------------------------
// Start Server
// -------------------------------------------------------------
const PORT = parseInt(process.env.PORT || '10000', 10);
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[TERRALIGN 2.0 Backend] Listening on port ${PORT} (0.0.0.0)`);
  console.log(`[TERRALIGN 2.0 Backend] Health check available at: http://localhost:${PORT}/health`);
});

export default app;
export { server };
