import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Crown,
  HelpCircle,
  Lightbulb,
  Settings,
  ShieldCheck,
  Skull,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users
} from 'lucide-react';
import { useMemo } from 'react';
import { useGame } from '../context/GameProvider';
import { getEventById } from '../data/events';
import { formatNumber, formatPercent } from '../lib/formatters';
import { getLatestEventHistory, shouldAutoTriggerShock } from '../lib/gameEngine';
import { buildRanking, getCategoryAllocation } from '../lib/portfolio';
import type { AssetCategory, Team } from '../types';

const categoryColors: Record<AssetCategory, string> = {
  金融: '#0B63F6',
  成長株: '#6D35E8',
  景気敏感: '#F59E0B',
  消費: '#F97316',
  守り: '#15B8A6',
  資源: '#22C55E',
  世界株: '#1086F4',
  債券: '#8B95AA',
  現金: '#A7B0C0'
};

const teamIconClass: Record<string, string> = {
  'team-a': 'is-blue',
  'team-b': 'is-green',
  'team-c': 'is-orange',
  'team-d': 'is-purple',
  'team-e': 'is-purple',
  'team-f': 'is-orange'
};

const moodLabels = {
  bullish: '強気',
  optimistic: '前向き',
  cautious: '警戒',
  panic: '不安',
  recovery: '回復'
} as const;

const getTeamReason = (team: Team, round: number) =>
  team.orders.filter((order) => order.round === round).at(-1)?.reason ||
  team.strategy ||
  'このラウンドは注文なし（現金を維持）';

const makePortfolioRows = (team: Team, assets: Parameters<typeof getCategoryAllocation>[1]) => {
  const allocation = getCategoryAllocation(team, assets);
  const total = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  const rows = Object.entries(allocation)
    .map(([label, value]) => ({
      label: label as AssetCategory,
      ratio: total > 0 ? Math.round((value / total) * 100) : 0
    }))
    .filter((row) => row.ratio > 0)
    .sort((a, b) => b.ratio - a.ratio);

  return rows.slice(0, 6);
};

const makeDonut = (rows: Array<{ label: AssetCategory; ratio: number }>) => {
  let start = 0;
  const stops = rows.map((row) => {
    const end = start + row.ratio;
    const part = `${categoryColors[row.label]} ${start}% ${end}%`;
    start = end;
    return part;
  });
  if (start < 100) stops.push(`#E2E8F0 ${start}% 100%`);
  return `conic-gradient(${stops.join(', ')})`;
};

