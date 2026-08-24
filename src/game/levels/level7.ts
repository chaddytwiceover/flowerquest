import type { LevelDef } from "../types";

/**
 * Level 7 — Briar Patch
 *
 * Map is 1152×1728. Dense thorn clusters, winding paths, 2 beetles and 3 bees.
 */
export const level7: LevelDef = {
  id: "level-7",
  number: 7,
  name: "Briar Patch",
  objectiveText: "Collect 10 flowers scattered through the briars.",
  collectibleLabel: "Flowers",
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
    y: 190,
    unlockAt: "all-flowers",
    lockedHint: "Collect all 10 flowers first!",
    unlockedHint: "The Briar Gate has cleared!",
    unlockedObjective: "Reach the Briar Gate.",
  },
  flowers: [
    { kind: "tulip", x: 280, y: 1450 },
    { kind: "rose", x: 870, y: 1450 },
    { kind: "daisy", x: 320, y: 1150 },
    { kind: "bluebell", x: 830, y: 1150 },
    { kind: "tulip", x: 576, y: 950 },
    { kind: "rose", x: 260, y: 750 },
    { kind: "sunflower", x: 890, y: 750 },
    { kind: "daisy", x: 420, y: 500 },
    { kind: "bluebell", x: 730, y: 500 },
    { kind: "rose", x: 576, y: 340 },
  ],
  powerBlooms: [
    { kind: "frost", x: 576, y: 1300 },
    { kind: "swift", x: 576, y: 680 },
  ],
  hazards: [
    {
      kind: "beetle",
      x: 350,
      y: 1350,
      speed: 48,
      patrol: [
        { x: 250, y: 1350 },
        { x: 500, y: 1350 },
      ],
    },
    {
      kind: "beetle",
      x: 800,
      y: 1350,
      speed: 48,
      patrol: [
        { x: 650, y: 1350 },
        { x: 920, y: 1350 },
      ],
    },
    {
      kind: "bee",
      x: 320,
      y: 950,
      speed: 54,
      chaseSpeed: 185,
      detectRadius: 180,
      leashRadius: 290,
      patrol: [
        { x: 240, y: 950 },
        { x: 440, y: 950 },
      ],
    },
    {
      kind: "bee",
      x: 830,
      y: 950,
      speed: 54,
      chaseSpeed: 185,
      detectRadius: 180,
      leashRadius: 290,
      patrol: [
        { x: 720, y: 950 },
        { x: 930, y: 950 },
      ],
    },
    {
      kind: "bee",
      x: 576,
      y: 420,
      speed: 56,
      chaseSpeed: 190,
      detectRadius: 190,
      leashRadius: 300,
      patrol: [
        { x: 460, y: 420 },
        { x: 690, y: 420 },
      ],
    },
  ],
  obstacles: [
    { kind: "tree", x: 80, y: 160, height: 170, collides: true },
    { kind: "tree", x: 1070, y: 160, height: 170, collides: true },
    { kind: "bush", x: 450, y: 1150, height: 72, collides: true },
    { kind: "bush", x: 700, y: 1150, height: 72, collides: true },
    { kind: "rock", x: 380, y: 750, height: 66, collides: true },
    { kind: "rock", x: 770, y: 750, height: 66, collides: true },
  ],
  walls: [],
  completion: {
    winKicker: "Briars cleared",
    winTitle: "Level 7 Complete",
    winBody: "Monnie navigated the thorny gauntlet and found all 10 blossoms.",
    loseKicker: "Tangled!",
    loseTitle: "Out of hearts",
    loseBody: "Monnie gathered {collected} of {needed} flowers. Use Frost Petals to freeze the swarms!",
  },
};
