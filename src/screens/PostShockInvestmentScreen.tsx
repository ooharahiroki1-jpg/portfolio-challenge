import { ArrowRight, BrainCircuit } from 'lucide-react';
import { PodiumRanking } from '../components/ui/PodiumRanking';
import { useGame } from '../context/GameProvider';

export function PostShockInvestmentScreen() {
  const { state, next } = useGame();
  return (
    <section className="grid h-full grid-cols-[0.92fr_1.08fr] gap-7">
      <div className="rounded-lg border border-alert-500/40 bg-alert-500/12 p-8">
        <div className="flex items-center gap-4 text-4xl font-black text-alert-400">
          <BrainCircuit className="h-12 w-12" />
          ショック後再投資
        </div>
        <p className="mt-7 text-3xl font-bold leading-relaxed text-white">
          冷静に状況を分析し、次の一手を考えましょう。
          想定外ショックは投資機会を消費しません。第3回の投資判断へ進みます。
        </p>
        <div className="mt-8 grid gap-4">
          {[
            '今、売りたいですか？',
            '買いたいですか？',
            '何もしませんか？',
            '下がった銘柄は本当に価値がなくなりましたか？',
            '現金を残していたチームは何ができますか？'
          ].map((question) => (
            <div
              key={question}
              className="rounded-lg border border-white/15 bg-navy-950/65 p-5 text-2xl font-black text-white"
            >
              {question}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          className="mt-8 inline-flex items-center gap-4 rounded-lg border border-sky-300/60 bg-sky-400 px-8 py-5 text-3xl font-black text-navy-950 shadow-glow"
        >
          第3回ニュースへ進む
          <ArrowRight className="h-9 w-9" />
        </button>
      </div>
      <PodiumRanking
        teams={state.teams}
        assets={state.assets}
        title="現在ランキング"
        dark
      />
    </section>
  );
}
