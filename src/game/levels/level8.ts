import type { LevelDef } from "../types";

/**
 * Level 8 — The Wasp Garden ⭐ (Safe introductory level for Wasps)
 *
 * Map is 1152×1728. Guarded pavilions with stationary territorial wasps.
 */
export const level8: LevelDef = {
  id: "level-8",
  number: 8,
  name: "The Wasp Garden",
  objectiveText: "Collect 8 guarded blooms. Don't step into wasp territory!",
  collectibleLabel: "Blooms",
  collectibleIcon: "bluebell",
  environment: {
    mapKey: "map-level-8",
    mapUrl: "/game/maps/level8-base.jpg",
    width: 1152,
    height: 1728,
    boundsInset: 40,
  },
  playerSpawn: { x: 576, y: 1600 },
  playerSpeed: 165,
  hearts: 3,
  music: "crossing",
  completeOn: "reach-exit",
  exit: {
    x: 576,
    y: 160,
    unlockAt: "all-flowers",
    lockedHint: "Collect all 8 guarded blooms first!",
    unlockedHint: "The Sanctuary Gate has opened!",
    unlockedObjective: "Reach the Sanctuary Gate.",
  },
  flowers: [
    { kind: "bluebell", x: 280, y: 1460 },
    { kind: "bluebell", x: 870, y: 1460 },
    { kind: "bluebell", x: 300, y: 1050 }, // near left wasp zone
    { kind: "bluebell", x: 850, y: 1050 }, // near right wasp zone
    { kind: "bluebell", x: 576, y: 880 },
    { kind: "bluebell", x: 280, y: 480 },
    { kind: "bluebell", x: 870, y: 480 },
    { kind: "bluebell", x: 576, y: 300 },
  ],
  powerBlooms: [
    { kind: "frost", x: 576, y: 1350 },
    { kind: "heart", x: 576, y: 650 },
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
      x: 800,
      y: 1400,
      speed: 50,
      chaseSpeed: 175,
      detectRadius: 170,
      leashRadius: 280,
      patrol: [
        { x: 700, y: 1400 },
        { x: 900, y: 1400 },
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
      x: 870,
      y: 1050,
      speed: 40,
      chaseSpeed: 215,
      guardZone: { x: 870, y: 1050, radius: 140 },
      detectRadius: 150,
      leashRadius: 220,
    },
  ],
  obstacles: [
    { kind: "prop-wasp-nest", x: 280, y: 1000, height: 75, collides: true },
    { kind: "prop-wasp-nest", x: 870, y: 1000, height: 75, collides: true },
    { kind: "tree", x: 120, y: 180, height: 180, collides: true },
    { kind: "tree", x: 1030, y: 180, height: 180, collides: true },
    { kind: "bush", x: 300, y: 880, height: 72, collides: true },
    { kind: "bush", x: 850, y: 880, height: 72, collides: true },
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
