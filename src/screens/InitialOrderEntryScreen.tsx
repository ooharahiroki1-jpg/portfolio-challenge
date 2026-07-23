import { useMemo, useState, type CSSProperties } from 'react';
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  ClipboardList,
  Minus,
  Play,
  Plus,
  Users
} from 'lucide-react';
import { AssetIcon } from '../components/ui/AssetIcon';
import { useGame } from '../context/GameProvider';
import { getScenarioOption } from '../data/scenarioOptions';
import { formatNumber, formatPercent } from '../lib/formatters';
import { getLatestEventHistory } from '../lib/gameEngine';
import { findAsset } from '../lib/portfolio';
import type { Asset, OrderSide } from '../types';

type BoardTab = {
  label: string;
  sectors: readonly string[] | null;
};

const boardTabs: BoardTab[] = [
  { label: 'すべて', sectors: null },
  { label: 'AI', sectors: ['半導体', 'IT・クラウド', 'ゲーム・娯楽'] },
  { label: '銀行・保険', sectors: ['銀行', '保険'] },
  { label: 'インフラ・エネルギー', sectors: ['エネルギー', '電力・ガス', '建設'] },
  { label: '消費・小売', sectors: ['小売', '外食', '食品'] },
  { label: '医療・ヘルスケア', sectors: ['医薬品'] },
  { label: 'その他', sectors: ['自動車', '電機', '商社', '物流', '航空・旅行', '通信', '素材・化学'] }
] as const;

const getBoardNameFontSize = (asset: Asset) => {
  const length = [...asset.name].length;
  if (length >= 9) return 'calc(18 * var(--ref-px))';
  if (length >= 7) return 'calc(20 * var(--ref-px))';
  return 'calc(22 * var(--ref-px))';
};

const matchesSectorLabel = (sector: string, label: string) =>
  sector.includes(label) ||
  label.includes(sector.replace('IT・', '').replace('インデックス', ''));

