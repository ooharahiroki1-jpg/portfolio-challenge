import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Gauge,
  Lightbulb,
  Newspaper,
  ShieldAlert,
  TrendingUp,
  Trophy,
  WalletCards
} from 'lucide-react';
import { AssetIcon } from '../components/ui/AssetIcon';
import { useGame } from '../context/GameProvider';

const moodLabels = {
  bullish: '強気',
  optimistic: '前向き',
  cautious: '警戒',
  panic: '不安',
  recovery: '回復'
} as const;

const getEventTitleSize = (title: string) => {
  const length = [...title].length;
  if (length <= 6) return 108;
  if (length <= 8) return 88;
  if (length <= 10) return 70;
  if (length <= 12) return 58;
  return 52;
};

export function EventRevealScreen() {
  const { state, currentEvent, applyCurrentEvent, back } = useGame();
  const rankedSectors = Object.entries(currentEvent.sectorEffects).sort(
    (a, b) => b[1] - a[1]
  );
  const makeSector = ([label]: [string, number]) => ({
    label,
    icon: state.assets.find((asset) => asset.sector === label)?.icon ?? 'Building2'
  });
  const positiveSectors = rankedSectors.filter(([, value]) => value > 0).slice(0, 4).map(makeSector);
  const negativeSectors = rankedSectors.filter(([, value]) => value < 0).slice(-4).reverse().map(makeSector);
  const descriptionLines = currentEvent.description.split('。').filter(Boolean).slice(0, 2);
  const highlights = currentEvent.highlights ?? descriptionLines;

  return (
    <section className="reference-screen event-result-reference-screen">
      <header className="event-result-header">
        <div className="event-result-brand">
          <Trophy />
          <div>
            <h1>100万円ポートフォリオ・チャレンジ</h1>
            <span>金融教育チーム対抗シミュレーションゲーム</span>
          </div>
        </div>

        <nav className="event-result-steps" aria-label="進行状況">
          <div className="event-result-step">
            <span>
              <Newspaper />
            </span>
            <strong>① ニュース</strong>
          </div>
          <i aria-hidden="true">→</i>
          <div className="event-result-step">
            <span>
              <WalletCards />
            </span>
            <strong>② 投資</strong>
          </div>
          <i aria-hidden="true">→</i>
          <div className="event-result-step is-active">
            <span>
              <ShieldAlert />
            </span>
            <strong>③ イベント</strong>
          </div>
          <i aria-hidden="true">→</i>
          <div className="event-result-step">
            <span>
              <BarChart3 />
            </span>
            <strong>④ 株価</strong>
          </div>
          <i aria-hidden="true">→</i>
          <div className="event-result-step">
            <span>
              <Trophy />
            </span>
            <strong>⑤ 結果</strong>
          </div>
        </nav>
      </header>

      <main className="event-result-hero">
        <h2>
          イベント発生！
          <br />
          <span style={{ fontSize: `calc(${getEventTitleSize(currentEvent.title)} * var(--ref-px))` }}>
            {currentEvent.title}
          </span>
        </h2>
        <p>
          {descriptionLines.map((line) => (
            <span key={line}>{line}。</span>
          ))}
        </p>
      </main>

      <section className="event-result-market-card">
        <div>今回の市場イベント</div>
        <TrendingUp />
        <ul>
          {highlights.slice(0, 3).map((highlight) => (
            <li key={highlight}>
              <CheckCircle2 />
              {highlight}
            </li>
          ))}
        </ul>
      </section>

      <section className="event-result-sector-card is-up">
        <strong>上がりやすい業種</strong>
        <div style={{ gridTemplateColumns: `repeat(${Math.max(1, positiveSectors.length)}, minmax(0, 1fr))` }}>
          {positiveSectors.map((sector) => (
            <span key={sector.label}>
              <AssetIcon icon={sector.icon} color="#14a73a" />
              {sector.label}
            </span>
          ))}
        </div>
      </section>

      <section className="event-result-sector-card is-down">
        <strong>下がりやすい業種</strong>
        <div style={{ gridTemplateColumns: `repeat(${Math.max(1, negativeSectors.length)}, minmax(0, 1fr))` }}>
          {negativeSectors.map((sector) => (
            <span key={sector.label}>
              <AssetIcon icon={sector.icon} color="#e11d2e" />
              {sector.label}
            </span>
          ))}
        </div>
      </section>

      <aside className="event-result-learning">
        <div>
          <Lightbulb />
          <strong>学習ポイント</strong>
        </div>
        <p>
          {currentEvent.lesson}
        </p>
      </aside>

      <aside className={`event-result-mood is-${currentEvent.marketMood}`}>
        <div>市場ムード</div>
        <Gauge />
        <strong>{moodLabels[currentEvent.marketMood]}</strong>
      </aside>

      <button type="button" className="event-result-back" onClick={back}>
        <ArrowLeft />
        投資計画へ戻る
      </button>
      <button type="button" className="event-result-next" onClick={applyCurrentEvent}>
        <TrendingUp />
        株価ボードで確認
        <ArrowRight />
      </button>
    </section>
  );
}
