import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:8080/";
const out = [];
const fail = (name, detail) => {
  out.push({ name, ok: false, detail });
  console.log("FAIL", name, detail);
};
const pass = (name, detail = "") => {
  out.push({ name, ok: true, detail });
  console.log("PASS", name, detail);
};

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

const title = await page.title();
if (title.includes("Monnie")) pass("title", title);
else fail("title", title);

const play = page.getByRole("button", { name: /Play as Monnie|Play Level/i });
await play.waitFor({ timeout: 20000 });
await page.waitForFunction(() => {
  const b = [...document.querySelectorAll("button")].find((el) => /Play/.test(el.textContent || ""));
  return b && !b.disabled;
}, null, { timeout: 20000 });
await play.click();
await page.waitForSelector("canvas", { timeout: 15000 });

await page.waitForFunction(() => typeof window.__controlsTest?.getX === "function", null, { timeout: 8000 });
await page.waitForTimeout(400);

const hud0 = await page.locator("body").innerText();
if (/0\/8/.test(hud0)) pass("hud-flower-counter-start", "0/8");
else fail("hud-flower-counter-start", hud0.slice(0, 180));
if (/MEADOW GATE/i.test(hud0)) pass("hud-level-name", "Meadow Gate");
else fail("hud-level-name", hud0.slice(0, 180));

const ev = (fn, arg) => page.evaluate(fn, arg);

const start = await ev(() => ({ x: window.__controlsTest.getX(), y: window.__controlsTest.getY() }));

await ev(() => window.__controlsTest.setKeys(["KeyA"]));
await page.waitForTimeout(400);
const afterA = await ev(() => ({ x: window.__controlsTest.getX(), vx: window.__controlsTest.getVx() }));
await ev(() => window.__controlsTest.setKeys([]));
if (afterA.x < start.x - 8 && afterA.vx < 0) pass("wasd-A-left", `${start.x.toFixed(1)} -> ${afterA.x.toFixed(1)}`);
else fail("wasd-A-left", JSON.stringify({ start, afterA }));

await ev(() => window.__controlsTest.setKeys(["KeyD"]));
await page.waitForTimeout(400);
const afterD = await ev(() => ({ x: window.__controlsTest.getX(), vx: window.__controlsTest.getVx() }));
await ev(() => window.__controlsTest.setKeys([]));
if (afterD.x > afterA.x + 8 && afterD.vx > 0) pass("wasd-D-right", `${afterA.x.toFixed(1)} -> ${afterD.x.toFixed(1)}`);
else fail("wasd-D-right", JSON.stringify({ afterA, afterD }));

await ev(() => window.__controlsTest.setKeys(["KeyW"]));
await page.waitForTimeout(400);
const afterW = await ev(() => ({ y: window.__controlsTest.getY(), vy: window.__controlsTest.getVy() }));
await ev(() => window.__controlsTest.setKeys([]));
if (afterW.y < start.y - 8 && afterW.vy < 0) pass("wasd-W-up", `${start.y.toFixed(1)} -> ${afterW.y.toFixed(1)}`);
else fail("wasd-W-up", JSON.stringify({ start, afterW }));

await ev(() => window.__controlsTest.setKeys(["ArrowDown"]));
await page.waitForTimeout(400);
const afterDown = await ev(() => ({ y: window.__controlsTest.getY() }));
await ev(() => window.__controlsTest.setKeys([]));
if (afterDown.y > afterW.y + 8) pass("arrows-down", `${afterW.y.toFixed(1)} -> ${afterDown.y.toFixed(1)}`);
else fail("arrows-down", JSON.stringify({ afterW, afterDown }));

await ev(() => window.__controlsTest.setPosition(80, 1240));
await ev(() => window.__controlsTest.setKeys(["KeyA"]));
await page.waitForTimeout(700);
const atBound = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setKeys([]));
if (atBound >= 40 && atBound < 80) pass("world-bounds-collision", `x=${atBound.toFixed(1)}`);
else fail("world-bounds-collision", `x=${atBound}`);

