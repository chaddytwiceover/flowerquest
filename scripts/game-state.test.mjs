import test from "node:test";
import assert from "node:assert/strict";
import { getGameState, patchGameState, subscribeGameState } from "../src/game/state.ts";

test("subscribeGameState invokes callback immediately with current state", () => {
  const currentState = getGameState();
  let invokedState = null;

  const unsubscribe = subscribeGameState((state) => {
    invokedState = state;
  });

  assert.equal(invokedState, currentState);

  unsubscribe();
});

test("subscribeGameState invokes callback when state is patched", () => {
  let invocationCount = 0;
  let lastInvokedState = null;

  const unsubscribe = subscribeGameState((state) => {
    invocationCount++;
    lastInvokedState = state;
  });

  // Initial invocation is 1
  assert.equal(invocationCount, 1);

  // Patch state
  patchGameState({ hearts: 99 });

  // Should be invoked again
  assert.equal(invocationCount, 2);
  assert.equal(lastInvokedState.hearts, 99);

  unsubscribe();
});

test("subscribeGameState unsubscribe prevents future invocations", () => {
  let invocationCount = 0;

  const unsubscribe = subscribeGameState(() => {
    invocationCount++;
  });

  assert.equal(invocationCount, 1);

  // Unsubscribe
  unsubscribe();

  // Patch state
  patchGameState({ hearts: 50 });

  // Invocation count should not change
  assert.equal(invocationCount, 1);
});

test("getGameState returns the current state", () => {
  const state = getGameState();
  assert.ok(state !== null);
  assert.equal(typeof state, "object");
  assert.ok("phase" in state);
  assert.ok("hearts" in state);
});

test("patchGameState merges partial state correctly", () => {
  const initialState = { ...getGameState() };
  const newHearts = initialState.hearts + 10;
  const newPhase = "won";

  patchGameState({ hearts: newHearts, phase: newPhase });

  const newState = getGameState();
  assert.equal(newState.hearts, newHearts);
  assert.equal(newState.phase, newPhase);

  // Other properties should remain untouched
  assert.equal(newState.levelId, initialState.levelId);
  assert.equal(newState.flowersCollected, initialState.flowersCollected);

  // Restore initial state to avoid side effects in other tests
  patchGameState(initialState);
});
