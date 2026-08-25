import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const LEVEL_COUNT = 10;
const LEVEL_DIR = "src/game/levels";
const VALID_FLOWERS = new Set(["daisy", "tulip", "rose", "sunflower", "bluebell"]);
const VALID_POWER_BLOOMS = new Set(["swift", "frost", "heart"]);
const VALID_HAZARDS = new Set(["beetle", "bee", "wasp"]);
const VALID_COMPLETE_ON = new Set(["collect-all", "reach-exit"]);
const VALID_MUSIC = new Set(["title", "meadow", "trail", "crossing", "twin", "maze", "hollow", "queen"]);

function readLevel(number) {
  const file = `${LEVEL_DIR}/level${number}.ts`;
  const source = readFileSync(file, "utf8");
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(ast) !== `level${number}`) continue;
      if (!declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) {
        throw new Error(`${file} does not export an object literal level${number}`);
      }
      return astToValue(declaration.initializer, ast);
    }
  }

  throw new Error(`${file} does not export level${number}`);
}

function astToValue(node, ast) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map((element) => astToValue(element, ast));
  if (ts.isPrefixUnaryExpression(node) && ts.isNumericLiteral(node.operand)) {
    const value = Number(node.operand.text);
    return node.operator === ts.SyntaxKind.MinusToken ? -value : value;
  }
  if (ts.isObjectLiteralExpression(node)) {
    const out = {};
    for (const property of node.properties) {
      assert.ok(ts.isPropertyAssignment(property), `Unsupported property in ${node.getText(ast)}`);
      const key = propertyName(property.name, ast);
      out[key] = astToValue(property.initializer, ast);
    }
    return out;
  }
  throw new Error(`Unsupported level value: ${node.getText(ast)}`);
}

function propertyName(name, ast) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  throw new Error(`Unsupported property name: ${name.getText(ast)}`);
}

function assertPointInBounds(level, label, point) {
  assert.equal(typeof point.x, "number", `${level.id} ${label} x is numeric`);
  assert.equal(typeof point.y, "number", `${level.id} ${label} y is numeric`);
  assert.ok(point.x >= 0 && point.x <= level.environment.width, `${level.id} ${label} x in bounds`);
  assert.ok(point.y >= 0 && point.y <= level.environment.height, `${level.id} ${label} y in bounds`);
}

function flowerCount(level, kind) {
  return level.flowers.filter((flower) => kind === "any" || flower.kind === kind).length;
}

const levels = Array.from({ length: LEVEL_COUNT }, (_, index) => readLevel(index + 1));

test("campaign has ten sequential, uniquely identified levels", () => {
  assert.equal(levels.length, LEVEL_COUNT);
  assert.deepEqual(
    levels.map((level) => level.id),
    Array.from({ length: LEVEL_COUNT }, (_, index) => `level-${index + 1}`),
  );
  assert.deepEqual(
    levels.map((level) => level.number),
    Array.from({ length: LEVEL_COUNT }, (_, index) => index + 1),
  );
  assert.equal(new Set(levels.map((level) => level.name)).size, LEVEL_COUNT);
  assert.equal(new Set(levels.map((level) => level.environment.mapKey)).size, LEVEL_COUNT);
});

