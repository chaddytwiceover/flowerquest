import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

// Because `src/game/systems/collectibles.ts` depends heavily on Phaser, importing it directly
// will crash in a Node environment (window is not defined).
// Per the user instructions, we refactored findNearbyCollectible to avoid Phaser Math.
// But we still cannot import the file directly in Node --test without hitting the top-level Phaser import.
// Using the same exact strategy as `level-regression.test.mjs`, we extract the logic.

const fileContent = fs.readFileSync("src/game/systems/collectibles.ts", "utf8");
const ast = ts.createSourceFile("collectibles.ts", fileContent, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

let findNearbyBody = "";
let flowersRemainingBody = "";
for (const statement of ast.statements) {
  if (ts.isFunctionDeclaration(statement)) {
    if (statement.name?.getText(ast) === "findNearbyCollectible") {
      findNearbyBody = statement.body.statements.map(s => s.getText(ast)).join("\n");
    } else if (statement.name?.getText(ast) === "flowersRemaining") {
      flowersRemainingBody = statement.body.statements.map(s => s.getText(ast)).join("\n");
    }
  }
}

if (!findNearbyBody || !flowersRemainingBody) {
  throw new Error("Could not find testable functions");
}

const findNearbyCollectible = new Function("flowers", "x", "y", "radius = 46", findNearbyBody);
const flowersRemaining = new Function("flowers", flowersRemainingBody);

test("flowersRemaining returns 0 for an empty array", () => {
  const flowers = [];
  const result = flowersRemaining(flowers);
  assert.equal(result, 0);
});

test("flowersRemaining counts only active flowers", () => {
  const flowers = [
    { active: true },
    { active: false },
    { active: true },
  ];
  const result = flowersRemaining(flowers);
  assert.equal(result, 2);
});

test("flowersRemaining returns 0 when no flowers are active", () => {
  const flowers = [
    { active: false },
    { active: false },
  ];
  const result = flowersRemaining(flowers);
  assert.equal(result, 0);
});

test("flowersRemaining counts all when all flowers are active", () => {
  const flowers = [
    { active: true },
    { active: true },
    { active: true },
  ];
  const result = flowersRemaining(flowers);
  assert.equal(result, 3);
});

test("findNearbyCollectible returns nearby active collectible", () => {
  const flowers = [
    { active: true, x: 100, y: 100 }
  ];
  const result = findNearbyCollectible(flowers, 110, 110, 46);
  assert.equal(result, flowers[0]);
});

test("findNearbyCollectible returns null for out-of-range collectible", () => {
  const flowers = [
    { active: true, x: 100, y: 100 }
  ];
  const result = findNearbyCollectible(flowers, 200, 200, 46);
  assert.equal(result, null);
});

test("findNearbyCollectible returns null for inactive collectible", () => {
  const flowers = [
    { active: false, x: 100, y: 100 }
  ];
  const result = findNearbyCollectible(flowers, 100, 100, 46);
  assert.equal(result, null);
});

test("findNearbyCollectible checks multiple collectibles and returns first match", () => {
  const flowers = [
    { active: false, x: 100, y: 100 },
    { active: true, x: 500, y: 500 },
    { active: true, x: 110, y: 110 }
  ];
  const result = findNearbyCollectible(flowers, 100, 100, 46);
  assert.equal(result, flowers[2]);
});

test("findNearbyCollectible respects custom radius", () => {
  const flowers = [
    { active: true, x: 100, y: 100 }
  ];
  const result1 = findNearbyCollectible(flowers, 150, 100, 46);
  assert.equal(result1, null);

  const result2 = findNearbyCollectible(flowers, 150, 100, 100);
  assert.equal(result2, flowers[0]);
});

test("findNearbyCollectible returns null for empty list", () => {
  const result = findNearbyCollectible([], 100, 100, 46);
  assert.equal(result, null);
});

test("findNearbyCollectible exact radius-boundary behavior", () => {
  const flowers = [
    { active: true, x: 100, y: 100 }
  ];
  const result1 = findNearbyCollectible(flowers, 110, 100, 10);
  assert.equal(result1, null);

  const result2 = findNearbyCollectible(flowers, 109, 100, 10);
  assert.equal(result2, flowers[0]);
});
