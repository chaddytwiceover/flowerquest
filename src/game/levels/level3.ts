import type { LevelDef } from "../types";

/**
 * Level 3 — Sunflower Crossing
 *
 * Map is 1008×1792. Two streams cut the garden; three bridges cross them.
 * Collect 6 sunflowers, then walk to the north gate.
 *
 * Water collision is a few rectangles with GAPS at the bridges.
 * Walking the gap is walking the bridge — no Level-3-only GameScene code.
 */
export const level3: LevelDef = {
  id: "level-3",
  number: 3,
  name: "Sunflower Crossing",
  objectiveText: "Collect 6 sunflowers, then reach the garden gate.",
  collectibleLabel: "Sunflowers",
  collectibleIcon: "sunflower",
  environment: {
    mapKey: "map-level-3",
    mapUrl: "/game/maps/level3-base.jpg",
    width: 1008,
    height: 1792,
    boundsInset: 40,
  },
  playerSpawn: { x: 504, y: 1680 },
  playerSpeed: 165,
  hearts: 3,
  music: "crossing",
  completeOn: "reach-exit",
  exit: {
    x: 504,
    y: 130,
    unlockAt: "all-flowers",
    lockedHint: "Collect all 6 sunflowers first!",
    unlockedHint: "The riverside path has opened!",
    unlockedObjective: "Reach the garden gate.",
  },
  flowers: [
    { kind: "sunflower", x: 230, y: 1560 },
    { kind: "sunflower", x: 800, y: 1500 },
    { kind: "sunflower", x: 504, y: 900 },
    { kind: "sunflower", x: 230, y: 300 },
    { kind: "sunflower", x: 790, y: 300 },
    { kind: "sunflower", x: 330, y: 190 },
  ],
  hazards: [
    {
      kind: "beetle",
      x: 420,
      y: 1520,
      speed: 44,
      patrol: [
        { x: 300, y: 1520 },
        { x: 680, y: 1520 },
      ],
    },
    {
      kind: "beetle",
      x: 300,
      y: 1388,
      speed: 42,
      patrol: [
        { x: 180, y: 1388 },
        { x: 380, y: 1388 },
      ],
    },
  ],
  obstacles: [
    { kind: "tree", x: 70, y: 120, height: 168, collides: true },
    { kind: "tree", x: 940, y: 120, height: 172, collides: true },
    { kind: "tree", x: 70, y: 1710, height: 156, collides: true },
    { kind: "tree", x: 940, y: 1710, height: 160, collides: true },
    { kind: "tree", x: 90, y: 720, height: 150, collides: true },
    { kind: "tree", x: 930, y: 720, height: 154, collides: true },
    { kind: "tree", x: 80, y: 1080, height: 148, collides: true },
    { kind: "tree", x: 930, y: 1080, height: 150, collides: true },
    { kind: "bush", x: 200, y: 1080, height: 68, collides: true },
    { kind: "bush", x: 800, y: 1080, height: 68, collides: true },
    { kind: "bush", x: 180, y: 720, height: 70, collides: true },
    { kind: "bush", x: 840, y: 1600, height: 66, collides: true },
    { kind: "rock", x: 160, y: 980, height: 62, collides: true },
    { kind: "rock", x: 860, y: 980, height: 64, collides: true },
    { kind: "rock", x: 180, y: 1620, height: 60, collides: true },
    { kind: "stump", x: 620, y: 780, height: 56, collides: true },
    { kind: "pot", x: 440, y: 210, height: 50, collides: true },
    { kind: "pot", x: 570, y: 210, height: 52, collides: true },
  ],
  walls: [
    { x: 0, y: 0, w: 430, h: 80 },
    { x: 578, y: 0, w: 430, h: 80 },
  ],
  water: [
    // Lower stream — gap 380–628 for the center bridge (wide enough for the stick).
    { x: 0, y: 1160, w: 380, h: 170 },
    { x: 628, y: 1160, w: 380, h: 170 },
    // Upper stream — gaps 190–430 (left) and 590–830 (right).
    { x: 0, y: 400, w: 190, h: 160 },
    { x: 430, y: 400, w: 160, h: 160 },
    { x: 830, y: 400, w: 178, h: 160 },
  ],
  bridges: [
    { x: 504, y: 1244, displayWidth: 210, displayHeight: 168 },
    { x: 310, y: 478, displayWidth: 200, displayHeight: 160 },
    { x: 710, y: 478, displayWidth: 200, displayHeight: 160 },
  ],
  completion: {
    winKicker: "Crossing complete",
    winTitle: "Sunflower Crossing complete",
    winBody: "Monnie hopped the streams, gathered every sunflower, and reached the riverside gate.",
    loseKicker: "Oh beetles",
    loseTitle: "Out of hearts",
    loseBody:
      "Monnie found {collected} of {needed} sunflowers. Use the bridges — the water isn't for swimming.",
  },
};
