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
const L2 = [[250, 1480], [980, 1360], [220, 980], [980, 760], [400, 430]];
const L3 = [[230, 1560], [800, 1500], [504, 900], [230, 300], [790, 300], [330, 190]];
const L4R = [[240, 1320], [280, 920], [230, 500]];
const L4B = [[920, 1320], [870, 900], [930, 500]];
const L5 = [[576, 1460], [250, 980], [576, 720], [90, 680], [1050, 200]];

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
const ev = (fn, arg) => page.evaluate(fn, arg);
const skip = async (pts, wait = 150) => {
  for (const [x, y] of pts) {
    await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x, y });
    await page.waitForTimeout(wait);
  }
};
const goExit = async () => {
  const e = await ev(() => window.__controlsTest.getExit?.());
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y + 8), { x: e.x, y: e.y });
  await page.waitForTimeout(400);
};

await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
const play = page.getByRole("button", { name: /Play as Monnie|Play Level/i });
await play.waitFor({ timeout: 20000 });
await page.waitForFunction(() => {
  const b = [...document.querySelectorAll("button")].find((el) => /Play/.test(el.textContent || ""));
  return b && !b.disabled;
}, null, { timeout: 20000 });
await play.click();
await page.waitForFunction(() => typeof window.__controlsTest?.getX === "function", null, { timeout: 10000 });
await page.waitForTimeout(180);

