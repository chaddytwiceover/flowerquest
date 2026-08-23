import type * as Phaser from "phaser";
import type { LevelDef, ObstacleKind } from "../types";

const BODY_BY_KIND: Record<ObstacleKind, { w: number; h: number }> = {
  tree: { w: 36, h: 22 },
  bush: { w: 48, h: 26 },
  rock: { w: 46, h: 26 },
  stump: { w: 38, h: 22 },
  pot: { w: 26, h: 22 },
  arch: { w: 22, h: 16 },
};

/** Trees, rocks, bushes, arches, and rectangular hedge/wall blockers. */
export function placeObstacles(
  scene: Phaser.Scene,
  level: LevelDef,
  blockers: Phaser.Physics.Arcade.StaticGroup,
) {
  for (const prop of level.obstacles) {
    const sprite = scene.physics.add.staticSprite(prop.x, prop.y, prop.kind);
    const src = sprite.height || 1;
    sprite.setScale(prop.height / src);
    sprite.setOrigin(0.5, 0.88);
    sprite.setDepth(prop.y);
    const body = BODY_BY_KIND[prop.kind];
    sprite.body?.setSize(body.w, body.h);
    sprite.body?.setOffset((sprite.width - body.w) / 2, sprite.height - body.h - 4);
    sprite.refreshBody();
    if (prop.collides !== false) blockers.add(sprite);
  }

  // Origin 0,0 so maze hedges match the data rects exactly.
  for (const wall of level.walls) {
    const block = scene.physics.add.staticImage(wall.x, wall.y, "spark");
    block.setVisible(false);
    block.setOrigin(0, 0);
    block.setDisplaySize(wall.w, wall.h);
    block.refreshBody();
    blockers.add(block);
    block.refreshBody();
  }
}
