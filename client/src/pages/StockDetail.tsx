import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchStockDetail, setPriceHistory } from '../store/marketSlice';
import { addWatchlistItem } from '../store/watchlistSlice';
import { trade } from '../store/portfolioSlice';
import { getStockHistory } from '../services/api';
import PriceChart from '../components/charts/PriceChart';
import VolumeChart from '../components/charts/VolumeChart';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RANGES = ['7d', '30d', '90d'] as const;

function fmtCap(v: number) {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  return `$${(v / 1e6).toFixed(0)}M`;
}

export default function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const dispatch = useAppDispatch();
  const { selectedStock, priceHistory, loading } = useAppSelector((state) => state.market);
  const [range, setRange] = useState<string>('30d');
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const [shares, setShares] = useState('');
  const [tradeMsg, setTradeMsg] = useState('');

  useEffect(() => {
    if (symbol) dispatch(fetchStockDetail(symbol));
  }, [symbol, dispatch]);

  const handleRangeChange = async (r: string) => {
    setRange(r);
    if (symbol) {
      const history = await getStockHistory(symbol, r);
      dispatch(setPriceHistory(history));
    }
  };

  const handleTrade = async () => {
    const qty = parseInt(shares, 10);
    if (!symbol || !qty || qty <= 0) return;
    try {
      await dispatch(trade({ symbol, shares: qty, action: tradeAction })).unwrap();
      setTradeMsg(`${tradeAction === 'buy' ? 'Bought' : 'Sold'} ${qty} shares of ${symbol}`);
      setShares('');
    } catch (err: any) {
      setTradeMsg(err.message || 'Trade failed');
    }
  };

  const handleAddWatchlist = () => {
    if (symbol) dispatch(addWatchlistItem(symbol));
  };

  if (loading && !selectedStock) return <LoadingSpinner />;
  if (!selectedStock) {
    return <p className="text-muted" style={{ padding: 48, textAlign: 'center' }}>Stock not found.</p>;
  }

  const s = selectedStock;
  const isUp = s.change >= 0;

  return (
    <section aria-label={`${s.symbol} stock details`}>
      <div className="stock-hero">
        <span className="stock-symbol">{s.symbol}</span>
        <span className="stock-name">{s.name}</span>
        <span className="stock-price">${s.price.toFixed(2)}</span>
        <span className={`stock-change ${isUp ? 'positive' : 'negative'}`}>
          {isUp ? '+' : ''}{s.change.toFixed(2)} ({isUp ? '+' : ''}{s.changePercent.toFixed(2)}%)
        </span>
        <button className="btn btn-ghost btn-sm" onClick={handleAddWatchlist}>
          ★ Watch
        </button>
      </div>

      <div className="stats-grid">
        {[
          ['Open', `$${s.open.toFixed(2)}`],
          ['High', `$${s.high.toFixed(2)}`],
          ['Low', `$${s.low.toFixed(2)}`],
          ['Prev Close', `$${s.previousClose.toFixed(2)}`],
          ['Volume', s.volume.toLocaleString()],
          ['Market Cap', fmtCap(s.marketCap)],
          ['Sector', s.sector],
        ].map(([label, value]) => (
          <div className="stat-item" key={label}>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h2 className="card-title">Price History</h2>
          <div className="chart-range-selector">
            {RANGES.map((r) => (
              <button
                key={r}
                className={`chart-range-btn ${range === r ? 'active' : ''}`}
                onClick={() => handleRangeChange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <PriceChart data={priceHistory} />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 className="card-title" style={{ marginBottom: 12 }}>Volume</h2>
        <VolumeChart data={priceHistory} />
      </div>

      <div className="card">
        <h2 className="card-title" style={{ marginBottom: 12 }}>Quick Trade</h2>
        <div className="trade-form">
          <div className="form-group">
            <label htmlFor="trade-action">Action</label>
            <select
              id="trade-action"
              className="form-select"
              value={tradeAction}
              onChange={(e) => setTradeAction(e.target.value as 'buy' | 'sell')}
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="trade-shares">Shares</label>
            <input
              id="trade-shares"
              type="number"
              className="form-input"
              placeholder="Qty"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              min={1}
              style={{ width: 100 }}
            />
          </div>
          <button
            className={`btn ${tradeAction === 'buy' ? 'btn-success' : 'btn-danger'}`}
            onClick={handleTrade}
            disabled={!shares || parseInt(shares) <= 0}
          >
            {tradeAction === 'buy' ? 'Buy' : 'Sell'}
          </button>
        </div>
        {tradeMsg && (
          <p style={{ marginTop: 12, fontSize: '0.85rem' }} className="text-secondary">
            {tradeMsg}
          </p>
        )}
      </div>
    </section>
  );
}
