import type { Team } from '../types';

export const INITIAL_CAPITAL = 1_000_000;

export const baseTeams: Omit<Team, 'cash' | 'holdings' | 'orders' | 'assetHistory'>[] = [
  {
    id: 'team-a',
    name: 'チームA',
    color: '#38BDF8',
    strategy: 'バランス重視',
    notes: ''
  },
  {
    id: 'team-b',
    name: 'チームB',
    color: '#22C55E',
    strategy: '成長重視',
    notes: ''
  },
  {
    id: 'team-c',
    name: 'チームC',
    color: '#FACC15',
    strategy: '守り重視',
    notes: ''
  },
  {
    id: 'team-d',
    name: 'チームD',
    color: '#EF4444',
    strategy: '逆張り重視',
    notes: ''
  },
  {
    id: 'team-e',
    name: 'チームE',
    color: '#A855F7',
    strategy: 'テーマ重視',
    notes: ''
  },
  {
    id: 'team-f',
    name: 'チームF',
    color: '#F97316',
    strategy: '分散重視',
    notes: ''
  }
];
