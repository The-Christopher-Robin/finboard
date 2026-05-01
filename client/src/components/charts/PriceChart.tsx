import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { PricePoint } from '../../types';

interface Props {
  data: PricePoint[];
  height?: number;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as PricePoint;
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-sm)',
      padding: '10px 14px',
      fontSize: '0.82rem',
    }}>
      <div style={{ marginBottom: 4, color: 'var(--text-muted)' }}>
        {new Date(d.timestamp).toLocaleDateString()}
      </div>
      <div>O: ${d.open.toFixed(2)}  H: ${d.high.toFixed(2)}</div>
      <div>L: ${d.low.toFixed(2)}  C: ${d.close.toFixed(2)}</div>
      <div style={{ color: 'var(--text-muted)', marginTop: 4 }}>
        Vol: {d.volume.toLocaleString()}
      </div>
    </div>
  );
}

export default function PriceChart({ data, height = 300 }: Props) {
  if (!data.length) return null;

  const isUp = data[data.length - 1].close >= data[0].close;
  const color = isUp ? 'var(--accent-green)' : 'var(--accent-red)';
  const fillId = isUp ? 'priceGradientUp' : 'priceGradientDown';

  return (
    <div className="chart-container" aria-label="Price chart">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="priceGradientUp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="priceGradientDown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatDate}
            stroke="var(--text-muted)"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatPrice}
            stroke="var(--text-muted)"
            fontSize={11}
            tickLine={false}
            width={65}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="close"
            stroke={color}
            fill={`url(#${fillId})`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
