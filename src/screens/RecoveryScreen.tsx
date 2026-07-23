import { ArrowRight, Waves } from 'lucide-react';
import { AssetTrendChart } from '../components/ui/AssetTrendChart';
import { PodiumRanking } from '../components/ui/PodiumRanking';
import { useGame } from '../context/GameProvider';

export function RecoveryScreen() {
  const { state, next } = useGame();
  return (
    <section className="grid h-full grid-cols-[0.82fr_1.18fr] gap-7">
      <div className="rounded-lg border border-rise-500/35 bg-rise-500/12 p-8">
        <div className="flex items-center gap-4 text-5xl font-black text-rise-500">
          <Waves className="h-14 w-14" />
          回復局面
        </div>
        <p className="mt-7 text-3xl font-bold leading-relaxed text-white">
          市場は少しずつ落ち着きを取り戻しています。
          ただし、回復する資産と戻りにくい資産の差は大きくなります。
        </p>
        <div className="mt-8 grid gap-4 text-2xl font-bold text-slate-100">
          <div className="rounded-lg bg-navy-950/65 p-5">
            暴落後に買うチャンスは、現金余力があるチームほど広がります。
          </div>
          <div className="rounded-lg bg-navy-950/65 p-5">
            一度下がった資産が必ず戻るわけではありません。
          </div>
          <div className="rounded-lg bg-navy-950/65 p-5">
            リバランスは、予測よりも準備を活かす判断です。
          </div>
        </div>
        <button
          type="button"
          onClick={next}
          className="mt-8 inline-flex items-center gap-4 rounded-lg border border-sky-300/60 bg-sky-400 px-8 py-5 text-3xl font-black text-navy-950 shadow-glow"
        >
          次の投資機会へ
          <ArrowRight className="h-9 w-9" />
        </button>
      </div>
      <div className="grid min-h-0 grid-rows-[0.85fr_1.15fr] gap-5">
        <AssetTrendChart teams={state.teams} />
        <PodiumRanking
          teams={state.teams}
          assets={state.assets}
          title="回復局面ランキング"
          dark
        />
      </div>
    </section>
  );
}
