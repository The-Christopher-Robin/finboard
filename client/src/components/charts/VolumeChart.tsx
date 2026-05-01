import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import type { PricePoint } from '../../types';

interface Props {
  data: PricePoint[];
  height?: number;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function VolumeChart({ data, height = 150 }: Props) {
  if (!data.length) return null;

  return (
    <div className="chart-container" aria-label="Volume chart">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatDate}
            stroke="var(--text-muted)"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={11}
            tickLine={false}
            width={55}
            tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
            }}
            labelFormatter={formatDate}
            formatter={(val: number) => [val.toLocaleString(), 'Volume']}
          />
          <Bar dataKey="volume" radius={[2, 2, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.close >= entry.open ? '#10b981' : '#ef4444'}
                fillOpacity={0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
