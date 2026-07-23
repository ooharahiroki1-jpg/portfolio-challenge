import { assetCategories, categoryColors } from '../../lib/categories';
import { formatCompactCurrency } from '../../lib/formatters';
import { getCategoryAllocation } from '../../lib/portfolio';
import type { Asset, Team } from '../../types';

export function CategoryAllocationBar({
  team,
  assets,
  compact = false,
  title,
  color
}: {
  team: Team;
  assets: Asset[];
  compact?: boolean;
  title?: string;
  color?: string;
}) {
  const allocation = getCategoryAllocation(team, assets);
  const total = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  const rows = assetCategories
    .map((category) => ({
      category,
      value: allocation[category],
      ratio: total > 0 ? (allocation[category] / total) * 100 : 0
    }))
    .filter((row) => row.value > 0);

  return (
    <div
      className={`rounded-lg border border-sky-100 bg-white shadow-sm ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <div className={`${compact ? 'mb-2' : 'mb-3'} flex items-center justify-between gap-3`}>
        <div
          className={`${compact ? 'text-lg' : 'text-xl'} flex min-w-0 items-center gap-2 font-black text-slate-900`}
        >
          {color ? (
            <span
              className="h-3.5 w-3.5 flex-none rounded-full"
              style={{ backgroundColor: color }}
            />
          ) : null}
          <span className="truncate">{title ?? 'カテゴリ配分'}</span>
        </div>
        <div className={`${compact ? 'text-base' : 'text-lg'} font-bold text-slate-500`}>
          {formatCompactCurrency(total)}
        </div>
      </div>
      <div
        className={`flex overflow-hidden rounded-full border border-sky-100 bg-slate-100 ${
          compact ? 'h-5' : 'h-7'
        }`}
      >
        {rows.map((row) => (
          <div
            key={row.category}
            title={`${row.category} ${row.ratio.toFixed(1)}%`}
            className="h-full min-w-[3px]"
            style={{
              width: `${Math.max(row.ratio, 0.5)}%`,
              backgroundColor: categoryColors[row.category]
            }}
          />
        ))}
      </div>
      <div
        className={
          compact
            ? 'mt-2 flex flex-wrap gap-x-3 gap-y-1'
            : 'mt-3 grid grid-cols-2 gap-2'
        }
      >
        {rows.map((row) => (
          <div key={row.category} className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 flex-none rounded-full"
                style={{ backgroundColor: categoryColors[row.category] }}
              />
              <span
                className={`truncate font-black text-slate-700 ${
                  compact ? 'text-sm' : 'text-base'
                }`}
              >
                {row.category}
              </span>
            </div>
            {!compact ? (
              <div className="pl-5 text-base font-bold text-slate-500">
                {row.ratio.toFixed(1)}% / {formatCompactCurrency(row.value)}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
