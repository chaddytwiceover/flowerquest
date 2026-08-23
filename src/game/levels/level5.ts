import type { LevelDef } from "../types";

/**
 * Level 5 — Rosewood Maze
 *
 * Map is 1152×1728. A light hedge maze: three north–south corridors,
 * two cross-paths, one mild dead-end, one side pocket.
 *
 * Hedges are `walls` rectangles. Arches are decorative obstacles.
 */
export const level5: LevelDef = {
  id: "level-5",
  number: 5,
  name: "Rosewood Maze",
  objectiveText: "Collect 5 roses, then reach the garden gate.",
  collectibleLabel: "Roses",
  collectibleIcon: "rose",
  environment: {
    mapKey: "map-level-5",
    mapUrl: "/game/maps/level5-base.jpg",
    width: 1152,
    height: 1728,
    boundsInset: 40,
  },
  playerSpawn: { x: 576, y: 1580 },
  playerSpeed: 165,
  hearts: 3,
  music: "maze",
  completeOn: "reach-exit",
  objectives: [{ type: "collect", collectible: "rose", required: 5, label: "Roses" }],
  exit: {
    x: 576,
    y: 150,
    unlockAt: "all-flowers",
    lockedHint: "Find all 5 roses first!",
    unlockedHint: "The Rosewood Gate has opened!",
    unlockedObjective: "Reach the garden gate.",
  },
  flowers: [
    { kind: "rose", x: 576, y: 1460 }, // entry garden
    { kind: "rose", x: 250, y: 980 }, // left corridor
    { kind: "rose", x: 576, y: 720 }, // central plaza
    { kind: "rose", x: 90, y: 680 }, // mild dead-end
    { kind: "rose", x: 1050, y: 200 }, // side path
  ],
  hazards: [
    {
      kind: "beetle",
      x: 576,
      y: 980,
      speed: 42,
      patrol: [
        { x: 420, y: 980 },
        { x: 730, y: 980 },
      ],
    },
    {
      kind: "beetle",
      x: 250,
      y: 800,
      speed: 40,
      patrol: [
        { x: 190, y: 800 },
        { x: 320, y: 800 },
      ],
    },
    {
      kind: "beetle",
      x: 576,
      y: 360,
      speed: 40,
      patrol: [
        { x: 500, y: 360 },
        { x: 650, y: 360 },
      ],
    },
  ],
  obstacles: [
    { kind: "arch", x: 576, y: 1320, height: 150, collides: false },
    { kind: "arch", x: 576, y: 430, height: 150, collides: false },
    { kind: "tree", x: 80, y: 120, height: 160, collides: true },
    { kind: "tree", x: 1070, y: 120, height: 164, collides: true },
    { kind: "tree", x: 80, y: 1660, height: 150, collides: true },
    { kind: "tree", x: 1070, y: 1660, height: 154, collides: true },
    { kind: "pot", x: 500, y: 250, height: 50, collides: true },
    { kind: "pot", x: 650, y: 250, height: 52, collides: true },
    { kind: "bush", x: 200, y: 1480, height: 64, collides: true },
    { kind: "rock", x: 940, y: 1480, height: 60, collides: true },
  ],
  walls: [
    // North plaza — gate gap 500–652
    { x: 0, y: 0, w: 500, h: 90 },
    { x: 652, y: 0, w: 500, h: 90 },

    // Upper hedge with three corridor gaps (160–340, 486–666, 812–992)
    { x: 0, y: 220, w: 160, h: 80 },
    { x: 340, y: 220, w: 146, h: 80 },
    { x: 666, y: 220, w: 146, h: 80 },
    { x: 992, y: 220, w: 108, h: 80 },

    // Right-side path stays open at x=992–1100, y=90–220; close the far edge
    { x: 1100, y: 90, w: 52, h: 210 },

    // Vertical hedge between left and center corridors (gap at cross y=880–1060)
    { x: 340, y: 300, w: 146, h: 580 },
    { x: 340, y: 1060, w: 146, h: 228 },

    // Vertical hedge between center and right
    { x: 666, y: 300, w: 146, h: 580 },
    { x: 666, y: 1060, w: 146, h: 228 },

    // Outer west hedge, with a bite for the dead-end alcove (x=40–160, y=600–760)
    { x: 0, y: 300, w: 160, h: 300 },
    { x: 0, y: 600, w: 40, h: 160 },
    { x: 0, y: 760, w: 160, h: 528 },

    // Outer east hedge
    { x: 992, y: 300, w: 160, h: 988 },

    // South maze entrance hedge with three gaps
    { x: 0, y: 1288, w: 160, h: 72 },
    { x: 340, y: 1288, w: 146, h: 72 },
    { x: 666, y: 1288, w: 146, h: 72 },
    { x: 992, y: 1288, w: 160, h: 72 },

    // Keep the player from walking around the maze along the south rim
    { x: 0, y: 1360, w: 80, h: 368 },
    { x: 1072, y: 1360, w: 80, h: 368 },
  ],
  completion: {
    winKicker: "Maze complete",
    winTitle: "Rosewood Maze complete",
    winBody: "Monnie wound through the hedges, gathered every rose, and reached the Rosewood Gate.",
    loseKicker: "Oh beetles",
    loseTitle: "Out of hearts",
    loseBody: "Monnie found {collected} of {needed} roses. The hedges are solid — try another path.",
  },
};
