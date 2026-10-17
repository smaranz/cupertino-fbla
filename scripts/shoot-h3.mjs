import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = "/tmp/fbla-shots/h3";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const measures = {};

async function ctx(width, height, extra = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, ...extra });
  const page = await context.newPage();
  await page.addInitScript(() => sessionStorage.setItem("tino-intro", "1"));
  return { context, page };
}

async function settle(page, ms = 2200) {
  await page.waitForTimeout(ms);
}

async function scrollTo(page, y) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(1600);
}

// 1. Pillars: each card stuck, 1440.
{
  const { context, page } = await ctx(1440, 900);
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await settle(page);
  const cards = await page.$$eval("[data-pillar-card]", (els) => els.map((e) => Math.round(e.getBoundingClientRect().top + window.scrollY)));
  for (let i = 0; i < cards.length; i++) {
    await scrollTo(page, cards[i] - 120);
    await page.screenshot({ path: `${OUT}/home-1440-pillar-${i + 1}-stuck.png` });
  }
  measures.pillarCardTops = cards;
  await context.close();
}

// 2. Hero at ~90% pin progress (pin length: end +=130% of the 900px hero).
{
  const { context, page } = await ctx(1440, 900);
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await settle(page);
  const pinStart = await page.evaluate(() => {
    const pin = document.querySelector("[data-hero-pin]");
    return Math.round(pin.parentElement.getBoundingClientRect().top + window.scrollY);
  });
  const range = Math.round(900 * 1.3);
  await scrollTo(page, pinStart + Math.round(range * 0.9));
  await page.waitForTimeout(800);
  measures.hero90 = await page.evaluate(() => {
    const o = document.querySelector("[data-hero-overlay-line]").getBoundingClientRect();
    return { overlayTop: Math.round(o.top), overlayBottom: Math.round(o.bottom), viewport: window.innerHeight };
  });
  await page.screenshot({ path: `${OUT}/hero-1440-pin-90pct-overlay.png` });
  await context.close();
}

// 3. Hero at scroll 0, 1728, and alignment measures.
{
  const { context, page } = await ctx(1728, 1080);
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await settle(page);
  measures.hero1728 = await page.evaluate(() => ({
    h1Left: Math.round(document.querySelector("#hero-title").getBoundingClientRect().left),
    slotLeft: Math.round(document.querySelector("[data-hero-slot]").getBoundingClientRect().left),
    footerWordmarkLeft: null,
  }));
  await page.screenshot({ path: `${OUT}/hero-1728-scroll0.png` });
  await context.close();
}

// 4. Footer bottom at 1440, 1728, 390 for / and /team; measure wordmark edges vs container.
for (const path of ["/", "/team"]) {
  for (const [w, h, mobile] of [
    [1440, 900, false],
    [1728, 1080, false],
    [390, 844, true],
  ]) {
    const { context, page } = await ctx(w, h, mobile ? { isMobile: true, hasTouch: true } : {});
    await page.goto(`${BASE}${path}`, { waitUntil: "load" });
    await settle(page);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1200);
    const edges = await page.evaluate(() => {
      const word = document.querySelector("footer p[aria-hidden='true']");
      const wrap = word.parentElement.parentElement;
      const range = document.createRange();
      range.selectNodeContents(word);
      const glyphs = range.getBoundingClientRect();
      const box = wrap.getBoundingClientRect();
      const cs = getComputedStyle(wrap);
      const contentLeft = box.left + parseFloat(cs.paddingLeft);
      const contentRight = box.right - parseFloat(cs.paddingRight);
      return {
        glyphLeft: Math.round(glyphs.left),
        glyphRight: Math.round(glyphs.right),
        containerLeft: Math.round(contentLeft),
        containerRight: Math.round(contentRight),
        leftDelta: Math.round(glyphs.left - contentLeft),
        rightDelta: Math.round(glyphs.right - contentRight),
        viewport: window.innerWidth,
      };
    });
    measures[`footer-${path === "/" ? "home" : "team"}-${w}`] = edges;
    await page.screenshot({ path: `${OUT}/footer-${path === "/" ? "home" : "team"}-${w}.png` });
    await context.close();
  }
}

