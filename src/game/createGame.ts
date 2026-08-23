import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "./config";
import { setMusicPaused, startMusic, stopMusic } from "./audio";
import { attachInput, detachInput, setKeyOverride, setJoystick } from "./input";
import { LEVELS } from "./levels";
import { BootScene } from "./scenes/BootScene";
import { GameScene } from "./scenes/GameScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { WaitScene } from "./scenes/WaitScene";
import { getGameState, patchGameState } from "./state";

export type GameApi = {
  startLevel: (levelId: string) => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  quitToMenu: () => void;
  destroy: () => void;
};

let current: GameApi | null = null;

export function getGameApi() {
  return current;
}

export function createFlowerQuest(parent: HTMLElement): GameApi {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#245c3a",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    render: {
      antialias: true,
      roundPixels: true,
    },
    input: {
      activePointers: 3,
    },
    scene: [BootScene, PreloadScene, WaitScene, GameScene],
  });

  let lastLevel = "level-1";

  const api: GameApi = {
    startLevel(levelId: string) {
      lastLevel = levelId;
      setJoystick(0, 0);
      setKeyOverride(null);
      attachInput();
      if (game.scene.isActive("game") || game.scene.isPaused("game")) {
        game.scene.stop("game");
      }
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
      if (game.scene.isActive("game") || game.scene.isPaused("game")) {
        game.scene.stop("game");
      }
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
        collectibleIcon: menu.collectibleIcon,
      });
    },
    destroy() {
      detachInput();
      stopMusic();
      current = null;
      game.destroy(true);
    },
  };

  current = api;
  return api;
}
