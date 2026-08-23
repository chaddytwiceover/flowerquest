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
    <div className="absolute inset-0 z-30 grid place-items-center bg-soil/55 px-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-cream px-6 py-7 text-center text-ink shadow-[0_12px_0_#3a271c]">
        <p className="font-display text-xs tracking-[0.22em] text-leaf uppercase">Paused</p>
        <h2 className="mt-1 font-display text-3xl font-semibold">Take a breath</h2>
        <div className="mt-4 flex justify-center">
          <MuteButton className="bg-soil/80" />
        </div>
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onResume}
            className="w-full rounded-full bg-leaf px-5 py-3 font-bold text-cream shadow-[0_5px_0_#245c3a]"
          >
            Keep wandering
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="w-full rounded-full bg-gold px-5 py-3 font-bold text-ink shadow-[0_5px_0_#b07d1c]"
          >
            Restart Level {levelNumber}
          </button>
          <button
            type="button"
            onClick={onMenu}
            className="w-full rounded-full bg-blush px-5 py-3 font-bold text-ink"
          >
            Garden gate
          </button>
        </div>
      </div>
    </div>
  );
}
