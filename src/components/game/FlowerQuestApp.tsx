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
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_25%_10%,#4f8f5c_0,#245c3a_28%,#3a271c_74%)] px-0 py-0 text-cream sm:px-6 sm:py-5">
      <div className="pointer-events-none absolute inset-0 opacity-55 [background-image:linear-gradient(120deg,rgb(247_241_227_/_0.10)_1px,transparent_1px),linear-gradient(300deg,rgb(224_169_58_/_0.10)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -left-20 top-16 hidden h-80 w-80 rounded-full border border-cream/15 sm:block" />
      <div className="pointer-events-none absolute -right-24 bottom-10 hidden h-96 w-96 rounded-full border border-gold/20 sm:block" />

      <div className="relative h-[100dvh] w-full max-w-[430px] sm:h-[calc(100dvh-2.5rem)] sm:max-h-[900px]">
        <div className="pointer-events-none absolute -inset-2 hidden rounded-[2rem] bg-cream/10 shadow-[0_24px_80px_rgb(0_0_0_/_0.35)] sm:block" />
        <div className="game-shell relative h-full w-full overflow-hidden bg-moss shadow-[0_18px_70px_rgb(0_0_0_/_0.34)] sm:rounded-[1.65rem] sm:ring-1 sm:ring-cream/25">
          <PhaserCanvas onReady={onReady} />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgb(28_22_18_/_0.12),transparent_16%,transparent_72%,rgb(28_22_18_/_0.20))]" />
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
      </div>
    </main>
  );
}
