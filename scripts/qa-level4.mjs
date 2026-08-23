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
const ROSES = [[240, 1320], [280, 920], [230, 500]];
const BELLS = [[920, 1320], [870, 900], [930, 500]];

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

await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
const play = page.getByRole("button", { name: /Play as Monnie|Play Level/i });
await play.waitFor({ timeout: 20000 });
await page.waitForFunction(() => {
  const b = [...document.querySelectorAll("button")].find((el) => /Play/.test(el.textContent || ""));
  return b && !b.disabled;
}, null, { timeout: 20000 });
await play.click();
await page.waitForFunction(() => typeof window.__controlsTest?.getX === "function", null, { timeout: 10000 });
await page.waitForTimeout(200);

await skip(L1, 130);
await page.waitForTimeout(300);
if (/Level 1 complete/.test(await page.locator("body").innerText())) pass("l1-complete");
else fail("l1-complete", "no win");
await page.getByRole("button", { name: /Continue to Tulip Trail/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-2", null, { timeout: 8000 });

await skip(L2, 190);
const e2 = await ev(() => window.__controlsTest.getExit?.());
await ev(({ x, y }) => window.__controlsTest.setPosition(x, y + 8), { x: e2.x, y: e2.y });
await page.waitForTimeout(350);
if (/Tulip Trail complete/i.test(await page.locator("body").innerText())) pass("l2-complete");
else fail("l2-complete", "no win");
await page.getByRole("button", { name: /Continue to Sunflower Crossing/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-3", null, { timeout: 8000 });

await skip(L3, 200);
const e3 = await ev(() => window.__controlsTest.getExit?.());
await ev(({ x, y }) => window.__controlsTest.setPosition(x, y + 8), { x: e3.x, y: e3.y });
await page.waitForTimeout(400);
const l3text = await page.locator("body").innerText();
if (/Sunflower Crossing complete/i.test(l3text)) pass("l3-complete");
else fail("l3-complete", l3text.slice(0, 180));
if (/Continue to Twin Bloom Garden/i.test(l3text)) pass("l3-continue-l4");
else fail("l3-continue-l4", l3text.slice(0, 180));

await page.getByRole("button", { name: /Continue to Twin Bloom Garden/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-4", null, { timeout: 8000 });
await page.waitForTimeout(350);

const spawn = await ev(() => ({ x: window.__controlsTest.getX(), y: window.__controlsTest.getY() }));
if (Math.abs(spawn.x - 576) < 8 && Math.abs(spawn.y - 1580) < 8) pass("l4-spawn", JSON.stringify(spawn));
else fail("l4-spawn", JSON.stringify(spawn));

const hud = await page.locator("body").innerText();
if (/ROSES/i.test(hud) && /BLUEBELLS/i.test(hud) && /0\/3/.test(hud)) pass("l4-hud-both");
else fail("l4-hud-both", hud.slice(0, 240));

await ev(() => window.__controlsTest.setKeys(["KeyA"]));
await page.waitForTimeout(280);
const afterA = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setKeys([]));
if (afterA < spawn.x - 6) pass("l4-A-left");
else fail("l4-A-left", String(afterA));

await ev(() => window.__controlsTest.setKeys([]));
const x0 = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setJoystick?.(-1, 0));
await page.waitForTimeout(400);
const x1 = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setJoystick?.(0, 0));
if (x1 < x0 - 6) pass("l4-joystick");
else fail("l4-joystick", `${x0}->${x1}`);

const kinds = await ev(() => {
  const objs = window.__controlsTest.getObjectives?.() ?? [];
  return objs.map((o) => o.collectible);
});
if (kinds.includes("rose") && kinds.includes("bluebell")) pass("l4-two-objectives", kinds.join(","));
else fail("l4-two-objectives", JSON.stringify(kinds));

await skip(ROSES, 220);
const afterRoses = await ev(() => {
  const objs = window.__controlsTest.getObjectives?.() ?? [];
  const rose = objs.find((o) => o.collectible === "rose");
  const bell = objs.find((o) => o.collectible === "bluebell");
  return {
    rose: rose && `${rose.collected}/${rose.required}`,
    bell: bell && `${bell.collected}/${bell.required}`,
    unlocked: window.__controlsTest.isGateUnlocked?.(),
    phase: window.__controlsTest.getPhase?.(),
  };
});
if (afterRoses.rose === "3/3") pass("l4-roses-3-3", afterRoses.rose);
else fail("l4-roses-3-3", JSON.stringify(afterRoses));
if (afterRoses.bell === "0/3") pass("l4-bells-untouched", afterRoses.bell);
else fail("l4-bells-untouched", JSON.stringify(afterRoses));
if (afterRoses.unlocked === false && afterRoses.phase === "playing") pass("l4-roses-only-still-locked");
else fail("l4-roses-only-still-locked", JSON.stringify(afterRoses));

const exit0 = await ev(() => window.__controlsTest.getExit?.());
await ev(({ x, y }) => window.__controlsTest.setPosition(x, y + 18), { x: exit0.x, y: exit0.y });
await page.waitForTimeout(300);
const hint = await ev(() => window.__controlsTest.getBanner?.());
if (/bluebell/i.test(hint || "") || /Still need/i.test(hint || "")) pass("l4-locked-hint", hint);
else fail("l4-locked-hint", String(hint));

await skip(BELLS, 220);
await page.waitForTimeout(350);
const afterBoth = await ev(() => {
  const objs = window.__controlsTest.getObjectives?.() ?? [];
  const rose = objs.find((o) => o.collectible === "rose");
  const bell = objs.find((o) => o.collectible === "bluebell");
  return {
    rose: rose && `${rose.collected}/${rose.required}`,
    bell: bell && `${bell.collected}/${bell.required}`,
    remaining: window.__controlsTest.flowerCount?.(),
    unlocked: window.__controlsTest.isGateUnlocked?.(),
    phase: window.__controlsTest.getPhase?.(),
    banner: window.__controlsTest.getBanner?.(),
    subtitle: window.__controlsTest.getSubtitle?.(),
  };
});
if (afterBoth.bell === "3/3") pass("l4-bells-3-3");
else fail("l4-bells-3-3", JSON.stringify(afterBoth));
if (afterBoth.remaining === 0) pass("l4-all-collected");
else fail("l4-all-collected", String(afterBoth.remaining));
if (afterBoth.phase === "playing") pass("l4-sixth-no-win");
else fail("l4-sixth-no-win", JSON.stringify(afterBoth));
if (afterBoth.unlocked) pass("l4-gate-unlocked");
else fail("l4-gate-unlocked", JSON.stringify(afterBoth));
if (/Twin Bloom Gate has opened/i.test(afterBoth.banner || "")) pass("l4-unlock-banner");
else fail("l4-unlock-banner", String(afterBoth.banner));
if (/Reach the garden gate/i.test(afterBoth.subtitle || "")) pass("l4-objective");
else fail("l4-objective", String(afterBoth.subtitle));

const hearts0 = await ev(() => window.__controlsTest.getHearts?.());
const hazards = await ev(() => window.__controlsTest.getHazards?.() ?? []);
if (hazards[0]) {
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x: hazards[0].x, y: hazards[0].y });
  await page.waitForTimeout(280);
}
const hearts1 = await ev(() => window.__controlsTest.getHearts?.());
if (hearts1 < hearts0) pass("l4-beetle-hit", `${hearts0}->${hearts1}`);
else fail("l4-beetle-hit", JSON.stringify({ hearts0, hearts1 }));

await page.getByRole("button", { name: /Pause/i }).click();
await page.waitForTimeout(160);
if (/Take a breath/.test(await page.locator("body").innerText())) pass("l4-pause");
else fail("l4-pause", "missing");
await page.getByRole("button", { name: /Keep wandering/i }).click();
await page.waitForTimeout(160);

const exit1 = await ev(() => window.__controlsTest.getExit?.());
await ev(({ x, y }) => window.__controlsTest.setPosition(x, y + 8), { x: exit1.x, y: exit1.y });
await page.waitForTimeout(450);
const winText = await page.locator("body").innerText();
if (/Twin Bloom Garden complete/i.test(winText)) pass("l4-complete");
else fail("l4-complete", winText.slice(0, 260));
if (/That's all for now/i.test(winText)) fail("l4-now-continues", "still end-of-build");
if (/Continue to Rosewood Maze/i.test(winText)) pass("l4-continue-l5");
else fail("l4-continue-l5", winText.slice(0, 200));

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
await page.screenshot({ path: "/workspace/screenshots/qa-level4.png", fullPage: true });
await browser.close();
process.exit(failed.length ? 1 : 0);
