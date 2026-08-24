import type { LevelDef } from "../types";

/**
 * Level 1 — The Meadow Gate
 *
 * Coordinates are in map pixels (the background is 1408×1408).
 * This file is the reference layout. Future levels should copy the shape,
 * not the GameScene code.
 */
export const level1: LevelDef = {
  id: "level-1",
  number: 1,
  name: "The Meadow Gate",
  objectiveText: "Collect 8 flowers. Watch for beetles.",
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
  collectibleLabel: null,
  collectibleIcon: "daisy",
  music: "meadow",
  completeOn: "collect-all",
  exit: null,
  flowers: [
    { kind: "daisy", x: 430, y: 430 },
    { kind: "tulip", x: 980, y: 410 },
    { kind: "rose", x: 390, y: 820 },
    { kind: "sunflower", x: 1010, y: 790 },
    { kind: "daisy", x: 700, y: 500 },
    { kind: "tulip", x: 560, y: 680 },
    { kind: "rose", x: 860, y: 660 },
    { kind: "sunflower", x: 710, y: 900 },
  ],
  powerBlooms: [
    { kind: "swift", x: 700, y: 700 },
  ],
  hazards: [
    {
      kind: "beetle",
      x: 700,
      y: 560,
      speed: 58,
      patrol: [
        { x: 700, y: 540 },
        { x: 900, y: 640 },
        { x: 700, y: 780 },
        { x: 500, y: 640 },
      ],
    },
    {
      kind: "beetle",
      x: 280,
      y: 520,
      speed: 50,
      patrol: [
        { x: 260, y: 480 },
        { x: 260, y: 860 },
      ],
    },
    {
      kind: "beetle",
      x: 1140,
      y: 500,
      speed: 54,
      patrol: [
        { x: 1140, y: 440 },
        { x: 1140, y: 820 },
      ],
    },
  ],
  obstacles: [
    { kind: "tree", x: 130, y: 180, height: 180, collides: true },
    { kind: "tree", x: 1270, y: 170, height: 190, collides: true },
    { kind: "tree", x: 110, y: 1280, height: 160, collides: true },
    { kind: "tree", x: 1300, y: 1285, height: 170, collides: true },
    { kind: "bush", x: 340, y: 640, height: 72, collides: true },
    { kind: "bush", x: 1100, y: 980, height: 70, collides: true },
    { kind: "rock", x: 1110, y: 540, height: 70, collides: true },
    { kind: "rock", x: 300, y: 1000, height: 68, collides: true },
    { kind: "stump", x: 560, y: 600, height: 62, collides: true },
    { kind: "pot", x: 860, y: 590, height: 56, collides: true },
  ],
  walls: [],
  completion: {
    winKicker: "Garden gathered",
    winTitle: "Level 1 complete",
    winBody: "Monnie picked every bloom — {needed} flowers of the meadow.",
    loseKicker: "Oh beetles",
    loseTitle: "Out of hearts",
    loseBody:
      "Monnie found {collected} of {needed} flowers. Try a wider path around the beetles.",
  },
};
