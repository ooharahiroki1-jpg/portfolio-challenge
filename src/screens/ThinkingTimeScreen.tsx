import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Pause, Play, RotateCcw, Timer } from 'lucide-react';
import { useGame } from '../context/GameProvider';

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${rest
    .toString()
    .padStart(2, '0')}`;
};

export function ThinkingTimeScreen() {
  const { state, currentRound, next, goToPhase } = useGame();
  const totalSeconds = state.thinkingTimerSettings.minutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    setRemaining(totalSeconds);
    setRunning(true);
  }, [state.currentRound, totalSeconds]);

  useEffect(() => {
    if (!running || remaining <= 0) return undefined;
    const timer = window.setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [remaining, running]);

  const progress = useMemo(
    () => (totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0),
    [remaining, totalSeconds]
  );

  return (
    <section className="thinking-screen">
      <div className="thinking-bg" />

      <div className="thinking-timer-card">
        <div className="thinking-kicker">
          <Timer />
          第{state.currentRound}回 思考タイム
        </div>
        <div className="thinking-time">{formatTime(remaining)}</div>
        <div className="thinking-progress">
          <div style={{ width: `${progress}%` }} />
        </div>
        <div className="thinking-controls">
          <button type="button" onClick={() => setRunning((value) => !value)}>
            {running ? <Pause /> : <Play />}
            {running ? '停止' : '再開'}
          </button>
          <button
            type="button"
            onClick={() => {
              setRemaining(totalSeconds);
              setRunning(true);
            }}
          >
            <RotateCcw />
            リセット
          </button>
          <button type="button" onClick={next}>
            価格確認
            <ArrowRight />
          </button>
        </div>
      </div>

      <div className="thinking-news-card">
        <div className="thinking-news-title">{currentRound.preNews.title}</div>
        <p>{currentRound.preNews.body}</p>
      </div>

      <div className="thinking-points-card">
        <div className="thinking-points-title">考えるポイント</div>
        <div className="thinking-points">
          {currentRound.preNews.points.map((point, index) => (
            <div key={point}>
              <span>{index + 1}</span>
              {point}
            </div>
          ))}
        </div>
        <button type="button" onClick={() => goToPhase('team-analysis')}>
          チーム分析を見る
        </button>
      </div>
    </section>
  );
}
