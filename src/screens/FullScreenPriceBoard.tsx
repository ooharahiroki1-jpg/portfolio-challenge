import { useMemo, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, ListFilter, Minus, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { AssetIcon } from '../components/ui/AssetIcon';
import { useGame } from '../context/GameProvider';
import { assetCategories } from '../lib/categories';
import { formatNumber, formatPercent } from '../lib/formatters';
import { getLatestEventHistory } from '../lib/gameEngine';
import type { Asset, AssetCategory } from '../types';

type Filter = 'all' | AssetCategory;
type SortKey = 'name' | 'category' | 'price-desc' | 'change-desc' | 'change-asc';
type EventBoardTrend = 'up' | 'down' | 'flat';

const getSparklineData = (trend: EventBoardTrend, seed: number) => {
  const wobble = [0, 3, -2, 4, -1, 2, -3, 3, -1, 4, 1, 5];
  return wobble.map((offset, index) => {
    const progress = index * 4;
    const direction = trend === 'up' ? progress : trend === 'down' ? -progress : 0;
    return { value: 50 + direction + offset + (seed % 4) };
  });
};

const getSparklineColor = (trend: EventBoardTrend) => {
  if (trend === 'up') {
    return '#0c9b35';
  }
  if (trend === 'down') {
    return '#ef1d2a';
  }
  return '#7b8493';
};

const EventSparkline = ({ trend, seed }: { trend: EventBoardTrend; seed: number }) => (
  <div className="event-price-sparkline" aria-hidden="true">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={getSparklineData(trend, seed)}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={getSparklineColor(trend)}
          strokeWidth={4.8}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const moodLabels = {
  bullish: '強気',
  optimistic: '前向き',
  cautious: '警戒',
  panic: '不安',
  recovery: '回復'
} as const;

const moodAngles = {
  bullish: -150,
  optimistic: -125,
  cautious: -42,
  panic: -15,
  recovery: -105
} as const;

const getChange = (asset: Asset, latestEvent?: ReturnType<typeof getLatestEventHistory>) => {
  if (!latestEvent) {
    return asset.initialPrice > 0
      ? ((asset.price - asset.initialPrice) / asset.initialPrice) * 100
      : 0;
  }
  const before = latestEvent.beforeAssets[asset.id] ?? asset.initialPrice;
  const after = latestEvent.afterAssets[asset.id] ?? asset.price;
  return before > 0 ? ((after - before) / before) * 100 : 0;
};

const getBoardNameFontSize = (name: string) => {
  const length = [...name].length;
  if (length >= 9) return 20;
  if (length >= 7) return 22;
  return 25;
};

export function FullScreenPriceBoard() {
  const { state, currentEvent, next, back, goToPhase } = useGame();
  const latestEvent = getLatestEventHistory(state);
  const updateMode = state.gamePhase === 'asset-update';
  const [filter, setFilter] = useState<Filter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('category');
  const [query, setQuery] = useState('');

  const eventBoardRows = useMemo(
    () =>
      state.assets.map((asset, index) => {
        const before = latestEvent?.beforeAssets[asset.id] ?? asset.initialPrice;
        const after = latestEvent?.afterAssets[asset.id] ?? asset.price;
        const delta = after - before;
        const percent = before > 0 ? (delta / before) * 100 : 0;
        return {
          no: index + 1,
          name: asset.name,
          sector: asset.sector,
          price: after,
          delta,
          percent,
          trend: (delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat') as EventBoardTrend
        };
      }),
    [latestEvent, state.assets]
  );
  const eventBoardRowsByLine = [eventBoardRows.slice(0, 11), eventBoardRows.slice(11)];
  const trendCounts = eventBoardRows.reduce(
    (counts, row) => ({ ...counts, [row.trend]: counts[row.trend] + 1 }),
    { up: 0, down: 0, flat: 0 }
  );

  const visibleAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return state.assets
      .filter((asset) => filter === 'all' || asset.category === filter)
      .filter(
        (asset) =>
          !normalizedQuery ||
          asset.name.toLowerCase().includes(normalizedQuery) ||
          asset.sector.toLowerCase().includes(normalizedQuery)
      )
      .sort((a, b) => {
        if (sortKey === 'name') return a.name.localeCompare(b.name, 'ja');
        if (sortKey === 'price-desc') return b.price - a.price;
        if (sortKey === 'change-desc') return getChange(b, latestEvent) - getChange(a, latestEvent);
        if (sortKey === 'change-asc') return getChange(a, latestEvent) - getChange(b, latestEvent);
        return a.category.localeCompare(b.category, 'ja') || a.name.localeCompare(b.name, 'ja');
      });
  }, [filter, latestEvent, query, sortKey, state.assets]);

  if (updateMode) {
    return (
      <section className="reference-screen event-price-board-reference-screen">
        <header className="event-price-header">
          <div className="event-price-flow">
            <span>イベント 3</span>
            <ArrowRight />
            <strong>株価ボード 4</strong>
          </div>
          <h1>全{state.assets.length}銘柄 株価ボード</h1>
          <p>{currentEvent.title}<br />株価変動結果</p>
          <div className="event-price-header-actions">
            <button type="button" className="event-price-back-button" onClick={back}>
              <ArrowLeft />
              <span>戻る</span>
            </button>
            <button type="button" className="event-price-result-button" onClick={next}>
              <span>結果を確認する</span>
              <ArrowRight />
            </button>
          </div>
        </header>

        <main className="event-price-grid">
          {eventBoardRowsByLine.map((rows, rowIndex) => (
            <div
              key={rowIndex === 0 ? 'top' : 'bottom'}
              className={`event-price-row ${
                rowIndex === 0 ? 'event-price-row-top' : 'event-price-row-bottom'
              }`}
            >
              {rows.map((row) => {
                const TrendIcon =
                  row.trend === 'up' ? TrendingUp : row.trend === 'down' ? TrendingDown : Minus;
                const labelLength = Math.max([...row.sector].length, [...row.name].length);
                return (
                  <article key={row.no} className={`event-price-card is-${row.trend}`}>
                    <div className="event-price-card-head">
                      <span>{row.no}</span>
                      <strong
                        className={
                          labelLength >= 9
                            ? 'is-extra-long'
                            : labelLength >= 7
                              ? 'is-long'
                              : undefined
                        }
                      >
                        <span>{row.sector}</span>
                        <small>{row.name}</small>
                      </strong>
                    </div>
                    <em>{formatNumber(row.price)}</em>
                    <b>
                      <span>{row.delta > 0 ? '+' : ''}{formatNumber(row.delta)}</span>
                      <span>{formatPercent(row.percent, 2)}</span>
                    </b>
                    <TrendIcon className="event-price-direction" />
                    <EventSparkline trend={row.trend} seed={row.no} />
                  </article>
                );
              })}
            </div>
          ))}
        </main>

        <aside className="event-price-summary">
          <div className="event-price-summary-card is-up">
            <TrendingUp />
            <span>上昇</span>
            <strong>{trendCounts.up}</strong>
            <em>銘柄</em>
          </div>
          <div className="event-price-summary-card is-down">
            <TrendingDown />
            <span>下落</span>
            <strong>{trendCounts.down}</strong>
            <em>銘柄</em>
          </div>
          <div className="event-price-summary-card is-flat">
            <Minus />
            <span>変わらず</span>
            <strong>{trendCounts.flat}</strong>
            <em>銘柄</em>
          </div>
          <div className={`event-price-mood is-${currentEvent.marketMood}`}>
            <span>市場ムード</span>
            <div className="event-price-gauge-meter" aria-hidden="true">
              <i
                style={{
                  transform: `translateX(-6%) rotate(${moodAngles[currentEvent.marketMood]}deg)`
                } as CSSProperties}
              />
            </div>
            <strong>{moodLabels[currentEvent.marketMood]}</strong>
          </div>
        </aside>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col gap-2 bg-market-grid p-4">
      <div className="rounded-lg border border-sky-100 bg-white/95 p-3 shadow-glow">
        <div className="grid grid-cols-[1fr_auto] items-center gap-4">
          <div>
            <div
              className={`font-black leading-none text-slate-950 ${
                updateMode ? 'text-4xl' : 'text-5xl'
              }`}
            >
              {updateMode ? 'イベント発生後 株価確認' : '全画面 価格ボード'}
            </div>
            <div
              className={`mt-1 font-black text-slate-600 ${
                updateMode ? 'text-xl' : 'text-2xl'
              }`}
            >
              第{state.currentRound}ラウンド /{' '}
              {updateMode
                ? '変動後の株価を大きく確認'
                : '業種・企業名・株価を大きく表示'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!updateMode ? (
              <button
                type="button"
                onClick={() => goToPhase('team-analysis')}
                className="rounded-lg border border-sky-200 bg-white px-5 py-3 text-2xl font-black text-sky-700"
              >
                チーム分析
              </button>
            ) : null}
            <button
              type="button"
              onClick={next}
              className={`inline-flex items-center gap-2 rounded-lg border border-sky-400 bg-sky-400 font-black text-slate-950 shadow-sm ${
                updateMode ? 'px-5 py-2 text-2xl' : 'px-6 py-3 text-2xl'
              }`}
            >
              {updateMode ? '順位発表へ' : '株購入計画へ'}
              <ArrowRight className="h-8 w-8" />
            </button>
          </div>
        </div>
        {!updateMode ? (
          <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-3">
            <div className="flex items-center gap-3 overflow-hidden rounded-lg border border-sky-100 bg-sky-50 px-4">
              <Search className="h-7 w-7 text-sky-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="銘柄・業種を検索"
                className="h-12 w-full bg-transparent text-2xl font-black text-slate-900 outline-none"
              />
            </div>
            <label className="flex w-fit items-center gap-2 rounded-lg border border-sky-100 bg-white px-3">
              <ListFilter className="h-7 w-7 text-sky-500" />
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value as Filter)}
                className="h-12 w-[178px] bg-white text-2xl font-black text-slate-900 outline-none"
              >
                <option value="all">全カテゴリー</option>
                {assetCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className="h-12 w-[186px] rounded-lg border border-sky-100 bg-white px-3 text-2xl font-black text-slate-900"
            >
              <option value="category">カテゴリー順</option>
              <option value="name">銘柄名順</option>
              <option value="price-desc">株価が高い順</option>
              <option value="change-desc">上昇率が高い順</option>
              <option value="change-asc">下落率が大きい順</option>
            </select>
          </div>
        ) : null}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-5 grid-rows-5 gap-2 overflow-hidden">
        {visibleAssets.map((asset) => {
          const change = getChange(asset, latestEvent);
          const positive = change > 0;
          const negative = change < 0;
          return (
            <div
              key={asset.id}
              className={`flex min-h-0 flex-col justify-between overflow-hidden rounded-lg border shadow-sm ${
                positive
                  ? 'border-emerald-200 bg-emerald-50'
                  : negative
                    ? 'border-red-200 bg-red-50'
                    : 'border-sky-100 bg-white'
              } px-3 py-2`}
            >
              <div className="flex min-h-0 min-w-0 items-start gap-2">
                <AssetIcon icon={asset.icon} color={asset.color} className="h-7 w-7" />
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div
                    className="font-black leading-tight text-slate-950"
                    style={{ fontSize: getBoardNameFontSize(asset.name) }}
                  >
                    {asset.name}
                  </div>
                  <div className="text-base font-black leading-tight text-slate-600">
                    {asset.sector}
                  </div>
                </div>
              </div>
              <div className="self-end text-4xl font-black leading-none text-slate-950">
                {formatNumber(asset.price)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
