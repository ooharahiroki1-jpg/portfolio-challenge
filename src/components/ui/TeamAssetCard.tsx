import { WalletCards } from 'lucide-react';
import { formatCompactCurrency, formatPercent } from '../../lib/formatters';
import {
  getDiversificationScore,
  getLargestCategory,
  getTeamReturnRate,
  getTeamTotalAssets
} from '../../lib/portfolio';
import type { Asset, Team } from '../../types';

export function TeamAssetCard({
  team,
  assets,
  rank
}: {
  team: Team;
  assets: Asset[];
  rank?: number;
}) {
  const total = getTeamTotalAssets(team, assets);
  const returnRate = getTeamReturnRate(team, assets);
  const cashRatio = total > 0 ? (team.cash / total) * 100 : 0;
  const previous = team.assetHistory.at(-2)?.totalAssets ?? team.assetHistory.at(-1)?.totalAssets;
  const change = previous ? total - previous : 0;
  const largestCategory = getLargestCategory(team, assets) ?? '現金';

  return (
    <div className="overflow-hidden rounded-lg border border-white/15 bg-white/8 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="h-5 w-5 flex-none rounded-full"
            style={{ backgroundColor: team.color }}
          />
          <div className="truncate whitespace-nowrap text-2xl font-black text-white">
            {team.name}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {rank ? (
            <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-base font-black text-sky-700">
              {rank}位
            </span>
          ) : (
            <WalletCards className="h-7 w-7 text-sky-300" />
          )}
        </div>
      </div>
      <div className="mt-3 truncate text-4xl font-black text-white">
        {formatCompactCurrency(total)}
      </div>
      <div className="mt-2 flex items-center justify-between gap-4">
        <div
          className={`text-2xl font-black ${
            returnRate >= 0 ? 'text-rise-500' : 'text-fall-500'
          }`}
        >
          {formatPercent(returnRate)}
        </div>
        <div
          className={`text-xl font-black ${
            change >= 0 ? 'text-rise-500' : 'text-fall-500'
          }`}
        >
          {change >= 0 ? '+' : ''}
          {formatCompactCurrency(change)}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-base font-semibold text-slate-300">
        <div>現金 {formatCompactCurrency(team.cash)}</div>
        <div>現金比率 {cashRatio.toFixed(1)}%</div>
        <div>保有 {team.holdings.length}銘柄</div>
        <div>最大 {largestCategory}</div>
        <div className="col-span-2">
          分散スコア {getDiversificationScore(team, assets)}
        </div>
      </div>
    </div>
  );
}