await skip(L1, 120);
await page.waitForTimeout(250);
if (/Level 1 complete/.test(await page.locator("body").innerText())) pass("l1-complete");
else fail("l1-complete", "no win");
await page.getByRole("button", { name: /Continue to Tulip Trail/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-2", null, { timeout: 8000 });
await skip(L2, 180);
await goExit();
if (/Tulip Trail complete/i.test(await page.locator("body").innerText())) pass("l2-complete");
else fail("l2-complete", "no win");
await page.getByRole("button", { name: /Continue to Sunflower Crossing/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-3", null, { timeout: 8000 });
await skip(L3, 190);
await goExit();
if (/Sunflower Crossing complete/i.test(await page.locator("body").innerText())) pass("l3-complete");
else fail("l3-complete", "no win");
await page.getByRole("button", { name: /Continue to Twin Bloom Garden/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-4", null, { timeout: 8000 });
await skip(L4R, 200);
await skip(L4B, 200);
await goExit();
const l4text = await page.locator("body").innerText();
if (/Twin Bloom Garden complete/i.test(l4text)) pass("l4-complete");
else fail("l4-complete", l4text.slice(0, 180));
if (/Continue to Rosewood Maze/i.test(l4text)) pass("l4-continue-l5");
else fail("l4-continue-l5", l4text.slice(0, 180));

await page.getByRole("button", { name: /Continue to Rosewood Maze/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-5", null, { timeout: 8000 });
await page.waitForTimeout(350);

const spawn = await ev(() => ({ x: window.__controlsTest.getX(), y: window.__controlsTest.getY() }));
if (Math.abs(spawn.x - 576) < 8 && Math.abs(spawn.y - 1580) < 8) pass("l5-spawn", JSON.stringify(spawn));
else fail("l5-spawn", JSON.stringify(spawn));

const hud = await page.locator("body").innerText();
if (/ROSES/i.test(hud) && /0\/5/.test(hud)) pass("l5-hud");
else fail("l5-hud", hud.slice(0, 220));

await ev(() => window.__controlsTest.setKeys(["KeyA"]));
await page.waitForTimeout(280);
const afterA = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setKeys([]));
if (afterA < spawn.x - 6) pass("l5-A-left");
else fail("l5-A-left", String(afterA));

await ev(() => window.__controlsTest.setKeys([]));
const x0 = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setJoystick?.(-1, 0));
await page.waitForTimeout(400);
const x1 = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setJoystick?.(0, 0));
if (x1 < x0 - 6) pass("l5-joystick");
else fail("l5-joystick", `${x0}->${x1}`);

// Hedge blocks: walk north into the entrance hedge between corridors.
await ev(() => window.__controlsTest.setPosition(410, 1420));
await ev(() => window.__controlsTest.setKeys(["KeyW"]));
await page.waitForTimeout(900);
const blocked = await ev(() => window.__controlsTest.getY());
await ev(() => window.__controlsTest.setKeys([]));
if (blocked > 1355) pass("l5-hedge-blocks", `y=${blocked.toFixed(0)}`);
else fail("l5-hedge-blocks", `walked through hedge y=${blocked}`);

// Center corridor is traversable through the entrance gap.
await ev(() => window.__controlsTest.setPosition(576, 1420));
await ev(() => window.__controlsTest.setKeys(["KeyW"]));
await page.waitForTimeout(1800);
const crossed = await ev(() => window.__controlsTest.getY());
await ev(() => window.__controlsTest.setKeys([]));
if (crossed < 1260) pass("l5-corridor-open", `y=${crossed.toFixed(0)}`);
else fail("l5-corridor-open", `stuck y=${crossed}`);

const exit0 = await ev(() => window.__controlsTest.getExit?.());
await ev(({ x, y }) => window.__controlsTest.setPosition(x, y + 18), { x: exit0.x, y: exit0.y });
await page.waitForTimeout(280);
const locked = await ev(() => ({
  phase: window.__controlsTest.getPhase?.(),
  banner: window.__controlsTest.getBanner?.(),
  locked: window.__controlsTest.getExit?.()?.locked,
}));
if (locked.phase === "playing" && locked.locked) pass("l5-exit-locked");
else fail("l5-exit-locked", JSON.stringify(locked));
if (/Find all 5 roses first/i.test(locked.banner || "")) pass("l5-locked-hint");
else fail("l5-locked-hint", String(locked.banner));

const hearts0 = await ev(() => window.__controlsTest.getHearts?.());
const hazards = await ev(() => window.__controlsTest.getHazards?.() ?? []);
if (hazards[0]) {
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x: hazards[0].x, y: hazards[0].y });
  await page.waitForTimeout(280);
}
const hearts1 = await ev(() => window.__controlsTest.getHearts?.());
if (hearts1 < hearts0) pass("l5-beetle-hit", `${hearts0}->${hearts1}`);
else fail("l5-beetle-hit", JSON.stringify({ hearts0, hearts1 }));

await page.getByRole("button", { name: /Pause/i }).click();
await page.waitForTimeout(150);
if (/Take a breath/.test(await page.locator("body").innerText())) pass("l5-pause");
else fail("l5-pause", "missing");
await page.getByRole("button", { name: /Keep wandering/i }).click();
await page.waitForTimeout(150);

for (let i = 0; i < L5.length; i++) {
  const [x, y] = L5[i];
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x, y });
  await page.waitForTimeout(220);
  const n = await ev(() => window.__controlsTest.getCollected?.());
  if (n === i + 1) pass(`l5-rose-${i + 1}`, `${n}/5`);
  else fail(`l5-rose-${i + 1}`, String(n));
}

await page.waitForTimeout(350);
const afterFive = await ev(() => ({
  phase: window.__controlsTest.getPhase?.(),
  collected: window.__controlsTest.getCollected?.(),
  remaining: window.__controlsTest.flowerCount?.(),
  unlocked: window.__controlsTest.isGateUnlocked?.(),
  banner: window.__controlsTest.getBanner?.(),
  subtitle: window.__controlsTest.getSubtitle?.(),
}));
if (afterFive.phase === "playing") pass("l5-fifth-no-win");
else fail("l5-fifth-no-win", JSON.stringify(afterFive));
if (afterFive.collected === 5 && afterFive.remaining === 0) pass("l5-counter-5-5");
else fail("l5-counter-5-5", JSON.stringify(afterFive));
if (afterFive.unlocked) pass("l5-gate-unlocked");
else fail("l5-gate-unlocked", JSON.stringify(afterFive));
if (/Rosewood Gate has opened/i.test(afterFive.banner || "")) pass("l5-unlock-banner");
else fail("l5-unlock-banner", String(afterFive.banner));
if (/Reach the garden gate/i.test(afterFive.subtitle || "")) pass("l5-objective");
else fail("l5-objective", String(afterFive.subtitle));

const exit1 = await ev(() => window.__controlsTest.getExit?.());
await ev(({ x, y }) => window.__controlsTest.setPosition(x, y + 8), { x: exit1.x, y: exit1.y });
await page.waitForTimeout(450);
const winText = await page.locator("body").innerText();
if (/Rosewood Maze complete/i.test(winText)) pass("l5-complete");
else fail("l5-complete", winText.slice(0, 260));
if (/That's all for now/i.test(winText)) pass("l5-no-level-6");
else fail("l5-no-level-6", winText.slice(0, 200));
if (/Continue to/.test(winText)) fail("l5-no-continue-l6", "unexpected continue");
else pass("l5-no-continue-l6");

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
await page.screenshot({ path: "/workspace/screenshots/qa-level5.png", fullPage: true });
await browser.close();
process.exit(failed.length ? 1 : 0);
