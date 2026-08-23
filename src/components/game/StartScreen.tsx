import { Link } from "@tanstack/react-router";
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

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden text-cream"
      onPointerDown={() => {
        unlockAudio();
        startMusic("title");
      }}
    >
      <img src="/game/title-hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-soil/40 via-moss/70 to-soil/90" />

      <header className="relative z-10 flex items-center justify-between px-4 pt-5">
        <p className="font-display text-xs tracking-[0.22em] text-gold uppercase">Level 1</p>
        <div className="flex items-center gap-2 min-h-8">
          <MuteButton className="bg-soil/50" />
          {isPending ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-cream/20" />
          ) : (
            <>
              <SignedIn>
                <div className="rounded-full bg-soil/50 px-2 py-1 backdrop-blur-sm">
                  <UserButton />
                </div>
              </SignedIn>
              <SignedOut>
                <Link
                  to="/login"
                  className="rounded-full bg-cream/15 px-3 py-2 text-sm font-bold text-cream backdrop-blur-sm"
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
          <div className="absolute inset-x-8 bottom-2 h-8 rounded-full bg-soil/50 blur-md" />
          <img
            src="/game/sprites/monnie.png"
            alt="Monnie"
            className="monnie-bob relative z-10 h-56 w-auto"
          />
        </div>
      </div>

      <div className="relative z-10 px-6 pb-10">
        <p className="font-display text-sm tracking-[0.28em] text-gold uppercase">A garden adventure</p>
        <h1 className="mt-1 font-display text-5xl font-semibold leading-none text-cream drop-shadow-[0_4px_0_#3a271c]">
          Monnie's
          <br />
          Flower Quest
        </h1>
        <p className="mt-4 max-w-[20rem] text-base leading-relaxed text-cream/90">
          {levelName}. {levelSubtitle}
        </p>
        <ul className="mt-4 space-y-1 text-sm text-cream/80">
          <li>Walk with the stick, or WASD / arrows.</li>
          <li>Pick every flower. Dodge the beetles.</li>
        </ul>

        <button
          type="button"
          disabled={!assetsReady}
          onClick={onPlay}
          className="mt-7 w-full rounded-full bg-petal px-6 py-4 font-display text-xl font-semibold text-cream shadow-[0_8px_0_#9a3140] transition-transform duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-60"
        >
          {assetsReady ? "Play as Monnie" : `Sprouting… ${Math.round(loadProgress * 100)}%`}
        </button>
      </div>
    </div>
  );
}
