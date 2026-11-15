/**
 * TERRALIGN 2.0 — Dataset Parser & Security Sanitizer
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * Secure parsing for CSV, TSV, JSON, GeoJSON, XLSX, and GeoTIFF datasets.
 * Includes formula-injection defense, projection validation, and NoData filtering.
 */

import * as XLSX from 'xlsx';
import { fromArrayBuffer } from 'geotiff';
import type {
  DatasetQualityMetrics,
  DetectedColumns,
  ElevationMetrics,
  GeoTIFFRasterMetadata,
  SpatialBounds,
  SupportedDatasetFormat,
  UserDataset,
  UserDatasetRecord,
} from '@/types/dataset';
import type { PlanetaryBody } from '@/types/science';

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB Limit

/**
 * Sanitize cell values against spreadsheet formula injection (DDE attacks)
 * Preserves genuine numeric values (including negative elevations like -25.5 or "-25.5")
 * while neutralizing formula/DDE exploit attempts (=cmd, +SUM, -1+1, @SUM).
 */
export function sanitizeCellValue(val: any): any {
  if (typeof val !== 'string') return val;
  const trimmed = val.trim();
  if (trimmed === '') return trimmed;

  // Preserve valid numeric representations (e.g. "-25.5", "+10.2", "-0.05", "2022.09")
  // Genuine numbers are safe from DDE/formula execution
  if (!isNaN(Number(trimmed))) {
    return trimmed;
  }

  // If non-numeric string starts with risky formula trigger characters, prefix with single-quote
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    return `'${trimmed}`;
  }
  return trimmed;
}

/**
 * Identify column roles based on header names
 */
export function detectColumns(headers: string[]): DetectedColumns {
  const detected: DetectedColumns = { otherCols: [] };

  const latRegex = /^(lat|latitude|dec_lat|y_coord|y|phi)(_deg)?$/i;
  const lngRegex = /^(lon|lng|long|longitude|dec_lon|x_coord|x|lambda)(_deg)?$/i;
  const elevRegex = /^(elev|elevation|alt|altitude|height|z|dem)(_m|_meters)?$/i;
  const timeRegex = /^(time|timestamp|date|datetime|utc_time|sol)$/i;
  const slipRegex = /^(slip|slip_ratio|wheel_slip|slip_pct)$/i;
  const penRegex = /^(penetrometer|cone_index|psi|penetration|resistance)$/i;

  for (const h of headers) {
    const clean = h.trim().toLowerCase();
    if (!detected.latitudeCol && latRegex.test(clean)) {
      detected.latitudeCol = h;
    } else if (!detected.longitudeCol && lngRegex.test(clean)) {
      detected.longitudeCol = h;
    } else if (!detected.elevationCol && elevRegex.test(clean)) {
      detected.elevationCol = h;
    } else if (!detected.timestampCol && timeRegex.test(clean)) {
      detected.timestampCol = h;
    } else if (!detected.slipCol && slipRegex.test(clean)) {
      detected.slipCol = h;
    } else if (!detected.penetrometerCol && penRegex.test(clean)) {
      detected.penetrometerCol = h;
    } else {
      detected.otherCols.push(h);
    }
  }

  return detected;
}

/**
 * Infer planetary body from spatial coordinates and filenames
 */
export function inferPlanetaryBody(
  bounds: SpatialBounds,
  filename: string
): PlanetaryBody | 'unspecified' {
  const lowerName = filename.toLowerCase();
  if (
    lowerName.includes('moon') ||
    lowerName.includes('lunar') ||
    lowerName.includes('apollo') ||
    lowerName.includes('artemis')
  ) {
    return 'moon';
  }
  if (
    lowerName.includes('mars') ||
    lowerName.includes('jezero') ||
    lowerName.includes('perseverance') ||
    lowerName.includes('curiosity')
  ) {
    return 'mars';
  }

  // Lunar south polar detection
  if (bounds.minLat <= -80 && bounds.maxLat <= -70) {
    return 'moon';
  }

  // Earth standard bounds check
  if (bounds.minLat >= -60 && bounds.maxLat <= 75) {
    return 'earth';
  }

  return 'unspecified';
}

