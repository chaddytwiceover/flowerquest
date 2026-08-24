import type { PowerUpKind } from "../types";
import { patchGameState } from "../state";
import { sfxPowerUp, sfxFreeze } from "../audio";

export type PowerUpState = {
  kind: PowerUpKind | null;
  remainingSec: number;
  totalSec: number;
};

let currentPowerUp: PowerUpState = {
  kind: null,
  remainingSec: 0,
  totalSec: 0,
};

export function activatePowerUp(kind: PowerUpKind, onHeal?: () => void) {
  if (kind === "heart") {
    sfxPowerUp("heart");
    if (onHeal) onHeal();
    return;
  }

  sfxPowerUp(kind);
  if (kind === "frost") {
    sfxFreeze();
  }

  const duration = kind === "swift" ? 4.0 : 3.0;
  currentPowerUp = {
    kind,
    remainingSec: duration,
    totalSec: duration,
  };

  patchGameState({
    activePowerUp: kind,
    powerUpRemaining: duration,
    powerUpTotal: duration,
  });
}

export function updatePowerUps(deltaSec: number): { speedMultiplier: number; isFrozen: boolean } {
  if (!currentPowerUp.kind) {
    return { speedMultiplier: 1.0, isFrozen: false };
  }

  currentPowerUp.remainingSec -= deltaSec;
  if (currentPowerUp.remainingSec <= 0) {
    currentPowerUp = { kind: null, remainingSec: 0, totalSec: 0 };
    patchGameState({
      activePowerUp: null,
      powerUpRemaining: 0,
      powerUpTotal: 0,
    });
    return { speedMultiplier: 1.0, isFrozen: false };
  }

  patchGameState({
    activePowerUp: currentPowerUp.kind,
    powerUpRemaining: Math.max(0, currentPowerUp.remainingSec),
    powerUpTotal: currentPowerUp.totalSec,
  });

  return {
    speedMultiplier: currentPowerUp.kind === "swift" ? 1.5 : 1.0,
    isFrozen: currentPowerUp.kind === "frost",
  };
}

export function clearPowerUps() {
  currentPowerUp = { kind: null, remainingSec: 0, totalSec: 0 };
  patchGameState({
    activePowerUp: null,
    powerUpRemaining: 0,
    powerUpTotal: 0,
  });
}
