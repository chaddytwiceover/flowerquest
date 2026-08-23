import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMuted, subscribeMute, toggleMute, unlockAudio } from "@/game/audio";

type Props = {
  className?: string;
};

export function MuteButton({ className = "" }: Props) {
  const [muted, setMuted] = useState(isMuted);

  useEffect(() => subscribeMute(setMuted), []);

  return (
    <button
      type="button"
      onClick={() => {
        unlockAudio();
        toggleMute();
      }}
      className={`pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-soil/70 text-cream backdrop-blur-sm ${className}`}
      aria-label={muted ? "Unmute" : "Mute"}
    >
      {muted ? <VolumeX className="h-5 w-5" strokeWidth={2.5} /> : <Volume2 className="h-5 w-5" strokeWidth={2.5} />}
    </button>
  );
}
