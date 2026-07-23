import { describe, expect, it } from 'vitest';
import { getEventById, marketEvents } from '../data/events';
import { scenarios } from '../data/scenarios';
import { shockPresentations } from '../data/shockPresentations';
import {
  advanceToNextInvestmentRound,
  applyMarketEvent,
  createInitialGameState,
  executeOrder,
  getCurrentMarketEvent,
  getCurrentScenarioRound,
  getShockEvent,
  shouldAutoTriggerShock
} from '../lib/gameEngine';
import {
  getCategoryAllocation,
  getDiversificationScore,
  getMaxDrawdown,
  getShockRecoveryRate,
  getTeamTotalAssets
} from '../lib/portfolio';
import { evaluateTeams } from '../lib/teamEvaluation';

const settings = {
  investmentRounds: 4,
  teamCount: 4,
  thinkingMinutes: 15
} as const;

describe('game engine', () => {
  it('processes buy orders by quantity and updates cash, holdings, and total amount', () => {
    const state = createInitialGameState(settings, 'order');
    const next = executeOrder(state, {
      teamId: 'team-a',
      assetId: 'mirai-bank',
      side: 'buy',
      quantity: 10,
      reason: '金利上昇で銀行が有利だと思うから'
    });

    const team = next.teams.find((item) => item.id === 'team-a')!;
    expect(next.orders.at(-1)).toMatchObject({
      quantity: 10,
      price: 1_875,
      totalAmount: 18_750
    });
    expect(team.cash).toBe(981_250);
    expect(team.holdings[0]).toMatchObject({
      assetId: 'mirai-bank',
      quantity: 10,
      averageCost: 1_875
    });
    expect(getTeamTotalAssets(team, next.assets)).toBe(1_000_000);
  });

  it('rejects orders without reason, invalid quantity, or insufficient cash', () => {
    const state = createInitialGameState(settings, 'order');
    expect(() =>
      executeOrder(state, {
        teamId: 'team-a',
        assetId: 'mirai-bank',
        side: 'buy',
        quantity: 10,
        reason: ''
      })
    ).toThrow('投資理由');

    expect(() =>
      executeOrder(state, {
        teamId: 'team-a',
        assetId: 'mirai-bank',
        side: 'buy',
        quantity: 0,
        reason: '少しだけ試したいから'
      })
    ).toThrow('株数');

    expect(() =>
      executeOrder(state, {
        teamId: 'team-a',
        assetId: 'mirai-bank',
        side: 'buy',
        quantity: 600,
        reason: '資産を大きく増やしたいから'
      })
    ).toThrow('現金残高');
  });

  it('rejects sell orders when holdings are insufficient', () => {
    const state = createInitialGameState(settings, 'order');
    expect(() =>
      executeOrder(state, {
        teamId: 'team-a',
        assetId: 'mirai-bank',
        side: 'sell',
        quantity: 1,
        reason: '利益確定したいから'
      })
    ).toThrow('保有数量');
  });

  it('updates prices by event effects and recalculates team assets', () => {
    const state = createInitialGameState(settings, 'order');
    const ordered = executeOrder(state, {
      teamId: 'team-a',
      assetId: 'hinomaru-energy',
      side: 'buy',
      quantity: 10,
      reason: 'インフレに強い業種だと思うから'
    });
    const updated = applyMarketEvent(
      ordered,
      getEventById('s3-r1-yen-weakens'),
      'normal',
      '2026-01-01T00:00:00.000Z'
    );
    const energy = updated.assets.find((asset) => asset.id === 'hinomaru-energy')!;
    const team = updated.teams.find((item) => item.id === 'team-a')!;

    expect(energy.price).toBe(1_525);
    expect(getTeamTotalAssets(team, updated.assets)).toBe(1_001_130);
    expect(team.assetHistory.at(-1)?.returnRate).toBeCloseTo(0.113, 3);
  });

  it('adds a small deterministic move to assets outside the event sectors', () => {
    const state = createInitialGameState(settings, 'event');
    const event = getEventById('s1-r1-ai-capex');
    const first = applyMarketEvent(
      state,
      event,
      'normal',
      '2026-01-01T00:00:00.000Z'
    );
    const repeated = applyMarketEvent(
      state,
      event,
      'normal',
      '2026-01-01T00:00:00.000Z'
    );
    const unrelatedAssets = state.assets.filter(
      (asset) =>
        event.assetEffects?.[asset.id] === undefined &&
        event.sectorEffects[asset.sector] === undefined
    );

    expect(unrelatedAssets.length).toBeGreaterThan(0);
    unrelatedAssets.forEach((asset) => {
      const nextPrice = first.assets.find((item) => item.id === asset.id)!.price;
      const repeatedPrice = repeated.assets.find((item) => item.id === asset.id)!.price;
      const changeRate = ((nextPrice - asset.price) / asset.price) * 100;

      expect(nextPrice).not.toBe(asset.price);
      expect(Math.abs(changeRate)).toBeLessThanOrEqual(1.25);
      expect(repeatedPrice).toBe(nextPrice);
    });
  });

  it('keeps direct event effects stronger and exact', () => {
    const state = createInitialGameState(settings, 'event');
    const event = getEventById('s1-r1-ai-capex');
    const updated = applyMarketEvent(
      state,
      event,
      'normal',
      '2026-01-01T00:00:00.000Z'
    );
    const chipBefore = state.assets.find((asset) => asset.id === 'next-chip')!;
    const chipAfter = updated.assets.find((asset) => asset.id === 'next-chip')!;

    expect(chipAfter.price).toBe(Math.round(chipBefore.price * 1.08));
  });

  it('calculates diversification score, max drawdown, and category allocation', () => {
    const state = {
      ...createInitialGameState(settings, 'order'),
      selectedScenarioId: 'scenario-4'
    };
    const ordered = executeOrder(state, {
      teamId: 'team-a',
      assetId: 'sky-travel',
      side: 'buy',
      quantity: 500,
      reason: '景気回復に強いと思うから'
    });
    const shocked = applyMarketEvent(
      ordered,
      getEventById('s4-global-demand-shock'),
      'shock',
      '2026-01-01T00:00:00.000Z'
    );
    const team = shocked.teams.find((item) => item.id === 'team-a')!;
    const allocation = getCategoryAllocation(team, shocked.assets);

    expect(allocation.消費).toBe(396_000);
    expect(allocation.現金).toBe(492_500);
    expect(team.assetHistory.at(-1)?.categoryAllocation.消費).toBe(396_000);
    expect(getDiversificationScore(team, shocked.assets)).toBeGreaterThan(40);
    expect(getMaxDrawdown(team)).toBeLessThan(0);
  });

  it('marks the second round normal event as the automatic shock trigger point', () => {
    const state = {
      ...createInitialGameState(settings, 'event'),
      currentRound: 2
    };
    const afterRoundTwo = applyMarketEvent(
      state,
      getEventById('s1-r2-chip-shortage'),
      'normal',
      '2026-01-01T00:00:00.000Z'
    );

    expect(shouldAutoTriggerShock(afterRoundTwo)).toBe(true);
  });

  it('measures recovery after the shock event', () => {
    const state = {
      ...createInitialGameState(settings, 'order'),
      selectedScenarioId: 'scenario-2'
    };
    const ordered = executeOrder(state, {
      teamId: 'team-a',
      assetId: 'city-development',
      side: 'buy',
      quantity: 50,
      reason: '下落後の政策支援で反発すると考えたから'
    });
    const shocked = applyMarketEvent(
      ordered,
      getEventById('s2-credit-crunch-shock'),
      'shock',
      '2026-01-01T00:00:00.000Z'
    );
    const shockedTeam = shocked.teams.find((item) => item.id === 'team-a')!;
    const shockAfterTotal = getTeamTotalAssets(shockedTeam, shocked.assets);
    const recovered = applyMarketEvent(
      { ...shocked, currentRound: 3 },
      getEventById('s2-r3-liquidity-support'),
      'recovery',
      '2026-01-02T00:00:00.000Z'
    );
    const recoveredTeam = recovered.teams.find((item) => item.id === 'team-a')!;

    expect(getTeamTotalAssets(recoveredTeam, recovered.assets)).toBeGreaterThan(
      shockAfterTotal
    );
    expect(getShockRecoveryRate(recoveredTeam, shockAfterTotal)).toBeGreaterThan(0);
  });

  it('provides four unique rounds and one emergency risk for every scenario', () => {
    expect(scenarios).toHaveLength(5);
    const preNewsTitles: string[] = [];
    const normalEventTitles: string[] = [];
    const normalEventIds = scenarios.flatMap((scenario) => {
      expect(scenario.rounds.map((round) => round.round)).toEqual([1, 2, 3, 4]);
      expect(getEventById(scenario.shockEventId).displayStyle).toBe('shock');
      return scenario.rounds.map((round) => {
        const event = getEventById(round.mainEventId);
        preNewsTitles.push(round.preNews.title);
        normalEventTitles.push(event.title);
        expect(round.preNews.points).toHaveLength(3);
        expect(round.preNews.relatedSectors.length).toBeGreaterThanOrEqual(3);
        expect(Object.values(event.sectorEffects).some((effect) => effect > 0)).toBe(true);
        expect(Object.values(event.sectorEffects).some((effect) => effect < 0)).toBe(true);
        return round.mainEventId;
      });
    });

    expect(new Set(normalEventIds).size).toBe(20);
    expect(new Set(preNewsTitles).size).toBe(20);
    expect(new Set(normalEventTitles).size).toBe(20);
    expect(marketEvents).toHaveLength(25);
    expect(Object.keys(shockPresentations).sort()).toEqual(
      scenarios.map((scenario) => scenario.shockEventId).sort()
    );
    expect(new Set(Object.values(shockPresentations).map((item) => item.alertCode)).size).toBe(5);
    expect(new Set(Object.values(shockPresentations).map((item) => item.decision)).size).toBe(5);
    marketEvents.forEach((item) => {
      expect(item.highlights).toHaveLength(3);
      expect(Object.keys(item.sectorEffects).length).toBeGreaterThanOrEqual(8);
    });
  });

  it('uses the selected scenario for news, events, and emergency risk', () => {
    const state = {
      ...createInitialGameState(settings, 'news'),
      selectedScenarioId: 'scenario-5',
      currentRound: 3
    };

    expect(getCurrentScenarioRound(state).preNews.title).toContain('財務');
    expect(getCurrentMarketEvent(state).id).toBe('s5-r3-oversold-support');
    expect(getShockEvent(state).id).toBe('s5-liquidity-shock');
  });

  it('starts rounds two through four from the pre-news screen', () => {
    const state = createInitialGameState(settings, 'ranking-update');
    const nextRound = advanceToNextInvestmentRound(state);

    expect(nextRound.currentRound).toBe(2);
    expect(nextRound.gamePhase).toBe('news');
  });

  it('runs all four rounds and the emergency risk for every scenario', () => {
    scenarios.forEach((scenario) => {
      let state = {
        ...createInitialGameState(settings, 'order'),
        selectedScenarioId: scenario.id
      };

      for (let round = 1; round <= 4; round += 1) {
        expect(state.currentRound).toBe(round);
        state = applyMarketEvent(
          state,
          getCurrentMarketEvent(state),
          'normal',
          `2026-01-0${round}T00:00:00.000Z`
        );

        if (round === 2) {
          expect(shouldAutoTriggerShock(state)).toBe(true);
          state = applyMarketEvent(
            state,
            getShockEvent(state),
            'shock',
            '2026-01-02T00:01:00.000Z'
          );
        }

        if (round < 4) state = advanceToNextInvestmentRound(state);
      }

      expect(state.eventHistory.filter((entry) => entry.phase === 'normal')).toHaveLength(4);
      expect(state.eventHistory.filter((entry) => entry.phase === 'shock')).toHaveLength(1);
      expect(state.assets.every((asset) => asset.price > 0)).toBe(true);
    });
  });

  it('uses reasoning, diversification, risk, and adaptability in the final score', () => {
    const initial = createInitialGameState(settings, 'order');
    const withDecision = executeOrder(initial, {
      teamId: 'team-a',
      assetId: 'mirai-bank',
      side: 'buy',
      quantity: 20,
      reason: '金利上昇ニュースで銀行の利益拡大が見込めるため、分散を保ちながら買う'
    });
    const evaluations = evaluateTeams(
      withDecision.teams,
      withDecision.assets,
      withDecision.eventHistory
    );
    const teamA = evaluations.find((item) => item.team.id === 'team-a')!;
    const teamB = evaluations.find((item) => item.team.id === 'team-b')!;

    expect(teamA.totalAssets).toBe(teamB.totalAssets);
    expect(teamA.scores.reasoning).toBeGreaterThan(teamB.scores.reasoning);
    expect(teamA.scores.diversification).toBeGreaterThan(teamB.scores.diversification);
    expect(teamA.overallScore).toBeGreaterThan(teamB.overallScore);
    evaluations.forEach((evaluation) => {
      expect(evaluation.overallScore).toBeGreaterThanOrEqual(0);
      expect(evaluation.overallScore).toBeLessThanOrEqual(100);
      Object.values(evaluation.scores).forEach((score) => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });
});
