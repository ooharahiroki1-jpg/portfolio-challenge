import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCompactCurrency } from '../../lib/formatters';
import { findAsset } from '../../lib/portfolio';
import type { Asset, Team } from '../../types';

export function PortfolioDonutChart({
  team,
  assets
}: {
  team: Team;
  assets: Asset[];
}) {
  const data = [
    {
      name: '現金',
      value: team.cash,
      color: '#E2E8F0'
    },
    ...team.holdings.map((holding) => {
      const asset = findAsset(assets, holding.assetId);
      return {
        name: asset.name,
        value: holding.quantity * asset.price,
        color: asset.color
      };
    })
  ].filter((item) => item.value > 0);

  return (
    <div className="h-full min-h-[320px] rounded-lg border border-white/15 bg-white/8 p-4">
      <div className="mb-2 text-2xl font-black text-white">{team.name} 保有比率</div>
      <ResponsiveContainer width="100%" height="74%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="54%"
            outerRadius="86%"
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCompactCurrency(Number(value))}
            contentStyle={{
              background: '#0F172A',
              border: '1px solid rgba(255,255,255,.2)',
              borderRadius: 8,
              color: '#fff',
              fontSize: 18
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2">
        {data.slice(0, 6).map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-lg text-slate-200">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
