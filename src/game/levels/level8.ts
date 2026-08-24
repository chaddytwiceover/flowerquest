import type { LevelDef } from "../types";

/**
 * Level 8 — The Wasp Garden ⭐ (Safe introductory level for Wasps)
 *
 * Map is 1008×1792 (River garden). Guarded pavilions with stationary territorial wasps.
 */
export const level8: LevelDef = {
  id: "level-8",
  number: 8,
  name: "The Wasp Garden",
  objectiveText: "Collect 8 guarded blooms. Don't step into wasp territory!",
  collectibleLabel: "Blooms",
  collectibleIcon: "bluebell",
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
    y: 140,
    unlockAt: "all-flowers",
    lockedHint: "Collect all 8 guarded blooms first!",
    unlockedHint: "The Sanctuary Gate has opened!",
    unlockedObjective: "Reach the Sanctuary Gate.",
  },
  flowers: [
    { kind: "bluebell", x: 260, y: 1540 },
    { kind: "bluebell", x: 750, y: 1540 },
    { kind: "bluebell", x: 300, y: 1100 }, // near left wasp zone
    { kind: "bluebell", x: 710, y: 1100 }, // near right wasp zone
    { kind: "bluebell", x: 504, y: 880 },
    { kind: "bluebell", x: 250, y: 480 },
    { kind: "bluebell", x: 750, y: 480 },
    { kind: "bluebell", x: 504, y: 280 },
  ],
  powerBlooms: [
    { kind: "frost", x: 504, y: 1350 },
    { kind: "heart", x: 504, y: 650 },
  ],
  hazards: [
    {
      kind: "bee",
      x: 350,
      y: 1400,
      speed: 50,
      chaseSpeed: 175,
      detectRadius: 170,
      leashRadius: 280,
      patrol: [
        { x: 250, y: 1400 },
        { x: 450, y: 1400 },
      ],
    },
    {
      kind: "bee",
      x: 650,
      y: 1400,
      speed: 50,
      chaseSpeed: 175,
      detectRadius: 170,
      leashRadius: 280,
      patrol: [
        { x: 550, y: 1400 },
        { x: 750, y: 1400 },
      ],
    },
    {
      kind: "wasp",
      x: 280,
      y: 1050,
      speed: 40,
      chaseSpeed: 215,
      guardZone: { x: 280, y: 1050, radius: 140 },
      detectRadius: 150,
      leashRadius: 220,
    },
    {
      kind: "wasp",
      x: 730,
      y: 1050,
      speed: 40,
      chaseSpeed: 215,
      guardZone: { x: 730, y: 1050, radius: 140 },
      detectRadius: 150,
      leashRadius: 220,
    },
  ],
  obstacles: [
    { kind: "tree", x: 120, y: 180, height: 180, collides: true },
    { kind: "tree", x: 880, y: 180, height: 180, collides: true },
    { kind: "bush", x: 300, y: 880, height: 72, collides: true },
    { kind: "bush", x: 700, y: 880, height: 72, collides: true },
  ],
  walls: [],
  completion: {
    winKicker: "Sanctuary secure",
    winTitle: "Level 8 Complete",
    winBody: "Monnie outsmarted the territorial wasps and gathered every guarded bloom.",
    loseKicker: "Ambushed!",
    loseTitle: "Out of hearts",
    loseBody: "Monnie picked {collected} of {needed} blooms. Avoid lingering inside wasp guard zones!",
  },
};