export function RankingUpdateScreen() {
  const { state, currentEvent, next, back } = useGame();
  const ranking = useMemo(() => buildRanking(state.teams, state.assets), [
    state.assets,
    state.teams
  ]);
  const shockPending = shouldAutoTriggerShock(state);
  const nextLabel =
    state.currentRound >= state.settings.investmentRounds
      ? '結果発表へ進む'
      : shockPending
        ? '異常シグナルを確認'
        : `第${state.currentRound + 1}回の事前ニュースへ`;
  const latestNormalEvent = getLatestEventHistory(state, 'normal');
  const resultEvent = latestNormalEvent
    ? getEventById(latestNormalEvent.eventId)
    : currentEvent;
  const sortedEffects = Object.entries(resultEvent.sectorEffects).sort(
    (a, b) => b[1] - a[1]
  );
  const rising = sortedEffects.filter(([, value]) => value > 0).slice(0, 2).map(([sector]) => sector);
  const falling = sortedEffects.filter(([, value]) => value < 0).slice(-2).reverse().map(([sector]) => sector);
  const teamGridStyle = {
    gridTemplateColumns: `repeat(${state.teams.length}, minmax(0, 1fr))`
  };

  return (
    <section className={`reference-screen event-after-ranking-screen team-count-${state.teams.length}`}>
      <header className="event-after-header">
        <div className="event-after-brand">
          <BarChart3 />
          <span>金融教育チーム対抗シミュレーション</span>
        </div>
        <nav className="event-after-tools" aria-label="メニュー">
          <button type="button" aria-label="ランキング">
            <Crown />
            <span>ランキング</span>
          </button>
          <button type="button" aria-label="設定">
            <Settings />
            <span>設定</span>
          </button>
          <button type="button" aria-label="遊び方">
            <HelpCircle />
            <span>遊び方</span>
          </button>
        </nav>
        <h1>イベント発生後の結果確認</h1>
        <p>ランキング・購入理由・各チームのポートフォリオ</p>
      </header>

      <section className="event-after-summary-card">
        <div className="event-after-summary-icon">
          <TrendingUp />
        </div>
        <div>
          <span>今回のイベント</span>
          <strong>イベント結果: {resultEvent.title}</strong>
          <p>{rising.join('・')}が上昇。<br />{falling.join('・')}が下落。</p>
        </div>
        <div className="event-after-mood">
          <span>市場ムード:</span>
          <div className="event-after-gauge" aria-hidden="true">
            <i />
          </div>
          <strong>{moodLabels[resultEvent.marketMood]}</strong>
        </div>
      </section>

      <section className="event-after-ranking-card">
        <div className="event-after-section-title">
          <Trophy />
          <span>ランキング（総資産額）</span>
        </div>
        <div className="event-after-rank-list" style={teamGridStyle}>
          {ranking.map((row) => {
            const positive = row.returnRate >= 0;
            return (
              <article key={row.team.id} className={`event-after-rank-card rank-${row.rank}`}>
                {row.rank === 1 ? (
                  <div className="event-after-rank-trophy">
                    <Trophy />
                  </div>
                ) : null}
                <div className="event-after-rank-badge">{row.rank}位</div>
                <div className={`event-after-team-name ${teamIconClass[row.team.id] ?? ''}`}>
                  <Users />
                  <span>{row.team.name}</span>
                </div>
                <strong>{formatNumber(row.totalAssets)}円</strong>
                <em className={positive ? 'is-positive' : 'is-negative'}>
                  {formatPercent(row.returnRate)}
                  {positive ? <TrendingUp /> : <TrendingDown />}
                </em>
              </article>
            );
          })}
        </div>
      </section>

      <section className="event-after-reasons">
        <div className="event-after-section-title">
          <Lightbulb />
          <span>各チームの購入理由</span>
        </div>
        <div className="event-after-reason-grid" style={teamGridStyle}>
          {state.teams.map((team) => (
            <article key={team.id} className="event-after-reason-card">
              <div className={`event-after-reason-icon ${teamIconClass[team.id] ?? ''}`}>
                {team.id === 'team-c' ? <ShieldCheck /> : team.id === 'team-d' ? <Sparkles /> : <TrendingUp />}
              </div>
              <div>
                <h2>
                  <Users />
                  {team.name}
                </h2>
                <p>{getTeamReason(team, state.currentRound)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="event-after-portfolios">
        <div className="event-after-section-title">
          <BarChart3 />
          <span>各チームのポートフォリオ（資産配分）</span>
        </div>
        <div className="event-after-portfolio-grid" style={teamGridStyle}>
          {state.teams.map((team) => {
            const rows = makePortfolioRows(team, state.assets);
            return (
              <article key={team.id} className="event-after-portfolio-card">
                <h2 className={teamIconClass[team.id] ?? ''}>
                  <Users />
                  {team.name}
                </h2>
                <div className="event-after-donut-wrap">
                  <div className="event-after-donut" style={{ background: makeDonut(rows) }}>
                    <div>
                      {team.id === 'team-a' ? <BarChart3 /> : team.id === 'team-b' ? <Trophy /> : team.id === 'team-c' ? <ShieldCheck /> : <Crown />}
                    </div>
                  </div>
                  <dl>
                    {rows.slice(0, 5).map((row) => (
                      <div key={row.label}>
                        <dt>
                          <i style={{ backgroundColor: categoryColors[row.label] }} />
                          {row.label}
                        </dt>
                        <dd>{row.ratio}%</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="event-after-learning">
        <Star />
        <span>イベント後の値動きと投資判断を振り返ろう</span>
        <BookOpen />
        <BarChart3 />
        <Lightbulb />
      </div>

      <div className={`event-after-actions ${shockPending ? 'is-shock-pending' : ''}`}>
        <button type="button" className="event-after-back" onClick={back}>
          <ArrowLeft />
          <span>戻る</span>
        </button>
        <button
          type="button"
          className={`event-after-next ${shockPending ? 'is-shock-trigger' : ''}`}
          onClick={next}
          aria-label={nextLabel}
        >
          {shockPending ? <Skull /> : null}
          <span>{nextLabel}</span>
          {shockPending ? null : <ArrowRight />}
        </button>
      </div>
    </section>
  );
}
