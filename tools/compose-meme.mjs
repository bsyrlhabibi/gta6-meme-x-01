// compose-meme.mjs — renders meme.png (1080x1350, portrait 4:5) from art.png.
//
// The base art (art.png, an AI-generated illustration made for this entry)
// shows Dr. Ghost — the make.fun ghost in a stethoscope and head mirror —
// holding up a large blank prescription note. This compositor typesets the
// note in a headless-Chromium page: a black hook bar on top, the full
// prescription (clinic header, patient, diagnosis, Rx, signature) set in
// dark type inside the paper, and a black payoff bar at the bottom. The
// generated art itself carries no text at all; every letter is rendered here.
//
// Paper geometry: in art.png (1408x1760) the blank paper spans
// x 117..1278, y 167..1022 (measured). The art is shown cover-fit in the
// 1080x1114 region between the bars at object-position 50% 8%, which maps
// the paper to roughly x 90..980, y 227..883 of the final image; the note
// box below is inset from that.
//
//   node tools/compose-meme.mjs
//
// Needs puppeteer (resolved from this environment) and a Chromium build.

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { existsSync, readdirSync } from 'node:fs';

const TOOLS_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(TOOLS_DIR, '..');
const ART = join(ROOT, 'art.png');
const OUT = join(ROOT, 'meme.png');
const FONT = join(TOOLS_DIR, 'Anton-Regular.ttf');

const W = 1080;
const H = 1350;
const TOP_BAR = 118;
const BOT_BAR = 118;
const GOLD = '#ffc400';
const INK = '#1c2430';
const RED = '#c93325';

// Note text box in final-image coordinates (inside the paper, see header).
const NOTE = { left: 122, top: 243, width: 826, height: 618 };

async function loadPuppeteer() {
  try {
    return (await import('puppeteer')).default;
  } catch { /* fall through */ }
  const candidates = [
    join(homedir(), 'workspace/makefun/best-game/tools'),
    '/usr/lib',
  ];
  for (const base of candidates) {
    try {
      const req = createRequire(join(base, 'noop.js'));
      return req('puppeteer');
    } catch { /* try next */ }
  }
  // Last resort: puppeteer-core against the cached Chromium.
  const req = createRequire(join(homedir(), 'workspace/makefun/best-game/tools', 'noop.js'));
  const core = req('puppeteer-core');
  const cache = join(homedir(), '.cache/puppeteer/chrome');
  const builds = readdirSync(cache).sort();
  const exe = join(cache, builds[builds.length - 1], 'chrome-linux64/chrome');
  if (!existsSync(exe)) throw new Error('no Chromium executable found');
  return { launch: (opts) => core.launch({ ...opts, executablePath: exe }) };
}

