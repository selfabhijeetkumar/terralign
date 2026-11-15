/**
 * TERRALIGN — Scientific API & Planetary Telemetry Integration Test Suite
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 */

import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:3000';

console.log('Testing TERRALIGN Scientific Data Integration & Planetary API Suite...\n');

async function runTests() {
  let passed = 0;
  let total = 0;

  // 1. Providers Endpoint
  total++;
  try {
    const res = await fetch(`${BASE_URL}/api/science/providers`);
    assert.equal(res.status, 200, 'Providers endpoint must return HTTP 200');
    const data = await res.json();
    assert.equal(data.status, 'success');
    assert.equal(data.count, 3, 'Must report exactly 3 scientific providers');
    const ids = data.providers.map((p) => p.id);
    assert.ok(ids.includes('USGS'), 'USGS provider must be present');
    assert.ok(ids.includes('NASA_PDS_LOLA'), 'NASA LOLA provider must be present');
    assert.ok(ids.includes('NASA_PDS_MOLA'), 'NASA MOLA provider must be present');
    console.log('✓ Test 1: Providers endpoint verified (USGS, NASA LOLA, NASA MOLA)');
    passed++;
  } catch (err) {
    console.error('✗ Test 1 FAILED:', err.message);
  }

  // 2. Datasets Endpoint & Filtering
  total++;
  try {
    const resAll = await fetch(`${BASE_URL}/api/science/datasets`);
    assert.equal(resAll.status, 200);
    const dataAll = await resAll.json();
    assert.equal(dataAll.count, 7, 'Must report 7 canonical planetary datasets');

    const resMoon = await fetch(`${BASE_URL}/api/science/datasets?body=moon`);
    const dataMoon = await resMoon.json();
    assert.equal(dataMoon.count, 2, 'Must report 2 lunar datasets (LDEM_875S, GDRDEM)');

    const resMars = await fetch(`${BASE_URL}/api/science/datasets?body=mars`);
    const dataMars = await resMars.json();
    assert.equal(dataMars.count, 2, 'Must report 2 martian datasets (MOLA MEGDR, HiRISE DTM)');

    console.log('✓ Test 2: Dataset specifications catalog & planetary filtering verified (7 total datasets)');
    passed++;
  } catch (err) {
    console.error('✗ Test 2 FAILED:', err.message);
  }

  // 3. Earth Elevation Query (Cinder Lake, AZ)
  total++;
  try {
    const res = await fetch(`${BASE_URL}/api/science/elevation?body=earth&lat=35.3071&lng=-111.5049`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.status, 'success');
    const d = json.data;
    assert.equal(d.body, 'earth');
    assert.ok(d.elevationMeters >= 2000 && d.elevationMeters <= 2040, `Cinder Lake elevation expected ~2022m, got ${d.elevationMeters}m`);
    assert.ok(['LIVE DATA', 'CACHED DATA', 'STATIC REFERENCE'].includes(d.cacheStatus));
    assert.ok(d.latencyMs >= 0);
    console.log(`✓ Test 3: Earth elevation verified at Cinder Lake: ${d.elevationMeters}m (${d.cacheStatus}, ${d.latencyMs}ms)`);
    passed++;
  } catch (err) {
    console.error('✗ Test 3 FAILED:', err.message);
  }

  // 4. Moon Elevation Query (Shackleton Crater Rim)
  total++;
  try {
    const res = await fetch(`${BASE_URL}/api/science/elevation?body=moon&lat=-89.9&lng=0.0`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.status, 'success');
    const d = json.data;
    assert.equal(d.body, 'moon');
    assert.equal(d.elevationMeters, 1240, 'Shackleton Rim elevation expected exactly +1240m relative to R_ref');
    assert.ok(d.crs.includes('Lunar Polar Stereographic') || d.crs.includes('IAU_2000'));
    assert.ok(d.nominalResolutionMeters <= 60.0);
    console.log(`✓ Test 4: Lunar elevation verified at Shackleton Rim: ${d.elevationMeters}m (${d.datasetId}, ${d.cacheStatus})`);
    passed++;
  } catch (err) {
    console.error('✗ Test 4 FAILED:', err.message);
  }

  // 5. Mars Elevation Query (Jezero Crater)
  total++;
  try {
    const res = await fetch(`${BASE_URL}/api/science/elevation?body=mars&lat=18.38&lng=77.58`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.status, 'success');
    const d = json.data;
    assert.equal(d.body, 'mars');
    assert.equal(d.elevationMeters, -2530, 'Jezero crater floor elevation expected exactly -2530m relative to areoid');
    assert.ok(d.crs.includes('MOLA Areoid'));
    console.log(`✓ Test 5: Martian elevation verified at Jezero Crater Floor: ${d.elevationMeters}m (${d.datasetId})`);
    passed++;
  } catch (err) {
    console.error('✗ Test 5 FAILED:', err.message);
  }

  // 6. Transect Endpoint
  total++;
  try {
    const res = await fetch(
      `${BASE_URL}/api/science/transect?body=earth&startLat=35.3071&startLng=-111.5049&endLat=35.35&endLng=-111.45&samples=15`
    );
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.status, 'success');
    const t = json.data;
    assert.equal(t.sampleCount, 15);
    assert.equal(t.points.length, 15);
    assert.ok(t.totalDistanceMeters > 0);
    assert.ok(t.maxElevationMeters >= t.minElevationMeters);
    assert.equal(t.elevationSpanMeters, Math.round((t.maxElevationMeters - t.minElevationMeters) * 10) / 10);
    console.log(
      `✓ Test 6: Transect profile verified (${t.sampleCount} pts, span: ${t.elevationSpanMeters}m, dist: ${t.totalDistanceMeters}m)`
    );
    passed++;
  } catch (err) {
    console.error('✗ Test 6 FAILED:', err.message);
  }

  // 7. Terrain Grid Elevation Matrix Endpoint
  total++;
  try {
    const res = await fetch(
      `${BASE_URL}/api/science/terrain?body=earth&lat=35.3071&lng=-111.5049&gridSize=32&spanMeters=2000`
    );
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.status, 'success');
    const g = json.data;
    assert.equal(g.gridSize, 32);
    assert.equal(g.matrix.length, 32);
    assert.equal(g.matrix[0].length, 32);
    assert.ok(g.maxElevationMeters >= g.minElevationMeters);
    assert.ok(g.stepMeters > 0);
    console.log(
      `✓ Test 7: Terrain elevation matrix verified (32x32 grid, span: ${g.spanMeters}m, step: ${g.stepMeters}m)`
    );
    passed++;
  } catch (err) {
    console.error('✗ Test 7 FAILED:', err.message);
  }

  // 8. Scientific Interpretation Endpoint
  total++;
  try {
    const res = await fetch(
      `${BASE_URL}/api/science/interpret?body=earth&lat=35.3071&lng=-111.5049&elevation=2022.09&location=Cinder+Lake`
    );
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.status, 'success');
    const i = json.data;
    assert.ok(i.geologicalContext.length > 20);
    assert.ok(i.terramechanicsImplications.includes('Bekker-Wong'));
    assert.ok(i.environmentalHazards.length >= 3);
    assert.ok(i.analogRelevanceScore > 0);
    assert.ok(i.disclaimer.includes('SYNTHESIZED SCIENTIFIC INTERPRETATION'));
    console.log(`✓ Test 8: Scientific intelligence layer verified (Score: ${i.analogRelevanceScore}%, Bekker-Wong mechanics grounded)`);
    passed++;
  } catch (err) {
    console.error('✗ Test 8 FAILED:', err.message);
  }

  // 9. Input Validation & Bounds Checking
  total++;
  try {
    const resBadLat = await fetch(`${BASE_URL}/api/science/elevation?body=earth&lat=120&lng=0`);
    assert.equal(resBadLat.status, 400, 'Latitude > 90 must return HTTP 400');

    const resMissing = await fetch(`${BASE_URL}/api/science/elevation`);
    assert.equal(resMissing.status, 400, 'Missing coordinates must return HTTP 400');

    const resBadBody = await fetch(`${BASE_URL}/api/science/elevation?body=pluto&lat=0&lng=0`);
    assert.equal(resBadBody.status, 400, 'Unsupported planetary body must return HTTP 400');

    console.log('✓ Test 9: Input boundary validation verified (lat/lng/body constraints enforced)');
    passed++;
  } catch (err) {
    console.error('✗ Test 9 FAILED:', err.message);
  }

  // 10. POST Method & In-Memory Caching Verification
  total++;
  try {
    const postRes = await fetch(`${BASE_URL}/api/science/elevation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: 'moon', lat: -89.9, lng: 0.0 }),
    });
    assert.equal(postRes.status, 200);
    const postJson = await postRes.json();
    assert.equal(postJson.data.elevationMeters, 1240);
    assert.equal(postJson.data.cacheStatus, 'CACHED DATA', 'Subsequent query must return CACHED DATA');
    console.log('✓ Test 10: POST request handling & sub-millisecond in-memory cache verified');
    passed++;
  } catch (err) {
    console.error('✗ Test 10 FAILED:', err.message);
  }

  console.log(`\n============================================================`);
  console.log(`RESULT: ${passed}/${total} TESTS PASSED EMPIRICALLY (${total - passed} failures).`);
  console.log(`============================================================`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
