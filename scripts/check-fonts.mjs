import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = process.env.FONTS_OUT ?? "/tmp/fbla-shots/fonts";
const routes = ["/", "/team", "/results", "/join", "/this-does-not-exist"];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const report = { routes: {}, allowedFamilies: ["SF Pro", "SF NS", "System Font", ".SF", "Georgia", "SF Mono", "Menlo"], fontRequests: {} };

async function scrollAll(page) {
  for (let y = 0; y < 60000; y += 500) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
    const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    if (y >= max) break;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
}

for (const route of routes) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => sessionStorage.setItem("tino-intro", "1"));
  const page = await context.newPage();
  const fontRequests = [];
  page.on("requestfinished", (req) => {
    if (/\.(woff2?|ttf|otf|eot)(\?|$)/i.test(req.url())) fontRequests.push(req.url());
  });
  await page.goto(`${BASE}${route}`, { waitUntil: "load" });
  await page.waitForTimeout(2500);
  await scrollAll(page);

  const cdp = await context.newCDPSession(page);
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  const { root } = await cdp.send("DOM.getDocument", { depth: -1, pierce: true });
  const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: "body *" });
  const families = new Map();
  for (const nodeId of nodeIds) {
    const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId }).catch(() => ({ fonts: [] }));
    for (const f of fonts) {
      const key = f.familyName;
      families.set(key, (families.get(key) ?? 0) + f.glyphCount);
    }
  }
  report.routes[route] = Object.fromEntries([...families.entries()].sort((a, b) => b[1] - a[1]));
  report.fontRequests[route] = fontRequests;
  await context.close();
}

const used = new Set();
for (const fams of Object.values(report.routes)) for (const f of Object.keys(fams)) used.add(f);
report.uniqueFamilies = [...used].sort();
report.disallowed = report.uniqueFamilies.filter(
  (f) => !report.allowedFamilies.some((a) => f.includes(a)),
);
report.pass = report.disallowed.length === 0 && Object.values(report.fontRequests).every((r) => r.length === 0);
await writeFile(`${OUT}/platform-fonts.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ uniqueFamilies: report.uniqueFamilies, disallowed: report.disallowed, fontRequests: report.fontRequests, pass: report.pass }, null, 2));
await browser.close();
