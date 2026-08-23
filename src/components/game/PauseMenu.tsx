import { Home, RotateCcw, Sprout } from "lucide-react";
import { useGameState } from "./useGameState";
import { MuteButton } from "./MuteButton";

type Props = {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
};

export function PauseMenu({ onResume, onRestart, onMenu }: Props) {
  const { levelNumber } = useGameState();

  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-soil/60 px-6 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-[1.5rem] bg-cream px-6 py-7 text-center text-ink shadow-[0_14px_0_#3a271c] ring-1 ring-soil/15">
        <p className="font-display text-xs tracking-[0.22em] text-leaf uppercase">Paused</p>
        <h2 className="mt-1 font-display text-3xl font-semibold">Take a breath</h2>
        <p className="mx-auto mt-2 max-w-[17rem] text-sm font-semibold text-soil/70">
          Monnie will wait right here while you check the garden map.
        </p>
        <div className="mt-4 flex justify-center">
          <MuteButton className="bg-soil/80 ring-1 ring-soil/15" />
        </div>
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onResume}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-leaf px-5 py-3 font-bold text-cream shadow-[0_5px_0_#245c3a] transition-transform active:translate-y-1 active:shadow-[0_2px_0_#245c3a]"
          >
            <Sprout className="h-5 w-5" />
            <span>Keep wandering</span>
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-bold text-ink shadow-[0_5px_0_#b07d1c] transition-transform active:translate-y-1 active:shadow-[0_2px_0_#b07d1c]"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Restart Level {levelNumber}</span>
          </button>
          <button
            type="button"
            onClick={onMenu}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-blush px-5 py-3 font-bold text-ink ring-1 ring-soil/10 transition-colors hover:bg-[#f0c6ae]"
          >
            <Home className="h-5 w-5" />
            <span>Garden gate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
