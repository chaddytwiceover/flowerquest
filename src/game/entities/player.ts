import type * as Phaser from "phaser";
import { PLAYER_DISPLAY, PLAYER_FRAME } from "../config";
import { actions } from "../input";

export type Facing = "down" | "left" | "right" | "up";
export type PlayerAction = "jump" | "collect" | "hurt" | "win";

export type PlayerRef = {
  sprite: Phaser.Physics.Arcade.Sprite;
  facing: Facing;
  invincibleUntil: number;
  animLockUntil: number;
};

const IDLE_FRAME: Record<Facing, number> = {
  down: 0,
  left: 4,
  right: 8,
  up: 12,
};

const ACTION_FRAME: Record<PlayerAction, number> = {
  jump: 0,
  collect: 1,
  hurt: 2,
  win: 3,
};

export function createPlayer(
  scene: Phaser.Scene,
  x: number,
  y: number,
): PlayerRef {
  const sprite = scene.physics.add.sprite(x, y, "player", 0);
  const scale = PLAYER_DISPLAY / PLAYER_FRAME;
  sprite.setScale(scale);
  sprite.setOrigin(0.5, 0.9);
  sprite.body?.setSize(24, 16);
  sprite.body?.setOffset(36, 74);
  sprite.setDepth(y);
  sprite.setFrame(0);

  return { sprite, facing: "down", invincibleUntil: 0, animLockUntil: 0 };
}

export function playPlayerAction(
  player: PlayerRef,
  action: PlayerAction,
  durationMs: number,
) {
  const sprite = player.sprite;
  sprite.anims.stop();
  sprite.setTexture("player-actions", ACTION_FRAME[action]);
  player.animLockUntil = sprite.scene.time.now + durationMs;
}

export function updatePlayer(player: PlayerRef, speed: number) {
  const { sprite } = player;
  const now = sprite.scene.time.now;
  const locked = now < player.animLockUntil;

  const vx = actions.moveX * speed;
  const vy = actions.moveY * speed;
  sprite.setVelocity(vx, vy);

  if (!locked && sprite.texture.key !== "player") {
    sprite.setTexture("player", IDLE_FRAME[player.facing]);
  }

  const moving = Math.abs(vx) + Math.abs(vy) > 8;
  if (moving) {
    if (Math.abs(vx) > Math.abs(vy)) {
      player.facing = vx < 0 ? "left" : "right";
    } else {
      player.facing = vy < 0 ? "up" : "down";
    }
    if (!locked) {
      const key = `walk-${player.facing}`;
      if (sprite.anims.currentAnim?.key !== key || sprite.texture.key !== "player") {
        sprite.setTexture("player");
        sprite.play(key, true);
      }
    }
  } else {
    sprite.setVelocity(0, 0);
    if (!locked) {
      sprite.anims.stop();
      if (sprite.texture.key !== "player") sprite.setTexture("player");
      sprite.setFrame(IDLE_FRAME[player.facing]);
    }
  }

  sprite.setDepth(sprite.y);
}
