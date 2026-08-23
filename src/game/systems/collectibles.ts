import * as Phaser from "phaser";
import { FLOWER_DISPLAY } from "../config";
import type { LevelDef } from "../types";

export type CollectibleRef = Phaser.Physics.Arcade.Sprite;

export function placeCollectibles(scene: Phaser.Scene, level: LevelDef): CollectibleRef[] {
  const flowers: CollectibleRef[] = [];

  for (const spot of level.flowers) {
    const flower = scene.physics.add.sprite(spot.x, spot.y, spot.kind);
    const src = flower.height || 1;
    flower.setScale(FLOWER_DISPLAY / src);
    flower.setOrigin(0.5, 0.7);
    flower.body?.setAllowGravity(false);
    flower.body?.setImmovable(true);
    flower.body?.setCircle(Math.max(64, src * 0.32));
    flower.setData("kind", spot.kind);
    flower.setDepth(spot.y);
    scene.tweens.add({
      targets: flower,
      y: spot.y - 7,
      duration: 900 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    flowers.push(flower);
  }

  return flowers;
}

export function flowersRemaining(flowers: CollectibleRef[]): number {
  return flowers.filter((flower) => flower.active).length;
}

/** Backup for Arcade overlap misses (tweens / teleport / fast movement). */
export function findNearbyCollectible(
  flowers: CollectibleRef[],
  x: number,
  y: number,
  radius = 46,
): CollectibleRef | null {
  for (const flower of flowers) {
    if (!flower.active) continue;
    if (Phaser.Math.Distance.Between(x, y, flower.x, flower.y) < radius) {
      return flower;
    }
  }
  return null;
}
