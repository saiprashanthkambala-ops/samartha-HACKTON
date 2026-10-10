/**
 * Browser verification for the three audit fixes:
 *  1. every crop image loads (naturalWidth > 0) on the catalogue and details pages
 *  2. farmer carousel behaviour (dots, auto-rotate, keyboard)
 *  3. all eight languages render translated UI and persist
 * Dev-only; not part of the application bundle.
 */
import { mkdirSync } from 'node:fs';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { crops } from '../src/data/crops.js';

const BASE = process.env.SHOT_BASE || 'http://localhost:5173';
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });

let pass = 0;
let fail = 0;
const check = (name, ok, detail = '') => {
  if (ok) { pass++; console.log('PASS ', name); }
  else { fail++; console.log('FAIL ', name, detail); }
};

const browser = await puppeteer.launch({
  args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1536, height: 1024, deviceScaleFactor: 1 });

  /* ---------- 1. crop images ---------- */
  await page.goto(`${BASE}/crops`, { waitUntil: 'networkidle0', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 900));
  const catalogueImgs = await page.$$eval('.crop-grid img', (imgs) =>
    imgs.map((i) => ({ src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0 })),
  );
  check(
    `catalogue images all load (${catalogueImgs.length} shown)`,
    catalogueImgs.length > 0 && catalogueImgs.every((i) => i.ok),
    JSON.stringify(catalogueImgs.filter((i) => !i.ok)),
  );
  await page.screenshot({ path: `${OUT}/verify-crops-page.png`, fullPage: true });

  let brokenDetails = [];
  for (const c of crops) {
    await page.goto(`${BASE}/crops/${c.id}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 250));
    const ok = await page.$eval('.crop-identity img', (i) => i.complete && i.naturalWidth > 0).catch(() => false);
    if (!ok) brokenDetails.push(c.id);
  }
  check(`all ${crops.length} crop detail hero images load`, brokenDetails.length === 0, brokenDetails.join(','));

  // sample detail screenshots (named crops from the audit)
  for (const id of ['drumstick', 'cluster-beans', 'ginger']) {
    await page.goto(`${BASE}/crops/${id}`, { waitUntil: 'networkidle0', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: `${OUT}/verify-crop-${id}.png`, fullPage: false });
  }

  /* ---------- 2. farmer carousel ---------- */
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 600));
  const dots = await page.$$('.farmer-dot');
  check('carousel shows 8 dots', dots.length === 8, `got ${dots.length}`);

  const carouselImgs = await page.$$eval('.farmer-photo', (imgs) =>
    imgs.map((i) => ({ src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0 })),
  );
  check(
    'all 8 farmer photos load',
    carouselImgs.length === 8 && carouselImgs.every((i) => i.ok),
    JSON.stringify(carouselImgs.filter((i) => !i.ok)),
  );

  const activeSrc = () =>
    page.$eval('.farmer-photo.is-active', (i) => i.getAttribute('src'));
  const first = await activeSrc();
  await new Promise((r) => setTimeout(r, 5400)); // just over one 5s interval
  const second = await activeSrc();
  check('carousel auto-rotates after 5s', first !== second, `${first} -> ${second}`);

  // pause on hover
  await page.hover('.farmer-carousel');
  const hovered = await activeSrc();
  await new Promise((r) => setTimeout(r, 5400));
  const still = await activeSrc();
  check('carousel pauses on hover', hovered === still);

  // keyboard nav
  await page.mouse.move(10, 10);
  await page.$eval('.farmer-carousel', (el) => el.focus?.());
  await page.keyboard.press('ArrowRight');
  const afterKey = await activeSrc();
  check('carousel responds to ArrowRight', afterKey !== still);
  await page.screenshot({ path: `${OUT}/verify-carousel.png` });

  // click a dot -> label updates
  const labelBefore = await page.$eval('.farmer-region', (el) => el.textContent);
  await page.$$eval('.farmer-dot', (els) => els[5].click());
  await new Promise((r) => setTimeout(r, 300));
  const labelAfter = await page.$eval('.farmer-region', (el) => el.textContent);
  check('dot click updates label', labelBefore !== labelAfter, `${labelBefore} -> ${labelAfter}`);

  /* ---------- 3. eight languages ---------- */
  const expected = {
    en: 'Home', hi: 'होम', te: 'హోమ్', ta: 'முகப்பு', kn: 'ಮುಖಪುಟ', ml: 'ഹോം', mr: 'मुख्यपृष्ठ', bn: 'হোম',
  };
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 45000 });
  for (const lang of ['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'bn']) {
    await page.evaluate((l) => localStorage.setItem('farmshield.lang', l), lang);
    await page.reload({ waitUntil: 'networkidle0', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 500));
    const htmlLang = await page.$eval('html', (el) => el.getAttribute('lang'));
    const navHome = await page.$eval('.main-nav a', (el) => el.textContent.trim());
    check(`[${lang}] html lang + nav translated`, htmlLang === lang, `html=${htmlLang} nav=${navHome}`);
    await page.screenshot({ path: `${OUT}/verify-lang-${lang}.png`, fullPage: false });
  }
  // restore-after-refresh: set kn in-page, reload, confirm persisted
  await page.evaluate(() => localStorage.setItem('farmshield.lang', 'kn'));
  await page.reload({ waitUntil: 'networkidle0' });
  const restored = await page.$eval('html', (el) => el.getAttribute('lang'));
  check('language preference restores after refresh', restored === 'kn', `html=${restored}`);
} finally {
  await browser.close();
}

console.log(`\n${pass}/${pass + fail} verification checks passed`);
process.exit(fail ? 1 : 0);