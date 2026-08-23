import { ArrowRight, Home, RotateCcw, Trophy } from "lucide-react";
import { getLevel, getNextLevel } from "@/game/levels";
import { useGameState } from "./useGameState";

type Props = {
  onRestart: () => void;
  onMenu: () => void;
  onContinue?: (levelId: string) => void;
};

function fill(template: string, collected: number, needed: number) {
  return template
    .replaceAll("{collected}", String(collected))
    .replaceAll("{needed}", String(needed));
}

export function ResultCard({ onRestart, onMenu, onContinue }: Props) {
  const { phase, flowersCollected, flowersNeeded, levelId } = useGameState();
  const level = getLevel(levelId);
  const next = getNextLevel(levelId);
  const won = phase === "won";
  const demoDone = won && !next;
  const copy = level.completion;

  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-soil/55 px-6 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-[1.5rem] bg-cream px-6 py-8 text-center text-ink shadow-[0_14px_0_#3a271c] ring-1 ring-soil/15">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold text-ink shadow-[0_5px_0_#b07d1c]">
          <Trophy className="h-7 w-7" />
        </div>
        <p className="mt-5 font-display text-xs tracking-[0.22em] text-leaf uppercase">
          {demoDone ? "Flower Quest" : won ? copy.winKicker : copy.loseKicker}
        </p>
        <h2 className="mt-1 font-display text-3xl font-semibold">
          {demoDone ? "Lite Demo complete" : won ? copy.winTitle : copy.loseTitle}
        </h2>
        <p className="mt-3 text-soil/80">
          {demoDone
            ? "You helped Monnie make it through all five gardens!"
            : fill(won ? copy.winBody : copy.loseBody, flowersCollected, flowersNeeded)}
        </p>
        <div className="mt-6 space-y-3">
          {won && next && onContinue && (
            <button
              type="button"
              onClick={() => onContinue(next.id)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-leaf px-5 py-3 font-bold text-cream shadow-[0_5px_0_#245c3a] transition-transform active:translate-y-1 active:shadow-[0_2px_0_#245c3a]"
            >
              <span>Continue to {next.name}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (demoDone && onContinue) onContinue("level-1");
              else onRestart();
            }}
            className={
              won && next
                ? "flex w-full items-center justify-center gap-2 rounded-full bg-blush px-5 py-3 font-bold text-ink ring-1 ring-soil/10"
                : "flex w-full items-center justify-center gap-2 rounded-full bg-petal px-5 py-3 font-bold text-cream shadow-[0_5px_0_#9a3140] transition-transform active:translate-y-1 active:shadow-[0_2px_0_#9a3140]"
            }
          >
            <RotateCcw className="h-5 w-5" />
            <span>{won ? "Play again" : "Try again"}</span>
          </button>
          <button
            type="button"
            onClick={onMenu}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-blush px-5 py-3 font-bold text-ink ring-1 ring-soil/10 transition-colors hover:bg-[#f0c6ae]"
          >
            <Home className="h-5 w-5" />
            <span>{demoDone ? "Title screen" : "Garden gate"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
