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

const L1_FLOWERS = [
  [430, 430],
  [980, 410],
  [390, 820],
  [1010, 790],
  [700, 500],
  [560, 680],
  [860, 660],
  [710, 900],
];
const L2_TULIPS = [
  [250, 1480],
  [980, 1360],
  [220, 980],
  [980, 760],
  [400, 430],
];

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

const ev = (fn, arg) => page.evaluate(fn, arg);

await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
const play = page.getByRole("button", { name: /Play as Monnie|Play Level/i });
await play.waitFor({ timeout: 20000 });
await page.waitForFunction(() => {
  const b = [...document.querySelectorAll("button")].find((el) => /Play/.test(el.textContent || ""));
  return b && !b.disabled;
}, null, { timeout: 20000 });
await play.click();
await page.waitForFunction(() => typeof window.__controlsTest?.getX === "function", null, { timeout: 10000 });
await page.waitForTimeout(300);

// --- Level 1 still completes ---
const l1id = await ev(() => window.__controlsTest.getLevelId?.());
if (l1id === "level-1") pass("l1-loads", l1id);
else fail("l1-loads", String(l1id));

const start = await ev(() => ({ x: window.__controlsTest.getX(), y: window.__controlsTest.getY() }));
await ev(() => window.__controlsTest.setKeys(["KeyA"]));
await page.waitForTimeout(350);
const afterA = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setKeys([]));
if (afterA < start.x - 6) pass("l1-A-left", `${start.x.toFixed(0)} -> ${afterA.toFixed(0)}`);
else fail("l1-A-left", JSON.stringify({ start, afterA }));

for (const [x, y] of L1_FLOWERS) {
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x, y });
  await page.waitForTimeout(160);
}
await page.waitForTimeout(400);
const l1end = await page.locator("body").innerText();
if (/Level 1 complete/.test(l1end)) pass("l1-complete", "win card");
else fail("l1-complete", l1end.slice(0, 220));
if (/Continue to Tulip Trail/.test(l1end)) pass("l1-continue-cta", "visible");
else fail("l1-continue-cta", l1end.slice(0, 220));

await page.getByRole("button", { name: /Continue to Tulip Trail/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-2", null, { timeout: 8000 });
await page.waitForTimeout(400);

const l2id = await ev(() => window.__controlsTest.getLevelId?.());
if (l2id === "level-2") pass("l2-loads-from-data", l2id);
else fail("l2-loads-from-data", String(l2id));

const spawn = await ev(() => ({ x: window.__controlsTest.getX(), y: window.__controlsTest.getY() }));
if (Math.abs(spawn.x - 576) < 8 && Math.abs(spawn.y - 1580) < 8) pass("l2-spawn", JSON.stringify(spawn));
else fail("l2-spawn", JSON.stringify(spawn));

const hud = await page.locator("body").innerText();
if (/TULIPS/i.test(hud) && /0\/5/.test(hud)) pass("l2-hud-tulips", "0/5");
else fail("l2-hud-tulips", hud.slice(0, 240));
if (/Tulip Trail/i.test(hud)) pass("l2-hud-name", "Tulip Trail");
else fail("l2-hud-name", hud.slice(0, 180));

await ev(() => window.__controlsTest.setKeys(["KeyD"]));
await page.waitForTimeout(350);
const afterD = await ev(() => ({ x: window.__controlsTest.getX(), vx: window.__controlsTest.getVx() }));
await ev(() => window.__controlsTest.setKeys([]));
if (afterD.x > spawn.x + 6 && afterD.vx > 0) pass("l2-D-right", `${spawn.x.toFixed(0)} -> ${afterD.x.toFixed(0)}`);
else fail("l2-D-right", JSON.stringify(afterD));

const xJoy0 = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setJoystick?.(-1, 0));
await page.waitForTimeout(350);
const xJoy1 = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setJoystick?.(0, 0));
if (xJoy1 < xJoy0 - 6) pass("l2-joystick-left", `${xJoy0.toFixed(0)} -> ${xJoy1.toFixed(0)}`);
else fail("l2-joystick-left", `${xJoy0} -> ${xJoy1}`);

const exit0 = await ev(() => window.__controlsTest.getExit?.());
if (exit0 && exit0.locked) pass("l2-gate-starts-locked", JSON.stringify(exit0));
else fail("l2-gate-starts-locked", JSON.stringify(exit0));

