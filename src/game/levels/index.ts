import type { LevelDef } from "../types";
import { level1 } from "./level1";
import { level2 } from "./level2";
import { level3 } from "./level3";
import { level4 } from "./level4";
import { level5 } from "./level5";
import { level6 } from "./level6";
import { level7 } from "./level7";
import { level8 } from "./level8";
import { level9 } from "./level9";
import { level10 } from "./level10";

/** Every playable level (1 to 10). */
export const LEVELS: LevelDef[] = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
];

export function getLevel(id: string): LevelDef {
  const found = LEVELS.find((level) => level.id === id);
  if (!found) {
    throw new Error(`Unknown level: ${id}`);
  }
  return found;
}

export function getLevelByNumber(number: number): LevelDef | undefined {
  return LEVELS.find((level) => level.number === number);
}

export function getNextLevel(currentId: string): LevelDef | undefined {
  const current = getLevel(currentId);
  return getLevelByNumber(current.number + 1);
}

