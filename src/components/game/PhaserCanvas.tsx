import { useEffect, useRef } from "react";
import type { GameApi } from "@/game/createGame";

type Props = {
  onReady: (api: GameApi) => void;
};

export function PhaserCanvas({ onReady }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;
    let cancelled = false;
    let api: GameApi | null = null;

    void import("@/game/createGame").then(({ createFlowerQuest }) => {
      if (cancelled || !parentRef.current) return;
      api = createFlowerQuest(parentRef.current);
      onReady(api);
    });

    return () => {
      cancelled = true;
      api?.destroy();
    };
  }, [onReady]);

  return <div ref={parentRef} className="absolute inset-0 h-full w-full" />;
}
