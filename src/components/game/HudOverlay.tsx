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

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="flex items-start justify-between px-3 pt-4">
        <div className="rounded-2xl bg-soil/55 px-3 py-2 backdrop-blur-sm">
          <p className="font-display text-[11px] tracking-[0.18em] text-gold uppercase">{levelName}</p>
          <p className="mt-0.5 max-w-[12rem] text-[11px] leading-tight text-cream/85">{levelSubtitle}</p>
          <div className="mt-1 flex items-center gap-1">
            {Array.from({ length: heartsMax }).map((_, i) => (
              <img
                key={i}
                src="/game/sprites/heart.png"
                alt=""
                className={`h-7 w-7 object-contain ${i < hearts ? "opacity-100" : "opacity-25"}`}
              />
            ))}
          </div>
          <div className="mt-1 space-y-0.5">
            {objectives.map((obj) => {
              const done = obj.collected >= obj.required;
              return (
                <div
                  key={obj.collectible + obj.label}
                  className={`flex items-center gap-2 text-sm font-bold ${done ? "text-gold" : ""}`}
                >
                  <img src={`/game/sprites/${obj.icon}.png`} alt="" className="h-6 w-6 object-contain" />
                  <span>
                    {obj.label ? (
                      <span className="mr-1 font-display text-[10px] tracking-[0.16em] uppercase">
                        {obj.label}
                      </span>
                    ) : null}
                    {obj.collected}/{obj.required}
                  </span>
                </div>
              );
            })}
          </div>
          {gateUnlocked && (
            <p className="mt-1 font-display text-[10px] tracking-[0.16em] text-gold uppercase">Gate open</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={onPause}
            className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-soil/70 text-lg font-bold text-cream backdrop-blur-sm"
            aria-label="Pause"
          >
            <Pause className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <MuteButton />
        </div>
      </div>

      {banner && (
        <div className="absolute inset-x-4 top-28 flex justify-center">
          <p className="rounded-full bg-cream px-4 py-2 text-center text-sm font-bold text-ink shadow-[0_4px_0_#3a271c]">
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
