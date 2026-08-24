import type { MusicId } from "./audio";

export type FlowerKind = "daisy" | "tulip" | "rose" | "sunflower" | "bluebell";
export type ObstacleKind = "tree" | "bush" | "rock" | "stump" | "pot" | "arch";
export type HazardKind = "beetle" | "bee" | "wasp";
export type PowerUpKind = "swift" | "frost" | "heart";
export type CompleteOn = "collect-all" | "reach-exit";

export type Point = { x: number; y: number };

export type FlowerSpot = Point & {
  kind: FlowerKind;
};

export type PowerBloomDef = Point & {
  kind: PowerUpKind;
};

export type CollectObjective = {
  type: "collect";
  /** Specific kind, or "any" to count every flower (Levels 1–3). */
  collectible: FlowerKind | "any";
  required: number;
  label: string;
};

export type HazardDef = {
  kind: HazardKind;
  x: number;
  y: number;
  speed: number;
  patrol?: Point[];
  /** Guard area / origin for territorial wasps or bee hives */
  guardZone?: { x: number; y: number; radius: number };
  /** Detection distance to trigger alert/chase */
  detectRadius?: number;
  /** Max chase speed */
  chaseSpeed?: number;
  /** Distance from origin before giving up chase */
  leashRadius?: number;
};

export type ObstacleDef = {
  kind: ObstacleKind;
  x: number;
  y: number;
  /** Display height in world pixels. */
  height: number;
  collides?: boolean;
};

export type WallDef = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type BridgeDef = {
  x: number;
  y: number;
  displayWidth: number;
  displayHeight: number;
};

export type ExitDef = {
  x: number;
  y: number;
  /** Gate stays locked until this many flowers are picked. */
  unlockAt: number | "all-flowers";
  lockedHint: string;
  unlockedHint: string;
  unlockedObjective: string;
};

export type LevelCompletionCopy = {
  winKicker: string;
  winTitle: string;
  winBody: string;
  loseKicker: string;
  loseTitle: string;
  loseBody: string;
};

export type LevelEnvironment = {
  mapKey: string;
  mapUrl: string;
  width: number;
  height: number;
  boundsInset: number;
};

/**
 * Everything unique about a level lives here.
 * Gameplay code reads this data — it should not hard-code placements.
 */
export type LevelDef = {
  id: string;
  number: number;
  name: string;
  /** Shown on the start screen and HUD. */
  objectiveText: string;
  environment: LevelEnvironment;
  playerSpawn: Point;
  playerSpeed: number;
  hearts: number;
  flowers: FlowerSpot[];
  powerBlooms?: PowerBloomDef[];
  obstacles: ObstacleDef[];
  hazards: HazardDef[];
  walls: WallDef[];
  /**
   * Impassable water bands. Leave gaps in these rects for bridges.
   * Levels without streams omit this.
   */
  water?: WallDef[];
  /** Walkable crossings. Visual only — collision comes from water gaps. */
  bridges?: BridgeDef[];
  /**
   * Optional exit / gate. Ignored when `completeOn` is `collect-all`.
   */
  exit: ExitDef | null;
  completeOn: CompleteOn;
  completion: LevelCompletionCopy;
  /** HUD counter word, e.g. "Tulips". Omit to keep the Level 1 look. */
  collectibleLabel: string | null;
  collectibleIcon: FlowerKind;
  /** Looping garden theme for this level. */
  music: MusicId;
  /**
   * Multi-requirement collect objectives. When omitted, the level counts
   * every flower toward a single bucket (Levels 1–3).
   */
  objectives?: CollectObjective[];
};
