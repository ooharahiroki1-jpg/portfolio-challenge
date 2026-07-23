import type { Scenario } from '../types';

export const scenarios: Scenario[] = [
  {
    id: 'scenario-1',
    title: 'AIブーム相場',
    description: 'AI投資の拡大から過熱、規制、決算選別までを通して、成長期待と割高リスクを学ぶシナリオ。',
    shockEventId: 's1-ai-export-shock',
    rounds: [
      {
        round: 1,
        marketMood: 'bullish',
        mainEventId: 's1-r1-ai-capex',
        lesson: '成長テーマと周辺需要',
        preNews: {
          title: '生成AIへの設備投資が世界で加速',
          body: '大手企業がAI向け投資を相次いで増額。半導体だけでなく、クラウドや電力設備にも需要が広がっています。',
          points: ['AI投資の恩恵が広がる業種はどこか', '期待が株価に織り込まれすぎていないか', '成長株以外も組み合わせるか'],
          relatedSectors: ['半導体', 'IT・クラウド', '電機', '電力・ガス']
        }
      },
      {
        round: 2,
        marketMood: 'optimistic',
        mainEventId: 's1-r2-chip-shortage',
        lesson: '供給不足と価格決定力',
        preNews: {
          title: '高性能半導体の供給不足が長期化',
          body: 'AI向け部品の注文が生産能力を上回っています。供給側は追い風ですが、利用企業にはコスト増が意識されています。',
          points: ['供給不足で利益を伸ばせる企業はどこか', '仕入れコスト上昇に弱い企業はどこか', 'テーマ集中のリスクを確認できているか'],
          relatedSectors: ['半導体', '電機', 'IT・クラウド', '自動車']
        }
      },
      {
        round: 3,
        marketMood: 'cautious',
        mainEventId: 's1-r3-ai-regulation',
        lesson: '規制と事業モデル',
        preNews: {
          title: '各国がAIサービスの新規制を協議',
          body: '安全対策やデータ管理の追加負担が見込まれます。成長率だけでなく、規制対応力が評価され始めました。',
          points: ['規制コストを吸収できる企業はどこか', 'AI以外の収益源があるか', 'ショック後の現金をどう使うか'],
          relatedSectors: ['IT・クラウド', 'ゲーム・娯楽', '通信', '半導体']
        }
      },
      {
        round: 4,
        marketMood: 'optimistic',
        mainEventId: 's1-r4-ai-earnings',
        lesson: '期待と実績の差',
        preNews: {
          title: 'AI関連企業の決算で明暗が分かれる',
          body: '売上が利益につながった企業と、投資負担が先行した企業の差が鮮明です。最終局面は銘柄選別が重要です。',
          points: ['売上だけでなく利益が伸びているか', '期待先行の銘柄を持ちすぎていないか', '最終順位に必要なリスク量はどれくらいか'],
          relatedSectors: ['半導体', 'IT・クラウド', '電機', '世界株インデックス']
        }
      }
    ]
  },
  {
    id: 'scenario-2',
    title: '金利上昇局面',
    description: '利上げ観測から信用不安、政策対応、金利低下までを通して、金利が株・債券・不動産へ与える影響を学ぶシナリオ。',
    shockEventId: 's2-credit-crunch-shock',
    rounds: [
      {
        round: 1,
        marketMood: 'cautious',
        mainEventId: 's2-r1-rate-guidance',
        lesson: '金利見通しと資金移動',
        preNews: {
          title: '中央銀行が追加利上げを示唆',
          body: '物価の高止まりを受け、政策金利の引き上げ観測が強まりました。金融株と金利敏感株で反応が分かれそうです。',
          points: ['利ざや改善の恩恵を受ける業種はどこか', '借入負担が重い企業はどこか', '債券価格がなぜ動くのか'],
          relatedSectors: ['銀行', '保険', '不動産', '国内債券']
        }
      },
      {
        round: 2,
        marketMood: 'cautious',
        mainEventId: 's2-r2-rate-hike',
        lesson: '利上げの実体経済への波及',
        preNews: {
          title: '政策金利引き上げが目前に',
          body: '住宅ローンや企業融資の金利上昇が見込まれます。銀行の収益改善期待と景気減速懸念が同時に強まっています。',
          points: ['金融株の追い風はどこまで続くか', '不動産と成長株の割高感はどう変わるか', '現金比率を増やすべきか'],
          relatedSectors: ['銀行', '保険', '不動産', 'IT・クラウド', '国内債券']
        }
      },
      {
        round: 3,
        marketMood: 'recovery',
        mainEventId: 's2-r3-liquidity-support',
        lesson: '信用不安と政策支援',
        preNews: {
          title: '金融当局が市場安定策を準備',
          body: '信用不安を抑えるため、資金供給と融資支援が検討されています。財務の強い企業から買い戻しが始まりました。',
          points: ['政策支援の恩恵を受ける資産はどこか', '財務の弱い企業を避けられるか', '急落後に買う量をどう決めるか'],
          relatedSectors: ['国内債券', '不動産', '建設', '世界株インデックス']
        }
      },
      {
        round: 4,
        marketMood: 'optimistic',
        mainEventId: 's2-r4-inflation-cools',
        lesson: '金利ピークアウト',
        preNews: {
          title: '物価鈍化で利上げ終了観測が浮上',
          body: 'インフレ指標が市場予想を下回りました。債券、不動産、成長株に金利低下を先取りする動きが出ています。',
          points: ['金利低下で評価が戻る資産はどこか', '銀行株の利益確定を考えるか', '最終局面で守りと反発をどう配分するか'],
          relatedSectors: ['国内債券', '不動産', 'IT・クラウド', '半導体']
        }
      }
    ]
  },
  {
    id: 'scenario-3',
    title: '円安インフレ',
    description: '円安と原材料高、供給ショック、価格転嫁、円高反転を通して、輸出企業と内需企業の違いを学ぶシナリオ。',
    shockEventId: 's3-energy-supply-shock',
    rounds: [
      {
        round: 1,
        marketMood: 'cautious',
        mainEventId: 's3-r1-yen-weakens',
        lesson: '円安の勝者と敗者',
        preNews: {
          title: '物価上昇と円安が進行',
          body: '原材料費や輸入コストが上昇。輸出企業と内需企業で株価への影響が分かれそうです。',
          points: ['円安メリットを受ける企業はどこか', '輸入コスト増に弱い業種はどこか', '値上げできる企業を見分けられるか'],
          relatedSectors: ['自動車', '商社', 'エネルギー', '食品', '外食']
        }
      },
      {
        round: 2,
        marketMood: 'cautious',
        mainEventId: 's3-r2-import-costs',
        lesson: 'コスト構造と価格転嫁',
        preNews: {
          title: '輸入物価が一段と上昇',
          body: '燃料、食料、素材の仕入れ価格が上がっています。売上が伸びても利益が減る企業に注意が必要です。',
          points: ['原材料高を販売価格へ転嫁できるか', '燃料高の影響が大きい業種はどこか', '生活必需品は本当に安全か'],
          relatedSectors: ['エネルギー', '素材・化学', '物流', '食品', '小売']
        }
      },
      {
        round: 3,
        marketMood: 'recovery',
        mainEventId: 's3-r3-price-support',
        lesson: '補助策と価格転嫁',
        preNews: {
          title: '政府がエネルギー・物流支援を表明',
          body: '補助金と価格転嫁の進展で、内需企業の利益圧迫が和らぐ見通しです。業種ごとの回復速度が焦点です。',
          points: ['支援でコスト負担が軽くなる業種はどこか', '値上げ後も需要が落ちない企業はどこか', 'ショック後の偏りを修正するか'],
          relatedSectors: ['物流', '食品', '外食', '小売', '電力・ガス']
        }
      },
      {
        round: 4,
        marketMood: 'optimistic',
        mainEventId: 's3-r4-yen-rebound',
        lesson: '為替反転とリバランス',
        preNews: {
          title: '円安が一服し、内需企業に回復期待',
          body: '為替が円高方向へ戻り、輸入コストの低下が期待されています。一方、輸出企業には利益確定売りが出始めました。',
          points: ['円高で利益が改善する企業はどこか', '輸出株の追い風は弱まるか', '最終局面で為替リスクを減らすか'],
          relatedSectors: ['食品', '小売', '外食', '航空・旅行', '自動車']
        }
      }
    ]
  },
  {
    id: 'scenario-4',
    title: '景気後退ショック',
    description: '景気減速から需要急減、政策支援、選別回復までを通して、分散・現金・守りの役割を学ぶシナリオ。',
    shockEventId: 's4-global-demand-shock',
    rounds: [
      {
        round: 1,
        marketMood: 'cautious',
        mainEventId: 's4-r1-slowdown-signals',
        lesson: '景気先行指標',
        preNews: {
          title: '企業景況感と消費指標が悪化',
          body: '設備投資と個人消費の伸びが鈍化しています。景気敏感株から守りの業種へ資金が移り始めました。',
          points: ['景気悪化に強い業種はどこか', '売上が景気に左右される企業はどこか', '現金をどれだけ残すか'],
          relatedSectors: ['医薬品', '通信', '食品', '自動車', '素材・化学']
        }
      },
      {
        round: 2,
        marketMood: 'panic',
        mainEventId: 's4-r2-recession-confirmed',
        lesson: '需要減と利益の落ち込み',
        preNews: {
          title: '主要国で景気後退入りの見方',
          body: '企業の受注減と雇用調整が報じられました。旅行、外食、耐久消費財への警戒が強まっています。',
          points: ['需要減の影響が大きい業種はどこか', '固定費が重い企業に注意できているか', '守りへ移すタイミングは遅くないか'],
          relatedSectors: ['航空・旅行', '外食', '自動車', '建設', '国内債券']
        }
      },
      {
        round: 3,
        marketMood: 'recovery',
        mainEventId: 's4-r3-stimulus',
        lesson: '政策支援と底打ち',
        preNews: {
          title: '大型経済対策と公共投資を発表へ',
          body: '政府が雇用支援、公共投資、消費喚起策を準備しています。下落した景気敏感株にも買い戻しの兆しがあります。',
          points: ['政策支援が直接届く業種はどこか', '下落率だけで買いを決めていないか', '回復まで耐えられる財務か'],
          relatedSectors: ['建設', '電機', '自動車', '小売', '世界株インデックス']
        }
      },
      {
        round: 4,
        marketMood: 'optimistic',
        mainEventId: 's4-r4-selective-recovery',
        lesson: '回復力の差',
        preNews: {
          title: '景気底打ち期待、回復業種を選別',
          body: '消費と生産に改善の兆しが見えます。ただし、負債が重い企業と財務の強い企業で回復力に差が出ています。',
          points: ['需要が先に戻る業種はどこか', '守りの資産をどこまで残すか', '順位逆転のためにリスクを取りすぎていないか'],
          relatedSectors: ['航空・旅行', '外食', '自動車', '電機', '世界株インデックス']
        }
      }
    ]
  },
  {
    id: 'scenario-5',
    title: '大逆転マーケット',
    description: '暴落後の買い戻し、急騰、流動性ショック、最終選別を通して、逆張りと利益確定を学ぶシナリオ。',
    shockEventId: 's5-liquidity-shock',
    rounds: [
      {
        round: 1,
        marketMood: 'recovery',
        mainEventId: 's5-r1-short-covering',
        lesson: '売られすぎと反発',
        preNews: {
          title: '暴落後の市場で買い戻しが始まる',
          body: '悲観が行き過ぎた銘柄に短期資金が流入しています。反発の大きさと事業価値は分けて考える必要があります。',
          points: ['売られすぎの銘柄をどう見つけるか', '反発余地と倒産リスクを区別できるか', '一度に資金を使い切らないか'],
          relatedSectors: ['半導体', 'IT・クラウド', '不動産', '航空・旅行']
        }
      },
      {
        round: 2,
        marketMood: 'bullish',
        mainEventId: 's5-r2-risk-on-rally',
        lesson: '勢いと過熱',
        preNews: {
          title: '投資家心理が改善し、成長株が急反発',
          body: '市場全体へ買いが広がり、値動きの大きい銘柄ほど上昇しています。過熱と乗り遅れ不安が同時に高まっています。',
          points: ['上昇の根拠は業績か需給か', '含み益をどこまで守るか', '高値で追いかけすぎていないか'],
          relatedSectors: ['半導体', 'IT・クラウド', 'ゲーム・娯楽', '世界株インデックス']
        }
      },
      {
        round: 3,
        marketMood: 'cautious',
        mainEventId: 's5-r3-oversold-support',
        lesson: '二番底と資金管理',
        preNews: {
          title: '急落後、財務の強い企業に押し目買い',
          body: '市場は不安定ですが、現金創出力の高い企業には長期資金が入り始めました。値動きより企業体力が重視されています。',
          points: ['ショックで割安になった企業はどこか', '損失を取り戻すために無理をしていないか', '現金を段階的に使えているか'],
          relatedSectors: ['医薬品', '通信', '世界株インデックス', 'IT・クラウド']
        }
      },
      {
        round: 4,
        marketMood: 'optimistic',
        mainEventId: 's5-r4-earnings-selection',
        lesson: '利益確定と最終判断',
        preNews: {
          title: '決算発表で回復の本物と期待先行が分かれる',
          body: '反発相場の最終局面です。利益成長が確認された企業は上昇し、期待だけで買われた企業には売りが出そうです。',
          points: ['含み益を確定する基準は何か', '業績が伴う企業へ入れ替えるか', '最終結果でリスクと収益をどう評価するか'],
          relatedSectors: ['半導体', 'IT・クラウド', '医薬品', '通信', '世界株インデックス']
        }
      }
    ]
  }
];

export const standardScenario = scenarios[0];

export const getScenarioById = (scenarioId?: string) =>
  scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0];

export const getScenarioRound = (scenarioId: string | undefined, round: number) => {
  const scenario = getScenarioById(scenarioId);
  return scenario.rounds.find((item) => item.round === round) ?? scenario.rounds.at(-1)!;
};
