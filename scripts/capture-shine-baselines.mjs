import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUT_DIR = path.resolve('docs/design/screenshots/baseline-shine');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Landing Page
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '01-home.png') });
  console.log('Captured 01-home.png');

  // 2. Mission Command
  await page.goto('http://localhost:3000/mission', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '02-mission.png') });
  console.log('Captured 02-mission.png');

  // 3. Terrain Studio
  await page.goto('http://localhost:3000/terrain', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '03-terrain.png') });
  console.log('Captured 03-terrain.png');

  // 4. Reality Gap
  await page.goto('http://localhost:3000/reality-gap', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '04-reality-gap.png') });
  console.log('Captured 04-reality-gap.png');

  // 5. Portfolio
  await page.goto('http://localhost:3000/portfolio', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '05-portfolio.png') });
  console.log('Captured 05-portfolio.png');

  // 6. Datasets
  await page.goto('http://localhost:3000/datasets', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '06-datasets.png') });
  console.log('Captured 06-datasets.png');

  // 7. Live Data Lab - Tab 1 (Elevation - Earth)
  await page.goto('http://localhost:3000/live-data', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '07-live-data-elevation-earth.png') });
  console.log('Captured 07-live-data-elevation-earth.png');

  // 8. Live Data Lab - Moon
  const moonBtn = page.locator('button:has-text("MOON")');
  if (await moonBtn.count() > 0) {
    await moonBtn.first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT_DIR, '08-live-data-moon.png') });
    console.log('Captured 08-live-data-moon.png');
  }

  // 9. Live Data Lab - Mars
  const marsBtn = page.locator('button:has-text("MARS")');
  if (await marsBtn.count() > 0) {
    await marsBtn.first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT_DIR, '09-live-data-mars.png') });
    console.log('Captured 09-live-data-mars.png');
  }

  // 10. Live Data Lab - Transect Tab
  const transectTab = page.locator('button:has-text("Elevation Transect")');
  if (await transectTab.count() > 0) {
    await transectTab.first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT_DIR, '10-live-data-transect.png') });
    console.log('Captured 10-live-data-transect.png');
  }

  // 11. Live Data Lab - Dataset Catalog Tab
  const catalogTab = page.locator('button:has-text("Dataset Catalog")');
  if (await catalogTab.count() > 0) {
    await catalogTab.first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT_DIR, '11-live-data-catalog.png') });
    console.log('Captured 11-live-data-catalog.png');
  }

  // 12. Live Data Lab - Provider Health Tab
  const healthTab = page.locator('button:has-text("Provider Health")');
  if (await healthTab.count() > 0) {
    await healthTab.first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT_DIR, '12-live-data-health.png') });
    console.log('Captured 12-live-data-health.png');
  }

  // 13. AI Assistant Open HUD
  await page.goto('http://localhost:3000/mission', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(1000);
  const aiPill = page.locator('button:has-text("AI INTEL")');
  if (await aiPill.count() > 0) {
    await aiPill.first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, '13-ai-assistant-hud.png') });
    console.log('Captured 13-ai-assistant-hud.png');
  }

  await browser.close();
  console.log('All baseline screenshots captured successfully.');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
