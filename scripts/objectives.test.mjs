import test from "node:test";
import assert from "node:assert/strict";

import { resolveObjectives } from "../src/game/systems/objectives.ts";

test("resolveObjectives", async (t) => {
  await t.test("returns level.objectives if present and non-empty", () => {
    const objectives = [
      { type: "collect", collectible: "tulip", required: 5, label: "Tulips" }
    ];
    const level = {
      objectives,
      flowers: [], // Shouldn't be used
      collectibleLabel: "Default",
    };

    // Pass as is
    const result = resolveObjectives(level);
    assert.deepEqual(result, objectives);
  });

  await t.test("returns default objective if level.objectives is undefined", () => {
    const level = {
      flowers: [{}, {}, {}], // 3 flowers
      collectibleLabel: "Flowers",
    };

    const result = resolveObjectives(level);
    assert.deepEqual(result, [
      {
        type: "collect",
        collectible: "any",
        required: 3,
        label: "Flowers",
      }
    ]);
  });

  await t.test("returns default objective if level.objectives is empty", () => {
    const level = {
      objectives: [],
      flowers: [{}, {}], // 2 flowers
      collectibleLabel: "Blooms",
    };

    const result = resolveObjectives(level);
    assert.deepEqual(result, [
      {
        type: "collect",
        collectible: "any",
        required: 2,
        label: "Blooms",
      }
    ]);
  });

  await t.test("defaults to empty string label if level.collectibleLabel is undefined", () => {
    const level = {
      flowers: [{}], // 1 flower
    };

    const result = resolveObjectives(level);
    assert.deepEqual(result, [
      {
        type: "collect",
        collectible: "any",
        required: 1,
        label: "",
      }
    ]);
  });

  await t.test("defaults to empty string label if level.collectibleLabel is null", () => {
    const level = {
      flowers: [{}], // 1 flower
      collectibleLabel: null,
    };

    const result = resolveObjectives(level);
    assert.deepEqual(result, [
      {
        type: "collect",
        collectible: "any",
        required: 1,
        label: "",
      }
    ]);
  });
});
