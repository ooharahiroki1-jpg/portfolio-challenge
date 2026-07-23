import { CheckCircle2 } from 'lucide-react';

export function RoundProgress({
  current,
  total
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: total }, (_, index) => {
        const round = index + 1;
        const active = round === current;
        const done = round < current;
        return (
          <div
            key={round}
            className={`flex h-12 min-w-12 items-center justify-center rounded-full border text-xl font-black ${
              active
                ? 'border-sky-300 bg-sky-400 text-navy-950 shadow-glow'
                : done
                  ? 'border-rise-500 bg-rise-500/24 text-rise-500'
                  : 'border-white/20 bg-white/8 text-slate-300'
            }`}
          >
            {done ? <CheckCircle2 className="h-7 w-7" /> : round}
          </div>
        );
      })}
    </div>
  );
}