// 5. Results gallery 1440 and 1728; filter All and NLC 2024 at 390; summary settled 1440 and 390.
for (const [w, h] of [
  [1440, 900],
  [1728, 1080],
]) {
  const { context, page } = await ctx(w, h);
  await page.goto(`${BASE}/results`, { waitUntil: "load" });
  await settle(page);
  const gallery = await page.$("[role='region']");
  await gallery.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/results-${w}-gallery.png` });
  measures[`gallery-${w}`] = await page.evaluate(() => {
    const track = document.querySelector("[role='region'] > div");
    const figs = Array.from(track.children);
    const tops = figs.map((f) => Math.round(f.getBoundingClientRect().top));
    return { figures: figs.length, sameRow: Math.max(...tops) - Math.min(...tops) < 40, trackWidth: track.scrollWidth, viewport: window.innerWidth };
  });
  await context.close();
}
for (const [w, h, mobile] of [
  [390, 844, true],
  [1440, 900, false],
]) {
  const { context, page } = await ctx(w, h, mobile ? { isMobile: true, hasTouch: true } : {});
  await page.goto(`${BASE}/results`, { waitUntil: "load" });
  await settle(page, 2600);
  await page.waitForTimeout(2000);
  measures[`summary-${w}`] = await page.evaluate(() =>
    Array.from(document.querySelectorAll("dl dd span")).map((el) => el.textContent),
  );
  const toolbar = await page.$("[role='group']");
  await toolbar.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/results-${w}-filter-all.png` });
  await page.getByRole("button", { name: w === 390 ? "NLC 2024" : "National Leadership Conference 2024" }).click();
  await page.waitForTimeout(1200);
  await toolbar.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/results-${w}-filter-nlc2024.png` });
  await context.close();
}

// 6. Team apply CTA at 1440 and 390; 404 at 1440 and 390; join hero at 1440 and 390.
for (const [w, h, mobile] of [
  [1440, 900, false],
  [390, 844, true],
]) {
  {
    const { context, page } = await ctx(w, h, mobile ? { isMobile: true, hasTouch: true } : {});
    await page.goto(`${BASE}/team`, { waitUntil: "load" });
    await settle(page);
    const apply = page.getByRole("heading", { name: "Want a seat on next year’s team?" });
    await apply.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2200);
    measures[`apply-lines-${w}`] = await apply.evaluate((el) => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)));
    await page.screenshot({ path: `${OUT}/team-apply-${w}.png` });
    await context.close();
  }
  {
    const { context, page } = await ctx(w, h, mobile ? { isMobile: true, hasTouch: true } : {});
    await page.goto(`${BASE}/this-does-not-exist`, { waitUntil: "load" });
    await settle(page, 1800);
    measures[`404-lines-${w}`] = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      return Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
    });
    await page.screenshot({ path: `${OUT}/404-${w}.png` });
    await context.close();
  }
  {
    const { context, page } = await ctx(w, h, mobile ? { isMobile: true, hasTouch: true } : {});
    await page.goto(`${BASE}/join`, { waitUntil: "load" });
    await settle(page, 2600);
    await page.screenshot({ path: `${OUT}/join-hero-${w}.png` });
    await context.close();
  }
}

// 7. Transition frames: 150ms, 450ms, 900ms after clicking Team at 1440.
{
  const { context, page } = await ctx(1440, 900);
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await settle(page);
  await page.locator("header").getByRole("link", { name: "Team", exact: true }).click({ noWaitAfter: true });
  await page.waitForTimeout(150);
  await page.screenshot({ path: `${OUT}/transition-150ms-rising.png` });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/transition-450ms-covered.png` });
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${OUT}/transition-900ms-revealing.png` });
  measures.transitionUrl = page.url();
  await context.close();
}

await writeFile(`${OUT}/measures.json`, JSON.stringify(measures, null, 2));
await browser.close();
console.log(JSON.stringify(measures, null, 2));