/**
 * Split a CSV line respecting quotes
 */
function splitCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  result.push(current.trim());
  return result;
}

/**
 * Parse CSV / TSV text into sanitized objects
 */
export function parseCSV(content: string): { headers: string[]; rows: Record<string, any>[] } {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return { headers: [], rows: [] };

  const headerLine = lines[0];
  let delimiter = ',';
  if (headerLine.includes('\t')) delimiter = '\t';
  else if (headerLine.includes(';') && !headerLine.includes(',')) delimiter = ';';

  const rawHeaders = splitCSVLine(headerLine, delimiter).map((h) => h.replace(/^["']|["']$/g, ''));
  const headers = rawHeaders.map((h) => sanitizeCellValue(h));

  const rows: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = splitCSVLine(lines[i], delimiter);
    if (parts.length === headers.length) {
      const row: Record<string, any> = {};
      for (let j = 0; j < headers.length; j++) {
        const val = parts[j].replace(/^["']|["']$/g, '');
        const num = Number(val);
        row[headers[j]] = !isNaN(num) && val !== '' ? num : sanitizeCellValue(val);
      }
      rows.push(row);
    }
  }

  return { headers, rows };
}

/**
 * Parse XLSX Spreadsheet
 */
export function parseXLSXBuffer(
  buffer: ArrayBuffer | Buffer,
  filename: string,
  requestedSheet?: string
): UserDataset {
  if (filename.toLowerCase().endsWith('.xlsm')) {
    throw new Error(
      'Security Policy: Macro-enabled spreadsheets (.xlsm) are prohibited. Please provide a standard .xlsx or .csv dataset.'
    );
  }

  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: 'buffer', cellFormula: false, cellHTML: false });
  } catch (err: any) {
    throw new Error(`Failed to parse Excel workbook: ${err.message}`);
  }

  const availableSheets = workbook.SheetNames;
  if (!availableSheets || availableSheets.length === 0) {
    throw new Error('Workbook contains 0 sheets.');
  }

  const activeSheet =
    requestedSheet && availableSheets.includes(requestedSheet)
      ? requestedSheet
      : availableSheets[0];

  const worksheet = workbook.Sheets[activeSheet];
  if (!worksheet) {
    throw new Error(`Sheet "${activeSheet}" not found in workbook.`);
  }

  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: null });
  if (rawRows.length === 0) {
    throw new Error(`Sheet "${activeSheet}" contains 0 data rows.`);
  }

  // Decompression resource protection: limit to 25,000 rows
  if (rawRows.length > 25000) {
    throw new Error(
      `Spreadsheet row count (${rawRows.length}) exceeds safety limit of 25,000 records.`
    );
  }

  const headers = Object.keys(rawRows[0]).map((h) => sanitizeCellValue(h));
  const sanitizedRows = rawRows.map((row) => {
    const cleanRow: Record<string, any> = {};
    for (const key of Object.keys(row)) {
      const val = row[key];
      const num = Number(val);
      cleanRow[sanitizeCellValue(key)] = !isNaN(num) && val !== null && val !== '' ? num : sanitizeCellValue(val);
    }
    return cleanRow;
  });

  const dataset = assembleDataset(filename, 'xlsx', sanitizedRows, headers, (buffer as Buffer).length || 0);
  dataset.availableSheets = availableSheets;
  dataset.activeSheet = activeSheet;
  return dataset;
}

/**
 * Parse GeoTIFF Elevation Raster
 */
