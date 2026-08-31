import test from "node:test";
import assert from "node:assert/strict";
import { flowersNeeded } from "../src/game/systems/objectives.ts";

test("flowersNeeded calculates the total required flowers from a single 'any' objective", () => {
  const level: any = {
    flowers: [
      { x: 0, y: 0, kind: "daisy" },
      { x: 0, y: 0, kind: "tulip" }
    ],
  };

  assert.equal(flowersNeeded(level), 2);
});

test("flowersNeeded calculates total from specific objectives", () => {
  const level: any = {
    flowers: [],
    objectives: [
      { type: "collect", collectible: "daisy", required: 3, label: "Daisies" },
      { type: "collect", collectible: "tulip", required: 5, label: "Tulips" }
    ]
  };

  assert.equal(flowersNeeded(level), 8);
});

test("flowersNeeded returns 0 for empty objectives (if allowed)", () => {
  const level: any = {
    flowers: [],
  };
  assert.equal(flowersNeeded(level), 0);
});
