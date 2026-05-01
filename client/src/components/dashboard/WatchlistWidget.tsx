import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchWatchlist } from '../../store/watchlistSlice';
import MiniSparkline from '../charts/MiniSparkline';

export default function WatchlistWidget() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.watchlist);
  const stocks = useAppSelector((state) => state.market.stocks);

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  const enriched = items.slice(0, 6).map((item) => {
    const stock = stocks.find((s) => s.symbol === item.symbol);
    return { ...item, stock };
  });

  // Fake sparkline data from stock prices
  const sparkline = (price: number) =>
    Array.from({ length: 12 }, (_, i) =>
      price * (1 + (Math.sin(i * 0.8) * 0.02) + (Math.random() - 0.5) * 0.01),
    );

  return (
    <div className="card" data-testid="watchlist-widget">
      <div className="card-header">
        <h2 className="card-title">Watchlist</h2>
        <Link to="/watchlist" className="btn btn-ghost btn-sm">View All</Link>
      </div>
      {enriched.length === 0 ? (
        <p className="text-muted">No items in watchlist yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th className="num">Price</th>
              <th className="num">Change</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {enriched.map((item) => {
              const s = item.stock;
              if (!s) return (
                <tr key={item.id}>
                  <td>{item.symbol}</td>
                  <td className="num text-muted">--</td>
                  <td className="num text-muted">--</td>
                  <td></td>
                </tr>
              );
              const isUp = s.change >= 0;
              return (
                <tr key={item.id}>
                  <td>
                    <Link to={`/stock/${s.symbol}`} style={{ fontWeight: 600 }}>
                      {s.symbol}
                    </Link>
                  </td>
                  <td className="num">${s.price.toFixed(2)}</td>
                  <td className={`num ${isUp ? 'positive' : 'negative'}`}>
                    {isUp ? '+' : ''}{s.changePercent.toFixed(2)}%
                  </td>
                  <td>
                    <MiniSparkline data={sparkline(s.price)} positive={isUp} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