export async function parseGeoTIFFBuffer(
  buffer: ArrayBuffer,
  filename: string
): Promise<UserDataset> {
  if (!buffer || buffer.byteLength < 4) {
    throw new Error('Invalid GeoTIFF: Buffer is empty or truncated.');
  }

  let tiff;
  try {
    tiff = await fromArrayBuffer(buffer);
  } catch (err: any) {
    throw new Error(`Invalid GeoTIFF container: ${err.message}`);
  }

  let image;
  try {
    image = await tiff.getImage();
  } catch (err: any) {
    throw new Error(`Invalid GeoTIFF image: ${err.message}`);
  }

  const width = image.getWidth();
  const height = image.getHeight();
  if (!width || !height || width <= 0 || height <= 0) {
    throw new Error('Invalid GeoTIFF: Raster dimensions must be greater than 0.');
  }

  const rawBbox = image.getBoundingBox(); // [minX, minY, maxX, maxY]
  const geoKeys = image.getGeoKeys();
  const rawNoData = image.getGDALNoData();
  const noDataValue = rawNoData !== null && rawNoData !== undefined ? Number(rawNoData) : -9999;

  // Determine projection and handle missing/unreferenced CRS
  const hasValidBbox =
    Array.isArray(rawBbox) &&
    rawBbox.length === 4 &&
    rawBbox.every((n) => typeof n === 'number' && !isNaN(n));
  const bbox = hasValidBbox ? rawBbox : [0, 0, width, height];

  const minX = bbox[0];
  const minY = bbox[1];
  const maxX = bbox[2];
  const maxY = bbox[3];

  const hasGeoKeys =
    geoKeys &&
    Object.keys(geoKeys).length > 0 &&
    (Boolean(geoKeys.ProjectedCSTypeGeoKey) ||
      (Boolean(geoKeys.GeographicTypeGeoKey) && geoKeys.GeographicTypeGeoKey !== 0));

  const isProjectedCRS =
    hasValidBbox &&
    (Boolean(geoKeys?.ProjectedCSTypeGeoKey) ||
      minX < -180 ||
      maxX > 180 ||
      minY < -90 ||
      maxY > 90);

  const crsString =
    !hasGeoKeys &&
    (!hasValidBbox || (minX === 0 && minY === 0 && maxX === width && maxY === height))
      ? 'Unreferenced / Missing CRS (Pixel Space Grid)'
      : isProjectedCRS
        ? geoKeys?.ProjectedCSTypeGeoKey
          ? `Projected (EPSG:${geoKeys.ProjectedCSTypeGeoKey})`
          : 'Projected Metric Grid (Non-WGS84 UTM/Local)'
        : 'EPSG:4326 (WGS84 Geographic 2D)';

  // Read raster samples safely (downsample if raster exceeds 48x48)
  const rasters = await image.readRasters({ interleave: true });
  const rasterData = rasters as Float32Array | Int16Array | Uint16Array | number[];

  const maxSampleDim = 32;
  const stepX = Math.max(1, Math.floor(width / maxSampleDim));
  const stepY = Math.max(1, Math.floor(height / maxSampleDim));

  let minElev = Infinity;
  let maxElev = -Infinity;
  let sumElev = 0;
  let validElevCount = 0;
  let noDataCount = 0;

  const records: UserDatasetRecord[] = [];
  let recordIdx = 0;

  for (let r = 0; r < height; r += stepY) {
    for (let c = 0; c < width; c += stepX) {
      const idx = r * width + c;
      const val = Number(rasterData[idx]);

      const isNoData = isNaN(val) || val === noDataValue || val <= -10000 || val >= 30000;

      // Coordinate interpolation
      const normX = c / (width - 1 || 1);
      const normY = r / (height - 1 || 1);

      const coordX = isProjectedCRS
        ? Math.round(minX + normX * (maxX - minX))
        : Math.round((minX + normX * (maxX - minX)) * 10000) / 10000;

      const coordY = isProjectedCRS
        ? Math.round(maxY - normY * (maxY - minY))
        : Math.round((maxY - normY * (maxY - minY)) * 10000) / 10000;

      if (!isNoData) {
        if (val < minElev) minElev = val;
        if (val > maxElev) maxElev = val;
        sumElev += val;
        validElevCount++;
      } else {
        noDataCount++;
      }

      recordIdx++;
      records.push({
        id: `px_${recordIdx}`,
        lat: coordY,
        lng: coordX,
        elevation: !isNoData ? Math.round(val * 10) / 10 : undefined,
        raw: {
          pixelX: c,
          pixelY: r,
          nativeX: coordX,
          nativeY: coordY,
          elevation: !isNoData ? val : 'NODATA',
          crs: crsString,
        },
      });
    }
  }

  const bounds: SpatialBounds = {
    minLat: Math.round(minY * 10000) / 10000,
    maxLat: Math.round(maxY * 10000) / 10000,
    minLng: Math.round(minX * 10000) / 10000,
    maxLng: Math.round(maxX * 10000) / 10000,
    centerLat: Math.round(((minY + maxY) / 2) * 10000) / 10000,
    centerLng: Math.round(((minX + maxX) / 2) * 10000) / 10000,
  };

  const elevation: ElevationMetrics = {
    minMeters: validElevCount > 0 ? Math.round(minElev * 10) / 10 : 0,
    maxMeters: validElevCount > 0 ? Math.round(maxElev * 10) / 10 : 0,
    meanMeters: validElevCount > 0 ? Math.round((sumElev / validElevCount) * 10) / 10 : 0,
    spanMeters: validElevCount > 0 ? Math.round((maxElev - minElev) * 10) / 10 : 0,
  };

  const completeness = Math.round((validElevCount / (validElevCount + noDataCount || 1)) * 100);

  const quality: DatasetQualityMetrics = {
    totalRows: records.length,
    validCoordinateRows: records.length,
    nullPercentage: Math.round((noDataCount / (records.length || 1)) * 1000) / 10,
    elevationCoveragePercentage: completeness,
    completenessScore: completeness,
    outlierCount: 0,
  };

  const rasterMetadata: GeoTIFFRasterMetadata = {
    width,
    height,
    bandsCount: 1,
    bitsPerSample: [image.getBitsPerSample()],
    crs: crsString,
    origin: [minX, maxY],
    noDataValue,
    isProjectedCRS,
    elevationUnits: 'meters',
  };

  const planetaryBody = inferPlanetaryBody(bounds, filename);

  return {
    id: `geotiff_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    filename,
    format: 'geotiff',
    fileSizeBytes: buffer.byteLength,
    uploadedAt: new Date().toISOString(),
    planetaryBody,
    columns: {
      latitudeCol: 'lat',
      longitudeCol: 'lng',
      elevationCol: 'elevation',
      otherCols: ['pixelX', 'pixelY', 'nativeX', 'nativeY'],
    },
    bounds,
    elevation,
    quality,
    records,
    rasterMetadata,
    epistemicClassification: 'USER PROVIDED DATA',
  };
}

/**
 * Common assembler for tabular datasets
 */
function assembleDataset(
  filename: string,
  format: SupportedDatasetFormat,
  rawRows: Record<string, any>[],
  headers: string[],
  sizeBytes: number
): UserDataset {
  const cols = detectColumns(headers);

  let minLat = Infinity,
    maxLat = -Infinity;
  let minLng = Infinity,
    maxLng = -Infinity;
  let minElev = Infinity,
    maxElev = -Infinity,
    sumElev = 0,
    elevCount = 0;

  const records: UserDatasetRecord[] = [];
  let nullCoordCount = 0;

  for (let i = 0; i < rawRows.length; i++) {
    const r = rawRows[i];
    const latVal = cols.latitudeCol ? Number(r[cols.latitudeCol]) : NaN;
    const lngVal = cols.longitudeCol ? Number(r[cols.longitudeCol]) : NaN;
    const elevVal = cols.elevationCol ? Number(r[cols.elevationCol]) : NaN;
    const slipVal = cols.slipCol ? Number(r[cols.slipCol]) : undefined;
    const penVal = cols.penetrometerCol ? Number(r[cols.penetrometerCol]) : undefined;

    const hasValidCoords = !isNaN(latVal) && !isNaN(lngVal);

    if (hasValidCoords) {
      if (latVal < minLat) minLat = latVal;
      if (latVal > maxLat) maxLat = latVal;
      if (lngVal < minLng) minLng = lngVal;
      if (lngVal > maxLng) maxLng = lngVal;

      let validElev: number | undefined = undefined;
      if (!isNaN(elevVal)) {
        validElev = elevVal;
        if (elevVal < minElev) minElev = elevVal;
        if (elevVal > maxElev) maxElev = elevVal;
        sumElev += elevVal;
        elevCount++;
      }

      records.push({
        id: `rec_${i + 1}`,
        lat: latVal,
        lng: lngVal,
        elevation: validElev,
        timestamp: cols.timestampCol ? String(r[cols.timestampCol]) : undefined,
        slipRatio: !isNaN(slipVal as number) ? slipVal : undefined,
        penetrometerPsi: !isNaN(penVal as number) ? penVal : undefined,
        raw: r,
      });
    } else {
      nullCoordCount++;
    }
  }

  if (records.length === 0) {
    throw new Error('Could not identify valid geographic coordinates (latitude and longitude columns).');
  }

  const bounds: SpatialBounds = {
    minLat: Math.round(minLat * 10000) / 10000,
    maxLat: Math.round(maxLat * 10000) / 10000,
    minLng: Math.round(minLng * 10000) / 10000,
    maxLng: Math.round(maxLng * 10000) / 10000,
    centerLat: Math.round(((minLat + maxLat) / 2) * 10000) / 10000,
    centerLng: Math.round(((minLng + maxLng) / 2) * 10000) / 10000,
  };

  const elevation: ElevationMetrics = {
    minMeters: elevCount > 0 ? Math.round(minElev * 10) / 10 : 0,
    maxMeters: elevCount > 0 ? Math.round(maxElev * 10) / 10 : 0,
    meanMeters: elevCount > 0 ? Math.round((sumElev / elevCount) * 10) / 10 : 0,
    spanMeters: elevCount > 0 ? Math.round((maxElev - minElev) * 10) / 10 : 0,
  };

  const completenessScore = Math.round(
    ((records.length / rawRows.length) * 0.6 + (elevCount / rawRows.length) * 0.4) * 100
  );

  const quality: DatasetQualityMetrics = {
    totalRows: rawRows.length,
    validCoordinateRows: records.length,
    nullPercentage: Math.round((nullCoordCount / rawRows.length) * 1000) / 10,
    elevationCoveragePercentage: Math.round((elevCount / rawRows.length) * 1000) / 10,
    completenessScore,
    outlierCount: 0,
  };

  const planetaryBody = inferPlanetaryBody(bounds, filename);

  return {
    id: `ds_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    filename,
    format,
    fileSizeBytes: sizeBytes,
    uploadedAt: new Date().toISOString(),
    planetaryBody,
    columns: cols,
    bounds,
    elevation,
    quality,
    records,
    epistemicClassification: 'USER PROVIDED DATA',
  };
}

