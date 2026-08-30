import { createRequire } from "module";
const require = createRequire(import.meta.url);

if (typeof window === "undefined") {
  class MockCanvas {}
  class MockImage {
    constructor() {
      this.onload = null;
      this.onerror = null;
      this.src = "";
    }
  }
  Object.defineProperty(global, "HTMLCanvasElement", { value: MockCanvas, writable: true });
  Object.defineProperty(global, "Image", { value: MockImage, writable: true });
  const mockWindow = {
    addEventListener: () => {},
    removeEventListener: () => {},
    focus: () => {},
    blur: () => {},
    location: { href: "", search: "" },
  };
  Object.defineProperty(global, "window", { value: mockWindow, writable: true });

  const mockContext = {
    fillStyle: "",
    fillRect: () => {},
    getImageData: () => ({ data: [0, 0, 0, 0] }),
    putImageData: () => {},
    createImageData: () => ({ data: [] }),
  };

  Object.defineProperty(global, "document", {
    value: {
      createElement: () => ({
        getContext: () => mockContext,
        style: {},
      }),
      getElementsByTagName: () => [],
      body: { appendChild: () => {} },
      documentElement: {},
    },
    writable: true,
  });
}

const Module = require("module");
const origRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === "phaser3spectorjs") return {};
  return origRequire.apply(this, arguments);
};

const PhaserModule = await import("phaser");
const Phaser = PhaserModule.default || PhaserModule;

function hazardTouchesBaseline(hazards, x, y, radius = 34) {
  for (const hazard of hazards) {
    if (!hazard.sprite.active) continue;
    if (Phaser.Math.Distance.Between(x, y, hazard.sprite.x, hazard.sprite.y) < radius) {
      return true;
    }
  }
  return false;
}

function hazardTouchesOptimized(hazards, x, y, radius = 34) {
  const radiusSq = radius * radius;
  for (const hazard of hazards) {
    if (!hazard.sprite.active) continue;
    if (Phaser.Math.Distance.Squared(x, y, hazard.sprite.x, hazard.sprite.y) < radiusSq) {
      return true;
    }
  }
  return false;
}

function generateMockHazards(count) {
  const hazards = [];
  for (let i = 0; i < count; i++) {
    hazards.push({
      kind: "beetle",
      def: { kind: "beetle", x: i * 50, y: i * 50, waypoints: [] },
      sprite: {
        active: true,
        x: i * 50 + 100,
        y: i * 50 + 100,
        setVelocity: () => {},
      },
      state: "patrol",
      waypointIndex: 0,
      timer: 0,
    });
  }
  return hazards;
}

const hazardCount = 50;
const hazards = generateMockHazards(hazardCount);
const iterations = 5000000;

function runBench(fn) {
  const start = performance.now();
  let hits = 0;
  for (let i = 0; i < iterations; i++) {
    const x = (i % 500) * 2;
    const y = ((i * 3) % 500) * 2;
    if (fn(hazards, x, y, 34)) {
      hits++;
    }
  }
  const end = performance.now();
  // Ensure hits isn't unused
  if (hits < 0) console.log(hits);
  return end - start;
}

// Warmup
for (let i = 0; i < 10000; i++) {
  hazardTouchesBaseline(hazards, 500, 500, 34);
  hazardTouchesOptimized(hazards, 500, 500, 34);
}

console.log("Alternating benchmark runs...");

let totalBase = 0;
let totalOpt = 0;
const RUNS = 5;

for (let r = 0; r < RUNS; r++) {
  const tOpt = runBench(hazardTouchesOptimized);
  const tBase = runBench(hazardTouchesBaseline);
  totalOpt += tOpt;
  totalBase += tBase;
  console.log(`Run ${r + 1}: Optimized = ${tOpt.toFixed(2)}ms, Baseline = ${tBase.toFixed(2)}ms`);
}

const avgBase = totalBase / RUNS;
const avgOpt = totalOpt / RUNS;

console.log(`\nAverage Baseline: ${avgBase.toFixed(2)}ms`);
console.log(`Average Optimized: ${avgOpt.toFixed(2)}ms`);
console.log(`Speedup: ${(((avgBase - avgOpt) / avgBase) * 100).toFixed(2)}%`);
