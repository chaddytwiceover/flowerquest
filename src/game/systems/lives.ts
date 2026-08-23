import { getGameState, patchGameState } from "../state";

export function currentHearts(): number {
  return getGameState().hearts;
}

export function loseHeart(): { hearts: number; dead: boolean } {
  const hearts = Math.max(0, getGameState().hearts - 1);
  patchGameState({ hearts });
  return { hearts, dead: hearts <= 0 };
}

export function resetHearts(max: number) {
  patchGameState({ hearts: max, heartsMax: max });
}