test("every level has playable baseline data and existing map assets", () => {
  for (const level of levels) {
    assert.ok(level.name.length > 0, `${level.id} has a name`);
    assert.ok(level.objectiveText.length > 0, `${level.id} has objective copy`);
    assert.ok(level.playerSpeed > 0, `${level.id} has positive player speed`);
    assert.ok(level.hearts > 0, `${level.id} has hearts`);
    assert.ok(VALID_COMPLETE_ON.has(level.completeOn), `${level.id} completion mode is valid`);
    assert.ok(VALID_MUSIC.has(level.music), `${level.id} music id is valid`);
    assert.ok(level.environment.width > 0 && level.environment.height > 0, `${level.id} has map size`);
    assert.ok(level.environment.boundsInset >= 0, `${level.id} bounds inset is non-negative`);

    const mapPath = level.environment.mapUrl.replace(/^\//, "public/");
    assert.ok(existsSync(mapPath), `${level.id} map asset exists: ${mapPath}`);
    assertPointInBounds(level, "player spawn", level.playerSpawn);
  }
});

test("collectibles, power blooms, exits, and objectives are internally consistent", () => {
  for (const level of levels) {
    assert.ok(level.flowers.length > 0, `${level.id} has collectibles`);
    for (const [index, flower] of level.flowers.entries()) {
      assert.ok(VALID_FLOWERS.has(flower.kind), `${level.id} flower ${index} kind is valid`);
      assertPointInBounds(level, `flower ${index}`, flower);
    }

    for (const [index, bloom] of (level.powerBlooms ?? []).entries()) {
      assert.ok(VALID_POWER_BLOOMS.has(bloom.kind), `${level.id} power bloom ${index} kind is valid`);
      assertPointInBounds(level, `power bloom ${index}`, bloom);
    }

    if (level.completeOn === "collect-all") {
      assert.equal(level.exit, null, `${level.id} collect-all levels do not require an exit`);
    } else {
      assert.ok(level.exit, `${level.id} reach-exit levels define an exit`);
      assertPointInBounds(level, "exit", level.exit);
      assert.ok(level.exit.lockedHint.length > 0, `${level.id} exit has locked hint`);
      assert.ok(level.exit.unlockedHint.length > 0, `${level.id} exit has unlocked hint`);
      assert.ok(level.exit.unlockedObjective.length > 0, `${level.id} exit has unlocked objective`);
      if (level.exit.unlockAt !== "all-flowers") {
        assert.ok(level.exit.unlockAt > 0, `${level.id} numeric unlockAt is positive`);
        assert.ok(level.exit.unlockAt <= level.flowers.length, `${level.id} numeric unlockAt is reachable`);
      }
    }

    const objectives = level.objectives ?? [
      { type: "collect", collectible: "any", required: level.flowers.length, label: level.collectibleLabel ?? "" },
    ];
    for (const [index, objective] of objectives.entries()) {
      assert.equal(objective.type, "collect", `${level.id} objective ${index} is currently collect`);
      assert.ok(objective.required > 0, `${level.id} objective ${index} has positive requirement`);
      assert.ok(flowerCount(level, objective.collectible) >= objective.required, `${level.id} objective ${index} is reachable`);
    }
  }
});

test("hazards and blocking layout are valid enough for baseline gameplay", () => {
  for (const level of levels) {
    for (const [index, hazard] of level.hazards.entries()) {
      assert.ok(VALID_HAZARDS.has(hazard.kind), `${level.id} hazard ${index} kind is valid`);
      assert.ok(hazard.speed > 0, `${level.id} hazard ${index} speed is positive`);
      assertPointInBounds(level, `hazard ${index}`, hazard);

      if (hazard.kind === "beetle") {
        assert.ok((hazard.patrol ?? []).length >= 2, `${level.id} beetle ${index} has a patrol`);
      }
      if (hazard.kind === "bee") {
        assert.ok((hazard.patrol ?? []).length >= 2, `${level.id} bee ${index} has a patrol`);
        assert.ok(hazard.detectRadius > 0, `${level.id} bee ${index} has detection radius`);
        assert.ok(hazard.chaseSpeed > hazard.speed, `${level.id} bee ${index} chase speed exceeds patrol speed`);
        assert.ok(hazard.leashRadius >= hazard.detectRadius, `${level.id} bee ${index} leash covers detection`);
      }
      if (hazard.kind === "wasp") {
        assert.ok(hazard.guardZone, `${level.id} wasp ${index} has a guard zone`);
        assertPointInBounds(level, `wasp ${index} guard zone`, hazard.guardZone);
        assert.ok(hazard.guardZone.radius > 0, `${level.id} wasp ${index} guard radius is positive`);
        assert.ok(hazard.detectRadius > 0, `${level.id} wasp ${index} has detection radius`);
        assert.ok(hazard.chaseSpeed > hazard.speed, `${level.id} wasp ${index} chase speed exceeds idle speed`);
      }

      for (const [patrolIndex, point] of (hazard.patrol ?? []).entries()) {
        assertPointInBounds(level, `hazard ${index} patrol ${patrolIndex}`, point);
      }
    }

    for (const [index, obstacle] of level.obstacles.entries()) {
      assert.ok(obstacle.height > 0, `${level.id} obstacle ${index} has height`);
      assertPointInBounds(level, `obstacle ${index}`, obstacle);
    }

    for (const [index, wall] of [...level.walls, ...(level.water ?? [])].entries()) {
      assert.ok(wall.w > 0 && wall.h > 0, `${level.id} wall/water ${index} has size`);
      assert.ok(wall.x >= 0 && wall.y >= 0, `${level.id} wall/water ${index} starts in bounds`);
      assert.ok(wall.x + wall.w <= level.environment.width, `${level.id} wall/water ${index} width in bounds`);
      assert.ok(wall.y + wall.h <= level.environment.height, `${level.id} wall/water ${index} height in bounds`);
    }

    for (const [index, bridge] of (level.bridges ?? []).entries()) {
      assert.ok(bridge.displayWidth > 0 && bridge.displayHeight > 0, `${level.id} bridge ${index} has size`);
      assertPointInBounds(level, `bridge ${index}`, bridge);
    }
  }
});

test("completion copy supports win and loss reporting for every level", () => {
  for (const level of levels) {
    for (const key of ["winKicker", "winTitle", "winBody", "loseKicker", "loseTitle", "loseBody"]) {
      assert.ok(level.completion[key].length > 0, `${level.id} completion.${key} has copy`);
    }
  }
});
