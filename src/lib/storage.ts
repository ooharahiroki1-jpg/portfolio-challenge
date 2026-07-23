import type { GameState } from '../types';

const STORAGE_KEY = 'portfolio-challenge-state-v1';

export const saveGameState = (state: GameState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const loadGameState = (): GameState | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameState;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const clearGameState = () => {
  localStorage.removeItem(STORAGE_KEY);
};
