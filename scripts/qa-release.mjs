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
const errors = [];
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
const ev = (fn, arg) => page.evaluate(fn, arg);
const skip = async (pts, wait = 160) => {
  for (const [x, y] of pts) {
    await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x, y });
    await page.waitForTimeout(wait);
  }
};
const goExit = async () => {
  const e = await ev(() => window.__controlsTest.getExit?.());
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y + 8), { x: e.x, y: e.y });
  await page.waitForTimeout(380);
};
const body = async () => page.locator("body").innerText();
const startPlay = async () => {
  const play = page.getByRole("button", { name: /Play as Monnie|Play Level/i });
  await play.waitFor({ timeout: 20000 });
  await page.waitForFunction(() => {
    const b = [...document.querySelectorAll("button")].find((el) => /Play/.test(el.textContent || ""));
    return b && !b.disabled;
  }, null, { timeout: 20000 });
  await play.click();
  await page.waitForFunction(() => typeof window.__controlsTest?.getX === "function", null, { timeout: 10000 });
  await page.waitForTimeout(200);
};

await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
if (/Flower Quest/.test(await body())) pass("title-screen");
else fail("title-screen", (await body()).slice(0, 80));
await startPlay();
if ((await ev(() => window.__controlsTest.getLevelId?.())) === "level-1") pass("l1-loads");
else fail("l1-loads", await ev(() => window.__controlsTest.getLevelId?.()));

await ev(() => window.__controlsTest.setKeys(["KeyD"]));
await page.waitForTimeout(280);
const afterD = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setKeys([]));
if (afterD > 704) pass("l1-wasd");
else fail("l1-wasd", String(afterD));
await ev(() => window.__controlsTest.setJoystick(1, 0));
await page.waitForTimeout(280);
const afterJ = await ev(() => window.__controlsTest.getX());
await ev(() => window.__controlsTest.setJoystick(0, 0));
if (afterJ > afterD) pass("l1-joystick");
else fail("l1-joystick", `${afterD}->${afterJ}`);

await page.getByRole("button", { name: /Pause/i }).click();
await page.waitForTimeout(160);
if (/Take a breath/.test(await body())) pass("l1-pause");
else fail("l1-pause", "missing");
await page.getByRole("button", { name: /Keep wandering/i }).click();
await page.waitForTimeout(160);

