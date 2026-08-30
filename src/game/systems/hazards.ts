import * as Phaser from "phaser";
import { createPest, updatePest, type PestRef } from "../entities/pest";
import type { LevelDef } from "../types";

export type HazardRef = PestRef;

export function placeHazards(scene: Phaser.Scene, level: LevelDef): HazardRef[] {
  return level.hazards.map((def) => {
    if (def.kind === "beetle") return createPest(scene, def);
    return createPest(scene, def);
  });
}

export function updateHazards(
  hazards: HazardRef[],
  playerX = 0,
  playerY = 0,
  deltaSec = 0.016,
  isFrozen = false,
) {
  hazards.forEach((hazard) => updatePest(hazard, playerX, playerY, deltaSec, isFrozen));
}

export function stopHazards(hazards: HazardRef[]) {
  hazards.forEach((hazard) => hazard.sprite.setVelocity(0, 0));
}

/** True if any hazard is close enough to hurt the player this frame. */
export function hazardTouches(
  hazards: HazardRef[],
  x: number,
  y: number,
  radius = 34,
): boolean {
  for (const hazard of hazards) {
    if (!hazard.sprite.active) continue;
    if (Phaser.Math.Distance.Between(x, y, hazard.sprite.x, hazard.sprite.y) < radius) {
      return true;
    }
  }
  return false;
}

export function hazardPositions(hazards: HazardRef[]) {
  return hazards.map((hazard) => ({
    x: hazard.sprite.x,
    y: hazard.sprite.y,
  }));
}
