import * as Phaser from "phaser";
import { BEETLE_DISPLAY, BEETLE_FRAME } from "../config";
import type { HazardDef, HazardKind, Point } from "../types";
import { sfxAlert } from "../audio";

export type PestState = "patrol" | "guard" | "alert" | "chase" | "aggro" | "cooldown" | "return";

export type PestRef = {
  kind: HazardKind;
  sprite: Phaser.Physics.Arcade.Sprite;
  alertEmote?: Phaser.GameObjects.Image;
  patrol: Point[];
  index: number;
  speed: number;
  chaseSpeed: number;
  origin: Point;
  state: PestState;
  stateTimer: number;
  detectRadius: number;
  leashRadius: number;
  guardRadius: number;
};

export function createPest(scene: Phaser.Scene, def: HazardDef): PestRef {
  const kind = def.kind;
  let sprite: Phaser.Physics.Arcade.Sprite;
  let alertEmote: Phaser.GameObjects.Image | undefined;

  if (kind === "bee") {
    sprite = scene.physics.add.sprite(def.x, def.y, "bee-sprite");
    sprite.setScale(0.85);
    sprite.setOrigin(0.5, 0.5);
    sprite.body?.setCircle(22, 10, 10);
  } else if (kind === "wasp") {
    sprite = scene.physics.add.sprite(def.x, def.y, "wasp-sprite");
    sprite.setScale(0.9);
    sprite.setOrigin(0.5, 0.5);
    sprite.body?.setCircle(22, 10, 10);
  } else {
    // Beetle
    sprite = scene.physics.add.sprite(def.x, def.y, "beetle", 0);
    const scale = BEETLE_DISPLAY / BEETLE_FRAME;
    sprite.setScale(scale);
    sprite.setOrigin(0.5, 0.7);
    sprite.body?.setCircle(40, 24, 36);
    if (scene.anims.exists("beetle-walk")) {
      sprite.play("beetle-walk");
    }
  }

  sprite.setDepth(def.y);

  if (kind === "bee" || kind === "wasp") {
    alertEmote = scene.add.image(def.x, def.y - 36, "alert-emote");
    alertEmote.setScale(0.8);
    alertEmote.setDepth(def.y + 100);
    alertEmote.setVisible(false);
  }

  const origin: Point = def.guardZone ? { x: def.guardZone.x, y: def.guardZone.y } : { x: def.x, y: def.y };

  return {
    kind,
    sprite,
    alertEmote,
    patrol: def.patrol ?? (def.guardZone ? [{ x: def.guardZone.x, y: def.guardZone.y }] : [{ x: def.x, y: def.y }]),
    index: 0,
    speed: def.speed,
    chaseSpeed: def.chaseSpeed ?? def.speed * 1.5,
    origin,
    state: kind === "wasp" ? "guard" : "patrol",
    stateTimer: 0,
    detectRadius: def.detectRadius ?? (kind === "wasp" ? 170 : 190),
    leashRadius: def.leashRadius ?? (kind === "wasp" ? 230 : 320),
    guardRadius: def.guardZone?.radius ?? 120,
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

export function updatePest(
  pest: PestRef,
  options: {
    playerX: number;
    playerY: number;
    deltaSec: number;
    isFrozen?: boolean;
  }
) {
  const { playerX, playerY, deltaSec, isFrozen = false } = options;
  const { sprite, alertEmote, kind } = pest;

  if (!sprite.active) return;

  if (isFrozen) {
    sprite.setVelocity(0, 0);
    sprite.setTint(0x88ccff);
    if (alertEmote) alertEmote.setVisible(false);
    return;
  }
  sprite.clearTint();

  if (alertEmote) {
    alertEmote.setPosition(sprite.x, sprite.y - 34);
    alertEmote.setDepth(sprite.y + 100);
  }

  // Handle BEETLE
  if (kind === "beetle") {
    updateBeetle(pest);
    return;
  }

  // Handle BEE
  if (kind === "bee") {
    updateBee(pest, playerX, playerY, deltaSec);
    return;
  }

  // Handle WASP
  if (kind === "wasp") {
    updateWasp(pest, playerX, playerY, deltaSec);
    return;
  }
}

function updateBeetle(pest: PestRef) {
  const { sprite, patrol, speed } = pest;
  if (patrol.length === 0) {
    sprite.setVelocity(0, 0);
    return;
  }

  const target = patrol[pest.index % patrol.length];
  const dx = target.x - sprite.x;
  const dy = target.y - sprite.y;
  const dist = Math.hypot(dx, dy);

  if (dist < 16 || jammedToward(sprite, dx, dy)) {
    pest.index = (pest.index + 1) % patrol.length;
    sprite.setVelocity(0, 0);
    return;
  }

  sprite.setVelocity((dx / dist) * speed, (dy / dist) * speed);
  sprite.setFlipX(dx < 0);
  sprite.setDepth(sprite.y);
}

function updateBee(pest: PestRef, px: number, py: number, dt: number) {
  const { sprite, alertEmote, patrol, speed, chaseSpeed, detectRadius, leashRadius, origin } = pest;
  const distToPlayer = Math.hypot(px - sprite.x, py - sprite.y);
  const distToOrigin = Math.hypot(origin.x - sprite.x, origin.y - sprite.y);

  pest.stateTimer -= dt;

  switch (pest.state) {
    case "patrol": {
      if (alertEmote) alertEmote.setVisible(false);
      // Check player detection
      if (distToPlayer < detectRadius) {
        pest.state = "alert";
        pest.stateTimer = 0.4;
        sfxAlert();
        if (alertEmote) {
          alertEmote.setVisible(true);
          alertEmote.setScale(1.2);
        }
        sprite.setVelocity(0, 0);
        return;
      }

      // Normal waypoints
      if (patrol.length > 0) {
        const target = patrol[pest.index % patrol.length];
        const dx = target.x - sprite.x;
        const dy = target.y - sprite.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 16) {
          pest.index = (pest.index + 1) % patrol.length;
        } else {
          sprite.setVelocity((dx / dist) * speed, (dy / dist) * speed);
          sprite.setFlipX(dx < 0);
        }
      }
      break;
    }

    case "alert": {
      sprite.setVelocity(0, 0);
      if (alertEmote) {
        alertEmote.setVisible(true);
      }
      if (pest.stateTimer <= 0) {
        pest.state = "chase";
        pest.stateTimer = 2.5; // 2.5s chase max
        if (alertEmote) alertEmote.setVisible(false);
      }
      break;
    }

    case "chase": {
      if (alertEmote) alertEmote.setVisible(false);
      if (pest.stateTimer <= 0 || distToPlayer > leashRadius || distToOrigin > leashRadius + 100) {
        pest.state = "cooldown";
        pest.stateTimer = 1.8;
        return;
      }
      const dx = px - sprite.x;
      const dy = py - sprite.y;
      const dist = Math.max(1, Math.hypot(dx, dy));
      sprite.setVelocity((dx / dist) * chaseSpeed, (dy / dist) * chaseSpeed);
      sprite.setFlipX(dx < 0);
      break;
    }

    case "cooldown": {
      if (alertEmote) alertEmote.setVisible(false);
      // Fly slowly back towards origin / current waypoint
      const target = patrol[pest.index % patrol.length] || origin;
      const dx = target.x - sprite.x;
      const dy = target.y - sprite.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 20 || pest.stateTimer <= 0) {
        pest.state = "patrol";
        pest.stateTimer = 0;
      } else {
        sprite.setVelocity((dx / dist) * (speed * 0.7), (dy / dist) * (speed * 0.7));
        sprite.setFlipX(dx < 0);
      }
      break;
    }
  }

  sprite.setDepth(sprite.y);
}

