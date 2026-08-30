import assert from "node:assert/strict";
import test from "node:test";
import {
  actions,
  updateActions,
  setJoystick,
  setKeyOverride,
  attachInput,
  detachInput,
} from "../src/game/input.ts";

test("updateActions default state (no input)", () => {
  detachInput();
  updateActions();
  assert.equal(actions.moveX, 0);
  assert.equal(actions.moveY, 0);
});

test("updateActions joystick input and magnitude clamping", () => {
  detachInput();
  setJoystick(0.5, -0.5);
  updateActions();
  assert.equal(actions.moveX, 0.5);
  assert.equal(actions.moveY, -0.5);

  // Clamped magnitude when hypot > 1
  setJoystick(2, 0);
  updateActions();
  assert.equal(actions.moveX, 1);
  assert.equal(actions.moveY, 0);

  setJoystick(0, 0);
  updateActions();
});

test("updateActions keyOverride behavior", () => {
  detachInput();
  setJoystick(1, 1); // Joystick should be ignored when keyOverride is active
  setKeyOverride(["KeyA", "KeyW"]);
  updateActions();

  // KeyA moves x by -1, KeyW moves y by -1. Magnitude = hypot(-1, -1) = sqrt(2) ~ 1.414, normalized to -0.707...
  const expectedMag = Math.hypot(-1, -1);
  assert.equal(actions.moveX, -1 / expectedMag);
  assert.equal(actions.moveY, -1 / expectedMag);

  setKeyOverride(null);
  setJoystick(0, 0);
  updateActions();
  assert.equal(actions.moveX, 0);
  assert.equal(actions.moveY, 0);
});

test("updateActions keyboard input events via window event listener mock", () => {
  detachInput();
  const listeners = new Map();
  const mockWindow = {
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    removeEventListener(type) {
      listeners.delete(type);
    },
  };

  globalThis.window = mockWindow;
  globalThis.document = { hidden: false, addEventListener() {}, removeEventListener() {} };

  attachInput();

  const keydown = listeners.get("keydown");
  const keyup = listeners.get("keyup");

  // Press 'D' and 'S'
  keydown({ code: "KeyD", preventDefault() {} });
  keydown({ code: "KeyS", preventDefault() {} });
  updateActions();

  const expectedMag = Math.hypot(1, 1);
  assert.equal(actions.moveX, 1 / expectedMag);
  assert.equal(actions.moveY, 1 / expectedMag);

  // Release 'D'
  keyup({ code: "KeyD" });
  updateActions();
  assert.equal(actions.moveX, 0);
  assert.equal(actions.moveY, 1);

  // Release 'S'
  keyup({ code: "KeyS" });
  updateActions();
  assert.equal(actions.moveX, 0);
  assert.equal(actions.moveY, 0);

  detachInput();
  delete globalThis.window;
  delete globalThis.document;
});

test("benchmark updateActions baseline / comparison", () => {
  detachInput();
  setKeyOverride(null);

  const iterations = 5_000_000;
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    updateActions();
  }
  const end = performance.now();
  const elapsedMs = end - start;
  const opsPerSec = (iterations / elapsedMs) * 1000;

  console.log(`\n--- BENCHMARK RESULTS ---`);
  console.log(`Iterations: ${iterations.toLocaleString()}`);
  console.log(`Time: ${elapsedMs.toFixed(2)} ms`);
  console.log(`Throughput: ${Math.round(opsPerSec).toLocaleString()} ops/sec`);
  console.log(`-------------------------\n`);
});
