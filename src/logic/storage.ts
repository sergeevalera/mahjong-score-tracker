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
  // 1. Check URL hash for shared state
  const fromUrl = loadStateFromUrl();
  if (fromUrl) {
    // Clear the hash so it doesn't interfere with future loads
    history.replaceState(null, '', window.location.pathname + window.location.search);
    // Save to localStorage so it persists
    saveGameState(fromUrl);
    return fromUrl;
  }

  // 2. Fall back to localStorage
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

export const encodeStateToUrl = (state: GameState): string => {
  const json = JSON.stringify(state);
  const encoded = btoa(unescape(encodeURIComponent(json)));
  const base = window.location.href.split('#')[0];
  return `${base}#game=${encoded}`;
};

const loadStateFromUrl = (): GameState | null => {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith('#game=')) return null;
    const encoded = hash.slice(6);
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json) as GameState;
  } catch {
    return null;
  }
};
