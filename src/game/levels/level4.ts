import type { LevelDef } from "../types";

/**
 * Level 4 — Twin Bloom Garden
 *
 * Map is 1152×1728. West = roses, east = bluebells.
 * Both counters must complete before the north gate unlocks.
 */
export const level4: LevelDef = {
  id: "level-4",
  number: 4,
  name: "Twin Bloom Garden",
  objectiveText: "Collect 3 roses and 3 bluebells, then reach the gate.",
  collectibleLabel: null,
  collectibleIcon: "rose",
  environment: {
    mapKey: "map-level-4",
    mapUrl: "/game/maps/level4-base.jpg",
    width: 1152,
    height: 1728,
    boundsInset: 42,
  },
  playerSpawn: { x: 576, y: 1580 },
  playerSpeed: 165,
  hearts: 3,
  music: "twin",
  completeOn: "reach-exit",
  objectives: [
    { type: "collect", collectible: "rose", required: 3, label: "Roses" },
    { type: "collect", collectible: "bluebell", required: 3, label: "Bluebells" },
  ],
  exit: {
    x: 576,
    y: 180,
    unlockAt: "all-flowers",
    lockedHint: "Collect all roses and bluebells first!",
    unlockedHint: "The Twin Bloom Gate has opened!",
    unlockedObjective: "Reach the garden gate.",
  },
  flowers: [
    { kind: "rose", x: 240, y: 1320 },
    { kind: "rose", x: 280, y: 920 },
    { kind: "rose", x: 230, y: 500 },
    { kind: "bluebell", x: 920, y: 1320 },
    { kind: "bluebell", x: 870, y: 900 },
    { kind: "bluebell", x: 930, y: 500 },
  ],
  powerBlooms: [
    { kind: "swift", x: 280, y: 700 },
    { kind: "frost", x: 870, y: 700 },
  ],
  hazards: [
    {
      kind: "beetle",
      x: 280,
      y: 1100,
      speed: 44,
      patrol: [
        { x: 200, y: 1100 },
        { x: 400, y: 1100 },
      ],
    },
    {
      kind: "beetle",
      x: 880,
      y: 1100,
      speed: 44,
      patrol: [
        { x: 780, y: 1100 },
        { x: 980, y: 1100 },
      ],
    },
    {
      kind: "beetle",
      x: 576,
      y: 760,
      speed: 42,
      patrol: [
        { x: 500, y: 760 },
        { x: 660, y: 760 },
      ],
    },
    {
      kind: "bee",
      x: 576,
      y: 450,
      speed: 55,
      chaseSpeed: 180,
      detectRadius: 180,
      leashRadius: 280,
      patrol: [
        { x: 480, y: 450 },
        { x: 670, y: 450 },
      ],
    },
  ],
  obstacles: [
    { kind: "tree", x: 80, y: 140, height: 170, collides: true },
    { kind: "tree", x: 1070, y: 140, height: 174, collides: true },
    { kind: "tree", x: 80, y: 1660, height: 156, collides: true },
    { kind: "tree", x: 1070, y: 1660, height: 160, collides: true },
    { kind: "tree", x: 90, y: 720, height: 148, collides: true },
    { kind: "tree", x: 1060, y: 720, height: 150, collides: true },
    { kind: "bush", x: 180, y: 1080, height: 70, collides: true },
    { kind: "bush", x: 360, y: 640, height: 68, collides: true },
    { kind: "bush", x: 200, y: 1480, height: 66, collides: true },
    { kind: "rock", x: 960, y: 1080, height: 64, collides: true },
    { kind: "rock", x: 800, y: 640, height: 62, collides: true },
    { kind: "rock", x: 980, y: 1480, height: 60, collides: true },
    { kind: "stump", x: 500, y: 640, height: 56, collides: true },
    { kind: "pot", x: 500, y: 280, height: 50, collides: true },
    { kind: "pot", x: 650, y: 280, height: 52, collides: true },
  ],
  walls: [
    { x: 0, y: 0, w: 500, h: 88 },
    { x: 652, y: 0, w: 500, h: 88 },
  ],
  completion: {
    winKicker: "Twin blooms",
    winTitle: "Twin Bloom Garden complete",
    winBody: "Monnie gathered every rose and bluebell, then slipped through the twin gate.",
    loseKicker: "Oh beetles",
    loseTitle: "Out of hearts",
    loseBody:
      "Monnie found {collected} of {needed} blooms. Visit both gardens — red and blue.",
  },
};
