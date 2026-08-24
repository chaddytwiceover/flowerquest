import type { LevelDef } from "../types";

/**
 * Level 6 — Honeycomb Hollow ⭐ (Safe introductory breather level for Bees)
 *
 * Map is 1408×1408. Golden meadow with buzzing bee hives and flower patches.
 */
export const level6: LevelDef = {
  id: "level-6",
  number: 6,
  name: "Honeycomb Hollow",
  objectiveText: "Collect 8 golden blooms. Beware the alert bees!",
  collectibleLabel: "Blooms",
  collectibleIcon: "sunflower",
  environment: {
    mapKey: "map-level-1",
    mapUrl: "/game/maps/level1-base.jpg",
    width: 1408,
    height: 1408,
    boundsInset: 40,
  },
  playerSpawn: { x: 704, y: 1240 },
  playerSpeed: 165,
  hearts: 3,
  music: "hollow",
  completeOn: "reach-exit",
  exit: {
    x: 704,
    y: 160,
    unlockAt: "all-flowers",
    lockedHint: "Gather all 8 golden blooms first!",
    unlockedHint: "The Honeycomb Gate has opened!",
    unlockedObjective: "Reach the Honeycomb Gate.",
  },
  flowers: [
    { kind: "sunflower", x: 380, y: 1050 },
    { kind: "sunflower", x: 1020, y: 1050 },
    { kind: "daisy", x: 300, y: 720 },
    { kind: "daisy", x: 1100, y: 720 },
    { kind: "sunflower", x: 520, y: 550 },
    { kind: "sunflower", x: 880, y: 550 },
    { kind: "daisy", x: 704, y: 380 },
    { kind: "sunflower", x: 704, y: 760 },
  ],
  powerBlooms: [
    { kind: "swift", x: 420, y: 880 },
    { kind: "swift", x: 980, y: 880 },
  ],
  hazards: [
    {
      kind: "beetle",
      x: 450,
      y: 1100,
      speed: 46,
      patrol: [
        { x: 300, y: 1100 },
        { x: 600, y: 1100 },
      ],
    },
    {
      kind: "beetle",
      x: 950,
      y: 1100,
      speed: 46,
      patrol: [
        { x: 800, y: 1100 },
        { x: 1100, y: 1100 },
      ],
    },
    {
      kind: "bee",
      x: 450,
      y: 600,
      speed: 52,
      chaseSpeed: 180,
      detectRadius: 180,
      leashRadius: 300,
      patrol: [
        { x: 350, y: 600 },
        { x: 550, y: 600 },
      ],
    },
    {
      kind: "bee",
      x: 950,
      y: 600,
      speed: 52,
      chaseSpeed: 180,
      detectRadius: 180,
      leashRadius: 300,
      patrol: [
        { x: 850, y: 600 },
        { x: 1050, y: 600 },
      ],
    },
  ],
  obstacles: [
    { kind: "tree", x: 130, y: 180, height: 180, collides: true },
    { kind: "tree", x: 1270, y: 170, height: 190, collides: true },
    { kind: "tree", x: 110, y: 1280, height: 160, collides: true },
    { kind: "tree", x: 1300, y: 1285, height: 170, collides: true },
    { kind: "bush", x: 540, y: 920, height: 72, collides: true },
    { kind: "bush", x: 860, y: 920, height: 72, collides: true },
    { kind: "stump", x: 704, y: 600, height: 60, collides: true },
  ],
  walls: [],
  completion: {
    winKicker: "Hollow harvested",
    winTitle: "Level 6 Complete",
    winBody: "Monnie outmaneuvered the buzzing bees and gathered all 8 blooms.",
    loseKicker: "Stung!",
    loseTitle: "Out of hearts",
    loseBody: "Monnie collected {collected} of {needed} blooms. Watch for the bees' warning '!' alert!",
  },
};
