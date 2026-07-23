import { ArrowDownRight, ArrowUpRight, Lightbulb } from 'lucide-react';
import type { MarketEvent } from '../../types';

export function EventImpactPanel({ event }: { event: MarketEvent }) {
  const entries = Object.entries(event.sectorEffects);
  const ups = entries.filter(([, value]) => value > 0).sort((a, b) => b[1] - a[1]);
  const downs = entries.filter(([, value]) => value < 0).sort((a, b) => a[1] - b[1]);

  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="rounded-lg border border-rise-500/35 bg-rise-500/12 p-5">
        <div className="mb-4 flex items-center gap-3 text-2xl font-black text-rise-500">
          <ArrowUpRight className="h-7 w-7" />
          上がりやすい業種
        </div>
        <div className="grid gap-3">
          {ups.slice(0, 8).map(([sector, value]) => (
            <div
              key={sector}
              className="flex items-center justify-between rounded-lg bg-navy-950/60 px-4 py-3 text-xl font-black"
            >
              <span className="text-white">{sector}</span>
              <span className="text-rise-500">+{value}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-fall-500/35 bg-fall-500/12 p-5">
        <div className="mb-4 flex items-center gap-3 text-2xl font-black text-fall-500">
          <ArrowDownRight className="h-7 w-7" />
          下がりやすい業種
        </div>
        <div className="grid gap-3">
          {downs.slice(0, 8).map(([sector, value]) => (
            <div
              key={sector}
              className="flex items-center justify-between rounded-lg bg-navy-950/60 px-4 py-3 text-xl font-black"
            >
              <span className="text-white">{sector}</span>
              <span className="text-fall-500">{value}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-2 rounded-lg border border-alert-400/35 bg-alert-500/12 p-5">
        <div className="flex items-center gap-3 text-2xl font-black text-alert-400">
          <Lightbulb className="h-7 w-7" />
          学習ポイント
        </div>
        <p className="mt-3 text-2xl font-bold leading-relaxed text-white">{event.lesson}</p>
      </div>
    </div>
  );
}
