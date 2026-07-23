import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Home,
  Lightbulb,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users
} from 'lucide-react';
import { useMemo, useState, type CSSProperties } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer
} from 'recharts';
import { useGame } from '../context/GameProvider';
import { formatCompactCurrency, formatPercent } from '../lib/formatters';
import {
  evaluateTeams,
  evaluationLabels,
  type EvaluationKey
} from '../lib/teamEvaluation';

const scoreKeys = Object.keys(evaluationLabels) as EvaluationKey[];

export function DetailedReportScreen() {
  const { state, back, goToPhase } = useGame();
  const evaluations = useMemo(
    () => evaluateTeams(state.teams, state.assets, state.eventHistory),
    [state.assets, state.eventHistory, state.teams]
  );
  const [selectedTeamId, setSelectedTeamId] = useState(evaluations[0]?.team.id ?? '');
  const selected =
    evaluations.find((evaluation) => evaluation.team.id === selectedTeamId) ??
    evaluations[0];

  if (!selected) return null;

  const radarData = scoreKeys.map((key) => ({
    subject: evaluationLabels[key],
    score: selected.scores[key],
    fullMark: 100
  }));
  const roundReasons = [1, 2, 3, 4].map((round) => {
    const orders = selected.team.orders.filter((order) => order.round === round);
    return {
      round,
      reason: orders.at(-1)?.reason || 'この回は注文せず、保有を維持',
      orderCount: orders.length
    };
  });

  return (
    <section className="final-analysis-screen">
      <header className="final-analysis-header">
        <div className="final-analysis-title">
          <BrainCircuit />
          <div>
            <span>GAME REVIEW</span>
            <h1>成績を生んだ投資判断を分析</h1>
          </div>
        </div>
        <p>資産・守り・分散・理由・対応力を振り返り、次の投資へつなげよう</p>
      </header>

      <nav className="final-analysis-team-tabs" aria-label="分析するチーム">
        {evaluations.map((evaluation) => (
          <button
            type="button"
            key={evaluation.team.id}
            className={evaluation.team.id === selected.team.id ? 'is-selected' : ''}
            onClick={() => setSelectedTeamId(evaluation.team.id)}
            style={{ '--team-color': evaluation.team.color } as CSSProperties}
          >
            <span>{evaluation.overallRank}位</span>
            <strong>{evaluation.team.name}</strong>
            <em>{evaluation.overallScore}点</em>
          </button>
        ))}
      </nav>

      <motion.main
        key={selected.team.id}
        className="final-analysis-main"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <section className="final-analysis-score-panel">
          <div className="final-analysis-team-heading">
            <div style={{ background: selected.team.color }}><Users /></div>
            <div>
              <span>総合{selected.overallRank}位</span>
              <h2>{selected.team.name}</h2>
            </div>
            <strong>{selected.overallScore}<small>点</small></strong>
          </div>
          <div className="final-analysis-radar">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="#bfd4ef" strokeWidth={2} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#071842', fontSize: 20, fontWeight: 900 }}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="score"
                  stroke={selected.team.color}
                  fill={selected.team.color}
                  fillOpacity={0.28}
                  strokeWidth={4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="final-analysis-metrics">
            <div><span>最終資産</span><strong>{formatCompactCurrency(selected.totalAssets)}</strong></div>
            <div><span>収益率</span><strong>{formatPercent(selected.returnRate)}</strong></div>
            <div><span>最大下落</span><strong>{formatPercent(selected.maxDrawdown)}</strong></div>
          </div>
        </section>

        <section className="final-analysis-why-panel">
          <div className="final-analysis-section-title"><Trophy /> なぜこの成績になった？</div>
          <div className="final-analysis-praise"><Sparkles /> {selected.praise}</div>
          <div className="final-analysis-findings">
            {selected.analysis.map((line) => (
              <div key={line}><CheckCircle2 /> <span>{line}</span></div>
            ))}
          </div>
          <div className="final-analysis-strengths">
            <span>特に優れていた力</span>
            {selected.strengths.map((key) => (
              <strong key={key}>
                {key === 'riskManagement' ? <ShieldCheck /> : key === 'diversification' ? <Target /> : <BarChart3 />}
                {evaluationLabels[key]} {selected.scores[key]}点
              </strong>
            ))}
          </div>
          <blockquote className="final-analysis-reason">
            <Quote />
            <div>
              <span>代表的な投資理由</span>
              <p>「{selected.bestReason}」</p>
            </div>
          </blockquote>
          <div className="final-analysis-next-lesson">
            <Lightbulb />
            <div><span>次に伸ばすポイント</span><p>{selected.nextStep}</p></div>
          </div>
        </section>

        <section className="final-analysis-timeline">
          <div className="final-analysis-section-title"><BrainCircuit /> 4ラウンドの判断記録</div>
          <div className="final-analysis-rounds">
            {roundReasons.map((item) => (
              <article key={item.round}>
                <span>第{item.round}回</span>
                <strong>{item.orderCount > 0 ? `${item.orderCount}件の注文` : '保有を維持'}</strong>
                <p>{item.reason}</p>
              </article>
            ))}
          </div>
        </section>
      </motion.main>

      <footer className="final-analysis-actions">
        <button type="button" onClick={back}><ArrowLeft /> 結果発表へ戻る</button>
        <button type="button" onClick={() => goToPhase('start')}><Home /> スタート画面へ</button>
      </footer>
    </section>
  );
}
