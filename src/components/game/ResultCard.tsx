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
    <div className="absolute inset-0 z-30 grid place-items-center bg-soil/50 px-6 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-3xl bg-cream px-6 py-8 text-center text-ink shadow-[0_12px_0_#3a271c]">
        <p className="font-display text-xs tracking-[0.22em] text-leaf uppercase">
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
              className="w-full rounded-full bg-leaf px-5 py-3 font-bold text-cream shadow-[0_5px_0_#245c3a]"
            >
              Continue to {next.name}
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
                ? "w-full rounded-full bg-blush px-5 py-3 font-bold text-ink"
                : "w-full rounded-full bg-petal px-5 py-3 font-bold text-cream shadow-[0_5px_0_#9a3140]"
            }
          >
            {won ? "Play again" : "Try again"}
          </button>
          <button
            type="button"
            onClick={onMenu}
            className="w-full rounded-full bg-blush px-5 py-3 font-bold text-ink"
          >
            {demoDone ? "Title screen" : "Garden gate"}
          </button>
        </div>
      </div>
    </div>
  );
}