await ev(() => window.__controlsTest.setPosition(710, 900));
await page.waitForTimeout(350);
const collected = await ev(() => window.__controlsTest.getCollected?.() ?? 0);
const remaining = await ev(() => window.__controlsTest.flowerCount?.() ?? -1);
if (collected >= 1) pass("flower-collect", `${collected}/8`);
else fail("flower-collect", String(collected));
if (remaining === 7) pass("flower-sprite-removed", "7 remain");
else fail("flower-sprite-removed", String(remaining));

const heartsBefore = await ev(() => window.__controlsTest.getHearts?.());
const hazards = await ev(() => window.__controlsTest.getHazards?.() ?? []);
if (hazards.length) {
  const h = hazards[0];
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x: h.x, y: h.y });
  await page.waitForTimeout(250);
}
const heartsAfter = await ev(() => window.__controlsTest.getHearts?.());
if (typeof heartsAfter === "number" && heartsAfter < heartsBefore) {
  pass("beetle-hit-lives", `${heartsBefore} -> ${heartsAfter}`);
} else fail("beetle-hit-lives", JSON.stringify({ heartsBefore, heartsAfter, hazards }));

await page.getByRole("button", { name: /Pause/i }).click();
await page.waitForTimeout(200);
const pausedText = await page.locator("body").innerText();
if (/Take a breath|Paused/.test(pausedText)) pass("pause-overlay", "visible");
else fail("pause-overlay", pausedText.slice(0, 200));

const xPaused = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setKeys(["KeyD"]));
await page.waitForTimeout(400);
const xStill = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setKeys([]));
if (Math.abs(xStill - xPaused) < 2) pass("pause-freezes-movement", `${xPaused.toFixed(1)} vs ${xStill.toFixed(1)}`);
else fail("pause-freezes-movement", `${xPaused} -> ${xStill}`);

await page.getByRole("button", { name: /Keep wandering/i }).click();
await page.waitForTimeout(250);
const afterResume = await page.locator("body").innerText();
if (!/Take a breath/.test(afterResume)) pass("resume", "overlay gone");
else fail("resume", afterResume.slice(0, 160));

const xJoy0 = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setJoystick?.(-1, 0));
await page.waitForTimeout(400);
const xJoy1 = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setJoystick?.(0, 0));
if (xJoy1 < xJoy0 - 6) pass("joystick-left", `${xJoy0.toFixed(1)} -> ${xJoy1.toFixed(1)}`);
else fail("joystick-left", `${xJoy0} -> ${xJoy1}`);

const flowers = [
  [430, 430],
  [980, 410],
  [390, 820],
  [1010, 790],
  [700, 500],
  [560, 680],
  [860, 660],
  [710, 900],
];
for (const [x, y] of flowers) {
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x, y });
  await page.waitForTimeout(200);
}
await page.waitForTimeout(500);
const endText = await page.locator("body").innerText();
if (/Level 1 complete|Garden gathered|Play again/.test(endText)) {
  pass("level-complete", (endText.match(/Level 1 complete|Garden gathered|Play again/) || [])[0]);
} else fail("level-complete", endText.slice(0, 280));

const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
if (!overflow) pass("mobile-no-h-overflow", "ok");
else fail("mobile-no-h-overflow", "overflow");

if (errors.length) fail("console-errors", errors.slice(0, 6).join(" | "));
else pass("console-errors", "none");

console.log("\n=== SUMMARY ===");
const failed = out.filter((r) => !r.ok);
console.log(`passed ${out.filter((r) => r.ok).length} / ${out.length}`);
if (failed.length) {
  console.log("failures:");
  failed.forEach((f) => console.log(" -", f.name, f.detail));
}
await page.screenshot({ path: "/workspace/screenshots/qa-level1.png", fullPage: true });
await browser.close();
process.exit(failed.length ? 1 : 0);
