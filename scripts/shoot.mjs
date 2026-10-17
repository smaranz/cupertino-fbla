import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = process.env.SHOOT_OUT ?? "/tmp/fbla-shots";
const SPACING = `${OUT}/spacing`;
const pad = (n) => String(n).padStart(2, "0");

const pages = [
  { path: "/", slug: "home" },
  { path: "/team", slug: "team" },
  { path: "/results", slug: "results" },
  { path: "/join", slug: "join" },
  { path: "/this-does-not-exist", slug: "404" },
];
const viewports = [
  { width: 1440, height: 900, name: "1440" },
  { width: 1728, height: 1080, name: "1728" },
  { width: 390, height: 844, name: "390", mobile: true },
];

const report = { pages: [], extra: {}, reduced: [] };

function collect(page, log) {
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") log.console.push(`[${msg.type()}] ${msg.text()}`.slice(0, 400));
  });
  page.on("pageerror", (err) => log.console.push(`[pageerror] ${err.message}`.slice(0, 400)));
  page.on("requestfailed", (req) => log.failed.push(`${req.method()} ${req.url()} ${req.failure()?.errorText ?? ""}`.slice(0, 300)));
  page.on("response", (res) => {
    if (res.status() >= 400) log.failed.push(`${res.status()} ${res.url()}`.slice(0, 300));
  });
}

async function scrollSteps(page, viewport, prefix) {
  const step = Math.round(viewport.height * 0.75);
  let index = 1;
  for (let guard = 0; guard < 80; guard++) {
    const { y, max } = await page.evaluate(() => ({
      y: window.scrollY,
      max: document.documentElement.scrollHeight - window.innerHeight,
    }));
    if (y >= max - 2) break;
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${prefix}-${pad(index)}.png` });
    index++;
  }
  return index - 1;
}

async function toTop(page) {
  for (let i = 0; i < 80; i++) {
    const y = await page.evaluate(() => window.scrollY);
    if (y <= 0) break;
    await page.mouse.wheel(0, -1400);
    await page.waitForTimeout(220);
  }
  await page.waitForTimeout(800);
}

async function openFresh(browser, viewport, extraOptions = {}) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    isMobile: Boolean(viewport.mobile),
    hasTouch: Boolean(viewport.mobile),
    ...extraOptions,
  });
  const page = await context.newPage();
  return { context, page };
}

const browser = await chromium.launch();
await mkdir(SPACING, { recursive: true });
const captureScript = await readFile("/tmp/bd-capture.js", "utf8");

for (const target of pages) {
  for (const viewport of viewports) {
    const { context, page } = await openFresh(browser, viewport);
    const log = { page: target.slug, viewport: viewport.name, console: [], failed: [], steps: 0, overflow: null };
    collect(page, log);

    await page.goto(`${BASE}${target.path}`, { waitUntil: "load" });
    await page.waitForTimeout(700);
    if (target.slug === "home" && viewport.name === "1440") {
      await page.screenshot({ path: `${OUT}/preloader-1440-mid.png` });
    }
    await page
      .waitForFunction(() => document.documentElement.classList.contains("intro-done"), null, { timeout: 25000 })
      .catch(() => log.console.push("[harness] intro-done never set"));
    await page.waitForTimeout(2400);
    await page.screenshot({ path: `${OUT}/${target.slug}-${viewport.name}-00.png` });
    log.steps = await scrollSteps(page, viewport, `${target.slug}-${viewport.name}`);

    await toTop(page);
    await page.waitForTimeout(800);
    log.overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    const captured = await page.evaluate(captureScript);
    await writeFile(`${SPACING}/${target.slug}-${viewport.name}.json`, JSON.stringify(captured, null, 2));

    if (viewport.mobile && target.slug === "team") {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.waitForTimeout(1600);
      await page.screenshot({ path: `${OUT}/team-390-menu.png` });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(800);
    }
    if (viewport.mobile && target.slug === "home") {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.waitForTimeout(1600);
      await page.screenshot({ path: `${OUT}/home-390-menu.png` });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(800);
    }
    if (!viewport.mobile && target.slug === "home") {
      await toTop(page);
      await page.waitForTimeout(500);
      await page.getByRole("button", { name: "Watch our story" }).click();
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${OUT}/home-1440-modal.png` });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(600);
    }
    if (!viewport.mobile && target.slug === "results") {
      await toTop(page);
      await page.getByRole("button", { name: "National Leadership Conference 2024" }).click();
      await page.waitForTimeout(1200);
      await page.locator("table").scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}/results-1440-filter-nlc2024.png` });
    }

    report.pages.push(log);
    await context.close();
  }
}

// Mobile results filter, 390.
{
  const viewport = viewports[2];
  const { context, page } = await openFresh(browser, viewport, {});
  await page.addInitScript(() => sessionStorage.setItem("tino-intro", "1"));
  await page.goto(`${BASE}/results`, { waitUntil: "load" });
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "NLC 2024" }).click();
  await page.waitForTimeout(1200);
  await page.locator("table").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/results-390-filter-nlc2024.png` });
  report.extra.results390Overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  await context.close();
}

