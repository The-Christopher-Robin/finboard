import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchWatchlist, addWatchlistItem, removeWatchlistItem } from '../store/watchlistSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Watchlist() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading } = useAppSelector((state) => state.watchlist);
  const stocks = useAppSelector((state) => state.market.stocks);
  const [symbol, setSymbol] = useState('');

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  const handleAdd = () => {
    const sym = symbol.trim().toUpperCase();
    if (!sym) return;
    dispatch(addWatchlistItem(sym));
    setSymbol('');
  };

  const enriched = items.map((item) => ({
    ...item,
    stock: stocks.find((s) => s.symbol === item.symbol),
  }));

  if (loading && !items.length) return <LoadingSpinner />;

  return (
    <section aria-label="Watchlist">
      <div className="page-header">
        <h1 className="page-title">Watchlist</h1>
        <div className="form-row">
          <input
            className="form-input"
            placeholder="Add symbol (e.g. AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            aria-label="Stock symbol"
            style={{ width: 180 }}
          />
          <button className="btn btn-primary" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>

      <div className="card" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th className="num">Price</th>
              <th className="num">Change</th>
              <th className="num">Change %</th>
              <th className="num">Volume</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {enriched.map((item) => {
              const s = item.stock;
              const isUp = s ? s.change >= 0 : true;
              return (
                <tr
                  key={item.id}
                  className="clickable"
                  onClick={() => navigate(`/stock/${item.symbol}`)}
                >
                  <td style={{ fontWeight: 700 }}>{item.symbol}</td>
                  <td>{s?.name ?? '—'}</td>
                  <td className="num">{s ? `$${s.price.toFixed(2)}` : '—'}</td>
                  <td className={`num ${isUp ? 'positive' : 'negative'}`}>
                    {s ? `${isUp ? '+' : ''}${s.change.toFixed(2)}` : '—'}
                  </td>
                  <td className={`num ${isUp ? 'positive' : 'negative'}`}>
                    {s ? `${isUp ? '+' : ''}${s.changePercent.toFixed(2)}%` : '—'}
                  </td>
                  <td className="num">{s ? s.volume.toLocaleString() : '—'}</td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeWatchlistItem(item.id));
                      }}
                      aria-label={`Remove ${item.symbol} from watchlist`}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {enriched.length === 0 && (
          <p className="text-muted" style={{ padding: 24, textAlign: 'center' }}>
            Your watchlist is empty. Add stocks above to get started.
          </p>
        )}
      </div>
    </section>
  );
}
