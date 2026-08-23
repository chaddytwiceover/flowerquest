import type * as Phaser from "phaser";
import type { LevelDef } from "../types";

export function placeWorld(scene: Phaser.Scene, level: LevelDef) {
  const { width, height, boundsInset, mapKey } = level.environment;
  scene.physics.world.setBounds(
    boundsInset,
    boundsInset,
    width - boundsInset * 2,
    height - boundsInset * 2,
  );

  const ground = scene.add.image(0, 0, mapKey).setOrigin(0, 0);
  ground.setDisplaySize(width, height);
  return { width, height };
}

export function followPlayer(
  scene: Phaser.Scene,
  sprite: Phaser.Physics.Arcade.Sprite,
  level: LevelDef,
) {
  const { width, height } = level.environment;
  scene.cameras.main.setBounds(0, 0, width, height);
  scene.cameras.main.startFollow(sprite, true, 0.12, 0.12);
  scene.cameras.main.setZoom(1.05);
  scene.cameras.main.fadeIn(250, 36, 92, 58);
}
