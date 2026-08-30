import { useMemo, useState, type CSSProperties } from 'react';
import { ChevronDown } from 'lucide-react';
import { useGame } from '../context/GameProvider';
import { baseTeams } from '../data/teams';
import type { GameSettings } from '../types';

const teamCountOptions: GameSettings['teamCount'][] = [2, 3, 4, 5, 6];

export function StartScreen() {
  const { startGame, goToPhase, load, reset } = useGame();
  const [teamCount, setTeamCount] = useState<GameSettings['teamCount']>(4);
  const [teamMenuOpen, setTeamMenuOpen] = useState(false);

  const teamNames = useMemo(
    () => Object.fromEntries(baseTeams.map((team) => [team.id, team.name])),
    []
  );

  const start = () => {
    startGame(
      {
        investmentRounds: 4,
        teamCount,
        thinkingMinutes: 10
      },
      teamNames
    );
  };

  return (
      <section className="reference-screen" aria-label="ゲーム用スタート画面">
      <img
        className="reference-screen-image"
        src={`${import.meta.env.BASE_URL}reference-start.png`}
        alt=""
      />

      <div className="start-team-background-mask" aria-hidden="true" />
      <div className="start-team-preview" aria-live="polite">
        <strong>参加チーム</strong>
        <div>
          {baseTeams.slice(0, teamCount).map((team) => (
            <span key={team.id} style={{ '--team-color': team.color } as CSSProperties}>
              <i />
              {team.name}
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={`start-team-current ${teamMenuOpen ? 'is-open' : ''}`}
        onClick={() => setTeamMenuOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={teamMenuOpen}
      >
        <span>{teamCount}チーム</span>
        <ChevronDown />
      </button>
      {teamMenuOpen ? (
        <div className="start-team-menu-live" role="listbox" aria-label="チーム数">
          {teamCountOptions.map((count) => (
            <button
              key={count}
              type="button"
              className={teamCount === count ? 'is-selected' : ''}
              onClick={() => {
                setTeamCount(count);
                setTeamMenuOpen(false);
              }}
              aria-selected={teamCount === count}
            >
              <span>{count}チーム</span>
              {teamCount === count ? <strong>✓</strong> : null}
            </button>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        className="reference-hotspot start-hotspot-ranking"
        onClick={() => goToPhase('dashboard')}
        aria-label="ランキング"
      />
      <button
        type="button"
        className="reference-hotspot start-hotspot-settings"
        onClick={() => goToPhase('setup')}
        aria-label="設定"
      />
      <button
        type="button"
        className="reference-hotspot start-hotspot-help"
        aria-label="遊び方"
      />
      <button
        type="button"
        className="reference-hotspot start-hotspot-primary"
        onClick={start}
        aria-label="ゲームをはじめる"
      />
      <button
        type="button"
        className="reference-hotspot start-hotspot-load"
        onClick={load}
        aria-label="保存データを読み込む"
      />
      <button
        type="button"
        className="reference-hotspot start-hotspot-reset"
        onClick={reset}
        aria-label="リセット"
      />
    </section>
  );
}
