import test from "node:test";
import assert from "node:assert/strict";

import { noteCollected } from "../src/game/systems/objectives.ts";
import { getGameState, patchGameState, resetRunState } from "../src/game/state.ts";

test("objectives system tests - noteCollected", async (t) => {
  t.beforeEach(() => {
    resetRunState();
  });

  const dummyLevelAny = {
    id: "dummy-level-1",
    flowers: [
      { x: 0, y: 0, kind: "daisy" },
      { x: 0, y: 0, kind: "rose" },
    ],
    objectives: [
      {
        type: "collect",
        collectible: "any",
        required: 2,
        label: "Any flowers",
      },
    ],
  };

  const dummyLevelSpecific = {
    id: "dummy-level-2",
    flowers: [
      { x: 0, y: 0, kind: "daisy" },
      { x: 0, y: 0, kind: "rose" },
    ],
    objectives: [
      {
        type: "collect",
        collectible: "daisy",
        required: 1,
        label: "Daisies",
      },
    ],
  };

  const dummyLevelMultiple = {
    id: "dummy-level-3",
    flowers: [
      { x: 0, y: 0, kind: "daisy" },
      { x: 0, y: 0, kind: "rose" },
    ],
    objectives: [
      {
        type: "collect",
        collectible: "daisy",
        required: 1,
        label: "Daisies",
      },
      {
        type: "collect",
        collectible: "rose",
        required: 1,
        label: "Roses",
      },
    ],
  };

  await t.test("collecting a flower with 'any' collectible requirement", () => {
    patchGameState({
      objectives: [
        { collectible: "any", label: "Any flowers", icon: "daisy", collected: 0, required: 2 },
      ],
    });
    const result = noteCollected(dummyLevelAny, "rose");
    assert.deepEqual(result, { collected: 1, needed: 2, met: false });
    assert.equal(getGameState().flowersCollected, 1);
    assert.equal(getGameState().objectives[0].collected, 1);
  });

  await t.test("collecting a single specific flower updates objectives correctly", () => {
    patchGameState({
      objectives: [
        { collectible: "daisy", label: "Daisies", icon: "daisy", collected: 0, required: 1 },
      ],
    });
    const result = noteCollected(dummyLevelSpecific, "daisy");
    assert.deepEqual(result, { collected: 1, needed: 1, met: true });
    assert.equal(getGameState().flowersCollected, 1);
    assert.equal(getGameState().objectives[0].collected, 1);
  });

  await t.test("collecting an unrelated flower does not increment specific objective", () => {
    patchGameState({
      objectives: [
        { collectible: "daisy", label: "Daisies", icon: "daisy", collected: 0, required: 1 },
      ],
    });
    const result = noteCollected(dummyLevelSpecific, "rose");
    assert.deepEqual(result, { collected: 0, needed: 1, met: false });
    assert.equal(getGameState().flowersCollected, 0);
    assert.equal(getGameState().objectives[0].collected, 0);
  });

  await t.test("collecting a flower when max required is already reached does not increment", () => {
    patchGameState({
      objectives: [
        { collectible: "daisy", label: "Daisies", icon: "daisy", collected: 1, required: 1 },
      ],
    });
    const result = noteCollected(dummyLevelSpecific, "daisy");
    assert.deepEqual(result, { collected: 1, needed: 1, met: true });
    assert.equal(getGameState().flowersCollected, 1);
    assert.equal(getGameState().objectives[0].collected, 1);
  });

  await t.test("collecting a flower updates the global game state (flowersCollected, objectives)", () => {
    patchGameState({
      objectives: [
        { collectible: "daisy", label: "Daisies", icon: "daisy", collected: 0, required: 1 },
        { collectible: "rose", label: "Roses", icon: "rose", collected: 0, required: 1 },
      ],
    });
    const result1 = noteCollected(dummyLevelMultiple, "daisy");
    assert.deepEqual(result1, { collected: 1, needed: 2, met: false });
    assert.equal(getGameState().flowersCollected, 1);
    assert.equal(getGameState().flowersNeeded, 2);
    assert.equal(getGameState().objectives[0].collected, 1);
    assert.equal(getGameState().objectives[1].collected, 0);

    const result2 = noteCollected(dummyLevelMultiple, "rose");
    assert.deepEqual(result2, { collected: 2, needed: 2, met: true });
    assert.equal(getGameState().flowersCollected, 2);
    assert.equal(getGameState().flowersNeeded, 2);
    assert.equal(getGameState().objectives[0].collected, 1);
    assert.equal(getGameState().objectives[1].collected, 1);
  });
});
