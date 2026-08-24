import * as Phaser from "phaser";
import type { LevelDef, PowerUpKind } from "../types";
import { activatePowerUp } from "./powerups";

export type PowerBloomRef = Phaser.Physics.Arcade.Sprite;

export function placePowerBlooms(scene: Phaser.Scene, level: LevelDef): PowerBloomRef[] {
  const blooms: PowerBloomRef[] = [];
  const spots = level.powerBlooms ?? [];

  for (const spot of spots) {
    const texKey = `power-${spot.kind}`;
    const glow = scene.add.sprite(spot.x, spot.y, texKey);
    glow.setOrigin(0.5, 0.5);
    glow.setAlpha(0.4);
    glow.setBlendMode(Phaser.BlendModes.ADD);
    glow.setDepth(spot.y - 2);

    const bloom = scene.physics.add.sprite(spot.x, spot.y, texKey);
    bloom.setScale(0.85);
    glow.setScale(1.2);
    bloom.setOrigin(0.5, 0.5);
    bloom.body?.setAllowGravity(false);
    bloom.body?.setImmovable(true);
    bloom.body?.setCircle(28, 10, 10);
    bloom.setData("kind", spot.kind);
    bloom.setData("glow", glow);
    bloom.setDepth(spot.y);

    scene.tweens.add({
      targets: [bloom, glow],
      y: spot.y - 8,
      duration: 800 + Math.random() * 300,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    scene.tweens.add({
      targets: glow,
      alpha: 0.15,
      scale: 1.5,
      duration: 700 + Math.random() * 300,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    blooms.push(bloom);
  }

  return blooms;
}

export function collectPowerBloom(
  scene: Phaser.Scene,
  bloom: PowerBloomRef,
  onHeal?: () => void,
) {
  if (!bloom.active) return;

  const kind = bloom.getData("kind") as PowerUpKind;
  const glow = bloom.getData("glow") as Phaser.GameObjects.Sprite | undefined;

  bloom.disableBody(true, false);
  bloom.setActive(false);

  // Burst effect
  scene.tweens.add({
    targets: [bloom, glow].filter(Boolean),
    scaleX: 1.6,
    scaleY: 1.6,
    alpha: 0,
    duration: 260,
    ease: "Cubic.easeOut",
    onComplete: () => {
      bloom.destroy();
      glow?.destroy();
    },
  });

  activatePowerUp(kind, onHeal);
}