// Hero at scroll 0 at extra desktop sizes; nav crop at 1440.
for (const [w, h] of [
  [1280, 720],
  [1536, 864],
  [1920, 1080],
  [1440, 900],
]) {
  const { context, page } = await openFresh(browser, { width: w, height: h }, {});
  await page.addInitScript(() => sessionStorage.setItem("tino-intro", "1"));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${OUT}/hero-${w}x${h}-scroll0.png` });
  if (w === 1440) {
    await page.screenshot({ path: `${OUT}/nav-crop-1440.png`, clip: { x: 0, y: 0, width: 1440, height: 140 } });
  }
  const hero = await page.evaluate(() => {
    const h1 = document.querySelector("#hero-title");
    const r = h1.getBoundingClientRect();
    const lines = Math.round(r.height / parseFloat(getComputedStyle(h1).lineHeight));
    const strip = document.querySelector("[data-hero-photo]").getBoundingClientRect();
    const cta = document.querySelector("[data-hero-rest] a[href='/join']")?.getBoundingClientRect();
    return { h1Top: Math.round(r.top), h1Lines: lines, stripTop: Math.round(strip.top), stripHeight: Math.round(strip.height), ctaBottom: cta ? Math.round(cta.bottom) : null };
  });
  report.extra[`hero-${w}x${h}`] = hero;
  await context.close();
}

// Page-transition cover mid-animation: click Team in the nav at 1440.
{
  const { context, page } = await openFresh(browser, viewports[0], {});
  await page.addInitScript(() => sessionStorage.setItem("tino-intro", "1"));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(2000);
  await page.locator("header").getByRole("link", { name: "Team" }).first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/transition-1440-mid.png` });
  await page.waitForURL("**/team", { timeout: 15000 });
  await page.waitForTimeout(1800);
  report.extra.transitionUrl = page.url();
  await context.close();
}

// Reduced motion pass at 1440, every page.
for (const target of pages) {
  const { context, page } = await openFresh(browser, viewports[0], { reducedMotion: "reduce" });
  const log = { page: target.slug, viewport: "1440-reduced", console: [], failed: [], preloaderVisible: null };
  collect(page, log);
  await page.goto(`${BASE}${target.path}`, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  log.preloaderVisible = await page.evaluate(() => {
    const el = document.querySelector("[data-preloader]");
    return el ? getComputedStyle(el).display !== "none" && getComputedStyle(el).visibility !== "hidden" : false;
  });
  await page.screenshot({ path: `${OUT}/${target.slug}-1440-reduced-full.png`, fullPage: true });
  report.reduced.push(log);
  await context.close();
}

await writeFile(`${OUT}/report.json`, JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report, null, 2));
