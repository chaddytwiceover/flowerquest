import { Pause, Zap, Snowflake, Sparkles } from "lucide-react";
import { useGameState } from "./useGameState";
import { VirtualJoystick } from "./VirtualJoystick";
import { MuteButton } from "./MuteButton";

type Props = {
  onPause: () => void;
};

export function HudOverlay({ onPause }: Props) {
  const {
    hearts,
    heartsMax,
    levelNumber,
    phase,
    banner,
    gateUnlocked,
    objectives,
    activePowerUp,
    powerUpRemaining,
    powerUpTotal,
  } = useGameState();

  const required = objectives.reduce((sum, obj) => sum + obj.required, 0);
  const collected = objectives.reduce((sum, obj) => sum + obj.collected, 0);
  const progressPercent = required > 0 ? Math.min(100, Math.round((collected / required) * 100)) : 0;

  const powerUpPct = powerUpTotal > 0 ? Math.max(0, Math.min(100, (powerUpRemaining / powerUpTotal) * 100)) : 0;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between overflow-hidden">
      {/* Invisible Full-Screen Touch Layer (Only active when playing) */}
      {phase === "playing" && (
        <div className="pointer-events-auto absolute inset-0 z-0">
          <VirtualJoystick />
        </div>
      )}

      {/* Top Floating Glassmorphism Bar */}
      <header className="relative z-10 flex items-center justify-between gap-2 px-3 pt-3">
        {/* Left Pill: Level & Flower Progress */}
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
          <div className="flex items-center gap-1.5 font-display text-xs font-bold tracking-wider text-gold uppercase">
            <span>Lv {levelNumber}</span>
          </div>
          <span className="h-3 w-px bg-white/20" />
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-cream">
            <span className="text-sm">🌸</span>
            <span>
              {collected}/{required}
            </span>
          </div>
          <div className="h-1.5 w-10 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold to-yellow-300 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Center Pill: Glowing Hearts */}
        <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/45 px-2.5 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
          {Array.from({ length: heartsMax }).map((_, i) => {
            const isFilled = i < hearts;
            const isCritical = hearts === 1 && isFilled;
            return (
              <img
                key={i}
                src="/game/sprites/heart.png"
                alt="Heart"
                className={`h-5 w-5 object-contain transition-all duration-200 ${
                  isFilled
                    ? isCritical
                      ? "animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]"
                      : "drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                    : "opacity-20 grayscale"
                }`}
              />
            );
          })}
        </div>

        {/* Right Pill: Minimal Action Buttons */}
        <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 p-1 shadow-[0_8px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
          <MuteButton className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 border-0" />
          <button
            type="button"
            onClick={onPause}
            className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full bg-white/10 text-cream transition-all hover:bg-white/20 active:scale-90"
            aria-label="Pause Game"
          >
            <Pause className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Floating Status Badges (Power-Up & Gate Unlocked) */}
      <div className="relative z-10 flex flex-col items-center gap-2 pt-2">
        {/* Active Power-Up Meter */}
        {activePowerUp && (
          <div
            className={`flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-extrabold shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-md animate-in fade-in zoom-in-90 duration-200 ${
              activePowerUp === "swift"
                ? "border-yellow-400/40 bg-yellow-950/70 text-yellow-200"
                : "border-cyan-400/40 bg-cyan-950/70 text-cyan-200"
            }`}
          >
            {activePowerUp === "swift" ? (
              <Zap className="h-3.5 w-3.5 fill-current animate-pulse text-yellow-300" />
            ) : (
              <Snowflake className="h-3.5 w-3.5 animate-spin text-cyan-300" />
            )}
            <span className="tracking-wide">
              {activePowerUp === "swift" ? "Swift Boost" : "Frost Freeze"} ({powerUpRemaining.toFixed(1)}s)
            </span>
            <div className="h-1.5 w-12 overflow-hidden rounded-full bg-black/40">
              <div
                className={`h-full rounded-full transition-all duration-100 ${
                  activePowerUp === "swift" ? "bg-yellow-400" : "bg-cyan-400"
                }`}
                style={{ width: `${powerUpPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Gate Open Indicator */}
        {gateUnlocked && (
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-950/80 px-4 py-1 text-xs font-extrabold text-emerald-200 shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-md animate-bounce">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>Garden Gate is Open! Reach the exit!</span>
          </div>
        )}

        {/* Banner Alert Messages */}
        {banner && (
          <div className="flex items-center rounded-full border border-white/20 bg-cream/95 px-4 py-1.5 text-xs font-extrabold text-soil shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-md animate-in slide-in-from-top-2">
            <span>{banner}</span>
          </div>
        )}
      </div>

      {/* Clean Screen Bottom */}
      <div className="h-4 pointer-events-none" />
    </div>
  );
}
