/**
 * One action layer for keyboard, touch joystick, and gamepad.
 * Gameplay should only read `actions` — never raw events.
 */

export const actions = {
  moveX: 0,
  moveY: 0,
};

const keys = new Set<string>();
const joystick = { x: 0, y: 0 };
let keyOverride: string[] | null = null;
let attached = false;

const GAME_KEYS = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowLeft",
  "ArrowDown",
  "ArrowRight",
  "Space",
]);

function onKeyDown(event: KeyboardEvent) {
  if (GAME_KEYS.has(event.code)) event.preventDefault();
  keys.add(event.code);
}

function onKeyUp(event: KeyboardEvent) {
  keys.delete(event.code);
}

function clearKeys() {
  keys.clear();
}

export function setJoystick(x: number, y: number) {
  joystick.x = x;
  joystick.y = y;
}

export function setKeyOverride(codes: string[] | null) {
  keyOverride = codes;
}

function onVisibilityChange() {
  if (document.hidden) clearKeys();
}

export function attachInput() {
  if (attached || typeof window === "undefined") return;
  attached = true;
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", clearKeys);
  document.addEventListener("visibilitychange", onVisibilityChange);
}

export function detachInput() {
  if (!attached || typeof window === "undefined") return;
  attached = false;
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  window.removeEventListener("blur", clearKeys);
  document.removeEventListener("visibilitychange", onVisibilityChange);
  keys.clear();
  joystick.x = 0;
  joystick.y = 0;
  keyOverride = null;
  actions.moveX = 0;
  actions.moveY = 0;
}

function radialDeadzone(x: number, y: number, dz = 0.15) {
  const mag = Math.hypot(x, y);
  if (mag < dz) return { x: 0, y: 0 };
  const scale = (mag - dz) / (1 - dz) / mag;
  return { x: x * scale, y: y * scale };
}

function readGamepad(): { x: number; y: number } {
  if (typeof navigator === "undefined" || !navigator.getGamepads) {
    return { x: 0, y: 0 };
  }
  const pads = navigator.getGamepads();
  for (const pad of pads) {
    if (!pad) continue;
    const stick = radialDeadzone(pad.axes[0] ?? 0, pad.axes[1] ?? 0);
    const dpadX = (pad.buttons[15]?.pressed ? 1 : 0) - (pad.buttons[14]?.pressed ? 1 : 0);
    const dpadY = (pad.buttons[13]?.pressed ? 1 : 0) - (pad.buttons[12]?.pressed ? 1 : 0);
    const x = stick.x + dpadX;
    const y = stick.y + dpadY;
    if (x !== 0 || y !== 0) return { x, y };
  }
  return { x: 0, y: 0 };
}

/** Call once per frame before movement. */
export function updateActions() {
  const codes = keyOverride ?? [...keys];
  let x = keyOverride ? 0 : joystick.x;
  let y = keyOverride ? 0 : joystick.y;

  if (codes.includes("KeyA") || codes.includes("ArrowLeft")) x -= 1;
  if (codes.includes("KeyD") || codes.includes("ArrowRight")) x += 1;
  if (codes.includes("KeyW") || codes.includes("ArrowUp")) y -= 1;
  if (codes.includes("KeyS") || codes.includes("ArrowDown")) y += 1;

  if (!keyOverride) {
    const pad = readGamepad();
    x += pad.x;
    y += pad.y;
  }

  const mag = Math.hypot(x, y);
  if (mag > 1) {
    x /= mag;
    y /= mag;
  }

  actions.moveX = x;
  actions.moveY = y;
}
