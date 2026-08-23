import { Pause } from "lucide-react";
import { useGameState } from "./useGameState";
import { VirtualJoystick } from "./VirtualJoystick";
import { MuteButton } from "./MuteButton";

type Props = {
  onPause: () => void;
};

export function HudOverlay({ onPause }: Props) {
  const { hearts, heartsMax, levelName, levelSubtitle, phase, banner, gateUnlocked, objectives } =
    useGameState();
  const required = objectives.reduce((sum, obj) => sum + obj.required, 0);
  const collected = objectives.reduce((sum, obj) => sum + obj.collected, 0);
  const progress = required > 0 ? Math.min(100, Math.round((collected / required) * 100)) : 0;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="flex items-start justify-between gap-3 px-3 pt-4">
        <div className="w-[min(74vw,18rem)] rounded-2xl bg-soil/60 px-3 py-2.5 shadow-[0_10px_24px_rgb(0_0_0_/_0.22)] ring-1 ring-cream/15 backdrop-blur-md">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-display text-[11px] tracking-[0.18em] text-gold uppercase">{levelName}</p>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-cream/85">{levelSubtitle}</p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              {Array.from({ length: heartsMax }).map((_, i) => (
                <img
                  key={i}
                  src="/game/sprites/heart.png"
                  alt=""
                  className={`h-6 w-6 object-contain drop-shadow ${i < hearts ? "opacity-100" : "opacity-25 grayscale"}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream/18 ring-1 ring-soil/30">
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {objectives.map((obj) => {
              const done = obj.collected >= obj.required;
              return (
                <div
                  key={obj.collectible + obj.label}
                  className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-extrabold ring-1 ${
                    done
                      ? "bg-gold text-ink ring-gold/80"
                      : "bg-cream/12 text-cream ring-cream/15"
                  }`}
                >
                  <img src={`/game/sprites/${obj.icon}.png`} alt="" className="h-5 w-5 object-contain" />
                  <span>
                    {obj.label ? `${obj.label} ` : ""}
                    {obj.collected}/{obj.required}
                  </span>
                </div>
              );
            })}
          </div>
          {gateUnlocked && (
            <p className="mt-2 rounded-full bg-leaf/80 px-2 py-1 text-center font-display text-[10px] tracking-[0.16em] text-cream uppercase ring-1 ring-cream/20">
              Gate open
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={onPause}
            className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-soil/70 text-lg font-bold text-cream shadow-[0_8px_18px_rgb(0_0_0_/_0.22)] ring-1 ring-cream/15 backdrop-blur-sm transition-transform active:scale-95"
            aria-label="Pause"
          >
            <Pause className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <MuteButton />
        </div>
      </div>

      {banner && (
        <div className="absolute inset-x-4 top-32 flex justify-center">
          <p className="rounded-full bg-cream px-4 py-2 text-center text-sm font-extrabold text-ink shadow-[0_5px_0_#3a271c] ring-1 ring-soil/20">
            {banner}
          </p>
        </div>
      )}

      {phase === "playing" && (
        <div className="pointer-events-auto absolute bottom-6 left-4">
          <VirtualJoystick />
        </div>
      )}
    </div>
  );
}
