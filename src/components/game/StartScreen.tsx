import { Link } from "@tanstack/react-router";
import { Play, Sparkles } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { unlockAudio, startMusic } from "@/game/audio";
import { useGameState } from "./useGameState";
import { MuteButton } from "./MuteButton";

type Props = {
  onPlay: () => void;
};

export function StartScreen({ onPlay }: Props) {
  const { assetsReady, loadProgress, levelName, levelSubtitle } = useGameState();
  const { isPending } = useCurrentUserState();
  const progress = Math.round(loadProgress * 100);

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden text-cream"
      onPointerDown={() => {
        unlockAudio();
        startMusic("title");
      }}
    >
      <img src="/game/title-hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-soil/30 via-moss/60 to-soil/95" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(to_top,rgb(58_39_28_/_0.78),transparent)]" />

      <header className="relative z-10 flex items-center justify-between px-4 pt-5">
        <div>
          <p className="font-display text-xs tracking-[0.22em] text-gold uppercase">Flower Quest</p>
          <p className="mt-1 text-[11px] font-extrabold uppercase text-cream/70">Five handcrafted gardens</p>
        </div>
        <div className="flex min-h-8 items-center gap-2">
          <MuteButton className="bg-soil/50 ring-1 ring-cream/20" />
          {isPending ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-cream/20" />
          ) : (
            <>
              <SignedIn>
                <div className="rounded-full bg-soil/50 px-2 py-1 ring-1 ring-cream/20 backdrop-blur-sm">
                  <UserButton />
                </div>
              </SignedIn>
              <SignedOut>
                <Link
                  to="/login"
                  className="rounded-full bg-cream/15 px-3 py-2 text-sm font-bold text-cream ring-1 ring-cream/20 backdrop-blur-sm transition-colors hover:bg-cream/25"
                >
                  Sign in
                </Link>
              </SignedOut>
            </>
          )}
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center py-2">
        <div className="relative">
          <div className="absolute inset-x-7 bottom-3 h-8 rounded-full bg-soil/50 blur-md" />
          <div className="absolute -inset-8 rounded-full bg-gold/15 blur-2xl" />
          <img
            src="/game/sprites/monnie.png"
            alt="Monnie"
            className="monnie-bob relative z-10 h-56 w-auto drop-shadow-[0_18px_26px_rgb(28_22_18_/_0.38)]"
          />
        </div>
      </div>

      <div className="relative z-10 px-6 pb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-cream/12 px-3 py-1 text-xs font-extrabold text-cream/85 ring-1 ring-cream/20 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          <span>{levelName}</span>
        </div>
        <h1 className="mt-3 font-display text-5xl font-semibold leading-none text-cream drop-shadow-[0_4px_0_#3a271c]">
          Monnie's
          <br />
          Flower Quest
        </h1>
        <p className="mt-4 max-w-[21rem] text-base leading-relaxed text-cream/90">
          {levelSubtitle} Collect each bloom, slip past the patrols, and open the garden gate.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2 text-center text-[11px] font-extrabold uppercase text-cream/85">
          <div className="rounded-2xl bg-soil/45 px-3 py-2 ring-1 ring-cream/15 backdrop-blur-sm">WASD / arrows</div>
          <div className="rounded-2xl bg-soil/45 px-3 py-2 ring-1 ring-cream/15 backdrop-blur-sm">Touch friendly</div>
        </div>

        <button
          type="button"
          disabled={!assetsReady}
          onClick={onPlay}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-petal px-6 py-4 font-display text-xl font-semibold text-cream shadow-[0_8px_0_#9a3140] transition duration-150 ease-out hover:translate-y-[-1px] active:not-disabled:translate-y-1 active:not-disabled:shadow-[0_4px_0_#9a3140] disabled:opacity-60"
        >
          {assetsReady ? (
            <>
              <Play className="h-5 w-5 fill-current" />
              <span>Play as Monnie</span>
            </>
          ) : (
            <span>Sprouting... {progress}%</span>
          )}
        </button>
      </div>
    </div>
  );
}
