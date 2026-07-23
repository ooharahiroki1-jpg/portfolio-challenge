import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { categoryColors } from '../../lib/categories';
import { formatNumber, formatPercent } from '../../lib/formatters';
import type { Asset, EventHistoryEntry } from '../../types';
import { AssetIcon } from './AssetIcon';

export function AssetPriceBoard({
  assets,
  latestEvent,
  dense = false
}: {
  assets: Asset[];
  latestEvent?: EventHistoryEntry;
  dense?: boolean;
}) {
  const getChange = (asset: Asset) => {
    if (!latestEvent) {
      return asset.initialPrice > 0
        ? ((asset.price - asset.initialPrice) / asset.initialPrice) * 100
        : 0;
    }
    const before = latestEvent.beforeAssets[asset.id] ?? asset.initialPrice;
    const after = latestEvent.afterAssets[asset.id] ?? asset.price;
    return before > 0 ? ((after - before) / before) * 100 : 0;
  };

  return (
    <div className={`price-board-card ${dense ? 'is-dense' : ''}`}>
      <div className="price-board-title">価格ボード</div>
      <div className="price-board-grid">
        {assets.map((asset) => {
          const change = getChange(asset);
          const positive = change > 0;
          const negative = change < 0;
          return (
            <div
              key={asset.id}
              className={`price-board-row ${
                positive ? 'is-up' : negative ? 'is-down' : ''
              }`}
            >
              <AssetIcon icon={asset.icon} color={asset.color} />
              <div className="price-board-name">
                <strong>{asset.name}</strong>
                <span>
                  <i style={{ backgroundColor: categoryColors[asset.category] }} />
                  {asset.category} / {asset.sector}
                </span>
              </div>
              <div className="price-board-price">{formatNumber(asset.price)}</div>
              <div
                className={`price-board-change ${
                  positive ? 'is-up' : negative ? 'is-down' : ''
                }`}
              >
                {positive ? <ArrowUpRight /> : negative ? <ArrowDownRight /> : <Minus />}
                {formatPercent(change)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
