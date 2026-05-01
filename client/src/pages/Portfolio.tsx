import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchPortfolio, fetchPortfolioSummary, trade } from '../store/portfolioSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Portfolio() {
  const dispatch = useAppDispatch();
  const { holdings, summary, loading } = useAppSelector((state) => state.portfolio);
  const stocks = useAppSelector((state) => state.market.stocks);
  const [buySymbol, setBuySymbol] = useState('');
  const [buyShares, setBuyShares] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchPortfolioSummary());
  }, [dispatch]);

  const enriched = holdings.map((h) => {
    const stock = stocks.find((s) => s.symbol === h.symbol);
    const curPrice = stock?.price ?? 0;
    const value = curPrice * h.shares;
    const cost = h.avg_cost * h.shares;
    const gl = value - cost;
    const glPct = cost > 0 ? (gl / cost) * 100 : 0;
    return { ...h, curPrice, value, gl, glPct };
  });

  const handleBuy = async () => {
    const qty = parseInt(buyShares, 10);
    const sym = buySymbol.trim().toUpperCase();
    if (!sym || !qty || qty <= 0) return;
    try {
      await dispatch(trade({ symbol: sym, shares: qty, action: 'buy' })).unwrap();
      setMsg(`Bought ${qty} shares of ${sym}`);
      setBuySymbol('');
      setBuyShares('');
      dispatch(fetchPortfolio());
      dispatch(fetchPortfolioSummary());
    } catch (err: any) {
      setMsg(err.message || 'Trade failed');
    }
  };

  const handleSell = async (symbol: string, shares: number) => {
    try {
      await dispatch(trade({ symbol, shares, action: 'sell' })).unwrap();
      dispatch(fetchPortfolio());
      dispatch(fetchPortfolioSummary());
    } catch (err: any) {
      setMsg(err.message || 'Sell failed');
    }
  };

  if (loading && !holdings.length) return <LoadingSpinner />;

  const isUp = summary ? summary.totalGainLoss >= 0 : true;

  return (
    <section aria-label="Portfolio">
      <h1 className="page-title" style={{ marginBottom: 24 }}>Portfolio</h1>

      {summary && (
        <div className="summary-row">
          <div className="summary-stat">
            <span className="label">Total Value</span>
            <span className="value">${fmt(summary.totalValue)}</span>
          </div>
          <div className="summary-stat">
            <span className="label">Total Cost</span>
            <span className="value">${fmt(summary.totalCost)}</span>
          </div>
          <div className="summary-stat">
            <span className="label">Gain / Loss</span>
            <span className={`value ${isUp ? 'positive' : 'negative'}`}>
              {isUp ? '+' : ''}${fmt(summary.totalGainLoss)}
            </span>
          </div>
          <div className="summary-stat">
            <span className="label">Return</span>
            <span className={`value ${isUp ? 'positive' : 'negative'}`}>
              {isUp ? '+' : ''}{summary.gainLossPercent.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 className="card-title" style={{ marginBottom: 12 }}>Buy Stocks</h2>
        <div className="trade-form">
          <div className="form-group">
            <label htmlFor="buy-symbol">Symbol</label>
            <input
              id="buy-symbol"
              className="form-input"
              placeholder="AAPL"
              value={buySymbol}
              onChange={(e) => setBuySymbol(e.target.value)}
              style={{ width: 120 }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="buy-shares">Shares</label>
            <input
              id="buy-shares"
              type="number"
              className="form-input"
              placeholder="Qty"
              value={buyShares}
              onChange={(e) => setBuyShares(e.target.value)}
              min={1}
              style={{ width: 100 }}
            />
          </div>
          <button className="btn btn-success" onClick={handleBuy}>
            Buy
          </button>
        </div>
        {msg && <p className="text-secondary" style={{ marginTop: 10, fontSize: '0.85rem' }}>{msg}</p>}
      </div>

      <div className="card" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th className="num">Shares</th>
              <th className="num">Avg Cost</th>
              <th className="num">Current</th>
              <th className="num">Value</th>
              <th className="num">Gain/Loss</th>
              <th className="num">Return</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {enriched.map((h) => {
              const up = h.gl >= 0;
              return (
                <tr key={h.id}>
                  <td style={{ fontWeight: 700 }}>{h.symbol}</td>
                  <td className="num">{h.shares}</td>
                  <td className="num">${h.avg_cost.toFixed(2)}</td>
                  <td className="num">${h.curPrice.toFixed(2)}</td>
                  <td className="num">${fmt(h.value)}</td>
                  <td className={`num ${up ? 'positive' : 'negative'}`}>
                    {up ? '+' : ''}${fmt(h.gl)}
                  </td>
                  <td className={`num ${up ? 'positive' : 'negative'}`}>
                    {up ? '+' : ''}{h.glPct.toFixed(2)}%
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleSell(h.symbol, h.shares)}
                    >
                      Sell All
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {enriched.length === 0 && (
          <p className="text-muted" style={{ padding: 24, textAlign: 'center' }}>
            No holdings. Use the form above to buy stocks.
          </p>
        )}
      </div>
    </section>
  );
}
