import { useState, type ReactNode } from 'react';
import { Clock3, Settings, Users } from 'lucide-react';
import { baseTeams } from '../data/teams';
import { useGame } from '../context/GameProvider';
import type { GameSettings } from '../types';

function ChoiceButton<T extends string | number>({
  value,
  selected,
  children,
  onClick
}: {
  value: T;
  selected: boolean;
  children: ReactNode;
  onClick: (value: T) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`rounded-lg border px-4 py-4 text-2xl font-black leading-none transition ${
        selected
          ? 'border-sky-400 bg-sky-400 text-slate-950 shadow-sm'
          : 'border-sky-100 bg-white text-slate-700 hover:border-sky-300'
      }`}
    >
      {children}
    </button>
  );
}

export function SetupScreen() {
  const { startGame, back } = useGame();
  const [settings, setSettings] = useState<GameSettings>({
    investmentRounds: 4,
    teamCount: 4,
    thinkingMinutes: 15
  });
  const [names, setNames] = useState<Record<string, string>>(
    Object.fromEntries(baseTeams.map((team) => [team.id, team.name]))
  );

  const visibleTeams = baseTeams.slice(0, settings.teamCount);

  return (
    <section className="flex h-full min-h-screen items-center justify-center bg-market-grid p-6">
      <div className="w-full max-w-[1360px] rounded-lg border border-sky-100 bg-white/95 p-6 shadow-glow">
        <div className="mb-5 flex items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-5xl font-black text-slate-950">
              <Settings className="h-12 w-12 text-sky-500" />
              ゲーム設定
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-600">
              全4回のゲームで使うチーム数と作戦会議の時間を設定します。
            </p>
          </div>
          <button
            type="button"
            onClick={back}
            className="rounded-lg border border-sky-100 bg-sky-50 px-6 py-4 text-xl font-black text-slate-800"
          >
            戻る
          </button>
        </div>
        <div className="grid grid-cols-[0.82fr_1.18fr] gap-5">
          <div className="rounded-lg border border-sky-100 bg-sky-50/70 p-5">
            <div className="mb-5 text-3xl font-black text-slate-950">基本設定</div>
            <div className="grid gap-5">
              <div className="grid gap-3 text-xl font-black text-slate-700">
                <div>投資回数</div>
                <div className="rounded-lg border border-sky-300 bg-white px-5 py-4 text-2xl font-black text-sky-700">
                  4回（固定）
                </div>
              </div>
              <div className="grid gap-3 text-xl font-black text-slate-700">
                <div>チーム数</div>
                <div className="grid grid-cols-5 gap-2">
                  {[2, 3, 4, 5, 6].map((teamCount) => (
                    <ChoiceButton
                      key={teamCount}
                      value={teamCount}
                      selected={settings.teamCount === teamCount}
                      onClick={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          teamCount: value as 2 | 3 | 4 | 5 | 6
                        }))
                      }
                    >
                      {teamCount}チーム
                    </ChoiceButton>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 text-xl font-black text-slate-700">
                <span className="flex items-center gap-2">
                  <Clock3 className="h-6 w-6 text-sky-500" />
                  思考タイム
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((minutes) => (
                    <ChoiceButton
                      key={minutes}
                      value={minutes}
                      selected={settings.thinkingMinutes === minutes}
                      onClick={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          thinkingMinutes: value as 5 | 10 | 15 | 20
                        }))
                      }
                    >
                      {minutes}分
                    </ChoiceButton>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-sky-100 bg-white p-5">
            <div className="mb-5 flex items-center gap-3 text-3xl font-black text-slate-950">
              <Users className="h-9 w-9 text-sky-500" />
              チーム名
            </div>
            <div className="grid grid-cols-3 gap-3">
              {visibleTeams.map((team) => (
                <label
                  key={team.id}
                  className="grid min-w-0 gap-2 rounded-lg border border-sky-100 bg-sky-50/70 p-4 text-xl font-black text-slate-700"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="h-5 w-5 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    {team.name}
                  </span>
                  <input
                    className="w-full min-w-0 rounded-lg border border-sky-100 bg-white px-4 py-3 text-2xl text-slate-950"
                    value={names[team.id] ?? team.name}
                    onChange={(event) =>
                      setNames((prev) => ({
                        ...prev,
                        [team.id]: event.target.value
                      }))
                    }
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => startGame(settings, names)}
            className="rounded-lg border border-sky-400 bg-sky-400 px-10 py-5 text-3xl font-black text-slate-950 shadow-glow"
          >
            シナリオ選択へ進む
          </button>
        </div>
      </div>
    </section>
  );
}
