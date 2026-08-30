import test from "node:test";
import assert from "node:assert/strict";

import { lockedExitHint } from "../src/game/systems/objectives.ts";
import { getGameState, patchGameState, resetRunState } from "../src/game/state.ts";

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
