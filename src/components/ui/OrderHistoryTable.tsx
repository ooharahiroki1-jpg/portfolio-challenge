import { formatCompactCurrency, formatNumber } from '../../lib/formatters';
import { findAsset } from '../../lib/portfolio';
import type { Asset, Order, Team } from '../../types';

export function OrderHistoryTable({
  orders,
  teams,
  assets,
  roundOnly
}: {
  orders: Order[];
  teams: Team[];
  assets: Asset[];
  roundOnly?: number;
}) {
  const visibleOrders = roundOnly
    ? orders.filter((order) => order.round === roundOnly)
    : orders;

  return (
    <div className="order-history-card">
      <div className="order-history-title">注文履歴</div>
      <div className="order-history-list">
        {visibleOrders.length === 0 ? (
          <div className="order-empty">このラウンドの注文はまだありません。</div>
        ) : (
          visibleOrders
            .slice()
            .reverse()
            .map((order) => {
              const team = teams.find((item) => item.id === order.teamId);
              const asset = findAsset(assets, order.assetId);
              return (
                <div key={order.id} className="order-history-row">
                  <span className={order.side === 'buy' ? 'is-buy' : 'is-sell'}>
                    {order.side === 'buy' ? '買い' : '売り'}
                  </span>
                  <strong>
                    {team?.name} / {asset.name}
                  </strong>
                  <em>
                    {formatNumber(order.quantity)}口・
                    {formatCompactCurrency(order.totalAmount)}
                  </em>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
