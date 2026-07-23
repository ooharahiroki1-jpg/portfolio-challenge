/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { initialAssets } from '../data/assets';
import { getEventById } from '../data/events';
import { getScenarioById, getScenarioRound } from '../data/scenarios';
import { defaultScenarioOptionId, getScenarioOption } from '../data/scenarioOptions';
import type { Asset, GamePhase, GameSettings, GameState, OrderInput } from '../types';
import {
  advanceToNextInvestmentRound,
  applyMarketEvent,
  createInitialGameState,
  defaultSettings,
  executeOrder,
  getCurrentMarketEvent,
  getCurrentScenarioRound,
  getShockEvent,
  shouldAutoTriggerShock
} from '../lib/gameEngine';
import { clearGameState, loadGameState, saveGameState } from '../lib/storage';

interface GameContextValue {
  state: GameState;
  currentRound: ReturnType<typeof getCurrentScenarioRound>;
  currentEvent: ReturnType<typeof getCurrentMarketEvent>;
  shockEvent: ReturnType<typeof getShockEvent>;
  setActiveTeam: (teamId: string) => void;
  goToPhase: (phase: GamePhase) => void;
  startGame: (settings: GameSettings, names: Record<string, string>) => void;
  selectScenario: (scenarioId: string) => void;
  setThinkingMinutes: (minutes: GameSettings['thinkingMinutes']) => void;
  updateTeamName: (teamId: string, name: string) => void;
  updateTeamStrategy: (teamId: string, strategy: string) => void;
  placeOrder: (input: OrderInput) => string | null;
  applyCurrentEvent: () => void;
  triggerShock: () => void;
  next: () => void;
  back: () => void;
  save: () => void;
  load: () => boolean;
  reset: () => void;
  toggleControls: () => void;
  exportState: () => string;
  importState: (json: string) => string | null;
}

const GameContext = createContext<GameContextValue | null>(null);

const hydrateAssets = (assets: Asset[], useReferencePrices = false) =>
  assets.map((asset) => {
    const base = initialAssets.find((item) => item.id === asset.id);
    const merged = {
      ...base,
      ...asset,
      category: asset.category ?? base?.category ?? '現金'
    } as Asset;
    if (useReferencePrices && base) {
      return {
        ...merged,
        price: base.price,
        initialPrice: base.initialPrice
      };
    }
    return {
      ...merged
    };
  }) as Asset[];

