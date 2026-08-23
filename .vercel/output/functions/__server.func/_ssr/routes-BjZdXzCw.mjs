import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as __exportAll } from "./ssr.mjs";
import { n as Pause } from "../_libs/lucide-react.mjs";
import { r as signOut, t as authClient } from "./client-Bh4EzEHo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BjZdXzCw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* One action layer for keyboard, touch joystick, and gamepad.
* Gameplay should only read `actions` — never raw events.
*/
var actions = {
	moveX: 0,
	moveY: 0
};
var keys = /* @__PURE__ */ new Set();
var joystick = {
	x: 0,
	y: 0
};
var keyOverride = null;
var attached = false;
var GAME_KEYS = /* @__PURE__ */ new Set([
	"KeyW",
	"KeyA",
	"KeyS",
	"KeyD",
	"ArrowUp",
	"ArrowLeft",
	"ArrowDown",
	"ArrowRight",
	"Space"
]);
function onKeyDown(event) {
	if (GAME_KEYS.has(event.code)) event.preventDefault();
	keys.add(event.code);
}
function onKeyUp(event) {
	keys.delete(event.code);
}
function clearKeys() {
	keys.clear();
}
function setJoystick(x, y) {
	joystick.x = x;
	joystick.y = y;
}
function setKeyOverride(codes) {
	keyOverride = codes;
}
function onVisibilityChange() {
	if (document.hidden) clearKeys();
}
function attachInput() {
	if (attached || typeof window === "undefined") return;
	attached = true;
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("blur", clearKeys);
	document.addEventListener("visibilitychange", onVisibilityChange);
}
function detachInput() {
	if (!attached || typeof window === "undefined") return;
	attached = false;
	window.removeEventListener("keydown", onKeyDown);
	window.removeEventListener("keyup", onKeyUp);
	window.removeEventListener("blur", clearKeys);
	document.removeEventListener("visibilitychange", onVisibilityChange);
	keys.clear();
	joystick.x = 0;
	joystick.y = 0;
	keyOverride = null;
	actions.moveX = 0;
	actions.moveY = 0;
}
function radialDeadzone(x, y, dz = .15) {
	const mag = Math.hypot(x, y);
	if (mag < dz) return {
		x: 0,
		y: 0
	};
	const scale = (mag - dz) / (1 - dz) / mag;
	return {
		x: x * scale,
		y: y * scale
	};
}
function readGamepad() {
	if (typeof navigator === "undefined" || !navigator.getGamepads) return {
		x: 0,
		y: 0
	};
	const pads = navigator.getGamepads();
	for (const pad of pads) {
		if (!pad) continue;
		const stick = radialDeadzone(pad.axes[0] ?? 0, pad.axes[1] ?? 0);
		const dpadX = (pad.buttons[15]?.pressed ? 1 : 0) - (pad.buttons[14]?.pressed ? 1 : 0);
		const dpadY = (pad.buttons[13]?.pressed ? 1 : 0) - (pad.buttons[12]?.pressed ? 1 : 0);
		const x = stick.x + dpadX;
		const y = stick.y + dpadY;
		if (x !== 0 || y !== 0) return {
			x,
			y
		};
	}
	return {
		x: 0,
		y: 0
	};
}
/** Call once per frame before movement. */
function updateActions() {
	const codes = keyOverride ?? [...keys];
	let x = keyOverride ? 0 : joystick.x;
	let y = keyOverride ? 0 : joystick.y;
	if (codes.includes("KeyA") || codes.includes("ArrowLeft")) x -= 1;
	if (codes.includes("KeyD") || codes.includes("ArrowRight")) x += 1;
	if (codes.includes("KeyW") || codes.includes("ArrowUp")) y -= 1;
	if (codes.includes("KeyS") || codes.includes("ArrowDown")) y += 1;
	if (!keyOverride) {
		const pad = readGamepad();
		x += pad.x;
		y += pad.y;
	}
	const mag = Math.hypot(x, y);
	if (mag > 1) {
		x /= mag;
		y /= mag;
	}
	actions.moveX = x;
	actions.moveY = y;
}
/** Every playable level. Add a new file and push it here to expand. */
var LEVELS = [
	{
		id: "level-1",
		number: 1,
		name: "The Meadow Gate",
		objectiveText: "Collect 8 flowers. Watch for beetles.",
		environment: {
			mapKey: "map-level-1",
			mapUrl: "/game/maps/level1-base.jpg",
			width: 1408,
			height: 1408,
			boundsInset: 40
		},
		playerSpawn: {
			x: 704,
			y: 1240
		},
		playerSpeed: 165,
		hearts: 3,
		collectibleLabel: null,
		collectibleIcon: "daisy",
		completeOn: "collect-all",
		exit: null,
		flowers: [
			{
				kind: "daisy",
				x: 430,
				y: 430
			},
			{
				kind: "tulip",
				x: 980,
				y: 410
			},
			{
				kind: "rose",
				x: 390,
				y: 820
			},
			{
				kind: "sunflower",
				x: 1010,
				y: 790
			},
			{
				kind: "daisy",
				x: 700,
				y: 500
			},
			{
				kind: "tulip",
				x: 560,
				y: 680
			},
			{
				kind: "rose",
				x: 860,
				y: 660
			},
			{
				kind: "sunflower",
				x: 710,
				y: 900
			}
		],
		hazards: [
			{
				kind: "beetle",
				x: 700,
				y: 560,
				speed: 58,
				patrol: [
					{
						x: 700,
						y: 540
					},
					{
						x: 900,
						y: 640
					},
					{
						x: 700,
						y: 780
					},
					{
						x: 500,
						y: 640
					}
				]
			},
			{
				kind: "beetle",
				x: 280,
				y: 520,
				speed: 50,
				patrol: [{
					x: 260,
					y: 480
				}, {
					x: 260,
					y: 860
				}]
			},
			{
				kind: "beetle",
				x: 1140,
				y: 500,
				speed: 54,
				patrol: [{
					x: 1140,
					y: 440
				}, {
					x: 1140,
					y: 820
				}]
			}
		],
		obstacles: [
			{
				kind: "tree",
				x: 130,
				y: 180,
				height: 180,
				collides: true
			},
			{
				kind: "tree",
				x: 1270,
				y: 170,
				height: 190,
				collides: true
			},
			{
				kind: "tree",
				x: 110,
				y: 1280,
				height: 160,
				collides: true
			},
			{
				kind: "tree",
				x: 1300,
				y: 1285,
				height: 170,
				collides: true
			},
			{
				kind: "bush",
				x: 340,
				y: 640,
				height: 72,
				collides: true
			},
			{
				kind: "bush",
				x: 1100,
				y: 980,
				height: 70,
				collides: true
			},
			{
				kind: "rock",
				x: 1110,
				y: 540,
				height: 70,
				collides: true
			},
			{
				kind: "rock",
				x: 300,
				y: 1e3,
				height: 68,
				collides: true
			},
			{
				kind: "stump",
				x: 560,
				y: 600,
				height: 62,
				collides: true
			},
			{
				kind: "pot",
				x: 860,
				y: 590,
				height: 56,
				collides: true
			}
		],
		walls: [],
		completion: {
			winKicker: "Garden gathered",
			winTitle: "Level 1 complete",
			winBody: "Monnie picked every bloom — {needed} flowers of the meadow.",
			loseKicker: "Oh beetles",
			loseTitle: "Out of hearts",
			loseBody: "Monnie found {collected} of {needed} flowers. Try a wider path around the beetles."
		}
	},
	{
		id: "level-2",
		number: 2,
		name: "Tulip Trail",
		objectiveText: "Collect 5 tulips, then reach the garden gate.",
		collectibleLabel: "Tulips",
		collectibleIcon: "tulip",
		environment: {
			mapKey: "map-level-2",
			mapUrl: "/game/maps/level2-base.jpg",
			width: 1152,
			height: 1728,
			boundsInset: 42
		},
		playerSpawn: {
			x: 576,
			y: 1580
		},
		playerSpeed: 165,
		hearts: 3,
		completeOn: "reach-exit",
		exit: {
			x: 576,
			y: 210,
			unlockAt: "all-flowers",
			lockedHint: "Collect all 5 tulips first!",
			unlockedHint: "The garden gate has opened!",
			unlockedObjective: "Reach the garden gate."
		},
		flowers: [
			{
				kind: "tulip",
				x: 250,
				y: 1480
			},
			{
				kind: "tulip",
				x: 980,
				y: 1360
			},
			{
				kind: "tulip",
				x: 220,
				y: 980
			},
			{
				kind: "tulip",
				x: 980,
				y: 760
			},
			{
				kind: "tulip",
				x: 400,
				y: 430
			}
		],
		hazards: [{
			kind: "beetle",
			x: 560,
			y: 1080,
			speed: 46,
			patrol: [{
				x: 400,
				y: 1080
			}, {
				x: 740,
				y: 1080
			}]
		}, {
			kind: "beetle",
			x: 620,
			y: 560,
			speed: 42,
			patrol: [{
				x: 620,
				y: 460
			}, {
				x: 620,
				y: 700
			}]
		}],
		obstacles: [
			{
				kind: "tree",
				x: 70,
				y: 170,
				height: 176,
				collides: true
			},
			{
				kind: "tree",
				x: 1080,
				y: 165,
				height: 182,
				collides: true
			},
			{
				kind: "tree",
				x: 80,
				y: 1640,
				height: 158,
				collides: true
			},
			{
				kind: "tree",
				x: 1085,
				y: 1650,
				height: 164,
				collides: true
			},
			{
				kind: "tree",
				x: 150,
				y: 400,
				height: 160,
				collides: true
			},
			{
				kind: "tree",
				x: 1010,
				y: 390,
				height: 168,
				collides: true
			},
			{
				kind: "tree",
				x: 200,
				y: 720,
				height: 150,
				collides: true
			},
			{
				kind: "tree",
				x: 990,
				y: 1120,
				height: 154,
				collides: true
			},
			{
				kind: "tree",
				x: 360,
				y: 1260,
				height: 142,
				collides: true
			},
			{
				kind: "tree",
				x: 860,
				y: 520,
				height: 148,
				collides: true
			},
			{
				kind: "bush",
				x: 400,
				y: 1120,
				height: 70,
				collides: true
			},
			{
				kind: "bush",
				x: 780,
				y: 900,
				height: 68,
				collides: true
			},
			{
				kind: "bush",
				x: 300,
				y: 620,
				height: 72,
				collides: true
			},
			{
				kind: "bush",
				x: 840,
				y: 1460,
				height: 70,
				collides: true
			},
			{
				kind: "rock",
				x: 180,
				y: 1320,
				height: 64,
				collides: true
			},
			{
				kind: "rock",
				x: 1e3,
				y: 640,
				height: 66,
				collides: true
			},
			{
				kind: "rock",
				x: 700,
				y: 1300,
				height: 60,
				collides: true
			},
			{
				kind: "stump",
				x: 470,
				y: 860,
				height: 58,
				collides: true
			},
			{
				kind: "pot",
				x: 500,
				y: 300,
				height: 52,
				collides: true
			},
			{
				kind: "pot",
				x: 650,
				y: 318,
				height: 54,
				collides: true
			}
		],
		walls: [{
			x: 0,
			y: 0,
			w: 500,
			h: 96
		}, {
			x: 652,
			y: 0,
			w: 500,
			h: 96
		}],
		completion: {
			winKicker: "Trail complete",
			winTitle: "Tulip Trail complete",
			winBody: "Monnie gathered every tulip and slipped through the garden gate.",
			loseKicker: "Oh beetles",
			loseTitle: "Out of hearts",
			loseBody: "Monnie found {collected} of {needed} tulips. Give the beetles a wider berth on the trail."
		}
	},
	{
		id: "level-3",
		number: 3,
		name: "Sunflower Crossing",
		objectiveText: "Collect 6 sunflowers, then reach the garden gate.",
		collectibleLabel: "Sunflowers",
		collectibleIcon: "sunflower",
		environment: {
			mapKey: "map-level-3",
			mapUrl: "/game/maps/level3-base.jpg",
			width: 1008,
			height: 1792,
			boundsInset: 40
		},
		playerSpawn: {
			x: 504,
			y: 1680
		},
		playerSpeed: 165,
		hearts: 3,
		completeOn: "reach-exit",
		exit: {
			x: 504,
			y: 130,
			unlockAt: "all-flowers",
			lockedHint: "Collect all 6 sunflowers first!",
			unlockedHint: "The riverside path has opened!",
			unlockedObjective: "Reach the garden gate."
		},
		flowers: [
			{
				kind: "sunflower",
				x: 230,
				y: 1560
			},
			{
				kind: "sunflower",
				x: 800,
				y: 1500
			},
			{
				kind: "sunflower",
				x: 504,
				y: 900
			},
			{
				kind: "sunflower",
				x: 230,
				y: 300
			},
			{
				kind: "sunflower",
				x: 790,
				y: 300
			},
			{
				kind: "sunflower",
				x: 330,
				y: 190
			}
		],
		hazards: [{
			kind: "beetle",
			x: 420,
			y: 1520,
			speed: 44,
			patrol: [{
				x: 300,
				y: 1520
			}, {
				x: 680,
				y: 1520
			}]
		}, {
			kind: "beetle",
			x: 300,
			y: 1388,
			speed: 42,
			patrol: [{
				x: 180,
				y: 1388
			}, {
				x: 380,
				y: 1388
			}]
		}],
		obstacles: [
			{
				kind: "tree",
				x: 70,
				y: 120,
				height: 168,
				collides: true
			},
			{
				kind: "tree",
				x: 940,
				y: 120,
				height: 172,
				collides: true
			},
			{
				kind: "tree",
				x: 70,
				y: 1710,
				height: 156,
				collides: true
			},
			{
				kind: "tree",
				x: 940,
				y: 1710,
				height: 160,
				collides: true
			},
			{
				kind: "tree",
				x: 90,
				y: 720,
				height: 150,
				collides: true
			},
			{
				kind: "tree",
				x: 930,
				y: 720,
				height: 154,
				collides: true
			},
			{
				kind: "tree",
				x: 80,
				y: 1080,
				height: 148,
				collides: true
			},
			{
				kind: "tree",
				x: 930,
				y: 1080,
				height: 150,
				collides: true
			},
			{
				kind: "bush",
				x: 200,
				y: 1080,
				height: 68,
				collides: true
			},
			{
				kind: "bush",
				x: 800,
				y: 1080,
				height: 68,
				collides: true
			},
			{
				kind: "bush",
				x: 180,
				y: 720,
				height: 70,
				collides: true
			},
			{
				kind: "bush",
				x: 840,
				y: 1600,
				height: 66,
				collides: true
			},
			{
				kind: "rock",
				x: 160,
				y: 980,
				height: 62,
				collides: true
			},
			{
				kind: "rock",
				x: 860,
				y: 980,
				height: 64,
				collides: true
			},
			{
				kind: "rock",
				x: 180,
				y: 1620,
				height: 60,
				collides: true
			},
			{
				kind: "stump",
				x: 620,
				y: 780,
				height: 56,
				collides: true
			},
			{
				kind: "pot",
				x: 440,
				y: 210,
				height: 50,
				collides: true
			},
			{
				kind: "pot",
				x: 570,
				y: 210,
				height: 52,
				collides: true
			}
		],
		walls: [{
			x: 0,
			y: 0,
			w: 430,
			h: 80
		}, {
			x: 578,
			y: 0,
			w: 430,
			h: 80
		}],
		water: [
			{
				x: 0,
				y: 1160,
				w: 380,
				h: 170
			},
			{
				x: 628,
				y: 1160,
				w: 380,
				h: 170
			},
			{
				x: 0,
				y: 400,
				w: 190,
				h: 160
			},
			{
				x: 430,
				y: 400,
				w: 160,
				h: 160
			},
			{
				x: 830,
				y: 400,
				w: 178,
				h: 160
			}
		],
		bridges: [
			{
				x: 504,
				y: 1244,
				displayWidth: 210,
				displayHeight: 168
			},
			{
				x: 310,
				y: 478,
				displayWidth: 200,
				displayHeight: 160
			},
			{
				x: 710,
				y: 478,
				displayWidth: 200,
				displayHeight: 160
			}
		],
		completion: {
			winKicker: "Crossing complete",
			winTitle: "Sunflower Crossing complete",
			winBody: "Monnie hopped the streams, gathered every sunflower, and reached the riverside gate.",
			loseKicker: "Oh beetles",
			loseTitle: "Out of hearts",
			loseBody: "Monnie found {collected} of {needed} sunflowers. Use the bridges — the water isn't for swimming."
		}
	},
	{
		id: "level-4",
		number: 4,
		name: "Twin Bloom Garden",
		objectiveText: "Collect 3 roses and 3 bluebells, then reach the gate.",
		collectibleLabel: null,
		collectibleIcon: "rose",
		environment: {
			mapKey: "map-level-4",
			mapUrl: "/game/maps/level4-base.jpg",
			width: 1152,
			height: 1728,
			boundsInset: 42
		},
		playerSpawn: {
			x: 576,
			y: 1580
		},
		playerSpeed: 165,
		hearts: 3,
		completeOn: "reach-exit",
		objectives: [{
			type: "collect",
			collectible: "rose",
			required: 3,
			label: "Roses"
		}, {
			type: "collect",
			collectible: "bluebell",
			required: 3,
			label: "Bluebells"
		}],
		exit: {
			x: 576,
			y: 180,
			unlockAt: "all-flowers",
			lockedHint: "Collect all roses and bluebells first!",
			unlockedHint: "The Twin Bloom Gate has opened!",
			unlockedObjective: "Reach the garden gate."
		},
		flowers: [
			{
				kind: "rose",
				x: 240,
				y: 1320
			},
			{
				kind: "rose",
				x: 280,
				y: 920
			},
			{
				kind: "rose",
				x: 230,
				y: 500
			},
			{
				kind: "bluebell",
				x: 920,
				y: 1320
			},
			{
				kind: "bluebell",
				x: 870,
				y: 900
			},
			{
				kind: "bluebell",
				x: 930,
				y: 500
			}
		],
		hazards: [
			{
				kind: "beetle",
				x: 280,
				y: 1100,
				speed: 44,
				patrol: [{
					x: 200,
					y: 1100
				}, {
					x: 400,
					y: 1100
				}]
			},
			{
				kind: "beetle",
				x: 880,
				y: 1100,
				speed: 44,
				patrol: [{
					x: 780,
					y: 1100
				}, {
					x: 980,
					y: 1100
				}]
			},
			{
				kind: "beetle",
				x: 576,
				y: 760,
				speed: 42,
				patrol: [{
					x: 500,
					y: 760
				}, {
					x: 660,
					y: 760
				}]
			}
		],
		obstacles: [
			{
				kind: "tree",
				x: 80,
				y: 140,
				height: 170,
				collides: true
			},
			{
				kind: "tree",
				x: 1070,
				y: 140,
				height: 174,
				collides: true
			},
			{
				kind: "tree",
				x: 80,
				y: 1660,
				height: 156,
				collides: true
			},
			{
				kind: "tree",
				x: 1070,
				y: 1660,
				height: 160,
				collides: true
			},
			{
				kind: "tree",
				x: 90,
				y: 720,
				height: 148,
				collides: true
			},
			{
				kind: "tree",
				x: 1060,
				y: 720,
				height: 150,
				collides: true
			},
			{
				kind: "bush",
				x: 180,
				y: 1080,
				height: 70,
				collides: true
			},
			{
				kind: "bush",
				x: 360,
				y: 640,
				height: 68,
				collides: true
			},
			{
				kind: "bush",
				x: 200,
				y: 1480,
				height: 66,
				collides: true
			},
			{
				kind: "rock",
				x: 960,
				y: 1080,
				height: 64,
				collides: true
			},
			{
				kind: "rock",
				x: 800,
				y: 640,
				height: 62,
				collides: true
			},
			{
				kind: "rock",
				x: 980,
				y: 1480,
				height: 60,
				collides: true
			},
			{
				kind: "stump",
				x: 500,
				y: 640,
				height: 56,
				collides: true
			},
			{
				kind: "pot",
				x: 500,
				y: 280,
				height: 50,
				collides: true
			},
			{
				kind: "pot",
				x: 650,
				y: 280,
				height: 52,
				collides: true
			}
		],
		walls: [{
			x: 0,
			y: 0,
			w: 500,
			h: 88
		}, {
			x: 652,
			y: 0,
			w: 500,
			h: 88
		}],
		completion: {
			winKicker: "Twin blooms",
			winTitle: "Twin Bloom Garden complete",
			winBody: "Monnie gathered every rose and bluebell, then slipped through the twin gate.",
			loseKicker: "Oh beetles",
			loseTitle: "Out of hearts",
			loseBody: "Monnie found {collected} of {needed} blooms. Visit both gardens — red and blue."
		}
	},
	{
		id: "level-5",
		number: 5,
		name: "Rosewood Maze",
		objectiveText: "Collect 5 roses, then reach the garden gate.",
		collectibleLabel: "Roses",
		collectibleIcon: "rose",
		environment: {
			mapKey: "map-level-5",
			mapUrl: "/game/maps/level5-base.jpg",
			width: 1152,
			height: 1728,
			boundsInset: 40
		},
		playerSpawn: {
			x: 576,
			y: 1580
		},
		playerSpeed: 165,
		hearts: 3,
		completeOn: "reach-exit",
		objectives: [{
			type: "collect",
			collectible: "rose",
			required: 5,
			label: "Roses"
		}],
		exit: {
			x: 576,
			y: 150,
			unlockAt: "all-flowers",
			lockedHint: "Find all 5 roses first!",
			unlockedHint: "The Rosewood Gate has opened!",
			unlockedObjective: "Reach the garden gate."
		},
		flowers: [
			{
				kind: "rose",
				x: 576,
				y: 1460
			},
			{
				kind: "rose",
				x: 250,
				y: 980
			},
			{
				kind: "rose",
				x: 576,
				y: 720
			},
			{
				kind: "rose",
				x: 90,
				y: 680
			},
			{
				kind: "rose",
				x: 1050,
				y: 200
			}
		],
		hazards: [
			{
				kind: "beetle",
				x: 576,
				y: 980,
				speed: 42,
				patrol: [{
					x: 420,
					y: 980
				}, {
					x: 730,
					y: 980
				}]
			},
			{
				kind: "beetle",
				x: 250,
				y: 800,
				speed: 40,
				patrol: [{
					x: 190,
					y: 800
				}, {
					x: 320,
					y: 800
				}]
			},
			{
				kind: "beetle",
				x: 576,
				y: 360,
				speed: 40,
				patrol: [{
					x: 500,
					y: 360
				}, {
					x: 650,
					y: 360
				}]
			}
		],
		obstacles: [
			{
				kind: "arch",
				x: 576,
				y: 1320,
				height: 150,
				collides: false
			},
			{
				kind: "arch",
				x: 576,
				y: 430,
				height: 150,
				collides: false
			},
			{
				kind: "tree",
				x: 80,
				y: 120,
				height: 160,
				collides: true
			},
			{
				kind: "tree",
				x: 1070,
				y: 120,
				height: 164,
				collides: true
			},
			{
				kind: "tree",
				x: 80,
				y: 1660,
				height: 150,
				collides: true
			},
			{
				kind: "tree",
				x: 1070,
				y: 1660,
				height: 154,
				collides: true
			},
			{
				kind: "pot",
				x: 500,
				y: 250,
				height: 50,
				collides: true
			},
			{
				kind: "pot",
				x: 650,
				y: 250,
				height: 52,
				collides: true
			},
			{
				kind: "bush",
				x: 200,
				y: 1480,
				height: 64,
				collides: true
			},
			{
				kind: "rock",
				x: 940,
				y: 1480,
				height: 60,
				collides: true
			}
		],
		walls: [
			{
				x: 0,
				y: 0,
				w: 500,
				h: 90
			},
			{
				x: 652,
				y: 0,
				w: 500,
				h: 90
			},
			{
				x: 0,
				y: 220,
				w: 160,
				h: 80
			},
			{
				x: 340,
				y: 220,
				w: 146,
				h: 80
			},
			{
				x: 666,
				y: 220,
				w: 146,
				h: 80
			},
			{
				x: 992,
				y: 220,
				w: 108,
				h: 80
			},
			{
				x: 1100,
				y: 90,
				w: 52,
				h: 210
			},
			{
				x: 340,
				y: 300,
				w: 146,
				h: 580
			},
			{
				x: 340,
				y: 1060,
				w: 146,
				h: 228
			},
			{
				x: 666,
				y: 300,
				w: 146,
				h: 580
			},
			{
				x: 666,
				y: 1060,
				w: 146,
				h: 228
			},
			{
				x: 0,
				y: 300,
				w: 160,
				h: 300
			},
			{
				x: 0,
				y: 600,
				w: 40,
				h: 160
			},
			{
				x: 0,
				y: 760,
				w: 160,
				h: 528
			},
			{
				x: 992,
				y: 300,
				w: 160,
				h: 988
			},
			{
				x: 0,
				y: 1288,
				w: 160,
				h: 72
			},
			{
				x: 340,
				y: 1288,
				w: 146,
				h: 72
			},
			{
				x: 666,
				y: 1288,
				w: 146,
				h: 72
			},
			{
				x: 992,
				y: 1288,
				w: 160,
				h: 72
			},
			{
				x: 0,
				y: 1360,
				w: 80,
				h: 368
			},
			{
				x: 1072,
				y: 1360,
				w: 80,
				h: 368
			}
		],
		completion: {
			winKicker: "Maze complete",
			winTitle: "Rosewood Maze complete",
			winBody: "Monnie wound through the hedges, gathered every rose, and reached the Rosewood Gate.",
			loseKicker: "Oh beetles",
			loseTitle: "Out of hearts",
			loseBody: "Monnie found {collected} of {needed} roses. The hedges are solid — try another path."
		}
	}
];
function getLevel(id) {
	const found = LEVELS.find((level) => level.id === id);
	if (!found) throw new Error(`Unknown level: ${id}`);
	return found;
}
function getLevelByNumber(number) {
	return LEVELS.find((level) => level.number === number);
}
function getNextLevel(currentId) {
	return getLevelByNumber(getLevel(currentId).number + 1);
}
var snapshot = {
	phase: "boot",
	loadProgress: 0,
	assetsReady: false,
	levelId: "level-1",
	levelNumber: 1,
	levelName: "The Meadow Gate",
	levelSubtitle: "Collect 8 flowers. Watch for beetles.",
	flowersCollected: 0,
	flowersNeeded: 8,
	hearts: 3,
	heartsMax: 3,
	banner: null,
	gateUnlocked: false,
	collectibleLabel: null,
	collectibleIcon: "daisy",
	objectives: []
};
var listeners = /* @__PURE__ */ new Set();
function getGameState() {
	return snapshot;
}
function patchGameState(partial) {
	snapshot = {
		...snapshot,
		...partial
	};
	listeners.forEach((fn) => fn(snapshot));
}
function subscribeGameState(fn) {
	listeners.add(fn);
	fn(snapshot);
	return () => {
		listeners.delete(fn);
	};
}
var ctx = null;
function unlockAudio() {
	if (typeof window === "undefined") return;
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return;
	if (!ctx) ctx = new AC();
	if (ctx.state === "suspended") ctx.resume();
}
function getCtx() {
	unlockAudio();
	return ctx;
}
function tone(freq, duration, type, gain = .07, delay = 0) {
	const audio = getCtx();
	if (!audio) return;
	const start = audio.currentTime + delay;
	const osc = audio.createOscillator();
	const amp = audio.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, start);
	amp.gain.setValueAtTime(gain, start);
	amp.gain.exponentialRampToValueAtTime(.001, start + duration);
	osc.connect(amp);
	amp.connect(audio.destination);
	osc.start(start);
	osc.stop(start + duration + .02);
}
function sfxCollect() {
	tone(523, .09, "triangle", .06, 0);
	tone(659, .1, "triangle", .06, .07);
	tone(784, .14, "triangle", .05, .14);
}
function sfxHurt() {
	tone(180, .16, "square", .05, 0);
	tone(120, .2, "sawtooth", .04, .05);
}
function sfxUnlock() {
	tone(392, .1, "triangle", .05, 0);
	tone(523, .12, "triangle", .06, .08);
	tone(659, .18, "triangle", .05, .18);
}
function sfxWin() {
	tone(523, .12, "triangle", .06, 0);
	tone(659, .12, "triangle", .06, .1);
	tone(784, .12, "triangle", .06, .2);
	tone(1046, .28, "triangle", .05, .32);
}
function sfxLose() {
	tone(330, .18, "sine", .05, 0);
	tone(247, .22, "sine", .05, .14);
	tone(196, .3, "sine", .05, .3);
}
function useGameState() {
	const [state, setState] = (0, import_react.useState)(getGameState);
	(0, import_react.useEffect)(() => subscribeGameState(setState), []);
	return state;
}
var KNOB = 52;
var MAX = 44;
function VirtualJoystick() {
	const baseRef = (0, import_react.useRef)(null);
	const [knob, setKnob] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const pointerId = (0, import_react.useRef)(null);
	const release = (0, import_react.useCallback)(() => {
		pointerId.current = null;
		setKnob({
			x: 0,
			y: 0
		});
		setJoystick(0, 0);
	}, []);
	(0, import_react.useEffect)(() => release, [release]);
	const moveTo = (0, import_react.useCallback)((clientX, clientY) => {
		const el = baseRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		let dx = clientX - cx;
		let dy = clientY - cy;
		const mag = Math.hypot(dx, dy);
		if (mag > MAX) {
			dx = dx / mag * MAX;
			dy = dy / mag * MAX;
		}
		setKnob({
			x: dx,
			y: dy
		});
		setJoystick(dx / MAX, dy / MAX);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: baseRef,
		className: "relative h-32 w-32 rounded-full border-2 border-cream/40 bg-ink/35 shadow-[inset_0_0_24px_rgba(28,22,18,0.35)]",
		style: { touchAction: "none" },
		onPointerDown: (event) => {
			event.preventDefault();
			pointerId.current = event.pointerId;
			event.currentTarget.setPointerCapture(event.pointerId);
			moveTo(event.clientX, event.clientY);
		},
		onPointerMove: (event) => {
			if (pointerId.current !== event.pointerId) return;
			moveTo(event.clientX, event.clientY);
		},
		onPointerUp: release,
		onPointerCancel: release,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute left-1/2 top-1/2 rounded-full bg-cream/90 shadow-md",
			style: {
				width: KNOB,
				height: KNOB,
				transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`
			}
		})
	});
}
function HudOverlay({ onPause }) {
	const { hearts, heartsMax, levelName, levelSubtitle, phase, banner, gateUnlocked, objectives } = useGameState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between px-3 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-soil/55 px-3 py-2 backdrop-blur-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-[11px] tracking-[0.18em] text-gold uppercase",
							children: levelName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 max-w-[12rem] text-[11px] leading-tight text-cream/85",
							children: levelSubtitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 flex items-center gap-1",
							children: Array.from({ length: heartsMax }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/game/sprites/heart.png",
								alt: "",
								className: `h-7 w-7 object-contain ${i < hearts ? "opacity-100" : "opacity-25"}`
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 space-y-0.5",
							children: objectives.map((obj) => {
								const done = obj.collected >= obj.required;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `flex items-center gap-2 text-sm font-bold ${done ? "text-gold" : ""}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: `/game/sprites/${obj.icon}.png`,
										alt: "",
										className: "h-6 w-6 object-contain"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										obj.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mr-1 font-display text-[10px] tracking-[0.16em] uppercase",
											children: obj.label
										}) : null,
										obj.collected,
										"/",
										obj.required
									] })]
								}, obj.collectible + obj.label);
							})
						}),
						gateUnlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-[10px] tracking-[0.16em] text-gold uppercase",
							children: "Gate open"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onPause,
					className: "pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-soil/70 text-lg font-bold text-cream backdrop-blur-sm",
					"aria-label": "Pause",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
						className: "h-5 w-5",
						strokeWidth: 2.5
					})
				})]
			}),
			banner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-x-4 top-28 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-full bg-cream px-4 py-2 text-center text-sm font-bold text-ink shadow-[0_4px_0_#3a271c]",
					children: banner
				})
			}),
			phase === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute bottom-6 left-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VirtualJoystick, {})
			})
		]
	});
}
function PauseMenu({ onResume, onRestart, onMenu }) {
	const { levelNumber } = useGameState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 grid place-items-center bg-soil/55 px-6 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-3xl bg-cream px-6 py-7 text-center text-ink shadow-[0_12px_0_#3a271c]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs tracking-[0.22em] text-leaf uppercase",
					children: "Paused"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-3xl font-semibold",
					children: "Take a breath"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onResume,
							className: "w-full rounded-full bg-leaf px-5 py-3 font-bold text-cream shadow-[0_5px_0_#245c3a]",
							children: "Keep wandering"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onRestart,
							className: "w-full rounded-full bg-gold px-5 py-3 font-bold text-ink shadow-[0_5px_0_#b07d1c]",
							children: ["Restart Level ", levelNumber]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onMenu,
							className: "w-full rounded-full bg-blush px-5 py-3 font-bold text-ink",
							children: "Garden gate"
						})
					]
				})
			]
		})
	});
}
function PhaserCanvas({ onReady }) {
	const parentRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!parentRef.current) return;
		let cancelled = false;
		let api = null;
		import("./createGame-_ERI9Vk1.mjs").then(({ createFlowerQuest }) => {
			if (cancelled || !parentRef.current) return;
			api = createFlowerQuest(parentRef.current);
			onReady(api);
		});
		return () => {
			cancelled = true;
			api?.destroy();
		};
	}, [onReady]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: parentRef,
		className: "absolute inset-0 h-full w-full"
	});
}
function fill(template, collected, needed) {
	return template.replaceAll("{collected}", String(collected)).replaceAll("{needed}", String(needed));
}
function ResultCard({ onRestart, onMenu, onContinue }) {
	const { phase, flowersCollected, flowersNeeded, levelId } = useGameState();
	const level = getLevel(levelId);
	const next = getNextLevel(levelId);
	const won = phase === "won";
	const demoDone = won && !next;
	const copy = level.completion;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 grid place-items-center bg-soil/50 px-6 backdrop-blur-[2px]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-3xl bg-cream px-6 py-8 text-center text-ink shadow-[0_12px_0_#3a271c]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs tracking-[0.22em] text-leaf uppercase",
					children: demoDone ? "Flower Quest" : won ? copy.winKicker : copy.loseKicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-3xl font-semibold",
					children: demoDone ? "Lite Demo complete" : won ? copy.winTitle : copy.loseTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-soil/80",
					children: demoDone ? "You helped Monnie make it through all five gardens!" : fill(won ? copy.winBody : copy.loseBody, flowersCollected, flowersNeeded)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3",
					children: [
						won && next && onContinue && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onContinue(next.id),
							className: "w-full rounded-full bg-leaf px-5 py-3 font-bold text-cream shadow-[0_5px_0_#245c3a]",
							children: ["Continue to ", next.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								if (demoDone && onContinue) onContinue("level-1");
								else onRestart();
							},
							className: won && next ? "w-full rounded-full bg-blush px-5 py-3 font-bold text-ink" : "w-full rounded-full bg-petal px-5 py-3 font-bold text-cream shadow-[0_5px_0_#9a3140]",
							children: won ? "Play again" : "Try again"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onMenu,
							className: "w-full rounded-full bg-blush px-5 py-3 font-bold text-ink",
							children: demoDone ? "Title screen" : "Garden gate"
						})
					]
				})
			]
		})
	});
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled (default) -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void signOut(),
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline",
				children: "Sign out"
			})
		]
	});
}
function StartScreen({ onPlay }) {
	const { assetsReady, loadProgress, levelName, levelSubtitle } = useGameState();
	const { isPending } = useCurrentUserState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-20 flex flex-col overflow-hidden text-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/game/title-hero.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-soil/40 via-moss/70 to-soil/90" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-10 flex items-center justify-between px-4 pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs tracking-[0.22em] text-gold uppercase",
					children: "Level 1"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-8",
					children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-pulse rounded-full bg-cream/20" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-full bg-soil/50 px-2 py-1 backdrop-blur-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "rounded-full bg-cream/15 px-3 py-2 text-sm font-bold text-cream backdrop-blur-sm",
						children: "Sign in"
					}) })] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-8 bottom-2 h-8 rounded-full bg-soil/50 blur-md" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/game/sprites/monnie.png",
						alt: "Monnie",
						className: "monnie-bob relative z-10 h-56 w-auto"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 px-6 pb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-sm tracking-[0.28em] text-gold uppercase",
						children: "A garden adventure"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-1 font-display text-5xl font-semibold leading-none text-cream drop-shadow-[0_4px_0_#3a271c]",
						children: [
							"Monnie's",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Flower Quest"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 max-w-[20rem] text-base leading-relaxed text-cream/90",
						children: [
							levelName,
							". ",
							levelSubtitle
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-1 text-sm text-cream/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Walk with the stick, or WASD / arrows." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Pick every flower. Dodge the beetles." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !assetsReady,
						onClick: onPlay,
						className: "mt-7 w-full rounded-full bg-petal px-6 py-4 font-display text-xl font-semibold text-cream shadow-[0_8px_0_#9a3140] transition-transform duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-60",
						children: assetsReady ? "Play as Monnie" : `Sprouting… ${Math.round(loadProgress * 100)}%`
					})
				]
			})
		]
	});
}
function FlowerQuestApp() {
	const apiRef = (0, import_react.useRef)(null);
	const { phase } = useGameState();
	const onReady = (0, import_react.useCallback)((api) => {
		apiRef.current = api;
	}, []);
	(0, import_react.useEffect)(() => {
		const onHide = () => {
			if (document.hidden) apiRef.current?.pause();
		};
		document.addEventListener("visibilitychange", onHide);
		return () => document.removeEventListener("visibilitychange", onHide);
	}, []);
	const play = () => {
		unlockAudio();
		apiRef.current?.startLevel("level-1");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-[100dvh] items-center justify-center bg-soil",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "game-shell relative h-[100dvh] w-full max-w-[430px] overflow-hidden bg-moss",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaserCanvas, { onReady }),
				(phase === "boot" || phase === "menu") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartScreen, { onPlay: play }),
				(phase === "playing" || phase === "paused") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HudOverlay, { onPause: () => apiRef.current?.pause() }),
				phase === "paused" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PauseMenu, {
					onResume: () => apiRef.current?.resume(),
					onRestart: () => {
						unlockAudio();
						apiRef.current?.restart();
					},
					onMenu: () => apiRef.current?.quitToMenu()
				}),
				(phase === "won" || phase === "lost") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCard, {
					onRestart: () => {
						unlockAudio();
						apiRef.current?.restart();
					},
					onMenu: () => apiRef.current?.quitToMenu(),
					onContinue: (levelId) => {
						unlockAudio();
						apiRef.current?.startLevel(levelId);
					}
				})
			]
		})
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowerQuestApp, {});
}
//#endregion
export { sfxUnlock as a, patchGameState as c, actions as d, attachInput as f, updateActions as g, setKeyOverride as h, sfxLose as i, LEVELS as l, setJoystick as m, sfxCollect as n, sfxWin as o, detachInput as p, sfxHurt as r, getGameState as s, routes_exports as t, getLevel as u };
