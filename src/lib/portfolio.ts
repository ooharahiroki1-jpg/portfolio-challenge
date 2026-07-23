import type {
  Asset,
  AssetCategory,
  PortfolioSnapshot,
  RankingRow,
  Team
} from '../types';
import { INITIAL_CAPITAL } from '../data/teams';

export const findAsset = (assets: Asset[], assetId: string) => {
  const asset = assets.find((item) => item.id === assetId);
  if (!asset) {
    throw new Error(`Asset not found: ${assetId}`);
  }
  return asset;
};

export const getHoldingValue = (team: Team, assets: Asset[]) =>
  team.holdings.reduce((total, holding) => {
    const asset = findAsset(assets, holding.assetId);
    return total + holding.quantity * asset.price;
  }, 0);

export const getTeamTotalAssets = (team: Team, assets: Asset[]) =>
  team.cash + getHoldingValue(team, assets);

export const getTeamReturnRate = (team: Team, assets: Asset[]) =>
  ((getTeamTotalAssets(team, assets) - INITIAL_CAPITAL) / INITIAL_CAPITAL) * 100;

export const getDrawdown = (team: Team, currentTotal: number) => {
  const highest = Math.max(
    INITIAL_CAPITAL,
    ...team.assetHistory.map((snapshot) => snapshot.totalAssets),
    currentTotal
  );
  if (highest <= 0) return 0;
  return ((currentTotal - highest) / highest) * 100;
};

export const getMaxDrawdown = (team: Team) => {
  let peak = INITIAL_CAPITAL;
  let worst = 0;
  team.assetHistory.forEach((snapshot) => {
    peak = Math.max(peak, snapshot.totalAssets);
    const drawdown = ((snapshot.totalAssets - peak) / peak) * 100;
    worst = Math.min(worst, drawdown);
  });
  return worst;
};

export const getDiversificationScore = (team: Team, assets: Asset[]) => {
  const total = getTeamTotalAssets(team, assets);
  if (total <= 0) return 0;
  const cashRatio = team.cash / total;
  const hhi =
    cashRatio * cashRatio +
    team.holdings.reduce((sum, holding) => {
      const asset = findAsset(assets, holding.assetId);
      const ratio = (holding.quantity * asset.price) / total;
      return sum + ratio * ratio;
    }, 0);

  return Math.max(0, Math.min(100, Math.round((1 - hhi) * 100)));
};

export const emptyCategoryAllocation = (): Record<AssetCategory, number> => ({
  金融: 0,
  成長株: 0,
  景気敏感: 0,
  消費: 0,
  守り: 0,
  資源: 0,
  世界株: 0,
  債券: 0,
  現金: 0
});

export const getCategoryAllocation = (team: Team, assets: Asset[]) => {
  const allocation = emptyCategoryAllocation();
  allocation.現金 = team.cash;

  team.holdings.forEach((holding) => {
    const asset = findAsset(assets, holding.assetId);
    allocation[asset.category] += holding.quantity * asset.price;
  });

  return allocation;
};

export const getLargestCategory = (team: Team, assets: Asset[]) => {
  const allocation = getCategoryAllocation(team, assets);
  return Object.entries(allocation)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])[0]?.[0] as AssetCategory | undefined;
};

export const createSnapshot = (
  team: Team,
  assets: Asset[],
  round: number,
  phase: string,
  createdAt = new Date().toISOString()
): PortfolioSnapshot => {
  const holdingsValue = getHoldingValue(team, assets);
  const totalAssets = team.cash + holdingsValue;
  return {
    round,
    phase,
    teamId: team.id,
    cash: team.cash,
    holdingsValue,
    totalAssets,
    returnRate: ((totalAssets - INITIAL_CAPITAL) / INITIAL_CAPITAL) * 100,
    drawdown: getDrawdown(team, totalAssets),
    diversificationScore: getDiversificationScore(team, assets),
    categoryAllocation: getCategoryAllocation(team, assets),
    createdAt
  };
};

export const withSnapshots = (
  teams: Team[],
  assets: Asset[],
  round: number,
  phase: string,
  createdAt = new Date().toISOString()
) => {
  const snapshots = teams.map((team) =>
    createSnapshot(team, assets, round, phase, createdAt)
  );
  const ranks = snapshots
    .slice()
    .sort((a, b) => b.totalAssets - a.totalAssets)
    .reduce<Record<string, number>>((acc, snapshot, index) => {
      acc[snapshot.teamId] = index + 1;
      return acc;
    }, {});

  const rankedSnapshots = snapshots.map((snapshot) => ({
    ...snapshot,
    rank: ranks[snapshot.teamId]
  }));

  return {
    teams: teams.map((team) => ({
      ...team,
      assetHistory: [
        ...team.assetHistory,
        rankedSnapshots.find((snapshot) => snapshot.teamId === team.id)!
      ]
    })),
    snapshots: rankedSnapshots
  };
};

export const buildRanking = (teams: Team[], assets: Asset[]): RankingRow[] => {
  const rows = teams.map((team) => {
    const totalAssets = getTeamTotalAssets(team, assets);
    const previousRank = team.assetHistory[team.assetHistory.length - 2]?.rank;
    return {
      team,
      rank: 0,
      totalAssets,
      returnRate: ((totalAssets - INITIAL_CAPITAL) / INITIAL_CAPITAL) * 100,
      cashRatio: totalAssets > 0 ? (team.cash / totalAssets) * 100 : 0,
      previousRank
    };
  });

  return rows
    .sort((a, b) => b.totalAssets - a.totalAssets)
    .map((row, index) => ({ ...row, rank: index + 1 }));
};

export const getShockRecoveryRate = (team: Team, shockAfterTotal?: number) => {
  if (!shockAfterTotal || shockAfterTotal <= 0) return 0;
  const finalSnapshot = team.assetHistory[team.assetHistory.length - 1];
  if (!finalSnapshot) return 0;
  return ((finalSnapshot.totalAssets - shockAfterTotal) / shockAfterTotal) * 100;
};
