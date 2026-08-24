import { useState } from "react";
import { Play, Sparkles, Zap, Snowflake, Heart, Compass, ShieldAlert } from "lucide-react";
import { unlockAudio, startMusic } from "@/game/audio";
import { LEVELS } from "@/game/levels";
import { useGameState } from "./useGameState";
import { MuteButton } from "./MuteButton";

type Props = {
  onPlay: (levelId?: string) => void;
};

export function StartScreen({ onPlay }: Props) {
  const { assetsReady, loadProgress } = useGameState();
  const [selectedLevelId, setSelectedLevelId] = useState("level-1");
  const [activeTab, setActiveTab] = useState<"play" | "levels" | "powers">("play");
  const progress = Math.round(loadProgress * 100);

  const selectedLevel = LEVELS.find((l) => l.id === selectedLevelId) ?? LEVELS[0];

  const handleStart = (levelId = selectedLevelId) => {
    unlockAudio();
    onPlay(levelId);
  };

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col justify-between overflow-hidden text-cream select-none"
      onPointerDown={() => {
        unlockAudio();
        startMusic("title");
      }}
    >
      {/* Dynamic Background Backdrop with Glassmorphic Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-soil/60 to-black/90 backdrop-blur-[2px]" />

      {/* Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-extrabold shadow-lg backdrop-blur-md">
            <span className="text-sm">🌸</span>
            <span className="font-display tracking-wider text-gold uppercase">Flower Quest</span>
            <span className="rounded-full bg-leaf/80 px-1.5 py-0.2 text-[9px] text-cream">v3</span>
          </div>
          <span className="hidden sm:inline text-[11px] font-bold text-cream/75">10 Gardens</span>
        </div>
        <div className="flex items-center gap-2">
          <MuteButton className="h-8 w-8 rounded-full border border-white/20 bg-black/40 shadow-lg backdrop-blur-md" />
        </div>
      </header>

      {/* Center Dynamic Content Area */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-2">
        {/* Navigation Mode Pills */}
        <div className="mb-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 p-1 shadow-md backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab("play")}
            className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
              activeTab === "play"
                ? "bg-gold text-ink shadow-[0_2px_8px_rgba(224,169,58,0.5)]"
                : "text-cream/80 hover:text-cream"
            }`}
          >
            Adventure
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("levels")}
            className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
              activeTab === "levels"
                ? "bg-gold text-ink shadow-[0_2px_8px_rgba(224,169,58,0.5)]"
                : "text-cream/80 hover:text-cream"
            }`}
          >
            Gardens (1-10)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("powers")}
            className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
              activeTab === "powers"
                ? "bg-gold text-ink shadow-[0_2px_8px_rgba(224,169,58,0.5)]"
                : "text-cream/80 hover:text-cream"
            }`}
          >
            Power Blooms
          </button>
        </div>

        {/* Tab 1: Adventure Hero View */}
        {activeTab === "play" && (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="relative my-2">
              <div className="absolute -inset-6 rounded-full bg-gold/20 blur-2xl animate-pulse" />
              <img
                src="/game/sprites/monnie.png"
                alt="Monnie"
                className="monnie-bob relative z-10 h-44 sm:h-52 w-auto drop-shadow-[0_16px_24px_rgba(0,0,0,0.5)]"
              />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-cream drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              Monnie's Quest
            </h1>
            <p className="mt-1 max-w-[20rem] text-xs sm:text-sm font-medium leading-relaxed text-cream/90 drop-shadow">
              Explore 10 vibrant garden realms, collect magical blooms, evade hostile swarms, and unlock each sacred gate.
            </p>
          </div>
        )}

        {/* Tab 2: Interactive Garden Stage Selector */}
        {activeTab === "levels" && (
          <div className="w-full max-w-[380px] max-h-[50vh] overflow-y-auto rounded-2xl border border-white/15 bg-black/50 p-2.5 shadow-2xl backdrop-blur-lg animate-in fade-in duration-200 space-y-1.5 scrollbar-thin">
            <div className="px-1 py-0.5 text-[11px] font-bold text-gold uppercase tracking-wider">
              Select Any Garden Realm:
            </div>
            {LEVELS.map((lvl) => {
              const isSelected = lvl.id === selectedLevelId;
              return (
                <div
                  key={lvl.id}
                  onClick={() => {
                    setSelectedLevelId(lvl.id);
                    handleStart(lvl.id);
                  }}
                  className={`flex items-center justify-between gap-2 rounded-xl p-2.5 transition-all cursor-pointer border ${
                    isSelected
                      ? "border-gold bg-gold/20 text-cream shadow-md"
                      : "border-white/10 bg-white/5 text-cream/85 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-black/40 font-display text-xs font-bold text-gold border border-white/10">
                      {lvl.number}
                    </span>
                    <div className="truncate">
                      <p className="truncate text-xs font-extrabold">{lvl.name}</p>
                      <p className="truncate text-[10px] text-cream/70">{lvl.objectiveText}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-full bg-gold/90 px-2.5 py-1 text-[10px] font-extrabold text-ink transition-transform active:scale-95"
                  >
                    Play
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Power Blooms Showcase */}
        {activeTab === "powers" && (
          <div className="w-full max-w-[360px] space-y-2 rounded-2xl border border-white/15 bg-black/50 p-3.5 shadow-2xl backdrop-blur-lg animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 rounded-xl border border-yellow-400/25 bg-yellow-950/40 p-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-yellow-400 text-ink shadow-md">
                <Zap className="h-4 w-4 fill-current" />
              </span>
              <div className="text-xs">
                <p className="font-extrabold text-yellow-200">Swift Seed (4.0s)</p>
                <p className="text-[11px] text-yellow-100/75">+50% sprint speed to outrun aggressive bees & beetles.</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-cyan-400/25 bg-cyan-950/40 p-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan-400 text-ink shadow-md">
                <Snowflake className="h-4 w-4" />
              </span>
              <div className="text-xs">
                <p className="font-extrabold text-cyan-200">Frost Petal (3.0s)</p>
                <p className="text-[11px] text-cyan-100/75">Freezes all beetles, bees, and wasps in solid ice.</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-400/25 bg-emerald-950/40 p-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-400 text-ink shadow-md">
                <Heart className="h-4 w-4 fill-current" />
              </span>
              <div className="text-xs">
                <p className="font-extrabold text-emerald-200">Heart Leaf</p>
                <p className="text-[11px] text-emerald-100/75">Instantly restores 1 lost heart container.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA & Controls Bar */}
      <footer className="relative z-10 px-6 pb-6 pt-2">
        {/* Stage quick badge */}
        <div className="mb-2.5 flex items-center justify-between text-[11px] font-extrabold text-cream/80">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span>
              Target: <strong className="text-cream">{selectedLevel.name}</strong>
            </span>
          </div>
          <div className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] text-gold border border-white/10">
            Touch & Drag or WASD
          </div>
        </div>

        {/* Start Game Action Button */}
        <button
          type="button"
          disabled={!assetsReady}
          onClick={() => handleStart(selectedLevelId)}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-petal via-rose-500 to-amber-500 px-6 py-4 font-display text-xl font-bold text-cream shadow-[0_8px_25px_rgba(227,93,106,0.45)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_10px_30px_rgba(227,93,106,0.6)] active:translate-y-0.5 active:shadow-[0_4px_12px_rgba(227,93,106,0.4)] disabled:opacity-60"
        >
          {assetsReady ? (
            <>
              <Play className="h-5 w-5 fill-current transition-transform group-hover:scale-110" />
              <span className="tracking-wide">
                {selectedLevelId === "level-1" ? "Start Adventure" : `Play ${selectedLevel.name}`}
              </span>
            </>
          ) : (
            <span>Sprouting Garden... {progress}%</span>
          )}
        </button>

        {/* Lab Branding Pill */}
        <div className="mt-3 flex items-center justify-center">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-cream/60">
            <span>Built for</span>
            <span className="text-gold">chaddytwiceover.com</span>
            <span>• Lab Section</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
