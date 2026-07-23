import { useCallback, useState, type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Cpu,
  Fuel,
  Globe2,
  Landmark,
  RadioTower,
  Siren,
  TrendingDown,
  Waves,
  Zap,
  type LucideIcon
} from 'lucide-react';
import { CountdownOverlay } from '../components/ui/CountdownOverlay';
import {
  getShockPresentation,
  type ShockIconKey
} from '../data/shockPresentations';
import { getScenarioById } from '../data/scenarios';
import { useGame } from '../context/GameProvider';

const shockIcons: Record<ShockIconKey, LucideIcon> = {
  cpu: Cpu,
  credit: Landmark,
  energy: Fuel,
  global: Globe2,
  liquidity: Waves
};

export function ShockEventScreen() {
  const { state, shockEvent, triggerShock, next } = useGame();
  const [revealed, setRevealed] = useState(state.shockOccurred);
  const reduceMotion = useReducedMotion();
  const presentation = getShockPresentation(shockEvent.id);
  const scenario = getScenarioById(state.selectedScenarioId);
  const ShockIcon = shockIcons[presentation.iconKey];
  const reveal = useCallback(() => {
    if (!state.shockOccurred) triggerShock();
    setRevealed(true);
  }, [state.shockOccurred, triggerShock]);
  const sortedEffects = Object.entries(shockEvent.sectorEffects).sort((a, b) => a[1] - b[1]);
  const directHits = sortedEffects.filter(([, value]) => value < 0).slice(0, 3);
  const screenStyle = {
    '--shock-accent': presentation.accent,
    '--shock-accent-secondary': presentation.accentSecondary,
    '--shock-accent-soft': presentation.accentSoft
  } as CSSProperties;

  if (!revealed) {
    return (
      <section className="shock-countdown-screen" style={screenStyle}>
        <CountdownOverlay
          seconds={5}
          label="情報開示まで"
          scenarioLabel={`${scenario.id.replace('scenario-', 'SCENARIO ')} / ${scenario.title}`}
          accent={presentation.accent}
          accentSecondary={presentation.accentSecondary}
          onComplete={reveal}
        />
      </section>
    );
  }

  return (
    <section
      className={`shock-command-screen shock-command-screen-simple shock-theme-${presentation.iconKey}`}
      style={screenStyle}
    >
      <div className="shock-command-scan" aria-hidden="true" />

      <header className="shock-hero-alert">
        <span><Siren /> 緊急市場速報</span>
        <strong>{presentation.riskClass}</strong>
        <em>{presentation.alertCode} / LEVEL 5</em>
      </header>

      <motion.main
        className="shock-hero-stage"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <section className="shock-hero-title-block">
          <div className="shock-hero-icon"><ShockIcon /></div>
          <div className="shock-hero-title">
            <span><RadioTower /> 強制イベント発生</span>
            <h1 className={[...shockEvent.title].length >= 14 ? 'is-long' : undefined}>
              {shockEvent.title}
            </h1>
          </div>
          <div className="shock-hero-level">
            <span>LEVEL</span>
            <strong>5</strong>
          </div>
        </section>

        <motion.section
        className="shock-hero-summary"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <h2><Activity /> 何が起きた？</h2>
          <p>{shockEvent.description}</p>
        </motion.section>

        <section className="shock-hero-impact-section">
          <h2><TrendingDown /> 直撃する3業種</h2>
          <div className="shock-hero-impacts">
            {directHits.map(([sector, effect], index) => (
              <motion.div
                key={sector}
                className="shock-hero-impact"
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 + index * 0.07 }}
              >
                <span>直撃 {index + 1}</span>
                <strong>{sector}</strong>
                <em>{effect.toFixed(0)}%</em>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.aside
          className="shock-hero-decision"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
        >
          <Zap />
          <div>
            <span>チームで今決めること</span>
            <strong>{presentation.decision}</strong>
          </div>
        </motion.aside>
      </motion.main>

      <footer className="shock-hero-footer">
        <div>
          <span>{presentation.signal}</span>
        </div>
        <button type="button" onClick={next}>
          <Activity />
          <span>緊急売買へ</span>
          <ArrowRight />
        </button>
      </footer>
    </section>
  );
}
