import { ClipboardList } from 'lucide-react';
import { AssetPriceBoard } from '../components/ui/AssetPriceBoard';
import { OrderForm } from '../components/ui/OrderForm';
import { OrderHistoryTable } from '../components/ui/OrderHistoryTable';
import { useGame } from '../context/GameProvider';
import { getLatestEventHistory } from '../lib/gameEngine';

export function OrderEntryScreen() {
  const { state, placeOrder, next } = useGame();

  return (
    <section className="order-screen">
      <div className="order-screen-bg" />
      <header className="order-screen-header">
        <div>
          <span>
            <ClipboardList />
            第{state.currentRound}ラウンド
          </span>
          <h1>株購入計画</h1>
        </div>
        <p>ランキングと保有比率を見たうえで、次のイベント前に買う・売る銘柄を決めます。</p>
      </header>

      <div className="order-screen-grid">
        <AssetPriceBoard
          assets={state.assets}
          latestEvent={getLatestEventHistory(state)}
          dense
        />
        <div className="order-side-column">
          <OrderForm
            teams={state.teams}
            assets={state.assets}
            currentRound={state.currentRound}
            onSubmit={placeOrder}
            onNext={next}
            title={`第${state.currentRound}ラウンド 株購入計画`}
            nextLabel="イベント発生へ"
          />
          <OrderHistoryTable
            orders={state.orders}
            teams={state.teams}
            assets={state.assets}
            roundOnly={state.currentRound}
          />
        </div>
      </div>
    </section>
  );
}
