import { useState } from 'react';
import { ArrowRight, BadgeCheck, CircleDollarSign } from 'lucide-react';
import { formatNumber } from '../../lib/formatters';
import type { Asset, OrderInput, Team } from '../../types';
import { AssetIcon } from './AssetIcon';

const reasonExamples = [
  'ニュースを見て伸びそうな業種だと判断したため',
  '価格変動に備えて分散したいと考えたため',
  '現金を残しつつ成長株にも配分したいため',
  '下落後の反発を狙えると考えたため',
  '守りの資産を増やしてリスクを抑えるため'
];

export function OrderForm({
  teams,
  assets,
  currentRound,
  onSubmit,
  onNext,
  title,
  nextLabel = 'イベント発生へ',
  submitLabel = '注文確定'
}: {
  teams: Team[];
  assets: Asset[];
  currentRound: number;
  onSubmit: (input: OrderInput) => string | null;
  onNext?: () => void;
  title?: string;
  nextLabel?: string;
  submitLabel?: string;
}) {
  const [teamId, setTeamId] = useState(teams[0]?.id ?? '');
  const [assetId, setAssetId] = useState(assets[0]?.id ?? '');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('1');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(
    null
  );

  const parsedQuantity = Math.max(0, Math.floor(Number(quantity) || 0));

  const submit = () => {
    const error = onSubmit({
      teamId,
      assetId,
      side,
      quantity: parsedQuantity,
      reason
    });
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }
    setMessage({ type: 'ok', text: '注文を確定しました。' });
    setReason('');
    setQuantity('1');
  };

  return (
    <div className="order-form-card">
      <div className="order-form-title">
        <CircleDollarSign />
        {title ?? `第${currentRound}ラウンド 株購入計画`}
      </div>

      <div className="order-form-body">
        <div className="order-field order-team-field">
          <label>チーム</label>
          <div className="order-team-grid">
            {teams.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => setTeamId(team.id)}
                className={teamId === team.id ? 'is-active' : undefined}
              >
                <span style={{ backgroundColor: team.color }} />
                {team.name}
              </button>
            ))}
          </div>
        </div>

        <div className="order-field">
          <label htmlFor="order-quantity">株数</label>
          <input
            id="order-quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </div>

        <div className="order-side-toggle">
          <button
            type="button"
            className={side === 'buy' ? 'is-buy is-active' : 'is-buy'}
            onClick={() => setSide('buy')}
          >
            買う
          </button>
          <button
            type="button"
            className={side === 'sell' ? 'is-sell is-active' : 'is-sell'}
            onClick={() => setSide('sell')}
          >
            売る
          </button>
        </div>

        <div className="order-field order-assets-field">
          <label>投資対象</label>
          <div className="order-asset-list">
            {assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => setAssetId(asset.id)}
                className={assetId === asset.id ? 'is-active' : undefined}
              >
                <span>
                  <AssetIcon icon={asset.icon} color={asset.color} />
                  <strong>{asset.name}</strong>
                  <small>
                    {asset.category} / {asset.sector}
                  </small>
                </span>
                <em>{formatNumber(asset.price)}</em>
              </button>
            ))}
          </div>
        </div>

        <label className="order-reason">
          <span>投資理由</span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={
              reasonExamples[currentRound % reasonExamples.length] ?? reasonExamples[0]
            }
          />
        </label>

        {message ? (
          <div className={`order-message ${message.type === 'ok' ? 'is-ok' : 'is-error'}`}>
            {message.text}
          </div>
        ) : null}

        <div className="order-form-actions">
          <button type="button" onClick={submit}>
            <BadgeCheck />
            {submitLabel}
          </button>
          <button type="button" onClick={onNext}>
            {nextLabel}
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
