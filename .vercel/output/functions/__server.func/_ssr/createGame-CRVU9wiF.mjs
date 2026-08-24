import { S as stopMusic, _ as sfxLose, a as getLevel, b as sfxWin, c as detachInput, d as updateActions, f as setMusicPaused, g as sfxHurt, h as sfxFreeze, i as LEVELS, l as setJoystick, m as sfxCollect, n as getGameState, o as actions, p as sfxAlert, r as patchGameState, s as attachInput, u as setKeyOverride, v as sfxPowerUp, x as startMusic, y as sfxUnlock } from "./routes-BP5hSl7t.mjs";
import { a as __webpack_exports__Scale, i as __webpack_exports__Math, n as __webpack_exports__BlendModes, o as __webpack_exports__Scene, r as __webpack_exports__Game, t as __webpack_exports__AUTO } from "../_libs/phaser.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createGame-CRVU9wiF.js
var GAME_HEIGHT = 1280;
var BootScene = class extends __webpack_exports__Scene {
	constructor() {
		super("boot");
	}
	create() {
		patchGameState({
			phase: "boot",
			loadProgress: 0
		});
		this.scene.start("preload");
	}
};
var IDLE_FRAME = {
	down: 0,
	left: 4,
	right: 8,
	up: 12
};
var ACTION_FRAME = {
	jump: 0,
	collect: 1,
	hurt: 2,
	win: 3
};
function createPlayer(scene, x, y) {
	const sprite = scene.physics.add.sprite(x, y, "player", 0);
	sprite.setScale(90 / 96);
	sprite.setOrigin(.5, .9);
	sprite.body?.setSize(24, 16);
	sprite.body?.setOffset(36, 74);
	sprite.setDepth(y);
	sprite.setFrame(0);
	return {
		sprite,
		facing: "down",
		invincibleUntil: 0,
		animLockUntil: 0
	};
}
function playPlayerAction(player, action, durationMs) {
	const sprite = player.sprite;
	sprite.anims.stop();
	sprite.setTexture("player-actions", ACTION_FRAME[action]);
	player.animLockUntil = sprite.scene.time.now + durationMs;
}
function updatePlayer(player, speed) {
	const { sprite } = player;
	const locked = sprite.scene.time.now < player.animLockUntil;
	const vx = actions.moveX * speed;
	const vy = actions.moveY * speed;
	sprite.setVelocity(vx, vy);
	if (!locked && sprite.texture.key !== "player") sprite.setTexture("player", IDLE_FRAME[player.facing]);
	if (Math.abs(vx) + Math.abs(vy) > 8) {
		if (Math.abs(vx) > Math.abs(vy)) player.facing = vx < 0 ? "left" : "right";
		else player.facing = vy < 0 ? "up" : "down";
		if (!locked) {
			const key = `walk-${player.facing}`;
			if (sprite.anims.currentAnim?.key !== key || sprite.texture.key !== "player") {
				sprite.setTexture("player");
				sprite.play(key, true);
			}
		}
	} else {
		sprite.setVelocity(0, 0);
		if (!locked) {
			sprite.anims.stop();
			if (sprite.texture.key !== "player") sprite.setTexture("player");
			sprite.setFrame(IDLE_FRAME[player.facing]);
		}
	}
	sprite.setDepth(sprite.y);
}
function placeCollectibles(scene, level) {
	const flowers = [];
	for (const spot of level.flowers) {
		const glow = scene.add.sprite(spot.x, spot.y + 4, spot.kind);
		glow.setOrigin(.5, .7);
		glow.setAlpha(.32);
		glow.setTint(14723386);
		glow.setBlendMode(__webpack_exports__BlendModes.ADD);
		glow.setDepth(spot.y - 2);
		const flower = scene.physics.add.sprite(spot.x, spot.y, spot.kind);
		const src = flower.height || 1;
		const scale = 52 / src;
		flower.setScale(scale);
		glow.setScale(scale * 1.5);
		flower.setOrigin(.5, .7);
		flower.body?.setAllowGravity(false);
		flower.body?.setImmovable(true);
		flower.body?.setCircle(Math.max(64, src * .32));
		flower.setData("kind", spot.kind);
		flower.setData("glow", glow);
		flower.setDepth(spot.y);
		scene.tweens.add({
			targets: [flower, glow],
			y: spot.y - 7,
			duration: 900 + Math.random() * 400,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut"
		});
		scene.tweens.add({
			targets: glow,
			alpha: .18,
			scale: scale * 1.7,
			duration: 1e3 + Math.random() * 300,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut"
		});
		flowers.push(flower);
	}
	return flowers;
}
function flowersRemaining(flowers) {
	return flowers.filter((flower) => flower.active).length;
}
/** Backup for Arcade overlap misses (tweens / teleport / fast movement). */
function findNearbyCollectible(flowers, x, y, radius = 46) {
	for (const flower of flowers) {
		if (!flower.active) continue;
		if (__webpack_exports__Math.Distance.Between(x, y, flower.x, flower.y) < radius) return flower;
	}
	return null;
}
function createPest(scene, def) {
	const kind = def.kind;
	let sprite;
	let alertEmote;
	if (kind === "bee") {
		sprite = scene.physics.add.sprite(def.x, def.y, "bee-sprite");
		sprite.setScale(.85);
		sprite.setOrigin(.5, .5);
		sprite.body?.setCircle(22, 10, 10);
	} else if (kind === "wasp") {
		sprite = scene.physics.add.sprite(def.x, def.y, "wasp-sprite");
		sprite.setScale(.9);
		sprite.setOrigin(.5, .5);
		sprite.body?.setCircle(22, 10, 10);
	} else {
		sprite = scene.physics.add.sprite(def.x, def.y, "beetle", 0);
		sprite.setScale(46 / 128);
		sprite.setOrigin(.5, .7);
		sprite.body?.setCircle(40, 24, 36);
		if (scene.anims.exists("beetle-walk")) sprite.play("beetle-walk");
	}
	sprite.setDepth(def.y);
	if (kind === "bee" || kind === "wasp") {
		alertEmote = scene.add.image(def.x, def.y - 36, "alert-emote");
		alertEmote.setScale(.8);
		alertEmote.setDepth(def.y + 100);
		alertEmote.setVisible(false);
	}
	const origin = def.guardZone ? {
		x: def.guardZone.x,
		y: def.guardZone.y
	} : {
		x: def.x,
		y: def.y
	};
	return {
		kind,
		sprite,
		alertEmote,
		patrol: def.patrol ?? (def.guardZone ? [{
			x: def.guardZone.x,
			y: def.guardZone.y
		}] : [{
			x: def.x,
			y: def.y
		}]),
		index: 0,
		speed: def.speed,
		chaseSpeed: def.chaseSpeed ?? def.speed * 1.5,
		origin,
		state: kind === "wasp" ? "guard" : "patrol",
		stateTimer: 0,
		detectRadius: def.detectRadius ?? (kind === "wasp" ? 170 : 190),
		leashRadius: def.leashRadius ?? (kind === "wasp" ? 230 : 320),
		guardRadius: def.guardZone?.radius ?? 120
	};
}
function jammedToward(sprite, dx, dy) {
	const body = sprite.body;
	if (!body) return false;
	return dx < 0 && body.blocked.left || dx > 0 && body.blocked.right || dy < 0 && body.blocked.up || dy > 0 && body.blocked.down;
}
function updatePest(pest, playerX, playerY, deltaSec, isFrozen = false) {
	const { sprite, alertEmote, kind } = pest;
	if (!sprite.active) return;
	if (isFrozen) {
		sprite.setVelocity(0, 0);
		sprite.setTint(8965375);
		if (alertEmote) alertEmote.setVisible(false);
		return;
	}
	sprite.clearTint();
	if (alertEmote) {
		alertEmote.setPosition(sprite.x, sprite.y - 34);
		alertEmote.setDepth(sprite.y + 100);
	}
	if (kind === "beetle") {
		updateBeetle(pest);
		return;
	}
	if (kind === "bee") {
		updateBee(pest, playerX, playerY, deltaSec);
		return;
	}
	if (kind === "wasp") {
		updateWasp(pest, playerX, playerY, deltaSec);
		return;
	}
}
function updateBeetle(pest) {
	const { sprite, patrol, speed } = pest;
	if (patrol.length === 0) {
		sprite.setVelocity(0, 0);
		return;
	}
	const target = patrol[pest.index % patrol.length];
	const dx = target.x - sprite.x;
	const dy = target.y - sprite.y;
	const dist = Math.hypot(dx, dy);
	if (dist < 16 || jammedToward(sprite, dx, dy)) {
		pest.index = (pest.index + 1) % patrol.length;
		sprite.setVelocity(0, 0);
		return;
	}
	sprite.setVelocity(dx / dist * speed, dy / dist * speed);
	sprite.setFlipX(dx < 0);
	sprite.setDepth(sprite.y);
}
function updateBee(pest, px, py, dt) {
	const { sprite, alertEmote, patrol, speed, chaseSpeed, detectRadius, leashRadius, origin } = pest;
	const distToPlayer = Math.hypot(px - sprite.x, py - sprite.y);
	const distToOrigin = Math.hypot(origin.x - sprite.x, origin.y - sprite.y);
	pest.stateTimer -= dt;
	switch (pest.state) {
		case "patrol":
			if (alertEmote) alertEmote.setVisible(false);
			if (distToPlayer < detectRadius) {
				pest.state = "alert";
				pest.stateTimer = .4;
				sfxAlert();
				if (alertEmote) {
					alertEmote.setVisible(true);
					alertEmote.setScale(1.2);
				}
				sprite.setVelocity(0, 0);
				return;
			}
			if (patrol.length > 0) {
				const target = patrol[pest.index % patrol.length];
				const dx = target.x - sprite.x;
				const dy = target.y - sprite.y;
				const dist = Math.hypot(dx, dy);
				if (dist < 16) pest.index = (pest.index + 1) % patrol.length;
				else {
					sprite.setVelocity(dx / dist * speed, dy / dist * speed);
					sprite.setFlipX(dx < 0);
				}
			}
			break;
		case "alert":
			sprite.setVelocity(0, 0);
			if (alertEmote) alertEmote.setVisible(true);
			if (pest.stateTimer <= 0) {
				pest.state = "chase";
				pest.stateTimer = 2.5;
				if (alertEmote) alertEmote.setVisible(false);
			}
			break;
		case "chase": {
			if (alertEmote) alertEmote.setVisible(false);
			if (pest.stateTimer <= 0 || distToPlayer > leashRadius || distToOrigin > leashRadius + 100) {
				pest.state = "cooldown";
				pest.stateTimer = 1.8;
				return;
			}
			const dx = px - sprite.x;
			const dy = py - sprite.y;
			const dist = Math.max(1, Math.hypot(dx, dy));
			sprite.setVelocity(dx / dist * chaseSpeed, dy / dist * chaseSpeed);
			sprite.setFlipX(dx < 0);
			break;
		}
		case "cooldown": {
			if (alertEmote) alertEmote.setVisible(false);
			const target = patrol[pest.index % patrol.length] || origin;
			const dx = target.x - sprite.x;
			const dy = target.y - sprite.y;
			const dist = Math.hypot(dx, dy);
			if (dist < 20 || pest.stateTimer <= 0) {
				pest.state = "patrol";
				pest.stateTimer = 0;
			} else {
				sprite.setVelocity(dx / dist * (speed * .7), dy / dist * (speed * .7));
				sprite.setFlipX(dx < 0);
			}
			break;
		}
	}
	sprite.setDepth(sprite.y);
}
function updateWasp(pest, px, py, dt) {
	const { sprite, alertEmote, origin, speed, chaseSpeed, guardRadius, leashRadius } = pest;
	const distToPlayer = Math.hypot(px - sprite.x, py - sprite.y);
	const playerDistToOrigin = Math.hypot(px - origin.x, py - origin.y);
	const waspDistToOrigin = Math.hypot(sprite.x - origin.x, sprite.y - origin.y);
	pest.stateTimer -= dt;
	switch (pest.state) {
		case "guard": {
			if (alertEmote) alertEmote.setVisible(false);
			const hoverAngle = Date.now() / 350 % (Math.PI * 2);
			const targetX = origin.x + Math.cos(hoverAngle) * 20;
			const targetY = origin.y + Math.sin(hoverAngle) * 20;
			const dx = targetX - sprite.x;
			const dy = targetY - sprite.y;
			sprite.setVelocity(dx * 2.5, dy * 2.5);
			sprite.setFlipX(dx < 0);
			if (playerDistToOrigin < guardRadius || distToPlayer < 110) {
				pest.state = "aggro";
				pest.stateTimer = 2;
				sfxAlert();
				if (alertEmote) alertEmote.setVisible(true);
			}
			break;
		}
		case "aggro": {
			if (alertEmote) alertEmote.setVisible(true);
			if (playerDistToOrigin > leashRadius || waspDistToOrigin > leashRadius || pest.stateTimer <= 0) {
				pest.state = "return";
				if (alertEmote) alertEmote.setVisible(false);
				return;
			}
			const dx = px - sprite.x;
			const dy = py - sprite.y;
			const dist = Math.max(1, Math.hypot(dx, dy));
			sprite.setVelocity(dx / dist * chaseSpeed, dy / dist * chaseSpeed);
			sprite.setFlipX(dx < 0);
			break;
		}
		case "return": {
			if (alertEmote) alertEmote.setVisible(false);
			const dx = origin.x - sprite.x;
			const dy = origin.y - sprite.y;
			const dist = Math.hypot(dx, dy);
			if (dist < 18) {
				pest.state = "guard";
				sprite.setVelocity(0, 0);
			} else {
				sprite.setVelocity(dx / dist * (speed * 1.1), dy / dist * (speed * 1.1));
				sprite.setFlipX(dx < 0);
			}
			break;
		}
	}
	sprite.setDepth(sprite.y);
}
function placeHazards(scene, level) {
	return level.hazards.map((def) => {
		if (def.kind === "beetle") return createPest(scene, def);
		return createPest(scene, def);
	});
}
function updateHazards(hazards, playerX = 0, playerY = 0, deltaSec = .016, isFrozen = false) {
	hazards.forEach((hazard) => updatePest(hazard, playerX, playerY, deltaSec, isFrozen));
}
function stopHazards(hazards) {
	hazards.forEach((hazard) => hazard.sprite.setVelocity(0, 0));
}
/** True if any hazard is close enough to hurt the player this frame. */
function hazardTouches(hazards, x, y, radius = 34) {
	for (const hazard of hazards) {
		if (!hazard.sprite.active) continue;
		if (__webpack_exports__Math.Distance.Between(x, y, hazard.sprite.x, hazard.sprite.y) < radius) return true;
	}
	return false;
}
function hazardPositions(hazards) {
	return hazards.map((hazard) => ({
		x: hazard.sprite.x,
		y: hazard.sprite.y
	}));
}
function loseHeart() {
	const hearts = Math.max(0, getGameState().hearts - 1);
	patchGameState({ hearts });
	return {
		hearts,
		dead: hearts <= 0
	};
}
function resolveObjectives(level) {
	if (level.objectives && level.objectives.length > 0) return level.objectives;
	return [{
		type: "collect",
		collectible: "any",
		required: level.flowers.length,
		label: level.collectibleLabel ?? ""
	}];
}
function flowersNeeded(level) {
	return resolveObjectives(level).reduce((sum, obj) => sum + obj.required, 0);
}
function toProgress(level) {
	return resolveObjectives(level).map((obj) => ({
		collectible: obj.collectible,
		label: obj.label,
		icon: obj.collectible === "any" ? level.collectibleIcon : obj.collectible,
		collected: 0,
		required: obj.required
	}));
}
function noteCollected(level, kind) {
	const objectives = getGameState().objectives.map((obj) => {
		if (!(obj.collectible === "any" || obj.collectible === kind) || obj.collected >= obj.required) return obj;
		return {
			...obj,
			collected: obj.collected + 1
		};
	});
	const collected = objectives.reduce((sum, obj) => sum + obj.collected, 0);
	const needed = flowersNeeded(level);
	const met = objectives.every((obj) => obj.collected >= obj.required);
	patchGameState({
		flowersCollected: collected,
		flowersNeeded: needed,
		objectives
	});
	return {
		collected,
		needed,
		met
	};
}
function objectiveMet(_level) {
	const { objectives, flowersCollected, flowersNeeded } = getGameState();
	if (objectives.length === 0) return flowersCollected >= flowersNeeded;
	return objectives.every((obj) => obj.collected >= obj.required);
}
/** Remaining-requirement copy for a locked gate. */
function lockedExitHint(fallback) {
	const { objectives } = getGameState();
	if (objectives.length < 2) return fallback;
	const bits = objectives.filter((obj) => obj.collected < obj.required).map((obj) => `${obj.required - obj.collected} ${obj.label.toLowerCase()}`);
	if (!bits.length) return fallback;
	return `Still need ${bits.join(" and ")}!`;
}
function showBanner(text) {
	patchGameState({ banner: text });
}
function clearBanner() {
	if (getGameState().banner) patchGameState({ banner: null });
}
function applyLevelHud(level) {
	const objectives = toProgress(level);
	patchGameState({
		phase: "playing",
		levelId: level.id,
		levelNumber: level.number,
		levelName: level.name,
		levelSubtitle: level.objectiveText,
		flowersCollected: 0,
		flowersNeeded: flowersNeeded(level),
		hearts: level.hearts,
		heartsMax: level.hearts,
		banner: null,
		gateUnlocked: false,
		collectibleLabel: level.collectibleLabel,
		collectibleIcon: level.collectibleIcon,
		objectives
	});
}
var BODY_BY_KIND = {
	tree: {
		w: 36,
		h: 22
	},
	bush: {
		w: 48,
		h: 26
	},
	rock: {
		w: 46,
		h: 26
	},
	stump: {
		w: 38,
		h: 22
	},
	pot: {
		w: 26,
		h: 22
	},
	arch: {
		w: 22,
		h: 16
	}
};
/** Trees, rocks, bushes, arches, and rectangular hedge/wall blockers. */
function placeObstacles(scene, level, blockers) {
	for (const prop of level.obstacles) {
		const sprite = scene.physics.add.staticSprite(prop.x, prop.y, prop.kind);
		const src = sprite.height || 1;
		sprite.setScale(prop.height / src);
		sprite.setOrigin(.5, .88);
		sprite.setDepth(prop.y);
		const body = BODY_BY_KIND[prop.kind];
		sprite.body?.setSize(body.w, body.h);
		sprite.body?.setOffset((sprite.width - body.w) / 2, sprite.height - body.h - 4);
		sprite.refreshBody();
		if (prop.collides !== false) blockers.add(sprite);
	}
	for (const wall of level.walls) {
		const block = scene.physics.add.staticImage(wall.x, wall.y, "spark");
		block.setVisible(false);
		block.setOrigin(0, 0);
		block.setDisplaySize(wall.w, wall.h);
		block.refreshBody();
		blockers.add(block);
		block.refreshBody();
	}
}
/**
* Impassable water from level data.
* Bridge crossings are GAPS in these rectangles — not special-case logic.
*/
function placeWater(scene, level) {
	const tiles = [];
	const group = scene.physics.add.staticGroup();
	const bands = level.water ?? [];
	const hasTexture = scene.textures.exists("water");
	for (const band of bands) {
		const cx = band.x + band.w / 2;
		const cy = band.y + band.h / 2;
		if (hasTexture) {
			const tile = scene.add.tileSprite(cx, cy, band.w, band.h, "water");
			tile.setDepth(2);
			tile.setAlpha(.38);
			tiles.push(tile);
		}
		const block = group.create(cx, cy, "spark");
		block.setVisible(false);
		block.setDisplaySize(band.w, band.h);
		block.refreshBody();
	}
	return {
		tiles,
		group
	};
}
function updateWater(water, time) {
	for (const tile of water.tiles) {
		tile.tilePositionX = time * .018;
		tile.tilePositionY = Math.sin(time * .0014) * 6;
	}
}
function placeBridges(scene, level) {
	const bridges = level.bridges ?? [];
	if (!scene.textures.exists("bridge")) return;
	for (const def of bridges) {
		const sprite = scene.add.image(def.x, def.y, "bridge");
		sprite.setDisplaySize(def.displayWidth, def.displayHeight);
		sprite.setOrigin(.5, .55);
		sprite.setDepth(Math.max(3, def.y - 40));
	}
}
var GATE_DISPLAY = 168;
var TOUCH_RADIUS = 56;
/**
* Places the level gate when `level.exit` is set.
* Level 1 has `exit: null` and skips this.
*/
function placeExit(scene, level, blockers) {
	if (!level.exit) return null;
	const { x, y } = level.exit;
	const unlockAt = level.exit.unlockAt === "all-flowers" ? level.flowers.length : level.exit.unlockAt;
	const sprite = scene.physics.add.staticSprite(x, y, "gate-locked");
	const src = sprite.height || 1;
	sprite.setScale(GATE_DISPLAY / src);
	sprite.setOrigin(.5, .9);
	sprite.setDepth(y);
	sprite.body?.setSize(70, 28);
	sprite.body?.setOffset((sprite.width - 70) / 2, sprite.height - 36);
	sprite.refreshBody();
	blockers.add(sprite);
	return {
		sprite,
		label: scene.add.text(x, y - GATE_DISPLAY + 18, "LOCKED", {
			fontFamily: "Fraunces, Georgia, serif",
			fontSize: "14px",
			color: "#f4d27a",
			fontStyle: "bold",
			stroke: "#3a271c",
			strokeThickness: 4
		}).setOrigin(.5).setDepth(y + 1),
		locked: true,
		unlockAt,
		lockedHint: level.exit.lockedHint,
		unlockedHint: level.exit.unlockedHint,
		unlockedObjective: level.exit.unlockedObjective,
		lastHintAt: 0
	};
}
function unlockExit(scene, exit, blockers) {
	if (!exit || !exit.locked) return false;
	exit.locked = false;
	exit.sprite.setTexture("gate-open");
	const src = exit.sprite.height || 1;
	exit.sprite.setScale(GATE_DISPLAY / src);
	blockers.remove(exit.sprite);
	if (exit.sprite.body) exit.sprite.body.enable = false;
	exit.label.setText("OPEN");
	exit.label.setColor("#b7e3a1");
	scene.tweens.add({
		targets: exit.sprite,
		scaleX: exit.sprite.scaleX * 1.06,
		scaleY: exit.sprite.scaleY * 1.06,
		yoyo: true,
		duration: 180
	});
	patchGameState({
		gateUnlocked: true,
		levelSubtitle: exit.unlockedObjective
	});
	return true;
}
function syncExitLock(scene, exit, blockers) {
	if (!exit) return false;
	if (!objectiveMet()) return false;
	return unlockExit(scene, exit, blockers);
}
function exitStatus(exit, x, y) {
	if (!exit) return "far";
	if (__webpack_exports__Math.Distance.Between(x, y, exit.sprite.x, exit.sprite.y) >= TOUCH_RADIUS) return "far";
	return exit.locked ? "locked" : "open";
}
function shouldHintLocked(exit, now, cooldown = 2200) {
	if (now - exit.lastHintAt < cooldown) return false;
	exit.lastHintAt = now;
	return true;
}
var currentPowerUp = {
	kind: null,
	remainingSec: 0,
	totalSec: 0
};
function activatePowerUp(kind, onHeal) {
	if (kind === "heart") {
		sfxPowerUp("heart");
		if (onHeal) onHeal();
		return;
	}
	sfxPowerUp(kind);
	if (kind === "frost") sfxFreeze();
	const duration = kind === "swift" ? 4 : 3;
	currentPowerUp = {
		kind,
		remainingSec: duration,
		totalSec: duration
	};
	patchGameState({
		activePowerUp: kind,
		powerUpRemaining: duration,
		powerUpTotal: duration
	});
}
function updatePowerUps(deltaSec) {
	if (!currentPowerUp.kind) return {
		speedMultiplier: 1,
		isFrozen: false
	};
	currentPowerUp.remainingSec -= deltaSec;
	if (currentPowerUp.remainingSec <= 0) {
		currentPowerUp = {
			kind: null,
			remainingSec: 0,
			totalSec: 0
		};
		patchGameState({
			activePowerUp: null,
			powerUpRemaining: 0,
			powerUpTotal: 0
		});
		return {
			speedMultiplier: 1,
			isFrozen: false
		};
	}
	patchGameState({
		activePowerUp: currentPowerUp.kind,
		powerUpRemaining: Math.max(0, currentPowerUp.remainingSec),
		powerUpTotal: currentPowerUp.totalSec
	});
	return {
		speedMultiplier: currentPowerUp.kind === "swift" ? 1.5 : 1,
		isFrozen: currentPowerUp.kind === "frost"
	};
}
function clearPowerUps() {
	currentPowerUp = {
		kind: null,
		remainingSec: 0,
		totalSec: 0
	};
	patchGameState({
		activePowerUp: null,
		powerUpRemaining: 0,
		powerUpTotal: 0
	});
}
function placePowerBlooms(scene, level) {
	const blooms = [];
	const spots = level.powerBlooms ?? [];
	for (const spot of spots) {
		const texKey = `power-${spot.kind}`;
		const glow = scene.add.sprite(spot.x, spot.y, texKey);
		glow.setOrigin(.5, .5);
		glow.setAlpha(.4);
		glow.setBlendMode(__webpack_exports__BlendModes.ADD);
		glow.setDepth(spot.y - 2);
		const bloom = scene.physics.add.sprite(spot.x, spot.y, texKey);
		bloom.setScale(.85);
		glow.setScale(1.2);
		bloom.setOrigin(.5, .5);
		bloom.body?.setAllowGravity(false);
		bloom.body?.setImmovable(true);
		bloom.body?.setCircle(28, 10, 10);
		bloom.setData("kind", spot.kind);
		bloom.setData("glow", glow);
		bloom.setDepth(spot.y);
		scene.tweens.add({
			targets: [bloom, glow],
			y: spot.y - 8,
			duration: 800 + Math.random() * 300,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut"
		});
		scene.tweens.add({
			targets: glow,
			alpha: .15,
			scale: 1.5,
			duration: 700 + Math.random() * 300,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut"
		});
		blooms.push(bloom);
	}
	return blooms;
}
function collectPowerBloom(scene, bloom, onHeal) {
	if (!bloom.active) return;
	const kind = bloom.getData("kind");
	const glow = bloom.getData("glow");
	bloom.disableBody(true, false);
	bloom.setActive(false);
	scene.tweens.add({
		targets: [bloom, glow].filter(Boolean),
		scaleX: 1.6,
		scaleY: 1.6,
		alpha: 0,
		duration: 260,
		ease: "Cubic.easeOut",
		onComplete: () => {
			bloom.destroy();
			glow?.destroy();
		}
	});
	activatePowerUp(kind, onHeal);
}
function placeWorld(scene, level) {
	const { width, height, boundsInset, mapKey } = level.environment;
	scene.physics.world.setBounds(boundsInset, boundsInset, width - boundsInset * 2, height - boundsInset * 2);
	const ground = scene.add.image(0, 0, mapKey).setOrigin(0, 0);
	ground.setDisplaySize(width, height);
	ground.setDepth(-20);
	const sunlight = scene.add.graphics();
	sunlight.fillStyle(16249315, .09);
	sunlight.fillEllipse(width * .28, height * .18, width * .9, height * .42);
	sunlight.setBlendMode("SCREEN");
	sunlight.setDepth(-15);
	const shade = scene.add.graphics();
	shade.fillStyle(1840658, .12);
	shade.fillRect(0, 0, width, 72);
	shade.fillRect(0, height - 96, width, 96);
	shade.setDepth(-14);
	return {
		width,
		height
	};
}
function followPlayer(scene, sprite, level) {
	const { width, height } = level.environment;
	scene.cameras.main.setBounds(0, 0, width, height);
	scene.cameras.main.startFollow(sprite, true, .12, .12);
	scene.cameras.main.setZoom(1.05);
	scene.cameras.main.fadeIn(250, 36, 92, 58);
}
var GameScene = class extends __webpack_exports__Scene {
	level;
	player;
	hazards = [];
	flowers = [];
	powerBlooms = [];
	blockers;
	exit = null;
	water;
	ended = false;
	bannerTimer;
	constructor() {
		super("game");
	}
	init(data) {
		const levelId = data.levelId ?? "level-1";
		this.level = getLevel(levelId);
		this.ended = false;
		this.hazards = [];
		this.flowers = [];
		this.powerBlooms = [];
		this.exit = null;
		clearPowerUps();
		applyLevelHud(this.level);
	}
	create() {
		attachInput();
		this.events.once("shutdown", () => this.cleanup());
		placeWorld(this, this.level);
		this.blockers = this.physics.add.staticGroup();
		placeObstacles(this, this.level, this.blockers);
		this.water = placeWater(this, this.level);
		placeBridges(this, this.level);
		this.flowers = placeCollectibles(this, this.level);
		this.powerBlooms = placePowerBlooms(this, this.level);
		this.hazards = placeHazards(this, this.level);
		this.exit = placeExit(this, this.level, this.blockers);
		this.player = createPlayer(this, this.level.playerSpawn.x, this.level.playerSpawn.y);
		this.player.sprite.setCollideWorldBounds(true);
		this.physics.add.collider(this.player.sprite, this.blockers);
		this.physics.add.collider(this.player.sprite, this.water.group);
		this.hazards.forEach((hazard) => {
			this.physics.add.collider(hazard.sprite, this.blockers);
			this.physics.add.collider(hazard.sprite, this.water.group);
			this.physics.add.overlap(hazard.sprite, this.player.sprite, () => this.hitPlayer());
		});
		this.flowers.forEach((flower) => {
			this.physics.add.overlap(this.player.sprite, flower, () => this.collectFlower(flower));
		});
		this.powerBlooms.forEach((bloom) => {
			this.physics.add.overlap(this.player.sprite, bloom, () => {
				collectPowerBloom(this, bloom, () => this.healPlayer());
			});
		});
		followPlayer(this, this.player.sprite, this.level);
		startMusic(this.level.music);
		setMusicPaused(false);
		this.wireControlsTest();
	}
	update(time, delta) {
		if (this.ended) return;
		if (getGameState().phase !== "playing") {
			this.player.sprite.setVelocity(0, 0);
			return;
		}
		const deltaSec = delta > 0 ? delta / 1e3 : .016;
		const { speedMultiplier, isFrozen } = updatePowerUps(deltaSec);
		updateActions();
		updatePlayer(this.player, this.level.playerSpeed * speedMultiplier);
		const px = this.player.sprite.x;
		const py = this.player.sprite.y;
		updateHazards(this.hazards, px, py, deltaSec, isFrozen);
		updateWater(this.water, this.time.now);
		const nearby = findNearbyCollectible(this.flowers, px, py);
		if (nearby) this.collectFlower(nearby);
		if (!isFrozen && hazardTouches(this.hazards, px, py)) this.hitPlayer();
		this.checkExit(px, py);
	}
	healPlayer() {
		const current = getGameState();
		if (current.hearts < current.heartsMax) {
			patchGameState({ hearts: Math.min(current.heartsMax, current.hearts + 1) });
			this.cameras.main.flash(120, 100, 240, 120);
			this.flashBanner("Heart restored! 💚", 1800);
		}
	}
	checkExit(px, py) {
		if (!this.exit || this.ended) return;
		const status = exitStatus(this.exit, px, py);
		if (status === "locked") {
			if (shouldHintLocked(this.exit, this.time.now)) this.flashBanner(lockedExitHint(this.exit.lockedHint), 2200);
			return;
		}
		if (status === "open" && this.level.completeOn === "reach-exit") this.finish("won");
	}
	flashBanner(text, ms) {
		showBanner(text);
		this.bannerTimer?.remove(false);
		this.bannerTimer = this.time.delayedCall(ms, () => {
			if (getGameState().banner === text) clearBanner();
		});
	}
	collectFlower(flower) {
		if (!flower.active || this.ended) return;
		const glow = flower.getData("glow");
		flower.disableBody(true, false);
		playPlayerAction(this.player, "collect", 420);
		this.tweens.add({
			targets: this.player.sprite,
			scaleX: this.player.sprite.scaleX * 1.08,
			scaleY: this.player.sprite.scaleY * 1.08,
			duration: 120,
			yoyo: true
		});
		this.tweens.killTweensOf(flower);
		if (glow) this.tweens.killTweensOf(glow);
		this.tweens.add({
			targets: flower,
			scale: flower.scale * 1.35,
			alpha: 0,
			y: flower.y - 24,
			duration: 220,
			onComplete: () => flower.destroy()
		});
		if (glow) this.tweens.add({
			targets: glow,
			scale: glow.scale * 1.5,
			alpha: 0,
			y: glow.y - 20,
			duration: 260,
			onComplete: () => glow.destroy()
		});
		const burst = this.add.particles(flower.x, flower.y, "spark", {
			speed: {
				min: 40,
				max: 90
			},
			lifespan: 380,
			scale: {
				start: .8,
				end: 0
			},
			tint: [
				14723386,
				16249315,
				14900586
			],
			quantity: 10,
			emitting: false
		});
		burst.explode(10);
		this.time.delayedCall(420, () => burst.destroy());
		sfxCollect();
		const kind = String(flower.getData("kind") ?? "");
		const { met } = noteCollected(this.level, kind);
		if (syncExitLock(this, this.exit, this.blockers) && this.exit) {
			sfxUnlock();
			this.cameras.main.flash(140, 183, 227, 161);
			const burst = this.add.particles(this.exit.sprite.x, this.exit.sprite.y - 40, "spark", {
				speed: {
					min: 50,
					max: 110
				},
				lifespan: 520,
				scale: {
					start: .9,
					end: 0
				},
				tint: [
					14723386,
					12051361,
					16249315
				],
				quantity: 16,
				emitting: false
			});
			burst.explode(16);
			this.time.delayedCall(560, () => burst.destroy());
			this.flashBanner(this.exit.unlockedHint, 2800);
		}
		if (met && this.level.completeOn === "collect-all") this.finish("won");
	}
	hitPlayer() {
		if (this.ended) return;
		const now = this.time.now;
		if (now < this.player.invincibleUntil) return;
		this.player.invincibleUntil = now + 1400;
		playPlayerAction(this.player, "hurt", 480);
		this.cameras.main.shake(160, .01);
		this.cameras.main.flash(80, 227, 93, 106);
		sfxHurt();
		const { dead } = loseHeart();
		this.tweens.add({
			targets: this.player.sprite,
			alpha: .25,
			duration: 90,
			yoyo: true,
			repeat: 7,
			onComplete: () => this.player.sprite.setAlpha(1)
		});
		if (dead) this.finish("lost");
	}
	finish(result) {
		if (this.ended) return;
		this.ended = true;
		this.player.sprite.setVelocity(0, 0);
		setJoystick(0, 0);
		setKeyOverride(null);
		stopHazards(this.hazards);
		clearBanner();
		setMusicPaused(true);
		if (result === "won") {
			playPlayerAction(this.player, "win", 8e3);
			sfxWin();
			this.cameras.main.flash(180, 247, 241, 227);
		} else {
			playPlayerAction(this.player, "hurt", 8e3);
			sfxLose();
		}
		patchGameState({ phase: result });
	}
	wireControlsTest() {
		const scene = this;
		window.__controlsTest = {
			getX: () => scene.player?.sprite.x ?? 0,
			getY: () => scene.player?.sprite.y ?? 0,
			getVx: () => scene.player?.sprite.body?.velocity.x ?? 0,
			getVy: () => scene.player?.sprite.body?.velocity.y ?? 0,
			setKeys: (codes) => setKeyOverride(codes.length ? codes : null),
			setJoystick: (x, y) => setJoystick(x, y),
			setPosition: (x, y) => {
				scene.player.sprite.setPosition(x, y);
				scene.player.sprite.body?.reset(x, y);
			},
			flowerCount: () => flowersRemaining(scene.flowers),
			getHearts: () => getGameState().hearts,
			getCollected: () => getGameState().flowersCollected,
			getHazards: () => hazardPositions(scene.hazards),
			getLevelId: () => scene.level?.id,
			getSubtitle: () => getGameState().levelSubtitle,
			getBanner: () => getGameState().banner,
			isGateUnlocked: () => !scene.exit || !scene.exit.locked,
			getExit: () => scene.exit ? {
				x: scene.exit.sprite.x,
				y: scene.exit.sprite.y,
				locked: scene.exit.locked
			} : null,
			getPhase: () => getGameState().phase,
			getWater: () => scene.level.water ?? [],
			getBridges: () => scene.level.bridges ?? [],
			getObjectives: () => getGameState().objectives,
			getWalls: () => scene.level.walls
		};
	}
	cleanup() {
		this.hazards = [];
		this.flowers = [];
		this.powerBlooms = [];
		clearPowerUps();
		this.exit = null;
		this.bannerTimer?.remove(false);
		detachInput();
		if (window.__controlsTest) delete window.__controlsTest;
	}
};
var PreloadScene = class extends __webpack_exports__Scene {
	constructor() {
		super("preload");
	}
	preload() {
		this.load.on("progress", (value) => {
			patchGameState({ loadProgress: value });
		});
		this.load.spritesheet("player", "/game/sprites/player.png", {
			frameWidth: 96,
			frameHeight: 96
		});
		this.load.spritesheet("player-actions", "/game/sprites/player-actions.png", {
			frameWidth: 96,
			frameHeight: 96
		});
		this.load.spritesheet("beetle", "/game/sprites/beetle-walk.png", {
			frameWidth: 128,
			frameHeight: 128
		});
		this.load.image("daisy", "/game/sprites/daisy.png");
		this.load.image("tulip", "/game/sprites/tulip.png");
		this.load.image("rose", "/game/sprites/rose.png");
		this.load.image("sunflower", "/game/sprites/sunflower.png");
		this.load.image("bluebell", "/game/sprites/bluebell.png");
		this.load.image("tree", "/game/sprites/tree.png");
		this.load.image("bush", "/game/sprites/bush.png");
		this.load.image("rock", "/game/sprites/rock.png");
		this.load.image("stump", "/game/sprites/stump.png");
		this.load.image("pot", "/game/sprites/pot.png");
		this.load.image("arch", "/game/sprites/arch.png");
		this.load.image("heart", "/game/sprites/heart.png");
		this.load.image("gate-locked", "/game/sprites/gate-locked.png");
		this.load.image("gate-open", "/game/sprites/gate-open.png");
		this.load.image("bridge", "/game/sprites/bridge.png");
		this.load.image("water", "/game/sprites/water.png");
		for (const level of LEVELS) this.load.image(level.environment.mapKey, level.environment.mapUrl);
	}
	create() {
		const walk = (key, start, end) => {
			if (this.anims.exists(key)) return;
			this.anims.create({
				key,
				frames: this.anims.generateFrameNumbers("player", {
					start,
					end
				}),
				frameRate: 8,
				repeat: -1
			});
		};
		walk("walk-down", 0, 3);
		walk("walk-left", 4, 7);
		walk("walk-right", 8, 11);
		walk("walk-up", 12, 15);
		if (!this.anims.exists("beetle-walk")) this.anims.create({
			key: "beetle-walk",
			frames: this.anims.generateFrameNumbers("beetle", {
				start: 0,
				end: 3
			}),
			frameRate: 10,
			repeat: -1
		});
		const spark = this.add.graphics();
		spark.fillStyle(16777215, 1);
		spark.fillCircle(4, 4, 4);
		spark.generateTexture("spark", 8, 8);
		spark.destroy();
		generateProceduralTextures(this);
		patchGameState({
			assetsReady: true,
			loadProgress: 1,
			phase: "menu"
		});
		this.scene.start("wait");
	}
};
function generateProceduralTextures(scene) {
	const alertG = scene.add.graphics();
	alertG.fillStyle(16726832, .95);
	alertG.fillCircle(16, 16, 14);
	alertG.lineStyle(2, 16777215, 1);
	alertG.strokeCircle(16, 16, 14);
	alertG.fillStyle(16777215, 1);
	alertG.fillRoundedRect(14, 7, 4, 10, 2);
	alertG.fillCircle(16, 21, 2.2);
	alertG.generateTexture("alert-emote", 32, 32);
	alertG.destroy();
	const beeG = scene.add.graphics();
	beeG.fillStyle(13691135, .75);
	beeG.fillEllipse(18, 14, 12, 6);
	beeG.fillEllipse(30, 14, 12, 6);
	beeG.fillStyle(16498733, 1);
	beeG.fillEllipse(24, 24, 16, 22);
	beeG.fillStyle(2171169, 1);
	beeG.fillRect(16, 17, 16, 4);
	beeG.fillRect(16, 24, 16, 4);
	beeG.fillStyle(0, 1);
	beeG.fillCircle(20, 15, 2);
	beeG.fillCircle(28, 15, 2);
	beeG.fillStyle(2171169, 1);
	beeG.fillTriangle(21, 33, 27, 33, 24, 39);
	beeG.generateTexture("bee-sprite", 48, 48);
	beeG.destroy();
	const waspG = scene.add.graphics();
	waspG.fillStyle(13362167, .8);
	waspG.fillEllipse(16, 12, 14, 5);
	waspG.fillEllipse(32, 12, 14, 5);
	waspG.fillStyle(15094016, 1);
	waspG.fillEllipse(24, 24, 14, 24);
	waspG.fillStyle(1706501, 1);
	waspG.fillRect(18, 16, 12, 3);
	waspG.fillRect(17, 22, 14, 3);
	waspG.fillRect(18, 28, 12, 3);
	waspG.fillStyle(1706501, 1);
	waspG.fillTriangle(21, 34, 27, 34, 24, 43);
	waspG.generateTexture("wasp-sprite", 48, 48);
	waspG.destroy();
	const swiftG = scene.add.graphics();
	swiftG.fillStyle(16766287, .3);
	swiftG.fillCircle(20, 20, 18);
	swiftG.fillStyle(16763432, 1);
	swiftG.fillCircle(20, 20, 12);
	swiftG.fillStyle(16777215, 1);
	swiftG.fillTriangle(20, 6, 17, 18, 23, 18);
	swiftG.fillTriangle(20, 34, 17, 22, 23, 22);
	swiftG.fillTriangle(6, 20, 18, 17, 18, 23);
	swiftG.fillTriangle(34, 20, 22, 17, 22, 23);
	swiftG.fillCircle(20, 20, 4);
	swiftG.generateTexture("power-swift", 40, 40);
	swiftG.destroy();
	const frostG = scene.add.graphics();
	frostG.fillStyle(5227511, .35);
	frostG.fillCircle(20, 20, 18);
	frostG.fillStyle(166097, 1);
	frostG.fillCircle(20, 20, 12);
	frostG.fillStyle(14808574, 1);
	frostG.fillTriangle(20, 8, 12, 20, 28, 20);
	frostG.fillTriangle(20, 32, 12, 20, 28, 20);
	frostG.lineStyle(1.5, 16777215, .9);
	frostG.strokeCircle(20, 20, 12);
	frostG.generateTexture("power-frost", 40, 40);
	frostG.destroy();
	const heartG = scene.add.graphics();
	heartG.fillStyle(6732650, .35);
	heartG.fillCircle(20, 20, 18);
	heartG.fillStyle(3046706, 1);
	heartG.fillCircle(20, 20, 12);
	heartG.fillStyle(8505220, 1);
	heartG.fillEllipse(20, 20, 10, 16);
	heartG.fillStyle(16777215, .9);
	heartG.fillCircle(20, 17, 3);
	heartG.generateTexture("power-heart", 40, 40);
	heartG.destroy();
}
/** Quiet garden backdrop while the start overlay is showing. */
var WaitScene = class extends __webpack_exports__Scene {
	constructor() {
		super("wait");
	}
	create() {
		const mapKey = LEVELS[0].environment.mapKey;
		const map = this.add.image(360, GAME_HEIGHT / 2, mapKey);
		const scale = Math.max(720 / map.width, GAME_HEIGHT / map.height);
		map.setScale(scale * 1.08);
		map.setAlpha(.95);
	}
};
function createFlowerQuest(parent) {
	const game = new __webpack_exports__Game({
		type: __webpack_exports__AUTO,
		parent,
		width: 720,
		height: GAME_HEIGHT,
		backgroundColor: "#245c3a",
		physics: {
			default: "arcade",
			arcade: {
				gravity: {
					x: 0,
					y: 0
				},
				debug: false
			}
		},
		scale: {
			mode: __webpack_exports__Scale.FIT,
			autoCenter: __webpack_exports__Scale.CENTER_BOTH,
			width: 720,
			height: GAME_HEIGHT
		},
		render: {
			antialias: true,
			roundPixels: true
		},
		input: { activePointers: 3 },
		scene: [
			BootScene,
			PreloadScene,
			WaitScene,
			GameScene
		]
	});
	let lastLevel = "level-1";
	const api = {
		startLevel(levelId) {
			lastLevel = levelId;
			setJoystick(0, 0);
			setKeyOverride(null);
			attachInput();
			if (game.scene.isActive("game") || game.scene.isPaused("game")) game.scene.stop("game");
			game.scene.stop("wait");
			game.scene.start("game", { levelId });
		},
		pause() {
			if (!game.scene.isActive("game")) return;
			setJoystick(0, 0);
			setKeyOverride(null);
			game.scene.pause("game");
			setMusicPaused(true);
			patchGameState({ phase: "paused" });
		},
		resume() {
			if (getGameState().phase !== "paused") return;
			game.scene.resume("game");
			setMusicPaused(false);
			patchGameState({ phase: "playing" });
		},
		restart() {
			api.startLevel(lastLevel);
		},
		quitToMenu() {
			setJoystick(0, 0);
			if (game.scene.isActive("game") || game.scene.isPaused("game")) game.scene.stop("game");
			game.scene.run("wait");
			startMusic("title");
			const menu = LEVELS[0];
			patchGameState({
				phase: "menu",
				banner: null,
				levelId: menu.id,
				levelNumber: menu.number,
				levelName: menu.name,
				levelSubtitle: menu.objectiveText,
				collectibleLabel: menu.collectibleLabel,
				collectibleIcon: menu.collectibleIcon
			});
		},
		destroy() {
			detachInput();
			stopMusic();
			game.destroy(true);
		}
	};
	return api;
}
//#endregion
export { createFlowerQuest };
