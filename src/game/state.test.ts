import test from "node:test";
import assert from "node:assert/strict";
import { getGameState, patchGameState, resetRunState } from "./state.ts";

test("resetRunState clears run-specific state variables", () => {
  // Setup arbitrary run state
  patchGameState({
    flowersCollected: 5,
    hearts: 1, // heartsMax is 3 by default
    banner: "Level Complete!",
    gateUnlocked: true,
    activePowerUp: "swift",
    powerUpRemaining: 100,
    powerUpTotal: 200,
    objectives: [
      { collectible: "daisy", label: "Daisies", icon: "daisy", collected: 3, required: 5 },
      { collectible: "rose", label: "Roses", icon: "rose", collected: 1, required: 2 },
    ],
  });

  let state = getGameState();
  assert.equal(state.flowersCollected, 5);
  assert.equal(state.hearts, 1);
  assert.equal(state.banner, "Level Complete!");
  assert.equal(state.gateUnlocked, true);
  assert.equal(state.activePowerUp, "swift");
  assert.equal(state.powerUpRemaining, 100);
  assert.equal(state.powerUpTotal, 200);
  assert.equal(state.objectives[0].collected, 3);
  assert.equal(state.objectives[1].collected, 1);

  // Perform reset
  resetRunState();

  state = getGameState();

  // Assert state is cleared
  assert.equal(state.flowersCollected, 0);
  assert.equal(state.hearts, state.heartsMax);
  assert.equal(state.banner, null);
  assert.equal(state.gateUnlocked, false);
  assert.equal(state.activePowerUp, null);
  assert.equal(state.powerUpRemaining, 0);
  assert.equal(state.powerUpTotal, 0);

  // Assert objectives' collected counts are reset
  assert.equal(state.objectives[0].collected, 0);
  assert.equal(state.objectives[0].required, 5); // required shouldn't change
  assert.equal(state.objectives[1].collected, 0);
  assert.equal(state.objectives[1].required, 2);
});

test("resetRunState applies partial state overrides", () => {
  resetRunState({
    flowersCollected: 10,
    banner: "Bonus Round!"
  });

  const state = getGameState();
  assert.equal(state.flowersCollected, 10);
  assert.equal(state.hearts, state.heartsMax); // Reset value, not overridden
  assert.equal(state.banner, "Bonus Round!"); // Overridden
  assert.equal(state.gateUnlocked, false);
});
