import type { LevelDef } from "../types";
import { level1 } from "./level1";
import { level2 } from "./level2";
import { level3 } from "./level3";
import { level4 } from "./level4";
import { level5 } from "./level5";

/** Every playable level. Add a new file and push it here to expand. */
export const LEVELS: LevelDef[] = [level1, level2, level3, level4, level5];

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
