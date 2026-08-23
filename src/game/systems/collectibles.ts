import * as Phaser from "phaser";
import { FLOWER_DISPLAY } from "../config";
import type { LevelDef } from "../types";

export type CollectibleRef = Phaser.Physics.Arcade.Sprite;

export function placeCollectibles(scene: Phaser.Scene, level: LevelDef): CollectibleRef[] {
  const flowers: CollectibleRef[] = [];

  for (const spot of level.flowers) {
    const glow = scene.add.sprite(spot.x, spot.y + 4, spot.kind);
    glow.setOrigin(0.5, 0.7);
    glow.setAlpha(0.32);
    glow.setTint(0xe0a93a);
    glow.setBlendMode(Phaser.BlendModes.ADD);
    glow.setDepth(spot.y - 2);

    const flower = scene.physics.add.sprite(spot.x, spot.y, spot.kind);
    const src = flower.height || 1;
    const scale = FLOWER_DISPLAY / src;
    flower.setScale(scale);
    glow.setScale(scale * 1.5);
    flower.setOrigin(0.5, 0.7);
    flower.body?.setAllowGravity(false);
    flower.body?.setImmovable(true);
    flower.body?.setCircle(Math.max(64, src * 0.32));
    flower.setData("kind", spot.kind);
    flower.setData("glow", glow);
    flower.setDepth(spot.y);
    scene.tweens.add({
      targets: [flower, glow],
      y: spot.y - 7,
      duration: 900 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    scene.tweens.add({
      targets: glow,
      alpha: 0.18,
      scale: scale * 1.7,
      duration: 1000 + Math.random() * 300,
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
