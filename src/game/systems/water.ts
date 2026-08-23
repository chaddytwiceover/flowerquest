import * as Phaser from "phaser";
import type { LevelDef } from "../types";

export type WaterRuntime = {
  tiles: Phaser.GameObjects.TileSprite[];
  group: Phaser.Physics.Arcade.StaticGroup;
};

/**
 * Impassable water from level data.
 * Bridge crossings are GAPS in these rectangles — not special-case logic.
 */
export function placeWater(scene: Phaser.Scene, level: LevelDef): WaterRuntime {
  const tiles: Phaser.GameObjects.TileSprite[] = [];
  const group = scene.physics.add.staticGroup();
  const bands = level.water ?? [];
  const hasTexture = scene.textures.exists("water");

  for (const band of bands) {
    const cx = band.x + band.w / 2;
    const cy = band.y + band.h / 2;

    if (hasTexture) {
      const tile = scene.add.tileSprite(cx, cy, band.w, band.h, "water");
      tile.setDepth(2);
      tile.setAlpha(0.38);
      tiles.push(tile);
    }

    const block = group.create(cx, cy, "spark") as Phaser.Physics.Arcade.Sprite;
    block.setVisible(false);
    block.setDisplaySize(band.w, band.h);
    block.refreshBody();
  }

  return { tiles, group };
}

export function updateWater(water: WaterRuntime, time: number) {
  for (const tile of water.tiles) {
    tile.tilePositionX = time * 0.018;
    tile.tilePositionY = Math.sin(time * 0.0014) * 6;
  }
}

export function placeBridges(scene: Phaser.Scene, level: LevelDef) {
  const bridges = level.bridges ?? [];
  if (!scene.textures.exists("bridge")) return;

  for (const def of bridges) {
    const sprite = scene.add.image(def.x, def.y, "bridge");
    sprite.setDisplaySize(def.displayWidth, def.displayHeight);
    sprite.setOrigin(0.5, 0.55);
    sprite.setDepth(Math.max(3, def.y - 40));
  }
}