await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x: exit0.x, y: exit0.y + 20 });
await page.waitForTimeout(350);
const afterLocked = await ev(() => ({
  phase: window.__controlsTest.getPhase?.(),
  banner: window.__controlsTest.getBanner?.(),
  collected: window.__controlsTest.getCollected?.(),
}));
if (afterLocked.phase === "playing") pass("l2-locked-gate-no-win", afterLocked.phase);
else fail("l2-locked-gate-no-win", JSON.stringify(afterLocked));
if (/Collect all 5 tulips first/i.test(afterLocked.banner || "")) {
  pass("l2-locked-gate-hint", afterLocked.banner);
} else fail("l2-locked-gate-hint", JSON.stringify(afterLocked));

// beetle
const hazards = await ev(() => window.__controlsTest.getHazards?.() ?? []);
const hearts0 = await ev(() => window.__controlsTest.getHearts?.());
if (hazards[0]) {
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x: hazards[0].x, y: hazards[0].y });
  await page.waitForTimeout(280);
}
const hearts1 = await ev(() => window.__controlsTest.getHearts?.());
if (hearts1 < hearts0) pass("l2-beetle-hit", `${hearts0} -> ${hearts1}`);
else fail("l2-beetle-hit", JSON.stringify({ hearts0, hearts1, hazards }));

await page.getByRole("button", { name: /Pause/i }).click();
await page.waitForTimeout(200);
if (/Take a breath/.test(await page.locator("body").innerText())) pass("l2-pause", "visible");
else fail("l2-pause", "missing");
await page.getByRole("button", { name: /Keep wandering/i }).click();
await page.waitForTimeout(200);
if (!/Take a breath/.test(await page.locator("body").innerText())) pass("l2-resume", "ok");
else fail("l2-resume", "still paused");

for (let i = 0; i < L2_TULIPS.length; i++) {
  const [x, y] = L2_TULIPS[i];
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x, y });
  await page.waitForTimeout(220);
  const n = await ev(() => window.__controlsTest.getCollected?.());
  if (n === i + 1) pass(`l2-tulip-${i + 1}`, `${n}/5`);
  else fail(`l2-tulip-${i + 1}`, String(n));
}

await page.waitForTimeout(400);
const afterFive = await ev(() => ({
  phase: window.__controlsTest.getPhase?.(),
  collected: window.__controlsTest.getCollected?.(),
  remaining: window.__controlsTest.flowerCount?.(),
  unlocked: window.__controlsTest.isGateUnlocked?.(),
  banner: window.__controlsTest.getBanner?.(),
  subtitle: window.__controlsTest.getSubtitle?.(),
}));
if (afterFive.phase === "playing") pass("l2-fifth-tulip-no-win", afterFive.phase);
else fail("l2-fifth-tulip-no-win", JSON.stringify(afterFive));
if (afterFive.collected === 5 && afterFive.remaining === 0) pass("l2-counter-5-5", "5/5");
else fail("l2-counter-5-5", JSON.stringify(afterFive));
if (afterFive.unlocked) pass("l2-gate-unlocked", "open");
else fail("l2-gate-unlocked", JSON.stringify(afterFive));
if (/garden gate has opened/i.test(afterFive.banner || "")) pass("l2-unlock-banner", afterFive.banner);
else fail("l2-unlock-banner", String(afterFive.banner));
if (/Reach the garden gate/i.test(afterFive.subtitle || "")) pass("l2-objective-change", afterFive.subtitle);
else fail("l2-objective-change", String(afterFive.subtitle));

const exit1 = await ev(() => window.__controlsTest.getExit?.());
await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x: exit1.x, y: exit1.y + 8 });
await page.waitForTimeout(500);
const winText = await page.locator("body").innerText();
if (/Tulip Trail complete/i.test(winText)) pass("l2-complete-at-gate", "win card");
else fail("l2-complete-at-gate", winText.slice(0, 280));
if (/Continue to Sunflower Crossing/i.test(winText)) pass("l2-continue-l3", "cta visible");
else fail("l2-continue-l3", winText.slice(0, 280));

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
  failed.forEach((f) => console.log(" -", f.name, f.detail));
}
await page.screenshot({ path: "/workspace/screenshots/qa-level2.png", fullPage: true });
await browser.close();
process.exit(failed.length ? 1 : 0);
