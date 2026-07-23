import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  ArrowDownUp,
  Radio,
  ShieldAlert,
  Siren
} from 'lucide-react';

export function CountdownOverlay({
  seconds = 5,
  label = '情報開示まで',
  scenarioLabel = 'SCENARIO',
  accent = '#ff3b4f',
  accentSecondary = '#ffc928',
  onComplete
}: {
  seconds?: number;
  label?: string;
  scenarioLabel?: string;
  accent?: string;
  accentSecondary?: string;
  onComplete?: () => void;
}) {
  const [count, setCount] = useState(seconds);
  const completedRef = useRef(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    completedRef.current = false;
    setCount(seconds);
    const timer = window.setInterval(() => {
      setCount((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  useEffect(() => {
    if (count === 0 && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [count, onComplete]);

  const style = {
    '--shock-accent': accent,
    '--shock-accent-secondary': accentSecondary
  } as CSSProperties;

  return (
    <div className="shock-countdown-layer" style={style}>
      <div className="shock-countdown-scan" aria-hidden="true" />
      <header className="shock-countdown-header">
        <div><Siren /> 緊急市場速報</div>
        <strong>{scenarioLabel}</strong>
        <span>EMERGENCY FEED / ROUND 2</span>
      </header>

      <main className="shock-countdown-main">
        <section className="shock-countdown-message">
          <div className="shock-countdown-kicker"><Radio /> EMERGENCY TRANSMISSION</div>
          <h1>市場に重大な異常を検知</h1>
          <p>全チーム、操作を止めて画面に注目してください。<br />まもなく緊急リスク情報を開示します。</p>
          <div className="shock-countdown-status">
            <div><Activity /><span>市場監視</span><strong>急変動</strong></div>
            <div><ShieldAlert /><span>影響分析</span><strong>実行中</strong></div>
            <div><ArrowDownUp /><span>次の判断</span><strong>買い・売り</strong></div>
          </div>
        </section>

        <section className="shock-countdown-clock" aria-live="assertive" aria-atomic="true">
          <span>{label}</span>
          <AnimatePresence mode="wait">
            {count > 0 ? (
              <motion.strong
                key={count}
                initial={reduceMotion ? false : { opacity: 0, scale: 1.24 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.22 }}
              >
                {count}
              </motion.strong>
            ) : null}
          </AnimatePresence>
          <em>秒</em>
          <div className="shock-countdown-segments" aria-hidden="true">
            {Array.from({ length: seconds }, (_, index) => (
              <i key={index} className={index < count ? 'is-live' : ''} />
            ))}
          </div>
        </section>
      </main>

      <footer className="shock-countdown-footer">
        <ShieldAlert /> 強制イベントです。カウント終了後、自動で内容を開示します。
      </footer>
    </div>
  );
}
