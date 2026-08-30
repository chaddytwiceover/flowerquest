import { o as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { I as require_jsx_runtime, L as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Snowflake, d as Pause, f as House, i as Trophy, l as RotateCcw, m as ArrowRight, n as VolumeX, o as Sprout, p as Heart, r as Volume2, s as Sparkles, t as Zap, u as Play } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DWslNjp4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MUTE_KEY = "flower-quest-muted";
var ctx = null;
var master = null;
var sfxBus = null;
var musicBus = null;
var muted = false;
var musicPaused = false;
var currentTune = null;
var step = 0;
var nextTime = 0;
var timer = null;
var muteListeners = /* @__PURE__ */ new Set();
var THEMES = {
	title: {
		bpm: 78,
		steps: 16,
		bass: [
			43,
			0,
			0,
			0,
			50,
			0,
			0,
			0,
			47,
			0,
			0,
			0,
			50,
			0,
			0,
			0
		],
		lead: [
			67,
			0,
			71,
			0,
			74,
			0,
			0,
			71,
			72,
			0,
			71,
			0,
			69,
			0,
			67,
			0
		],
		bassType: "sine",
		leadType: "sine"
	},
	meadow: {
		bpm: 90,
		steps: 16,
		bass: [
			43,
			0,
			0,
			47,
			50,
			0,
			0,
			43,
			45,
			0,
			0,
			47,
			50,
			0,
			47,
			0
		],
		lead: [
			67,
			71,
			74,
			71,
			76,
			0,
			74,
			71,
			72,
			74,
			71,
			67,
			69,
			0,
			67,
			0
		],
		spark: [
			0,
			0,
			79,
			0,
			0,
			0,
			83,
			0,
			0,
			79,
			0,
			0,
			0,
			76,
			0,
			0
		],
		bassType: "sine",
		leadType: "triangle"
	},
	trail: {
		bpm: 104,
		steps: 16,
		bass: [
			38,
			0,
			45,
			0,
			38,
			0,
			50,
			0,
			37,
			0,
			45,
			0,
			38,
			0,
			45,
			38
		],
		lead: [
			62,
			66,
			69,
			66,
			74,
			69,
			66,
			62,
			61,
			62,
			66,
			69,
			74,
			0,
			69,
			66
		],
		bassType: "triangle",
		leadType: "triangle"
	},
	crossing: {
		bpm: 76,
		steps: 16,
		bass: [
			48,
			0,
			0,
			0,
			43,
			0,
			0,
			48,
			45,
			0,
			0,
			0,
			43,
			0,
			41,
			0
		],
		lead: [
			64,
			0,
			0,
			67,
			0,
			0,
			71,
			0,
			0,
			67,
			0,
			64,
			0,
			0,
			72,
			0
		],
		spark: [
			0,
			0,
			84,
			0,
			0,
			83,
			0,
			0,
			79,
			0,
			0,
			76,
			0,
			84,
			0,
			0
		],
		bassType: "sine",
		leadType: "sine"
	},
	twin: {
		bpm: 96,
		steps: 16,
		bass: [
			45,
			0,
			52,
			0,
			45,
			0,
			48,
			0,
			41,
			0,
			48,
			0,
			45,
			0,
			52,
			0
		],
		lead: [
			64,
			67,
			71,
			67,
			64,
			0,
			72,
			71,
			69,
			72,
			76,
			72,
			69,
			0,
			71,
			67
		],
		harmony: [
			67,
			71,
			74,
			71,
			67,
			0,
			76,
			74,
			72,
			76,
			79,
			76,
			72,
			0,
			74,
			71
		],
		bassType: "sine",
		leadType: "triangle"
	},
	maze: {
		bpm: 72,
		steps: 16,
		bass: [
			40,
			0,
			0,
			47,
			40,
			0,
			43,
			0,
			36,
			0,
			0,
			43,
			40,
			0,
			47,
			0
		],
		lead: [
			64,
			0,
			67,
			0,
			63,
			0,
			64,
			0,
			59,
			0,
			62,
			0,
			64,
			0,
			0,
			59
		],
		spark: [
			0,
			0,
			0,
			76,
			0,
			0,
			75,
			0,
			0,
			0,
			71,
			0,
			0,
			0,
			72,
			0
		],
		bassType: "sine",
		leadType: "triangle"
	},
	hollow: {
		bpm: 108,
		steps: 16,
		bass: [
			48,
			48,
			0,
			52,
			55,
			0,
			48,
			52,
			45,
			45,
			0,
			48,
			52,
			0,
			45,
			48
		],
		lead: [
			72,
			76,
			79,
			76,
			81,
			79,
			76,
			72,
			69,
			72,
			76,
			79,
			81,
			84,
			79,
			76
		],
		spark: [
			0,
			84,
			0,
			88,
			0,
			84,
			0,
			0,
			0,
			81,
			0,
			84,
			0,
			88,
			0,
			84
		],
		bassType: "triangle",
		leadType: "triangle"
	},
	queen: {
		bpm: 116,
		steps: 16,
		bass: [
			36,
			0,
			43,
			0,
			48,
			0,
			43,
			36,
			41,
			0,
			48,
			0,
			53,
			0,
			48,
			41
		],
		lead: [
			60,
			67,
			72,
			67,
			75,
			72,
			67,
			60,
			65,
			72,
			77,
			72,
			80,
			77,
			72,
			65
		],
		harmony: [
			67,
			72,
			75,
			72,
			79,
			75,
			72,
			67,
			72,
			77,
			80,
			77,
			84,
			80,
			77,
			72
		],
		spark: [
			84,
			0,
			87,
			0,
			91,
			0,
			87,
			0,
			89,
			0,
			92,
			0,
			96,
			0,
			92,
			0
		],
		bassType: "sawtooth",
		leadType: "square"
	}
};
function midi(n) {
	return 440 * 2 ** ((n - 69) / 12);
}
function readMute() {
	try {
		return localStorage.getItem(MUTE_KEY) === "1";
	} catch {
		return false;
	}
}
function writeMute(value) {
	try {
		localStorage.setItem(MUTE_KEY, value ? "1" : "0");
	} catch {}
}
function isMuted() {
	return muted;
}
function subscribeMute(fn) {
	muteListeners.add(fn);
	fn(muted);
	return () => {
		muteListeners.delete(fn);
	};
}
function notifyMute() {
	muteListeners.forEach((fn) => fn(muted));
}
function applyGains(now = ctx?.currentTime ?? 0) {
	if (!master || !musicBus || !ctx) return;
	const masterTarget = muted ? 1e-4 : 1;
	const musicTarget = muted ? 1e-4 : musicPaused ? .04 : .22;
	master.gain.setTargetAtTime(masterTarget, now, .04);
	musicBus.gain.setTargetAtTime(musicTarget, now, .06);
}
function unlockAudio() {
	if (typeof window === "undefined") return;
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return;
	if (!ctx) {
		ctx = new AC({ latencyHint: "interactive" });
		master = ctx.createGain();
		sfxBus = ctx.createGain();
		musicBus = ctx.createGain();
		sfxBus.gain.value = .9;
		musicBus.gain.value = .22;
		master.gain.value = muted ? 1e-4 : 1;
		sfxBus.connect(master);
		musicBus.connect(master);
		master.connect(ctx.destination);
		muted = readMute();
		applyGains(ctx.currentTime);
		document.addEventListener("visibilitychange", () => {
			if (!document.hidden) ctx?.resume();
		});
	}
	if (ctx.state === "suspended") ctx.resume();
}
function getCtx() {
	unlockAudio();
	return ctx;
}
function tone(freq, duration, type, gain = .07, delay = 0) {
	const audio = getCtx();
	if (!audio || !sfxBus || muted) return;
	const start = audio.currentTime + delay;
	const osc = audio.createOscillator();
	const amp = audio.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, start);
	amp.gain.setValueAtTime(gain, start);
	amp.gain.exponentialRampToValueAtTime(.001, start + duration);
	osc.connect(amp);
	amp.connect(sfxBus);
	osc.start(start);
	osc.stop(start + duration + .02);
	osc.onended = () => {
		osc.disconnect();
		amp.disconnect();
	};
}
function note(bus, midiNote, when, dur, type, vol) {
	if (!ctx || midiNote <= 0) return;
	const osc = ctx.createOscillator();
	const amp = ctx.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(midi(midiNote), when);
	amp.gain.setValueAtTime(1e-4, when);
	amp.gain.exponentialRampToValueAtTime(vol, when + .02);
	amp.gain.exponentialRampToValueAtTime(1e-4, when + dur);
	osc.connect(amp);
	amp.connect(bus);
	osc.start(when);
	osc.stop(when + dur + .03);
	osc.onended = () => {
		osc.disconnect();
		amp.disconnect();
	};
}
function scheduleStep(theme, index, when) {
	if (!musicBus || muted) return;
	const eighth = 60 / theme.bpm / 2;
	const i = index % theme.steps;
	if (theme.bass[i]) note(musicBus, theme.bass[i], when, eighth * 1.6, theme.bassType, .045);
	if (theme.lead[i]) note(musicBus, theme.lead[i], when, eighth * 1.15, theme.leadType, .038);
	if (theme.harmony?.[i]) note(musicBus, theme.harmony[i], when, eighth * 1.1, "sine", .022);
	if (theme.spark?.[i]) note(musicBus, theme.spark[i], when, eighth * .7, "sine", .018);
}
function pump() {
	if (!ctx || !currentTune) return;
	const theme = THEMES[currentTune];
	const eighth = 60 / theme.bpm / 2;
	while (nextTime < ctx.currentTime + .16) {
		scheduleStep(theme, step, nextTime);
		nextTime += eighth;
		step = (step + 1) % theme.steps;
	}
	timer = setTimeout(pump, 40);
}
function stopPump() {
	if (timer) {
		clearTimeout(timer);
		timer = null;
	}
}
function startMusic(id) {
	const audio = getCtx();
	if (!audio) return;
	if (currentTune === id && timer) return;
	currentTune = id;
	step = 0;
	nextTime = audio.currentTime + .06;
	musicPaused = false;
	applyGains(audio.currentTime);
	stopPump();
	pump();
}
function stopMusic() {
	currentTune = null;
	stopPump();
}
function setMusicPaused(paused) {
	musicPaused = paused;
	applyGains();
}
function toggleMute() {
	muted = !muted;
	writeMute(muted);
	applyGains();
	notifyMute();
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
function sfxPowerUp(kind) {
	if (kind === "swift") {
		tone(659, .08, "triangle", .06, 0);
		tone(880, .09, "triangle", .07, .06);
		tone(1046, .16, "sine", .08, .12);
	} else if (kind === "frost") {
		tone(987, .12, "sine", .06, 0);
		tone(1318, .2, "sine", .07, .08);
		tone(1760, .25, "triangle", .05, .16);
	} else if (kind === "heart") {
		tone(523, .1, "sine", .06, 0);
		tone(659, .1, "sine", .06, .08);
		tone(784, .12, "sine", .07, .16);
		tone(1046, .22, "sine", .08, .24);
	}
}
function sfxAlert() {
	tone(880, .08, "square", .04, 0);
	tone(1174, .1, "square", .05, .07);
}
function sfxFreeze() {
	tone(320, .12, "sawtooth", .04, 0);
	tone(160, .18, "square", .04, .08);
}
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
	let x = keyOverride ? 0 : joystick.x;
	let y = keyOverride ? 0 : joystick.y;
	if (keyOverride) {
		if (keyOverride.includes("KeyA") || keyOverride.includes("ArrowLeft")) x -= 1;
		if (keyOverride.includes("KeyD") || keyOverride.includes("ArrowRight")) x += 1;
		if (keyOverride.includes("KeyW") || keyOverride.includes("ArrowUp")) y -= 1;
		if (keyOverride.includes("KeyS") || keyOverride.includes("ArrowDown")) y += 1;
	} else {
		if (keys.has("KeyA") || keys.has("ArrowLeft")) x -= 1;
		if (keys.has("KeyD") || keys.has("ArrowRight")) x += 1;
		if (keys.has("KeyW") || keys.has("ArrowUp")) y -= 1;
		if (keys.has("KeyS") || keys.has("ArrowDown")) y += 1;
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
/** Every playable level (1 to 10). */
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
		music: "meadow",
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
		powerBlooms: [{
			kind: "swift",
			x: 700,
			y: 700
		}],
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
		music: "trail",
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
		powerBlooms: [{
			kind: "swift",
			x: 576,
			y: 880
		}],
		hazards: [{
			kind: "beetle",
			x: 560,
			y: 1080,
			speed: 46,
			patrol: [{
				x: 500,
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
		music: "crossing",
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
		powerBlooms: [{
			kind: "frost",
			x: 504,
			y: 1200
		}, {
			kind: "heart",
			x: 790,
			y: 600
		}],
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
		music: "twin",
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
		powerBlooms: [{
			kind: "swift",
			x: 280,
			y: 700
		}, {
			kind: "frost",
			x: 870,
			y: 700
		}],
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
			},
			{
				kind: "bee",
				x: 576,
				y: 450,
				speed: 55,
				chaseSpeed: 180,
				detectRadius: 180,
				leashRadius: 280,
				patrol: [{
					x: 480,
					y: 450
				}, {
					x: 670,
					y: 450
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
		music: "maze",
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
		powerBlooms: [{
			kind: "frost",
			x: 576,
			y: 1150
		}, {
			kind: "heart",
			x: 90,
			y: 450
		}],
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
			},
			{
				kind: "bee",
				x: 900,
				y: 600,
				speed: 55,
				chaseSpeed: 185,
				detectRadius: 180,
				leashRadius: 290,
				patrol: [{
					x: 800,
					y: 600
				}, {
					x: 1e3,
					y: 600
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
	},
	{
		id: "level-6",
		number: 6,
		name: "Honeycomb Hollow",
		objectiveText: "Collect 8 golden blooms. Beware the alert bees!",
		collectibleLabel: "Blooms",
		collectibleIcon: "sunflower",
		environment: {
			mapKey: "map-level-6",
			mapUrl: "/game/maps/level6-base.jpg",
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
		music: "hollow",
		completeOn: "reach-exit",
		exit: {
			x: 704,
			y: 160,
			unlockAt: "all-flowers",
			lockedHint: "Gather all 8 golden blooms first!",
			unlockedHint: "The Honeycomb Gate has opened!",
			unlockedObjective: "Reach the Honeycomb Gate."
		},
		flowers: [
			{
				kind: "sunflower",
				x: 380,
				y: 1050
			},
			{
				kind: "sunflower",
				x: 1020,
				y: 1050
			},
			{
				kind: "daisy",
				x: 300,
				y: 720
			},
			{
				kind: "daisy",
				x: 1100,
				y: 720
			},
			{
				kind: "sunflower",
				x: 520,
				y: 550
			},
			{
				kind: "sunflower",
				x: 880,
				y: 550
			},
			{
				kind: "daisy",
				x: 704,
				y: 380
			},
			{
				kind: "sunflower",
				x: 704,
				y: 760
			}
		],
		powerBlooms: [{
			kind: "swift",
			x: 420,
			y: 880
		}, {
			kind: "swift",
			x: 980,
			y: 880
		}],
		hazards: [
			{
				kind: "beetle",
				x: 450,
				y: 1100,
				speed: 46,
				patrol: [{
					x: 300,
					y: 1100
				}, {
					x: 600,
					y: 1100
				}]
			},
			{
				kind: "beetle",
				x: 950,
				y: 1100,
				speed: 46,
				patrol: [{
					x: 800,
					y: 1100
				}, {
					x: 1100,
					y: 1100
				}]
			},
			{
				kind: "bee",
				x: 450,
				y: 600,
				speed: 52,
				chaseSpeed: 180,
				detectRadius: 180,
				leashRadius: 300,
				patrol: [{
					x: 350,
					y: 600
				}, {
					x: 550,
					y: 600
				}]
			},
			{
				kind: "bee",
				x: 950,
				y: 600,
				speed: 52,
				chaseSpeed: 180,
				detectRadius: 180,
				leashRadius: 300,
				patrol: [{
					x: 850,
					y: 600
				}, {
					x: 1050,
					y: 600
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
				kind: "prop-beehive",
				x: 260,
				y: 380,
				height: 80,
				collides: true
			},
			{
				kind: "prop-beehive",
				x: 1140,
				y: 380,
				height: 80,
				collides: true
			},
			{
				kind: "bush",
				x: 540,
				y: 920,
				height: 72,
				collides: true
			},
			{
				kind: "bush",
				x: 860,
				y: 920,
				height: 72,
				collides: true
			},
			{
				kind: "stump",
				x: 704,
				y: 600,
				height: 60,
				collides: true
			}
		],
		walls: [],
		completion: {
			winKicker: "Hollow harvested",
			winTitle: "Level 6 Complete",
			winBody: "Monnie outmaneuvered the buzzing bees and gathered all 8 blooms.",
			loseKicker: "Stung!",
			loseTitle: "Out of hearts",
			loseBody: "Monnie collected {collected} of {needed} blooms. Watch for the bees' warning '!' alert!"
		}
	},
	{
		id: "level-7",
		number: 7,
		name: "Briar Patch",
		objectiveText: "Collect 10 flowers scattered through the briars.",
		collectibleLabel: "Flowers",
		collectibleIcon: "tulip",
		environment: {
			mapKey: "map-level-7",
			mapUrl: "/game/maps/level7-base.jpg",
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
		music: "trail",
		completeOn: "reach-exit",
		exit: {
			x: 576,
			y: 190,
			unlockAt: "all-flowers",
			lockedHint: "Collect all 10 flowers first!",
			unlockedHint: "The Briar Gate has cleared!",
			unlockedObjective: "Reach the Briar Gate."
		},
		flowers: [
			{
				kind: "tulip",
				x: 280,
				y: 1450
			},
			{
				kind: "rose",
				x: 870,
				y: 1450
			},
			{
				kind: "daisy",
				x: 320,
				y: 1150
			},
			{
				kind: "bluebell",
				x: 830,
				y: 1150
			},
			{
				kind: "tulip",
				x: 576,
				y: 950
			},
			{
				kind: "rose",
				x: 260,
				y: 750
			},
			{
				kind: "sunflower",
				x: 890,
				y: 750
			},
			{
				kind: "daisy",
				x: 420,
				y: 500
			},
			{
				kind: "bluebell",
				x: 730,
				y: 500
			},
			{
				kind: "rose",
				x: 576,
				y: 340
			}
		],
		powerBlooms: [{
			kind: "frost",
			x: 576,
			y: 1300
		}, {
			kind: "swift",
			x: 576,
			y: 680
		}],
		hazards: [
			{
				kind: "beetle",
				x: 350,
				y: 1350,
				speed: 48,
				patrol: [{
					x: 250,
					y: 1350
				}, {
					x: 500,
					y: 1350
				}]
			},
			{
				kind: "beetle",
				x: 800,
				y: 1350,
				speed: 48,
				patrol: [{
					x: 650,
					y: 1350
				}, {
					x: 920,
					y: 1350
				}]
			},
			{
				kind: "bee",
				x: 320,
				y: 950,
				speed: 54,
				chaseSpeed: 185,
				detectRadius: 180,
				leashRadius: 290,
				patrol: [{
					x: 240,
					y: 950
				}, {
					x: 440,
					y: 950
				}]
			},
			{
				kind: "bee",
				x: 830,
				y: 950,
				speed: 54,
				chaseSpeed: 185,
				detectRadius: 180,
				leashRadius: 290,
				patrol: [{
					x: 720,
					y: 950
				}, {
					x: 930,
					y: 950
				}]
			},
			{
				kind: "bee",
				x: 576,
				y: 420,
				speed: 56,
				chaseSpeed: 190,
				detectRadius: 190,
				leashRadius: 300,
				patrol: [{
					x: 460,
					y: 420
				}, {
					x: 690,
					y: 420
				}]
			}
		],
		obstacles: [
			{
				kind: "tree",
				x: 80,
				y: 160,
				height: 170,
				collides: true
			},
			{
				kind: "tree",
				x: 1070,
				y: 160,
				height: 170,
				collides: true
			},
			{
				kind: "bush",
				x: 450,
				y: 1150,
				height: 72,
				collides: true
			},
			{
				kind: "bush",
				x: 700,
				y: 1150,
				height: 72,
				collides: true
			},
			{
				kind: "rock",
				x: 380,
				y: 750,
				height: 66,
				collides: true
			},
			{
				kind: "rock",
				x: 770,
				y: 750,
				height: 66,
				collides: true
			}
		],
		walls: [],
		completion: {
			winKicker: "Briars cleared",
			winTitle: "Level 7 Complete",
			winBody: "Monnie navigated the thorny gauntlet and found all 10 blossoms.",
			loseKicker: "Tangled!",
			loseTitle: "Out of hearts",
			loseBody: "Monnie gathered {collected} of {needed} flowers. Use Frost Petals to freeze the swarms!"
		}
	},
	{
		id: "level-8",
		number: 8,
		name: "The Wasp Garden",
		objectiveText: "Collect 8 guarded blooms. Don't step into wasp territory!",
		collectibleLabel: "Blooms",
		collectibleIcon: "bluebell",
		environment: {
			mapKey: "map-level-8",
			mapUrl: "/game/maps/level8-base.jpg",
			width: 1152,
			height: 1728,
			boundsInset: 40
		},
		playerSpawn: {
			x: 576,
			y: 1600
		},
		playerSpeed: 165,
		hearts: 3,
		music: "crossing",
		completeOn: "reach-exit",
		exit: {
			x: 576,
			y: 160,
			unlockAt: "all-flowers",
			lockedHint: "Collect all 8 guarded blooms first!",
			unlockedHint: "The Sanctuary Gate has opened!",
			unlockedObjective: "Reach the Sanctuary Gate."
		},
		flowers: [
			{
				kind: "bluebell",
				x: 280,
				y: 1460
			},
			{
				kind: "bluebell",
				x: 870,
				y: 1460
			},
			{
				kind: "bluebell",
				x: 300,
				y: 1050
			},
			{
				kind: "bluebell",
				x: 850,
				y: 1050
			},
			{
				kind: "bluebell",
				x: 576,
				y: 880
			},
			{
				kind: "bluebell",
				x: 280,
				y: 480
			},
			{
				kind: "bluebell",
				x: 870,
				y: 480
			},
			{
				kind: "bluebell",
				x: 576,
				y: 300
			}
		],
		powerBlooms: [{
			kind: "frost",
			x: 576,
			y: 1350
		}, {
			kind: "heart",
			x: 576,
			y: 650
		}],
		hazards: [
			{
				kind: "bee",
				x: 350,
				y: 1400,
				speed: 50,
				chaseSpeed: 175,
				detectRadius: 170,
				leashRadius: 280,
				patrol: [{
					x: 250,
					y: 1400
				}, {
					x: 450,
					y: 1400
				}]
			},
			{
				kind: "bee",
				x: 800,
				y: 1400,
				speed: 50,
				chaseSpeed: 175,
				detectRadius: 170,
				leashRadius: 280,
				patrol: [{
					x: 700,
					y: 1400
				}, {
					x: 900,
					y: 1400
				}]
			},
			{
				kind: "wasp",
				x: 280,
				y: 1050,
				speed: 40,
				chaseSpeed: 215,
				guardZone: {
					x: 280,
					y: 1050,
					radius: 140
				},
				detectRadius: 150,
				leashRadius: 220
			},
			{
				kind: "wasp",
				x: 870,
				y: 1050,
				speed: 40,
				chaseSpeed: 215,
				guardZone: {
					x: 870,
					y: 1050,
					radius: 140
				},
				detectRadius: 150,
				leashRadius: 220
			}
		],
		obstacles: [
			{
				kind: "prop-wasp-nest",
				x: 280,
				y: 1e3,
				height: 75,
				collides: true
			},
			{
				kind: "prop-wasp-nest",
				x: 870,
				y: 1e3,
				height: 75,
				collides: true
			},
			{
				kind: "tree",
				x: 120,
				y: 180,
				height: 180,
				collides: true
			},
			{
				kind: "tree",
				x: 1030,
				y: 180,
				height: 180,
				collides: true
			},
			{
				kind: "bush",
				x: 300,
				y: 880,
				height: 72,
				collides: true
			},
			{
				kind: "bush",
				x: 850,
				y: 880,
				height: 72,
				collides: true
			}
		],
		walls: [],
		completion: {
			winKicker: "Sanctuary secure",
			winTitle: "Level 8 Complete",
			winBody: "Monnie outsmarted the territorial wasps and gathered every guarded bloom.",
			loseKicker: "Ambushed!",
			loseTitle: "Out of hearts",
			loseBody: "Monnie picked {collected} of {needed} blooms. Avoid lingering inside wasp guard zones!"
		}
	},
	{
		id: "level-9",
		number: 9,
		name: "Nightshade Run",
		objectiveText: "Collect 12 nightshade flowers before reaching the dusk gate.",
		collectibleLabel: "Nightshades",
		collectibleIcon: "bluebell",
		environment: {
			mapKey: "map-level-9",
			mapUrl: "/game/maps/level9-base.jpg",
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
		music: "twin",
		completeOn: "reach-exit",
		exit: {
			x: 576,
			y: 170,
			unlockAt: "all-flowers",
			lockedHint: "Collect all 12 nightshades first!",
			unlockedHint: "The Dusk Gate has opened!",
			unlockedObjective: "Reach the Dusk Gate."
		},
		flowers: [
			{
				kind: "bluebell",
				x: 200,
				y: 1450
			},
			{
				kind: "bluebell",
				x: 950,
				y: 1450
			},
			{
				kind: "bluebell",
				x: 380,
				y: 1250
			},
			{
				kind: "bluebell",
				x: 770,
				y: 1250
			},
			{
				kind: "bluebell",
				x: 220,
				y: 1e3
			},
			{
				kind: "bluebell",
				x: 930,
				y: 1e3
			},
			{
				kind: "bluebell",
				x: 576,
				y: 880
			},
			{
				kind: "bluebell",
				x: 320,
				y: 700
			},
			{
				kind: "bluebell",
				x: 830,
				y: 700
			},
			{
				kind: "bluebell",
				x: 200,
				y: 450
			},
			{
				kind: "bluebell",
				x: 950,
				y: 450
			},
			{
				kind: "bluebell",
				x: 576,
				y: 350
			}
		],
		powerBlooms: [
			{
				kind: "swift",
				x: 576,
				y: 1400
			},
			{
				kind: "frost",
				x: 576,
				y: 1050
			},
			{
				kind: "heart",
				x: 576,
				y: 550
			}
		],
		hazards: [
			{
				kind: "beetle",
				x: 350,
				y: 1350,
				speed: 46,
				patrol: [{
					x: 250,
					y: 1350
				}, {
					x: 450,
					y: 1350
				}]
			},
			{
				kind: "beetle",
				x: 800,
				y: 1350,
				speed: 46,
				patrol: [{
					x: 700,
					y: 1350
				}, {
					x: 900,
					y: 1350
				}]
			},
			{
				kind: "bee",
				x: 350,
				y: 900,
				speed: 55,
				chaseSpeed: 190,
				detectRadius: 180,
				leashRadius: 290,
				patrol: [{
					x: 250,
					y: 900
				}, {
					x: 450,
					y: 900
				}]
			},
			{
				kind: "bee",
				x: 800,
				y: 900,
				speed: 55,
				chaseSpeed: 190,
				detectRadius: 180,
				leashRadius: 290,
				patrol: [{
					x: 700,
					y: 900
				}, {
					x: 900,
					y: 900
				}]
			},
			{
				kind: "bee",
				x: 576,
				y: 720,
				speed: 55,
				chaseSpeed: 190,
				detectRadius: 180,
				leashRadius: 290,
				patrol: [{
					x: 480,
					y: 720
				}, {
					x: 670,
					y: 720
				}]
			},
			{
				kind: "wasp",
				x: 240,
				y: 450,
				speed: 40,
				chaseSpeed: 220,
				guardZone: {
					x: 240,
					y: 450,
					radius: 130
				},
				detectRadius: 150,
				leashRadius: 220
			},
			{
				kind: "wasp",
				x: 910,
				y: 450,
				speed: 40,
				chaseSpeed: 220,
				guardZone: {
					x: 910,
					y: 450,
					radius: 130
				},
				detectRadius: 150,
				leashRadius: 220
			}
		],
		obstacles: [
			{
				kind: "prop-lantern",
				x: 380,
				y: 1200,
				height: 75,
				collides: true
			},
			{
				kind: "prop-lantern",
				x: 770,
				y: 1200,
				height: 75,
				collides: true
			},
			{
				kind: "prop-lantern",
				x: 576,
				y: 650,
				height: 75,
				collides: true
			},
			{
				kind: "tree",
				x: 80,
				y: 150,
				height: 170,
				collides: true
			},
			{
				kind: "tree",
				x: 1070,
				y: 150,
				height: 170,
				collides: true
			},
			{
				kind: "bush",
				x: 380,
				y: 1e3,
				height: 72,
				collides: true
			},
			{
				kind: "bush",
				x: 770,
				y: 1e3,
				height: 72,
				collides: true
			}
		],
		walls: [],
		completion: {
			winKicker: "Dusk mastered",
			winTitle: "Level 9 Complete",
			winBody: "Monnie outpaced the nightfall gauntlet and picked all 12 nightshades.",
			loseKicker: "Fallen at dusk",
			loseTitle: "Out of hearts",
			loseBody: "Monnie found {collected} of {needed} blooms. Combine Swift Seeds and Frost Petals for safe passage."
		}
	},
	{
		id: "level-10",
		number: 10,
		name: "The Queen's Garden",
		objectiveText: "Collect 15 royal blooms and unlock the Grand Royal Gate!",
		collectibleLabel: "Royal Blooms",
		collectibleIcon: "rose",
		environment: {
			mapKey: "map-level-10",
			mapUrl: "/game/maps/level10-base.jpg",
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
		music: "queen",
		completeOn: "reach-exit",
		objectives: [{
			type: "collect",
			collectible: "any",
			required: 15,
			label: "Royal Blooms"
		}],
		exit: {
			x: 576,
			y: 150,
			unlockAt: "all-flowers",
			lockedHint: "Gather all 15 royal blooms to unlock the Royal Gate!",
			unlockedHint: "The Grand Royal Gate has opened! You are the Master Botanist!",
			unlockedObjective: "Step through the Grand Royal Gate!"
		},
		flowers: [
			{
				kind: "rose",
				x: 420,
				y: 1480
			},
			{
				kind: "rose",
				x: 730,
				y: 1480
			},
			{
				kind: "tulip",
				x: 180,
				y: 1300
			},
			{
				kind: "tulip",
				x: 970,
				y: 1300
			},
			{
				kind: "sunflower",
				x: 300,
				y: 1050
			},
			{
				kind: "sunflower",
				x: 850,
				y: 1050
			},
			{
				kind: "rose",
				x: 576,
				y: 920
			},
			{
				kind: "bluebell",
				x: 100,
				y: 750
			},
			{
				kind: "bluebell",
				x: 1050,
				y: 750
			},
			{
				kind: "rose",
				x: 400,
				y: 680
			},
			{
				kind: "rose",
				x: 750,
				y: 680
			},
			{
				kind: "tulip",
				x: 250,
				y: 450
			},
			{
				kind: "tulip",
				x: 900,
				y: 450
			},
			{
				kind: "daisy",
				x: 420,
				y: 300
			},
			{
				kind: "daisy",
				x: 730,
				y: 300
			}
		],
		powerBlooms: [
			{
				kind: "swift",
				x: 576,
				y: 1350
			},
			{
				kind: "frost",
				x: 180,
				y: 900
			},
			{
				kind: "frost",
				x: 970,
				y: 900
			},
			{
				kind: "heart",
				x: 576,
				y: 580
			}
		],
		hazards: [
			{
				kind: "beetle",
				x: 350,
				y: 1400,
				speed: 46,
				patrol: [{
					x: 200,
					y: 1400
				}, {
					x: 500,
					y: 1400
				}]
			},
			{
				kind: "beetle",
				x: 800,
				y: 1400,
				speed: 46,
				patrol: [{
					x: 650,
					y: 1400
				}, {
					x: 950,
					y: 1400
				}]
			},
			{
				kind: "beetle",
				x: 576,
				y: 800,
				speed: 46,
				patrol: [{
					x: 450,
					y: 800
				}, {
					x: 700,
					y: 800
				}]
			},
			{
				kind: "bee",
				x: 250,
				y: 1100,
				speed: 56,
				chaseSpeed: 195,
				detectRadius: 185,
				leashRadius: 300,
				patrol: [{
					x: 150,
					y: 1100
				}, {
					x: 350,
					y: 1100
				}]
			},
			{
				kind: "bee",
				x: 900,
				y: 1100,
				speed: 56,
				chaseSpeed: 195,
				detectRadius: 185,
				leashRadius: 300,
				patrol: [{
					x: 800,
					y: 1100
				}, {
					x: 1e3,
					y: 1100
				}]
			},
			{
				kind: "bee",
				x: 576,
				y: 450,
				speed: 58,
				chaseSpeed: 200,
				detectRadius: 190,
				leashRadius: 300,
				patrol: [{
					x: 450,
					y: 450
				}, {
					x: 700,
					y: 450
				}]
			},
			{
				kind: "wasp",
				x: 120,
				y: 650,
				speed: 40,
				chaseSpeed: 225,
				guardZone: {
					x: 120,
					y: 650,
					radius: 130
				},
				detectRadius: 150,
				leashRadius: 230
			},
			{
				kind: "wasp",
				x: 1030,
				y: 650,
				speed: 40,
				chaseSpeed: 225,
				guardZone: {
					x: 1030,
					y: 650,
					radius: 130
				},
				detectRadius: 150,
				leashRadius: 230
			},
			{
				kind: "wasp",
				x: 576,
				y: 250,
				speed: 42,
				chaseSpeed: 230,
				guardZone: {
					x: 576,
					y: 250,
					radius: 140
				},
				detectRadius: 160,
				leashRadius: 240
			}
		],
		obstacles: [
			{
				kind: "prop-fountain",
				x: 576,
				y: 880,
				height: 110,
				collides: true
			},
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
			winKicker: "Royal Botanist Crowned! 👑",
			winTitle: "Quest Complete!",
			winBody: "Monnie conquered all 10 garden realms and unlocked the Queen's Royal Gate! You have completed Flower Quest!",
			loseKicker: "Defeated at the Throne",
			loseTitle: "Out of hearts",
			loseBody: "Monnie gathered {collected} of {needed} royal blooms. Utilize Frost Petals and Swift Seeds to evade the Royal Guard!"
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
	objectives: [],
	activePowerUp: null,
	powerUpRemaining: 0,
	powerUpTotal: 0
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
function useGameState() {
	const [state, setState] = (0, import_react.useState)(getGameState);
	(0, import_react.useEffect)(() => subscribeGameState(setState), []);
	return state;
}
var MAX_DRAG = 54;
function VirtualJoystick() {
	const pointerId = (0, import_react.useRef)(null);
	const origin = (0, import_react.useRef)(null);
	const release = (0, import_react.useCallback)(() => {
		pointerId.current = null;
		origin.current = null;
		setJoystick(0, 0);
	}, []);
	(0, import_react.useEffect)(() => release, [release]);
	const onPointerDown = (0, import_react.useCallback)((e) => {
		if (e.target !== e.currentTarget) return;
		e.preventDefault();
		pointerId.current = e.pointerId;
		origin.current = {
			x: e.clientX,
			y: e.clientY
		};
		e.currentTarget.setPointerCapture(e.pointerId);
	}, []);
	const onPointerMove = (0, import_react.useCallback)((e) => {
		if (pointerId.current !== e.pointerId || !origin.current) return;
		let dx = e.clientX - origin.current.x;
		let dy = e.clientY - origin.current.y;
		const dist = Math.hypot(dx, dy);
		if (dist > MAX_DRAG) {
			dx = dx / dist * MAX_DRAG;
			dy = dy / dist * MAX_DRAG;
		}
		setJoystick(dx / MAX_DRAG, dy / MAX_DRAG);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-10 select-none touch-none",
		style: { touchAction: "none" },
		onPointerDown,
		onPointerMove,
		onPointerUp: release,
		onPointerCancel: release
	});
}
function MuteButton({ className = "" }) {
	const [muted, setMuted] = (0, import_react.useState)(isMuted);
	(0, import_react.useEffect)(() => subscribeMute(setMuted), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => {
			unlockAudio();
			toggleMute();
		},
		className: `pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-soil/70 text-cream backdrop-blur-sm ${className}`,
		"aria-label": muted ? "Unmute" : "Mute",
		children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {
			className: "h-5 w-5",
			strokeWidth: 2.5
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
			className: "h-5 w-5",
			strokeWidth: 2.5
		})
	});
}
function HudOverlay({ onPause }) {
	const { hearts, heartsMax, levelNumber, phase, banner, gateUnlocked, objectives, activePowerUp, powerUpRemaining, powerUpTotal } = useGameState();
	const required = objectives.reduce((sum, obj) => sum + obj.required, 0);
	const collected = objectives.reduce((sum, obj) => sum + obj.collected, 0);
	const progressPercent = required > 0 ? Math.min(100, Math.round(collected / required * 100)) : 0;
	const powerUpPct = powerUpTotal > 0 ? Math.max(0, Math.min(100, powerUpRemaining / powerUpTotal * 100)) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-20 flex flex-col justify-between overflow-hidden",
		children: [
			phase === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute inset-0 z-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VirtualJoystick, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-10 flex items-center justify-between gap-2 px-3 pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.3)] backdrop-blur-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1.5 font-display text-xs font-bold tracking-wider text-gold uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Lv ", levelNumber] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-px bg-white/20" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-xs font-extrabold text-cream",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "🌸"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									collected,
									"/",
									required
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 w-10 overflow-hidden rounded-full bg-white/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-gradient-to-r from-gold to-yellow-300 transition-all duration-300",
									style: { width: `${progressPercent}%` }
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1 rounded-full border border-white/15 bg-black/45 px-2.5 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.3)] backdrop-blur-md",
						children: Array.from({ length: heartsMax }).map((_, i) => {
							const isFilled = i < hearts;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/game/sprites/heart.png",
								alt: "Heart",
								className: `h-5 w-5 object-contain transition-all duration-200 ${isFilled ? hearts === 1 && isFilled ? "animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]" : "drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" : "opacity-20 grayscale"}`
							}, i);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 p-1 shadow-[0_8px_20px_rgba(0,0,0,0.3)] backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuteButton, { className: "h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 border-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onPause,
							className: "pointer-events-auto grid h-8 w-8 place-items-center rounded-full bg-white/10 text-cream transition-all hover:bg-white/20 active:scale-90",
							"aria-label": "Pause Game",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
								className: "h-4 w-4",
								strokeWidth: 2.5
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex flex-col items-center gap-2 pt-2",
				children: [
					activePowerUp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-extrabold shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-md animate-in fade-in zoom-in-90 duration-200 ${activePowerUp === "swift" ? "border-yellow-400/40 bg-yellow-950/70 text-yellow-200" : "border-cyan-400/40 bg-cyan-950/70 text-cyan-200"}`,
						children: [
							activePowerUp === "swift" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 fill-current animate-pulse text-yellow-300" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snowflake, { className: "h-3.5 w-3.5 animate-spin text-cyan-300" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tracking-wide",
								children: [
									activePowerUp === "swift" ? "Swift Boost" : "Frost Freeze",
									" (",
									powerUpRemaining.toFixed(1),
									"s)"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 w-12 overflow-hidden rounded-full bg-black/40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full rounded-full transition-all duration-100 ${activePowerUp === "swift" ? "bg-yellow-400" : "bg-cyan-400"}`,
									style: { width: `${powerUpPct}%` }
								})
							})
						]
					}),
					gateUnlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-950/80 px-4 py-1 text-xs font-extrabold text-emerald-200 shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-md animate-bounce",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-emerald-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Garden Gate is Open! Reach the exit!" })]
					}),
					banner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center rounded-full border border-white/20 bg-cream/95 px-4 py-1.5 text-xs font-extrabold text-soil shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-md animate-in slide-in-from-top-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: banner })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 pointer-events-none" })
		]
	});
}
function PauseMenu({ onResume, onRestart, onMenu }) {
	const { levelNumber } = useGameState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 grid place-items-center bg-soil/60 px-6 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-[1.5rem] bg-cream px-6 py-7 text-center text-ink shadow-[0_14px_0_#3a271c] ring-1 ring-soil/15",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs tracking-[0.22em] text-leaf uppercase",
					children: "Paused"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-3xl font-semibold",
					children: "Take a breath"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-2 max-w-[17rem] text-sm font-semibold text-soil/70",
					children: "Monnie will wait right here while you check the garden map."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuteButton, { className: "bg-soil/80 ring-1 ring-soil/15" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onResume,
							className: "flex w-full items-center justify-center gap-2 rounded-full bg-leaf px-5 py-3 font-bold text-cream shadow-[0_5px_0_#245c3a] transition-transform active:translate-y-1 active:shadow-[0_2px_0_#245c3a]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sprout, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Keep wandering" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onRestart,
							className: "flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-bold text-ink shadow-[0_5px_0_#b07d1c] transition-transform active:translate-y-1 active:shadow-[0_2px_0_#b07d1c]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Restart Level ", levelNumber] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onMenu,
							className: "flex w-full items-center justify-center gap-2 rounded-full bg-blush px-5 py-3 font-bold text-ink ring-1 ring-soil/10 transition-colors hover:bg-[#f0c6ae]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Garden gate" })]
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
		import("./createGame-l2hKD8eE.mjs").then(({ createFlowerQuest }) => {
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
		className: "absolute inset-0 z-30 grid place-items-center bg-soil/55 px-6 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-[1.5rem] bg-cream px-6 py-8 text-center text-ink shadow-[0_14px_0_#3a271c] ring-1 ring-soil/15",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold text-ink shadow-[0_5px_0_#b07d1c]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-7 w-7" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 font-display text-xs tracking-[0.22em] text-leaf uppercase",
					children: demoDone ? "Grand Victory" : won ? copy.winKicker : copy.loseKicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-3xl font-semibold",
					children: demoDone ? "All 10 Gardens Complete!" : won ? copy.winTitle : copy.loseTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-soil/80",
					children: demoDone ? "Crown Monnie as the Grand Royal Botanist! You have gathered all blooms across all 10 levels!" : fill(won ? copy.winBody : copy.loseBody, flowersCollected, flowersNeeded)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3",
					children: [
						won && next && onContinue && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onContinue(next.id),
							className: "flex w-full items-center justify-center gap-2 rounded-full bg-leaf px-5 py-3 font-bold text-cream shadow-[0_5px_0_#245c3a] transition-transform active:translate-y-1 active:shadow-[0_2px_0_#245c3a]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Continue to ", next.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-5 w-5" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								if (demoDone && onContinue) onContinue("level-1");
								else onRestart();
							},
							className: won && next ? "flex w-full items-center justify-center gap-2 rounded-full bg-blush px-5 py-3 font-bold text-ink ring-1 ring-soil/10" : "flex w-full items-center justify-center gap-2 rounded-full bg-petal px-5 py-3 font-bold text-cream shadow-[0_5px_0_#9a3140] transition-transform active:translate-y-1 active:shadow-[0_2px_0_#9a3140]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: won ? "Play again" : "Try again" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onMenu,
							className: "flex w-full items-center justify-center gap-2 rounded-full bg-blush px-5 py-3 font-bold text-ink ring-1 ring-soil/10 transition-colors hover:bg-[#f0c6ae]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: demoDone ? "Title screen" : "Garden gate" })]
						})
					]
				})
			]
		})
	});
}
function StartScreen({ onPlay }) {
	const { assetsReady, loadProgress } = useGameState();
	const [selectedLevelId, setSelectedLevelId] = (0, import_react.useState)("level-1");
	const [activeTab, setActiveTab] = (0, import_react.useState)("play");
	const progress = Math.round(loadProgress * 100);
	const selectedLevel = LEVELS.find((l) => l.id === selectedLevelId) ?? LEVELS[0];
	const handleStart = (levelId = selectedLevelId) => {
		unlockAudio();
		onPlay(levelId);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-20 flex flex-col justify-between overflow-hidden text-cream select-none",
		onPointerDown: () => {
			unlockAudio();
			startMusic("title");
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-soil/60 to-black/90 backdrop-blur-[2px]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-10 flex items-center justify-between px-4 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-extrabold shadow-lg backdrop-blur-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: "🌸"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display tracking-wider text-gold uppercase",
								children: "Flower Quest"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-leaf/80 px-1.5 py-0.2 text-[9px] text-cream",
								children: "v3"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline text-[11px] font-bold text-cream/75",
						children: "10 Gardens"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuteButton, { className: "h-8 w-8 rounded-full border border-white/20 bg-black/40 shadow-lg backdrop-blur-md" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 p-1 shadow-md backdrop-blur-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setActiveTab("play"),
								className: `rounded-full px-3.5 py-1 text-xs font-bold transition-all ${activeTab === "play" ? "bg-gold text-ink shadow-[0_2px_8px_rgba(224,169,58,0.5)]" : "text-cream/80 hover:text-cream"}`,
								children: "Adventure"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setActiveTab("levels"),
								className: `rounded-full px-3.5 py-1 text-xs font-bold transition-all ${activeTab === "levels" ? "bg-gold text-ink shadow-[0_2px_8px_rgba(224,169,58,0.5)]" : "text-cream/80 hover:text-cream"}`,
								children: "Gardens (1-10)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setActiveTab("powers"),
								className: `rounded-full px-3.5 py-1 text-xs font-bold transition-all ${activeTab === "powers" ? "bg-gold text-ink shadow-[0_2px_8px_rgba(224,169,58,0.5)]" : "text-cream/80 hover:text-cream"}`,
								children: "Power Blooms"
							})
						]
					}),
					activeTab === "play" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative my-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-6 rounded-full bg-gold/20 blur-2xl animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/game/sprites/monnie.png",
									alt: "Monnie",
									className: "monnie-bob relative z-10 h-44 sm:h-52 w-auto drop-shadow-[0_16px_24px_rgba(0,0,0,0.5)]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-4xl sm:text-5xl font-bold tracking-tight text-cream drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]",
								children: "Monnie's Quest"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 max-w-[20rem] text-xs sm:text-sm font-medium leading-relaxed text-cream/90 drop-shadow",
								children: "Explore 10 vibrant garden realms, collect magical blooms, evade hostile swarms, and unlock each sacred gate."
							})
						]
					}),
					activeTab === "levels" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full max-w-[380px] max-h-[50vh] overflow-y-auto rounded-2xl border border-white/15 bg-black/50 p-2.5 shadow-2xl backdrop-blur-lg animate-in fade-in duration-200 space-y-1.5 scrollbar-thin",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-1 py-0.5 text-[11px] font-bold text-gold uppercase tracking-wider",
							children: "Select Any Garden Realm:"
						}), LEVELS.map((lvl) => {
							const isSelected = lvl.id === selectedLevelId;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => {
									setSelectedLevelId(lvl.id);
									handleStart(lvl.id);
								},
								className: `flex items-center justify-between gap-2 rounded-xl p-2.5 transition-all cursor-pointer border ${isSelected ? "border-gold bg-gold/20 text-cream shadow-md" : "border-white/10 bg-white/5 text-cream/85 hover:bg-white/10"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-black/40 font-display text-xs font-bold text-gold border border-white/10",
										children: lvl.number
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "truncate",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs font-extrabold",
											children: lvl.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-[10px] text-cream/70",
											children: lvl.objectiveText
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "shrink-0 rounded-full bg-gold/90 px-2.5 py-1 text-[10px] font-extrabold text-ink transition-transform active:scale-95",
									children: "Play"
								})]
							}, lvl.id);
						})]
					}),
					activeTab === "powers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full max-w-[360px] space-y-2 rounded-2xl border border-white/15 bg-black/50 p-3.5 shadow-2xl backdrop-blur-lg animate-in fade-in duration-200",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 rounded-xl border border-yellow-400/25 bg-yellow-950/40 p-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-yellow-400 text-ink shadow-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 fill-current" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-extrabold text-yellow-200",
										children: "Swift Seed (4.0s)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-yellow-100/75",
										children: "+50% sprint speed to outrun aggressive bees & beetles."
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 rounded-xl border border-cyan-400/25 bg-cyan-950/40 p-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan-400 text-ink shadow-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snowflake, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-extrabold text-cyan-200",
										children: "Frost Petal (3.0s)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-cyan-100/75",
										children: "Freezes all beetles, bees, and wasps in solid ice."
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 rounded-xl border border-emerald-400/25 bg-emerald-950/40 p-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-400 text-ink shadow-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-4 w-4 fill-current" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-extrabold text-emerald-200",
										children: "Heart Leaf"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-emerald-100/75",
										children: "Instantly restores 1 lost heart container."
									})]
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "relative z-10 px-6 pb-6 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2.5 flex items-center justify-between text-[11px] font-extrabold text-cream/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Target: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-cream",
								children: selectedLevel.name
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] text-gold border border-white/10",
							children: "Touch & Drag or WASD"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !assetsReady,
						onClick: () => handleStart(selectedLevelId),
						className: "group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-petal via-rose-500 to-amber-500 px-6 py-4 font-display text-xl font-bold text-cream shadow-[0_8px_25px_rgba(227,93,106,0.45)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_10px_30px_rgba(227,93,106,0.6)] active:translate-y-0.5 active:shadow-[0_4px_12px_rgba(227,93,106,0.4)] disabled:opacity-60",
						children: assetsReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-5 w-5 fill-current transition-transform group-hover:scale-110" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tracking-wide",
							children: selectedLevelId === "level-1" ? "Start Adventure" : `Play ${selectedLevel.name}`
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Sprouting Garden... ",
							progress,
							"%"
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-[10px] font-bold text-cream/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Built for" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gold",
									children: "chaddytwiceover.com"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "• Lab Section" })
							]
						})
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
	const play = (levelId = "level-1") => {
		unlockAudio();
		apiRef.current?.startLevel(levelId);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative flex h-full min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_25%_10%,#4f8f5c_0,#245c3a_28%,#3a271c_74%)] px-0 py-0 text-cream sm:px-6 sm:py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 opacity-55 [background-image:linear-gradient(120deg,rgb(247_241_227_/_0.10)_1px,transparent_1px),linear-gradient(300deg,rgb(224_169_58_/_0.10)_1px,transparent_1px)] [background-size:44px_44px]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -left-20 top-16 hidden h-80 w-80 rounded-full border border-cream/15 sm:block" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-24 bottom-10 hidden h-96 w-96 rounded-full border border-gold/20 sm:block" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-full min-h-full w-full max-w-[430px] sm:h-[calc(100dvh-2.5rem)] sm:max-h-[900px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -inset-2 hidden rounded-[2rem] bg-cream/10 shadow-[0_24px_80px_rgb(0_0_0_/_0.35)] sm:block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "game-shell relative h-full w-full overflow-hidden bg-moss shadow-[0_18px_70px_rgb(0_0_0_/_0.34)] sm:rounded-[1.65rem] sm:ring-1 sm:ring-cream/25",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaserCanvas, { onReady }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgb(28_22_18_/_0.12),transparent_16%,transparent_72%,rgb(28_22_18_/_0.20))]" }),
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
				})]
			})
		]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowerQuestApp, {});
}
//#endregion
export { stopMusic as S, sfxLose as _, getLevel as a, sfxWin as b, detachInput as c, updateActions as d, setMusicPaused as f, sfxHurt as g, sfxFreeze as h, LEVELS as i, setJoystick as l, sfxCollect as m, getGameState as n, actions as o, sfxAlert as p, patchGameState as r, attachInput as s, routes_exports as t, setKeyOverride as u, sfxPowerUp as v, startMusic as x, sfxUnlock as y };