await skip(L1, 130);
await page.waitForTimeout(280);
if (/Level 1 complete/.test(await body())) pass("l1-complete");
else fail("l1-complete", (await body()).slice(0, 160));
await page.getByRole("button", { name: /Continue to Tulip Trail/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-2", null, { timeout: 8000 });
pass("l2-from-l1");

const probeGate = async (label) => {
  const e = await ev(() => window.__controlsTest.getExit?.());
  const before = await ev(() => window.__controlsTest.getPhase?.());
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y + 16), { x: e.x, y: e.y });
  await page.waitForTimeout(260);
  const after = await ev(() => ({
    phase: window.__controlsTest.getPhase?.(),
    locked: window.__controlsTest.getExit?.()?.locked,
    banner: window.__controlsTest.getBanner?.(),
  }));
  if (after.phase === "playing" && after.locked) pass(`l2-gate-locked-${label}`);
  else fail(`l2-gate-locked-${label}`, JSON.stringify({ before, after }));
  return after.banner;
};
const b0 = await probeGate("0");
if (/tulip/i.test(b0 || "") || /Collect all/i.test(b0 || "")) pass("l2-hint-0");
else fail("l2-hint-0", String(b0));
await skip([L2[0]], 200);
const b1 = await probeGate("1");
if (b1) pass("l2-hint-1");
else fail("l2-hint-1", String(b1));
await skip(L2.slice(1, 3), 200);
await probeGate("3");
await skip([L2[3]], 200);
await probeGate("4");
await skip([L2[4]], 220);
await page.waitForTimeout(300);
const l2five = await ev(() => ({
  phase: window.__controlsTest.getPhase?.(),
  collected: window.__controlsTest.getCollected?.(),
  unlocked: window.__controlsTest.isGateUnlocked?.(),
}));
if (l2five.phase === "playing") pass("l2-fifth-no-win");
else fail("l2-fifth-no-win", JSON.stringify(l2five));
if (l2five.unlocked) pass("l2-unlock-at-5");
else fail("l2-unlock-at-5", JSON.stringify(l2five));
await goExit();
if (/Tulip Trail complete/i.test(await body())) pass("l2-complete");
else fail("l2-complete", (await body()).slice(0, 160));
await page.getByRole("button", { name: /Continue to Sunflower Crossing/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-3", null, { timeout: 8000 });
pass("l3-from-l2");

await ev(() => window.__controlsTest.setPosition(200, 1400));
await ev(() => window.__controlsTest.setKeys(["KeyW"]));
await page.waitForTimeout(800);
const waterY = await ev(() => window.__controlsTest.getY());
await ev(() => window.__controlsTest.setKeys([]));
if (waterY > 1325) pass("l3-water-blocks", `y=${waterY.toFixed(0)}`);
else fail("l3-water-blocks", String(waterY));
await ev(() => window.__controlsTest.setPosition(504, 1400));
await ev(() => window.__controlsTest.setKeys(["KeyW"]));
await page.waitForTimeout(2000);
const bridgeY = await ev(() => window.__controlsTest.getY());
await ev(() => window.__controlsTest.setKeys([]));
if (bridgeY < 1160) pass("l3-bridge", `y=${bridgeY.toFixed(0)}`);
else fail("l3-bridge", String(bridgeY));
await skip(L3, 200);
await goExit();
if (/Sunflower Crossing complete/i.test(await body())) pass("l3-complete");
else fail("l3-complete", (await body()).slice(0, 160));
await page.getByRole("button", { name: /Continue to Twin Bloom Garden/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-4", null, { timeout: 8000 });
pass("l4-from-l3");

const l4State = async () => {
  const objs = (await ev(() => window.__controlsTest.getObjectives?.())) || [];
  const rose = objs.find((o) => o.collectible === "rose");
  const bell = objs.find((o) => o.collectible === "bluebell");
  return {
    rose: rose && `${rose.collected}/${rose.required}`,
    bell: bell && `${bell.collected}/${bell.required}`,
    unlocked: await ev(() => window.__controlsTest.isGateUnlocked?.()),
    phase: await ev(() => window.__controlsTest.getPhase?.()),
  };
};

await skip(L4R, 200);
let s = await l4State();
if (s.rose === "3/3" && s.bell === "0/3" && !s.unlocked) pass("l4-A-roses-only");
else fail("l4-A-roses-only", JSON.stringify(s));
await skip(L4B, 200);
s = await l4State();
if (s.rose === "3/3" && s.bell === "3/3" && s.unlocked && s.phase === "playing") pass("l4-A-both");
else fail("l4-A-both", JSON.stringify(s));
await goExit();
if (/Twin Bloom Garden complete/i.test(await body())) pass("l4-A-complete");
else fail("l4-A-complete", (await body()).slice(0, 160));

await page.getByRole("button", { name: /^Play again$/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-4" && window.__controlsTest.getPhase?.() === "playing", null, { timeout: 8000 });
await page.waitForTimeout(200);
await skip(L4B, 200);
s = await l4State();
if (s.bell === "3/3" && s.rose === "0/3" && !s.unlocked) pass("l4-B-bells-only");
else fail("l4-B-bells-only", JSON.stringify(s));
await skip(L4R, 200);
s = await l4State();
if (s.rose === "3/3" && s.bell === "3/3" && s.unlocked) pass("l4-B-both");
else fail("l4-B-both", JSON.stringify(s));
await goExit();
if (/Twin Bloom Garden complete/i.test(await body())) pass("l4-B-complete");
else fail("l4-B-complete", (await body()).slice(0, 120));

await page.getByRole("button", { name: /^Play again$/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getPhase?.() === "playing", null, { timeout: 8000 });
await page.waitForTimeout(200);
const alt = [L4R[0], L4B[0], L4R[1], L4B[1], L4R[2], L4B[2]];
await skip(alt, 200);
s = await l4State();
if (s.rose === "3/3" && s.bell === "3/3" && s.unlocked) pass("l4-C-alternate");
else fail("l4-C-alternate", JSON.stringify(s));
await goExit();
if (/Continue to Rosewood Maze/i.test(await body())) pass("l4-continue-l5");
else fail("l4-continue-l5", (await body()).slice(0, 160));
await page.getByRole("button", { name: /Continue to Rosewood Maze/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-5", null, { timeout: 8000 });
pass("l5-from-l4");

await ev(() => window.__controlsTest.setPosition(410, 1420));
await ev(() => window.__controlsTest.setKeys(["KeyW"]));
await page.waitForTimeout(800);
const hedgeY = await ev(() => window.__controlsTest.getY());
await ev(() => window.__controlsTest.setKeys([]));
if (hedgeY > 1355) pass("l5-hedge-blocks", `y=${hedgeY.toFixed(0)}`);
else fail("l5-hedge-blocks", String(hedgeY));

const hearts0 = await ev(() => window.__controlsTest.getHearts?.());
const hz = await ev(() => window.__controlsTest.getHazards?.() ?? []);
if (hz[0]) {
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x: hz[0].x, y: hz[0].y });
  await page.waitForTimeout(250);
  await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x: hz[0].x, y: hz[0].y });
  await page.waitForTimeout(250);
}
const hearts1 = await ev(() => window.__controlsTest.getHearts?.());
if (hearts1 === hearts0 - 1) pass("l5-iframe-one-heart", `${hearts0}->${hearts1}`);
else fail("l5-iframe-one-heart", `${hearts0}->${hearts1}`);

await skip(L5, 210);
await page.waitForTimeout(300);
const l5five = await ev(() => ({
  phase: window.__controlsTest.getPhase?.(),
  collected: window.__controlsTest.getCollected?.(),
  unlocked: window.__controlsTest.isGateUnlocked?.(),
}));
if (l5five.phase === "playing" && l5five.collected === 5 && l5five.unlocked) pass("l5-fifth-no-win");
else fail("l5-fifth-no-win", JSON.stringify(l5five));
await goExit();
const end = await body();
if (/Lite Demo complete/i.test(end)) pass("demo-complete-card");
else fail("demo-complete-card", end.slice(0, 260));
if (/all five gardens/i.test(end)) pass("demo-complete-copy");
else fail("demo-complete-copy", end.slice(0, 200));
if (/Title screen/i.test(end)) pass("demo-title-cta");
else fail("demo-title-cta", end.slice(0, 160));
if (/Continue to/.test(end)) fail("demo-no-l6", "unexpected continue");
else pass("demo-no-l6");

await page.getByRole("button", { name: /^Play again$/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getLevelId?.() === "level-1", null, { timeout: 8000 });
pass("play-again-starts-l1");

const pack = await ev(() => window.__controlsTest.getHazards?.() ?? []);
if (pack.length) {
  for (let i = 0; i < 3; i++) {
    const now = await ev(() => window.__controlsTest.getHazards?.() ?? []);
    const b = now[now.length - 1] || now[0];
    await ev(({ x, y }) => window.__controlsTest.setPosition(x, y), { x: b.x, y: b.y });
    await page.waitForTimeout(1500);
  }
}
await page.waitForTimeout(400);
if (/Out of hearts|Try again/i.test(await body())) pass("l1-game-over");
else fail("l1-game-over", (await body()).slice(0, 160));
await page.getByRole("button", { name: /Try again/i }).click();
await page.waitForFunction(() => window.__controlsTest?.getPhase?.() === "playing", null, { timeout: 8000 });
const reset = await ev(() => ({
  hearts: window.__controlsTest.getHearts?.(),
  collected: window.__controlsTest.getCollected?.(),
  flowers: window.__controlsTest.flowerCount?.(),
}));
if (reset.hearts === 3 && reset.collected === 0 && reset.flowers === 8) pass("l1-restart-reset", JSON.stringify(reset));
else fail("l1-restart-reset", JSON.stringify(reset));

if (errors.length) fail("console-errors", errors.slice(0, 8).join(" | "));
else pass("console-errors");

const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
if (!overflow) pass("mobile-390-no-overflow");
else fail("mobile-390-no-overflow", "overflow");

console.log("\n=== VIEWPORTS ===");
const viewports = [
  [320, 568],
  [375, 667],
  [390, 844],
  [393, 852],
  [414, 896],
  [430, 932],
  [844, 390],
];
for (const [w, h] of viewports) {
  await page.setViewportSize({ width: w, height: h });
  await page.waitForTimeout(180);
  const info = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    pause: !!document.querySelector('button[aria-label="Pause"]'),
  }));
  if (!info.overflow) pass(`viewport-${w}x${h}`);
  else fail(`viewport-${w}x${h}`, "h-overflow");
}

console.log("\n=== SUMMARY ===");
const failed = out.filter((r) => !r.ok);
console.log(`passed ${out.filter((r) => r.ok).length} / ${out.length}`);
failed.forEach((f) => console.log(" -", f.name, f.detail));
await page.screenshot({ path: "/workspace/screenshots/qa-release.png", fullPage: true });
await browser.close();
process.exit(failed.length ? 1 : 0);
