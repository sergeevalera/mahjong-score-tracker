import type { GameState } from '../types';

const STORAGE_KEY = 'mahjong-game-state';

export const saveGameState = (state: GameState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
};

export const clearGameState = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
