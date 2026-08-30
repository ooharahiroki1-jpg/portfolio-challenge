import {
  BadgeJapaneseYen,
  CheckCircle2,
  Cpu,
  Landmark,
  Rocket,
  TriangleAlert
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useGame } from '../context/GameProvider';
import { getScenarioOption, scenarioOptions } from '../data/scenarioOptions';

const scenarioIcons = {
  1: Cpu,
  2: Landmark,
  3: BadgeJapaneseYen,
  4: TriangleAlert,
  5: Rocket
} as const;

export function ScenarioSelectScreen() {
  const { state, next, goToPhase, selectScenario } = useGame();
  const initialScenario = getScenarioOption(state.selectedScenarioId);
  const [selectedId, setSelectedId] = useState(initialScenario.id);
  const selected = useMemo(() => getScenarioOption(selectedId), [selectedId]);

  const chooseScenario = (scenarioId: string) => {
    setSelectedId(scenarioId);
    selectScenario(scenarioId);
  };

  const start = () => {
    selectScenario(selectedId);
    next();
  };

  return (
    <section className="reference-screen" aria-label="シナリオ選択画面">
      <img
        className="reference-screen-image"
        src={`${import.meta.env.BASE_URL}reference-scenario.png`}
        alt=""
      />

      <div className="scenario-live-cards" aria-label="シナリオ選択">
        {scenarioOptions.map((scenario) => {
          const ScenarioIcon = scenarioIcons[scenario.number as keyof typeof scenarioIcons] ?? Cpu;
          const isSelected = selected.id === scenario.id;

          return (
            <button
              key={scenario.id}
              type="button"
              className={`scenario-live-card scenario-live-card-${scenario.number} ${
                isSelected ? 'is-selected' : ''
              }`}
              onClick={() => chooseScenario(scenario.id)}
              aria-pressed={isSelected}
            >
              {scenario.number === 1 ? <span className="scenario-live-badge">おすすめ</span> : null}
              {isSelected ? <CheckCircle2 className="scenario-live-check" /> : null}
              <span className="scenario-live-number">シナリオ {scenario.number}</span>
              <ScenarioIcon className="scenario-live-icon" />
              <strong>{scenario.title}</strong>
              <em>{scenario.subtitle}</em>
            </button>
          );
        })}
      </div>

      <aside className="scenario-dynamic-detail">
        <div className="scenario-dynamic-title">
          シナリオ {selected.number} の概要
        </div>
        <div className="scenario-dynamic-name">{selected.title}</div>
        <div className="scenario-dynamic-subtitle">{selected.subtitle}</div>
        <div className="scenario-dynamic-rows">
          {selected.detailRows.map((row) => (
            <div key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
      </aside>

      <button
        type="button"
        className="reference-hotspot scenario-hotspot-ranking"
        onClick={() => goToPhase('dashboard')}
        aria-label="ランキング"
      />
      <button
        type="button"
        className="reference-hotspot scenario-hotspot-settings"
        onClick={() => goToPhase('setup')}
        aria-label="設定"
      />
      <button
        type="button"
        className="reference-hotspot scenario-hotspot-help"
        aria-label="遊び方"
      />
      <button
        type="button"
        className="reference-hotspot scenario-hotspot-back"
        onClick={() => goToPhase('start')}
        aria-label="戻る"
      />
      <button
        type="button"
        className="reference-hotspot scenario-hotspot-start"
        onClick={start}
        aria-label="このシナリオで開始"
      />
    </section>
  );
}
