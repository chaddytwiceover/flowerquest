import * as Phaser from "phaser";
import { patchGameState } from "../state";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create() {
    patchGameState({ phase: "boot", loadProgress: 0 });
    this.scene.start("preload");
  }
}
