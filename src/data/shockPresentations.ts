export type ShockIconKey = 'cpu' | 'credit' | 'energy' | 'global' | 'liquidity';

export interface ShockPresentation {
  riskClass: string;
  alertCode: string;
  signal: string;
  chainReaction: string;
  decision: string;
  iconKey: ShockIconKey;
  accent: string;
  accentSecondary: string;
  accentSoft: string;
}

export const shockPresentations: Record<string, ShockPresentation> = {
  's1-ai-export-shock': {
    riskClass: '政策・規制リスク',
    alertCode: 'EXPORT CONTROL',
    signal: 'AI輸出網が即時停止',
    chainReaction: '半導体からクラウド・電機へ、期待剥落が連鎖します。',
    decision: 'AI関連への集中を減らし、守りと現金を確保するか。',
    iconKey: 'cpu',
    accent: '#ff3d71',
    accentSecondary: '#9b6cff',
    accentSoft: 'rgba(155, 108, 255, 0.18)'
  },
  's2-credit-crunch-shock': {
    riskClass: '信用・金融システムリスク',
    alertCode: 'CREDIT FREEZE',
    signal: '市場の資金循環が急停止',
    chainReaction: '銀行不安から融資・不動産・企業活動へ影響が広がります。',
    decision: '金融集中を見直し、債券と守りへ資金を移すか。',
    iconKey: 'credit',
    accent: '#ff344d',
    accentSecondary: '#4dc3ff',
    accentSoft: 'rgba(77, 195, 255, 0.18)'
  },
  's3-energy-supply-shock': {
    riskClass: '供給網・資源リスク',
    alertCode: 'ENERGY HALT',
    signal: '燃料供給が突然途絶',
    chainReaction: '物流・旅行・外食・製造へ、コスト急騰が連鎖します。',
    decision: '資源高を取るか、コスト上昇業種を売却するか。',
    iconKey: 'energy',
    accent: '#ff4d2e',
    accentSecondary: '#ffc928',
    accentSoft: 'rgba(255, 201, 40, 0.2)'
  },
  's4-global-demand-shock': {
    riskClass: '世界需要・景気リスク',
    alertCode: 'GLOBAL STOP',
    signal: '世界の需要が同時急減',
    chainReaction: '受注・消費・設備投資が止まり、景気敏感株へ全面安が広がります。',
    decision: '株式だけの分散をやめ、現金と債券を厚くするか。',
    iconKey: 'global',
    accent: '#ff2f55',
    accentSecondary: '#ffe14f',
    accentSoft: 'rgba(255, 225, 79, 0.18)'
  },
  's5-liquidity-shock': {
    riskClass: '流動性・市場構造リスク',
    alertCode: 'NO BUYERS',
    signal: '市場から買い手が消失',
    chainReaction: '値動きの大きい銘柄ほど、売りたい価格で売れなくなります。',
    decision: '高変動資産を減らし、すぐ使える現金を確保するか。',
    iconKey: 'liquidity',
    accent: '#ff386f',
    accentSecondary: '#3de1ff',
    accentSoft: 'rgba(61, 225, 255, 0.18)'
  }
};

export const getShockPresentation = (eventId: string) => {
  const presentation = shockPresentations[eventId];
  if (!presentation) {
    throw new Error(`Shock presentation not found: ${eventId}`);
  }
  return presentation;
};
