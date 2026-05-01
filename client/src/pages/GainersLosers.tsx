import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import MiniSparkline from '../components/charts/MiniSparkline';
import LoadingSpinner from '../components/common/LoadingSpinner';

function fakeSpark(price: number, up: boolean) {
  return Array.from({ length: 12 }, (_, i) => {
    const trend = up ? i * 0.003 : -i * 0.003;
    return price * (1 + trend + (Math.random() - 0.5) * 0.008);
  });
}

export default function GainersLosers() {
  const navigate = useNavigate();
  const { stocks, loading } = useAppSelector((state) => state.market);

  const { gainers, losers } = useMemo(() => {
    const sorted = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
    return {
      gainers: sorted.slice(0, 10),
      losers: sorted.slice(-10).reverse(),
    };
  }, [stocks]);

  if (loading && !stocks.length) return <LoadingSpinner />;

  const renderTable = (list: typeof stocks, type: 'gainers' | 'losers') => (
    <div className="card">
      <h2 className="card-title" style={{ marginBottom: 12 }}>
        {type === 'gainers' ? 'Top Gainers' : 'Top Losers'}
      </h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Symbol</th>
            <th className="num">Price</th>
            <th className="num">Change %</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map((s, i) => {
            const isUp = s.changePercent >= 0;
            return (
              <tr
                key={s.symbol}
                className="clickable"
                onClick={() => navigate(`/stock/${s.symbol}`)}
              >
                <td className="text-muted">{i + 1}</td>
                <td style={{ fontWeight: 700 }}>{s.symbol}</td>
                <td className="num">${s.price.toFixed(2)}</td>
                <td className={`num ${isUp ? 'positive' : 'negative'}`}>
                  {isUp ? '+' : ''}{s.changePercent.toFixed(2)}%
                </td>
                <td>
                  <MiniSparkline data={fakeSpark(s.price, isUp)} positive={isUp} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {list.length === 0 && (
        <p className="text-muted" style={{ padding: 20, textAlign: 'center' }}>No data</p>
      )}
    </div>
  );

  return (
    <section aria-label="Top movers">
      <h1 className="page-title" style={{ marginBottom: 24 }}>Top Movers</h1>
      <div className="movers-grid">
        {renderTable(gainers, 'gainers')}
        {renderTable(losers, 'losers')}
      </div>
    </section>
  );
}
