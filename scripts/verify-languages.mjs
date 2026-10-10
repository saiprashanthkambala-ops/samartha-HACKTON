/**
 * Multi-page language verification: for EACH of the eight languages, load
 * every major page and assert the translated UI strings appear (and that the
 * English originals do NOT appear when the translation differs). This is the
 * "whole interface is that language — no mixture" check.
 *
 * Covers visible text (innerText), input placeholders, aria-labels, and
 * tab-panel content revealed after clicking a tab.
 * Dev-only; not part of the application bundle.
 */
import { mkdirSync } from 'node:fs';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import en from '../src/i18n/dicts/en.js';
import te from '../src/i18n/dicts/te.js';
import hi from '../src/i18n/dicts/hi.js';
import ta from '../src/i18n/dicts/ta.js';
import kn from '../src/i18n/dicts/kn.js';
import ml from '../src/i18n/dicts/ml.js';
import mr from '../src/i18n/dicts/mr.js';
import bn from '../src/i18n/dicts/bn.js';

const DICTS = { en, hi, te, ta, kn, ml, mr, bn };
const BASE = process.env.SHOT_BASE || 'http://localhost:5173';
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });

/** keys checked in body innerText; placeholders in input[placeholder]; aria in any [aria-label] */
const PAGES = [
  {
    path: '/',
    textKeys: ['nav.home', 'home.hero.line1', 'home.hero.desc', 'home.explore.title', 'home.aiCard.title', 'home.quick.crop.title'],
  },
  {
    path: '/crops',
    textKeys: ['nav.crops', 'crops.title', 'crops.subtitle', 'category.all', 'category.vegetable'],
    placeholderKeys: ['crops.search.placeholder'],
  },
  {
    path: '/crops/onion',
    textKeys: ['cropName.onion', 'crop.quickFacts', 'crop.growingSeason', 'crop.growingGuidance', 'crop.tab.overview'],
    // storage panel heading + one tip category appear only after opening the tab
    tabTextKeys: { tabSelector: '#tab-storage', keys: ['crop.storageTab.title', 'tipcat.handling'] },
  },
  {
    path: '/weather',
    textKeys: ['nav.weather', 'weather.title', 'weather.current', 'weather.forecast', 'weather.alerts.title'],
  },
  {
    path: '/market-prices',
    textKeys: ['nav.market', 'market.title'],
    placeholderKeys: ['market.filter.search'],
    ariaKeys: ['market.filter.category'],
  },
  {
    path: '/farmer-diary',
    textKeys: ['nav.diary', 'diary.title', 'diary.summary.total'],
  },
  {
    path: '/ai-assistant',
    textKeys: ['ai.title', 'ai.suggestion.storage'],
    placeholderKeys: ['ai.placeholder'],
  },
];

// Long, distinctive English strings that must NOT leak into translated UI.
const LEAK_KEYS = [
  'home.hero.line1', 'home.hero.line2', 'home.hero.desc', 'home.explore.title',
  'crops.title', 'crops.subtitle', 'weather.title', 'market.title', 'diary.title',
  'ai.title', 'crop.quickFacts', 'crop.growingSeason', 'crop.storageTab.title',
  'nav.home', 'nav.crops', 'nav.weather', 'nav.market', 'nav.diary',
  'home.aiCard.title', 'home.quick.crop.title',
];

let pass = 0;
let fail = 0;
const failures = [];
const check = (name, ok, detail = '') => {
  if (ok) pass++;
  else { fail++; failures.push(`${name} ${detail}`); }
};

const browser = await puppeteer.launch({
  args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1536, height: 1024, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 45000 });

  for (const lang of ['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'bn']) {
    await page.evaluate((l) => localStorage.setItem('farmshield.lang', l), lang);
    const dict = DICTS[lang];
    for (const spec of PAGES) {
      await page.goto(`${BASE}${spec.path}`, { waitUntil: 'networkidle0', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 350));
      const htmlLang = await page.$eval('html', (el) => el.getAttribute('lang'));
      const text = await page.$eval('body', (el) => el.innerText);
      check(`[${lang}] ${spec.path} html lang`, htmlLang === lang, `got ${htmlLang}`);

      for (const key of spec.textKeys ?? []) {
        const want = dict[key];
        check(`[${lang}] ${spec.path} shows "${key}"`, typeof want === 'string' && want.length > 0 && text.includes(want), `want="${want}"`);
      }
      for (const key of spec.placeholderKeys ?? []) {
        const want = dict[key];
        const ph = await page.$$eval('input[placeholder]', (els) => els.map((e) => e.getAttribute('placeholder')));
        check(`[{lang}] ${spec.path} placeholder "${key}"`.replace('{lang}', lang), ph.includes(want), `want="${want}" got=${JSON.stringify(ph)}`);
      }
      for (const key of spec.ariaKeys ?? []) {
        const want = dict[key];
        const found = await page.evaluate(
          (w) => [...document.querySelectorAll('[aria-label]')].some((e) => e.getAttribute('aria-label') === w),
          want,
        );
        check(`[${lang}] ${spec.path} aria-label "${key}"`, found, `want="${want}"`);
      }
      if (spec.tabTextKeys) {
        await page.click(spec.tabTextKeys.tabSelector);
        await new Promise((r) => setTimeout(r, 250));
        const tabText = await page.$eval('body', (el) => el.innerText);
        for (const key of spec.tabTextKeys.keys) {
          const want = dict[key];
          check(`[${lang}] ${spec.path} tab shows "${key}"`, tabText.includes(want), `want="${want}"`);
        }
      }

      if (lang !== 'en') {
        const leaked = LEAK_KEYS.filter((k) => {
          const enVal = en[k];
          const locVal = dict[k];
          return enVal && locVal && enVal !== locVal && text.includes(enVal);
        });
        check(`[${lang}] ${spec.path} no English leakage`, leaked.length === 0, leaked.join(','));
      }
    }
  }
} finally {
  await browser.close();
}

console.log(`\n${pass}/${pass + fail} language-page checks passed`);
if (fail) {
  console.log('failures (first 20):');
  for (const f of failures.slice(0, 20)) console.log(' -', f);
}
process.exit(fail ? 1 : 0);