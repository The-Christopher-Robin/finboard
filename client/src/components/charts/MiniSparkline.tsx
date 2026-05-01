import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface Props {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}

export default function MiniSparkline({
  data,
  width = 80,
  height = 28,
  positive = true,
}: Props) {
  const points = data.map((v, i) => ({ i, v }));
  const color = positive ? '#10b981' : '#ef4444';

  return (
    <div style={{ width, height }} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
