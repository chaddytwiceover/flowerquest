import type { PowerUpKind } from "./types";

export type Phase = "boot" | "menu" | "playing" | "paused" | "won" | "lost";

export type ObjectiveProgress = {
  collectible: string;
  label: string;
  icon: string;
  collected: number;
  required: number;
};

export type GameSnapshot = {
  phase: Phase;
  loadProgress: number;
  assetsReady: boolean;
  levelId: string;
  levelNumber: number;
  levelName: string;
  levelSubtitle: string;
  flowersCollected: number;
  flowersNeeded: number;
  hearts: number;
  heartsMax: number;
  banner: string | null;
  gateUnlocked: boolean;
  collectibleLabel: string | null;
  collectibleIcon: string;
  objectives: ObjectiveProgress[];
  activePowerUp: PowerUpKind | null;
  powerUpRemaining: number;
  powerUpTotal: number;
};

const initial: GameSnapshot = {
  phase: "boot",
  loadProgress: 0,
  assetsReady: false,
  levelId: "level-1",
  levelNumber: 1,
  levelName: "The Meadow Gate",
  levelSubtitle: "Collect 8 flowers. Watch for beetles.",
  flowersCollected: 0,
  flowersNeeded: 8,
  hearts: 3,
  heartsMax: 3,
  banner: null,
  gateUnlocked: false,
  collectibleLabel: null,
  collectibleIcon: "daisy",
  objectives: [],
  activePowerUp: null,
  powerUpRemaining: 0,
  powerUpTotal: 0,
};

let snapshot: GameSnapshot = { ...initial };
const listeners = new Set<(state: GameSnapshot) => void>();

export function getGameState(): GameSnapshot {
  return snapshot;
}

export function patchGameState(partial: Partial<GameSnapshot>): void {
  snapshot = { ...snapshot, ...partial };
  listeners.forEach((fn) => fn(snapshot));
}

export function subscribeGameState(fn: (state: GameSnapshot) => void): () => void {
  listeners.add(fn);
  fn(snapshot);
  return () => {
    listeners.delete(fn);
  };
}

export function resetRunState(partial?: Partial<GameSnapshot>): void {
  patchGameState({
    flowersCollected: 0,
    hearts: snapshot.heartsMax,
    banner: null,
    gateUnlocked: false,
    activePowerUp: null,
    powerUpRemaining: 0,
    powerUpTotal: 0,
    objectives: snapshot.objectives.map((o) => ({ ...o, collected: 0 })),
    ...partial,
  });
}
