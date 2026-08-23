import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { LEVELS } from "../levels";

/** Quiet garden backdrop while the start overlay is showing. */
export class WaitScene extends Phaser.Scene {
  constructor() {
    super("wait");
  }

  create() {
    const mapKey = LEVELS[0].environment.mapKey;
    const map = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, mapKey);
    const scale = Math.max(GAME_WIDTH / map.width, GAME_HEIGHT / map.height);
    map.setScale(scale * 1.08);
    map.setAlpha(0.95);
  }
}
