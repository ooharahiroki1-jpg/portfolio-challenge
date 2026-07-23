import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Minus, Trophy } from 'lucide-react';
import { rankingTransition } from '../../lib/animations';
import { formatCompactCurrency, formatPercent } from '../../lib/formatters';
import { buildRanking } from '../../lib/portfolio';
import type { Asset, Team } from '../../types';

export function TeamRanking({
  teams,
  assets
}: {
  teams: Team[];
  assets: Asset[];
  compact?: boolean;
}) {
  const ranking = buildRanking(teams, assets);
  return (
    <div className="team-ranking-card">
      <div className="team-ranking-title">
        <Trophy />
        総資産額ランキング
      </div>
      <div className="team-ranking-list">
        {ranking.map((row) => {
          const diff =
            row.previousRank === undefined ? 0 : row.previousRank - row.rank;
          return (
            <motion.div
              layout
              transition={rankingTransition}
              key={row.team.id}
              className={`team-ranking-row rank-${row.rank}`}
            >
              <div className="team-rank-number">{row.rank}</div>
              <div className="team-ranking-main">
                <div className="team-ranking-name">
                  <span style={{ backgroundColor: row.team.color }} />
                  {row.team.name}
                </div>
                <div
                  className={`team-ranking-return ${
                    row.returnRate >= 0 ? 'is-up' : 'is-down'
                  }`}
                >
                  {diff > 0 ? <ArrowUp /> : diff < 0 ? <ArrowDown /> : <Minus />}
                  {formatPercent(row.returnRate)}
                </div>
              </div>
              <div className="team-ranking-assets">
                {formatCompactCurrency(row.totalAssets)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
