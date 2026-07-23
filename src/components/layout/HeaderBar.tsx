import { BarChart3, Clock3 } from 'lucide-react';
import { useGame } from '../../context/GameProvider';
import { formatCompactCurrency } from '../../lib/formatters';
import { buildRanking } from '../../lib/portfolio';
import { RoundProgress } from '../ui/RoundProgress';

export function HeaderBar() {
  const { state } = useGame();
  const ranking = buildRanking(state.teams, state.assets);
  const topTeam = ranking[0];

  return (
    <header className="flex shrink-0 items-center justify-between gap-5 border-b border-sky-100 bg-white/85 px-6 py-3 text-slate-950 backdrop-blur">
      <div className="min-w-0">
        <div className="flex items-center gap-3 text-2xl font-black">
          <BarChart3 className="h-8 w-8 text-sky-500" />
          100万円ポートフォリオ・チャレンジ
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden min-[1280px]:block">
          <RoundProgress
            current={state.currentRound}
            total={state.settings.investmentRounds}
          />
        </div>
        <div className="rounded-lg border border-sky-100 bg-sky-50 px-5 py-3 text-right">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-500">
            <Clock3 className="h-5 w-5 text-sky-500" />
            現在トップ
          </div>
          <div className="text-2xl font-black text-slate-950">
            {topTeam?.team.name} {topTeam ? formatCompactCurrency(topTeam.totalAssets) : ''}
          </div>
        </div>
      </div>
    </header>
  );
}
