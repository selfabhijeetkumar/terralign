import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUT_DIR = path.resolve('docs/design/screenshots/post-shine');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function verify() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const routes = [
    { url: '/', name: '01-home' },
    { url: '/mission', name: '02-mission' },
    { url: '/terrain', name: '03-terrain' },
    { url: '/reality-gap', name: '04-reality-gap' },
    { url: '/portfolio', name: '05-portfolio' },
    { url: '/datasets', name: '06-datasets' },
    { url: '/live-data', name: '07-live-data-elevation-earth' },
  ];

  let totalErrors = 0;
  const consoleMessages = [];

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', (msg) => {
    const text = msg.text();
    const url = msg.location() ? msg.location().url : '';
    if (
      msg.type() === 'error' &&
      !text.includes('favicon.ico') &&
      !url.includes('favicon.ico') &&
      !text.includes('hydrated') &&
      !text.includes('hydration')
    ) {
      console.error(`[BROWSER ERROR] [${url}] ${text}`);
      consoleMessages.push(text);
      totalErrors++;
    }
  });

  page.on('pageerror', (err) => {
    console.error(`[PAGE UNCAUGHT ERROR] ${err.message}`);
    totalErrors++;
  });

  console.log('====================================================');
  console.log('STAGE 1: VERIFYING CARD SHINE COMPUTED PROPERTIES');
  console.log('====================================================');

  for (const r of routes) {
    await page.goto('http://localhost:3000' + r.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1000);

    const check = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.shine-card'));
      return cards.map((c, idx) => {
        const after = window.getComputedStyle(c, '::after');
        const style = window.getComputedStyle(c);
        return {
          idx,
          tagName: c.tagName,
          isolation: style.isolation,
          overflow: style.overflow,
          overflowX: style.overflowX,
          overflowY: style.overflowY,
          animationName: after.animationName,
          zIndex: after.zIndex,
          pointerEvents: after.pointerEvents,
          background: after.backgroundImage || after.background,
        };
      });
    });

    console.log(`Route ${r.url}: Found ${check.length} .shine-card element(s)`);
    const valid = check.every(
      (c) =>
        c.isolation === 'isolate' &&
        c.animationName === 'card-shine' &&
        c.zIndex === '-1' &&
        c.pointerEvents === 'none'
    );
    console.log(`  All cards conform to spec: ${valid}`);
    if (!valid) {
      console.error('  Failed card styles:', check.filter(c => c.animationName !== 'card-shine' || c.isolation !== 'isolate'));
      totalErrors++;
    }

    // Capture post-implementation screenshot
    await page.screenshot({ path: path.join(OUT_DIR, `${r.name}.png`) });
  }

  // Check additional tabs on Live Data
  await page.goto('http://localhost:3000/live-data', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1000);

  // Transect Tab
  const transectBtn = page.locator('button:has-text("Elevation Transect")');
  if (await transectBtn.count() > 0) {
    await transectBtn.first().click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT_DIR, '10-live-data-transect.png') });
  }

  // Catalog Tab
  const catalogBtn = page.locator('button:has-text("Dataset Catalog")');
  if (await catalogBtn.count() > 0) {
    await catalogBtn.first().click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT_DIR, '11-live-data-catalog.png') });
  }

  // Health Tab
  const healthBtn = page.locator('button:has-text("Provider Health")');
  if (await healthBtn.count() > 0) {
    await healthBtn.first().click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT_DIR, '12-live-data-health.png') });
  }

  // AI Assistant HUD
  await page.goto('http://localhost:3000/mission', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1000);
  const aiPill = page.locator('button:has-text("AI INTEL")');
  if (await aiPill.count() > 0) {
    await aiPill.first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, '13-ai-assistant-hud.png') });
  }

  console.log('====================================================');
  console.log('STAGE 2: TESTING REDUCED-MOTION BEHAVIOR');
  console.log('====================================================');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(800);

  const reducedMotionCheck = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.shine-card'));
    return cards.map((c) => {
      const after = window.getComputedStyle(c, '::after');
      return {
        animationName: after.animationName,
        opacity: after.opacity,
      };
    });
  });

  const reducedMotionPass = reducedMotionCheck.every(
    (c) => c.animationName === 'none' && (c.opacity === '0' || c.opacity === '')
  );
  console.log(`Reduced motion suppressed shine: ${reducedMotionPass} (Count: ${reducedMotionCheck.length})`);
  if (!reducedMotionPass) {
    console.error('Reduced motion check failed:', reducedMotionCheck);
    totalErrors++;
  }

  await browser.close();

  console.log('====================================================');
  console.log(`SHINE SWEEP VERIFICATION VERDICT: ${totalErrors === 0 ? 'PASS (0 ERRORS)' : 'FAIL (' + totalErrors + ' ERRORS)'}`);
  console.log('====================================================');
  if (totalErrors > 0) process.exit(1);
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
