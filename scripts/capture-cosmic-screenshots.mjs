import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUT_DIR = path.resolve('docs/design/screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const routes = ['/', '/mission', '/terrain', '/portfolio', '/reality-gap', '/live-data', '/datasets'];

  // 1. Desktop 1440x900
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const r of routes) {
    const routeSlug = r === '/' ? 'home' : r.replace('/', '');
    await page.goto('http://localhost:3000' + r, { waitUntil: 'networkidle', timeout: 25000 });
    await page.waitForTimeout(600); // Allow cosmos canvas to render

    // Scroll 0%
    await page.screenshot({ path: path.join(OUT_DIR, `cosmic-${routeSlug}-1440-scroll0.png`) });

    // Scroll 50%
    await page.evaluate(() => {
      const el = document.getElementById('main-content') || window;
      if (el.scrollTo) {
        el.scrollTo(0, (document.body.scrollHeight || 1000) * 0.5);
      }
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT_DIR, `cosmic-${routeSlug}-1440-scroll50.png`) });

    // Scroll 100%
    await page.evaluate(() => {
      const el = document.getElementById('main-content') || window;
      if (el.scrollTo) {
        el.scrollTo(0, (document.body.scrollHeight || 1000));
      }
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT_DIR, `cosmic-${routeSlug}-1440-scroll100.png`) });
    console.log(`Captured 1440x900 screenshots for ${r}`);
  }

  // 2. Tablet 1024x768 (Key routes)
  await page.setViewportSize({ width: 1024, height: 768 });
  for (const r of ['/', '/mission', '/portfolio']) {
    const routeSlug = r === '/' ? 'home' : r.replace('/', '');
    await page.goto('http://localhost:3000' + r, { waitUntil: 'networkidle', timeout: 25000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, `cosmic-${routeSlug}-1024.png`) });
    console.log(`Captured 1024x768 screenshot for ${r}`);
  }

  // 3. Mobile 390x844
  await page.setViewportSize({ width: 390, height: 844 });
  for (const r of ['/', '/mission', '/live-data']) {
    const routeSlug = r === '/' ? 'home' : r.replace('/', '');
    await page.goto('http://localhost:3000' + r, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT_DIR, `cosmic-${routeSlug}-390.png`) });
    console.log(`Captured 390x844 screenshot for ${r}`);
  }

  // 4. Capture Dragon Cursor in action on Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/mission', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(600);
  await page.mouse.move(200, 200);
  await page.waitForTimeout(100);
  await page.mouse.move(600, 450);
  await page.waitForTimeout(150);
  await page.mouse.move(800, 350);
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(OUT_DIR, 'cosmic-dragon-cursor-active.png') });
  console.log('Captured dragon cursor screenshot');

  await browser.close();
  console.log('All screenshots captured successfully.');
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
