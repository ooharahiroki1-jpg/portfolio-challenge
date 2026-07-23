import {
  ArrowLeft,
  ArrowRight,
  BadgeJapaneseYen,
  Building2,
  Newspaper,
  Sparkles,
  TrendingUp,
  Trophy,
  WalletCards
} from 'lucide-react';
import { useGame } from '../context/GameProvider';

const shortenSector = (sector: string) =>
  sector
    .replace('世界株インデックス', '世界株')
    .replace('IT・クラウド', 'クラウド')
    .replace('ゲーム・娯楽', 'ゲーム')
    .replace('航空・旅行', '旅行')
    .replace('電力・ガス', '電力')
    .replace('素材・化学', '素材');

const getTitleSize = (title: string) => {
  const length = [...title].length;
  if (length <= 12) return 128;
  if (length <= 15) return 106;
  if (length <= 18) return 84;
  return 64;
};

const KeywordIcon = ({ type }: { type: 'trend' | 'yen' | 'industry' }) => {
  if (type === 'yen') return <BadgeJapaneseYen />;
  if (type === 'industry') return <Building2 />;
  return <TrendingUp />;
};

export function NewsBriefingScreen() {
  const { state, currentRound, next, back } = useGame();
  const newsCopy = currentRound.preNews;
  const sentences = newsCopy.body.split('。').filter(Boolean).slice(0, 2);
  const keywords = newsCopy.relatedSectors.slice(0, 3).map((label, index) => ({
    label: shortenSector(label),
    icon: (['trend', 'yen', 'industry'] as const)[index]
  }));

  return (
    <section className="reference-screen pre-news-reference-screen">
      <header className="pre-news-header">
        <div className="pre-news-brand">
          <div className="pre-news-trophy" aria-hidden="true">
            <Trophy />
          </div>
          <div>
            <h1>100万円ポートフォリオ・チャレンジ</h1>
            <span className="pre-news-brand-pill">金融教育チーム対抗シミュレーションゲーム</span>
          </div>
        </div>

        <nav className="pre-news-steps" aria-label="進行状況">
          <div className="pre-news-step is-active">
            <span className="pre-news-step-icon">
              <Newspaper />
            </span>
            <strong>① NEWS</strong>
          </div>
          <span className="pre-news-step-line" aria-hidden="true" />
          <div className="pre-news-step">
            <span className="pre-news-step-icon">
              <WalletCards />
            </span>
            <strong>② 投資計画</strong>
          </div>
          <span className="pre-news-step-line" aria-hidden="true" />
          <div className="pre-news-step">
            <span className="pre-news-step-icon">
              <Sparkles />
            </span>
            <strong>③ イベント</strong>
          </div>
          <span className="pre-news-step-line" aria-hidden="true" />
          <div className="pre-news-step">
            <span className="pre-news-step-icon">
              <Trophy />
            </span>
            <strong>④ 結果確認</strong>
          </div>
        </nav>
      </header>

      <main className="pre-news-main-card pre-news-main-card-no-timer">
        <div className="pre-news-label">
          <Newspaper />
          <span>第{state.currentRound}回 事前ニュース</span>
        </div>
        <h2 style={{ fontSize: `calc(${getTitleSize(newsCopy.title)} * var(--ref-px))` }}>
          {newsCopy.title}
        </h2>
        <p>
          {sentences.map((line) => (
            <span key={line}>{line}。</span>
          ))}
        </p>
        <div className="pre-news-keywords">
          {keywords.map((keyword) => (
            <div key={keyword.label}>
              <KeywordIcon type={keyword.icon} />
              <strong>{keyword.label}</strong>
            </div>
          ))}
        </div>
      </main>

      <button type="button" className="pre-news-back" onClick={back}>
        <ArrowLeft />
        <span>{state.currentRound === 1 ? '状況把握へ戻る' : '前回の結果へ戻る'}</span>
      </button>
      <button type="button" className="pre-news-next" onClick={next}>
        <WalletCards />
        <span>投資計画へ</span>
        <ArrowRight />
      </button>
    </section>
  );
}
