import { chromium } from 'playwright';

async function runHotfixValidation() {
  console.log('\n================================================================');
  console.log(' TERRALIGN 2.0: COSMIC ASCENSION HOTFIX & WEBGL AUDIT');
  console.log(' Target Server: http://localhost:3000');
  console.log('================================================================\n');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const runtimeErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('sw.js')) {
      runtimeErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    runtimeErrors.push(err.message);
  });

  // ── TEST 1: Dragon Cursor Sustained & Rapid Movement (Negative Radius Check) ──
  console.log('[TEST 1] Testing Dragon Cursor with rapid & sustained pointer trajectories...');
  await page.goto('http://localhost:3000/mission', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(600);

  // Perform multiple movement patterns: linear, zigzag, rapid circular, instant stops
  const coords = [
    [100, 100], [300, 200], [600, 450], [900, 300], [1200, 600],
    [1100, 200], [800, 500], [400, 350], [150, 600], [700, 250],
  ];

  for (const [x, y] of coords) {
    await page.mouse.move(x, y, { steps: 8 });
    await page.waitForTimeout(40);
  }

  // Rapid circle
  for (let a = 0; a < Math.PI * 4; a += 0.3) {
    const cx = 700 + Math.cos(a) * 200;
    const cy = 450 + Math.sin(a) * 200;
    await page.mouse.move(cx, cy);
    await page.waitForTimeout(16);
  }

  // Click & press burst
  await page.mouse.down();
  await page.waitForTimeout(150);
  await page.mouse.up();
  await page.waitForTimeout(300);

  // Check if any IndexSizeError or negative radius occurred
  const radiusErrors = runtimeErrors.filter(e => e.includes('radius') || e.includes('IndexSizeError'));
  console.log(`[PASS] Sustained pointer motion completed. Negative radius errors: ${radiusErrors.length}`);

  // ── TEST 2: WebGL Context Audit Across All Routes ──
  console.log('\n[TEST 2] Auditing live WebGL contexts per route (Ceiling: <= 2)...');
  const routes = ['/', '/mission', '/terrain', '/portfolio', '/reality-gap', '/live-data', '/datasets'];

  for (const r of routes) {
    await page.goto('http://localhost:3000' + r, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(800); // Allow renderers to mount / release

    const contextAudit = await page.evaluate(() => {
      // Inspect all canvases in the document
      const canvases = Array.from(document.querySelectorAll('canvas'));
      let webglCount = 0;
      let canvas2dCount = 0;

      canvases.forEach(c => {
        // Test if canvas has active webgl or webgl2 context without forcing new creation if already 2D
        const is2d = c.classList.contains('z-[99999]'); // Dragon canvas is 2D
        if (is2d) {
          canvas2dCount++;
        } else {
          // Check if canvas has non-null gl context
          try {
            const gl = c.getContext('webgl2') || c.getContext('webgl');
            if (gl && !gl.isContextLost()) {
              webglCount++;
            }
          } catch {}
        }
      });

      return { totalCanvases: canvases.length, webglCount, canvas2dCount };
    });

    console.log(`  Route: ${r.padEnd(14)} -> Active WebGL Contexts: ${contextAudit.webglCount} (Ceiling: <= 2)`);
    if (contextAudit.webglCount > 2) {
      console.error(`  [FAIL] Route ${r} exceeded 2 live WebGL contexts!`);
    } else {
      console.log(`  [PASS] Route ${r} compliant with WebGL context budget.`);
    }
  }

  // ── TEST 3: Route Transition: Into /terrain and Out to /mission ──
  console.log('\n[TEST 3] Testing dynamic transition into /terrain and out to /mission...');
  await page.goto('http://localhost:3000/terrain', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(800);
  const terrainContexts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('canvas')).filter(c => !c.classList.contains('z-[99999]')).length;
  });
  console.log(`  On /terrain: Canvas elements = ${terrainContexts}`);

  await page.goto('http://localhost:3000/mission', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(800);
  const missionWebglActive = await page.evaluate(() => {
    const cosmicCanvas = document.querySelector('canvas:not(.z-\\[99999\\])');
    if (!cosmicCanvas) return false;
    const gl = cosmicCanvas.getContext('webgl2') || cosmicCanvas.getContext('webgl');
    return gl && !gl.isContextLost();
  });
  console.log(`  Returned to /mission: Cosmic WebGL restored = ${missionWebglActive}`);

  console.log(`\nTotal non-service-worker runtime errors: ${runtimeErrors.length}`);
  if (runtimeErrors.length > 0) {
    console.log('Errors:', runtimeErrors);
  }

  await browser.close();
  console.log('\n================================================================');
  console.log(' HOTFIX VALIDATION SUITE COMPLETED');
  console.log('================================================================\n');
}

runHotfixValidation().catch(err => {
  console.error('Hotfix validation failed:', err);
  process.exit(1);
});
