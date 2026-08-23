import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:8080/";
const shot = process.argv[3] || "/workspace/screenshots/gameplay.png";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push("page:" + String(e)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push("console:" + msg.text());
});

await page.goto(url, { waitUntil: "networkidle" });
const play = page.getByRole("button", { name: /play level 1/i });
await play.waitFor({ timeout: 20000 });
await page.waitForFunction(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => /play level 1/i.test(b.textContent || ""));
  return btn && !btn.disabled;
}, null, { timeout: 20000 });
await play.click();
await page.waitForSelector("canvas", { timeout: 15000 });

let ready = false;
for (let i = 0; i < 40; i++) {
  ready = await page.evaluate(() => typeof window.__controlsTest?.getX === "function");
  if (ready) break;
  await page.waitForTimeout(150);
}
if (!ready) {
  console.log(JSON.stringify({ ok: false, reason: "no probe", errors }, null, 2));
  await page.screenshot({ path: shot, fullPage: true });
  await browser.close();
  process.exit(1);
}

const x0 = await page.evaluate(() => window.__controlsTest.getX());
await page.evaluate(() => window.__controlsTest.setKeys(["KeyA"]));
await page.waitForTimeout(500);
const afterA = await page.evaluate(() => ({
  x: window.__controlsTest.getX(),
  vx: window.__controlsTest.getVx(),
}));
await page.evaluate(() => window.__controlsTest.setKeys([]));
await page.evaluate(() => window.__controlsTest.setKeys(["KeyD"]));
await page.waitForTimeout(500);
const afterD = await page.evaluate(() => ({
  x: window.__controlsTest.getX(),
  vx: window.__controlsTest.getVx(),
}));
await page.evaluate(() => window.__controlsTest.setKeys([]));
await page.screenshot({ path: shot, fullPage: true });

await page.evaluate(() => window.__controlsTest.setPosition(700, 500));
await page.waitForTimeout(500);
const hud = await page.locator("body").innerText();
await page.screenshot({ path: shot.replace(".png", "-collect.png"), fullPage: true });

const aLeft = afterA.x < x0 - 4 || afterA.vx < -10;
const dRight = afterD.vx > 10;
const collected = /1\/8/.test(hud);
const result = {
  ok: aLeft && dRight && errors.length === 0,
  aLeft,
  dRight,
  collected,
  hudSnippet: hud.replace(/\s+/g, " ").slice(0, 240),
  errors,
  x0,
  afterA,
  afterD,
};
console.log(JSON.stringify(result, null, 2));
await browser.close();
process.exit(result.ok ? 0 : 1);
