import { ArrowRight, BarChart3, BriefcaseBusiness } from 'lucide-react';
import { TeamRanking } from '../components/ui/TeamRanking';
import { useGame } from '../context/GameProvider';
import { formatCompactCurrency, formatNumber } from '../lib/formatters';
import { findAsset } from '../lib/portfolio';
import type { Asset, Team } from '../types';

function PurchasedPortfolio({ team, assets }: { team: Team; assets: Asset[] }) {
  return (
    <div className="analysis-portfolio-card">
      <div className="analysis-team-name">
        <span style={{ backgroundColor: team.color }} />
        {team.name}
      </div>
      {team.holdings.length === 0 ? (
        <div className="analysis-empty">購入銘柄なし</div>
      ) : (
        <div className="analysis-holdings">
          {team.holdings.map((holding) => {
            const asset = findAsset(assets, holding.assetId);
            return (
              <div key={holding.assetId}>
                <strong>{asset.name}</strong>
                <span>{formatNumber(holding.quantity)}口</span>
                <em>{formatCompactCurrency(holding.quantity * asset.price)}</em>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function TeamAnalysisScreen() {
  const { state, next, goToPhase } = useGame();

  return (
    <section className="analysis-screen">
      <div className="analysis-bg" />
      <header className="analysis-header">
        <div>
          <BarChart3 />
          <span>チーム分析</span>
        </div>
        <p>総資産額ランキング / 購入銘柄ポートフォリオ</p>
        <div className="analysis-actions">
          <button type="button" onClick={() => goToPhase('price-board')}>
            価格ボードへ
          </button>
          <button type="button" onClick={next}>
            注文入力へ
            <ArrowRight />
          </button>
        </div>
      </header>

      <main className="analysis-grid">
        <TeamRanking teams={state.teams} assets={state.assets} />
        <section className="analysis-portfolios">
          <div className="analysis-portfolios-title">
            <BriefcaseBusiness />
            購入銘柄ポートフォリオ
          </div>
          <div
            className="analysis-portfolio-grid"
            style={{
              gridTemplateRows: `repeat(${state.teams.length}, minmax(0, 1fr))`
            }}
          >
            {state.teams.map((team) => (
              <PurchasedPortfolio key={team.id} team={team} assets={state.assets} />
            ))}
          </div>
        </section>
      </main>
    </section>
  );
}
