async function testEarthAPIs() {
  const tests = [
    ['USGS EPQS (longer timeout)', 'https://epqs.nationalmap.gov/v1/json?x=-111.5049&y=35.3071&wkid=4326&units=Meters', 15000],
    ['Open-Elevation (Public DEM)', 'https://api.open-elevation.com/api/v1/lookup?locations=35.3071,-111.5049', 8000],
    ['OpenTopoData (SRTM/ASTER 30m)', 'https://api.opentopodata.org/v1/srtm30m?locations=35.3071,-111.5049', 8000],
    ['OpenTopoData (NED 10m/3DEP)', 'https://api.opentopodata.org/v1/ned10m?locations=35.3071,-111.5049', 8000],
  ];

  for (const [name, url, timeout] of tests) {
    const start = Date.now();
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), timeout);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'TERRALIGN/1.0 (NASA Space Apps Challenge)' }
      });
      clearTimeout(tid);
      const elapsed = Date.now() - start;
      const text = await res.text();
      console.log(`[${name}] HTTP ${res.status} (${elapsed}ms): ${text.slice(0, 150)}`);
    } catch (e) {
      console.log(`[${name}] FAILED (${Date.now() - start}ms): ${e.message}`);
    }
  }
}

testEarthAPIs();
