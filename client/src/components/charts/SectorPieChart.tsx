import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import type { SectorData } from '../../types';

interface Props {
  data: SectorData[];
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
  '#84cc16', '#e11d48',
];

export default function SectorPieChart({ data }: Props) {
  const chartData = data.map((s) => ({
    name: s.sector,
    value: s.totalMarketCap,
  }));

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="chart-container" aria-label="Sector distribution chart">
      <ResponsiveContainer width="100%" height={360}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
            label={({ name, value }) =>
              `${name} ${((value / total) * 100).toFixed(1)}%`
            }
            labelLine={{ stroke: 'var(--text-muted)' }}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
            }}
            formatter={(val: number) => [
              `$${(val / 1e9).toFixed(1)}B`,
              'Market Cap',
            ]}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
