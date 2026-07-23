import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import type { Team } from '../../types';
import { formatCompactCurrency } from '../../lib/formatters';

export function AssetTrendChart({ teams }: { teams: Team[] }) {
  const maxLength = Math.max(...teams.map((team) => team.assetHistory.length), 1);
  const data = Array.from({ length: maxLength }, (_, index) => {
    const row: Record<string, string | number | null> = {
      name: index === 0 ? '開始' : `${index}`
    };
    teams.forEach((team) => {
      row[team.name] = team.assetHistory[index]?.totalAssets ?? null;
    });
    return row;
  });

  return (
    <div className="h-full min-h-[280px] rounded-lg border border-sky-100 bg-white p-4 shadow-sm">
      <div className="mb-2 text-3xl font-black text-slate-950">全チーム資産推移</div>
      <ResponsiveContainer width="100%" height="88%">
        <LineChart data={data} margin={{ top: 12, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(14,165,233,.18)" vertical={false} />
          <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 20, fontWeight: 800 }} />
          <YAxis
            stroke="#64748B"
            tick={{ fontSize: 20, fontWeight: 800 }}
            tickFormatter={(value) => `${Math.round(Number(value) / 10000)}万`}
          />
          <Tooltip
            formatter={(value) => formatCompactCurrency(Number(value))}
            contentStyle={{
              background: '#FFFFFF',
              border: '1px solid rgba(14,165,233,.24)',
              borderRadius: 8,
              color: '#020617',
              fontSize: 20,
              fontWeight: 800
            }}
          />
          <Legend wrapperStyle={{ fontSize: 20, fontWeight: 800 }} />
          {teams.map((team) => (
            <Line
              key={team.id}
              type="monotone"
              dataKey={team.name}
              stroke={team.color}
              strokeWidth={4}
              dot={{ r: 4 }}
              activeDot={{ r: 7 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
