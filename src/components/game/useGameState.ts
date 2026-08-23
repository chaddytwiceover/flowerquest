import { useEffect, useState } from "react";
import { getGameState, subscribeGameState, type GameSnapshot } from "@/game/state";

export function useGameState(): GameSnapshot {
  const [state, setState] = useState<GameSnapshot>(getGameState);
  useEffect(() => subscribeGameState(setState), []);
  return state;
}
