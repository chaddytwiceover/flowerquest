import * as Phaser from "phaser";
import { ACTION_FRAME, BEETLE_FRAME, PLAYER_FRAME } from "../config";
import { LEVELS } from "../levels";
import { patchGameState } from "../state";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    this.load.on("progress", (value: number) => {
      patchGameState({ loadProgress: value });
    });

    this.load.spritesheet("player", "/game/sprites/player.png", {
      frameWidth: PLAYER_FRAME,
      frameHeight: PLAYER_FRAME,
    });
    this.load.spritesheet("player-actions", "/game/sprites/player-actions.png", {
      frameWidth: ACTION_FRAME,
      frameHeight: ACTION_FRAME,
    });
    this.load.spritesheet("beetle", "/game/sprites/beetle-walk.png", {
      frameWidth: BEETLE_FRAME,
      frameHeight: BEETLE_FRAME,
    });

    this.load.image("daisy", "/game/sprites/daisy.png");
    this.load.image("tulip", "/game/sprites/tulip.png");
    this.load.image("rose", "/game/sprites/rose.png");
    this.load.image("sunflower", "/game/sprites/sunflower.png");
    this.load.image("bluebell", "/game/sprites/bluebell.png");
    this.load.image("tree", "/game/sprites/tree.png");
    this.load.image("bush", "/game/sprites/bush.png");
    this.load.image("rock", "/game/sprites/rock.png");
    this.load.image("stump", "/game/sprites/stump.png");
    this.load.image("pot", "/game/sprites/pot.png");
    this.load.image("arch", "/game/sprites/arch.png");
    this.load.image("heart", "/game/sprites/heart.png");
    this.load.image("gate-locked", "/game/sprites/gate-locked.png");
    this.load.image("gate-open", "/game/sprites/gate-open.png");
    this.load.image("bridge", "/game/sprites/bridge.png");
    this.load.image("water", "/game/sprites/water.png");
    this.load.image("prop-beehive", "/game/sprites/prop-beehive.jpg");
    this.load.image("prop-wasp-nest", "/game/sprites/prop-wasp-nest.jpg");
    this.load.image("prop-fountain", "/game/sprites/prop-fountain.jpg");
    this.load.image("prop-lantern", "/game/sprites/prop-lantern.jpg");

    for (const level of LEVELS) {
      this.load.image(level.environment.mapKey, level.environment.mapUrl);
    }
  }

  create() {
    const walk = (key: string, start: number, end: number) => {
      if (this.anims.exists(key)) return;
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers("player", { start, end }),
        frameRate: 8,
        repeat: -1,
      });
    };
    walk("walk-down", 0, 3);
    walk("walk-left", 4, 7);
    walk("walk-right", 8, 11);
    walk("walk-up", 12, 15);
    if (!this.anims.exists("beetle-walk")) {
      this.anims.create({
        key: "beetle-walk",
        frames: this.anims.generateFrameNumbers("beetle", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    const spark = this.add.graphics();
    spark.fillStyle(0xffffff, 1);
    spark.fillCircle(4, 4, 4);
    spark.generateTexture("spark", 8, 8);
    spark.destroy();

    generateProceduralTextures(this);

    patchGameState({ assetsReady: true, loadProgress: 1, phase: "menu" });
    this.scene.start("wait");
  }
}

function generateProceduralTextures(scene: Phaser.Scene) {
  // 1. Alert Emote (!)
  const alertG = scene.add.graphics();
  alertG.fillStyle(0xff3b30, 0.95);
  alertG.fillCircle(16, 16, 14);
  alertG.lineStyle(2, 0xffffff, 1);
  alertG.strokeCircle(16, 16, 14);
  alertG.fillStyle(0xffffff, 1);
  alertG.fillRoundedRect(14, 7, 4, 10, 2);
  alertG.fillCircle(16, 21, 2.2);
  alertG.generateTexture("alert-emote", 32, 32);
  alertG.destroy();

  // 2. Bee Sprite
  const beeG = scene.add.graphics();
  beeG.fillStyle(0xd0e8ff, 0.75);
  beeG.fillEllipse(18, 14, 12, 6);
  beeG.fillEllipse(30, 14, 12, 6);
  beeG.fillStyle(0xfbc02d, 1);
  beeG.fillEllipse(24, 24, 16, 22);
  beeG.fillStyle(0x212121, 1);
  beeG.fillRect(16, 17, 16, 4);
  beeG.fillRect(16, 24, 16, 4);
  beeG.fillStyle(0x000000, 1);
  beeG.fillCircle(20, 15, 2);
  beeG.fillCircle(28, 15, 2);
  beeG.fillStyle(0x212121, 1);
  beeG.fillTriangle(21, 33, 27, 33, 24, 39);
  beeG.generateTexture("bee-sprite", 48, 48);
  beeG.destroy();

  // 3. Wasp Sprite
  const waspG = scene.add.graphics();
  waspG.fillStyle(0xcbe3f7, 0.8);
  waspG.fillEllipse(16, 12, 14, 5);
  waspG.fillEllipse(32, 12, 14, 5);
  waspG.fillStyle(0xe65100, 1);
  waspG.fillEllipse(24, 24, 14, 24);
  waspG.fillStyle(0x1a0a05, 1);
  waspG.fillRect(18, 16, 12, 3);
  waspG.fillRect(17, 22, 14, 3);
  waspG.fillRect(18, 28, 12, 3);
  waspG.fillStyle(0x1a0a05, 1);
  waspG.fillTriangle(21, 34, 27, 34, 24, 43);
  waspG.generateTexture("wasp-sprite", 48, 48);
  waspG.destroy();

  // 4. Power Bloom: Swift Seed (Yellow/Gold Star)
  const swiftG = scene.add.graphics();
  swiftG.fillStyle(0xffd54f, 0.3);
  swiftG.fillCircle(20, 20, 18);
  swiftG.fillStyle(0xffca28, 1);
  swiftG.fillCircle(20, 20, 12);
  swiftG.fillStyle(0xffffff, 1);
  swiftG.fillTriangle(20, 6, 17, 18, 23, 18);
  swiftG.fillTriangle(20, 34, 17, 22, 23, 22);
  swiftG.fillTriangle(6, 20, 18, 17, 18, 23);
  swiftG.fillTriangle(34, 20, 22, 17, 22, 23);
  swiftG.fillCircle(20, 20, 4);
  swiftG.generateTexture("power-swift", 40, 40);
  swiftG.destroy();

  // 5. Power Bloom: Frost Petal (Ice Blue Crystal)
  const frostG = scene.add.graphics();
  frostG.fillStyle(0x4fc3f7, 0.35);
  frostG.fillCircle(20, 20, 18);
  frostG.fillStyle(0x0288d1, 1);
  frostG.fillCircle(20, 20, 12);
  frostG.fillStyle(0xe1f5fe, 1);
  frostG.fillTriangle(20, 8, 12, 20, 28, 20);
  frostG.fillTriangle(20, 32, 12, 20, 28, 20);
  frostG.lineStyle(1.5, 0xffffff, 0.9);
  frostG.strokeCircle(20, 20, 12);
  frostG.generateTexture("power-frost", 40, 40);
  frostG.destroy();

  // 6. Power Bloom: Heart Leaf (Emerald Green Leaf)
  const heartG = scene.add.graphics();
  heartG.fillStyle(0x66bb6a, 0.35);
  heartG.fillCircle(20, 20, 18);
  heartG.fillStyle(0x2e7d32, 1);
  heartG.fillCircle(20, 20, 12);
  heartG.fillStyle(0x81c784, 1);
  heartG.fillEllipse(20, 20, 10, 16);
  heartG.fillStyle(0xffffff, 0.9);
  heartG.fillCircle(20, 17, 3);
  heartG.generateTexture("power-heart", 40, 40);
  heartG.destroy();
}

