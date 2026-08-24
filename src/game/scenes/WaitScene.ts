import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { LEVELS } from "../levels";

/** Dynamic living garden backdrop while the start overlay is showing. */
export class WaitScene extends Phaser.Scene {
  private bee?: Phaser.GameObjects.Sprite;
  private beeAngle = 0;

  constructor() {
    super("wait");
  }

  create() {
    const mapKey = LEVELS[0].environment.mapKey;
    const map = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, mapKey);
    const scale = Math.max(GAME_WIDTH / map.width, GAME_HEIGHT / map.height);
    map.setScale(scale * 1.06);
    map.setAlpha(0.92);

    // Camera gentle breathing zoom
    this.tweens.add({
      targets: map,
      scaleX: scale * 1.12,
      scaleY: scale * 1.12,
      duration: 7000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Golden pollen particles floating softly upwards & drifting
    const particles = this.add.particles(0, 0, "spark", {
      x: { min: 0, max: GAME_WIDTH },
      y: { min: GAME_HEIGHT + 10, max: GAME_HEIGHT + 30 },
      speedY: { min: -25, max: -50 },
      speedX: { min: -15, max: 15 },
      scale: { start: 0.7, end: 0.1 },
      alpha: { start: 0.6, end: 0 },
      tint: [0xe0a93a, 0xf7f1e3, 0x81c784, 0x4fc3f7],
      lifespan: 5000,
      frequency: 220,
    });
    particles.setDepth(10);

    // Floating Power Bloom preview icons with gentle glow in the background
    const powerIcons = [
      { key: "power-swift", x: GAME_WIDTH * 0.22, y: GAME_HEIGHT * 0.32, delay: 0 },
      { key: "power-frost", x: GAME_WIDTH * 0.78, y: GAME_HEIGHT * 0.28, delay: 400 },
      { key: "power-heart", x: GAME_WIDTH * 0.82, y: GAME_HEIGHT * 0.68, delay: 800 },
    ];

    powerIcons.forEach((p) => {
      if (this.textures.exists(p.key)) {
        const icon = this.add.image(p.x, p.y, p.key);
        icon.setScale(0.75);
        icon.setAlpha(0.45);
        icon.setDepth(5);
        this.tweens.add({
          targets: icon,
          y: p.y - 14,
          scale: 0.82,
          alpha: 0.7,
          duration: 1800 + Math.random() * 400,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
          delay: p.delay,
        });
      }
    });

    // Friendly buzzing bee looping in the sky
    if (this.textures.exists("bee-sprite")) {
      this.bee = this.add.sprite(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.42, "bee-sprite");
      this.bee.setScale(0.65);
      this.bee.setAlpha(0.75);
      this.bee.setDepth(8);
    }
  }

  update(time: number, delta: number) {
    if (!this.bee) return;
    this.beeAngle += delta * 0.0018;
    const cx = GAME_WIDTH * 0.5;
    const cy = GAME_HEIGHT * 0.42;
    const rx = GAME_WIDTH * 0.35;
    const ry = GAME_HEIGHT * 0.12;

    this.bee.x = cx + Math.cos(this.beeAngle) * rx;
    this.bee.y = cy + Math.sin(this.beeAngle * 2) * ry;
    this.bee.setFlipX(Math.cos(this.beeAngle) < 0);
  }
}
