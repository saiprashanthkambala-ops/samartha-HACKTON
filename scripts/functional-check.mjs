/**
 * Functional smoke check in headless Chromium:
 * - no console errors / page errors on main routes
 * - crop-detail tab switching renders different content
 * - diary form validation + demo save works
 * - language switch changes the interface
 * Dev-only; not part of the application bundle.
 */
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

const BASE = process.env.SHOT_BASE || 'http://localhost:5173';
const results = [];
function check(name, ok, extra = '') {
  results.push({ name, ok, extra });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`);
}

const browser = await puppeteer.launch({
  args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1536, height: 1024 });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));

  for (const path of ['/', '/crops', '/crops/onion', '/weather', '/market-prices', '/farmer-diary', '/ai-assistant']) {
    errors.length = 0;
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 800));
    check(`no console errors on ${path}`, errors.length === 0, errors.slice(0, 2).join(' | '));
  }

  // Crop detail tabs switch content
  await page.goto(`${BASE}/crops/onion`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  const tabLabels = await page.$$eval('[role="tab"]', (els) => els.map((e) => e.textContent.trim()));
  check('crop tabs present (5)', tabLabels.length === 5, tabLabels.join(','));
  await page.click('#tab-storage');
  await new Promise((r) => setTimeout(r, 200));
  const storageText = await page.$eval('#panel-storage', (e) => e.textContent);
  check('storage tab shows storage guidance', /ventilation|Ventilation|గాలి/i.test(storageText));
  await page.click('#tab-market');
  await new Promise((r) => setTimeout(r, 500));
  const marketText = await page.$eval('#panel-market', (e) => e.textContent);
  check('market tab shows price for the selected crop', /₹|Not available|అందుబాటు/.test(marketText));

  // Crop-specific data: mango page must NOT show onion stages
  await page.goto(`${BASE}/crops/mango`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  const bodyText = await page.evaluate(() => document.body.innerText);
  check('mango page shows mango identity', bodyText.includes('Mango'));
  check('mango page does not show onion stages', !bodyText.includes('Bulb Formation'));

  // Diary form: empty required fields blocked, then successful demo save
  await page.goto(`${BASE}/farmer-diary`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Add New Entry'))?.click());
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => {
    document.querySelector('#diary-desc').value = '';
    document.querySelector('#diary-desc').dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.evaluate(() => [...document.querySelectorAll('.modal button[type=submit]')][0]?.click());
  await new Promise((r) => setTimeout(r, 200));
  const invalidShown = await page.$eval('.modal', (m) => /required|అవసరం/.test(m.textContent));
  check('diary form validates required fields', invalidShown);
  await page.type('#diary-desc', 'Puppeteer smoke entry');
  await page.select('#diary-crop', 'onion');
  await page.evaluate(() => [...document.querySelectorAll('.modal button[type=submit]')][0]?.click());
  await new Promise((r) => setTimeout(r, 800));
  const diaryBody = await page.evaluate(() => document.body.innerText);
  check('diary entry saved and listed', diaryBody.includes('Puppeteer smoke entry'));
  check('diary save success message shown', /saved|సేవ్/.test(diaryBody));

  // Language switch
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await page.select('.lang-select', 'te');
  await new Promise((r) => setTimeout(r, 400));
  const teBody = await page.evaluate(() => document.body.innerText);
  check('Telugu language switch translates UI', teBody.includes('పంటలు') && teBody.includes('తెలివైన వ్యవసాయం'));
  check('route preserved across language switch', page.url().endsWith('/'));

  // Ask AI flow
  await page.goto(`${BASE}/ai-assistant`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));
  await page.type('.chat-input-row input', 'How do I store onions?');
  await page.evaluate(() => document.querySelector('.chat-input-row button[type=submit]')?.click());
  await new Promise((r) => setTimeout(r, 1200));
  const chatText = await page.evaluate(() => document.body.innerText);
  check('assistant answers and labels demo responses', chatText.includes('Demo response') || chatText.includes('డెమో'));
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
