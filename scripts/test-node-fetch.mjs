const endpoints = [
  ['USGS EPQS v1', 'https://epqs.nationalmap.gov/v1/json?x=-111.5049&y=35.3071&wkid=4326&units=Meters'],
  ['USGS 3DEP ImageServer', 'https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/identify?geometry=%7B%22x%22%3A-111.5049%2C%22y%22%3A35.3071%7D&geometryType=esriGeometryPoint&returnGeometry=false&f=json'],
  ['Open-Elevation', 'https://api.open-elevation.com/api/v1/lookup?locations=35.3071,-111.5049'],
  ['NASA PDS ODE Moon Product', 'https://oderest.rsl.wustl.edu/live2/?target=moon&query=product&ptype=LDEM&maxresults=1&output=JSON'],
  ['NASA PDS ODE Mars Product', 'https://oderest.rsl.wustl.edu/live2/?target=mars&query=product&ptype=MEGDR&maxresults=1&output=JSON'],
];

async function run() {
  for (const [name, url] of endpoints) {
    process.stdout.write(`Testing [${name}] ... `);
    const start = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'TERRALIGN/1.0 (NASA Space Apps Challenge; Scientific Research Prototype)' }
      });
      clearTimeout(timeoutId);
      const elapsed = Date.now() - start;
      const text = await res.text();
      console.log(`HTTP ${res.status} (${elapsed}ms) - ${text.length} bytes`);
      console.log(`   Sample: ${text.slice(0, 160)}...`);
    } catch (err) {
      const elapsed = Date.now() - start;
      console.log(`FAILED (${elapsed}ms): ${err.message}`);
    }
  }
}

run();
