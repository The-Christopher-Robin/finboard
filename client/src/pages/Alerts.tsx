import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchAlerts, addAlert, removeAlert } from '../store/alertsSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Alerts() {
  const dispatch = useAppDispatch();
  const { alerts, loading } = useAppSelector((state) => state.alerts);
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  const handleCreate = () => {
    const sym = symbol.trim().toUpperCase();
    const target = parseFloat(price);
    if (!sym || isNaN(target) || target <= 0) return;
    dispatch(addAlert({ symbol: sym, targetPrice: target, direction }));
    setSymbol('');
    setPrice('');
  };

  if (loading && !alerts.length) return <LoadingSpinner />;

  return (
    <section aria-label="Price alerts">
      <h1 className="page-title" style={{ marginBottom: 24 }}>Price Alerts</h1>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 className="card-title" style={{ marginBottom: 12 }}>Create Alert</h2>
        <div className="trade-form">
          <div className="form-group">
            <label htmlFor="alert-symbol">Symbol</label>
            <input
              id="alert-symbol"
              className="form-input"
              placeholder="AAPL"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              style={{ width: 120 }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="alert-price">Target Price</label>
            <input
              id="alert-price"
              type="number"
              className="form-input"
              placeholder="150.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              style={{ width: 120 }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="alert-dir">Direction</label>
            <select
              id="alert-dir"
              className="form-select"
              value={direction}
              onChange={(e) => setDirection(e.target.value as 'above' | 'below')}
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>

      <div className="card" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Symbol</th>
              <th>Direction</th>
              <th className="num">Target Price</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.id} style={a.triggered ? { background: 'var(--accent-green-dim)' } : undefined}>
                <td>
                  <div className="alert-status">
                    <span className={`alert-dot ${a.triggered ? 'triggered' : 'watching'}`} />
                    {a.triggered ? (
                      <span className="badge badge-green">Triggered</span>
                    ) : (
                      <span className="badge badge-yellow">Watching</span>
                    )}
                  </div>
                </td>
                <td style={{ fontWeight: 700 }}>{a.symbol}</td>
                <td className="text-secondary" style={{ textTransform: 'capitalize' }}>
                  {a.direction}
                </td>
                <td className="num">${a.target_price.toFixed(2)}</td>
                <td className="text-muted">
                  {new Date(a.created_at).toLocaleDateString()}
                </td>
                <td>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => dispatch(removeAlert(a.id))}
                    aria-label={`Delete alert for ${a.symbol}`}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {alerts.length === 0 && (
          <p className="text-muted" style={{ padding: 24, textAlign: 'center' }}>
            No alerts yet. Create one above.
          </p>
        )}
      </div>
    </section>
  );
}
