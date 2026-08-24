import * as Phaser from "phaser";
import { sfxCollect, sfxHurt, sfxLose, sfxUnlock, sfxWin, startMusic, setMusicPaused } from "../audio";
import {
  createPlayer,
  playPlayerAction,
  updatePlayer,
  type PlayerRef,
} from "../entities/player";
import { attachInput, detachInput, setJoystick, setKeyOverride, updateActions } from "../input";
import { getLevel } from "../levels";
import { findNearbyCollectible, flowersRemaining, placeCollectibles, type CollectibleRef } from "../systems/collectibles";
import {
  hazardPositions,
  hazardTouches,
  placeHazards,
  stopHazards,
  updateHazards,
  type HazardRef,
} from "../systems/hazards";
import { loseHeart } from "../systems/lives";
import { applyLevelHud, clearBanner, lockedExitHint, noteCollected, showBanner } from "../systems/objectives";
import { placeObstacles } from "../systems/obstacles";
import { placeBridges, placeWater, updateWater, type WaterRuntime } from "../systems/water";
import {
  exitStatus,
  placeExit,
  shouldHintLocked,
  syncExitLock,
  type ExitRef,
} from "../systems/exit";
import { placePowerBlooms, collectPowerBloom, type PowerBloomRef } from "../systems/powerBlooms";
import { clearPowerUps, updatePowerUps } from "../systems/powerups";
import { followPlayer, placeWorld } from "../systems/world";
import { getGameState, patchGameState } from "../state";
import type { LevelDef } from "../types";

type GameData = { levelId?: string };

