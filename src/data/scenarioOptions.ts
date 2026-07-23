export interface ScenarioOption {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  situationTitle: string;
  situationBullets: string[];
  marketMood: string;
  moodPosition: number;
  detailRows: Array<{
    label: string;
    value: string;
  }>;
  candidateSectors: Array<{
    label: string;
    change: string;
  }>;
  defaultPolicyPrompt: string;
}

export const scenarioOptions: ScenarioOption[] = [
  {
    id: 'scenario-1',
    number: 1,
    title: 'AIブーム相場',
    subtitle: '半導体・クラウド・成長株が主役',
    situationTitle: 'AI需要拡大',
    situationBullets: [
      '生成AI投資が加速',
      '半導体・クラウドに資金流入',
      '金利は横ばい',
      '成長株が強い地合い',
      '注意：過熱感と決算失望'
    ],
    marketMood: '強気',
    moodPosition: 82,
    detailRows: [
      { label: 'テーマ', value: 'AI・テクノロジーの成長が加速' },
      { label: '市場環境', value: '株式市場が上昇トレンド' },
      { label: '攻略のカギ', value: '成長株への投資配分がカギ' }
    ],
    candidateSectors: [
      { label: '半導体', change: '+5.80%' },
      { label: 'クラウド', change: '+4.20%' },
      { label: 'AI関連', change: '+6.30%' },
      { label: '世界株', change: '+3.10%' }
    ],
    defaultPolicyPrompt: '成長株を中心に攻めるか、過熱リスクに備えて分散するか'
  },
  {
    id: 'scenario-2',
    number: 2,
    title: '金利上昇局面',
    subtitle: '債券・銀行・不動産に注目',
    situationTitle: '金利上昇を警戒',
    situationBullets: [
      '中央銀行が利上げを示唆',
      '銀行・保険に追い風',
      '不動産と成長株は重い展開',
      '債券価格の下落に注意',
      '現金比率の判断が重要'
    ],
    marketMood: '警戒',
    moodPosition: 48,
    detailRows: [
      { label: 'テーマ', value: '金利上昇で資金の流れが変化' },
      { label: '市場環境', value: '銀行・保険に注目が集まる' },
      { label: '攻略のカギ', value: '守りと金利メリットの配分' }
    ],
    candidateSectors: [
      { label: '銀行', change: '+4.40%' },
      { label: '保険', change: '+3.70%' },
      { label: '国内債券', change: '-2.20%' },
      { label: '不動産', change: '-3.50%' }
    ],
    defaultPolicyPrompt: '金利上昇に強い銘柄を選ぶか、下落リスクを避けるか'
  },
  {
    id: 'scenario-3',
    number: 3,
    title: '円安インフレ',
    subtitle: '輸出企業と生活コストを考える',
    situationTitle: '円安と物価上昇',
    situationBullets: [
      '輸出企業に追い風',
      '燃料・食料コストが上昇',
      '外食・小売は利益圧迫',
      '資源関連に資金流入',
      '家計負担の増加に注意'
    ],
    marketMood: '強弱混在',
    moodPosition: 58,
    detailRows: [
      { label: 'テーマ', value: '円安とインフレの影響を読む' },
      { label: '市場環境', value: '輸出・資源は強く消費は重い' },
      { label: '攻略のカギ', value: 'コスト増に強い企業を選ぶ' }
    ],
    candidateSectors: [
      { label: '自動車', change: '+4.90%' },
      { label: '商社', change: '+5.10%' },
      { label: 'エネルギー', change: '+6.00%' },
      { label: '外食', change: '-3.40%' }
    ],
    defaultPolicyPrompt: '円安メリットを取るか、生活コスト上昇の逆風を避けるか'
  },
  {
    id: 'scenario-4',
    number: 4,
    title: '景気後退ショック',
    subtitle: '守りと分散が試される',
    situationTitle: '景気後退懸念',
    situationBullets: [
      '景気敏感株に売り圧力',
      '旅行・外食の需要が鈍化',
      '守りの業種に資金退避',
      '現金と分散が重要',
      '急落時の買い判断に注意'
    ],
    marketMood: '弱気',
    moodPosition: 22,
    detailRows: [
      { label: 'テーマ', value: '下落局面での守り方を学ぶ' },
      { label: '市場環境', value: '守りの資産と現金が注目される' },
      { label: '攻略のカギ', value: '集中投資を避けて耐える' }
    ],
    candidateSectors: [
      { label: '通信', change: '+1.80%' },
      { label: '食品', change: '+1.40%' },
      { label: '医薬品', change: '+2.20%' },
      { label: '航空', change: '-5.70%' }
    ],
    defaultPolicyPrompt: '守りを厚くするか、下落後の反発を狙うか'
  },
  {
    id: 'scenario-5',
    number: 5,
    title: '大逆転マーケット',
    subtitle: '暴落後の回復チャンスを狙う',
    situationTitle: '反発局面を狙う',
    situationBullets: [
      '暴落後に買い戻しが発生',
      '売られすぎ銘柄に注目',
      '成長株の反発力が高い',
      '戻りが鈍い業種もある',
      '最終局面のリスク管理が重要'
    ],
    marketMood: '回復期待',
    moodPosition: 70,
    detailRows: [
      { label: 'テーマ', value: '暴落後のチャンスを見極める' },
      { label: '市場環境', value: '反発期待と不安が混在' },
      { label: '攻略のカギ', value: '余力を使うタイミング' }
    ],
    candidateSectors: [
      { label: 'クラウド', change: '+5.40%' },
      { label: '半導体', change: '+5.90%' },
      { label: '不動産', change: '+3.80%' },
      { label: '世界株', change: '+2.70%' }
    ],
    defaultPolicyPrompt: '反発狙いで攻めるか、利益確定を優先するか'
  }
];

export const defaultScenarioOptionId = scenarioOptions[0].id;

export const getScenarioOption = (id?: string) =>
  scenarioOptions.find((scenario) => scenario.id === id) ?? scenarioOptions[0];