function updateWasp(pest: PestRef, px: number, py: number, dt: number) {
  const { sprite, alertEmote, origin, speed, chaseSpeed, guardRadius, leashRadius } = pest;
  const distToPlayer = Math.hypot(px - sprite.x, py - sprite.y);
  const playerDistToOrigin = Math.hypot(px - origin.x, py - origin.y);
  const waspDistToOrigin = Math.hypot(sprite.x - origin.x, sprite.y - origin.y);

  pest.stateTimer -= dt;

  switch (pest.state) {
    case "guard": {
      if (alertEmote) alertEmote.setVisible(false);
      // Hover slightly around origin
      const hoverAngle = (Date.now() / 350) % (Math.PI * 2);
      const targetX = origin.x + Math.cos(hoverAngle) * 20;
      const targetY = origin.y + Math.sin(hoverAngle) * 20;
      const dx = targetX - sprite.x;
      const dy = targetY - sprite.y;
      sprite.setVelocity(dx * 2.5, dy * 2.5);
      sprite.setFlipX(dx < 0);

      // If player enters territorial guard zone
      if (playerDistToOrigin < guardRadius || distToPlayer < 110) {
        pest.state = "aggro";
        pest.stateTimer = 2.0;
        sfxAlert();
        if (alertEmote) {
          alertEmote.setVisible(true);
        }
      }
      break;
    }

    case "aggro": {
      if (alertEmote) alertEmote.setVisible(true);
      // If player fled outside leash radius
      if (playerDistToOrigin > leashRadius || waspDistToOrigin > leashRadius || pest.stateTimer <= 0) {
        pest.state = "return";
        if (alertEmote) alertEmote.setVisible(false);
        return;
      }

      // High speed burst straight at player
      const dx = px - sprite.x;
      const dy = py - sprite.y;
      const dist = Math.max(1, Math.hypot(dx, dy));
      sprite.setVelocity((dx / dist) * chaseSpeed, (dy / dist) * chaseSpeed);
      sprite.setFlipX(dx < 0);
      break;
    }

    case "return": {
      if (alertEmote) alertEmote.setVisible(false);
      const dx = origin.x - sprite.x;
      const dy = origin.y - sprite.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 18) {
        pest.state = "guard";
        sprite.setVelocity(0, 0);
      } else {
        sprite.setVelocity((dx / dist) * (speed * 1.1), (dy / dist) * (speed * 1.1));
        sprite.setFlipX(dx < 0);
      }
      break;
    }
  }

  sprite.setDepth(sprite.y);
}