const hydrateState = (loaded: GameState): GameState => {
  const thinkingMinutes = loaded.settings.thinkingMinutes ?? 15;
  const selectedScenarioId =
    loaded.selectedScenarioId === 'inflation-rate-shock-recovery'
      ? defaultScenarioOptionId
      : getScenarioOption(loaded.selectedScenarioId).id;
  const currentRound = Math.min(Math.max(loaded.currentRound || 1, 1), 4);
  const selectedScenario = getScenarioById(selectedScenarioId);
  const loadedPhase = loaded.gamePhase as GamePhase | 'ranking-check';
  const eventHistory = (loaded.eventHistory ?? []).map((entry) => {
    const fallbackEventId =
      entry.phase === 'shock'
        ? selectedScenario.shockEventId
        : getScenarioRound(selectedScenarioId, Math.min(entry.round, 4)).mainEventId;
    const eventId = selectedScenario.rounds.some((round) => round.mainEventId === entry.eventId)
      || entry.eventId === selectedScenario.shockEventId
      ? entry.eventId
      : fallbackEventId;
    return {
      ...entry,
      eventId,
      eventTitle: getEventById(eventId).title
    };
  });
  return {
    ...loaded,
    selectedScenarioId,
    currentRound,
    eventHistory,
    lastEventId: eventHistory.at(-1)?.eventId,
    gamePhase:
      loadedPhase === 'ranking-check'
        ? 'event'
        : loadedPhase === 'recovery'
          ? 'order'
          : loadedPhase,
    assets: hydrateAssets(
      loaded.assets,
      loaded.orders.length === 0 &&
        loaded.eventHistory.length === 0 &&
        loaded.assets.some((asset) => asset.initialPrice === 10_000)
    ),
    settings: {
      ...loaded.settings,
      investmentRounds: 4,
      thinkingMinutes
    },
    thinkingTimerSettings: loaded.thinkingTimerSettings ?? {
      minutes: thinkingMinutes
    },
    controlPanelOpen: loaded.controlPanelOpen ?? false
  };
};

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return createInitialGameState(defaultSettings, 'start');
  }
  const loaded = loadGameState();
  return loaded ? hydrateState(loaded) : createInitialGameState(defaultSettings, 'start');
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(getInitialState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      saveGameState(state);
    }
  }, [state]);

  const currentRound = useMemo(() => getCurrentScenarioRound(state), [state]);
  const currentEvent = useMemo(() => getCurrentMarketEvent(state), [state]);
  const shockEvent = useMemo(
    () => getShockEvent({ selectedScenarioId: state.selectedScenarioId }),
    [state.selectedScenarioId]
  );

  const setActiveTeam = useCallback((teamId: string) => {
    setState((prev) => ({ ...prev, activeTeamId: teamId }));
  }, []);

  const goToPhase = useCallback((phase: GamePhase) => {
    setState((prev) => ({
      ...prev,
      gamePhase: phase,
      controlPanelOpen: false
    }));
  }, []);

  const startGame = useCallback(
    (settings: GameSettings, names: Record<string, string>) => {
      setState(createInitialGameState(settings, 'scenario-select', names));
    },
    []
  );

  const updateTeamName = useCallback((teamId: string, name: string) => {
    setState((prev) => ({
      ...prev,
      teams: prev.teams.map((team) =>
        team.id === teamId ? { ...team, name: name || team.name } : team
      )
    }));
  }, []);

  const selectScenario = useCallback((scenarioId: string) => {
    const scenarioOption = getScenarioOption(scenarioId);
    setState((prev) => ({ ...prev, selectedScenarioId: scenarioOption.id }));
  }, []);

  const setThinkingMinutes = useCallback((minutes: GameSettings['thinkingMinutes']) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        thinkingMinutes: minutes
      },
      thinkingTimerSettings: {
        minutes
      }
    }));
  }, []);

  const updateTeamStrategy = useCallback((teamId: string, strategy: string) => {
    setState((prev) => ({
      ...prev,
      teams: prev.teams.map((team) =>
        team.id === teamId ? { ...team, strategy } : team
      )
    }));
  }, []);

  const placeOrder = useCallback(
    (input: OrderInput) => {
      try {
        const updated = executeOrder(state, input);
        setState(updated);
        return null;
      } catch (error) {
        return error instanceof Error ? error.message : '注文を処理できませんでした。';
      }
    },
    [state]
  );

  const applyCurrentEvent = useCallback(() => {
    setState((prev) => {
      const currentEvent = getCurrentMarketEvent(prev);
      const alreadyApplied = prev.eventHistory.some(
        (entry) =>
          entry.round === prev.currentRound &&
          entry.phase === 'normal' &&
          entry.eventId === currentEvent.id
      );
      return {
        ...(alreadyApplied ? prev : applyMarketEvent(prev, currentEvent, 'normal')),
        gamePhase: 'asset-update'
      };
    });
  }, []);

  const triggerShock = useCallback(() => {
    setState((prev) => {
      if (prev.shockOccurred) {
        return { ...prev, gamePhase: 'shock' };
      }
      return {
        ...applyMarketEvent(prev, getShockEvent(prev), 'shock'),
        gamePhase: 'shock'
      };
    });
  }, []);

  const next = useCallback(() => {
    setState((prev) => {
      switch (prev.gamePhase) {
        case 'start':
          return { ...prev, gamePhase: 'setup' };
        case 'setup':
          return { ...prev, gamePhase: 'scenario-select' };
        case 'scenario-select':
          return { ...prev, gamePhase: 'initial-investment' };
        case 'initial-investment':
          return { ...prev, gamePhase: 'news' };
        case 'initial-order':
          return { ...prev, gamePhase: 'event' };
        case 'dashboard':
          return { ...prev, gamePhase: 'news' };
        case 'news':
          return {
            ...prev,
            gamePhase: prev.currentRound === 1 ? 'initial-order' : 'order'
          };
        case 'thinking':
          return { ...prev, gamePhase: 'price-board' };
        case 'price-board':
          return { ...prev, gamePhase: 'order' };
        case 'team-analysis':
          return { ...prev, gamePhase: 'order' };
        case 'order':
          return { ...prev, gamePhase: 'event' };
        case 'event': {
          const currentEvent = getCurrentMarketEvent(prev);
          const alreadyApplied = prev.eventHistory.some(
            (entry) =>
              entry.round === prev.currentRound &&
              entry.phase === 'normal' &&
              entry.eventId === currentEvent.id
          );
          return {
            ...(alreadyApplied ? prev : applyMarketEvent(prev, currentEvent, 'normal')),
            gamePhase: 'asset-update'
          };
        }
        case 'asset-update':
          return { ...prev, gamePhase: 'ranking-update' };
        case 'ranking-update':
          if (shouldAutoTriggerShock(prev)) {
            return { ...prev, gamePhase: 'shock' };
          }
          if (prev.currentRound >= prev.settings.investmentRounds) {
            return { ...prev, gamePhase: 'results' };
          }
          return advanceToNextInvestmentRound(prev);
        case 'shock':
          return prev.shockOccurred ? { ...prev, gamePhase: 'post-shock' } : prev;
        case 'post-shock':
          return advanceToNextInvestmentRound(prev);
        case 'recovery':
          return advanceToNextInvestmentRound(prev);
        case 'results':
          return { ...prev, gamePhase: 'report' };
        case 'report':
          return { ...prev, gamePhase: 'start' };
        default:
          return prev;
      }
    });
  }, []);

  const back = useCallback(() => {
    setState((prev) => {
      if (prev.gamePhase === 'news') {
        if (prev.currentRound === 1) {
          return { ...prev, gamePhase: 'initial-investment' };
        }
        if (prev.currentRound === 3 && prev.shockOccurred) {
          return {
            ...prev,
            currentRound: 2,
            gamePhase: 'post-shock'
          };
        }
        return {
          ...prev,
          currentRound: prev.currentRound - 1,
          gamePhase: 'ranking-update'
        };
      }
      if (prev.gamePhase === 'initial-order' || prev.gamePhase === 'order') {
        return { ...prev, gamePhase: 'news' };
      }
      if (prev.gamePhase === 'event') {
        return {
          ...prev,
          gamePhase: prev.currentRound === 1 ? 'initial-order' : 'order'
        };
      }
      const previous: Partial<Record<GamePhase, GamePhase>> = {
        setup: 'start',
        'scenario-select': 'start',
        'initial-investment': 'scenario-select',
        thinking: 'news',
        'price-board': 'thinking',
        'team-analysis': 'price-board',
        'asset-update': 'event',
        'ranking-update': 'asset-update',
        shock: 'shock',
        'post-shock': 'shock',
        recovery: 'ranking-update',
        results: 'ranking-update',
        report: 'results'
      };
      return { ...prev, gamePhase: previous[prev.gamePhase] ?? prev.gamePhase };
    });
  }, []);

  const save = useCallback(() => saveGameState(state), [state]);

  const load = useCallback(() => {
    const loaded = loadGameState();
    if (!loaded) return false;
    setState(hydrateState(loaded));
    return true;
  }, []);

  const reset = useCallback(() => {
    clearGameState();
    setState(createInitialGameState(defaultSettings, 'start'));
  }, []);

  const toggleControls = useCallback(() => {
    setState((prev) => ({ ...prev, controlPanelOpen: !prev.controlPanelOpen }));
  }, []);

  const exportState = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const importState = useCallback((json: string) => {
    try {
      setState(hydrateState(JSON.parse(json) as GameState));
      return null;
    } catch {
      return 'JSONを読み込めませんでした。';
    }
  }, []);

  const value = useMemo(
    () => ({
      state,
      currentRound,
      currentEvent,
      shockEvent,
      setActiveTeam,
      goToPhase,
      startGame,
      selectScenario,
      setThinkingMinutes,
      updateTeamName,
      updateTeamStrategy,
      placeOrder,
      applyCurrentEvent,
      triggerShock,
      next,
      back,
      save,
      load,
      reset,
      toggleControls,
      exportState,
      importState
    }),
    [
      state,
      currentRound,
      currentEvent,
      shockEvent,
      setActiveTeam,
      goToPhase,
      startGame,
      selectScenario,
      setThinkingMinutes,
      updateTeamName,
      updateTeamStrategy,
      placeOrder,
      applyCurrentEvent,
      triggerShock,
      next,
      back,
      save,
      load,
      reset,
      toggleControls,
      exportState,
      importState
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used inside GameProvider');
  }
  return context;
};
