import {
  BookOpenText,
  BriefcaseBusiness,
  History,
  Newspaper,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  X
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { getEventById } from '../../data/events';
import { getScenarioRound } from '../../data/scenarios';
import { useGame } from '../../context/GameProvider';
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  formatPercent
} from '../../lib/formatters';
import { getHoldingValue, getTeamTotalAssets } from '../../lib/portfolio';

type MemoryTab = 'holdings' | 'orders' | 'events';

const hiddenPhases = new Set(['start', 'setup', 'scenario-select']);

const tabs: Array<{
  id: MemoryTab;
  label: string;
  icon: typeof BriefcaseBusiness;
}> = [
  { id: 'holdings', label: 'いまの保有株', icon: BriefcaseBusiness },
  { id: 'orders', label: '売買した記録', icon: ReceiptText },
  { id: 'events', label: 'ニュース・できごと', icon: History }
];

export function GameMemoryBoard() {
  const { state } = useGame();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MemoryTab>('holdings');
  const [selectedTeamId, setSelectedTeamId] = useState(state.activeTeamId);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const selectedTeam =
    state.teams.find((team) => team.id === selectedTeamId) ?? state.teams[0];
  const currentNews = getScenarioRound(state.selectedScenarioId, state.currentRound).preNews;
  const assetsById = useMemo(
    () => new Map(state.assets.map((asset) => [asset.id, asset])),
    [state.assets]
  );

  const holdings = useMemo(() => {
    if (!selectedTeam) return [];
    return selectedTeam.holdings
      .map((holding) => ({
        holding,
        asset: assetsById.get(holding.assetId)
      }))
      .filter((item) => item.asset)
      .sort(
        (left, right) =>
          right.holding.quantity * right.asset!.price -
          left.holding.quantity * left.asset!.price
      );
  }, [assetsById, selectedTeam]);

  const orders = useMemo(() => {
    if (!selectedTeam) return [];
    return selectedTeam.orders
      .map((order) => ({ order, asset: assetsById.get(order.assetId) }))
      .filter((item) => item.asset)
      .sort((left, right) => right.order.createdAt.localeCompare(left.order.createdAt));
  }, [assetsById, selectedTeam]);

  const eventEntries = useMemo(
    () =>
      state.eventHistory
        .slice()
        .sort((left, right) => {
          if (left.round !== right.round) return right.round - left.round;
          return right.createdAt.localeCompare(left.createdAt);
        }),
    [state.eventHistory]
  );

  useEffect(() => {
    if (!state.teams.some((team) => team.id === selectedTeamId)) {
      setSelectedTeamId(state.activeTeamId || state.teams[0]?.id || '');
    }
  }, [selectedTeamId, state.activeTeamId, state.teams]);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [open]);

  if (hiddenPhases.has(state.gamePhase) || state.teams.length === 0) {
    return null;
  }

  const openBoard = () => {
    setSelectedTeamId(state.activeTeamId || state.teams[0]?.id || '');
    setOpen(true);
  };

  const totalAssets = selectedTeam ? getTeamTotalAssets(selectedTeam, state.assets) : 0;
  const holdingsValue = selectedTeam ? getHoldingValue(selectedTeam, state.assets) : 0;

  return (
    <>
      {!open ? (
        <button
          type="button"
          className="game-memory-trigger"
          onClick={openBoard}
          aria-label="ゲーム記録を開く"
        >
          <BookOpenText aria-hidden="true" />
          <span>ゲーム<br />記録</span>
        </button>
      ) : null}

      {open ? (
        <section
          className="game-memory-board"
          role="dialog"
          aria-modal="true"
          aria-labelledby="game-memory-title"
        >
          <header className="game-memory-header">
            <div className="game-memory-heading">
              <BookOpenText aria-hidden="true" />
              <div>
                <h1 id="game-memory-title">ゲーム記録</h1>
                <p>何を買ったか、何が起きたかをいつでも確認</p>
              </div>
            </div>
            <div className="game-memory-round">第{state.currentRound}回</div>
            <button
              ref={closeButtonRef}
              type="button"
              className="game-memory-close"
              onClick={() => setOpen(false)}
              aria-label="ゲーム記録を閉じる"
              title="閉じる"
            >
              <X aria-hidden="true" />
            </button>
          </header>

          <nav className="game-memory-tabs" aria-label="ゲーム記録の表示切替">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={activeTab === tab.id ? 'is-active' : ''}
                  aria-selected={activeTab === tab.id}
                  role="tab"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {activeTab !== 'events' && selectedTeam ? (
            <div
              className={`game-memory-team-tabs team-count-${state.teams.length}`}
              aria-label="チームを選択"
            >
              {state.teams.map((team) => (
                <button
                  key={team.id}
                  type="button"
                  className={team.id === selectedTeam.id ? 'is-active' : ''}
                  style={{ '--memory-team-color': team.color } as CSSProperties}
                  onClick={() => setSelectedTeamId(team.id)}
                >
                  <span aria-hidden="true" />
                  {team.name}
                </button>
              ))}
            </div>
          ) : null}

          <div className="game-memory-content">
            {activeTab === 'holdings' && selectedTeam ? (
              <div className="game-memory-holdings">
                <section
                  className="game-memory-summary"
                  style={{ '--memory-team-color': selectedTeam.color } as CSSProperties}
                >
                  <div className="game-memory-summary-team">
                    <span>{selectedTeam.name}</span>
                    <strong>保有銘柄 {holdings.length}種類</strong>
                  </div>
                  <dl>
                    <div>
                      <dt>総資産</dt>
                      <dd>{formatCompactCurrency(totalAssets)}</dd>
                    </div>
                    <div>
                      <dt>株式評価額</dt>
                      <dd>{formatCompactCurrency(holdingsValue)}</dd>
                    </div>
                    <div>
                      <dt>現金</dt>
                      <dd>{formatCompactCurrency(selectedTeam.cash)}</dd>
                    </div>
                  </dl>
                </section>

                {holdings.length > 0 ? (
                  <div className="game-memory-holding-list">
                    {holdings.map(({ holding, asset }) => {
                      if (!asset) return null;
                      const value = holding.quantity * asset.price;
                      const gainRate =
                        holding.averageCost > 0
                          ? ((asset.price - holding.averageCost) / holding.averageCost) * 100
                          : 0;
                      return (
                        <article key={holding.assetId} className="game-memory-holding-row">
                          <span
                            className="game-memory-asset-mark"
                            style={{ backgroundColor: asset.color }}
                            aria-hidden="true"
                          >
                            {asset.name.slice(0, 1)}
                          </span>
                          <div className="game-memory-asset-name">
                            <span>{asset.sector}</span>
                            <strong>{asset.name}</strong>
                          </div>
                          <div className="game-memory-quantity">
                            <span>保有数</span>
                            <strong>{formatNumber(holding.quantity)}株</strong>
                          </div>
                          <div className="game-memory-holding-value">
                            <span>現在の評価額</span>
                            <strong>{formatCurrency(value)}</strong>
                            <em className={gainRate >= 0 ? 'is-up' : 'is-down'}>
                              {gainRate >= 0 ? <TrendingUp /> : <TrendingDown />}
                              {formatPercent(gainRate)}
                            </em>
                          </div>
                          <div className="game-memory-prices">
                            平均購入 {formatCurrency(holding.averageCost)}
                            <b>現在 {formatCurrency(asset.price)}</b>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="game-memory-empty">
                    <BriefcaseBusiness aria-hidden="true" />
                    <strong>まだ株を保有していません</strong>
                    <span>「売買した記録」では、これまでの注文を確認できます。</span>
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === 'orders' && selectedTeam ? (
              <div className="game-memory-orders">
                <div className="game-memory-section-title">
                  <ReceiptText aria-hidden="true" />
                  <div>
                    <span>{selectedTeam.name}</span>
                    <strong>これまでの売買 {orders.length}件</strong>
                  </div>
                </div>
                {orders.length > 0 ? (
                  <div className="game-memory-order-list">
                    {orders.map(({ order, asset }) => {
                      if (!asset) return null;
                      return (
                        <article key={order.id} className="game-memory-order-row">
                          <div className={`game-memory-order-side is-${order.side}`}>
                            <span>第{order.round}回</span>
                            <strong>{order.side === 'buy' ? '買い' : '売り'}</strong>
                          </div>
                          <div className="game-memory-order-asset">
                            <span>{asset.sector}</span>
                            <strong>{asset.name}</strong>
                          </div>
                          <div className="game-memory-order-quantity">
                            <span>売買した数</span>
                            <strong>{formatNumber(order.quantity)}株</strong>
                          </div>
                          <div className="game-memory-order-money">
                            <span>{formatCurrency(order.price)} × {formatNumber(order.quantity)}株</span>
                            <strong>{formatCurrency(order.totalAmount)}</strong>
                          </div>
                          <div className="game-memory-order-reason">
                            <span>投資理由</span>
                            <strong>{order.reason || '理由は未入力です'}</strong>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="game-memory-empty">
                    <ReceiptText aria-hidden="true" />
                    <strong>まだ売買記録がありません</strong>
                    <span>注文が確定すると、銘柄・株数・理由がここに残ります。</span>
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === 'events' ? (
              <div className="game-memory-events">
                <section className="game-memory-current-news">
                  <div className="game-memory-news-label">
                    <Newspaper aria-hidden="true" />
                    <span>第{state.currentRound}回・いま考えるニュース</span>
                  </div>
                  <h2>{currentNews.title}</h2>
                  <p>{currentNews.body}</p>
                </section>

                <section className="game-memory-event-history">
                  <div className="game-memory-section-title">
                    <History aria-hidden="true" />
                    <div>
                      <span>発生した順に記録</span>
                      <strong>これまでのできごと {eventEntries.length}件</strong>
                    </div>
                  </div>
                  {eventEntries.length > 0 ? (
                    <div className="game-memory-event-list">
                      {eventEntries.map((entry) => {
                        const event = getEventById(entry.eventId);
                        const effects = Object.entries(event.sectorEffects);
                        const rising = effects
                          .filter(([, value]) => value > 0)
                          .sort((left, right) => right[1] - left[1])
                          .slice(0, 3);
                        const falling = effects
                          .filter(([, value]) => value < 0)
                          .sort((left, right) => left[1] - right[1])
                          .slice(0, 3);
                        return (
                          <article
                            key={entry.id}
                            className={`game-memory-event-row is-${entry.phase}`}
                          >
                            <div className="game-memory-event-number">
                              <span>第{entry.round}回</span>
                              <strong>{entry.phase === 'shock' ? '緊急リスク' : '市場イベント'}</strong>
                            </div>
                            <div className="game-memory-event-copy">
                              <h3>{event.title}</h3>
                              <p>{event.description}</p>
                            </div>
                            <div className="game-memory-event-effects">
                              {rising.length > 0 ? (
                                <div className="is-up">
                                  <TrendingUp aria-hidden="true" />
                                  <span>上昇</span>
                                  <strong>{rising.map(([sector]) => sector).join('・')}</strong>
                                </div>
                              ) : null}
                              {falling.length > 0 ? (
                                <div className="is-down">
                                  <TrendingDown aria-hidden="true" />
                                  <span>下落</span>
                                  <strong>{falling.map(([sector]) => sector).join('・')}</strong>
                                </div>
                              ) : null}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="game-memory-empty game-memory-empty-events">
                      <History aria-hidden="true" />
                      <strong>まだイベントは発生していません</strong>
                      <span>現在の事前ニュースを見て、どの株を売買するか考えましょう。</span>
                    </div>
                  )}
                </section>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
