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

const L1 = [
  [430, 430], [980, 410], [390, 820], [1010, 790],
  [700, 500], [560, 680], [860, 660], [710, 900],
];
const L2 = [
  [250, 1480], [980, 1360], [220, 980], [980, 760], [400, 430],
];
const L3 = [
  [230, 1560], [800, 1500], [504, 900], [230, 300], [790, 300], [330, 190],
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
await page.waitForTimeout(250);

if ((await ev(() => window.__controlsTest.getLevelId?.())) === "level-1") pass("l1-loads");
else fail("l1-loads", "not level-1");
for (const [x, y] of L1) {
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x, y });
  await page.waitForTimeout(140);
}
await page.waitForTimeout(350);
if (/Level 1 complete/.test(await page.locator("body").innerText())) pass("l1-complete");
else fail("l1-complete", "no win");

await page.getByRole("button", { name: /Continue to Tulip Trail/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-2", null, { timeout: 8000 });
await page.waitForTimeout(250);
pass("l2-from-l1");
for (const [x, y] of L2) {
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x, y });
  await page.waitForTimeout(200);
}
const l2exit = await ev(() => window.__controlsTest.getExit?.());
if (l2exit && !l2exit.locked) pass("l2-gate-unlocks");
else fail("l2-gate-unlocks", JSON.stringify(l2exit));
await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x: l2exit.x, y: l2exit.y + 8 });
await page.waitForTimeout(400);
const l2text = await page.locator("body").innerText();
if (/Tulip Trail complete/i.test(l2text)) pass("l2-complete");
else fail("l2-complete", l2text.slice(0, 200));
if (/Continue to Sunflower Crossing/i.test(l2text)) pass("l2-continue-l3");
else fail("l2-continue-l3", l2text.slice(0, 200));

await page.getByRole("button", { name: /Continue to Sunflower Crossing/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-3", null, { timeout: 8000 });
await page.waitForTimeout(350);

const spawn = await ev(() => ({ x: window.__controlsTest.getX(), y: window.__controlsTest.getY() }));
if (Math.abs(spawn.x - 504) < 8 && Math.abs(spawn.y - 1680) < 8) pass("l3-spawn", JSON.stringify(spawn));
else fail("l3-spawn", JSON.stringify(spawn));

const hud = await page.locator("body").innerText();
if (/SUNFLOWERS/i.test(hud) && /0\/6/.test(hud)) pass("l3-hud");
else fail("l3-hud", hud.slice(0, 220));

await ev(() => window.__controlsTest.setKeys(["KeyA"]));
await page.waitForTimeout(300);
const afterA = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setKeys([]));
if (afterA < spawn.x - 6) pass("l3-A-left");
else fail("l3-A-left", String(afterA));

await ev(() => window.__controlsTest.setKeys([]));
const x0 = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setJoystick?.(-1, 0));
await page.waitForTimeout(450);
const x1 = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setJoystick?.(0, 0));
if (x1 < x0 - 6) pass("l3-joystick");
else fail("l3-joystick", `${x0} -> ${x1}`);

// Water blocks: walk north into lower stream west of the bridge.
await ev(() => window.__controlsTest.setPosition(200, 1400));
await ev(() => window.__controlsTest.setKeys(["KeyW"]));
await page.waitForTimeout(900);
const blocked = await ev(() => window.__controlsTest.getY());
await ev(() => window.__controlsTest.setKeys([]));
if (blocked > 1325) pass("l3-water-blocks", `y=${blocked.toFixed(0)}`);
else fail("l3-water-blocks", `walked into water y=${blocked}`);

// Center bridge is traversable.
await ev(() => window.__controlsTest.setPosition(504, 1400));
await ev(() => window.__controlsTest.setKeys(["KeyW"]));
await page.waitForTimeout(2200);
const crossed = await ev(() => window.__controlsTest.getY());
await ev(() => window.__controlsTest.setKeys([]));
if (crossed < 1140) pass("l3-bridge-center", `y=${crossed.toFixed(0)}`);
else fail("l3-bridge-center", `stuck y=${crossed}`);

// Upper-left bridge.
await ev(() => window.__controlsTest.setPosition(310, 620));
await ev(() => window.__controlsTest.setKeys(["KeyW"]));
await page.waitForTimeout(2000);
const crossedL = await ev(() => window.__controlsTest.getY());
await ev(() => window.__controlsTest.setKeys([]));
if (crossedL < 390) pass("l3-bridge-left", `y=${crossedL.toFixed(0)}`);
else fail("l3-bridge-left", `stuck y=${crossedL}`);

// Upper-right bridge.
await ev(() => window.__controlsTest.setPosition(710, 620));
await ev(() => window.__controlsTest.setKeys(["KeyW"]));
await page.waitForTimeout(2000);
const crossedR = await ev(() => window.__controlsTest.getY());
await ev(() => window.__controlsTest.setKeys([]));
if (crossedR < 390) pass("l3-bridge-right", `y=${crossedR.toFixed(0)}`);
else fail("l3-bridge-right", `stuck y=${crossedR}`);

