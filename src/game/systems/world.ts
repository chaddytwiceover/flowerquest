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
  ground.setDepth(-20);

  const sunlight = scene.add.graphics();
  sunlight.fillStyle(0xf7f1e3, 0.09);
  sunlight.fillEllipse(width * 0.28, height * 0.18, width * 0.9, height * 0.42);
  sunlight.setBlendMode("SCREEN");
  sunlight.setDepth(-15);

  const shade = scene.add.graphics();
  shade.fillStyle(0x1c1612, 0.12);
  shade.fillRect(0, 0, width, 72);
  shade.fillRect(0, height - 96, width, 96);
  shade.setDepth(-14);

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
