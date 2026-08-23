import * as Phaser from "phaser";
import { objectiveMet } from "./objectives";
import { patchGameState } from "../state";
import type { LevelDef } from "../types";

const GATE_DISPLAY = 168;
const TOUCH_RADIUS = 56;

export type ExitRef = {
  sprite: Phaser.Physics.Arcade.Sprite;
  label: Phaser.GameObjects.Text;
  locked: boolean;
  unlockAt: number;
  lockedHint: string;
  unlockedHint: string;
  unlockedObjective: string;
  lastHintAt: number;
};

/**
 * Places the level gate when `level.exit` is set.
 * Level 1 has `exit: null` and skips this.
 */
export function placeExit(
  scene: Phaser.Scene,
  level: LevelDef,
  blockers: Phaser.Physics.Arcade.StaticGroup,
): ExitRef | null {
  if (!level.exit) return null;

  const { x, y } = level.exit;
  const unlockAt =
    level.exit.unlockAt === "all-flowers" ? level.flowers.length : level.exit.unlockAt;

  const sprite = scene.physics.add.staticSprite(x, y, "gate-locked");
  const src = sprite.height || 1;
  sprite.setScale(GATE_DISPLAY / src);
  sprite.setOrigin(0.5, 0.9);
  sprite.setDepth(y);
  sprite.body?.setSize(70, 28);
  sprite.body?.setOffset((sprite.width - 70) / 2, sprite.height - 36);
  sprite.refreshBody();
  blockers.add(sprite);

  const label = scene.add
    .text(x, y - GATE_DISPLAY + 18, "LOCKED", {
      fontFamily: "Fraunces, Georgia, serif",
      fontSize: "14px",
      color: "#f4d27a",
      fontStyle: "bold",
      stroke: "#3a271c",
      strokeThickness: 4,
    })
    .setOrigin(0.5)
    .setDepth(y + 1);

  return {
    sprite,
    label,
    locked: true,
    unlockAt,
    lockedHint: level.exit.lockedHint,
    unlockedHint: level.exit.unlockedHint,
    unlockedObjective: level.exit.unlockedObjective,
    lastHintAt: 0,
  };
}

export function unlockExit(
  scene: Phaser.Scene,
  exit: ExitRef | null,
  blockers: Phaser.Physics.Arcade.StaticGroup,
): boolean {
  if (!exit || !exit.locked) return false;
  exit.locked = false;
  exit.sprite.setTexture("gate-open");
  const src = exit.sprite.height || 1;
  exit.sprite.setScale(GATE_DISPLAY / src);
  blockers.remove(exit.sprite);
  if (exit.sprite.body) exit.sprite.body.enable = false;
  exit.label.setText("OPEN");
  exit.label.setColor("#b7e3a1");
  scene.tweens.add({
    targets: exit.sprite,
    scaleX: exit.sprite.scaleX * 1.06,
    scaleY: exit.sprite.scaleY * 1.06,
    yoyo: true,
    duration: 180,
  });
  patchGameState({ gateUnlocked: true, levelSubtitle: exit.unlockedObjective });
  return true;
}

export function syncExitLock(
  scene: Phaser.Scene,
  exit: ExitRef | null,
  blockers: Phaser.Physics.Arcade.StaticGroup,
): boolean {
  if (!exit) return false;
  if (!objectiveMet()) return false;
  return unlockExit(scene, exit, blockers);
}

export function exitStatus(
  exit: ExitRef | null,
  x: number,
  y: number,
): "far" | "locked" | "open" {
  if (!exit) return "far";
  const dist = Phaser.Math.Distance.Between(x, y, exit.sprite.x, exit.sprite.y);
  if (dist >= TOUCH_RADIUS) return "far";
  return exit.locked ? "locked" : "open";
}

export function shouldHintLocked(exit: ExitRef, now: number, cooldown = 2200): boolean {
  if (now - exit.lastHintAt < cooldown) return false;
  exit.lastHintAt = now;
  return true;
}