const exit0 = await ev(() => window.__controlsTest.getExit?.());
await ev(({ x, y }) => window.__controlsTest.setPosition(x, y + 18), { x: exit0.x, y: exit0.y });
await page.waitForTimeout(300);
const locked = await ev(() => ({
  phase: window.__controlsTest.getPhase?.(),
  banner: window.__controlsTest.getBanner?.(),
  locked: window.__controlsTest.getExit?.()?.locked,
}));
if (locked.phase === "playing" && locked.locked) pass("l3-exit-locked");
else fail("l3-exit-locked", JSON.stringify(locked));
if (/Collect all 6 sunflowers first/i.test(locked.banner || "")) pass("l3-locked-hint");
else fail("l3-locked-hint", String(locked.banner));

const hearts0 = await ev(() => window.__controlsTest.getHearts?.());
const hazards = await ev(() => window.__controlsTest.getHazards?.() ?? []);
if (hazards[0]) {
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x: hazards[0].x, y: hazards[0].y });
  await page.waitForTimeout(280);
}
const hearts1 = await ev(() => window.__controlsTest.getHearts?.());
if (hearts1 < hearts0) pass("l3-beetle-hit", `${hearts0}->${hearts1}`);
else fail("l3-beetle-hit", JSON.stringify({ hearts0, hearts1 }));

await page.getByRole("button", { name: /Pause/i }).click();
await page.waitForTimeout(180);
if (/Take a breath/.test(await page.locator("body").innerText())) pass("l3-pause");
else fail("l3-pause", "missing");
await page.getByRole("button", { name: /Keep wandering/i }).click();
await page.waitForTimeout(180);
if (!/Take a breath/.test(await page.locator("body").innerText())) pass("l3-resume");
else fail("l3-resume", "stuck");

for (let i = 0; i < L3.length; i++) {
  const [x, y] = L3[i];
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x, y });
  await page.waitForTimeout(220);
  const n = await ev(() => window.__controlsTest.getCollected?.());
  if (n === i + 1) pass(`l3-sunflower-${i + 1}`, `${n}/6`);
  else fail(`l3-sunflower-${i + 1}`, String(n));
}

await page.waitForTimeout(400);
const afterSix = await ev(() => ({
  phase: window.__controlsTest.getPhase?.(),
  collected: window.__controlsTest.getCollected?.(),
  remaining: window.__controlsTest.flowerCount?.(),
  unlocked: window.__controlsTest.isGateUnlocked?.(),
  banner: window.__controlsTest.getBanner?.(),
  subtitle: window.__controlsTest.getSubtitle?.(),
}));
if (afterSix.phase === "playing") pass("l3-sixth-no-win");
else fail("l3-sixth-no-win", JSON.stringify(afterSix));
if (afterSix.collected === 6 && afterSix.remaining === 0) pass("l3-counter-6-6");
else fail("l3-counter-6-6", JSON.stringify(afterSix));
if (afterSix.unlocked) pass("l3-gate-unlocked");
else fail("l3-gate-unlocked", JSON.stringify(afterSix));
if (/riverside path has opened/i.test(afterSix.banner || "")) pass("l3-unlock-banner");
else fail("l3-unlock-banner", String(afterSix.banner));
if (/Reach the garden gate/i.test(afterSix.subtitle || "")) pass("l3-objective");
else fail("l3-objective", String(afterSix.subtitle));

const exit1 = await ev(() => window.__controlsTest.getExit?.());
await ev(({ x, y }) => window.__controlsTest.setPosition(x, y + 8), { x: exit1.x, y: exit1.y });
await page.waitForTimeout(500);
const winText = await page.locator("body").innerText();
if (/Sunflower Crossing complete/i.test(winText)) pass("l3-complete");
else fail("l3-complete", winText.slice(0, 260));
if (/Continue to Twin Bloom Garden/i.test(winText)) pass("l3-continue-l4");
else fail("l3-continue-l4", winText.slice(0, 200));

const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
if (!overflow) pass("mobile-no-h-overflow");
else fail("mobile-no-h-overflow", "overflow");
if (errors.length) fail("console-errors", errors.slice(0, 6).join(" | "));
else pass("console-errors");

console.log("\n=== SUMMARY ===");
const failed = out.filter((r) => !r.ok);
console.log(`passed ${out.filter((r) => r.ok).length} / ${out.length}`);
failed.forEach((f) => console.log(" -", f.name, f.detail));
await page.screenshot({ path: "/workspace/screenshots/qa-level3.png", fullPage: true });
await browser.close();
process.exit(failed.length ? 1 : 0);
