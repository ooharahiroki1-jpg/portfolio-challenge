import { INITIAL_CAPITAL } from '../data/teams';
import type { Asset, EventHistoryEntry, Order, Team } from '../types';
import {
  buildRanking,
  getDiversificationScore,
  getMaxDrawdown
} from './portfolio';

export type EvaluationKey =
  | 'performance'
  | 'riskManagement'
  | 'diversification'
  | 'reasoning'
  | 'adaptability';

export interface EvaluationScores {
  performance: number;
  riskManagement: number;
  diversification: number;
  reasoning: number;
  adaptability: number;
}

export interface TeamEvaluation {
  team: Team;
  overallRank: number;
  assetRank: number;
  totalAssets: number;
  returnRate: number;
  maxDrawdown: number;
  overallScore: number;
  scores: EvaluationScores;
  bestReason: string;
  strengths: EvaluationKey[];
  praise: string;
  analysis: string[];
  nextStep: string;
}

export const evaluationLabels: Record<EvaluationKey, string> = {
  performance: '収益力',
  riskManagement: 'リスク管理',
  diversification: '分散投資',
  reasoning: '投資理由',
  adaptability: '対応力'
};

export const evaluationWeights: Record<EvaluationKey, number> = {
  performance: 0.45,
  riskManagement: 0.2,
  diversification: 0.15,
  reasoning: 0.12,
  adaptability: 0.08
};

const financeKeywords = [
  'ニュース',
  '金利',
  '景気',
  '業績',
  '利益',
  '成長',
  '割安',
  '分散',
  'リスク',
  '円安',
  '円高',
  'コスト',
  '需要',
  '価格',
  '決算',
  'インフレ',
  '回復',
  '現金'
];

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const reasonQuality = (reason: string) => {
  const normalized = reason.trim();
  if (!normalized) return 0;
  const lengthScore = clamp((normalized.length / 32) * 45, 8, 45);
  const keywordCount = financeKeywords.filter((keyword) =>
    normalized.includes(keyword)
  ).length;
  const keywordScore = clamp(keywordCount * 12, 0, 42);
  const causalScore = /ため|から|ので|見込|考え|予想|注目|備え/.test(normalized)
    ? 13
    : 0;
  return Math.round(clamp(lengthScore + keywordScore + causalScore));
};

const getReasoningScore = (orders: Order[]) => {
  if (orders.length === 0) return 0;
  const scored = orders.map((order) => reasonQuality(order.reason));
  const average = scored.reduce((sum, score) => sum + score, 0) / scored.length;
  const coveredRounds = new Set(orders.map((order) => order.round)).size;
  const roundCoverage = (coveredRounds / 4) * 20;
  return Math.round(clamp(average * 0.8 + roundCoverage));
};

const getBestReason = (team: Team) => {
  const reasons = team.orders
    .map((order) => order.reason.trim())
    .filter(Boolean)
    .sort((a, b) => reasonQuality(b) - reasonQuality(a));
  return reasons[0] || team.strategy || '投資理由の入力はありませんでした';
};

const getAdaptabilityScore = (team: Team, eventHistory: EventHistoryEntry[]) => {
  if (team.orders.length === 0) return 0;
  const activeRounds = new Set(team.orders.map((order) => order.round)).size;
  const sides = new Set(team.orders.map((order) => order.side));
  const shock = eventHistory.find((entry) => entry.phase === 'shock');
  const shockTime = shock ? Date.parse(shock.createdAt) : Number.NaN;
  const reactedToShock = Number.isFinite(shockTime)
    ? team.orders.some((order) => Date.parse(order.createdAt) >= shockTime)
    : false;

  return Math.round(
    clamp(
      (activeRounds / 4) * 60 +
        (sides.size > 1 ? 20 : 8) +
        (reactedToShock ? 20 : 0)
    )
  );
};

const getPraise = (score: number) => {
  if (score >= 88) return '市場を読み、守り、動いた総合力が圧巻でした';
  if (score >= 76) return '強みを結果につなげた見事な運用でした';
  if (score >= 64) return '最後まで判断を積み重ねた粘り強い運用でした';
  return '難しい相場で最後まで挑戦し続けました';
};

const nextStepByScore: Record<EvaluationKey, string> = {
  performance: 'ニュースと業績のつながりを整理し、上昇余地の根拠を一段深く考えよう。',
  riskManagement: '一つの業種へ資金を寄せすぎず、現金と損失上限を先に決めよう。',
  diversification: '値動きの異なる業種を組み合わせ、同時に下がるリスクを減らそう。',
  reasoning: '「どのニュースが、なぜ利益に影響するか」まで投資理由に書こう。',
  adaptability: 'イベント後は保有を見直し、買い・売り・維持を毎回選び直そう。'
};

export const evaluateTeams = (
  teams: Team[],
  assets: Asset[],
  eventHistory: EventHistoryEntry[]
): TeamEvaluation[] => {
  const assetRanking = buildRanking(teams, assets);
  const returns = assetRanking.map((row) => row.returnRate);
  const minReturn = Math.min(...returns, 0);
  const maxReturn = Math.max(...returns, 0);
  const returnRange = maxReturn - minReturn;

  const evaluations = assetRanking.map((row) => {
    const relativePerformance =
      returnRange < 0.01
        ? 70
        : 50 + ((row.returnRate - minReturn) / returnRange) * 50;
    const absolutePerformance = clamp(50 + row.returnRate * 5);
    const performance = Math.round(
      relativePerformance * 0.7 + absolutePerformance * 0.3
    );
    const maxDrawdown = getMaxDrawdown(row.team);
    const scores: EvaluationScores = {
      performance,
      riskManagement: Math.round(clamp(100 + maxDrawdown * 3.5)),
      diversification: getDiversificationScore(row.team, assets),
      reasoning: getReasoningScore(row.team.orders),
      adaptability: getAdaptabilityScore(row.team, eventHistory)
    };
    const overallScore = Math.round(
      (Object.keys(evaluationWeights) as EvaluationKey[]).reduce(
        (sum, key) => sum + scores[key] * evaluationWeights[key],
        0
      )
    );
    const strengths = (Object.keys(scores) as EvaluationKey[])
      .sort((a, b) => scores[b] - scores[a])
      .slice(0, 2);
    const weakest = (Object.keys(scores) as EvaluationKey[]).sort(
      (a, b) => scores[a] - scores[b]
    )[0];
    const profit = row.totalAssets - INITIAL_CAPITAL;

    return {
      team: row.team,
      overallRank: 0,
      assetRank: row.rank,
      totalAssets: row.totalAssets,
      returnRate: row.returnRate,
      maxDrawdown,
      overallScore,
      scores,
      bestReason: getBestReason(row.team),
      strengths,
      praise: getPraise(overallScore),
      analysis: [
        profit >= 0
          ? `元本から${Math.round(profit).toLocaleString('ja-JP')}円を増やしました。`
          : `損失を${Math.abs(Math.round(profit)).toLocaleString('ja-JP')}円に抑えました。`,
        `最大下落率は${maxDrawdown.toFixed(1)}%、分散スコアは${scores.diversification}点でした。`,
        `${new Set(row.team.orders.map((order) => order.round)).size}ラウンドで判断を実行し、投資理由は${row.team.orders.length}件記録しました。`
      ],
      nextStep: nextStepByScore[weakest]
    } satisfies TeamEvaluation;
  });

  return evaluations
    .sort(
      (a, b) =>
        b.overallScore - a.overallScore || b.totalAssets - a.totalAssets
    )
    .map((evaluation, index) => ({
      ...evaluation,
      overallRank: index + 1
    }));
};
