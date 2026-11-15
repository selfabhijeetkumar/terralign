/**
 * TERRALIGN 2.0 — Dataset Upload & Processing API Route
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * Supports CSV, TSV, JSON, GeoJSON, XLSX, and GeoTIFF uploads.
 * Includes server-side size guardrails, MIME/extension validation,
 * and security defenses against formula injection and macro execution.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  MAX_FILE_SIZE_BYTES,
  parseGeoTIFFBuffer,
  parseXLSXBuffer,
  processDatasetContent,
} from '@/lib/datasets/parser';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let filename = 'dataset.csv';
    let sizeBytes = 0;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const sheetName = formData.get('sheet') as string | null;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      filename = file.name;
      sizeBytes = file.size;

      if (sizeBytes > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File size exceeds 5MB limit (${(sizeBytes / 1024 / 1024).toFixed(2)} MB)` },
          { status: 413 }
        );
      }

      const lowerName = filename.toLowerCase();

      // Prohibit macro-enabled spreadsheets
      if (lowerName.endsWith('.xlsm')) {
        return NextResponse.json(
          {
            error:
              'Security Policy: Macro-enabled spreadsheets (.xlsm) are prohibited. Please provide a standard .xlsx or .csv dataset.',
          },
          { status: 400 }
        );
      }

      // GeoTIFF
      if (lowerName.endsWith('.tif') || lowerName.endsWith('.tiff')) {
        const arrayBuffer = await file.arrayBuffer();
        const dataset = await parseGeoTIFFBuffer(arrayBuffer, filename);
        return NextResponse.json({ success: true, dataset });
      }

      // Excel XLSX
      if (lowerName.endsWith('.xlsx')) {
        const arrayBuffer = await file.arrayBuffer();
        const dataset = parseXLSXBuffer(Buffer.from(arrayBuffer), filename, sheetName || undefined);
        return NextResponse.json({ success: true, dataset });
      }

      // Text-based: CSV, TSV, JSON, GeoJSON
      const fileContent = await file.text();
      const dataset = processDatasetContent(filename, fileContent, sizeBytes);
      return NextResponse.json({ success: true, dataset });
    } else {
      // JSON Payload
      const body = await req.json();
      filename = body.filename || 'dataset.csv';
      const lowerName = filename.toLowerCase();

      if (lowerName.endsWith('.xlsm')) {
        return NextResponse.json(
          {
            error:
              'Security Policy: Macro-enabled spreadsheets (.xlsm) are prohibited.',
          },
          { status: 400 }
        );
      }

      if (body.base64Content) {
        const buffer = Buffer.from(body.base64Content, 'base64');
        sizeBytes = buffer.length;

        if (sizeBytes > MAX_FILE_SIZE_BYTES) {
          return NextResponse.json(
            { error: `Payload exceeds 5MB limit (${(sizeBytes / 1024 / 1024).toFixed(2)} MB)` },
            { status: 413 }
          );
        }

        if (lowerName.endsWith('.tif') || lowerName.endsWith('.tiff')) {
          const ab = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
          const dataset = await parseGeoTIFFBuffer(ab, filename);
          return NextResponse.json({ success: true, dataset });
        }

        if (lowerName.endsWith('.xlsx')) {
          const dataset = parseXLSXBuffer(buffer, filename, body.sheet);
          return NextResponse.json({ success: true, dataset });
        }
      }

      if (!body.content) {
        return NextResponse.json({ error: 'Missing content payload' }, { status: 400 });
      }

      const fileContent = body.content;
      sizeBytes = Buffer.byteLength(fileContent, 'utf-8');

      if (sizeBytes > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `Payload exceeds 5MB limit (${(sizeBytes / 1024 / 1024).toFixed(2)} MB)` },
          { status: 413 }
        );
      }

      const dataset = processDatasetContent(filename, fileContent, sizeBytes);
      return NextResponse.json({ success: true, dataset });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to process dataset' },
      { status: 400 }
    );
  }
}
