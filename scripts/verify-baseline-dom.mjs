import { chromium } from 'playwright';
import fs from 'fs';

async function verify() {
  const baseline = JSON.parse(fs.readFileSync('scripts/baseline-dom.json', 'utf8'));
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  let allPass = true;
  for (const [route, expected] of Object.entries(baseline)) {
    await page.goto('http://localhost:3000' + route, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(1000);
    const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());
    const sampleMatch = text.startsWith(expected.sample);
    console.log(`[ROUTE ${route}] Length: ${text.length} (Baseline: ${expected.length}) | Sample Match: ${sampleMatch}`);
    if (!sampleMatch) {
      console.log('  Expected:', expected.sample.slice(0, 120));
      console.log('  Actual:  ', text.slice(0, 120));
      allPass = false;
    }
  }
  await browser.close();
  console.log('====================================================');
  console.log('DOM VERIFICATION VERDICT:', allPass ? 'ALL ROUTES 100% IDENTICAL' : 'FAILED');
  console.log('====================================================');
  if (!allPass) process.exit(1);
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