const artB64 = readFileSync(ART).toString('base64');
const fontB64 = readFileSync(FONT).toString('base64');

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Anton'; src: url(data:font/ttf;base64,${fontB64}) format('truetype'); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #000; }
  .art {
    position: absolute; left: 0; top: ${TOP_BAR}px;
    width: ${W}px; height: ${H - TOP_BAR - BOT_BAR}px;
    object-fit: cover; object-position: 50% 8%;
  }
  .bar {
    position: absolute; left: 0; width: ${W}px; background: #000;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Anton', sans-serif; color: #fff; white-space: nowrap;
    letter-spacing: 1px; z-index: 3;
  }
  .top { top: 0; height: ${TOP_BAR}px; }
  .bot { bottom: 0; height: ${BOT_BAR}px; }
  .gold { color: ${GOLD}; }

  .note {
    position: absolute; z-index: 2;
    left: ${NOTE.left}px; top: ${NOTE.top}px;
    width: ${NOTE.width}px; height: ${NOTE.height}px;
    color: ${INK};
    font-family: 'DejaVu Sans', 'Segoe UI', sans-serif;
    display: flex; flex-direction: column;
  }
  .clinic {
    font-family: 'Anton', sans-serif; text-align: center;
    font-size: 68px; letter-spacing: 2px; line-height: 1;
  }
  .clinic .cross { color: ${RED}; }
  .dept {
    text-align: center; font-size: 24px; font-weight: 700;
    letter-spacing: 6px; color: #5a4632; margin-top: 10px;
  }
  .rule { border: none; border-top: 4px solid ${RED}; margin: 16px 4px 0; }
  .meta {
    display: flex; justify-content: space-between; align-items: baseline;
    font-size: 28px; font-weight: 700; margin-top: 14px;
    padding-bottom: 10px; border-bottom: 2px dotted #8a7a63;
  }
  .meta .k { color: ${RED}; }
  .block { margin-top: 20px; }
  .label {
    font-family: 'Anton', sans-serif; font-size: 35px; letter-spacing: 1.5px;
    color: ${RED}; line-height: 1;
  }
  .body { font-size: 30px; font-weight: 600; line-height: 1.34; margin-top: 7px; }
  .rxrow { display: flex; gap: 18px; align-items: flex-start; }
  .rxsym {
    font-family: 'Anton', sans-serif; font-size: 62px; color: ${RED};
    line-height: 1; margin-top: 2px;
  }
  .signrow {
    margin-top: auto; display: flex; align-items: flex-end;
    justify-content: space-between;
  }
  .pill {
    font-family: 'Anton', sans-serif; font-size: 27px; letter-spacing: .5px;
    color: #fff; background: rgba(10, 10, 16, .92);
    padding: 8px 18px 10px; border-radius: 999px; margin-bottom: 10px;
  }
  .sig { text-align: right; }
  .sig .name {
    font-family: 'Anton', sans-serif; font-size: 60px; line-height: 1;
    transform: rotate(-3deg); display: inline-block;
    border-bottom: 4px solid ${INK}; padding: 0 10px 4px;
  }
  .sig .under { font-size: 21px; font-weight: 700; letter-spacing: 3px; color: #5a4632; margin-top: 9px; }
</style></head><body>
  <img class="art" src="data:image/png;base64,${artB64}">
  <div class="note">
    <div class="clinic"><span class="cross">+</span> make.fun CLINIC</div>
    <div class="dept">DEPARTMENT OF LAUNCH-DAY MEDICINE</div>
    <hr class="rule">
    <div class="meta">
      <div><span class="k">PATIENT:</span> EVERY GTA FAN</div>
      <div><span class="k">DATE:</span> NOV 19, 2026</div>
    </div>
    <div class="block">
      <div class="label">DIAGNOSIS</div>
      <div class="body">GTA FLU &mdash; WITH LAUNCH-DAY POVERTY. CANNOT AFFORD PS5 ($499) + GTA VI ($80) AFTER A 13-YEAR WAIT.</div>
    </div>
    <div class="block rxrow">
      <div class="rxsym">Rx</div>
      <div class="body">ONE (1) AI AGENT. ENTER make.fun BOUNTIES DAILY. DOSAGE: ONE WEEKEND.</div>
    </div>
    <div class="signrow">
      <div class="pill">make.fun</div>
      <div class="sig">
        <span class="name">Dr. Ghost</span>
        <div class="under">ATTENDING PHYSICIAN</div>
      </div>
    </div>
  </div>
  <div class="bar top"><span data-fit>THE ONLY CURE FOR <span class="gold">GTA FLU</span></span></div>
  <div class="bar bot"><span data-fit>SIDE EFFECTS: OWNING THE GAME.</span></div>
  <script>
    // Shrink any bar caption until it fits with margin to spare.
    for (const el of document.querySelectorAll('[data-fit]')) {
      let size = 76;
      el.style.fontSize = size + 'px';
      while (el.scrollWidth > ${W - 80} && size > 20) {
        size -= 2;
        el.style.fontSize = size + 'px';
      }
    }
  </script>
</body></html>`;

const puppeteer = await loadPuppeteer();
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb'],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: OUT, type: 'png' });
  console.log(`wrote ${OUT}`);
} finally {
  await browser.close();
}