export function InitialOrderEntryScreen({ emergency = false }: { emergency?: boolean }) {
  const { state, currentRound, placeOrder, next, back, setActiveTeam } = useGame();
  const scenario = getScenarioOption(state.selectedScenarioId);
  const firstCandidate = currentRound.preNews.relatedSectors[0];
  const initialAsset =
    state.assets.find((asset) => firstCandidate && matchesSectorLabel(asset.sector, firstCandidate)) ??
    state.assets[0];
  const [selectedTeamId, setSelectedTeamId] = useState(state.activeTeamId);
  const [selectedAssetId, setSelectedAssetId] = useState(initialAsset?.id ?? '');
  const [selectedTab, setSelectedTab] = useState<(typeof boardTabs)[number]['label']>('すべて');
  const [side, setSide] = useState<OrderSide>('buy');
  const [quantity, setQuantity] = useState(100);
  const [reason, setReason] = useState(
    state.teams.find((team) => team.id === state.activeTeamId)?.strategy ?? ''
  );
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const latestEvent = getLatestEventHistory(state);
  const selectedTeam =
    state.teams.find((team) => team.id === selectedTeamId) ?? state.teams[0];
  const selectedAsset = findAsset(state.assets, selectedAssetId);
  const roundOrders = state.orders.filter((order) => order.round === state.currentRound);
  const isInitialRound = state.currentRound === 1;
  const phaseTitle = emergency ? '緊急リスク対応' : isInitialRound ? '初期投資' : '投資計画';
  const nextLabel = emergency
    ? `緊急売買を完了して第${Math.min(state.currentRound + 1, state.settings.investmentRounds)}回事前ニュースへ`
    : isInitialRound
      ? '注文を確定してイベント発生へ'
      : '投資計画を確定してイベント発生へ';

  const getAssetChange = (asset: Asset) => {
    if (latestEvent) {
      const before = latestEvent.beforeAssets[asset.id] ?? asset.price;
      const after = latestEvent.afterAssets[asset.id] ?? asset.price;
      return before > 0 ? ((after - before) / before) * 100 : 0;
    }
    const candidate = scenario.candidateSectors.find(
      (item) =>
        matchesSectorLabel(asset.sector, item.label)
    );
    return candidate ? Number.parseFloat(candidate.change) : 0;
  };

  const visibleAssets = useMemo(() => {
    const tab = boardTabs.find((item) => item.label === selectedTab);
    if (!tab || !tab.sectors) return state.assets;
    return state.assets.filter((asset) => tab.sectors?.includes(asset.sector));
  }, [selectedTab, state.assets]);

  const requiredAmount = selectedAsset.price * Math.max(0, quantity);
  const afterCash =
    side === 'buy' ? selectedTeam.cash - requiredAmount : selectedTeam.cash + requiredAmount;
  const displayedAfterCash = message?.type === 'ok' ? selectedTeam.cash : afterCash;
  const canAfford = side === 'sell' || displayedAfterCash >= 0;

  const chooseTeam = (teamId: string) => {
    const team = state.teams.find((item) => item.id === teamId);
    setSelectedTeamId(teamId);
    setActiveTeam(teamId);
    setReason(team?.strategy ?? '');
    setMessage(null);
  };

  const addOrder = () => {
    const error = placeOrder({
      teamId: selectedTeam.id,
      assetId: selectedAsset.id,
      side,
      quantity,
      reason
    });
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }
    setMessage({ type: 'ok', text: '注文を実行し、資産へ反映しました。' });
  };

  return (
    <section className={`reference-screen initial-order-reference-screen ${emergency ? 'is-emergency' : ''}`}>
      <img className="reference-screen-image" src="/reference-initial-order.png" alt="" />

      <header className="initial-order-header">
        <div>
          <span>金融教育チーム対抗シミュレーション</span>
          <h1>第{state.currentRound}回：{phaseTitle}</h1>
          <p>
            {isInitialRound
              ? '株価を見て、チームの作戦を実行しよう'
              : emergency
                ? '緊急リスク後の価格を見て、今すぐ買い・売りを判断しよう'
                : '事前ニュースをもとに、イベント前の投資計画を実行しよう'}
          </p>
          <em>シナリオ{scenario.number}：{scenario.title}</em>
        </div>
        <div className="initial-order-phase">
          <strong>{emergency ? '緊急売買' : phaseTitle}<br />フェーズ</strong>
        </div>
      </header>

      <aside className="initial-order-team-panel">
        <div className="initial-order-panel-title">チーム選択</div>
        <div className="initial-order-team-tabs">
          {state.teams.map((team) => (
            <button
              key={team.id}
              type="button"
              className={team.id === selectedTeam.id ? 'is-selected' : ''}
              onClick={() => chooseTeam(team.id)}
              style={{ '--team-color': team.color } as CSSProperties}
            >
              <Users />
              {team.name}
            </button>
          ))}
        </div>
        <div className="initial-order-selected-team">
          <Users />
          <span>選択中</span>
          <strong style={{ color: selectedTeam.color }}>{selectedTeam.name}</strong>
        </div>
      </aside>

      <main className="initial-order-board-panel">
        <div className="initial-order-board-title">
          株価ボード（22銘柄）
          <span>22種類</span>
        </div>
        <div className="initial-order-board-tabs">
          {boardTabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              className={selectedTab === tab.label ? 'is-selected' : ''}
              onClick={() => setSelectedTab(tab.label)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="initial-order-asset-grid">
          {visibleAssets.map((asset, index) => {
            const change = getAssetChange(asset);
            return (
              <button
                key={asset.id}
                type="button"
                className={asset.id === selectedAsset.id ? 'is-selected' : ''}
                onClick={() => {
                  setSelectedAssetId(asset.id);
                  setMessage(null);
                }}
              >
                <span className="initial-order-asset-rank">{index + 1}</span>
                {asset.id === selectedAsset.id ? <b>選択中</b> : null}
                <AssetIcon icon={asset.icon} color={asset.color} />
                <strong style={{ fontSize: getBoardNameFontSize(asset) }}>{asset.name}</strong>
                <em>{formatNumber(asset.price)}円</em>
                <i className={change >= 0 ? 'is-up' : 'is-down'}>
                  {formatPercent(change, 2)}
                </i>
              </button>
            );
          })}
        </div>
      </main>

      <aside className="initial-order-input-panel">
        <div className="initial-order-input-title">注文入力</div>
        <div className="initial-order-selected-asset">
          <AssetIcon icon={selectedAsset.icon} color={selectedAsset.color} />
          <div>
            <span>{selectedAsset.name}</span>
            <strong>{formatNumber(selectedAsset.price)}円</strong>
          </div>
          <em className={getAssetChange(selectedAsset) >= 0 ? 'is-up' : 'is-down'}>
            {formatPercent(getAssetChange(selectedAsset), 2)}
          </em>
        </div>

        <div className="initial-order-side-toggle">
          <button
            type="button"
            className={side === 'buy' ? 'is-selected' : ''}
            onClick={() => setSide('buy')}
          >
            買う
          </button>
          <button
            type="button"
            className={side === 'sell' ? 'is-selected' : ''}
            onClick={() => setSide('sell')}
          >
            売る
          </button>
        </div>

        <div className="initial-order-quantity">
          <span>株数</span>
          <button
            type="button"
            aria-label="株数を10減らす"
            onClick={() => setQuantity((value) => Math.max(1, value - 10))}
          >
            <Minus />
          </button>
          <input
            value={quantity}
            type="number"
            min={1}
            onChange={(event) =>
              setQuantity(Math.max(1, Math.floor(Number(event.target.value) || 1)))
            }
          />
          <button
            type="button"
            aria-label="株数を10増やす"
            onClick={() => setQuantity((value) => value + 10)}
          >
            <Plus />
          </button>
          <div>
            <Calculator />
            金額入力なし
          </div>
        </div>

        <div className="initial-order-money-lines">
          <div>
            <span>必要資金</span>
            <strong>{formatNumber(requiredAmount)}円</strong>
          </div>
          <div>
            <span>注文後現金</span>
            <strong className={canAfford ? '' : 'is-error'}>
              {formatNumber(displayedAfterCash)}円
            </strong>
          </div>
        </div>

        <label className="initial-order-reason">
          <span>投資理由</span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="なぜこの銘柄を選ぶ？"
          />
        </label>

        {message ? (
          <div className={`initial-order-message ${message.type === 'ok' ? 'is-ok' : 'is-error'}`}>
            {message.text}
          </div>
        ) : null}

        <button type="button" className="initial-order-add" onClick={addOrder}>
          <Plus />
          注文を実行
        </button>
        <div className="initial-order-confirm-status">
          <CheckCircle2 /> 注文は実行時に即時反映
        </div>
      </aside>

      <section className="initial-order-list-panel">
        <div className="initial-order-list-title">このラウンドの注文履歴</div>
        <div className="initial-order-list-table">
          <div className="initial-order-list-head">
            <span>チーム</span>
            <span>銘柄</span>
            <span>売買</span>
            <span>株数</span>
            <span>必要資金</span>
            <span>理由</span>
          </div>
          {roundOrders.length === 0 ? (
            <div className="initial-order-list-empty">
              <ClipboardList />
              注文を実行するとここに表示されます
            </div>
          ) : (
            roundOrders.slice(-4).map((order) => {
              const team = state.teams.find((item) => item.id === order.teamId);
              const asset = findAsset(state.assets, order.assetId);
              return (
                <div className="initial-order-list-row" key={order.id}>
                  <span>{team?.name}</span>
                  <span>{asset.name}</span>
                  <span className={order.side === 'buy' ? 'is-buy' : 'is-sell'}>
                    {order.side === 'buy' ? '買い' : '売り'}
                  </span>
                  <span>{formatNumber(order.quantity)}株</span>
                  <span>{formatNumber(order.totalAmount)}円</span>
                  <span>{order.reason}</span>
                </div>
              );
            })
          )}
        </div>
      </section>

      <button type="button" className="initial-order-back" onClick={back}>
        <ArrowLeft />
        戻る
      </button>
      <button type="button" className="initial-order-next" onClick={next}>
        <Play />
        {nextLabel}
      </button>
    </section>
  );
}
