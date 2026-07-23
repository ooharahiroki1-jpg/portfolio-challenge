import { initialAssets } from '../data/assets';
import { getEventById } from '../data/events';
import { getScenarioById, getScenarioRound } from '../data/scenarios';
import { defaultScenarioOptionId } from '../data/scenarioOptions';
import { baseTeams, INITIAL_CAPITAL } from '../data/teams';
import type {
  Asset,
  EventHistoryEntry,
  EventPhase,
  GamePhase,
  GameSettings,
  GameState,
  MarketEvent,
  Order,
  OrderInput,
  Team
} from '../types';
import {
  buildRanking,
  createSnapshot,
  findAsset,
  getTeamTotalAssets,
  withSnapshots
} from './portfolio';

export const defaultSettings: GameSettings = {
  investmentRounds: 4,
  teamCount: 4,
  thinkingMinutes: 10
};

const makeId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeSettings = (settings: GameSettings): GameSettings => ({
  investmentRounds: settings.investmentRounds,
  teamCount: settings.teamCount,
  thinkingMinutes: settings.thinkingMinutes ?? 15
});

const cloneAssets = () => initialAssets.map((asset) => ({ ...asset }));

export const createTeams = (
  teamCount: 2 | 3 | 4 | 5 | 6,
  names?: Record<string, string>
): Team[] =>
  baseTeams.slice(0, teamCount).map((team) => ({
    ...team,
    name: names?.[team.id] ?? team.name,
    cash: INITIAL_CAPITAL,
    holdings: [],
    orders: [],
    assetHistory: []
  }));

export const createInitialGameState = (
  settings: GameSettings = defaultSettings,
  phase: GamePhase = 'start',
  names?: Record<string, string>
): GameState => {
  const normalizedSettings = normalizeSettings(settings);
  const assets = cloneAssets();
  const teams = createTeams(normalizedSettings.teamCount, names);
  const createdAt = new Date().toISOString();
  const snapshots = teams.map((team, index) => ({
    ...createSnapshot(team, assets, 0, 'initial', createdAt),
    rank: index + 1
  }));

  return {
    teams: teams.map((team) => ({
      ...team,
      assetHistory: [snapshots.find((snapshot) => snapshot.teamId === team.id)!]
    })),
    assets,
    currentRound: 1,
    selectedScenarioId: defaultScenarioOptionId,
    gamePhase: phase,
    orders: [],
    portfolioSnapshots: snapshots,
    eventHistory: [],
    shockOccurred: false,
    settings: normalizedSettings,
    thinkingTimerSettings: {
      minutes: normalizedSettings.thinkingMinutes
    },
    activeTeamId: teams[0]?.id ?? 'team-a',
    controlPanelOpen: false
  };
};

export const getCurrentScenarioRound = (state: GameState) => {
  return getScenarioRound(state.selectedScenarioId, state.currentRound);
};

export const getCurrentMarketEvent = (state: GameState) =>
  getEventById(getCurrentScenarioRound(state).mainEventId);

export const getShockEvent = (state: Pick<GameState, 'selectedScenarioId'>) =>
  getEventById(getScenarioById(state.selectedScenarioId).shockEventId);

const cloneTeams = (teams: Team[]) =>
  teams.map((team) => ({
    ...team,
    holdings: team.holdings.map((holding) => ({ ...holding })),
    orders: [...team.orders],
    assetHistory: [...team.assetHistory]
  }));

export const executeOrder = (
  state: GameState,
  input: OrderInput,
  now = new Date().toISOString()
) => {
  if (!input.reason.trim()) {
    throw new Error('投資理由を入力してください。');
  }

  const asset = findAsset(state.assets, input.assetId);
  const teams = cloneTeams(state.teams);
  const team = teams.find((item) => item.id === input.teamId);
  if (!team) {
    throw new Error('チームが見つかりません。');
  }

  const quantity = Math.floor(input.quantity);
  if (quantity <= 0) {
    throw new Error('株数は1以上で入力してください。');
  }

  const totalAmount = quantity * asset.price;

  if (input.side === 'buy') {
    if (totalAmount > team.cash) {
      throw new Error('現金残高が不足しています。');
    }

    const existing = team.holdings.find((holding) => holding.assetId === asset.id);
    if (existing) {
      const previousCost = existing.averageCost * existing.quantity;
      existing.averageCost =
        (previousCost + totalAmount) / (existing.quantity + quantity);
      existing.quantity += quantity;
    } else {
      team.holdings.push({
        assetId: asset.id,
        quantity,
        averageCost: asset.price
      });
    }
    team.cash -= totalAmount;
  } else {
    const holding = team.holdings.find((item) => item.assetId === asset.id);
    if (!holding) {
      throw new Error('売却できる保有数量がありません。');
    }
    if (quantity > holding.quantity) {
      throw new Error('保有数量が不足しています。');
    }

    holding.quantity -= quantity;
    team.cash += totalAmount;
    team.holdings = team.holdings.filter((item) => item.quantity > 0);
  }

  const order: Order = {
    id: makeId('order'),
    round: state.currentRound,
    teamId: team.id,
    assetId: asset.id,
    side: input.side,
    totalAmount,
    quantity,
    price: asset.price,
    reason: input.reason.trim(),
    createdAt: now
  };

  team.orders.push(order);

  return {
    ...state,
    teams,
    orders: [...state.orders, order]
  };
};

