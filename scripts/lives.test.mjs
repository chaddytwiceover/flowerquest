import test from "node:test";
import assert from "node:assert/strict";

import { currentHearts, loseHeart, resetHearts } from "../src/game/systems/lives.ts";
import { getGameState, patchGameState, resetRunState } from "../src/game/state.ts";

test("lives system tests", async (t) => {
  t.beforeEach(() => {
    resetRunState();
  });

  await t.test("currentHearts returns current hearts", () => {
    patchGameState({ hearts: 5 });
    assert.equal(currentHearts(), 5);

    patchGameState({ hearts: 2 });
    assert.equal(currentHearts(), 2);
  });

  await t.test("loseHeart decrements hearts", () => {
    patchGameState({ hearts: 3 });
    const result = loseHeart();
    assert.deepEqual(result, { hearts: 2, dead: false });
    assert.equal(getGameState().hearts, 2);
  });

  await t.test("loseHeart caps at 0 and reports dead", () => {
    patchGameState({ hearts: 1 });
    const result1 = loseHeart();
    assert.deepEqual(result1, { hearts: 0, dead: true });
    assert.equal(getGameState().hearts, 0);

    const result2 = loseHeart();
    assert.deepEqual(result2, { hearts: 0, dead: true });
    assert.equal(getGameState().hearts, 0);
  });

  await t.test("resetHearts updates hearts and heartsMax", () => {
    patchGameState({ hearts: 1, heartsMax: 3 });

    resetHearts(5);

    const state = getGameState();
    assert.equal(state.hearts, 5);
    assert.equal(state.heartsMax, 5);
  });
});
