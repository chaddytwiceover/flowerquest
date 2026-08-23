import { useCallback, useEffect, useRef } from "react";
import type { GameApi } from "@/game/createGame";
import { unlockAudio } from "@/game/audio";
import { HudOverlay } from "./HudOverlay";
import { PauseMenu } from "./PauseMenu";
import { PhaserCanvas } from "./PhaserCanvas";
import { ResultCard } from "./ResultCard";
import { StartScreen } from "./StartScreen";
import { useGameState } from "./useGameState";

export function FlowerQuestApp() {
  const apiRef = useRef<GameApi | null>(null);
  const { phase } = useGameState();

  const onReady = useCallback((api: GameApi) => {
    apiRef.current = api;
  }, []);

  useEffect(() => {
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

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-soil">
      <div className="game-shell relative h-[100dvh] w-full max-w-[430px] overflow-hidden bg-moss">
        <PhaserCanvas onReady={onReady} />
        {(phase === "boot" || phase === "menu") && <StartScreen onPlay={play} />}
        {(phase === "playing" || phase === "paused") && (
          <HudOverlay onPause={() => apiRef.current?.pause()} />
        )}
        {phase === "paused" && (
          <PauseMenu
            onResume={() => apiRef.current?.resume()}
            onRestart={() => {
              unlockAudio();
              apiRef.current?.restart();
            }}
            onMenu={() => apiRef.current?.quitToMenu()}
          />
        )}
        {(phase === "won" || phase === "lost") && (
          <ResultCard
            onRestart={() => {
              unlockAudio();
              apiRef.current?.restart();
            }}
            onMenu={() => apiRef.current?.quitToMenu()}
            onContinue={(levelId) => {
              unlockAudio();
              apiRef.current?.startLevel(levelId);
            }}
          />
        )}
      </div>
    </main>
  );
}
