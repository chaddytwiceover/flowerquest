import assert from "node:assert/strict";
import test from "node:test";
import { actions, attachInput, detachInput, setJoystick, updateActions } from "../src/game/input.ts";

test("blocked gamepad access preserves touch movement across frames", (t) => {
  if (!navigator.getGamepads) {
    Object.defineProperty(navigator, "getGamepads", { configurable: true, value: () => [] });
    t.after(() => delete navigator.getGamepads);
  }
  const getPads = t.mock.method(navigator, "getGamepads", () => {
    throw new DOMException("Gamepads are blocked", "SecurityError");
  });
  try {
    setJoystick(0.5, 0);
    updateActions();
    updateActions();
    assert.equal(actions.moveX, 0.5);
    assert.equal(getPads.mock.callCount(), 1);
  } finally {
    setJoystick(0, 0);
  }
});

test("Space keeps its native action while movement keys still steer", () => {
  globalThis.window = new EventTarget();
  globalThis.document = new EventTarget();
  try {
    attachInput();
    function press(code) {
      const event = Object.assign(new Event("keydown", { cancelable: true }), { code });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    }
    assert.equal(press("Space"), false);
    assert.equal(press("ArrowLeft"), true);
    updateActions();
    assert.equal(actions.moveX, -1);
  } finally {
    detachInput();
    delete globalThis.window;
    delete globalThis.document;
  }
});
