import type { MarketEvent } from '../types';

const event = (value: MarketEvent) => value;

export const marketEvents: MarketEvent[] = [
  event({
    id: 's1-r1-ai-capex',
    title: 'AI設備投資ブーム',
    description: '世界の大手企業がAI向け設備投資を増額。半導体とクラウドの受注が拡大。電力・電機にも関連需要が波及しました。',
    category: '通常イベント', marketMood: 'bullish', displayStyle: 'normal',
    lesson: '成長テーマは主役企業だけでなく、設備や電力など周辺産業にも波及します。',
    highlights: ['AI向け設備投資が過去最高水準', '半導体・クラウドの受注が拡大', '電力設備と電機にも需要が波及'],
    sectorEffects: { 半導体: 8, 'IT・クラウド': 7, 電機: 4, '電力・ガス': 3, 'ゲーム・娯楽': 3, 世界株インデックス: 3.5, 国内債券: -1, 食品: -0.5 }
  }),
  event({
    id: 's1-r2-chip-shortage',
    title: '高性能半導体の供給不足',
    description: 'AI向け半導体の供給不足が長期化。製造装置と電子部品にも注文が集中。利用企業には調達コスト増が重荷になりました。',
    category: '通常イベント', marketMood: 'optimistic', displayStyle: 'normal',
    lesson: '供給不足は売り手の価格決定力を高める一方、買い手の利益を圧迫します。',
    highlights: ['AI半導体の納期が長期化', '製造装置・電子部品へ需要波及', '利用企業の調達コストが上昇'],
    sectorEffects: { 半導体: 10, 電機: 6, '素材・化学': 4, 物流: 1, 世界株インデックス: 2, 'IT・クラウド': -2, 自動車: -3, 'ゲーム・娯楽': -1 }
  }),
  event({
    id: 's1-r3-ai-regulation',
    title: 'AI規制案を各国が公表',
    description: 'AIサービスに安全審査とデータ管理を義務化。開発コストの上昇懸念が拡大。安定収益の業種へ資金が移りました。',
    category: '通常イベント', marketMood: 'cautious', displayStyle: 'normal',
    lesson: '規制は同じテーマ内でも、資金力と対応力の差を広げます。',
    highlights: ['AIサービスに新たな安全審査', 'データ管理コストが増加', '安定収益の業種へ資金移動'],
    sectorEffects: { 'IT・クラウド': -8, 'ゲーム・娯楽': -7, 半導体: -4, 世界株インデックス: -2, 通信: 3, 医薬品: 2, 食品: 1.5, 国内債券: 1.5 }
  }),
  event({
    id: 's1-r4-ai-earnings',
    title: 'AI決算の優勝劣敗',
    description: 'AI投資を利益へ変えた企業が好決算。投資負担だけが増えた企業には失望売り。市場は実績を選別しました。',
    category: '通常イベント', marketMood: 'optimistic', displayStyle: 'recovery',
    lesson: '株価はテーマの強さだけでなく、期待と実際の利益の差で動きます。',
    highlights: ['半導体企業が利益予想を上方修正', 'クラウド需要は堅調を維持', '期待先行の娯楽株に利益確定売り'],
    sectorEffects: { 半導体: 7, 'IT・クラウド': 6, 電機: 4, 通信: 2, '素材・化学': 2, 世界株インデックス: 3, 'ゲーム・娯楽': -4, 国内債券: -0.5 }
  }),
  event({
    id: 's1-ai-export-shock',
    title: 'AI半導体の輸出規制ショック',
    description: '主要国が高性能半導体の輸出規制を即日強化。AI関連の売上見通しが急低下。安全資産と守りの業種へ資金が逃避しました。',
    category: '緊急リスク', marketMood: 'panic', displayStyle: 'shock', isForcedShock: true,
    lesson: '人気テーマへの集中は、規制変更ひとつで大きな損失につながります。',
    highlights: ['高性能半導体の輸出を即日制限', 'AI関連企業が業績見通しを撤回', '守りの資産へ資金が急速に移動'],
    sectorEffects: { 半導体: -18, 'IT・クラウド': -12, 電機: -10, 'ゲーム・娯楽': -8, 自動車: -7, 世界株インデックス: -9, 国内債券: 4, 医薬品: 5, 通信: 3, 食品: 2 }
  }),

  event({
    id: 's2-r1-rate-guidance',
    title: '追加利上げを示唆',
    description: '中央銀行が追加利上げの可能性を表明。銀行・保険の利ざや改善期待が上昇。債券、不動産、成長株には売りが出ました。',
    category: '通常イベント', marketMood: 'cautious', displayStyle: 'normal',
    lesson: '金利見通しの変化は、実際の利上げ前から資産価格へ織り込まれます。',
    highlights: ['中央銀行が追加利上げを示唆', '金融株の収益改善期待が上昇', '債券・不動産・成長株が下落'],
    sectorEffects: { 銀行: 6, 保険: 5, 国内債券: -4, 不動産: -5, 'IT・クラウド': -3, 半導体: -3, 建設: -2, 世界株インデックス: -1, '電力・ガス': 1 }
  }),
  event({
    id: 's2-r2-rate-hike',
    title: '政策金利を引き上げ',
    description: '中央銀行が政策金利の引き上げを決定。金融株は買われる一方で借入コストが上昇。不動産と成長株の下落が拡大しました。',
    category: '通常イベント', marketMood: 'cautious', displayStyle: 'normal',
    lesson: '利上げは金融機関の追い風になる一方、借入依存の企業には逆風です。',
    highlights: ['政策金利を市場予想以上に引き上げ', '住宅・企業向け融資金利が上昇', '不動産と成長株の評価が低下'],
    sectorEffects: { 銀行: 8, 保険: 6, 国内債券: -6, 不動産: -9, 'IT・クラウド': -6, 半導体: -5, 建設: -4, 小売: -2, 世界株インデックス: -3 }
  }),
  event({
    id: 's2-r3-liquidity-support',
    title: '緊急流動性支援',
    description: '金融当局が市場への資金供給を拡大。信用不安が後退し、売られた資産に買い戻し。不動産と建設にも安心感が戻りました。',
    category: '通常イベント', marketMood: 'recovery', displayStyle: 'recovery',
    lesson: '信用不安時は、政策の規模と支援が届く先を確認することが重要です。',
    highlights: ['金融市場へ緊急資金を供給', '信用不安が後退', '不動産・建設・世界株を買い戻し'],
    sectorEffects: { 国内債券: 5, 不動産: 7, 建設: 6, 'IT・クラウド': 4, 世界株インデックス: 5, 保険: 1, 銀行: -2, 半導体: 3 }
  }),
  event({
    id: 's2-r4-inflation-cools',
    title: 'インフレ鈍化で金利低下',
    description: '物価指標が市場予想を下回る結果。利上げ終了観測から債券価格が上昇。不動産と成長株にも資金が戻りました。',
    category: '通常イベント', marketMood: 'optimistic', displayStyle: 'recovery',
    lesson: '金利のピークアウトは、割引率に敏感な資産の評価を押し上げます。',
    highlights: ['物価上昇率が予想を下回る', '利上げ終了観測が強まる', '債券・不動産・成長株が反発'],
    sectorEffects: { 国内債券: 7, 不動産: 9, 'IT・クラウド': 8, 半導体: 7, 建設: 4, 世界株インデックス: 6, 銀行: -4, 保険: -2 }
  }),
  event({
    id: 's2-credit-crunch-shock',
    title: '信用収縮ショック',
    description: '大手金融機関の巨額損失が判明。銀行間取引が急速に縮小。安全資産へ資金が集中しました。',
    category: '緊急リスク', marketMood: 'panic', displayStyle: 'shock', isForcedShock: true,
    lesson: '金融システム不安では、金利上昇の恩恵より信用リスクが優先されます。',
    highlights: ['大手金融機関が巨額損失を公表', '企業向け融資が急速に縮小', '債券と守りの業種へ資金逃避'],
    sectorEffects: { 銀行: -18, 保険: -13, 不動産: -15, 建設: -12, 自動車: -10, 世界株インデックス: -10, 国内債券: 5, 医薬品: 4, 通信: 3, 食品: 3 }
  }),

  event({
    id: 's3-r1-yen-weakens',
    title: '円安と物価上昇が進行',
    description: '為替市場で円安が加速。輸出企業と資源関連は上昇。輸入コストの重い内需企業は下落しました。',
    category: '通常イベント', marketMood: 'cautious', displayStyle: 'normal',
    lesson: '円安はすべての企業に同じ影響を与えず、売上通貨と仕入れ通貨で差が出ます。',
    highlights: ['円安が輸出企業の利益を押し上げ', '資源価格が円換算で上昇', '食品・小売・外食のコストが増加'],
    sectorEffects: { 自動車: 6, 商社: 7, エネルギー: 8, '素材・化学': 4, 世界株インデックス: 1, 食品: -4, 小売: -5, 外食: -6, 物流: -4, '航空・旅行': -7, '電力・ガス': -2 }
  }),
  event({
    id: 's3-r2-import-costs',
    title: '輸入コストが一段高',
    description: '燃料・食料・素材の輸入価格が上昇。資源関連には買いが継続。物流、外食、航空の利益圧迫が強まりました。',
    category: '通常イベント', marketMood: 'cautious', displayStyle: 'normal',
    lesson: '売上が伸びていても、原価上昇を転嫁できなければ利益は減少します。',
    highlights: ['原油・穀物・素材価格が上昇', '資源関連への資金流入が継続', '運輸・消費業種の利益率が低下'],
    sectorEffects: { エネルギー: 9, '素材・化学': 6, 商社: 5, 自動車: 3, 物流: -7, 食品: -6, 小売: -5, 外食: -8, '航空・旅行': -9, '電力・ガス': -3 }
  }),
  event({
    id: 's3-r3-price-support',
    title: '物価高対策と価格転嫁',
    description: '政府が燃料・物流支援を開始。企業の値上げも消費者に浸透。内需企業の利益改善期待が広がりました。',
    category: '通常イベント', marketMood: 'recovery', displayStyle: 'recovery',
    lesson: '補助策と価格転嫁は、コストショックからの回復速度を変えます。',
    highlights: ['燃料・物流への補助策を開始', '食品・外食の価格転嫁が進展', '内需企業の利益改善期待が上昇'],
    sectorEffects: { 物流: 8, 食品: 7, 小売: 6, 外食: 9, '電力・ガス': 5, '航空・旅行': 4, 世界株インデックス: 2, エネルギー: -5, 商社: -2 }
  }),
  event({
    id: 's3-r4-yen-rebound',
    title: '円高反転で内需回復',
    description: '為替が円高方向へ反転。輸入コスト低下で内需企業が上昇。輸出・資源関連には利益確定売りが出ました。',
    category: '通常イベント', marketMood: 'optimistic', displayStyle: 'recovery',
    lesson: '為替トレンドの反転時は、これまでの勝者と敗者が入れ替わることがあります。',
    highlights: ['円相場が急速に反発', '食品・小売・旅行のコストが低下', '輸出・資源関連に利益確定売り'],
    sectorEffects: { 食品: 6, 小売: 7, 外食: 8, '航空・旅行': 9, 物流: 5, 'IT・クラウド': 2, 世界株インデックス: 3, 自動車: -6, 商社: -5, エネルギー: -4, '素材・化学': -3 }
  }),
  event({
    id: 's3-energy-supply-shock',
    title: 'エネルギー供給停止ショック',
    description: '主要産油国からの供給が突然停止。燃料価格と電力コストが急騰。運輸・消費・製造業に売りが広がりました。',
    category: '緊急リスク', marketMood: 'panic', displayStyle: 'shock', isForcedShock: true,
    lesson: '資源高の追い風を取るだけでなく、供給途絶が他業種へ与える連鎖も考える必要があります。',
    highlights: ['主要産油国からの供給が停止', '燃料・電力価格が急騰', '運輸・消費・製造へ影響が連鎖'],
    sectorEffects: { エネルギー: 15, 商社: 8, '素材・化学': 6, '電力・ガス': -8, 物流: -15, '航空・旅行': -18, 外食: -12, 食品: -10, 自動車: -7, 世界株インデックス: -6, 国内債券: 2 }
  }),

  event({
    id: 's4-r1-slowdown-signals',
    title: '景気減速シグナル',
    description: '企業景況感と消費指標が悪化。景気敏感株から売りが先行。医薬品・通信・食品へ資金が移りました。',
    category: '通常イベント', marketMood: 'cautious', displayStyle: 'normal',
    lesson: '景気先行指標は企業利益が落ちる前に、投資家の行動を変えます。',
    highlights: ['企業景況感が予想を下回る', '設備投資と個人消費が鈍化', '守りの業種へ資金が移動'],
    sectorEffects: { 医薬品: 4, 通信: 3, 食品: 3, 国内債券: 2, 自動車: -5, '素材・化学': -5, 建設: -4, '航空・旅行': -6, 外食: -5, 'IT・クラウド': -2, 世界株インデックス: -3 }
  }),
  event({
    id: 's4-r2-recession-confirmed',
    title: '景気後退入り',
    description: '主要国でマイナス成長が確認。企業の受注と雇用が減少。旅行・外食・耐久消費財の下落が加速しました。',
    category: '通常イベント', marketMood: 'panic', displayStyle: 'normal',
    lesson: '景気後退では需要減と固定費の重さが、利益の落ち込みを拡大します。',
    highlights: ['主要国がマイナス成長を記録', '受注減と雇用調整が拡大', '旅行・外食・耐久財が急落'],
    sectorEffects: { 医薬品: 5, 通信: 4, 食品: 4, 国内債券: 5, 自動車: -9, '素材・化学': -8, 建設: -8, '航空・旅行': -12, 外食: -10, 小売: -7, 世界株インデックス: -7, 銀行: -6 }
  }),
  event({
    id: 's4-r3-stimulus',
    title: '大型景気対策を発表',
    description: '政府が公共投資と消費支援を発表。建設・電機を中心に買い戻し。景気底打ち期待が広がりました。',
    category: '通常イベント', marketMood: 'recovery', displayStyle: 'recovery',
    lesson: '政策支援は対象業種と実行時期を見極めることで、投資判断に生かせます。',
    highlights: ['公共投資と雇用支援を拡大', '建設・電機に受注期待', '景気敏感株へ買い戻し'],
    sectorEffects: { 建設: 12, 電機: 8, 自動車: 7, 小売: 6, '素材・化学': 6, 世界株インデックス: 7, 銀行: 4, '航空・旅行': 5, 外食: 5, 国内債券: -2 }
  }),
  event({
    id: 's4-r4-selective-recovery',
    title: '景気回復と業種選別',
    description: '消費と生産に改善の兆し。財務の強い景気敏感企業が上昇。守りの資産には利益確定売りが出ました。',
    category: '通常イベント', marketMood: 'optimistic', displayStyle: 'recovery',
    lesson: '回復局面では、下落率ではなく財務体力と需要回復の速さが重要です。',
    highlights: ['消費と生産の先行指標が改善', '財務の強い景気敏感株が上昇', '守りの資産から資金が移動'],
    sectorEffects: { '航空・旅行': 14, 外食: 12, 自動車: 10, 電機: 8, 小売: 7, '素材・化学': 7, 世界株インデックス: 8, 医薬品: -2, 食品: -1, 国内債券: -3, 通信: -1 }
  }),
  event({
    id: 's4-global-demand-shock',
    title: '世界需要急減ショック',
    description: '主要国で企業活動が同時停止。受注と個人消費が急減。守りの業種と債券以外に全面安が広がりました。',
    category: '緊急リスク', marketMood: 'panic', displayStyle: 'shock', isForcedShock: true,
    lesson: '世界同時ショックでは、業種分散だけでなく現金と異なる資産の役割が表れます。',
    highlights: ['世界の企業活動が同時に停止', '受注と個人消費が急減', '債券と守りの業種へ資金逃避'],
    sectorEffects: { '航空・旅行': -22, 外食: -18, 自動車: -16, 建設: -14, '素材・化学': -13, 小売: -12, 銀行: -10, 世界株インデックス: -14, 医薬品: 6, 通信: 5, 食品: 5, 国内債券: 7, '電力・ガス': 4 }
  }),

  event({
    id: 's5-r1-short-covering',
    title: '売られすぎ銘柄が急反発',
    description: '暴落で売られすぎた銘柄に買い戻し。成長株と旅行株が大きく反発。安全資産には利益確定売りが出ました。',
    category: '通常イベント', marketMood: 'recovery', displayStyle: 'recovery',
    lesson: '大幅下落後の反発は大きい一方、事業価値と短期需給を分けて考える必要があります。',
    highlights: ['空売りの買い戻しが増加', '成長株・旅行株が急反発', '安全資産から資金が移動'],
    sectorEffects: { 半導体: 9, 'IT・クラウド': 8, 不動産: 7, '航空・旅行': 10, 'ゲーム・娯楽': 11, 自動車: 6, 世界株インデックス: 7, 国内債券: -2, 食品: -1 }
  }),
  event({
    id: 's5-r2-risk-on-rally',
    title: 'リスクオン相場が加速',
    description: '投資家心理の改善で市場全体に買い。値動きの大きい成長株が上昇を主導。守りの資産は相対的に出遅れました。',
    category: '通常イベント', marketMood: 'bullish', displayStyle: 'normal',
    lesson: '勢いの強い相場ほど、買う根拠と利益確定の基準を先に決める必要があります。',
    highlights: ['投資家心理が急速に改善', '成長株が上昇を主導', '守りの資産は相対的に下落'],
    sectorEffects: { 半導体: 12, 'IT・クラウド': 10, 'ゲーム・娯楽': 13, '航空・旅行': 9, 不動産: 8, 世界株インデックス: 9, 銀行: 5, 国内債券: -4, 食品: -2, '電力・ガス': -2 }
  }),
  event({
    id: 's5-r3-oversold-support',
    title: '財務優良株へ押し目買い',
    description: '急落後に長期資金が流入。現金創出力の高い企業が買われる展開。値動きだけの銘柄は戻りが鈍くなりました。',
    category: '通常イベント', marketMood: 'recovery', displayStyle: 'recovery',
    lesson: 'ショック後は、価格の安さだけでなく企業が生き残れるかを確認します。',
    highlights: ['長期投資家が押し目買い', '財務優良株を選別', '期待だけの銘柄は戻りが鈍い'],
    sectorEffects: { 医薬品: 7, 通信: 6, 世界株インデックス: 5, 'IT・クラウド': 5, 半導体: 4, 食品: 4, 国内債券: 3, 不動産: 2, 'ゲーム・娯楽': -2, '航空・旅行': -1 }
  }),
  event({
    id: 's5-r4-earnings-selection',
    title: '決算で本物の回復を選別',
    description: '好決算の企業に資金が集中。期待先行で上昇した銘柄には利益確定売り。市場全体は上昇しつつ差が広がりました。',
    category: '通常イベント', marketMood: 'optimistic', displayStyle: 'recovery',
    lesson: '最終局面では含み益を守りながら、期待が実績へ変わったかを確認します。',
    highlights: ['利益成長企業に資金が集中', '期待先行銘柄に利益確定売り', '市場内のパフォーマンス差が拡大'],
    sectorEffects: { 半導体: 8, 'IT・クラウド': 7, 医薬品: 5, 通信: 4, 電機: 4, 世界株インデックス: 6, 'ゲーム・娯楽': -7, '航空・旅行': -4, 不動産: -3, 国内債券: -1 }
  }),
  event({
    id: 's5-liquidity-shock',
    title: '流動性急減ショック',
    description: '大口投資家の一斉売却で買い手が消失。値動きの大きい銘柄ほど急落。現金・債券・守りの業種が再評価されました。',
    category: '緊急リスク', marketMood: 'panic', displayStyle: 'shock', isForcedShock: true,
    lesson: '上昇相場でも、売りたい時に売れない流動性リスクと現金余力を考える必要があります。',
    highlights: ['大口投資家が一斉に売却', '高変動銘柄の買い手が消失', '現金・債券・守りの業種を再評価'],
    sectorEffects: { 半導体: -20, 'IT・クラウド': -18, 'ゲーム・娯楽': -22, '航空・旅行': -16, 不動産: -17, 自動車: -14, 銀行: -12, 世界株インデックス: -15, 国内債券: 8, 医薬品: 6, 通信: 5, 食品: 4 }
  })
];

export const getEventById = (eventId: string): MarketEvent => {
  const found = marketEvents.find((item) => item.id === eventId);
  if (!found) throw new Error(`Market event not found: ${eventId}`);
  return found;
};
