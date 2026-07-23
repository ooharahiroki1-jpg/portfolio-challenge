import { Newspaper } from 'lucide-react';

export function NewsTicker({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 overflow-hidden rounded-lg border border-sky-300/30 bg-sky-400/10 px-5 py-3 text-xl font-bold text-sky-100">
      <Newspaper className="h-7 w-7 flex-none text-sky-300" />
      <div className="animate-[ticker_18s_linear_infinite] whitespace-nowrap">
        {text}
      </div>
    </div>
  );
}
