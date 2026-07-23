import { formatCompactCurrency, formatNumber } from '../../lib/formatters';
import { findAsset } from '../../lib/portfolio';
import type { Asset, Team } from '../../types';

export function HoldingsTable({ team, assets }: { team: Team; assets: Asset[] }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/8 p-4">
      <div className="mb-3 text-2xl font-black text-white">{team.name} 保有資産</div>
      <div className="grid gap-2">
        <div className="grid grid-cols-[1fr_80px_120px] gap-3 px-3 text-lg font-black text-slate-300">
          <span>銘柄</span>
          <span className="text-right">数量</span>
          <span className="text-right">評価額</span>
        </div>
        {team.holdings.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-navy-950/60 p-4 text-xl font-bold text-slate-300">
            保有資産はありません。現金 {formatCompactCurrency(team.cash)}
          </div>
        ) : (
          team.holdings.map((holding) => {
            const asset = findAsset(assets, holding.assetId);
            return (
              <div
                key={holding.assetId}
                className="grid grid-cols-[1fr_80px_120px] gap-3 rounded-lg border border-white/10 bg-navy-950/60 px-3 py-2 text-lg font-bold"
              >
                <span className="truncate text-white">{asset.name}</span>
                <span className="text-right text-slate-200">
                  {formatNumber(holding.quantity)}
                </span>
                <span className="text-right text-white">
                  {formatCompactCurrency(holding.quantity * asset.price)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
