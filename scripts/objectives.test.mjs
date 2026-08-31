import test from "node:test";
import assert from "node:assert/strict";

import { lockedExitHint, resolveObjectives } from "../src/game/systems/objectives.ts";
import { patchGameState, resetRunState } from "../src/game/state.ts";

test("objectives system tests", async (t) => {
  t.beforeEach(() => {
    resetRunState({ objectives: [] });
  });

  await t.test("lockedExitHint returns fallback when < 2 objectives", () => {
    patchGameState({ objectives: [] });
    assert.equal(lockedExitHint("Find the key"), "Find the key");

    patchGameState({
      objectives: [
        { collectible: "daisy", label: "Daisies", icon: "daisy", collected: 0, required: 5 }
      ]
    });
    assert.equal(lockedExitHint("Find the key"), "Find the key");
  });

  await t.test("lockedExitHint returns fallback when all objectives met", () => {
    patchGameState({
      objectives: [
        { collectible: "daisy", label: "Daisies", icon: "daisy", collected: 5, required: 5 },
        { collectible: "rose", label: "Roses", icon: "rose", collected: 3, required: 3 }
      ]
    });
    assert.equal(lockedExitHint("Find the key"), "Find the key");
  });

  await t.test("lockedExitHint returns formatted string for unmet objectives", () => {
    patchGameState({
      objectives: [
        { collectible: "daisy", label: "Daisies", icon: "daisy", collected: 2, required: 5 },
        { collectible: "rose", label: "Roses", icon: "rose", collected: 1, required: 3 }
      ]
    });
    assert.equal(lockedExitHint("Find the key"), "Still need 3 daisies and 2 roses!");
  });

  await t.test("lockedExitHint filters out met objectives in formatted string", () => {
    patchGameState({
      objectives: [
        { collectible: "daisy", label: "Daisies", icon: "daisy", collected: 5, required: 5 },
        { collectible: "rose", label: "Roses", icon: "rose", collected: 1, required: 3 }
      ]
    });
    assert.equal(lockedExitHint("Find the key"), "Still need 2 roses!");
  });

  await t.test("lockedExitHint formats multiple unmet objectives correctly", () => {
    patchGameState({
      objectives: [
        { collectible: "daisy", label: "Daisies", icon: "daisy", collected: 4, required: 5 },
        { collectible: "rose", label: "Roses", icon: "rose", collected: 1, required: 3 },
        { collectible: "tulip", label: "Tulips", icon: "tulip", collected: 0, required: 1 }
      ]
    });
    assert.equal(lockedExitHint("Find the key"), "Still need 1 daisies and 2 roses and 1 tulips!");
  });
});

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
