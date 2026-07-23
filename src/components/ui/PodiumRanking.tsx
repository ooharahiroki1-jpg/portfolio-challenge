import { Crown, Medal } from 'lucide-react';
import { formatCompactCurrency, formatPercent } from '../../lib/formatters';
import { buildRanking } from '../../lib/portfolio';
import type { Asset, RankingRow, Team } from '../../types';

const podiumOrder = (rows: RankingRow[]) =>
  [rows[1], rows[0], rows[2]].filter(Boolean) as RankingRow[];

const podiumHeight: Record<number, string> = {
  1: 'h-44',
  2: 'h-36',
  3: 'h-32'
};

export function PodiumRanking({
  teams,
  assets,
  title = '現在順位',
  dark = false,
  compact = false
}: {
  teams: Team[];
  assets: Asset[];
  title?: string;
  dark?: boolean;
  compact?: boolean;
}) {
  const ranking = buildRanking(teams, assets);
  const topRows = podiumOrder(ranking);
  const restRows = ranking.slice(3);
  const heights = compact
    ? {
        1: 'h-32',
        2: 'h-24',
        3: 'h-20'
      }
    : podiumHeight;

  return (
    <div
      className={`h-full rounded-lg border p-4 shadow-sm ${
        dark
          ? 'border-rise-500/35 bg-black/42 text-white'
          : 'border-sky-100 bg-white text-slate-950'
      }`}
    >
      <div
        className={`mb-3 flex items-center gap-3 font-black ${
          compact ? 'text-3xl' : 'text-4xl'
        }`}
      >
        <Crown className={`${compact ? 'h-8 w-8' : 'h-10 w-10'} text-alert-400`} />
        {title}
      </div>
      <div className="grid min-h-0 grid-rows-[1fr_auto] gap-3">
        <div className="grid min-h-0 grid-cols-3 items-end gap-3">
          {topRows.map((row) => (
            <div key={row.team.id} className="grid min-h-0 gap-2">
              <div
                className={`rounded-lg border text-center ${compact ? 'p-2' : 'p-3'} ${
                  dark
                    ? 'border-white/12 bg-navy-950/72'
                    : 'border-sky-100 bg-sky-50'
                }`}
              >
                <div
                  className={`flex items-center justify-center gap-2 font-black ${
                    compact ? 'text-2xl' : 'text-3xl'
                  }`}
                >
                  <span
                    className="h-5 w-5 rounded-full"
                    style={{ backgroundColor: row.team.color }}
                  />
                  {row.team.name}
                </div>
                <div
                  className={`mt-1 font-black leading-none ${
                    compact ? 'text-3xl' : 'text-4xl'
                  }`}
                >
                  {formatCompactCurrency(row.totalAssets)}
                </div>
                <div
                  className={`mt-1 font-black leading-none ${
                    row.returnRate >= 0 ? 'text-rise-500' : 'text-fall-500'
                  } ${compact ? 'text-xl' : 'text-2xl'}`}
                >
                  {formatPercent(row.returnRate)}
                </div>
              </div>
              <div
                className={`flex ${heights[row.rank] ?? 'h-24'} items-center justify-center rounded-lg border-2 font-black leading-none ${
                  row.rank === 1
                    ? 'border-alert-400 bg-alert-400 text-slate-950'
                    : row.rank === 2
                      ? 'border-slate-300 bg-slate-200 text-slate-950'
                      : 'border-orange-300 bg-orange-300 text-slate-950'
                } ${compact ? 'text-[64px]' : 'text-[76px]'}`}
              >
                {row.rank}
              </div>
            </div>
          ))}
        </div>
        {restRows.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {restRows.map((row) => (
              <div
                key={row.team.id}
                className={`grid grid-cols-[auto_1fr] items-center gap-2 rounded-lg border px-3 py-2 ${
                  dark
                    ? 'border-white/12 bg-navy-950/72'
                    : 'border-sky-100 bg-sky-50'
                }`}
              >
                <Medal className="h-7 w-7 text-slate-400" />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`${compact ? 'text-2xl' : 'text-3xl'} font-black leading-none`}>
                      {row.rank}位
                    </span>
                    <span className={`${compact ? 'text-xl' : 'text-2xl'} truncate font-black leading-none`}>
                      {row.team.name}
                    </span>
                  </div>
                  <div
                    className={`mt-1 text-right font-black leading-none ${
                      compact ? 'text-xl' : 'text-2xl'
                    }`}
                  >
                    {formatCompactCurrency(row.totalAssets)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
