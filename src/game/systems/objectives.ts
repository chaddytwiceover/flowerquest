import { getGameState, patchGameState, type ObjectiveProgress } from "../state";
import type { CollectObjective, FlowerKind, LevelDef } from "../types";

export function resolveObjectives(level: LevelDef): CollectObjective[] {
  if (level.objectives && level.objectives.length > 0) return level.objectives;
  return [
    {
      type: "collect",
      collectible: "any",
      required: level.flowers.length,
      label: level.collectibleLabel ?? "",
    },
  ];
}

export function flowersNeeded(level: LevelDef): number {
  return resolveObjectives(level).reduce((sum, obj) => sum + obj.required, 0);
}

function toProgress(level: LevelDef): ObjectiveProgress[] {
  return resolveObjectives(level).map((obj) => ({
    collectible: obj.collectible,
    label: obj.label,
    icon: obj.collectible === "any" ? level.collectibleIcon : obj.collectible,
    collected: 0,
    required: obj.required,
  }));
}

export function noteCollected(
  level: LevelDef,
  kind: FlowerKind | string,
): { collected: number; needed: number; met: boolean } {
  const objectives = getGameState().objectives.map((obj) => {
    const matches = obj.collectible === "any" || obj.collectible === kind;
    if (!matches || obj.collected >= obj.required) return obj;
    return { ...obj, collected: obj.collected + 1 };
  });
  const collected = objectives.reduce((sum, obj) => sum + obj.collected, 0);
  const needed = flowersNeeded(level);
  const met = objectives.every((obj) => obj.collected >= obj.required);
  patchGameState({ flowersCollected: collected, flowersNeeded: needed, objectives });
  return { collected, needed, met };
}

export function objectiveMet(_level?: LevelDef): boolean {
  const { objectives, flowersCollected, flowersNeeded } = getGameState();
  if (objectives.length === 0) return flowersCollected >= flowersNeeded;
  return objectives.every((obj) => obj.collected >= obj.required);
}

/** Remaining-requirement copy for a locked gate. */
export function lockedExitHint(fallback: string): string {
  const { objectives } = getGameState();
  if (objectives.length < 2) return fallback;
  const bits = objectives
    .filter((obj) => obj.collected < obj.required)
    .map((obj) => `${obj.required - obj.collected} ${obj.label.toLowerCase()}`);
  if (!bits.length) return fallback;
  return `Still need ${bits.join(" and ")}!`;
}

export function showBanner(text: string) {
  patchGameState({ banner: text });
}

export function clearBanner() {
  if (getGameState().banner) patchGameState({ banner: null });
}

export function applyLevelHud(level: LevelDef) {
  const objectives = toProgress(level);
  patchGameState({
    phase: "playing",
    levelId: level.id,
    levelNumber: level.number,
    levelName: level.name,
    levelSubtitle: level.objectiveText,
    flowersCollected: 0,
    flowersNeeded: flowersNeeded(level),
    hearts: level.hearts,
    heartsMax: level.hearts,
    banner: null,
    gateUnlocked: false,
    collectibleLabel: level.collectibleLabel,
    collectibleIcon: level.collectibleIcon,
    objectives,
  });
}