export const cancelOrder = (state: GameState, orderId: string) => {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return state;

  const reverseSide = order.side === 'buy' ? 'sell' : 'buy';
  const reversed = executeOrder(
    state,
    {
      teamId: order.teamId,
      assetId: order.assetId,
      side: reverseSide,
      quantity: order.quantity,
      reason: `注文取消: ${order.reason}`
    },
    new Date().toISOString()
  );

  return {
    ...reversed,
    orders: reversed.orders.filter((item) => item.id !== orderId),
    teams: reversed.teams.map((team) => ({
      ...team,
      orders: team.orders.filter((item) => item.id !== orderId)
    }))
  };
};

const BACKGROUND_MARKET_EFFECTS = [
  -1,
  -0.8,
  -0.6,
  -0.4,
  -0.2,
  0.2,
  0.4,
  0.6,
  0.8,
  1
] as const;

const MARKET_MOOD_INDEX_SHIFT: Record<MarketEvent['marketMood'], number> = {
  bullish: 2,
  optimistic: 1,
  recovery: 1,
  cautious: -1,
  panic: -2
};

const stableHash = (value: string) => {
  let hash = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
};

const getBackgroundMarketEffect = (
  event: MarketEvent,
  asset: Asset,
  round: number,
  phase: EventPhase
) => {
  const hash = stableHash(`${event.id}:${asset.id}:${round}:${phase}`);
  const baseIndex = hash % BACKGROUND_MARKET_EFFECTS.length;
  const shiftedIndex = Math.min(
    BACKGROUND_MARKET_EFFECTS.length - 1,
    Math.max(0, baseIndex + MARKET_MOOD_INDEX_SHIFT[event.marketMood])
  );
  const baseEffect = BACKGROUND_MARKET_EFFECTS[shiftedIndex];
  const boundedVolatility = Math.min(1, Math.max(0, asset.volatility));
  const volatilityScale = 0.65 + boundedVolatility * 0.55;
  const scaledEffect = Math.round(baseEffect * volatilityScale * 10) / 10;

  return scaledEffect || Math.sign(baseEffect) * 0.1;
};

const getEffectForAsset = (
  event: MarketEvent,
  asset: Asset,
  round: number,
  phase: EventPhase
) => {
  const assetEffect = event.assetEffects?.[asset.id];
  if (assetEffect !== undefined) return assetEffect;

  const sectorEffect = event.sectorEffects[asset.sector];
  if (sectorEffect !== undefined) return sectorEffect;

  return getBackgroundMarketEffect(event, asset, round, phase);
};

const rankMap = (teams: Team[], assets: Asset[]) =>
  buildRanking(teams, assets).reduce<Record<string, number>>((acc, row) => {
    acc[row.team.id] = row.rank;
    return acc;
  }, {});

const totalsMap = (teams: Team[], assets: Asset[]) =>
  teams.reduce<Record<string, number>>((acc, team) => {
    acc[team.id] = getTeamTotalAssets(team, assets);
    return acc;
  }, {});

export const applyMarketEvent = (
  state: GameState,
  event: MarketEvent,
  phase: EventPhase = 'normal',
  now = new Date().toISOString()
): GameState => {
  const beforeAssets = Object.fromEntries(
    state.assets.map((asset) => [asset.id, asset.price])
  );
  const beforeTeamTotals = totalsMap(state.teams, state.assets);
  const beforeRanks = rankMap(state.teams, state.assets);

  const assets = state.assets.map((asset) => {
    const effect = getEffectForAsset(event, asset, state.currentRound, phase);
    const calculatedPrice = Math.max(
      1,
      Math.round(asset.price * (1 + effect / 100))
    );
    const price =
      calculatedPrice === asset.price && effect !== 0
        ? Math.max(1, asset.price + Math.sign(effect))
        : calculatedPrice;

    return {
      ...asset,
      price
    };
  });

  const afterAssets = Object.fromEntries(assets.map((asset) => [asset.id, asset.price]));
  const afterTeamTotals = totalsMap(state.teams, assets);
  const afterRanks = rankMap(state.teams, assets);
  const { teams, snapshots } = withSnapshots(
    state.teams,
    assets,
    state.currentRound,
    phase,
    now
  );

  const historyEntry: EventHistoryEntry = {
    id: makeId('event'),
    eventId: event.id,
    eventTitle: event.title,
    round: state.currentRound,
    phase,
    marketMood: event.marketMood,
    beforeAssets,
    afterAssets,
    beforeTeamTotals,
    afterTeamTotals,
    beforeRanks,
    afterRanks,
    createdAt: now
  };

  return {
    ...state,
    assets,
    teams,
    portfolioSnapshots: [...state.portfolioSnapshots, ...snapshots],
    eventHistory: [...state.eventHistory, historyEntry],
    shockOccurred: state.shockOccurred || phase === 'shock',
    lastEventId: event.id
  };
};

export const shouldAutoTriggerShock = (state: GameState) =>
  state.currentRound === 2 &&
  !state.shockOccurred &&
  state.eventHistory.some(
    (entry) =>
      entry.round === 2 &&
      entry.phase === 'normal' &&
      entry.eventId === getCurrentScenarioRound(state).mainEventId
  );

export const advanceToNextInvestmentRound = (state: GameState): GameState => ({
  ...state,
  currentRound: Math.min(state.currentRound + 1, state.settings.investmentRounds),
  gamePhase: 'news'
});

export const getLatestEventHistory = (state: GameState, phase?: EventPhase) => {
  const entries = phase
    ? state.eventHistory.filter((entry) => entry.phase === phase)
    : state.eventHistory;
  return entries[entries.length - 1];
};

export const getShockHistory = (state: GameState) =>
  state.eventHistory.find((entry) => entry.phase === 'shock');
