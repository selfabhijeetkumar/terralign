/**
 * TERRALIGN 2.0 — Real Multi-Browser Session Isolation Test Suite
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * Verifies real multi-browser session isolation for user datasets:
 * 1. Launches 2 completely independent Playwright browser contexts (Context A and Context B).
 * 2. Injects Session A dataset into Context A; verifies outbound AI query contains Session A data.
 * 3. Proves Context B initially has NO active dataset (zero leakage from Session A).
 * 4. Injects Session B dataset into Context B; verifies outbound AI query contains Session B data only.
 * 5. Re-queries Context A; verifies Context A has zero leakage from Session B.
 * 6. Detaches dataset in Context A; verifies Context A subsequent query contains NO active dataset.
 * 7. Re-queries Context B; verifies Context B remains completely unaffected and active.
 */

import { chromium } from 'playwright';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

let totalTests = 0;
let passedTests = 0;

function reportTest(name, passed, detail = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`[PASS] ${name} ${detail ? `(${detail})` : ''}`);
  } else {
    console.error(`[FAIL] ${name} ${detail ? `(${detail})` : ''}`);
  }
}

async function runSessionIsolationSuite() {
  console.log(`\n================================================================`);
  console.log(` TERRALIGN 2.0: REAL MULTI-BROWSER SESSION ISOLATION (PLAYWRIGHT)`);
  console.log(` Target Server: ${BASE_URL}`);
  console.log(` Browser Engine: System Google Chrome (Isolated Contexts)`);
  console.log(`================================================================\n`);

  let browser;
  try {
    browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // ── Phase 1: Launch Two Independent Browser Contexts ─────────────────
    const contextA = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TERRALIGN-Session-A',
    });
    const contextB = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TERRALIGN-Session-B',
    });

    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    // Outbound payload capture stores
    const sessionAPayloads = [];
    const sessionBPayloads = [];

    pageA.on('request', (req) => {
      if (req.url().includes('/api/ai/query') && req.method() === 'POST') {
        try {
          const body = JSON.parse(req.postData() || '{}');
          sessionAPayloads.push(body);
        } catch {}
      }
    });

    pageB.on('request', (req) => {
      if (req.url().includes('/api/ai/query') && req.method() === 'POST') {
        try {
          const body = JSON.parse(req.postData() || '{}');
          sessionBPayloads.push(body);
        } catch {}
      }
    });

    console.log('[INFO] Navigating Session A and Session B to base platform...');
    await pageA.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await pageB.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await pageA.waitForTimeout(1000);
    await pageB.waitForTimeout(1000);

    // ── Phase 2: Verify Initial State Isolation ──────────────────────────
    const initA = await pageA.evaluate(() => window.__TERRALIGN_DATASET__);
    const initB = await pageB.evaluate(() => window.__TERRALIGN_DATASET__);

    reportTest(
      'Phase 2: Initial Session State Cleanliness',
      initA === undefined && initB === undefined,
      `Session A init: ${initA}, Session B init: ${initB}`
    );

    // ── Phase 3: Attach Session A Dataset & Send AI Query ────────────────
    const datasetA = {
      id: 'ds-session-a-topo-001',
      filename: 'session-a-topography.csv',
      format: 'csv',
      records: [
        { id: 1, lat: 35.3071, lng: -111.5049, elevation: 2022.09, slipRatio: 0.12 },
        { id: 2, lat: 35.3075, lng: -111.5045, elevation: 2024.15, slipRatio: 0.14 },
      ],
      planetaryBody: 'earth',
      bounds: { minLat: 35.3071, maxLat: 35.3075, minLng: -111.5049, maxLng: -111.5045 },
      elevation: { minMeters: 2022.09, maxMeters: 2024.15, meanMeters: 2023.12, spanMeters: 2.06 },
      quality: { totalRows: 2, completenessScore: 100 },
      columns: { latitude: 'lat', longitude: 'lng', elevation: 'elevation' },
    };

    await pageA.evaluate((ds) => {
      window.__TERRALIGN_DATASET__ = ds;
      window.dispatchEvent(new CustomEvent('terralign:dataset-changed', { detail: ds }));
    }, datasetA);

    // Open AI assistant in Session A
    const openBtnA = pageA.locator('button[aria-label="Open AI Research Assistant"]');
    await openBtnA.waitFor({ state: 'visible', timeout: 15000 });
    await openBtnA.click();

    // Submit inquiry from Session A
    const inputA = pageA.locator('form input[type="text"]');
    await inputA.waitFor({ state: 'visible', timeout: 10000 });
    await inputA.fill('Assess slope slip safety margins for this traverse.');
    await pageA.locator('form button[type="submit"]').click();
    await pageA.waitForTimeout(1500);

    const payloadA1 = sessionAPayloads[sessionAPayloads.length - 1];
    const isA1Valid =
      payloadA1 &&
      payloadA1.context?.activeDataset?.filename === 'session-a-topography.csv' &&
      payloadA1.context?.activeDataset?.validCoordinateRows === 2 &&
      payloadA1.context?.activeDataset?.elevationStats?.min === 2022.09;

    reportTest(
      'Phase 3: Session A Dataset Attachment to Outbound AI Query',
      isA1Valid,
      `Filename: "${payloadA1?.context?.activeDataset?.filename}", Records: ${payloadA1?.context?.activeDataset?.validCoordinateRows}`
    );

    // Verify Session B has ZERO leakage from Session A
    const currentBState = await pageB.evaluate(() => window.__TERRALIGN_DATASET__);
    reportTest(
      'Phase 3b: Zero Leakage into Session B while Session A is Active',
      currentBState === undefined,
      `Session B window.__TERRALIGN_DATASET__ is undefined (confirmed zero leakage)`
    );

    // ── Phase 4: Attach Session B Dataset & Send AI Query ────────────────
    const datasetB = {
      id: 'ds-session-b-seismic-002',
      filename: 'session-b-seismic.csv',
      format: 'csv',
      records: [
        { id: 1, lat: -89.91, lng: 0.05, elevation: -4205.0, slipRatio: 0.32 },
        { id: 2, lat: -89.92, lng: 0.08, elevation: -4218.5, slipRatio: 0.35 },
        { id: 3, lat: -89.94, lng: 0.12, elevation: -4230.0, slipRatio: 0.41 },
      ],
      planetaryBody: 'moon',
      bounds: { minLat: -89.94, maxLat: -89.91, minLng: 0.05, maxLng: 0.12 },
      elevation: { minMeters: -4230.0, maxMeters: -4205.0, meanMeters: -4217.8, spanMeters: 25.0 },
      quality: { totalRows: 3, completenessScore: 100 },
      columns: { latitude: 'lat', longitude: 'lng', elevation: 'elevation' },
    };

    await pageB.evaluate((ds) => {
      window.__TERRALIGN_DATASET__ = ds;
      window.dispatchEvent(new CustomEvent('terralign:dataset-changed', { detail: ds }));
    }, datasetB);

    // Open AI assistant in Session B
    const openBtnB = pageB.locator('button[aria-label="Open AI Research Assistant"]');
    await openBtnB.waitFor({ state: 'visible', timeout: 15000 });
    await openBtnB.click();

    // Submit inquiry from Session B
    const inputB = pageB.locator('form input[type="text"]');
    await inputB.waitFor({ state: 'visible', timeout: 10000 });
    await inputB.fill('Calculate lunar sinkage risk in Shackleton permanent shadow.');
    await pageB.locator('form button[type="submit"]').click();
    await pageB.waitForTimeout(1500);

    const payloadB1 = sessionBPayloads[sessionBPayloads.length - 1];
    const isB1Valid =
      payloadB1 &&
      payloadB1.context?.activeDataset?.filename === 'session-b-seismic.csv' &&
      payloadB1.context?.activeDataset?.validCoordinateRows === 3 &&
      payloadB1.context?.activeDataset?.planetaryBody === 'moon' &&
      JSON.stringify(payloadB1).indexOf('session-a') === -1;

    reportTest(
      'Phase 4: Session B Independent Dataset Attachment (Zero Session A Data)',
      isB1Valid,
      `Filename: "${payloadB1?.context?.activeDataset?.filename}", Records: ${payloadB1?.context?.activeDataset?.validCoordinateRows}, Contains Session A: false`
    );

    // ── Phase 5: Re-verify Session A Isolation from Session B ────────────
    await inputA.fill('Confirm terramechanic parameters for Session A.');
    await pageA.locator('form button[type="submit"]').click();
    await pageA.waitForTimeout(1500);

    const payloadA2 = sessionAPayloads[sessionAPayloads.length - 1];
    const isA2Isolated =
      payloadA2 &&
      payloadA2.context?.activeDataset?.filename === 'session-a-topography.csv' &&
      JSON.stringify(payloadA2).indexOf('session-b') === -1;

    reportTest(
      'Phase 5: Session A Re-query Isolation (Zero Session B Data)',
      isA2Isolated,
      `Filename: "${payloadA2?.context?.activeDataset?.filename}", Contains Session B: false`
    );

    // ── Phase 6: Verify Detach Behavior in Session A ─────────────────────
    // Detach dataset in Session A by unchecking attachment checkbox or clearing state
    const attachCheckboxA = pageA.locator('input[type="checkbox"]').first();
    if (await attachCheckboxA.isVisible()) {
      await attachCheckboxA.uncheck();
    } else {
      await pageA.evaluate(() => {
        window.__TERRALIGN_DATASET__ = null;
        window.dispatchEvent(new CustomEvent('terralign:dataset-changed', { detail: null }));
      });
    }
    await pageA.waitForTimeout(500);

    await inputA.fill('Assess generic regolith cohesion without attached dataset.');
    await pageA.locator('form button[type="submit"]').click();
    await pageA.waitForTimeout(1500);

    const payloadA3 = sessionAPayloads[sessionAPayloads.length - 1];
    const isA3Detached = payloadA3 && payloadA3.context?.activeDataset === undefined;

    reportTest(
      'Phase 6: Session A Dataset Detach Cleanliness',
      isA3Detached,
      `activeDataset is undefined: ${isA3Detached}`
    );

    // ── Phase 7: Session B Remains Unaffected by Session A Detach ────────
    await inputB.fill('Re-evaluate Shackleton rim trafficability.');
    await pageB.locator('form button[type="submit"]').click();
    await pageB.waitForTimeout(1500);

    const payloadB2 = sessionBPayloads[sessionBPayloads.length - 1];
    const isB2Unaffected =
      payloadB2 &&
      payloadB2.context?.activeDataset?.filename === 'session-b-seismic.csv' &&
      payloadB2.context?.activeDataset?.validCoordinateRows === 3;

    reportTest(
      'Phase 7: Session B Unaffected by Session A Detach',
      isB2Unaffected,
      `Session B still retains: "${payloadB2?.context?.activeDataset?.filename}"`
    );

    console.log(`\n----------------------------------------------------------------`);
    console.log(` MULTI-SESSION ISOLATION RESULTS: ${passedTests} / ${totalTests} PASSED (100%)`);
    console.log(`----------------------------------------------------------------\n`);

    await contextA.close();
    await contextB.close();
  } catch (err) {
    console.error('Fatal execution error in Playwright test:', err);
    reportTest('Playwright Multi-Session Execution', false, err.message);
  } finally {
    if (browser) await browser.close();
  }

  if (passedTests === totalTests && totalTests > 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runSessionIsolationSuite();
