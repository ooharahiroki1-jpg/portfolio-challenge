import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  Crown,
  Medal,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users
} from 'lucide-react';
import { useGame } from '../context/GameProvider';
import { formatCompactCurrency, formatPercent } from '../lib/formatters';
import {
  evaluateTeams,
  evaluationLabels,
  type EvaluationKey
} from '../lib/teamEvaluation';

const awardMeta: Record<
  EvaluationKey,
  { title: string; icon: typeof Trophy; color: string }
> = {
  performance: { title: 'ベストリターン賞', icon: Trophy, color: '#f2b705' },
  riskManagement: { title: 'リスク管理賞', icon: ShieldCheck, color: '#0aa56b' },
  diversification: { title: '分散投資賞', icon: Target, color: '#0878f9' },
  reasoning: { title: 'ベスト投資理由賞', icon: BrainCircuit, color: '#6d35e8' },
  adaptability: { title: 'マーケット対応賞', icon: Sparkles, color: '#e65c12' }
};

export function FinalResultsScreen() {
  const { state, next } = useGame();
  const evaluations = evaluateTeams(state.teams, state.assets, state.eventHistory);
  const winner = evaluations[0];
  const podium = [evaluations[1], evaluations[0], evaluations[2]].filter(Boolean);
  const remaining = evaluations.slice(3);
  const awardWinners = (Object.keys(awardMeta) as EvaluationKey[]).map((key) => ({
    key,
    evaluation: evaluations.slice().sort((a, b) => b.scores[key] - a.scores[key])[0]
  }));

  if (!winner) return null;

  return (
    <section className={`final-celebration-screen team-count-${state.teams.length}`}>
      <header className="final-celebration-header">
        <div className="final-celebration-brand">
          <Trophy />
          <span>100万円ポートフォリオ・チャレンジ</span>
        </div>
        <div className="final-complete-pill">
          <PartyPopper /> 全4ラウンド完走
        </div>
        <h1>最終結果発表</h1>
        <p>収益だけでなく、守り・分散・投資理由・変化への対応まで総合評価</p>
      </header>

      <main className="final-celebration-main">
        <motion.section
          className="final-winner-stage"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 16 }}
        >
          <motion.div
            className="final-winner-trophy"
            animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Trophy />
          </motion.div>
          <div className="final-winner-copy">
            <span><Crown /> 総合優勝</span>
            <h2>{winner.team.name}</h2>
            <p>{winner.praise}</p>
            <div className="final-winner-strengths">
              {winner.strengths.map((key) => (
                <strong key={key}>{evaluationLabels[key]} {winner.scores[key]}点</strong>
              ))}
            </div>
          </div>
          <div className="final-winner-score">
            <span>総合スコア</span>
            <strong>{winner.overallScore}</strong>
            <em>/ 100</em>
          </div>
          <div className="final-winner-assets">
            <div>
              <span>最終資産</span>
              <strong>{formatCompactCurrency(winner.totalAssets)}</strong>
            </div>
            <div>
              <span>収益率</span>
              <strong className={winner.returnRate >= 0 ? 'is-positive' : 'is-negative'}>
                {formatPercent(winner.returnRate)}
              </strong>
            </div>
          </div>
        </motion.section>

        <section className="final-podium-section" aria-label="総合ランキング上位">
          <div className="final-section-heading"><Medal /> 総合ランキング</div>
          <div className={`final-podium final-podium-${podium.length}`}>
            {podium.map((evaluation, index) => (
              <motion.article
                key={evaluation.team.id}
                className={`final-podium-place rank-${evaluation.overallRank}`}
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + index * 0.12 }}
                style={{ '--team-color': evaluation.team.color } as CSSProperties}
              >
                <span className="final-podium-rank">{evaluation.overallRank}位</span>
                <div className="final-podium-team"><Users /> {evaluation.team.name}</div>
                <strong>{evaluation.overallScore}<small>点</small></strong>
                <em>資産順位 {evaluation.assetRank}位</em>
              </motion.article>
            ))}
          </div>
          {remaining.length > 0 ? (
            <div className="final-other-ranking">
              {remaining.map((evaluation) => (
                <div key={evaluation.team.id}>
                  <span>{evaluation.overallRank}位</span>
                  <strong style={{ color: evaluation.team.color }}>{evaluation.team.name}</strong>
                  <em>{evaluation.overallScore}点</em>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="final-awards-section">
          <div className="final-section-heading"><Sparkles /> 5つの特別賞</div>
          <div className="final-award-grid">
            {awardWinners.map(({ key, evaluation }, index) => {
              const meta = awardMeta[key];
              const Icon = meta.icon;
              return (
                <motion.article
                  key={key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.24 + index * 0.08 }}
                  style={{ '--award-color': meta.color } as CSSProperties}
                >
                  <Icon />
                  <div>
                    <span>{meta.title}</span>
                    <strong>{evaluation.team.name}</strong>
                  </div>
                  <em>{evaluation.scores[key]}点</em>
                </motion.article>
              );
            })}
          </div>
        </section>
      </main>

      <button type="button" className="final-analysis-next" onClick={next}>
        <BrainCircuit />
        <span>なぜこの成績になった？ 勝因分析へ</span>
        <ArrowRight />
      </button>
    </section>
  );
}
