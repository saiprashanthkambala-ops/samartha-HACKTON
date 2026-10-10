/**
 * Visual regression helper — screenshots each FarmShield page at the
 * reference desktop viewport (1536x1024) for comparison against the design.
 * Dev-only; not part of the application bundle.
 */
import { mkdirSync } from 'node:fs';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

const BASE = process.env.SHOT_BASE || 'http://localhost:5173';
const OUT = 'screenshots';

const PAGES = [
  ['home', '/'],
  ['crops', '/crops'],
  ['crop-details-onion', '/crops/onion'],
  ['crop-details-mango', '/crops/mango'],
  ['weather', '/weather'],
  ['market-prices', '/market-prices'],
  ['farmer-diary', '/farmer-diary'],
  ['ai-assistant', '/ai-assistant'],
];

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1536, height: 1024, deviceScaleFactor: 1 });

  for (const [name, path] of PAGES) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0', timeout: 45000 });
    // Allow demo async data (400ms adapters) to settle.
    await new Promise((r) => setTimeout(r, 900));
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
    console.log('captured', name);
  }

  // Mobile home (responsive check)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: `${OUT}/home-mobile.png`, fullPage: true });
  console.log('captured home-mobile');

  // Telugu home (language check)
  await page.setViewport({ width: 1536, height: 1024, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => localStorage.setItem('farmshield.lang', 'te'));
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: `${OUT}/home-telugu.png`, fullPage: true });
  console.log('captured home-telugu');
} finally {
  await browser.close();
}
console.log('done');
