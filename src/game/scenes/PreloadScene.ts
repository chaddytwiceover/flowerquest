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

    patchGameState({ assetsReady: true, loadProgress: 1, phase: "menu" });
    this.scene.start("wait");
  }
}
