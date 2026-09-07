import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:8080/";
const output = resolve("screenshots/reliability");
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    // Google Fonts is optional and blocked in restricted/offline test environments.
    // Sprite/map assertions below still fail if a required game asset is absent.
    if (
      message.type() === "error" &&
      !message.text().includes("ERR_NETWORK_ACCESS_DENIED")
    ) {
      errors.push(message.text());
    }
  });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const start = page.getByRole("button", { name: "Start Adventure", exact: true });
  await start.waitFor({ state: "visible", timeout: 90000 });
  await start.click();

  const waitLevel = (id) =>
    page.waitForFunction(
      (levelId) =>
        window.__controlsTest?.getLevelId?.() === levelId &&
        window.__controlsTest?.getPhase?.() === "playing",
      id,
    );
  const waitPhase = (phase) =>
    page.waitForFunction((value) => window.__controlsTest?.getPhase?.() === value, phase);
  const api = (method, arg) =>
    page.evaluate(({ method, arg }) => window.__flowerQuestApi[method](arg), { method, arg });
  const snapshot = () => page.evaluate(() => window.__controlsTest.getSnapshot());
  const teleport = (point) =>
    page.evaluate(({ x, y }) => window.__controlsTest.setPosition(x, y), point);
  const frost = () => page.evaluate(() => window.__controlsTest.activatePowerUp("frost"));

  await waitLevel("level-1");
  const player = await page.evaluate(() => window.__controlsTest.getPlayerRender());
  assert.deepEqual(
    { active: player.active, visible: player.visible, texture: player.texture },
    { active: true, visible: true, texture: "player" },
  );
  assert.ok(player.displayWidth >= 110 && player.displayHeight >= 110);

  for (const [width, height] of [
    [390, 844],
    [393, 852],
    [430, 932],
  ]) {
    await page.setViewportSize({ width, height });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await page.screenshot({ path: resolve(output, `playing-${width}x${height}.png`) });
  }

  await page.getByRole("button", { name: "Pause Game", exact: true }).click();
  await waitPhase("paused");
  await page.screenshot({ path: resolve(output, "paused-430x932.png") });
  await api("resume");
  await waitPhase("playing");
  console.log("PASS visible player, portrait layouts, pause and resume");

  await frost();
  const hazard = await page.evaluate(() => window.__controlsTest.getHazards()[0]);
  const hearts = (await snapshot()).hearts;
  await teleport(hazard);
  await page.waitForTimeout(250);
  assert.equal((await snapshot()).hearts, hearts, "frozen enemy overlap must not hurt");
  await page.evaluate(() => window.__controlsTest.clearPowerUps());
  await teleport(hazard);
  await page.waitForTimeout(250);
  assert.equal((await snapshot()).hearts, hearts - 1, "normal enemy overlap still hurts");
  console.log("PASS Frost Petal protection and normal enemy damage");

  const levels = await page.evaluate(async () => (await import("/src/game/levels/index.ts")).LEVELS);
  for (const level of levels) {
    await api("startLevel", level.id);
    await waitLevel(level.id);
    assert.equal((await snapshot()).flowersCollected, 0);
    assert.equal((await snapshot()).hearts, level.hearts);
    const hazards = await page.evaluate(() => window.__controlsTest.getHazardRender());
    for (const hazardRender of hazards) {
      assert.equal(hazardRender.active, true);
      assert.equal(hazardRender.visible, true);
      assert.ok(["beetle", "bee-sprite", "wasp-sprite"].includes(hazardRender.texture));
      assert.ok(hazardRender.displayWidth >= 50 && hazardRender.displayHeight >= 50);
    }
    for (const flower of level.flowers) {
      await frost();
      await teleport(flower);
      await page.waitForTimeout(100);
    }
    if (level.exit) {
      assert.equal(await page.evaluate(() => window.__controlsTest.isGateUnlocked()), true);
      await teleport(level.exit);
    }
    await waitPhase("won");
    await api("pause");
    assert.equal((await snapshot()).phase, "won", "pause must preserve victory");
    console.log(`PASS ${level.id} load, collect, gate, completion`);
  }
  await page.screenshot({ path: resolve(output, "campaign-complete.png") });

  await api("startLevel", "level-1");
  await waitLevel("level-1");
  for (let hit = 0; hit < 3; hit += 1) {
    const target = await page.evaluate(() => window.__controlsTest.getHazards()[0]);
    await teleport(target);
    await page.waitForTimeout(1500);
  }
  await waitPhase("lost");
  await api("pause");
  assert.equal((await snapshot()).phase, "lost", "pause must preserve loss");
  await api("restart");
  await waitLevel("level-1");
  assert.equal((await snapshot()).hearts, 3);
  await api("quitToMenu");
  await page.getByRole("button", { name: "Start Adventure", exact: true }).waitFor({
    state: "visible",
  });
  assert.deepEqual(errors, []);
  console.log("PASS loss, result preservation, restart, menu, browser console");
} finally {
  await browser.close();
}