export class GameScene extends Phaser.Scene {
  private level!: LevelDef;
  private player!: PlayerRef;
  private hazards: HazardRef[] = [];
  private flowers: CollectibleRef[] = [];
  private powerBlooms: PowerBloomRef[] = [];
  private blockers!: Phaser.Physics.Arcade.StaticGroup;
  private exit: ExitRef | null = null;
  private water!: WaterRuntime;
  private ended = false;
  private bannerTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super("game");
  }

  init(data: GameData) {
    const levelId = data.levelId ?? "level-1";
    this.level = getLevel(levelId);
    this.ended = false;
    this.hazards = [];
    this.flowers = [];
    this.powerBlooms = [];
    this.exit = null;
    clearPowerUps();
    applyLevelHud(this.level);
  }

  create() {
    attachInput();
    this.events.once("shutdown", () => this.cleanup());

    placeWorld(this, this.level);
    this.blockers = this.physics.add.staticGroup();
    placeObstacles(this, this.level, this.blockers);
    this.water = placeWater(this, this.level);
    placeBridges(this, this.level);

    this.flowers = placeCollectibles(this, this.level);
    this.powerBlooms = placePowerBlooms(this, this.level);
    this.hazards = placeHazards(this, this.level);
    this.exit = placeExit(this, this.level, this.blockers);

    this.player = createPlayer(this, this.level.playerSpawn.x, this.level.playerSpawn.y);
    this.player.sprite.setCollideWorldBounds(true);

    this.physics.add.collider(this.player.sprite, this.blockers);
    this.physics.add.collider(this.player.sprite, this.water.group);
    this.hazards.forEach((hazard) => {
      this.physics.add.collider(hazard.sprite, this.blockers);
      this.physics.add.collider(hazard.sprite, this.water.group);
      this.physics.add.overlap(hazard.sprite, this.player.sprite, () => this.hitPlayer());
    });
    this.flowers.forEach((flower) => {
      this.physics.add.overlap(this.player.sprite, flower, () => this.collectFlower(flower));
    });
    this.powerBlooms.forEach((bloom) => {
      this.physics.add.overlap(this.player.sprite, bloom, () => {
        collectPowerBloom(this, bloom, () => this.healPlayer());
      });
    });

    followPlayer(this, this.player.sprite, this.level);
    startMusic(this.level.music);
    setMusicPaused(false);
    this.wireControlsTest();
  }

  update(time: number, delta: number) {
    if (this.ended) return;
    if (getGameState().phase !== "playing") {
      this.player.sprite.setVelocity(0, 0);
      return;
    }

    const deltaSec = delta > 0 ? delta / 1000 : 0.016;
    const { speedMultiplier, isFrozen } = updatePowerUps(deltaSec);

    updateActions();
    updatePlayer(this.player, this.level.playerSpeed * speedMultiplier);

    const px = this.player.sprite.x;
    const py = this.player.sprite.y;

    updateHazards(this.hazards, px, py, deltaSec, isFrozen);
    updateWater(this.water, this.time.now);

    const nearby = findNearbyCollectible(this.flowers, px, py);
    if (nearby) this.collectFlower(nearby);

    if (!isFrozen && hazardTouches(this.hazards, px, py)) this.hitPlayer();

    this.checkExit(px, py);
  }

  private healPlayer() {
    const current = getGameState();
    if (current.hearts < current.heartsMax) {
      patchGameState({ hearts: Math.min(current.heartsMax, current.hearts + 1) });
      this.cameras.main.flash(120, 100, 240, 120);
      this.flashBanner("Heart restored! 💚", 1800);
    }
  }

  private checkExit(px: number, py: number) {
    if (!this.exit || this.ended) return;
    const status = exitStatus(this.exit, px, py);
    if (status === "locked") {
      if (shouldHintLocked(this.exit, this.time.now)) {
        this.flashBanner(lockedExitHint(this.exit.lockedHint), 2200);
      }
      return;
    }
    if (status === "open" && this.level.completeOn === "reach-exit") {
      this.finish("won");
    }
  }

  private flashBanner(text: string, ms: number) {
    showBanner(text);
    this.bannerTimer?.remove(false);
    this.bannerTimer = this.time.delayedCall(ms, () => {
      if (getGameState().banner === text) clearBanner();
    });
  }

  private collectFlower(flower: CollectibleRef) {
    if (!flower.active || this.ended) return;
    const glow = flower.getData("glow") as Phaser.GameObjects.Sprite | undefined;
    flower.disableBody(true, false);

    playPlayerAction(this.player, "collect", 420);
    this.tweens.add({
      targets: this.player.sprite,
      scaleX: this.player.sprite.scaleX * 1.08,
      scaleY: this.player.sprite.scaleY * 1.08,
      duration: 120,
      yoyo: true,
    });

    this.tweens.killTweensOf(flower);
    if (glow) this.tweens.killTweensOf(glow);
    this.tweens.add({
      targets: flower,
      scale: flower.scale * 1.35,
      alpha: 0,
      y: flower.y - 24,
      duration: 220,
      onComplete: () => flower.destroy(),
    });
    if (glow) {
      this.tweens.add({
        targets: glow,
        scale: glow.scale * 1.5,
        alpha: 0,
        y: glow.y - 20,
        duration: 260,
        onComplete: () => glow.destroy(),
      });
    }

    const burst = this.add.particles(flower.x, flower.y, "spark", {
      speed: { min: 40, max: 90 },
      lifespan: 380,
      scale: { start: 0.8, end: 0 },
      tint: [0xe0a93a, 0xf7f1e3, 0xe35d6a],
      quantity: 10,
      emitting: false,
    });
    burst.explode(10);
    this.time.delayedCall(420, () => burst.destroy());

    sfxCollect();
    const kind = String(flower.getData("kind") ?? "");
    const { met } = noteCollected(this.level, kind);
    const opened = syncExitLock(this, this.exit, this.blockers);

    if (opened && this.exit) {
      sfxUnlock();
      this.cameras.main.flash(140, 183, 227, 161);
      const burst = this.add.particles(this.exit.sprite.x, this.exit.sprite.y - 40, "spark", {
        speed: { min: 50, max: 110 },
        lifespan: 520,
        scale: { start: 0.9, end: 0 },
        tint: [0xe0a93a, 0xb7e3a1, 0xf7f1e3],
        quantity: 16,
        emitting: false,
      });
      burst.explode(16);
      this.time.delayedCall(560, () => burst.destroy());
      this.flashBanner(this.exit.unlockedHint, 2800);
    }

    if (met && this.level.completeOn === "collect-all") this.finish("won");
  }

  private hitPlayer() {
    if (this.ended) return;
    const now = this.time.now;
    if (now < this.player.invincibleUntil) return;

    this.player.invincibleUntil = now + 1400;
    playPlayerAction(this.player, "hurt", 480);
    this.cameras.main.shake(160, 0.01);
    this.cameras.main.flash(80, 227, 93, 106);
    sfxHurt();

    const { dead } = loseHeart();

    this.tweens.add({
      targets: this.player.sprite,
      alpha: 0.25,
      duration: 90,
      yoyo: true,
      repeat: 7,
      onComplete: () => this.player.sprite.setAlpha(1),
    });

    if (dead) this.finish("lost");
  }

  private finish(result: "won" | "lost") {
    if (this.ended) return;
    this.ended = true;
    this.player.sprite.setVelocity(0, 0);
    setJoystick(0, 0);
    setKeyOverride(null);
    stopHazards(this.hazards);
    clearBanner();
    setMusicPaused(true);
    if (result === "won") {
      playPlayerAction(this.player, "win", 8000);
      sfxWin();
      this.cameras.main.flash(180, 247, 241, 227);
    } else {
      playPlayerAction(this.player, "hurt", 8000);
      sfxLose();
    }
    patchGameState({ phase: result });
  }

  private wireControlsTest() {
    window.__controlsTest = {
      getX: () => this.player?.sprite.x ?? 0,
      getY: () => this.player?.sprite.y ?? 0,
      getVx: () => this.player?.sprite.body?.velocity.x ?? 0,
      getVy: () => this.player?.sprite.body?.velocity.y ?? 0,
      setKeys: (codes: string[]) => setKeyOverride(codes.length ? codes : null),
      setJoystick: (x: number, y: number) => setJoystick(x, y),
      setPosition: (x: number, y: number) => {
        this.player.sprite.setPosition(x, y);
        this.player.sprite.body?.reset(x, y);
      },
      flowerCount: () => flowersRemaining(this.flowers),
      getHearts: () => getGameState().hearts,
      getCollected: () => getGameState().flowersCollected,
      getHazards: () => hazardPositions(this.hazards),
      getLevelId: () => this.level?.id,
      getSubtitle: () => getGameState().levelSubtitle,
      getBanner: () => getGameState().banner,
      isGateUnlocked: () => !this.exit || !this.exit.locked,
      getExit: () =>
        this.exit
          ? { x: this.exit.sprite.x, y: this.exit.sprite.y, locked: this.exit.locked }
          : null,
      getPhase: () => getGameState().phase,
      getWater: () => this.level.water ?? [],
      getBridges: () => this.level.bridges ?? [],
      getObjectives: () => getGameState().objectives,
      getWalls: () => this.level.walls,
    };
  }

  private cleanup() {
    this.hazards = [];
    this.flowers = [];
    this.powerBlooms = [];
    clearPowerUps();
    this.exit = null;
    this.bannerTimer?.remove(false);
    detachInput();
    if (window.__controlsTest) delete window.__controlsTest;
  }
}

declare global {
  interface Window {
    __controlsTest?: {
      getX: () => number;
      getY: () => number;
      getVx: () => number;
      getVy: () => number;
      setKeys: (codes: string[]) => void;
      setJoystick?: (x: number, y: number) => void;
      setPosition: (x: number, y: number) => void;
      flowerCount?: () => number;
      getHearts?: () => number;
      getCollected?: () => number;
      getHazards?: () => { x: number; y: number }[];
      getLevelId?: () => string;
      getSubtitle?: () => string;
      getBanner?: () => string | null;
      isGateUnlocked?: () => boolean;
      getExit?: () => { x: number; y: number; locked: boolean } | null;
      getPhase?: () => string;
      getWater?: () => { x: number; y: number; w: number; h: number }[];
      getBridges?: () => { x: number; y: number; displayWidth: number; displayHeight: number }[];
      getObjectives?: () => {
        collectible: string;
        label: string;
        icon: string;
        collected: number;
        required: number;
      }[];
      getWalls?: () => { x: number; y: number; w: number; h: number }[];
    };
  }
}