/**
 * Universal Processor for text or JSON datasets
 */
export function processDatasetContent(
  filename: string,
  content: string,
  sizeBytes: number
): UserDataset {
  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size (${(sizeBytes / 1024 / 1024).toFixed(2)} MB) exceeds maximum 5 MB limit.`);
  }

  let rawRows: Record<string, any>[] = [];
  let headers: string[] = [];
  let format: SupportedDatasetFormat = 'csv';

  const trimmed = content.trim();

  // JSON or GeoJSON Detection
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        rawRows = parsed;
        format = 'json';
        if (rawRows.length > 0) headers = Object.keys(rawRows[0]);
      } else if (parsed.type === 'FeatureCollection' && Array.isArray(parsed.features)) {
        format = 'geojson';
        rawRows = parsed.features.map((f: any, idx: number) => {
          const coords = f.geometry?.coordinates || [0, 0, 0];
          return {
            id: f.id || `pt_${idx}`,
            lng: coords[0],
            lat: coords[1],
            elevation: coords[2] ?? f.properties?.elevation ?? f.properties?.elev,
            ...f.properties,
          };
        });
        if (rawRows.length > 0) headers = Object.keys(rawRows[0]);
      } else {
        throw new Error('Unsupported JSON structure. Provide an array of records or a GeoJSON FeatureCollection.');
      }
    } catch (err: any) {
      throw new Error(`Invalid JSON dataset: ${err.message}`);
    }
  } else {
    // CSV / TSV Parsing
    format = filename.toLowerCase().endsWith('.tsv') ? 'tsv' : 'csv';
    const parsed = parseCSV(trimmed);
    headers = parsed.headers;
    rawRows = parsed.rows;
  }

  if (rawRows.length === 0) {
    throw new Error('Dataset contains 0 readable records.');
  }

  return assembleDataset(filename, format, rawRows, headers, sizeBytes);
}
