import type * as Phaser from "phaser";
import { BEETLE_DISPLAY, BEETLE_FRAME } from "../config";
import type { HazardDef } from "../types";

export type PestRef = {
  sprite: Phaser.Physics.Arcade.Sprite;
  patrol: { x: number; y: number }[];
  index: number;
  speed: number;
};

export function createPest(scene: Phaser.Scene, def: HazardDef): PestRef {
  const sprite = scene.physics.add.sprite(def.x, def.y, "beetle", 0);
  const scale = BEETLE_DISPLAY / BEETLE_FRAME;
  sprite.setScale(scale);
  sprite.setOrigin(0.5, 0.7);
  sprite.body?.setCircle(40, 24, 36);
  sprite.setDepth(def.y);
  sprite.play("beetle-walk");

  return {
    sprite,
    patrol: def.patrol,
    index: 0,
    speed: def.speed,
  };
}

function jammedToward(
  sprite: Phaser.Physics.Arcade.Sprite,
  dx: number,
  dy: number,
): boolean {
  const body = sprite.body as Phaser.Physics.Arcade.Body | null;
  if (!body) return false;
  return (
    (dx < 0 && body.blocked.left) ||
    (dx > 0 && body.blocked.right) ||
    (dy < 0 && body.blocked.up) ||
    (dy > 0 && body.blocked.down)
  );
}

export function updatePest(pest: PestRef) {
  const { sprite, patrol, speed } = pest;
  if (patrol.length === 0) {
    sprite.setVelocity(0, 0);
    return;
  }

  const target = patrol[pest.index % patrol.length];
  const dx = target.x - sprite.x;
  const dy = target.y - sprite.y;
  const dist = Math.hypot(dx, dy);

  // Reached the waypoint, or something solid is in the way — go to the next one.
  if (dist < 16 || jammedToward(sprite, dx, dy)) {
    pest.index = (pest.index + 1) % patrol.length;
    sprite.setVelocity(0, 0);
    return;
  }

  sprite.setVelocity((dx / dist) * speed, (dy / dist) * speed);
  sprite.setFlipX(dx < 0);
  sprite.setDepth(sprite.y);
}
