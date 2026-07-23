export type AssetType = 'stock' | 'index' | 'bond' | 'cash';

export type MarketMood =
  | 'bullish'
  | 'optimistic'
  | 'cautious'
  | 'panic'
  | 'recovery';

export type OrderSide = 'buy' | 'sell';

export type AssetCategory =
  | '金融'
  | '成長株'
  | '景気敏感'
  | '消費'
  | '守り'
  | '資源'
  | '世界株'
  | '債券'
  | '現金';

export type GamePhase =
  | 'start'
  | 'setup'
  | 'scenario-select'
  | 'initial-investment'
  | 'initial-order'
  | 'dashboard'
  | 'news'
  | 'thinking'
  | 'price-board'
  | 'order'
  | 'team-analysis'
  | 'event'
  | 'asset-update'
  | 'ranking-update'
  | 'shock'
  | 'post-shock'
  | 'recovery'
  | 'results'
  | 'report';

export type EventPhase = 'normal' | 'shock' | 'recovery';

export interface Holding {
  assetId: string;
  quantity: number;
  averageCost: number;
}

export interface PortfolioSnapshot {
  round: number;
  phase: string;
  teamId: string;
  cash: number;
  holdingsValue: number;
  totalAssets: number;
  returnRate: number;
  drawdown: number;
  diversificationScore: number;
  categoryAllocation: Record<AssetCategory, number>;
  rank?: number;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  cash: number;
  holdings: Holding[];
  orders: Order[];
  assetHistory: PortfolioSnapshot[];
  strategy: string;
  notes: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  sector: string;
  category: AssetCategory;
  price: number;
  initialPrice: number;
  volatility: number;
  description: string;
  icon: string;
  color: string;
  traits: string[];
}

export interface Order {
  id: string;
  round: number;
  teamId: string;
  assetId: string;
  side: OrderSide;
  totalAmount: number;
  quantity: number;
  price: number;
  reason: string;
  createdAt: string;
}

export interface NewsBriefing {
  title: string;
  body: string;
  points: string[];
  relatedSectors: string[];
}

export interface ScenarioRound {
  round: number;
  preNews: NewsBriefing;
  marketMood: MarketMood;
  mainEventId: string;
  lesson: string;
  thinkingPoints?: string[];
  relatedSectors?: string[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  rounds: ScenarioRound[];
  shockEventId: string;
}

export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  marketMood: MarketMood;
  sectorEffects: Record<string, number>;
  assetEffects?: Record<string, number>;
  lesson: string;
  displayStyle: 'normal' | 'shock' | 'recovery';
  isForcedShock?: boolean;
  highlights?: string[];
}

export interface EventHistoryEntry {
  id: string;
  eventId: string;
  eventTitle: string;
  round: number;
  phase: EventPhase;
  marketMood: MarketMood;
  beforeAssets: Record<string, number>;
  afterAssets: Record<string, number>;
  beforeTeamTotals: Record<string, number>;
  afterTeamTotals: Record<string, number>;
  beforeRanks: Record<string, number>;
  afterRanks: Record<string, number>;
  createdAt: string;
}

export interface GameSettings {
  investmentRounds: 4;
  teamCount: 2 | 3 | 4 | 5 | 6;
  thinkingMinutes: 5 | 10 | 15 | 20;
}

export interface GameState {
  teams: Team[];
  assets: Asset[];
  currentRound: number;
  selectedScenarioId: string;
  gamePhase: GamePhase;
  orders: Order[];
  portfolioSnapshots: PortfolioSnapshot[];
  eventHistory: EventHistoryEntry[];
  shockOccurred: boolean;
  settings: GameSettings;
  thinkingTimerSettings: {
    minutes: 5 | 10 | 15 | 20;
  };
  activeTeamId: string;
  lastEventId?: string;
  controlPanelOpen: boolean;
}

export interface OrderInput {
  teamId: string;
  assetId: string;
  side: OrderSide;
  quantity: number;
  reason: string;
}

export interface RankingRow {
  team: Team;
  rank: number;
  totalAssets: number;
  returnRate: number;
  cashRatio: number;
  previousRank?: number;
}
