import { useMemo } from 'react';
import { useGame } from '../context/GameProvider';
import { getLatestEventHistory } from '../lib/gameEngine';
import { formatCompactCurrency, formatPercent } from '../lib/formatters';
import { buildRanking } from '../lib/portfolio';
import { AssetPriceBoard } from '../components/ui/AssetPriceBoard';
import { AssetTrendChart } from '../components/ui/AssetTrendChart';
import { MetricCard } from '../components/ui/MetricCard';
import { NewsTicker } from '../components/ui/NewsTicker';
import { PortfolioDonutChart } from '../components/ui/PortfolioDonutChart';
import { TeamAssetCard } from '../components/ui/TeamAssetCard';
import { TeamRanking } from '../components/ui/TeamRanking';

export function MainDashboard() {
  const { state, currentRound, setActiveTeam } = useGame();
  const latestEvent = getLatestEventHistory(state);
  const ranking = buildRanking(state.teams, state.assets);
  const activeTeam =
    state.teams.find((team) => team.id === state.activeTeamId) ?? state.teams[0];
  const worldIndex = state.assets.find((asset) => asset.id === 'world-index');
  const bond = state.assets.find((asset) => asset.id === 'domestic-bond');
  const top = ranking[0];

  const marketSummary = useMemo(
    () =>
      `第${state.currentRound}回 / ${currentRound.preNews.title} / 世界株インデックス ${worldIndex?.price.toLocaleString('ja-JP')} / 国内債券 ${bond?.price.toLocaleString('ja-JP')}`,
    [bond?.price, currentRound.preNews.title, state.currentRound, worldIndex?.price]
  );

  return (
    <section className="grid h-full grid-rows-[auto_1fr_auto] gap-5">
      <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-5">
        <MetricCard
          label="現在の投資回数"
          value={`${state.currentRound}/${state.settings.investmentRounds}`}
          caption="投資機会"
        />
        <div className="rounded-lg border border-white/15 bg-white/8 p-5">
          <div className="text-xl font-bold text-slate-300">最新ニュース / 市場テーマ</div>
          <div className="mt-2 text-3xl font-black leading-tight text-white">
            {currentRound.preNews.title}
          </div>
          <div className="mt-4">
            <NewsTicker text={marketSummary} />
          </div>
        </div>
        <MetricCard
          label="現在トップ"
          value={top ? formatCompactCurrency(top.totalAssets) : '-'}
          caption={top ? `${top.team.name} ${formatPercent(top.returnRate)}` : ''}
          accent={top?.returnRate && top.returnRate < 0 ? 'red' : 'green'}
        />
      </div>

      <div className="grid min-h-0 grid-cols-[1.08fr_1.35fr_0.92fr] gap-5">
        <AssetPriceBoard assets={state.assets} latestEvent={latestEvent} dense />
        <AssetTrendChart teams={state.teams} />
        {activeTeam ? (
          <div className="grid min-h-0 grid-rows-[auto_1fr] gap-5">
            <div className="grid grid-cols-2 gap-3">
              {state.teams.map((team) => (
                <button
                  type="button"
                  key={team.id}
                  onClick={() => setActiveTeam(team.id)}
                  className={`rounded-lg border px-4 py-3 text-xl font-black ${
                    team.id === activeTeam.id
                      ? 'border-sky-300 bg-sky-400/20 text-white'
                      : 'border-white/15 bg-white/8 text-slate-200'
                  }`}
                >
                  {team.name}
                </button>
              ))}
            </div>
            <PortfolioDonutChart team={activeTeam} assets={state.assets} />
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-[1.2fr_1.2fr_1fr] gap-5">
        <TeamRanking teams={state.teams} assets={state.assets} compact />
        <div className="grid grid-cols-2 gap-4">
          {ranking.map((row) => (
            <TeamAssetCard
              key={row.team.id}
              team={row.team}
              assets={state.assets}
              rank={row.rank}
            />
          ))}
        </div>
        <div className="rounded-lg border border-white/15 bg-white/8 p-5">
          <div className="text-2xl font-black text-white">運営メモ</div>
          <div className="mt-4 grid gap-3 text-xl font-bold leading-relaxed text-slate-200">
            <div>次の操作は右下パネルまたはショートカットで進行。</div>
            <div>投資理由を確認してからイベントを発生。</div>
            <div>画面の流れに沿って次の判断へ進行。</div>
          </div>
        </div>
      </div>
    </section>
  );
}
