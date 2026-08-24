import type { LevelDef } from "../types";

/**
 * Level 2 — Tulip Trail
 *
 * Map is 1152×1728. Collect 5 tulips, then walk to the north garden gate.
 */
export const level2: LevelDef = {
  id: "level-2",
  number: 2,
  name: "Tulip Trail",
  objectiveText: "Collect 5 tulips, then reach the garden gate.",
  collectibleLabel: "Tulips",
  collectibleIcon: "tulip",
  environment: {
    mapKey: "map-level-2",
    mapUrl: "/game/maps/level2-base.jpg",
    width: 1152,
    height: 1728,
    boundsInset: 42,
  },
  playerSpawn: { x: 576, y: 1580 },
  playerSpeed: 165,
  hearts: 3,
  music: "trail",
  completeOn: "reach-exit",
  exit: {
    x: 576,
    y: 210,
    unlockAt: "all-flowers",
    lockedHint: "Collect all 5 tulips first!",
    unlockedHint: "The garden gate has opened!",
    unlockedObjective: "Reach the garden gate.",
  },
  flowers: [
    { kind: "tulip", x: 250, y: 1480 },
    { kind: "tulip", x: 980, y: 1360 },
    { kind: "tulip", x: 220, y: 980 },
    { kind: "tulip", x: 980, y: 760 },
    { kind: "tulip", x: 400, y: 430 },
  ],
  powerBlooms: [
    { kind: "swift", x: 576, y: 880 },
  ],
  hazards: [
    {
      kind: "beetle",
      x: 560,
      y: 1080,
      speed: 46,
      patrol: [
        { x: 500, y: 1080 },
        { x: 740, y: 1080 },
      ],
    },
    {
      kind: "beetle",
      x: 620,
      y: 560,
      speed: 42,
      patrol: [
        { x: 620, y: 460 },
        { x: 620, y: 700 },
      ],
    },
  ],
  obstacles: [
    { kind: "tree", x: 70, y: 170, height: 176, collides: true },
    { kind: "tree", x: 1080, y: 165, height: 182, collides: true },
    { kind: "tree", x: 80, y: 1640, height: 158, collides: true },
    { kind: "tree", x: 1085, y: 1650, height: 164, collides: true },
    { kind: "tree", x: 150, y: 400, height: 160, collides: true },
    { kind: "tree", x: 1010, y: 390, height: 168, collides: true },
    { kind: "tree", x: 200, y: 720, height: 150, collides: true },
    { kind: "tree", x: 990, y: 1120, height: 154, collides: true },
    { kind: "tree", x: 360, y: 1260, height: 142, collides: true },
    { kind: "tree", x: 860, y: 520, height: 148, collides: true },
    { kind: "bush", x: 400, y: 1120, height: 70, collides: true },
    { kind: "bush", x: 780, y: 900, height: 68, collides: true },
    { kind: "bush", x: 300, y: 620, height: 72, collides: true },
    { kind: "bush", x: 840, y: 1460, height: 70, collides: true },
    { kind: "rock", x: 180, y: 1320, height: 64, collides: true },
    { kind: "rock", x: 1000, y: 640, height: 66, collides: true },
    { kind: "rock", x: 700, y: 1300, height: 60, collides: true },
    { kind: "stump", x: 470, y: 860, height: 58, collides: true },
    { kind: "pot", x: 500, y: 300, height: 52, collides: true },
    { kind: "pot", x: 650, y: 318, height: 54, collides: true },
  ],
  walls: [
    { x: 0, y: 0, w: 500, h: 96 },
    { x: 652, y: 0, w: 500, h: 96 },
  ],
  completion: {
    winKicker: "Trail complete",
    winTitle: "Tulip Trail complete",
    winBody: "Monnie gathered every tulip and slipped through the garden gate.",
    loseKicker: "Oh beetles",
    loseTitle: "Out of hearts",
    loseBody:
      "Monnie found {collected} of {needed} tulips. Give the beetles a wider berth on the trail.",
  },
};
