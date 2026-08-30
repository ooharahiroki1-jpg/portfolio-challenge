import { useEffect, type ReactNode } from 'react';
import { useGame } from '../../context/GameProvider';
import { GameMemoryBoard } from './GameMemoryBoard';
import { GameMasterControls } from './GameMasterControls';
import { HeaderBar } from './HeaderBar';

const fullScreenPhases = new Set([
  'start',
  'setup',
  'scenario-select',
  'initial-investment',
  'initial-order',
  'dashboard',
  'news',
  'thinking',
  'team-analysis',
  'order',
  'event',
  'shock',
  'post-shock',
  'recovery',
  'price-board',
  'asset-update',
  'ranking-update',
  'results',
  'report'
]);

export function Layout({ children }: { children: ReactNode }) {
  const { state, next, back, goToPhase, toggleControls } = useGame();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) &&
        event.key !== 'Escape'
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      if (
        state.gamePhase === 'shock' &&
        event.key !== 'Escape' &&
        key !== 'h'
      ) {
        event.preventDefault();
        return;
      }
      if (event.code === 'Space') {
        event.preventDefault();
        next();
      }
      if (key === 'b') back();
      if (key === 'h') goToPhase('start');
      if (key === 'n') goToPhase('news');
      if (key === 'p') goToPhase('asset-update');
      if (key === 'o') goToPhase(state.currentRound === 1 ? 'initial-order' : 'order');
      if (key === 'e') goToPhase('event');
      if (key === 's' && state.currentRound === 2 && !state.shockOccurred) {
        goToPhase('shock');
      }
      if (key === 'r') goToPhase('ranking-update');
      if (event.key === 'Escape') toggleControls();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [back, goToPhase, next, state.currentRound, state.gamePhase, state.shockOccurred, toggleControls]);

  const fullscreen = fullScreenPhases.has(state.gamePhase);
  const shock = state.gamePhase === 'shock';

  return (
    <div
      className={`flex h-screen flex-col overflow-hidden bg-market-grid font-sans ${
        shock ? 'bg-shock-grid text-white' : 'light-mode text-slate-950'
      }`}
    >
      {!fullscreen ? <HeaderBar /> : null}
      <main
        className={
          fullscreen
            ? 'h-screen min-h-0'
            : 'min-h-0 flex-1 overflow-hidden px-5 py-4'
        }
      >
        {children}
      </main>
      <GameMemoryBoard />
      <GameMasterControls />
    </div>
  );
}
