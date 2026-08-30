import { useMemo, useState } from 'react';
import { Newspaper } from 'lucide-react';
import { useGame } from '../context/GameProvider';
import { getScenarioOption } from '../data/scenarioOptions';
import type { GameSettings } from '../types';

const thinkingOptions: GameSettings['thinkingMinutes'][] = [5, 10, 15, 20];

export function InitialInvestmentScreen() {
  const {
    state,
    next,
    back,
    setActiveTeam,
    setThinkingMinutes,
    updateTeamStrategy
  } = useGame();
  const scenario = useMemo(
    () => getScenarioOption(state.selectedScenarioId),
    [state.selectedScenarioId]
  );
  const [selectedTeamId, setSelectedTeamId] = useState(state.activeTeamId);
  const selectedTeam =
    state.teams.find((team) => team.id === selectedTeamId) ?? state.teams[0];

  const chooseTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    setActiveTeam(teamId);
  };

  return (
    <section className="reference-screen" aria-label="第1回 状況把握と初期投資計画">
      <img
        className="reference-screen-image"
        src={`${import.meta.env.BASE_URL}reference-round1-plan.png`}
        alt=""
      />

      <div className="round1-title-overlay">
        <h1>第1回：状況把握と初期投資計画</h1>
        <p>
          シナリオ{scenario.number}：{scenario.title}を読み解こう
        </p>
      </div>

      <section className="round1-situation-overlay">
        <div className="round1-panel-tab">シナリオ状況</div>
        <div className="round1-situation-main">{scenario.situationTitle}</div>
        <div className="round1-situation-list">
          {scenario.situationBullets.map((bullet) => (
            <div key={bullet}>{bullet}</div>
          ))}
        </div>
        <div className="round1-mood">
          <span>市場ムード：{scenario.marketMood}</span>
          <div>
            <i style={{ left: `${scenario.moodPosition}%` }} />
          </div>
        </div>
      </section>

      <section className="round1-thinking-overlay">
        <div className="round1-panel-tab">シンキングタイム</div>
        <div className="round1-time-display">
          {state.thinkingTimerSettings.minutes.toString().padStart(2, '0')}:00
        </div>
        <div className="round1-time-options" aria-label="シンキングタイム選択">
          {thinkingOptions.map((minutes) => (
            <button
              key={minutes}
              type="button"
              className={
                state.thinkingTimerSettings.minutes === minutes ? 'is-selected' : ''
              }
              onClick={() => setThinkingMinutes(minutes)}
            >
              {minutes}分
            </button>
          ))}
        </div>
        <div className={`round1-team-cards team-count-${state.teams.length}`}>
          {state.teams.map((team) => (
            <button
              key={team.id}
              type="button"
              className={selectedTeam?.id === team.id ? 'is-selected' : ''}
              onClick={() => chooseTeam(team.id)}
            >
              <span style={{ color: team.color }}>{team.name}</span>
              <strong>100万円</strong>
              <em>方針入力</em>
            </button>
          ))}
        </div>
      </section>

      <section className="round1-plan-overlay">
        <div className="round1-panel-tab">初期投資計画</div>
        <div className="round1-plan-steps">
          <div>
            <span>1</span>
            注目セクターを選ぶ
          </div>
          <div>
            <span>2</span>
            株数を決める
          </div>
          <div>
            <span>3</span>
            投資理由を書く
          </div>
        </div>
        <div className="round1-candidates-title">注目候補</div>
        <div className="round1-candidates">
          {scenario.candidateSectors.map((sector) => (
            <div key={sector.label}>
              <strong>{sector.label}</strong>
              <span>{sector.change}</span>
            </div>
          ))}
        </div>
        <label className="round1-policy-box">
          <span>チームの投資方針：{selectedTeam?.name}</span>
          <textarea
            value={selectedTeam?.strategy ?? ''}
            onChange={(event) =>
              selectedTeam ? updateTeamStrategy(selectedTeam.id, event.target.value) : undefined
            }
            placeholder={scenario.defaultPolicyPrompt}
          />
        </label>
      </section>

      <button
        type="button"
        className="reference-hotspot round1-hotspot-ranking"
        aria-label="ランキング"
      />
      <button
        type="button"
        className="reference-hotspot round1-hotspot-settings"
        aria-label="設定"
      />
      <button
        type="button"
        className="reference-hotspot round1-hotspot-help"
        aria-label="遊び方"
      />
      <button
        type="button"
        className="reference-hotspot round1-hotspot-back"
        onClick={back}
        aria-label="戻る"
      />
      <button
        type="button"
        className="reference-hotspot round1-hotspot-next"
        onClick={next}
        aria-label="事前ニュースへ進む"
      >
        <Newspaper />
        <span>事前ニュースへ進む</span>
      </button>
    </section>
  );
}
