import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const results = [];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await context.addInitScript(() => sessionStorage.setItem("tino-intro", "1"));
const page = await context.newPage();

let errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text().slice(0, 200));
});
page.on("pageerror", (err) => errors.push(`pageerror ${err.message}`.slice(0, 200)));

async function state() {
  return page.evaluate(() => ({ path: location.pathname, hash: location.hash, y: Math.round(window.scrollY) }));
}

async function toTop() {
  for (let i = 0; i < 80; i++) {
    const y = await page.evaluate(() => window.scrollY);
    if (y <= 0) break;
    await page.mouse.wheel(0, -1400);
    await page.waitForTimeout(220);
  }
  await page.waitForTimeout(800);
}

async function step(name, action, check) {
  errors = [];
  let ok = true;
  let detail = "";
  try {
    await toTop();
    await action();
    await page.waitForTimeout(1500);
    const s = await state();
    detail = JSON.stringify(s);
    ok = check(s);
  } catch (err) {
    ok = false;
    detail = `threw: ${err.message.split("\n")[0]}`;
  }
  results.push({ name, ok, detail, errors: [...errors] });
}

async function goto(path) {
  await page.goto(`${BASE}${path}`, { waitUntil: "load" });
  await page.waitForTimeout(1800);
}

await goto("/");
await step(
  "home nav Compete -> /#compete (same page, Lenis scroll)",
  () => page.locator("header").getByRole("link", { name: "Compete" }).click(),
  (s) => s.path === "/" && s.hash === "#compete" && s.y > 400,
);
await step(
  "home nav Projects -> /#projects (same page)",
  () => page.locator("header").getByRole("link", { name: "Projects" }).click(),
  (s) => s.path === "/" && s.hash === "#projects" && s.y > 400,
);
await step(
  "home nav Results -> /results",
  () => page.locator("header").getByRole("link", { name: "Results", exact: true }).click(),
  (s) => s.path === "/results",
);
await step(
  "results nav Team -> /team",
  () => page.locator("header").getByRole("link", { name: "Team", exact: true }).click(),
  (s) => s.path === "/team",
);
await step(
  "team nav Compete -> / then #compete (cross-page hash)",
  () => page.locator("header").getByRole("link", { name: "Compete" }).click(),
  (s) => s.path === "/" && s.hash === "#compete" && s.y > 400,
);
await step(
  "home logo -> /",
  () => page.locator("header").getByRole("link", { name: "Cupertino FBLA" }).click(),
  (s) => s.path === "/",
);
await step(
  "home hero 'How to join' -> /join",
  () => page.locator("#hero-title").locator("xpath=ancestor::section[1]").getByRole("link", { name: "How to join" }).click(),
  (s) => s.path === "/join",
);
await step(
  "join nav Join CTA stays on /join (Join -> /join)",
  () => page.locator("header").getByRole("link", { name: "Join", exact: true }).click(),
  (s) => s.path === "/join",
);
await step(
  "join footer Results -> /results",
  () => page.locator("footer").getByRole("link", { name: "Results", exact: true }).click(),
  (s) => s.path === "/results",
);
await step(
  "results footer Team -> /team",
  () => page.locator("footer").getByRole("link", { name: "Team", exact: true }).click(),
  (s) => s.path === "/team",
);
await step(
  "team footer Home -> /",
  () => page.locator("footer").getByRole("link", { name: "Home", exact: true }).click(),
  (s) => s.path === "/",
);
await step(
  "home footer Join -> /join",
  () => page.locator("footer").getByRole("link", { name: "Join", exact: true }).click(),
  (s) => s.path === "/join",
);

const externals = await page.evaluate(() =>
  Array.from(document.querySelectorAll("footer a[target='_blank']")).map((a) => ({
    text: a.textContent.trim(),
    href: a.getAttribute("href"),
    rel: a.getAttribute("rel"),
  })),
);
results.push({
  name: "footer external links open in new tab with rel",
  ok: externals.length === 2 && externals.every((e) => e.rel === "noopener noreferrer"),
  detail: JSON.stringify(externals),
  errors: [],
});

await goto("/team");
await step(
  "team department index click -> #compete-style anchor (Lenis, offset)",
  async () => {
    await page.locator("nav[aria-label]").getByRole("link").nth(2).click();
  },
  (s) => s.path === "/team" && s.hash !== "" && s.y > 400,
);
await goto("/results");
await step(
  "results filter NLC 2024 toggles aria-pressed",
  async () => {
    await page.getByRole("button", { name: "National Leadership Conference 2024" }).click();
  },
  () => true,
);
const pressed = await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent.includes("National Leadership Conference 2024"));
  return btn?.getAttribute("aria-pressed");
});
const visibleRows = await page.evaluate(() => Array.from(document.querySelectorAll("tbody tr")).filter((r) => !r.hidden).length);
results.push({
  name: "results filter state",
  ok: pressed === "true" && visibleRows === 4,
  detail: JSON.stringify({ pressed, visibleRows }),
  errors: [],
});

await goto("/join");
const joinLinks = await page.evaluate(() =>
  Array.from(document.querySelectorAll("main a")).map((a) => ({ text: a.textContent.trim(), href: a.getAttribute("href"), target: a.getAttribute("target") })),
);
results.push({ name: "join main links", ok: joinLinks.length > 0, detail: JSON.stringify(joinLinks), errors: [] });

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 2));
